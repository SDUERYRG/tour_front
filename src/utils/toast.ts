import { reactive } from 'vue'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

export const toasts = reactive<ToastItem[]>([])

let idCount = 0

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 2500) => {
  const id = idCount++
  toasts.push({ id, message, type, duration })
}
