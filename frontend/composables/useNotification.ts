import { useNotificationStore } from "~~/stores/notification"
import { Notification } from "~~/types/notification"

export const useNotification = () => {
  const config = useRuntimeConfig()
  const store = useNotificationStore()
  const socket = ref()

  const joinNotificationRoom = (userId: string) => {
    if(process.client){
      socket.value = new WebSocket(`${config.public.wsClient}/notification/${userId}/`)
    }     
  }

  const receiveNotification = () => {
    if (socket.value) {     
      socket.value.onmessage = (e: any) => {
        const data = JSON.parse(e.data);
        if (data) {
          const notifications: Notification[] = data?.data?.notifications || []
          notifications.forEach((item: Notification) => store.pushNotification(item))
        }
      }
    }
  }

  const closeSocket = () => {
    if (socket.value) {
      socket.value.close()
    }
  }

  return {
    joinNotificationRoom,
    receiveNotification,
    closeSocket
  }
}