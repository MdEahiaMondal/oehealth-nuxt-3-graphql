<script setup lang="ts">
import { storeToRefs } from "pinia";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import { useCustomizerStore } from "~~/stores/customizer";
import { useNotificationStore } from "~~/stores/notification";
import { useAuthStore } from "~~/stores/auth";
import { useCommonStore } from "~~/stores/common";
import { useClinicStore } from "~~/stores/clinic";

const authUserStore = useAuthStore();
const notificationStore = useNotificationStore();
const commonStore = useCommonStore();
const customizer = useCustomizerStore();
const clinicStore = useClinicStore();
const router = useRouter();

const { isDoctor, getUserProfile: authUser } = storeToRefs(authUserStore);
const { notifications: allNotification }: any = storeToRefs(notificationStore);
const { getGroups, getApprovedStatus } = storeToRefs(commonStore);
const { logOut, updateUserGroup, reFetchAuthUserProfile } = authUserStore;
const { fetchAllNotification, updateNotification, deleteNotification } =
  notificationStore;
const { setOverlay } = commonStore;

const {
  fetchAuthUserCompanies,
  createUserCompany,
  fetchActiveCompanyForUser,
  createCompanyUserForCompanyOwner,
} = clinicStore;

const notificationIsRead: any = computed(
  () => allNotification.value.filter((item: any) => !item.isRead).length
);

const updateSelectedNotification = async (id: any, isRead: any) => {
  updateNotification(id, isRead);
  await fetchAllNotification(Number(authUser.value?.id));
};

const deleteSelectedNotification = async (id: any) => {
  deleteNotification(id);
  await fetchAllNotification(Number(authUser.value?.id));
};

const datetime = (date: string) => {
  return format(new Date(date), "dd/MM/yy h:mm a");
};

const redirectUser = (notificationType: any) => {
  if (notificationType === "OWNER_REQUEST") {
    router.push("/admin/profile/clinic-management/clinic-invitations");
  } else if (notificationType === "DOCTOR_REQUEST") {
    router.push("/admin/profile/clinic-management/doctor-invitations");
  } else if (notificationType === "DOCTOR_APPROVAL") {
    router.push("/admin/profile/clinic-management");
  } else if (notificationType === "OWNER_APPROVAL") {
    router.push("/admin/profile/clinic-management");
  } else if (notificationType === "PATIENT_REQUEST_DOCTOR") {
    router.push("/admin/patient-invitations");
  } else if (notificationType === "DOCTOR_ACCEPT_PATIENT_REQUEST") {
    router.push("/admin");
  } else if (notificationType === "DOCTOR_REVOKE_PATIENT_ACCESS") {
    router.push("/admin/profile/access-management");
  } else if (notificationType === "PATIENT_REVOKE_DOCTOR_ACCESS") {
    router.push("/admin/patients");
  }
};

const setAvatarLetter = computed(() => {
  const fullName = `${authUser.value.firstName} ${authUser.value.lastName}`;
  let letters = fullName.match(/(?<=(\s|^))[a-z]/gi);
  let acronym = letters?.join("").toUpperCase();
  return acronym;
});

const showSearch = ref(false);
const href = ref(undefined);
const searchbox = () => {
  showSearch.value = !showSearch.value;
};

const allGroups = computed(() => getGroups.value);
const approvedStatus = computed(() => getApprovedStatus.value);

const userSwitch = async () => {
  setOverlay(true);

  const doctorTypeGroup = allGroups.value.find((item: any) => {
    return item.name === "Doctor";
  });

  const groupName = isDoctor.value ? "Patient" : "Doctor";

  await updateUserGroup({
    userId: authUser?.value.id,
    group: groupName,
  });

  const isCompanyEmpty = await checkCompaniesEmptyOrNot();

  if (isCompanyEmpty) {
    // user company
    const isActiveCompany = await isExistActiveCompany();

    const { createCompany }: any = await createUserCompany({
      name: authUser.value?.firstName + " " + authUser.value?.lastName,
      ...authUser.value,
      createdBy: authUser.value?.id,
      updatedBy: authUser.value?.id,
    });

    // create company user
    await createCompanyUserForCompanyOwner({
      companyId: createCompany?.company.id,
      userId: authUser?.value.id,
      doctorId: null,
      groupId: Number(doctorTypeGroup?.id),
      status: "Approve",
      isOwner: true,
      isActive: !isActiveCompany,
      joinedDatetime: new Date().toISOString(),
      approvalById: authUser?.value.id,
      approvalAt: new Date().toISOString(),
      requestedBy: authUser?.value.id,
    });
  }

  await reFetchAuthUserProfile();

  setOverlay(false);
  location.reload();
};

const isExistActiveCompany = async () => {
  const userCompany: any = await fetchActiveCompanyForUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isActive: true,
  });

  if (userCompany && userCompany.edges && userCompany.edges.length > 0) {
    return true;
  } else {
    return false;
  }
};

const checkCompaniesEmptyOrNot = async () => {
  const response: any = await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  return response && response.length === 0 ? true : false;
};
</script>

<template>
  <ClientOnly>
    <v-app-bar
      :color="customizer.darktheme ? '' : customizer.navbarColor"
      elevation="5"
      :class="[
        'v-topbar',
        customizer.navbarColor == '#f6f6f6' ? '' : 'text-white',
      ]"
      class="min-width"
    >
      <div class="pa-4">
        <BaseLogo />
      </div>
      <v-app-bar-nav-icon
        class="hidden-sm-and-down"
        @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      />
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click.stop="customizer.SET_SIDEBAR_DRAWER"
      />
      <!-- ---------------------------------------------- -->
      <!---Search part -->
      <!-- ---------------------------------------------- -->
      <v-btn text icon color="lighten-2" @click="searchbox">
        <vue-feather type="search" class="feather-sm"></vue-feather>
      </v-btn>
      <v-sheet v-if="showSearch" class="searchinput pa-2 pt-8" elevation="10">
        <v-text-field
          color="success"
          label="Search"
          placeholder="Search Now"
          variant="outlined"
          append-icon="mdi-close"
          density="compact"
          @click:append="searchbox"
        ></v-text-field>
      </v-sheet>
      <v-spacer />
      <!-- ---------------------------------------------- -->
      <!-- Notification -->
      <!-- ---------------------------------------------- -->
      <v-menu anchor="bottom end" origin="auto">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-badge color="error" :content="notificationIsRead">
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-list class="py-6" elevation="10" rounded="lg" min-width="475">
          <h4 class="text-h6 pl-5 pb-4">Notifications</h4>

          <perfect-scrollbar>
            <v-list-item
              class="pa-0"
              v-for="(item, i) in allNotification"
              :key="i"
              :value="item"
              @click="href"
              rounded="lg"
            >
              <!-- pa-2 pl-3 mt-2 mx-6 -->
              <v-list-item-title
                @click="updateSelectedNotification(item.id, true)"
                class="py-3 px-6"
                :class="!item.isRead ? 'tw-bg-gray-200' : ''"
              >
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div @click="redirectUser(item.notificationType)">
                      <h4
                        v-if="item.notificationType === 'OWNER_REQUEST'"
                        class="text-black"
                      >
                        {{ $t("notification.clinic") }}
                        {{ item.company.name }}
                        {{ $t("notification.ownerRequest") }}
                      </h4>
                      <h4
                        v-if="item.notificationType === 'DOCTOR_REQUEST'"
                        class="black--text font-weight-medium"
                      >
                        {{ $t("notification.doctor") }}
                        {{ item.createdBy.name }}
                        {{ $t("notification.doctorRequest") }}
                        {{ item.company.name }}
                      </h4>
                      <h4
                        v-if="item.notificationType === 'DOCTOR_APPROVAL'"
                        class="black--text font-weight-medium"
                      >
                        Dr. {{ item.createdBy.name }}
                        {{ $t("notification.approval") }}
                      </h4>
                      <h4
                        v-if="item.notificationType === 'OWNER_APPROVAL'"
                        class="black--text font-weight-medium"
                      >
                        Clinic {{ item.company.name }}
                        {{ $t("notification.approval") }}
                      </h4>
                      <h4
                        v-if="
                          item.notificationType === 'PATIENT_REQUEST_DOCTOR'"
                          class="black--text font-weight-medium"
                      >
                        {{ item.createdBy.name }}
                        {{ $t("notification.patientRequestDoctor") }}
                      </h4>
                      <h4
                        v-if="
                          item.notificationType ===
                          'DOCTOR_ACCEPT_PATIENT_REQUEST'
                        "
                        class="black--text font-weight-medium"
                      >
                        Clinic {{ item.createdBy.name }}
                        {{ $t("notification.patientApproval") }}
                      </h4>
                      <h4
                        v-if="
                          item.notificationType ===
                          'DOCTOR_REVOKE_PATIENT_ACCESS'
                        "
                        class="black--text font-weight-medium"
                      >
                        Your Dentist {{ item.createdBy.name }} has revoked your
                        access to his history
                      </h4>
                      <h4
                        v-if="
                          item.notificationType ===
                          'PATIENT_REVOKE_DOCTOR_ACCESS'
                        "
                        class="black--text font-weight-medium"
                      >
                        Your Patient {{ item.createdBy.name }} has revoked your
                        access to his history
                      </h4>
                      <p class="text-caption text-grey-darken-1">
                        {{ datetime(item.createdAt) }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon="mdi-dots-vertical"
                          v-bind="props"
                          class="ml-4"
                          density="compact"
                          variant="text"
                          flat
                        ></v-btn>
                      </template>

                      <v-list>
                        <v-list-item
                          @click="updateSelectedNotification(item.id, true)"
                          class="tw-cursor-pointer hover:tw-bg-gray-200"
                        >
                          <v-list-item-title>Mark as read</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          class="tw-cursor-pointer hover:tw-bg-gray-200"
                          @click="deleteSelectedNotification(item.id)"
                        >
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-list-item-title>
            </v-list-item>
            <div
              v-if="allNotification.length === 0"
              class="black--text font-weight-medium no-notification-message"
            >
              <h4>No notification found</h4>
            </div>
          </perfect-scrollbar>
        </v-list>
      </v-menu>
      <!-- ---------------------------------------------- -->
      <!-- User Profile -->
      <!-- ---------------------------------------------- -->
      <v-menu anchor="bottom end" origin="auto">
        <template v-if="authUser.avatar" v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="px-1 mr-4"
            elevation="0"
            color="transparent"
            plain
            :ripple="false"
          >
            <v-avatar size="35">
              <img :src="authUser.avatar" width="40" alt="Julia" />
            </v-avatar>
          </v-btn>
        </template>
        <template v-else v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            class="px-1 mr-4"
            elevation="0"
            color="transparent"
            plain
            :ripple="false"
          >
            <v-avatar size="35" color="grey"> {{ setAvatarLetter }}</v-avatar>
          </v-btn>
        </template>

        <v-list class="pa-6" elevation="10" rounded="lg" min-width="210">
          <v-list-item
            active-class="active-color mb-2"
            active-color="#ffffff"
            rounded="lg"
            to="/admin/profile/info"
          >
            <v-list-item-title>{{ $t("header.profile") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            active-class="active-color mb-2"
            active-color="#ffffff"
            rounded="lg"
            v-if="isDoctor"
            @click="userSwitch"
          >
            <v-list-item-title
              >{{ $t("header.switchAs") }}
              {{ isDoctor ? "Patient" : "Doctor" }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item
            active-class="active-color mb-2"
            active-color="#ffffff"
            rounded="lg"
            @click="logOut"
          >
            <v-list-item-title>{{ $t("header.logout") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </ClientOnly>
</template>

<style lang="scss">
.min-width {
  min-width: 100vw !important;
}

.ps {
  height: 450px;
}

.rounded-lg {
  border-radius: 20px;
}

.active-color {
  background-color: rgb(30, 136, 229) !important;
}

.no-notification-message {
  height: 100%;
  min-width: 475px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
