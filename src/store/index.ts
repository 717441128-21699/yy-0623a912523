import { create } from 'zustand'
import {
  PhotoRecord, Message, PhotoAnnotation, UserRole, ShareRecord, ShareTemplate,
  DoctorAdviceType, Reminder, ShareTarget, ShareValidDays
} from '@/types/index'
import { photos as initialPhotos } from '@/data/photos'
import { messages as initialMessages } from '@/data/messages'
import { reminders as initialReminders } from '@/data/reminders'
import Taro from '@tarojs/taro'

const STORAGE_KEY = 'beauty_growth_album_state_v2'

const loadState = (): Partial<AppState> | null => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    console.info('[Store] loadState loaded from storage')
    return parsed
  } catch (e) {
    console.warn('[Store] loadState failed', e)
    return null
  }
}

const persistState = (state: Partial<AppState>) => {
  try {
    const toSave = {
      photos: state.photos,
      messages: state.messages,
      reminders: state.reminders,
      defaultPrivate: state.defaultPrivate,
      shareAuth: state.shareAuth,
      doctorVisible: state.doctorVisible,
      role: state.role,
      shareRecords: state.shareRecords
    }
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(toSave))
  } catch (e) {
    console.warn('[Store] persistState failed', e)
  }
}

const formatDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const formatDateOnly = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

interface AppState {
  photos: PhotoRecord[]
  messages: Message[]
  reminders: Reminder[]
  defaultPrivate: boolean
  shareAuth: boolean
  doctorVisible: boolean
  role: UserRole
  shareRecords: ShareRecord[]

  addPhoto: (photo: Omit<PhotoRecord, 'id' | 'annotations'>) => void
  updatePhoto: (id: string, updates: Partial<PhotoRecord>) => void
  setPhotoPrivate: (id: string, isPrivate: boolean) => void
  setPhotoVisibleToDoctor: (id: string, visible: boolean) => void
  addAnnotation: (photoId: string, annotation: Omit<PhotoAnnotation, 'id'>) => void
  setDoctorNote: (photoId: string, note: string, adviceType?: DoctorAdviceType) => void
  createFollowupReminder: (photoId: string) => Reminder | null

  addMessage: (msg: Omit<Message, 'id' | 'status' | 'createdAt'>) => void

  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  toggleReminder: (id: string) => void

  addShareRecord: (record: Omit<ShareRecord, 'id' | 'createdAt'>) => void

  setDefaultPrivate: (val: boolean) => void
  setShareAuth: (val: boolean) => void
  setDoctorVisible: (val: boolean) => void
  setRole: (role: UserRole) => void

  resetToDefault: () => void
}

const saved = loadState()

export const useAppStore = create<AppState>((set, get) => ({
  photos: saved?.photos ?? [...initialPhotos],
  messages: saved?.messages ?? [...initialMessages],
  reminders: saved?.reminders ?? [...initialReminders],
  defaultPrivate: saved?.defaultPrivate ?? false,
  shareAuth: saved?.shareAuth ?? true,
  doctorVisible: saved?.doctorVisible ?? true,
  role: saved?.role ?? 'customer',
  shareRecords: saved?.shareRecords ?? [],

  addPhoto: (photo) => {
    const id = 'p' + Date.now()
    const next = { ...photo, id, annotations: [] }
    if (next.isPrivate) next.visibleToDoctor = false
    const newPhotos = [next, ...get().photos]
    set({ photos: newPhotos })
    persistState(get())
    console.info('[Store] addPhoto', { id, treatmentId: photo.treatmentId, isPrivate: next.isPrivate })
  },

  updatePhoto: (id, updates) => {
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== id) return p
        const next = { ...p, ...updates }
        if (next.isPrivate) next.visibleToDoctor = false
        return next
      })
    }))
    persistState(get())
  },

  setPhotoPrivate: (id, isPrivate) => {
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== id) return p
        const next: PhotoRecord = { ...p, isPrivate }
        if (isPrivate) next.visibleToDoctor = false
        return next
      })
    }))
    persistState(get())
  },

  setPhotoVisibleToDoctor: (id, visible) => {
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== id) return p
        if (p.isPrivate && visible) return p
        return { ...p, visibleToDoctor: visible }
      })
    }))
    persistState(get())
  },

  addAnnotation: (photoId, annotation) => {
    const id = 'an' + Date.now()
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== photoId) return p
        return { ...p, annotations: [...p.annotations, { ...annotation, id }] }
      })
    }))
    persistState(get())
  },

  setDoctorNote: (photoId, note, adviceType) => {
    const now = new Date()
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== photoId) return p
        return {
          ...p,
          doctorNote: note,
          doctorNoteAt: formatDate(now),
          doctorAdviceType: adviceType ?? p.doctorAdviceType
        }
      })
    }))
    persistState(get())
  },

  createFollowupReminder: (photoId) => {
    const photo = get().photos.find(p => p.id === photoId)
    if (!photo) return null
    const now = new Date()
    const followupDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const reminder: Reminder = {
      id: 'r' + Date.now(),
      treatmentId: photo.treatmentId,
      treatmentName: photo.treatmentName,
      type: 'followup',
      title: '医生建议：需复诊',
      description: `根据 ${photo.date} ${photo.angle} 恢复照评估，建议一周内复诊确认恢复情况。${photo.doctorNote ? '医生备注：' + photo.doctorNote : ''}`,
      date: formatDateOnly(followupDate),
      time: '10:00',
      isCompleted: false,
      fromDoctor: true,
      relatedPhotoId: photo.id,
      relatedPhotoUrl: photo.imageUrl
    }
    set(state => ({ reminders: [reminder, ...state.reminders] }))
    persistState(get())
    console.info('[Store] createFollowupReminder', { id: reminder.id, photoId })
    return reminder
  },

  addMessage: (msg) => {
    const id = 'm' + Date.now()
    const createdAt = formatDate(new Date())
    const newMessages = [
      { ...msg, id, status: 'sent', createdAt },
      ...get().messages
    ]
    set({ messages: newMessages })
    persistState(get())
    console.info('[Store] addMessage', { id, type: msg.type })
  },

  addReminder: (reminder) => {
    const id = 'r' + Date.now()
    set(state => ({ reminders: [{ ...reminder, id }, ...state.reminders] }))
    persistState(get())
  },

  toggleReminder: (id) => {
    set(state => ({
      reminders: state.reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r)
    }))
    persistState(get())
  },

  addShareRecord: (record) => {
    const id = 's' + Date.now()
    const createdAt = formatDate(new Date())
    const newRecords = [
      { ...record, id, createdAt },
      ...get().shareRecords
    ]
    set({ shareRecords: newRecords })
    persistState(get())
  },

  setDefaultPrivate: (val) => {
    set({ defaultPrivate: val })
    persistState(get())
  },
  setShareAuth: (val) => {
    set({ shareAuth: val })
    persistState(get())
  },
  setDoctorVisible: (val) => {
    set({ doctorVisible: val })
    persistState(get())
  },
  setRole: (role) => {
    set({ role })
    persistState(get())
  },

  resetToDefault: () => {
    set({
      photos: [...initialPhotos],
      messages: [...initialMessages],
      reminders: [...initialReminders],
      defaultPrivate: false,
      shareAuth: true,
      doctorVisible: true,
      role: 'customer',
      shareRecords: []
    })
    try { Taro.removeStorageSync(STORAGE_KEY) } catch (e) {}
    console.info('[Store] reset to default')
  }
}))
