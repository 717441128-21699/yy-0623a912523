import React from 'react'
import { View, Text, Image, Progress } from '@tarojs/components'
import { Treatment } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

interface TreatmentCardProps {
  treatment: Treatment
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  const progress = Math.round((treatment.usedSessions / treatment.totalSessions) * 100)

  const handleClick = () => {
    Taro.navigateTo({ url: `/pages/treatmentDetail/index?id=${treatment.id}` })
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <Image className={styles.image} src={treatment.image} mode='aspectFill' />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{treatment.name}</Text>
          <View className={classnames(styles.status, treatment.status === 'active' && styles.active, treatment.status === 'completed' && styles.completed, treatment.status === 'paused' && styles.paused)}>
            <Text className={styles.statusText}>
              {treatment.status === 'active' ? '进行中' : treatment.status === 'completed' ? '已完成' : '已暂停'}
            </Text>
          </View>
        </View>
        <Text className={styles.category}>{treatment.category}</Text>
        <View className={styles.progressWrap}>
          <Progress
            percent={progress}
            strokeWidth={6}
            activeColor='#D4A0B8'
            backgroundColor='#F0E0E8'
            active={false}
          />
          <Text className={styles.progressText}>{treatment.usedSessions}/{treatment.totalSessions}次</Text>
        </View>
        {treatment.nextDate && (
          <Text className={styles.nextDate}>下次治疗：{treatment.nextDate}</Text>
        )}
      </View>
    </View>
  )
}

export default TreatmentCard
