import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import { angleTemplates } from '@/data/photos'
import { treatments } from '@/data/treatments'
import { useAppStore } from '@/store/index'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const activeTreatments = treatments.filter(t => t.status === 'active')
const feelingLabels = ['很差', '较差', '一般', '良好', '很好']

const CheckinPage = () => {
  const addPhoto = useAppStore(s => s.addPhoto)
  const defaultPrivate = useAppStore(s => s.defaultPrivate)

  const [selectedTemplate, setSelectedTemplate] = useState('a1')
  const [selectedTreatment, setSelectedTreatment] = useState(activeTreatments[0]?.id || '')
  const [isPrivate, setIsPrivate] = useState(defaultPrivate)
  const [visibleToDoctor, setVisibleToDoctor] = useState(true)
  const [feelingScore, setFeelingScore] = useState(3)
  const [notes, setNotes] = useState('')
  const [capturedImage, setCapturedImage] = useState('')

  useEffect(() => {
    setIsPrivate(defaultPrivate)
  }, [defaultPrivate])

  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        sizeType: ['compressed']
      })
      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        setCapturedImage(res.tempFilePaths[0])
        console.info('[Checkin] image chosen:', res.tempFilePaths[0])
      }
    } catch (err) {
      console.error('[Checkin] chooseImage failed:', err)
    }
  }

  const handleRetake = (e) => {
    e.stopPropagation()
    setCapturedImage('')
  }

  const handleSubmit = () => {
    if (!selectedTreatment) {
      Taro.showToast({ title: '请选择疗程', icon: 'none' })
      return
    }
    if (!capturedImage) {
      Taro.showToast({ title: '请先拍摄或选择照片', icon: 'none' })
      return
    }
    const tpl = angleTemplates.find(t => t.id === selectedTemplate)
    const treatment = treatments.find(t => t.id === selectedTreatment)
    const pad = (n: number) => String(n).padStart(2, '0')
    const now = new Date()
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

    addPhoto({
      treatmentId: selectedTreatment,
      treatmentName: treatment?.name || '',
      date,
      imageUrl: capturedImage,
      angle: tpl?.name || '',
      isPrivate,
      visibleToDoctor,
      notes,
      feeling: feelingLabels[feelingScore - 1],
      feelingScore
    })

    Taro.showToast({ title: '打卡成功', icon: 'success' })

    setNotes('')
    setFeelingScore(3)
    setCapturedImage('')
    setIsPrivate(defaultPrivate)

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/compare/index' })
    }, 800)
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>拍照打卡</Text>
        <Text className={styles.subtitle}>记录恢复每一步</Text>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>选择拍摄角度</Text>
      </View>
      <View className={styles.templateScroll}>
        <ScrollView className={styles.templateRow} scrollX>
          {angleTemplates.map(tpl => (
            <View key={tpl.id} className={styles.templateItem} onClick={() => setSelectedTemplate(tpl.id)}>
              <View className={classnames(styles.templateImageWrap, selectedTemplate === tpl.id && styles.selected)}>
                <Image className={styles.templateImage} src={tpl.image} mode='aspectFill' />
              </View>
              <Text className={styles.templateName}>{tpl.name}</Text>
              <Text className={styles.templateAngle}>{tpl.angle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.treatmentSection}>
        <View className={styles.treatmentSelector}>
          <Text className={styles.treatmentLabel}>选择疗程</Text>
          <View className={styles.treatmentOptions}>
            {activeTreatments.map(t => (
              <View
                key={t.id}
                className={classnames(styles.treatmentOption, selectedTreatment === t.id && styles.selected)}
                onClick={() => setSelectedTreatment(t.id)}
              >
                <Text className={styles.treatmentOptionText}>{t.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.captureArea}>
        <View className={styles.capturePreview} onClick={handleChooseImage}>
          {capturedImage ? (
            <>
              <View className={styles.captureImageWrap}>
                <Image className={styles.captureImage} src={capturedImage} mode='aspectFill' />
                <View className={styles.captureRetake} onClick={handleRetake}>
                  <Text className={styles.captureRetakeText}>重新选择</Text>
                </View>
              </View>
              <Text className={styles.captureTip}>点击可重新选择照片</Text>
            </>
          ) : (
            <>
              <View className={styles.capturePlaceholder}>
                <Text className={styles.captureIcon}>📷</Text>
              </View>
              <Text className={styles.captureHint}>点击拍摄或选择恢复照</Text>
              <Text className={styles.captureTip}>按照角度模板拍摄，效果更佳</Text>
            </>
          )}
        </View>
      </View>

      <View className={styles.privacySection}>
        <View className={styles.privacyCard}>
          <View className={styles.privacyRow}>
            <Text className={styles.privacyLabel}>仅自己可见</Text>
            <View
              className={classnames(styles.privacyToggle, isPrivate && styles.on)}
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <View className={styles.privacyToggleKnob} />
            </View>
          </View>
          <View className={styles.privacyRow}>
            <Text className={styles.privacyLabel}>允许医生/咨询师查看</Text>
            <View
              className={classnames(styles.privacyToggle, visibleToDoctor && styles.on)}
              onClick={() => setVisibleToDoctor(!visibleToDoctor)}
            >
              <View className={styles.privacyToggleKnob} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.feelingSection}>
        <View className={styles.feelingCard}>
          <Text className={styles.feelingLabel}>今日感受</Text>
          <View className={styles.feelingOptions}>
            {[1, 2, 3, 4, 5].map(score => (
              <View key={score} className={styles.feelingItem} onClick={() => setFeelingScore(score)}>
                <View className={classnames(styles.feelingCircle, feelingScore === score && styles.selected)}>
                  <Text className={styles.feelingScore}>{score}</Text>
                </View>
                <Text className={styles.feelingDesc}>{feelingLabels[score - 1]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.notesSection}>
        <View className={styles.notesCard}>
          <Text className={styles.notesLabel}>备注</Text>
          <Input
            className={styles.notesInput}
            placeholder='记录今天的恢复情况...'
            value={notes}
            onInput={e => setNotes(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.submitBtn} onClick={handleSubmit}>
        <Text className={styles.submitBtnText}>提交打卡</Text>
      </View>
    </ScrollView>
  )
}

export default CheckinPage
