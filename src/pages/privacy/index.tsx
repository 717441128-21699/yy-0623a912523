import React, { useState } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { photos } from '@/data/photos'
import styles from './index.module.scss'
import classnames from 'classnames'

const PrivacyPage = () => {
  const [defaultPrivate, setDefaultPrivate] = useState(false)
  const [shareAuth, setShareAuth] = useState(true)
  const [doctorVisible, setDoctorVisible] = useState(true)
  const [photoPrivacyMap, setPhotoPrivacyMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    photos.forEach(p => { map[p.id] = p.isPrivate })
    return map
  })

  const togglePhotoPrivacy = (id: string) => {
    setPhotoPrivacyMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>隐私设置</Text>
        <Text className={styles.desc}>保护您的照片隐私，仅您授权的内容才会被他人查看</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>默认隐私设置</Text>
        <View className={styles.card}>
          <View className={styles.row}>
            <View className={styles.rowContent}>
              <Text className={styles.rowLabel}>新照片默认仅自己可见</Text>
              <Text className={styles.rowDesc}>开启后，新上传的照片默认为私密，需手动设置为可查看</Text>
            </View>
            <View
              className={classnames(styles.toggle, defaultPrivate && styles.on)}
              onClick={() => setDefaultPrivate(!defaultPrivate)}
            >
              <View className={styles.toggleKnob} />
            </View>
          </View>
          <View className={styles.row}>
            <View className={styles.rowContent}>
              <Text className={styles.rowLabel}>允许医生/咨询师查看</Text>
              <Text className={styles.rowDesc}>关闭后，所有照片对医生和咨询师不可见</Text>
            </View>
            <View
              className={classnames(styles.toggle, doctorVisible && styles.on)}
              onClick={() => setDoctorVisible(!doctorVisible)}
            >
              <View className={styles.toggleKnob} />
            </View>
          </View>
          <View className={styles.row}>
            <View className={styles.rowContent}>
              <Text className={styles.rowLabel}>分享前需授权确认</Text>
              <Text className={styles.rowDesc}>开启后，生成分享图前需要您确认授权，避免私密照片被意外分享</Text>
            </View>
            <View
              className={classnames(styles.toggle, shareAuth && styles.on)}
              onClick={() => setShareAuth(!shareAuth)}
            >
              <View className={styles.toggleKnob} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>照片可见性管理</Text>
        <View className={styles.photoList}>
          {photos.map(photo => (
            <View key={photo.id} className={styles.photoItem} onClick={() => togglePhotoPrivacy(photo.id)}>
              <Image className={styles.photoThumb} src={photo.imageUrl} mode='aspectFill' />
              <View className={styles.photoInfo}>
                <Text className={styles.photoDate}>{photo.date}</Text>
                <Text className={styles.photoAngle}>{photo.treatmentName} · {photo.angle}</Text>
              </View>
              <View className={classnames(styles.photoPrivacy, photoPrivacyMap[photo.id] ? styles.private : styles.public)}>
                <Text className={styles.photoPrivacyText}>
                  {photoPrivacyMap[photo.id] ? '仅自己可见' : '可查看'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.shareSection}>
        <View className={styles.shareCard}>
          <Text className={styles.shareTitle}>分享安全说明</Text>
          <Text className={styles.shareDesc}>我们重视您的隐私保护，以下规则确保您的照片安全：</Text>
          <View className={styles.shareRules}>
            <View className={styles.shareRule}>
              <View className={styles.shareRuleDot} />
              <Text className={styles.shareRuleText}>分享图生成前需要您确认授权，未经同意不会生成</Text>
            </View>
            <View className={styles.shareRule}>
              <View className={styles.shareRuleDot} />
              <Text className={styles.shareRuleText}>标记为"仅自己可见"的照片不会出现在分享图中</Text>
            </View>
            <View className={styles.shareRule}>
              <View className={styles.shareRuleDot} />
              <Text className={styles.shareRuleText}>建议不要将私密恢复照片发到群聊中询问，可通过咨询留言功能向机构专业咨询</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default PrivacyPage
