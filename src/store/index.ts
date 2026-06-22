import { create } from 'zustand'
import { PhotoRecord, Message, PhotoAnnotation, UserRole, ShareRecord, ShareTemplate } from '@/types/index'
import { photos as initialPhotos, angleTemplates } from '@/data/photos'
import { messages as initialMessages } from '@/data/messages'
import Taro from '@tarojs/taro'

const STORAGE_KEY = 'beauty_growth_album_state_v1'

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

interface AppState {
  photos: PhotoRecord[]
  messages: Message[]
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
  setDoctorNote: (photoId: string, note: string) => void

  addMessage: (msg: Omit<Message, 'id' | 'status' | 'createdAt'>) => void

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
  defaultPrivate: saved?.defaultPrivate ?? false,
  shareAuth: saved?.shareAuth ?? true,
  doctorVisible: saved?.doctorVisible ?? true,
  role: saved?.role ?? 'customer',
  shareRecords: saved?.shareRecords ?? [],

  addPhoto: (photo) => {
    const id = 'p' + Date.now()
    const newPhotos = [
      { ...photo, id, annotations: [] },
      ...get().photos
    ]
    set({ photos: newPhotos })
    persistState(get())
    console.info('[Store] addPhoto', { id, treatmentId: photo.treatmentId })
  },

  updatePhoto: (id, updates) => {
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, ...updates } : p)
    }))
    persistState(get())
  },

  setPhotoPrivate: (id, isPrivate) => {
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== id) return p
        const next: PhotoRecord = { ...p, isPrivate }
        if (isPrivate) {
          next.visibleToDoctor = false
        }
        return next
      })
    }))
    persistState(get())
  },

  setPhotoVisibleToDoctor: (id, visible) => {
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, visibleToDoctor: visible } : p)
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

  setDoctorNote: (photoId, note) => {
    const now = new Date()
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== photoId) return p
        return { ...p, doctorNote: note, doctorNoteAt: formatDate(now) }
      })
    }))
    persistState(get())
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
