import { defineStore } from "pinia";
import { Notification, NotificationResult } from "~~/types/notification";
import {
  fetchNotificationsQuery,
  updateNotificationsMutation,
  deleteNotificationsMutation,
} from "~/query/notification";

export const useNotificationStore = defineStore("notification", () => {
  const notificationResults = ref<Notification[]>([]);

  const notifications = computed(() => notificationResults.value);

  const fetchAllNotification = async (userId: number) => {
    const id = Number(userId);
    const variables = { userId: id };
    const { onResult: fetchNotificationIsDone } = useQuery<NotificationResult>(
      fetchNotificationsQuery,
      variables
    );
    fetchNotificationIsDone(({ data }: any) => {
      notificationResults.value = data.notifications || [];
    });
  };

  const pushNotification = (notification: Notification) => {
    notificationResults.value.unshift(notification);
  };

  const updateNotification = async (id: any, isRead: any) => {
    const variables = { id, isRead };
    const { mutate: setUpdateNotification } = useMutation(
      updateNotificationsMutation,
      { variables }
    );
    return await setUpdateNotification();
  }

  const deleteNotification = async (id: any) => {
    const variables = { id };
    const { mutate: setDeleteNotification } = useMutation(
      deleteNotificationsMutation,
      { variables }
    );
    return await setDeleteNotification();
  };

  return {
    notifications,
    fetchAllNotification,
    pushNotification,
    updateNotification,
    deleteNotification,
  };
});
