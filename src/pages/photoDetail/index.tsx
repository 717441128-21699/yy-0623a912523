import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

const PhotoDetailPage = () => {
  return (
    <View className={styles.page}>
      <Text className={styles.placeholderIcon}>📷</Text>
      <Text className={styles.placeholderTitle}>照片详情</Text>
      <Text className={styles.placeholderDesc}>功能正在开发中...</Text>
    </View>
  )
}

export default PhotoDetailPage
