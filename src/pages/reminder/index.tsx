import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { reminders as initialReminders } from '@/data/reminders'
import ReminderCard from '@/components/ReminderCard'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const ReminderPage = () => {
  const [reminderList, setReminderList] = useState(initialReminders)
  const [activeFilter, setActiveFilter] = useState('全部')
  const filters = ['全部', '防晒', '补水', '忌口', '复诊', '用药']

  const filterTypeMap = {
    '全部': null,
    '防晒': 'sunscreen',
    '补水': 'hydration',
    '忌口': 'diet',
    '复诊': 'followup',
    '用药': 'medication'
  }

  const pendingReminders = useMemo(() => {
    const filterType = filterTypeMap[activeFilter]
    return reminderList.filter(r => {
      if (r.isCompleted) return false
      if (filterType && r.type !== filterType) return false
      return true
    })
  }, [reminderList, activeFilter])

  const completedReminders = useMemo(() => {
    const filterType = filterTypeMap[activeFilter]
    return reminderList.filter(r => {
      if (!r.isCompleted) return false
      if (filterType && r.type !== filterType) return false
      return true
    })
  }, [reminderList, activeFilter])

  const handleToggle = useCallback((id: string) => {
    setReminderList(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
  }, [])

  const handleAbnormal = () => {
    Taro.navigateTo({ url: '/pages/message/index?type=abnormal' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>护理提醒</Text>
        <Text className={styles.desc}>按时护理，恢复更佳</Text>
      </View>

      <ScrollView className={styles.filterRow} scrollX>
        {filters.map(filter => (
          <View
            key={filter}
            className={classnames(styles.filterTag, activeFilter === filter && styles.active)}
            onClick={() => setActiveFilter(filter)}
          >
            <Text className={styles.filterText}>{filter}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{pendingReminders.length}</Text>
          <Text className={styles.statLabel}>待完成</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{completedReminders.length}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
      </View>

      <View className={styles.list}>
        {pendingReminders.map(r => (
          <ReminderCard key={r.id} reminder={r} onToggle={handleToggle} />
        ))}
        {pendingReminders.length === 0 && (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>暂无待完成提醒</Text>
          </View>
        )}
      </View>

      {completedReminders.length > 0 && (
        <View className={styles.completedSection}>
          <View className={styles.completedHeader}>
            <Text className={styles.completedTitle}>已完成</Text>
          </View>
          <View className={styles.list}>
            {completedReminders.map(r => (
              <ReminderCard key={r.id} reminder={r} onToggle={handleToggle} />
            ))}
          </View>
        </View>
      )}

      <View className={styles.abnormalBtn} onClick={handleAbnormal}>
        <Text className={styles.abnormalBtnIcon}>⚠</Text>
        <Text className={styles.abnormalBtnText}>异常反馈</Text>
      </View>
    </ScrollView>
  )
}

export default ReminderPage
