import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useAppStore } from '@/store/index'
import ReminderCard from '@/components/ReminderCard'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const ReminderPage = () => {
  const reminders = useAppStore(s => s.reminders)
  const toggleReminder = useAppStore(s => s.toggleReminder)

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
    return reminders
      .filter(r => !r.isCompleted)
      .filter(r => !filterType || r.type === filterType)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [reminders, activeFilter])

  const completedReminders = useMemo(() => {
    const filterType = filterTypeMap[activeFilter]
    return reminders
      .filter(r => r.isCompleted)
      .filter(r => !filterType || r.type === filterType)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [reminders, activeFilter])

  const doctorPendingCount = useMemo(
    () => pendingReminders.filter(r => r.fromDoctor).length,
    [pendingReminders]
  )

  const handleToggle = useCallback((id: string) => {
    toggleReminder(id)
  }, [toggleReminder])

  const handleAbnormal = () => {
    Taro.navigateTo({ url: '/pages/message/index?type=abnormal' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>护理提醒</Text>
        <Text className={styles.desc}>按时护理，恢复更佳</Text>
      </View>

      {doctorPendingCount > 0 && (
        <View className={styles.doctorTip}>
          <Text className={styles.doctorTipIcon}>👩‍⚕️</Text>
          <Text className={styles.doctorTipText}>
            您有 {doctorPendingCount} 条来自医生的提醒待处理
          </Text>
        </View>
      )}

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
