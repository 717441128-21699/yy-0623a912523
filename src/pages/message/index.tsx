import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import { messages } from '@/data/messages'
import { treatments } from '@/data/treatments'
import MessageBubble from '@/components/MessageBubble'
import styles from './index.module.scss'
import classnames from 'classnames'
import Taro from '@tarojs/taro'

const MessagePage = () => {
  const [activeFilter, setActiveFilter] = useState('全部')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'general' | 'abnormal'>('general')
  const [messageContent, setMessageContent] = useState('')
  const [selectedTreatment, setSelectedTreatment] = useState('')

  const filters = ['全部', '咨询', '异常反馈', '复诊跟进', '一般留言']
  const filterTypeMap: Record<string, string | null> = {
    '全部': null,
    '咨询': 'question',
    '异常反馈': 'abnormal',
    '复诊跟进': 'followup',
    '一般留言': 'general'
  }

  const filteredMessages = useMemo(() => {
    const filterType = filterTypeMap[activeFilter]
    if (!filterType) return messages
    return messages.filter(m => m.type === filterType)
  }, [activeFilter])

  const activeTreatments = treatments.filter(t => t.status === 'active')

  const handleQuickMessage = (type: 'general' | 'abnormal') => {
    setModalType(type)
    setMessageContent('')
    setSelectedTreatment('')
    setShowModal(true)
  }

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      Taro.showToast({ title: '请输入留言内容', icon: 'none' })
      return
    }
    if (!selectedTreatment) {
      Taro.showToast({ title: '请选择相关疗程', icon: 'none' })
      return
    }
    console.info('[Message] send', { modalType, selectedTreatment, messageContent })
    setShowModal(false)
    Taro.showToast({ title: '留言已发送', icon: 'success' })
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>咨询留言</Text>
        <Text className={styles.desc}>与您的专属机构沟通</Text>
      </View>

      <View className={styles.filterRow}>
        {filters.map(filter => (
          <View
            key={filter}
            className={classnames(styles.filterTag, activeFilter === filter && styles.active)}
            onClick={() => setActiveFilter(filter)}
          >
            <Text className={styles.filterText}>{filter}</Text>
          </View>
        ))}
      </View>

      <View className={styles.list}>
        {filteredMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {filteredMessages.length === 0 && (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>暂无留言记录</Text>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.inputRow}>
          <View className={styles.inputWrap} onClick={() => handleQuickMessage('general')}>
            <Text className={styles.inputPlaceholder}>输入您的疑问...</Text>
          </View>
        </View>
        <View className={styles.quickActions}>
          <View className={`${styles.quickBtn} ${styles.primary}`} onClick={() => handleQuickMessage('general')}>
            <Text className={styles.quickBtnText}>💬 发送留言</Text>
          </View>
          <View className={`${styles.quickBtn} ${styles.warning}`} onClick={() => handleQuickMessage('abnormal')}>
            <Text className={styles.quickBtnText}>⚠ 异常反馈</Text>
          </View>
        </View>
      </View>

      {showModal && (
        <View className={styles.modal} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>
              {modalType === 'abnormal' ? '异常红肿反馈' : '发送留言'}
            </Text>
            <Input
              className={styles.modalInput}
              placeholder={modalType === 'abnormal' ? '请描述您发现的异常情况，如红肿、疼痛等...' : '请输入您的疑问或留言...'}
              value={messageContent}
              onInput={e => setMessageContent(e.detail.value)}
            />
            <View className={styles.modalActions}>
              <View className={`${styles.modalBtn} ${styles.cancel}`} onClick={() => setShowModal(false)}>
                <Text className={styles.modalBtnText}>取消</Text>
              </View>
              <View className={`${styles.modalBtn} ${styles.confirm}`} onClick={handleSendMessage}>
                <Text className={styles.modalBtnText}>发送</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default MessagePage
