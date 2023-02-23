<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useNotificationStore } from "~~/stores/notification";
import { useAuth } from "~~/composables/useAuth";
import { useCommonStore } from "~~/stores/common";
import { useNotification } from "~~/composables/useNotification";

const commonStore = useCommonStore();
const { showingOverlay } = storeToRefs(commonStore);

const notificationStore = useNotificationStore();
const { getUserProfile } = useAuth();
const authUser = computed(() => getUserProfile.value);

const { fetchAllNotification } = notificationStore;
await fetchAllNotification(Number(authUser.value?.id));
const { joinNotificationRoom, receiveNotification, closeSocket } =
  useNotification();

onMounted(async() => {
  await joinNotificationRoom(authUser.value?.id);
  await receiveNotification();
});

onBeforeUnmount(() => {
  closeSocket();
});
</script>

<template>
  <v-app>
    <v-main>
      <TheHeader />
      <TheSidebar />
      <v-container fluid class="page-wrapper">
        <slot />
      </v-container>
      <TheFooter />
    </v-main>

    <client-only>
      <v-overlay
        :model-value="showingOverlay"
        class="align-center justify-center"
      >
        <v-card color="primary" dark>
          <v-card-text>
            Please wait...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-overlay>
    </client-only>
  </v-app>
</template>
