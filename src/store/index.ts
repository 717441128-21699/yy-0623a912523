import { create } from 'zustand'
import { PhotoRecord, Message, PhotoAnnotation } from '@/types/index'
import { photos as initialPhotos, angleTemplates } from '@/data/photos'
import { messages as initialMessages } from '@/data/messages'

interface AppState {
  photos: PhotoRecord[]
  messages: Message[]
  defaultPrivate: boolean
  shareAuth: boolean
  doctorVisible: boolean

  addPhoto: (photo: Omit<PhotoRecord, 'id' | 'annotations'>) => void
  updatePhoto: (id: string, updates: Partial<PhotoRecord>) => void
  setPhotoPrivate: (id: string, isPrivate: boolean) => void
  addAnnotation: (photoId: string, annotation: Omit<PhotoAnnotation, 'id'>) => void

  addMessage: (msg: Omit<Message, 'id' | 'status' | 'createdAt'>) => void

  setDefaultPrivate: (val: boolean) => void
  setShareAuth: (val: boolean) => void
  setDoctorVisible: (val: boolean) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  photos: [...initialPhotos],
  messages: [...initialMessages],
  defaultPrivate: false,
  shareAuth: true,
  doctorVisible: true,

  addPhoto: (photo) => {
    const id = 'p' + Date.now()
    set(state => ({
      photos: [
        { ...photo, id, annotations: [] },
        ...state.photos
      ]
    }))
    console.info('[Store] addPhoto', { id, treatmentId: photo.treatmentId })
  },

  updatePhoto: (id, updates) => {
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, ...updates } : p)
    }))
  },

  setPhotoPrivate: (id, isPrivate) => {
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, isPrivate } : p)
    }))
  },

  addAnnotation: (photoId, annotation) => {
    const id = 'an' + Date.now()
    set(state => ({
      photos: state.photos.map(p => {
        if (p.id !== photoId) return p
        return { ...p, annotations: [...p.annotations, { ...annotation, id }] }
      })
    }))
  },

  addMessage: (msg) => {
    const id = 'm' + Date.now()
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    set(state => ({
      messages: [
        { ...msg, id, status: 'sent', createdAt },
        ...state.messages
      ]
    }))
    console.info('[Store] addMessage', { id, type: msg.type })
  },

  setDefaultPrivate: (val) => set({ defaultPrivate: val }),
  setShareAuth: (val) => set({ shareAuth: val }),
  setDoctorVisible: (val) => set({ doctorVisible: val })
}))
