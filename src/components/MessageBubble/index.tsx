import React from 'react'
import { View, Text } from '@tarojs/components'
import { Message } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const typeLabels = {
    question: '咨询',
    abnormal: '异常反馈',
    followup: '复诊跟进',
    general: '一般留言'
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={classnames(styles.typeTag, styles[`type_${message.type}`])}>
          <Text className={styles.typeTagText}>{typeLabels[message.type]}</Text>
        </View>
        <Text className={styles.treatmentName}>{message.treatmentName}</Text>
        <View className={classnames(styles.statusDot, message.status === 'replied' && styles.replied)} />
      </View>
      <Text className={styles.content}>{message.content}</Text>
      <Text className={styles.time}>{message.createdAt}</Text>
      {message.reply && (
        <View className={styles.replyWrap}>
          <View className={styles.replyHeader}>
            <View className={styles.replyDot} />
            <Text className={styles.replyLabel}>机构回复</Text>
          </View>
          <Text className={styles.replyContent}>{message.reply}</Text>
          <Text className={styles.replyTime}>{message.replyAt}</Text>
        </View>
      )}
    </View>
  )
}

export default MessageBubble
