import React, { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { treatments } from '@/data/treatments'
import { useAppStore } from '@/store/index'
import {
  ShareTemplate, ShareTarget, ShareValidDays, ShareTargetLabels
} from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const templateLabels: Record<ShareTemplate, string> = {
  compare: '前后对比',
  timeline: '完整时间线',
  summary: '仅摘要'
}

const validDaysOptions: ShareValidDays[] = [7, 30]
const targetOptions: ShareTarget[] = ['self', 'doctor', 'family']
const targetIcons: Record<ShareTarget, string> = {
  self: '🙋',
  doctor: '👩‍⚕️',
  family: '👨‍👩‍👧'
}

const SharePreviewPage = () => {
  const router = useRouter()
  const treatmentId = router.params.treatmentId || ''
  const templateParam = (router.params.template as ShareTemplate) || 'compare'
  const authorizedParam = router.params.authorized === '1'
  const photos = useAppStore(s => s.photos)
  const addShareRecord = useAppStore(s => s.addShareRecord)
  const treatment = treatments.find(t => t.id === treatmentId)

  const [template, setTemplate] = useState<ShareTemplate>(templateParam)
  const [target, setTarget] = useState<ShareTarget>('self')
  const [validDays, setValidDays] = useState<ShareValidDays>(7)

  const publicPhotos = useMemo(() => {
    return photos
      .filter(p => p.treatmentId === treatmentId && !p.isPrivate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [treatmentId, photos])

  const totalCount = photos.filter(p => p.treatmentId === treatmentId).length
  const privateCount = totalCount - publicPhotos.length

  const comparePair = useMemo(() => {
    if (publicPhotos.length < 2) return null
    return {
      before: publicPhotos[0],
      after: publicPhotos[publicPhotos.length - 1]
    }
  }, [publicPhotos])

  const summaryText = useMemo(() => {
    if (publicPhotos.length === 0) return '暂无公开照片'
    const start = publicPhotos[0].date
    const end = publicPhotos[publicPhotos.length - 1].date
    const feeling = comparePair?.after.feeling || '—'
    return `${treatment?.name || '疗程'}：${start} 至 ${end}，共 ${publicPhotos.length} 次记录，最新感受：${feeling}`
  }, [publicPhotos, comparePair, treatment])

  const handleCancel = () => {
    Taro.navigateBack()
  }

  const handleSave = () => {
    const previewImg = template === 'summary'
      ? ''
      : (comparePair?.after.imageUrl || publicPhotos[0]?.imageUrl || '')
    addShareRecord({
      treatmentId,
      treatmentName: treatment?.name || '',
      template,
      previewImage: previewImg,
      summary: summaryText,
      photoCount: publicPhotos.length,
      target,
      validDays,
      authorized: authorizedParam
    })
    console.info('[SharePreview] saved share record', {
      template, target, validDays, authorized: authorizedParam, count: publicPhotos.length
    })
    Taro.showToast({ title: '已保存分享图', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 800)
  }

  if (publicPhotos.length === 0 && template !== 'summary') {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className={styles.templateTabs}>
          {(Object.keys(templateLabels) as ShareTemplate[]).map(t => (
            <View
              key={t}
              className={classnames(styles.templateTab, template === t && styles.active)}
              onClick={() => setTemplate(t)}
            >
              <Text className={styles.templateTabText}>{templateLabels[t]}</Text>
            </View>
          ))}
        </View>

        <View className={styles.emptyCard}>
          <Text className={styles.emptyIcon}>🔒</Text>
          <Text className={styles.emptyTitle}>暂无可分享内容</Text>
          <Text className={styles.emptyDesc}>
            该疗程下的所有照片均已设为仅自己可见。{'\n'}
            如需生成带图分享，请在隐私设置中将部分照片改为公开。
          </Text>
        </View>
        <View className={styles.bottomBar}>
          <View className={classnames(styles.actionBtn, styles.ghost)} onClick={handleCancel}>
            <Text className={styles.actionBtnText}>返回</Text>
          </View>
          <View
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={() => Taro.navigateTo({ url: '/pages/privacy/index' })}
          >
            <Text className={styles.actionBtnText}>去调整隐私</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.templateTabs}>
        {(Object.keys(templateLabels) as ShareTemplate[]).map(t => (
          <View
            key={t}
            className={classnames(styles.templateTab, template === t && styles.active)}
            onClick={() => setTemplate(t)}
          >
            <Text className={styles.templateTabText}>{templateLabels[t]}</Text>
          </View>
        ))}
      </View>

      <View className={styles.previewCard}>
        <View className={styles.previewHeader}>
          <Text className={styles.previewTitle}>我的美丽日记</Text>
          <Text className={styles.previewLogo}>· 美丽成长册 ·</Text>
        </View>
        <Text className={styles.previewSubTitle}>{treatment?.name || '疗程恢复记录'}</Text>

        {authorizedParam && (
          <View className={styles.authTag}>
            <Text className={styles.authTagText}>✓ 本次已授权生成</Text>
          </View>
        )}

        {privateCount > 0 && template !== 'summary' && (
          <View className={styles.privacyHint}>
            <Text className={styles.privacyIcon}>🔒</Text>
            <Text className={styles.privacyText}>
              已为您排除 {privateCount} 张私密照片，仅展示允许公开的 {publicPhotos.length} 张
            </Text>
          </View>
        )}

        {template === 'compare' && comparePair && (
          <View className={styles.compareRow}>
            <View className={styles.compareImgWrap}>
              <Image className={styles.compareImg} src={comparePair.before.imageUrl} mode='aspectFill' />
              <View className={classnames(styles.compareImgLabel, styles.before)}>
                <Text className={styles.compareImgLabelText}>治疗前</Text>
              </View>
              <View className={styles.compareImgDate}>
                <Text className={styles.compareImgDateText}>{comparePair.before.date}</Text>
              </View>
            </View>
            <View className={styles.compareImgWrap}>
              <Image className={styles.compareImg} src={comparePair.after.imageUrl} mode='aspectFill' />
              <View className={classnames(styles.compareImgLabel, styles.after)}>
                <Text className={styles.compareImgLabelText}>治疗后</Text>
              </View>
              <View className={styles.compareImgDate}>
                <Text className={styles.compareImgDateText}>{comparePair.after.date}</Text>
              </View>
            </View>
          </View>
        )}

        {template === 'timeline' && (
          <View className={styles.timelineSection}>
            <Text className={styles.timelineTitle}>📷 恢复记录</Text>
            <View className={styles.timelineGrid}>
              {publicPhotos.map(p => (
                <View key={p.id} className={styles.timelineGridItem}>
                  <Image className={styles.timelineGridImg} src={p.imageUrl} mode='aspectFill' />
                  <View className={styles.timelineGridDate}>
                    <Text className={styles.timelineGridDateText}>{p.date.slice(5)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {template === 'summary' && (
          <View className={styles.summaryOnlyCard}>
            <Text className={styles.summaryOnlyTitle}>✨ 变化摘要</Text>
            <Text className={styles.summaryOnlyDesc}>
              {treatment?.name || '疗程'}恢复记录
            </Text>
            <View className={styles.summaryOnlyBig}>
              <Text className={styles.summaryBigNum}>{publicPhotos.length}</Text>
              <Text className={styles.summaryBigLabel}>次记录</Text>
            </View>
          </View>
        )}

        <View className={styles.summarySection}>
          <Text className={styles.summaryTitle}>变化摘要</Text>
          <View className={styles.summaryItem}>
            <View className={styles.summaryDot} />
            <Text className={styles.summaryText}>
              治疗周期：{publicPhotos[0]?.date || '—'} 至 {publicPhotos[publicPhotos.length - 1]?.date || '—'}
            </Text>
          </View>
          <View className={styles.summaryItem}>
            <View className={styles.summaryDot} />
            <Text className={styles.summaryText}>共完成 {publicPhotos.length} 次公开打卡记录</Text>
          </View>
          {comparePair && (
            <View className={styles.summaryItem}>
              <View className={styles.summaryDot} />
              <Text className={styles.summaryText}>最新感受：{comparePair.after.feeling}</Text>
            </View>
          )}
          <View className={styles.summaryItem}>
            <View className={styles.summaryDot} />
            <Text className={styles.summaryText}>主治医师：{treatment?.doctorName || '专属医生'}</Text>
          </View>
        </View>

        <View className={styles.footerBrand}>
          <Text className={styles.footerBrandText}>美丽成长册 · 记录每一次蜕变</Text>
          <Text className={styles.footerBrandSub}>图片仅包含已授权公开内容</Text>
        </View>
      </View>

      <View className={styles.optionsSection}>
        <Text className={styles.optionsTitle}>分享设置</Text>

        <View className={styles.optionRow}>
          <Text className={styles.optionLabel}>发送对象</Text>
          <View className={styles.chipGroup}>
            {targetOptions.map(t => (
              <View
                key={t}
                className={classnames(styles.chip, target === t && styles.active)}
                onClick={() => setTarget(t)}
              >
                <Text className={styles.chipIcon}>{targetIcons[t]}</Text>
                <Text className={styles.chipText}>{ShareTargetLabels[t]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.optionRow}>
          <Text className={styles.optionLabel}>有效期</Text>
          <View className={styles.chipGroup}>
            {validDaysOptions.map(d => (
              <View
                key={d}
                className={classnames(styles.chip, validDays === d && styles.active)}
                onClick={() => setValidDays(d)}
              >
                <Text className={styles.chipText}>{d} 天有效</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={classnames(styles.actionBtn, styles.ghost)} onClick={handleCancel}>
          <Text className={styles.actionBtnText}>取消</Text>
        </View>
        <View className={classnames(styles.actionBtn, styles.primary)} onClick={handleSave}>
          <Text className={styles.actionBtnText}>确认保存</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default SharePreviewPage
