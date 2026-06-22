import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import { PhotoRecord } from '@/types/index'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'

interface PhotoTimelineProps {
  photos: PhotoRecord[]
}

const PhotoTimeline: React.FC<PhotoTimelineProps> = ({ photos }) => {
  const handlePhotoClick = (photoId: string) => {
    Taro.navigateTo({ url: `/pages/photoDetail/index?id=${photoId}` })
  }

  return (
    <View className={styles.timeline}>
      {photos.map((photo, index) => (
        <View key={photo.id} className={styles.item}>
          <View className={styles.lineWrap}>
            <View className={styles.dot} />
            {index < photos.length - 1 && <View className={styles.line} />}
          </View>
          <View className={styles.card} onClick={() => handlePhotoClick(photo.id)}>
            <View className={styles.cardHeader}>
              <Text className={styles.date}>{photo.date}</Text>
              <Text className={styles.angle}>{photo.angle}</Text>
              {photo.isPrivate && (
                <View className={styles.privateTag}>
                  <Text className={styles.privateTagText}>仅自己可见</Text>
                </View>
              )}
              {photo.doctorNote && (
                <View className={styles.doctorTag}>
                  <Text className={styles.doctorTagText}>👩‍⚕️ 医生回复</Text>
                </View>
              )}
            </View>
            <View className={styles.photoWrap}>
              <Image className={styles.photo} src={photo.imageUrl} mode='aspectFill' />
              {photo.annotations.length > 0 && (
                <View className={styles.annotationBadge}>
                  <Text className={styles.annotationBadgeText}>{photo.annotations.length}处备注</Text>
                </View>
              )}
            </View>
            <Text className={styles.notes}>{photo.notes}</Text>
            <View className={styles.feelingWrap}>
              <Text className={styles.feelingLabel}>感受</Text>
              <View className={styles.feelingDots}>
                {[1, 2, 3, 4, 5].map(score => (
                  <View
                    key={score}
                    className={`${styles.feelingDot} ${score <= photo.feelingScore ? styles.feelingDotActive : ''}`}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default PhotoTimeline
