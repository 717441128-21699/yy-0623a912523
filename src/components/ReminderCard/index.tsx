import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Reminder } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

interface ReminderCardProps {
  reminder: Reminder
  onToggle?: (id: string) => void
}

const typeConfig = {
  sunscreen: { label: '防晒', icon: '☀' },
  diet: { label: '忌口', icon: '🍽' },
  hydration: { label: '补水', icon: '💧' },
  followup: { label: '复诊', icon: '🏥' },
  medication: { label: '用药', icon: '💊' },
  other: { label: '其他', icon: '📝' }
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggle }) => {
  const config = typeConfig[reminder.type] || typeConfig.other

  const handleToggle = () => {
    onToggle?.(reminder.id)
  }

  const handlePhotoTap = () => {
    if (reminder.relatedPhotoId) {
      Taro.navigateTo({ url: `/pages/photoDetail/index?id=${reminder.relatedPhotoId}` })
    }
  }

  return (
    <View className={classnames(styles.card, reminder.isCompleted && styles.completed, reminder.fromDoctor && styles.fromDoctor)}>
      <View className={classnames(styles.iconWrap, reminder.isCompleted && styles.iconWrapCompleted)}>
        <Text className={styles.icon}>{config.icon}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={classnames(styles.title, reminder.isCompleted && styles.titleCompleted)}>
            {reminder.title}
          </Text>
          <View className={styles.headerRight}>
            {reminder.fromDoctor && (
              <View className={styles.fromDoctorTag}>
                <Text className={styles.fromDoctorTagText}>👩‍⚕️ 医生</Text>
              </View>
            )}
            <View className={classnames(styles.typeTag, reminder.isCompleted && styles.typeTagCompleted)}>
              <Text className={styles.typeTagText}>{config.label}</Text>
            </View>
          </View>
        </View>
        <Text className={classnames(styles.description, reminder.isCompleted && styles.descriptionCompleted)}>
          {reminder.description}
        </Text>
        {reminder.relatedPhotoUrl && (
          <View className={styles.relatedPhoto} onClick={handlePhotoTap}>
            <Image className={styles.relatedPhotoImg} src={reminder.relatedPhotoUrl} mode='aspectFill' />
            <View className={styles.relatedPhotoMask}>
              <Text className={styles.relatedPhotoText}>查看相关照片 ›</Text>
            </View>
          </View>
        )}
        <Text className={styles.treatmentName}>{reminder.treatmentName}</Text>
        <View className={styles.timeRow}>
          <Text className={styles.time}>{reminder.date} {reminder.time}</Text>
        </View>
      </View>
      <View
        className={classnames(styles.checkbox, reminder.isCompleted && styles.checkboxChecked)}
        onClick={handleToggle}
      >
        {reminder.isCompleted && <Text className={styles.checkMark}>✓</Text>}
      </View>
    </View>
  )
}

export default ReminderCard
