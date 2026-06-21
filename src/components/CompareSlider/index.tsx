import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { PhotoRecord } from '@/types/index'
import styles from './index.module.scss'
import classnames from 'classnames'

interface CompareSliderProps {
  beforePhoto: PhotoRecord
  afterPhoto: PhotoRecord
}

const CompareSlider: React.FC<CompareSliderProps> = ({ beforePhoto, afterPhoto }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const containerWidth = 343
    const x = touch.clientX
    const percent = Math.min(Math.max((x / containerWidth) * 100, 5), 95)
    setSliderPosition(percent)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <View className={styles.container}>
      <View className={styles.imageWrap}>
        <Image className={styles.afterImage} src={afterPhoto.imageUrl} mode='aspectFill' />
        <View
          className={styles.beforeClip}
          style={{ width: `${sliderPosition}%` }}
        >
          <Image className={styles.beforeImage} src={beforePhoto.imageUrl} mode='aspectFill' />
        </View>
        <View
          className={classnames(styles.slider, isDragging && styles.sliderActive)}
          style={{ left: `${sliderPosition}%` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <View className={styles.sliderLine} />
          <View className={styles.sliderHandle}>
            <View className={styles.sliderArrowLeft} />
            <View className={styles.sliderArrowRight} />
          </View>
          <View className={styles.sliderLine} />
        </View>
        <View className={styles.beforeLabel}>
          <Text className={styles.labelText}>治疗前</Text>
        </View>
        <View className={styles.afterLabel}>
          <Text className={styles.labelText}>治疗后</Text>
        </View>
      </View>
      <View className={styles.dateInfo}>
        <Text className={styles.dateText}>{beforePhoto.date}</Text>
        <View className={styles.dateArrow} />
        <Text className={styles.dateText}>{afterPhoto.date}</Text>
      </View>
    </View>
  )
}

export default CompareSlider
