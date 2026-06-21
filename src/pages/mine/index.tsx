import React from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { userInfo } from '@/data/messages'
import { reminders } from '@/data/reminders'
import { messages } from '@/data/messages'
import { treatments } from '@/data/treatments'
import styles from './index.module.scss'
import Taro from '@tarojs/taro'

const MinePage = () => {
  const activeTreatments = treatments.filter(t => t.status === 'active')
  const unreadMessages = messages.filter(m => m.status === 'sent').length
  const todayReminders = reminders.filter(r => !r.isCompleted).slice(0, 3)

  const typeIcons = {
    sunscreen: '☀',
    diet: '🍽',
    hydration: '💧',
    followup: '🏥',
    medication: '💊',
    other: '📝'
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.profileCard}>
        <Image className={styles.avatar} src={userInfo.avatar} mode='aspectFill' />
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>{userInfo.name}</Text>
          <Text className={styles.profileMember}>会员ID：{userInfo.memberId}</Text>
          <Text className={styles.profilePhone}>{userInfo.phone}</Text>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.quickAction} onClick={() => Taro.switchTab({ url: '/pages/treatment/index' })}>
          <Text className={styles.quickActionIcon}>📋</Text>
          <Text className={styles.quickActionLabel}>我的疗程</Text>
          <Text className={styles.quickActionBadge}>{activeTreatments.length}个进行中</Text>
        </View>
        <View className={styles.quickAction} onClick={() => Taro.switchTab({ url: '/pages/checkin/index' })}>
          <Text className={styles.quickActionIcon}>📷</Text>
          <Text className={styles.quickActionLabel}>拍照打卡</Text>
          <Text className={styles.quickActionBadge}>去打卡</Text>
        </View>
        <View className={styles.quickAction} onClick={() => Taro.navigateTo({ url: '/pages/message/index' })}>
          <Text className={styles.quickActionIcon}>💬</Text>
          <Text className={styles.quickActionLabel}>咨询留言</Text>
          {unreadMessages > 0 && (
            <Text className={styles.quickActionBadge}>{unreadMessages}条待回复</Text>
          )}
        </View>
      </View>

      <View className={styles.reminderPreview}>
        <View className={styles.reminderCard}>
          <View className={styles.reminderHeader}>
            <Text className={styles.reminderTitle}>今日护理提醒</Text>
            <Text className={styles.reminderMore} onClick={() => Taro.navigateTo({ url: '/pages/reminder/index' })}>查看全部</Text>
          </View>
          {todayReminders.map(r => (
            <View key={r.id} className={styles.reminderItem}>
              <Text className={styles.reminderIcon}>{typeIcons[r.type] || '📝'}</Text>
              <Text className={styles.reminderText}>{r.title} - {r.treatmentName}</Text>
              <Text className={styles.reminderTime}>{r.time}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.menuTitle}>功能服务</Text>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/reminder/index' })}>
            <Text className={styles.menuItemIcon}>🔔</Text>
            <View className={styles.menuItemContent}>
              <Text className={styles.menuItemLabel}>护理提醒</Text>
              <Text className={styles.menuItemDesc}>防晒、补水、复诊等提醒</Text>
            </View>
            {reminders.filter(r => !r.isCompleted).length > 0 && (
              <Text className={styles.menuItemBadge}>{reminders.filter(r => !r.isCompleted).length}</Text>
            )}
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/message/index' })}>
            <Text className={styles.menuItemIcon}>💬</Text>
            <View className={styles.menuItemContent}>
              <Text className={styles.menuItemLabel}>咨询留言</Text>
              <Text className={styles.menuItemDesc}>与机构沟通、异常反馈</Text>
            </View>
            {unreadMessages > 0 && (
              <Text className={styles.menuItemBadge}>{unreadMessages}</Text>
            )}
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/privacy/index' })}>
            <Text className={styles.menuItemIcon}>🔒</Text>
            <View className={styles.menuItemContent}>
              <Text className={styles.menuItemLabel}>隐私设置</Text>
              <Text className={styles.menuItemDesc}>管理照片可见性和分享授权</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => Taro.switchTab({ url: '/pages/compare/index' })}>
            <Text className={styles.menuItemIcon}>📊</Text>
            <View className={styles.menuItemContent}>
              <Text className={styles.menuItemLabel}>效果对比</Text>
              <Text className={styles.menuItemDesc}>查看治疗前后变化</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default MinePage
