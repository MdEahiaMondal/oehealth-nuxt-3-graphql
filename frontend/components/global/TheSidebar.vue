<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCustomizerStore } from "~~/stores/customizer";
import { useAuthStore } from "~~/stores/auth";

const sidebarItemsForDoctor = ref([
  {
    icon: "home",
    title: "Start",
    to: "/admin",
  },
  {
    icon: "mail",
    title: "Messages",
    to: "/admin/messages",
  },
  {
    icon: "calendar",
    title: "Appointments",
    to: "/admin/appointments",
  },
  {
    icon: "user",
    title: "My Patients",
    to: "/admin/patients",
  },
  {
    icon: "user-plus",
    title: "My Invitations",
    to: "/admin/patient-invitations",
  },
  {
    icon: "bell",
    title: "Alerts",
    to: "/admin/alerts",
  },
]);
const sidebarItemsForPatients = ref([
  {
    icon: "home",
    title: "Start",
    to: "/admin",
  },
  {
    icon: "mail",
    title: "Messages",
    to: "/admin/messages",
  },
  {
    icon: "calendar",
    title: "Appointments",
    to: "/admin/appointments",
  },
  {
    icon: "rotate-ccw",
    title: "History",
    to: "/admin/history",
  },
  {
    icon: "bell",
    title: "Alerts",
    to: "/admin/alerts",
  },
]);

const customizer = useCustomizerStore();
const authUserStore = useAuthStore();
const { isDoctor, getUserProfile: authUser } = storeToRefs(authUserStore);

const setAvatarLetter = computed(() => {
  const fullName = `${authUser.value.firstName} ${authUser.value.lastName}`;
  let letters = fullName.match(/(?<=(\s|^))[a-z]/gi);
  let acronym = letters?.join("").toUpperCase();
  return acronym;
});

const fullName = computed(() => {
  return `${authUser.value.firstName} ${authUser.value.lastName}`;
});
</script>

<template>
  <ClientOnly>
    <v-navigation-drawer
      left
      v-model="customizer.Sidebar_drawer"
      elevation="10"
      :class="customizer.SidebarColor == 'white' ? '' : 'text-white'"
      rail-width="75"
      mobile-breakpoint="960"
      :rail="customizer.mini_sidebar"
      expand-on-hover
    >
      <!-- ---------------------------------------------- -->
      <!---Navigation -->
      <!-- ---------------------------------------------- -->
      <div class="scrollnavbar">
        <div class="profile">
          <div class="profile-pic">
            <v-btn
              v-if="authUser.avatar"
              elevation="0"
              icon
              color="transparent"
              variant="text"
              :ripple="false"
            >
              <v-avatar size="45" color="grey">
                <img :src="authUser.avatar" alt="Julia" />
              </v-avatar>
            </v-btn>
            <v-btn
              v-else
              elevation="0"
              icon
              color="transparent"
              variant="text"
              :ripple="false"
            >
              <v-avatar size="45" color="grey">
                {{ setAvatarLetter }}
              </v-avatar>
            </v-btn>
          </div>
          <div class="profile-name">
            <h5>{{ fullName }}</h5>
          </div>
        </div>

        <v-list v-if="isDoctor" class="px-3 py-4" rounded="lg">
          <v-list-item
            active-class="active-color"
            active-color="#ffffff"
            class="mb-1"
            v-for="(item, i) in sidebarItemsForDoctor"
            :key="i"
            :to="item.to"
            :value="item"
            rounded="lg"
          >
            <v-list-item-title
              class="text-subtitle-1 font-weight-regular ml-5"
              >{{ item.title }}</v-list-item-title
            >
            <template v-slot:prepend>
              <ClientOnly>
                <vue-feather
                  :type="item.icon"
                  stroke-width="1"
                  size="24"
                ></vue-feather>
              </ClientOnly>
            </template>
          </v-list-item>
        </v-list>

        <v-list v-else class="px-3 py-4" rounded="lg">
          <v-list-item
            active-class="active-color"
            active-color="#ffffff"
            class="mb-1"
            v-for="(item, i) in sidebarItemsForPatients"
            :key="i"
            :to="item.to"
            :value="item"
            rounded="lg"
          >
            <v-list-item-title
              class="text-subtitle-1 font-weight-regular ml-5"
              >{{ item.title }}</v-list-item-title
            >
            <template v-slot:prepend>
              <ClientOnly>
                <vue-feather
                  :type="item.icon"
                  stroke-width="1"
                  size="24"
                ></vue-feather>
              </ClientOnly>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<style scoped>
.active-color {
  background-color: rgb(30, 136, 229) !important;
}
</style>
