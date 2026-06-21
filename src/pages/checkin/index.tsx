import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import { angleTemplates } from '@/data/photos'
import { treatments } from '@/data/treatments'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const activeTreatments = treatments.filter(t => t.status === 'active')

const CheckinPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('a1')
  const [selectedTreatment, setSelectedTreatment] = useState(activeTreatments[0]?.id || '')
  const [isPrivate, setIsPrivate] = useState(false)
  const [visibleToDoctor, setVisibleToDoctor] = useState(true)
  const [feelingScore, setFeelingScore] = useState(3)
  const [notes, setNotes] = useState('')

  const feelingLabels = ['很差', '较差', '一般', '良好', '很好']

  const handleSubmit = () => {
    if (!selectedTreatment) {
      Taro.showToast({ title: '请选择疗程', icon: 'none' })
      return
    }
    console.info('[Checkin] submit', { selectedTemplate, selectedTreatment, isPrivate, visibleToDoctor, feelingScore, notes })
    Taro.showToast({ title: '打卡成功', icon: 'success' })
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
        <View className={styles.capturePreview}>
          <View className={styles.capturePlaceholder}>
            <Text className={styles.captureIcon}>📷</Text>
          </View>
          <Text className={styles.captureHint}>点击拍摄恢复照</Text>
          <Text className={styles.captureTip}>按照角度模板拍摄，效果更佳</Text>
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
