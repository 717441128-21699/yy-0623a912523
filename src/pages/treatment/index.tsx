import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { treatments } from '@/data/treatments'
import TreatmentCard from '@/components/TreatmentCard'
import styles from './index.module.scss'
import classnames from 'classnames'

const TreatmentPage = () => {
  const [activeFilter, setActiveFilter] = useState('全部')
  const filters = ['全部', '皮肤管理', '抗衰疗程', '体型管理']

  const filteredTreatments = useMemo(() => {
    if (activeFilter === '全部') return treatments
    return treatments.filter(t => t.category === activeFilter)
  }, [activeFilter])

  const activeCount = treatments.filter(t => t.status === 'active').length
  const completedCount = treatments.filter(t => t.status === 'completed').length
  const totalSessions = treatments.reduce((sum, t) => sum + t.totalSessions - t.usedSessions, 0)

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.greeting}>我的疗程</Text>
        <Text className={styles.subtitle}>记录每一次蜕变</Text>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{activeCount}</Text>
          <Text className={styles.statLabel}>进行中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{completedCount}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNumber}>{totalSessions}</Text>
          <Text className={styles.statLabel}>剩余次数</Text>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>疗程列表</Text>
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

      <View className={styles.list}>
        {filteredTreatments.map(treatment => (
          <TreatmentCard key={treatment.id} treatment={treatment} />
        ))}
        {filteredTreatments.length === 0 && (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>暂无相关疗程</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default TreatmentPage
