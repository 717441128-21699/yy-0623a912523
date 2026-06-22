import React, { useState, useMemo } from 'react'
import { View, Text, Image, Input, Textarea } from '@tarojs/components'
import { useAppStore } from '@/store/index'
import { useRouter } from '@tarojs/taro'
import { DoctorAdviceType, DoctorAdviceLabels } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const feelingLabels = ['很差', '较差', '一般', '良好', '很好']
const adviceTypes: DoctorAdviceType[] = ['observe', 'followup', 'care']

const PhotoDetailPage = () => {
  const router = useRouter()
  const photoId = router.params.id || ''
  const photos = useAppStore(s => s.photos)
  const role = useAppStore(s => s.role)
  const setPhotoPrivate = useAppStore(s => s.setPhotoPrivate)
  const setPhotoVisibleToDoctor = useAppStore(s => s.setPhotoVisibleToDoctor)
  const addAnnotation = useAppStore(s => s.addAnnotation)
  const setDoctorNote = useAppStore(s => s.setDoctorNote)
  const createFollowupReminder = useAppStore(s => s.createFollowupReminder)

  const photo = useMemo(() => photos.find(p => p.id === photoId), [photos, photoId])

  const [showAnnotateModal, setShowAnnotateModal] = useState(false)
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null)
  const [annotationText, setAnnotationText] = useState('')
  const [doctorNoteText, setDoctorNoteText] = useState('')
  const [doctorAdviceType, setDoctorAdviceType] = useState<DoctorAdviceType>('observe')
  const [showDoctorNoteModal, setShowDoctorNoteModal] = useState(false)

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
    if (touch && touch.clientX !== undefined) {
      const rectInfo = (e.currentTarget as any).getBoundingClientRect ?
        (e.currentTarget as any).getBoundingClientRect() : { left: 0, top: 0, width: 343, height: 250 }
      const x = ((touch.clientX - rectInfo.left) / rectInfo.width) * 100
      const y = ((touch.clientY - rectInfo.top) / rectInfo.height) * 100
      setPendingPoint({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) })
      setAnnotationText('')
      setShowAnnotateModal(true)
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

  const openDoctorNoteModal = () => {
    setDoctorNoteText(photo.doctorNote || '')
    setDoctorAdviceType(photo.doctorAdviceType || 'observe')
    setShowDoctorNoteModal(true)
  }

  const handleSaveDoctorNote = () => {
    if (!doctorNoteText.trim()) {
      Taro.showToast({ title: '请输入专业建议', icon: 'none' })
      return
    }
    setDoctorNote(photo.id, doctorNoteText.trim(), doctorAdviceType)
    setShowDoctorNoteModal(false)
    Taro.showToast({ title: '已保存建议', icon: 'success' })
  }

  const handleCreateReminder = () => {
    Taro.showModal({
      title: '生成复诊提醒',
      content: '将为顾客生成一条 7 天后的复诊提醒，顾客会在护理提醒中看到。是否继续？',
      confirmText: '生成',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          const r = createFollowupReminder(photo.id)
          if (r) {
            Taro.showToast({ title: '已生成提醒', icon: 'success' })
          }
        }
      }
    })
  }

  const handleTogglePrivate = () => {
    const nextVal = !photo.isPrivate
    if (photo.isPrivate === true && nextVal === false) {
      Taro.showModal({
        title: '取消私密',
        content: '是否同时开放给医生/咨询师查看？',
        confirmText: '同时开放',
        cancelText: '暂不开放',
        success: (res) => {
          setPhotoPrivate(photo.id, false)
          if (res.confirm) {
            setPhotoVisibleToDoctor(photo.id, true)
          }
        }
      })
    } else {
      setPhotoPrivate(photo.id, nextVal)
    }
  }

  const handleToggleVisibleToDoctor = () => {
    if (photo.isPrivate) {
      Taro.showToast({ title: '私密照片不能开放给医生', icon: 'none' })
      return
    }
    setPhotoVisibleToDoctor(photo.id, !photo.visibleToDoctor)
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
          {photo.doctorAdviceType && (
            <View className={classnames(styles.metaTag, styles.advice)}>
              <Text className={styles.metaTagText}>
                {doctorAdviceType === 'observe' && '🔍'}
                {doctorAdviceType === 'followup' && '🏥'}
                {doctorAdviceType === 'care' && '💆'}
                {' '}{DoctorAdviceLabels[photo.doctorAdviceType]}
              </Text>
            </View>
          )}
        </View>
        <View className={styles.imageWrap} onTouchStart={handleImageTouch}>
          <Image className={styles.bigImage} src={photo.imageUrl} mode='aspectFill' />
          {photo.annotations.map((ann, idx) => (
            <React.Fragment key={ann.id}>
              <View
                className={classnames(styles.annotationCircle)}
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

      {photo.doctorNote && (
        <View className={classnames(styles.section, styles.doctorSection)}>
          <View className={styles.doctorSectionHeader}>
            <Text className={styles.sectionTitle}>
              👩‍⚕️ 医生专业建议
              {photo.doctorAdviceType && (
                <Text className={styles.doctorAdviceTag}>
                  · {DoctorAdviceLabels[photo.doctorAdviceType]}
                </Text>
              )}
            </Text>
            {photo.doctorNoteAt && (
              <Text className={styles.doctorNoteTime}>{photo.doctorNoteAt}</Text>
            )}
          </View>
          <Text className={styles.doctorNoteText}>{photo.doctorNote}</Text>
        </View>
      )}

      {role === 'doctor' && (
        <View className={styles.section}>
          <View className={styles.doctorSectionHeader}>
            <Text className={styles.sectionTitle}>✍️ 写专业建议</Text>
          </View>
          <View className={styles.doctorNoteEditor} onClick={openDoctorNoteModal}>
            <Text className={styles.doctorNotePlaceholder}>
              {photo.doctorNote || '点击此处为这张照片写专业建议...'}
            </Text>
          </View>
          {photo.doctorAdviceType === 'followup' && (
            <View className={styles.doctorActionBtn} onClick={handleCreateReminder}>
              <Text className={styles.doctorActionBtnText}>➕ 一键生成复诊提醒给顾客</Text>
            </View>
          )}
        </View>
      )}

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

      {role === 'customer' && (
        <View className={styles.privacySection}>
          <Text className={styles.sectionTitle}>隐私设置</Text>
          <View className={styles.privacyRow}>
            <Text className={styles.privacyLabel}>仅自己可见</Text>
            <View
              className={classnames(styles.privacyToggle, photo.isPrivate && styles.on)}
              onClick={() => handleTogglePrivate()}
            >
              <View className={styles.privacyToggleKnob} />
            </View>
          </View>
          <View className={styles.privacyRow}>
            <View className={styles.privacyLabelWrap}>
              <Text className={styles.privacyLabel}>允许医生/咨询师查看</Text>
              {photo.isPrivate && (
                <Text className={styles.privacyDisabledHint}>（私密照片不可开放）</Text>
              )}
            </View>
            <View
              className={classnames(
                styles.privacyToggle,
                photo.visibleToDoctor && !photo.isPrivate && styles.on,
                photo.isPrivate && styles.disabled
              )}
              onClick={handleToggleVisibleToDoctor}
            >
              <View className={styles.privacyToggleKnob} />
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.actionBtn, styles.ghost)}
          onClick={() => Taro.navigateBack()}
        >
          <Text className={styles.actionBtnText}>返回</Text>
        </View>
        {role === 'customer' ? (
          <View
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={() => setShowAnnotateModal(true)}
          >
            <Text className={styles.actionBtnText}>添加圈选备注</Text>
          </View>
        ) : (
          <View
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={openDoctorNoteModal}
          >
            <Text className={styles.actionBtnText}>写专业建议</Text>
          </View>
        )}
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

      {showDoctorNoteModal && (
        <View className={styles.annotateModal} onClick={() => setShowDoctorNoteModal(false)}>
          <View className={styles.annotateContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.annotateTitle}>医生专业建议</Text>
            <Text className={styles.annotateLabel}>建议类型</Text>
            <View className={styles.adviceTypeRow}>
              {adviceTypes.map(t => (
                <View
                  key={t}
                  className={classnames(styles.adviceTypeChip, doctorAdviceType === t && styles.active)}
                  onClick={() => setDoctorAdviceType(t)}
                >
                  <Text className={styles.adviceTypeIcon}>
                    {t === 'observe' && '🔍'}
                    {t === 'followup' && '🏥'}
                    {t === 'care' && '💆'}
                  </Text>
                  <Text className={styles.adviceTypeText}>{DoctorAdviceLabels[t]}</Text>
                </View>
              ))}
            </View>
            <Textarea
              className={styles.doctorNoteTextarea}
              placeholder='请输入您的专业建议...'
              value={doctorNoteText}
              onInput={e => setDoctorNoteText(e.detail.value)}
              maxlength={500}
            />
            <Text className={styles.annotateDesc}>
              建议保存后顾客可在照片详情中查看；选"需要复诊"可额外生成复诊提醒
            </Text>
            <View className={styles.annotateActions}>
              <View className={classnames(styles.annotateBtn, styles.cancel)} onClick={() => setShowDoctorNoteModal(false)}>
                <Text className={styles.annotateBtnText}>取消</Text>
              </View>
              <View className={classnames(styles.annotateBtn, styles.confirm)} onClick={handleSaveDoctorNote}>
                <Text className={styles.annotateBtnText}>保存建议</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default PhotoDetailPage
