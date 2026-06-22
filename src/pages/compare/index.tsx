import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import { treatments } from '@/data/treatments'
import { useAppStore } from '@/store/index'
import {
  ShareTemplate, ShareTarget, ShareTargetLabels
} from '@/types/index'
import CompareSlider from '@/components/CompareSlider'
import PhotoTimeline from '@/components/PhotoTimeline'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const templateLabels: Record<ShareTemplate, string> = {
  compare: '前后对比',
  timeline: '完整时间线',
  summary: '仅变化摘要'
}

const targetIcons: Record<ShareTarget, string> = {
  self: '🙋',
  doctor: '👩‍⚕️',
  family: '👨‍👩‍👧'
}

const isExpired = (createdAt: string, days: number) => {
  const created = new Date(createdAt.replace(/-/g, '/')).getTime()
  const now = Date.now()
  return now - created > days * 24 * 60 * 60 * 1000
}

const expireOn = (createdAt: string, days: number) => {
  const created = new Date(createdAt.replace(/-/g, '/')).getTime()
  const d = new Date(created + days * 24 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const ComparePage = () => {
  const photos = useAppStore(s => s.photos)
  const shareAuth = useAppStore(s => s.shareAuth)
  const role = useAppStore(s => s.role)
  const shareRecords = useAppStore(s => s.shareRecords)
  const doctorVisible = useAppStore(s => s.doctorVisible)

  const treatmentIds = useMemo(() => [...new Set(photos.map(p => p.treatmentId))], [photos])
  const treatmentOptions = treatments.filter(t => treatmentIds.includes(t.id))
  const [selectedTreatment, setSelectedTreatment] = useState(treatmentOptions[0]?.id || '')

  const treatmentPhotos = useMemo(() => {
    let list = photos.filter(p => p.treatmentId === selectedTreatment)
    if (role === 'doctor') {
      if (!doctorVisible) {
        list = []
      } else {
        list = list.filter(p => !p.isPrivate && p.visibleToDoctor)
      }
    }
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [selectedTreatment, photos, role, doctorVisible])

  const comparePair = useMemo(() => {
    if (treatmentPhotos.length < 2) return null
    return {
      before: treatmentPhotos[0],
      after: treatmentPhotos[treatmentPhotos.length - 1]
    }
  }, [treatmentPhotos])

  const lastShare = useMemo(() => {
    return shareRecords.find(s => s.treatmentId === selectedTreatment)
  }, [shareRecords, selectedTreatment])

  const goSharePreview = (template: ShareTemplate, authorized: boolean) => {
    const authParam = authorized ? '&authorized=1' : ''
    Taro.navigateTo({
      url: `/pages/sharePreview/index?treatmentId=${selectedTreatment}&template=${template}${authParam}`
    })
  }

  const handleShare = () => {
    const requestAuth = shareAuth
    const proceed = (authorized: boolean) => {
      Taro.showActionSheet({
        itemList: ['前后对比图', '完整时间线', '仅变化摘要'],
        success: (res) => {
          const templates: ShareTemplate[] = ['compare', 'timeline', 'summary']
          goSharePreview(templates[res.tapIndex], authorized)
        }
      })
    }

    if (requestAuth) {
      Taro.showModal({
        title: '隐私授权确认',
        content: '生成分享图前，请确认您同意将照片用于分享。系统将仅展示您同意公开的照片，私密照片不会被包含。',
        confirmText: '同意生成',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            console.info('[Compare] share authorized')
            proceed(true)
          }
        }
      })
      return
    }
    proceed(false)
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.headerTitleRow}>
          <Text className={styles.title}>效果对比</Text>
          {role === 'doctor' && (
            <View className={styles.doctorBadge}>
              <Text className={styles.doctorBadgeText}>👩‍⚕️ 医生视角</Text>
            </View>
          )}
        </View>
        <Text className={styles.subtitle}>
          {role === 'doctor' ? (doctorVisible ? '仅展示授权可见的照片' : '顾客已关闭对医生的可见性') : '看见每一份变化'}
        </Text>
      </View>

      <View className={styles.treatmentFilter}>
        <ScrollView className={styles.treatmentScroll} scrollX>
          {treatmentOptions.map(t => (
            <View
              key={t.id}
              className={classnames(styles.treatmentTab, selectedTreatment === t.id && styles.active)}
              onClick={() => setSelectedTreatment(t.id)}
            >
              <Text className={styles.treatmentTabText}>{t.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {comparePair && (
        <View className={styles.compareSection}>
          <View className={styles.compareHeader}>
            <Text className={styles.compareTitle}>前后对比</Text>
            <Text className={styles.compareHint}>左右滑动查看</Text>
          </View>
          <CompareSlider beforePhoto={comparePair.before} afterPhoto={comparePair.after} />

          <View className={styles.summaryCard}>
            <Text className={styles.summaryTitle}>变化摘要</Text>
            <View className={styles.summaryItem}>
              <View className={styles.summaryDot} />
              <Text className={styles.summaryText}>治疗周期：{comparePair.before.date} 至 {comparePair.after.date}</Text>
            </View>
            <View className={styles.summaryItem}>
              <View className={styles.summaryDot} />
              <Text className={styles.summaryText}>已完成 {treatmentPhotos.length} 次拍照记录</Text>
            </View>
            <View className={styles.summaryItem}>
              <View className={styles.summaryDot} />
              <Text className={styles.summaryText}>最新感受：{comparePair.after.feeling}</Text>
            </View>
            {role === 'customer' && treatmentPhotos.some(p => p.isPrivate) && (
              <View className={styles.summaryItem}>
                <View className={styles.summaryDot} />
                <Text className={styles.summaryText}>
                  其中 {treatmentPhotos.filter(p => p.isPrivate).length} 张设为私密，分享时不会显示
                </Text>
              </View>
            )}
            {role === 'doctor' && doctorVisible && (
              <View className={styles.summaryItem}>
                <View className={styles.summaryDot} />
                <Text className={styles.summaryText}>
                  顾客已授权 {treatmentPhotos.length} 张照片供您查看
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {role === 'customer' && lastShare && (
        <View className={styles.shareRecordCard}>
          <View className={styles.shareRecordHeader}>
            <Text className={styles.shareRecordTitle}>📤 最近分享</Text>
            <Text className={styles.shareRecordTime}>{lastShare.createdAt}</Text>
          </View>
          <View className={styles.shareRecordBody}>
            <View className={styles.shareRecordInfo}>
              <Text className={styles.shareRecordLabel}>对象</Text>
              <Text className={styles.shareRecordValue}>
                {targetIcons[lastShare.target]} {ShareTargetLabels[lastShare.target]}
              </Text>
            </View>
            <View className={styles.shareRecordInfo}>
              <Text className={styles.shareRecordLabel}>模板</Text>
              <Text className={styles.shareRecordValue}>{templateLabels[lastShare.template]}</Text>
            </View>
            <View className={styles.shareRecordInfo}>
              <Text className={styles.shareRecordLabel}>照片数</Text>
              <Text className={styles.shareRecordValue}>{lastShare.photoCount} 张</Text>
            </View>
            <View className={styles.shareRecordInfo}>
              <Text className={styles.shareRecordLabel}>有效期</Text>
              <Text className={classnames(
                styles.shareRecordValue,
                isExpired(lastShare.createdAt, lastShare.validDays) && styles.expired
              )}>
                {lastShare.validDays} 天有效
              </Text>
            </View>
            <View className={styles.shareRecordInfo}>
              <Text className={styles.shareRecordLabel}>状态</Text>
              {isExpired(lastShare.createdAt, lastShare.validDays) ? (
                <Text className={classnames(styles.shareRecordValue, styles.expired)}>
                  ⨯ 已过期（{expireOn(lastShare.createdAt, lastShare.validDays)}）
                </Text>
              ) : (
                <Text className={classnames(styles.shareRecordValue, styles.active)}>
                  ✓ 有效（至 {expireOn(lastShare.createdAt, lastShare.validDays)}）
                </Text>
              )}
            </View>
            {lastShare.authorized && (
              <View className={styles.shareRecordInfo}>
                <Text className={styles.shareRecordLabel}>授权</Text>
                <Text className={classnames(styles.shareRecordValue, styles.authFlag)}>
                  ✓ 本次已确认授权
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View className={styles.timelineSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>恢复时间线</Text>
          {role === 'customer' && (
            <View className={styles.shareBtn} onClick={handleShare}>
              <Text className={styles.shareBtnText}>生成分享图</Text>
            </View>
          )}
        </View>
        {treatmentPhotos.length > 0 ? (
          <PhotoTimeline photos={treatmentPhotos} />
        ) : (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>
              {role === 'doctor'
                ? (doctorVisible ? '暂无授权可见的照片' : '顾客已关闭对医生的可见性')
                : '暂无照片记录'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ComparePage
