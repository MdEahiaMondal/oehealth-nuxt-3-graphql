<script setup lang="ts">
import ConfirmationDialog from "~/components/base/ConfirmationDialog.vue";
import { PatientInvitationsType } from "~~/types/company";
import { useAuth } from "~~/composables/useAuth";
import { usePatient } from "~/composables/usePatient";
import { useInvitation } from "~/composables/useInvitation";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  layout: "admin",
});

const { getUserProfile } = useAuth();
const { getUserRequest } = usePatient();
const {
  fetchDoctorInvitations,
  acceptPatientInvitation,
  rejectPatientInvitation,
  getAllDoctorInvitations,
  SET_DOCTOR_INVITATIONS_EMPTY,
} = useInvitation();
const { fetchAuthUserCompanies, getAuthUserCompanies } = useClinic();
const { getApprovedStatus, getPendingStatus } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const allRequests = computed(() => getUserRequest.value);
const authUserCompanies = computed<any>(() => getAuthUserCompanies.value);
const doctorInvitations = computed<any>(() => getAllDoctorInvitations.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const pendingStatus = computed(() => getPendingStatus.value);

const search = ref("");
const confirmation = ref();
const headers = ref([
  { text: "Clinic Name", value: "company" },
  { text: "User Name", value: "name" },
  { text: "User Email", value: "email" },
  { text: "User Phone", value: "phone" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

watch(authUserCompanies, () => {
  authUserCompanies.value.forEach(async (clinic: any) => {
    await fetchDoctorInvitations({
      companyId: Number(clinic.companyId),
      groupName: "Doctor",
      statusId: Number(pendingStatus.value?.id),
    });
  });
});

const fetchNewDoctorRequest = () => {
  authUserCompanies.value.forEach(async (clinic: any) => {
    await fetchDoctorInvitations({
      companyId: Number(clinic.companyId),
      groupName: "Doctor",
      statusId: Number(pendingStatus.value?.id),
    });
  });
};

const acceptPatientInvitationEvent = async (item: PatientInvitationsType) => {
  confirmation.value
    .open("Permission", "Are you willing to accept?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        await acceptPatientInvitation({
          id: Number(item.id),
          doctorId: null,
          approvalById: Number(authUser.value?.id),
          status: "Approve",
          joinedDatetime: new Date().toISOString(),
          approvalAt: new Date().toISOString(),
          from: "doctorInvitations",
          requestType: "OWNER_APPROVAL",
        });
      }
      return false;
    });
};

const rejectPatientInvitationEvent = async (item: PatientInvitationsType) => {
  confirmation.value
    .open("Permission", "Are you want to reject?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        await rejectPatientInvitation({
          id: Number(item.id),
          doctorId: null,
          approvalById: Number(authUser.value?.id),
          status: "Reject",
          approvalAt: new Date().toISOString(),
          from: "doctorInvitations",
        });
      }
      return false;
    });
};

onMounted(async () => {
  SET_DOCTOR_INVITATIONS_EMPTY();
  await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
});
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="headers"
        buttonText="Reload"
        second-button-visibility="d-none"
        :flat="true"
        @buttonFunction="fetchNewDoctorRequest"
        base-class="rounded-0 px-3"
      >
        <template #title>Manage the access to my data</template>
        <template v-if="allRequests" #tableBody>
          <tr v-for="(item, index) in doctorInvitations" :key="index">
            <td>{{ item.company ? item.company : "" }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>
              <v-btn
                @click="acceptPatientInvitationEvent(item)"
                class="mr-2"
                color="success"
                size="small"
              >
                Accept
              </v-btn>
              <v-btn
                @click="rejectPatientInvitationEvent(item)"
                color="error"
                size="small"
              >
                Reject
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-else #noData>No Data Found</template>
      </CommonEditableTable>
    </v-col>
    <ConfirmationDialog ref="confirmation" />
  </v-row>
</template>

<style>
.z-index {
  z-index: 2;
  margin-top: -30px;
}
.mins-z-index {
  z-index: 0;
}
</style>
