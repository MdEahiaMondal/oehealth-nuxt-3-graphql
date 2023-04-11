<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";
import { companyUserType } from "~~/types/companyUser";
import { userLookupType } from "~~/types/common";
import { useClinic } from "~~/composables/useClinic";
import { useInvitationStore } from "~/stores/invitation";

definePageMeta({
  layout: "admin",
  middleware: "auth"
});

const invitationStore = useInvitationStore();
const { fetchUserLookup } = invitationStore;
const { fetchAppointments } = useAppointment();

const {
  getAuthUserCompanies: userCompanies,
  getUserActiveCompany: activeClinic,
  fetchAuthUserCompanies,
  fetchRelatedCompaniesByAuthUser,
  setActiveClinic,
  setCurrentActiveClinic,
} = useClinic();
const { isDoctor, getUserProfile: authUser } = useAuth();

const currentClinic = ref("");

const manageFetchAllCompanies = async () => {
  const { data }: any = await fetchUserLookup();
  const { approvalStatuses } = data;
  const status = approvalStatuses.find((item: userLookupType) => {
    return item.name === "Approve";
  });
  await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(status.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  await fetchRelatedCompaniesByAuthUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(status.id),
    isOwner: false,
    approvalById: null,
    langId: authUser.value?.lang?.id,
  });
};

const setCurrentClinic = () => {
  const companies = userCompanies.value?.filter((clinic: companyUserType) => {
    return Number(clinic.id) !== Number(currentClinic.value);
  });
  if (companies && companies.length > 0) {
    companies.forEach((clinic: companyUserType) => {
      setCurrentActiveClinic({
        companyUserId: Number(clinic.id),
        isActive: false,
        status: "Approve",
      });
    });
  }

  setCurrentActiveClinic({
    companyUserId: Number(currentClinic.value),
    isActive: true,
    status: "Approve",
  });
  setActiveClinic(currentClinic.value);
};

watch(activeClinic, async () => {
  currentClinic.value = activeClinic?.value?.node?.id;
});

onMounted(async () => {
  if (isDoctor.value) {
    manageFetchAllCompanies()
  } else {
    await fetchAppointments({
      patientId: Number(authUser.value?.id),
      doctorId: null,
      companyId: null,
      isActive: null
    });
  }
});
</script>

<template>
  <v-container fluid class="down-top-padding pa-0">
    <v-row v-if="isDoctor" class="mt-2 pa-0">
      <v-col cols="12" md="6">
        <v-card class="px-4 py-6" height="100%">
          <ClientOnly>
            <v-toolbar color="#fff">
              <v-toolbar-title class="title text-h6 mb-6">{{
                $t("startPage.currentClinic")
              }}</v-toolbar-title>
            </v-toolbar>
          </ClientOnly>
          <v-radio-group class="ml-6" @change="setCurrentClinic" v-model="currentClinic">
            <v-radio color="green" v-for="clinic in userCompanies" :value="clinic.id" :label="clinic.company">
            </v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-8" height="100%">
          <CommonCalenderEvents />
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-card class="pa-8" height="100%">
          <CommonCalenderEvents />
        </v-card>
      </v-col>
    </v-row>
</v-container>
</template>
