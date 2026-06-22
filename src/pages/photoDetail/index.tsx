import React, { useState, useMemo } from 'react'
import { View, Text, Image, Input } from '@tarojs/components'
import { useAppStore } from '@/store/index'
import { useRouter } from '@tarojs/taro'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const feelingLabels = ['很差', '较差', '一般', '良好', '很好']

const PhotoDetailPage = () => {
  const router = useRouter()
  const photoId = router.params.id || ''
  const photos = useAppStore(s => s.photos)
  const setPhotoPrivate = useAppStore(s => s.setPhotoPrivate)
  const updatePhoto = useAppStore(s => s.updatePhoto)
  const addAnnotation = useAppStore(s => s.addAnnotation)

  const photo = useMemo(() => photos.find(p => p.id === photoId), [photos, photoId])

  const [showAnnotateModal, setShowAnnotateModal] = useState(false)
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null)
  const [annotationText, setAnnotationText] = useState('')

  if (!photo) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '120rpx 0', display: 'flex', justifyContent: 'center' }}>
          <Text style={{ color: '#9B8B98' }}>照片不存在</Text>
        </View>
      </View>
    )
  }

  const handleImageTouch = (e) => {
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect ? null : null
    if (touch && touch.clientX !== undefined) {
      const target = e.currentTarget
      const rectInfo = (e.currentTarget as any).getBoundingClientRect ?
        (e.currentTarget as any).getBoundingClientRect() : { left: 0, top: 0, width: 343, height: 250 }
      const x = ((touch.clientX - rectInfo.left) / rectInfo.width) * 100
      const y = ((touch.clientY - rectInfo.top) / rectInfo.height) * 100
      setPendingPoint({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) })
      setAnnotationText('')
      setShowAnnotateModal(true)
      console.info('[PhotoDetail] annotate at', { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) })
    }
  }

  const handleConfirmAnnotation = () => {
    if (!pendingPoint) return
    if (!annotationText.trim()) {
      Taro.showToast({ title: '请输入备注内容', icon: 'none' })
      return
    }
    addAnnotation(photo.id, {
      x: pendingPoint.x,
      y: pendingPoint.y,
      radius: 8,
      note: annotationText.trim()
    })
    setShowAnnotateModal(false)
    setPendingPoint(null)
    setAnnotationText('')
    Taro.showToast({ title: '已添加备注', icon: 'success' })
  }

  const handleCancelAnnotation = () => {
    setShowAnnotateModal(false)
    setPendingPoint(null)
    setAnnotationText('')
  }

  return (
    <View className={styles.page}>
      <View className={styles.photoSection}>
        <View className={styles.metaRow}>
          <Text className={styles.metaDate}>{photo.date}</Text>
          <View className={styles.metaTag}>
            <Text className={styles.metaTagText}>{photo.treatmentName}</Text>
          </View>
          <View className={styles.metaTag}>
            <Text className={styles.metaTagText}>{photo.angle}</Text>
          </View>
          {photo.isPrivate && (
            <View className={classnames(styles.metaTag, styles.private)}>
              <Text className={styles.metaTagText}>仅自己可见</Text>
            </View>
          )}
        </View>
        <View className={styles.imageWrap} onTouchStart={handleImageTouch}>
          <Image className={styles.bigImage} src={photo.imageUrl} mode='aspectFill' />
          {photo.annotations.map((ann, idx) => (
            <React.Fragment key={ann.id}>
              <View
                className={classnames(styles.annotationCircle, pendingPoint && pendingPoint.x === ann.x && pendingPoint.y === ann.y && styles.editing)}
                style={{ left: `${ann.x}%`, top: `${ann.y}%`, width: `${ann.radius * 6}rpx`, height: `${ann.radius * 6}rpx` }}
              />
              <View className={styles.annotationLabel} style={{ left: `${ann.x}%`, top: `${ann.y}%` }}>
                {idx + 1}. {ann.note}
              </View>
            </React.Fragment>
          ))}
          {pendingPoint && showAnnotateModal && (
            <View
              className={classnames(styles.annotationCircle, styles.editing)}
              style={{ left: `${pendingPoint.x}%`, top: `${pendingPoint.y}%`, width: '48rpx', height: '48rpx' }}
            />
          )}
        </View>
        <Text style={{ fontSize: '22rpx', color: '#9B8B98', marginTop: '16rpx', textAlign: 'center' }}>
          点击照片任意位置可添加局部圈选备注
        </Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>感受记录</Text>
        <View className={styles.feelingRow}>
          <View className={styles.feelingDots}>
            {[1, 2, 3, 4, 5].map(s => (
              <View key={s} className={classnames(styles.feelingDot, s <= photo.feelingScore && styles.active)} />
            ))}
          </View>
          <Text className={styles.feelingText}>{photo.feeling || feelingLabels[photo.feelingScore - 1]}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>备注说明</Text>
        {photo.notes ? (
          <Text className={styles.notesText}>{photo.notes}</Text>
        ) : (
          <Text className={styles.notesEmpty}>暂无备注</Text>
        )}
      </View>

      {photo.annotations.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>圈选备注（{photo.annotations.length}处）</Text>
          <View className={styles.annotationList}>
            {photo.annotations.map((ann, idx) => (
              <View key={ann.id} className={styles.annotationItem}>
                <View className={styles.annotationIndex}>
                  <Text className={styles.annotationIndexText}>{idx + 1}</Text>
                </View>
                <Text className={styles.annotationNote}>{ann.note}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.privacySection}>
        <Text className={styles.sectionTitle}>隐私设置</Text>
        <View className={styles.privacyRow}>
          <Text className={styles.privacyLabel}>仅自己可见</Text>
          <View
            className={classnames(styles.privacyToggle, photo.isPrivate && styles.on)}
            onClick={() => setPhotoPrivate(photo.id, !photo.isPrivate)}
          >
            <View className={styles.privacyToggleKnob} />
          </View>
        </View>
        <View className={styles.privacyRow}>
          <Text className={styles.privacyLabel}>允许医生/咨询师查看</Text>
          <View
            className={classnames(styles.privacyToggle, photo.visibleToDoctor && styles.on)}
            onClick={() => updatePhoto(photo.id, { visibleToDoctor: !photo.visibleToDoctor })}
          >
            <View className={styles.privacyToggleKnob} />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.actionBtn, styles.ghost)}
          onClick={() => Taro.navigateBack()}
        >
          <Text className={styles.actionBtnText}>返回</Text>
        </View>
        <View
          className={classnames(styles.actionBtn, styles.primary)}
          onClick={() => setShowAnnotateModal(true)}
        >
          <Text className={styles.actionBtnText}>添加圈选备注</Text>
        </View>
      </View>

      {showAnnotateModal && (
        <View className={styles.annotateModal} onClick={handleCancelAnnotation}>
          <View className={styles.annotateContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.annotateTitle}>添加局部备注</Text>
            {!pendingPoint ? (
              <>
                <Text className={styles.annotateDesc}>请先关闭弹窗，点击照片上要标记的位置</Text>
                <View className={styles.annotateActions}>
                  <View className={classnames(styles.annotateBtn, styles.cancel)} onClick={handleCancelAnnotation}>
                    <Text className={styles.annotateBtnText}>知道了</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text className={styles.annotateDesc}>已选择位置，请输入备注说明</Text>
                <Input
                  className={styles.annotateInput}
                  placeholder='例如：此处色斑淡化明显...'
                  value={annotationText}
                  onInput={e => setAnnotationText(e.detail.value)}
                />
                <View className={styles.annotateActions}>
                  <View className={classnames(styles.annotateBtn, styles.cancel)} onClick={handleCancelAnnotation}>
                    <Text className={styles.annotateBtnText}>取消</Text>
                  </View>
                  <View className={classnames(styles.annotateBtn, styles.confirm)} onClick={handleConfirmAnnotation}>
                    <Text className={styles.annotateBtnText}>确认保存</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

export default PhotoDetailPage
