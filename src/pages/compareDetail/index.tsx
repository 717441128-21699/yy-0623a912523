import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const CompareDetailPage = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.placeholderIcon}>📊</Text>
      <Text className={styles.placeholderTitle}>对比详情</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  )
}

export default CompareDetailPage
