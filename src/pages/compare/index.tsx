import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { photos } from '@/data/photos'
import { treatments } from '@/data/treatments'
import CompareSlider from '@/components/CompareSlider'
import PhotoTimeline from '@/components/PhotoTimeline'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const ComparePage = () => {
  const treatmentIds = [...new Set(photos.map(p => p.treatmentId))]
  const treatmentOptions = treatments.filter(t => treatmentIds.includes(t.id))
  const [selectedTreatment, setSelectedTreatment] = useState(treatmentOptions[0]?.id || '')

  const treatmentPhotos = useMemo(() => {
    return photos
      .filter(p => p.treatmentId === selectedTreatment)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [selectedTreatment])

  const comparePair = useMemo(() => {
    if (treatmentPhotos.length < 2) return null
    return {
      before: treatmentPhotos[0],
      after: treatmentPhotos[treatmentPhotos.length - 1]
    }
  }, [treatmentPhotos])

  const handleShare = () => {
    Taro.showModal({
      title: '隐私授权确认',
      content: '生成分享图前，请确认您同意将照片用于分享。系统将仅展示您同意公开的照片，私密照片不会被包含。',
      confirmText: '同意生成',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          console.info('[Compare] share authorized')
          Taro.showToast({ title: '分享图已生成', icon: 'success' })
        }
      }
    })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>效果对比</Text>
        <Text className={styles.subtitle}>看见每一份变化</Text>
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
          </View>
        </View>
      )}

      <View className={styles.timelineSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>恢复时间线</Text>
          <View className={styles.shareBtn} onClick={handleShare}>
            <Text className={styles.shareBtnText}>生成分享图</Text>
          </View>
        </View>
        {treatmentPhotos.length > 0 ? (
          <PhotoTimeline photos={treatmentPhotos} />
        ) : (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>暂无照片记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ComparePage
