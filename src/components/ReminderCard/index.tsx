import React from 'react'
import { View, Text } from '@tarojs/components'
import { Reminder } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'

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

  return (
    <View className={classnames(styles.card, reminder.isCompleted && styles.completed)}>
      <View className={classnames(styles.iconWrap, reminder.isCompleted && styles.iconWrapCompleted)}>
        <Text className={styles.icon}>{config.icon}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={classnames(styles.title, reminder.isCompleted && styles.titleCompleted)}>{reminder.title}</Text>
          <View className={classnames(styles.typeTag, reminder.isCompleted && styles.typeTagCompleted)}>
            <Text className={styles.typeTagText}>{config.label}</Text>
          </View>
        </View>
        <Text className={classnames(styles.description, reminder.isCompleted && styles.descriptionCompleted)}>
          {reminder.description}
        </Text>
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
