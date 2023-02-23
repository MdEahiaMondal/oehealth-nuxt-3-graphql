<script setup lang="ts">
import ConfirmationDialog from "~/components/base/ConfirmationDialog.vue";
import { useAuth } from "~~/composables/useAuth";
import { useInvitation } from "~/composables/useInvitation";
import { PatientInvitationsType } from "~~/types/company";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  layout: "admin",
  middleware: "doctor",
});

const { getUserProfile } = useAuth();
const {
  fetchClinicInvitations,
  acceptPatientInvitation,
  rejectPatientInvitation,
  getClinicInvitations,
} = useInvitation();
const { getPendingStatus } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const clinicInvitations = computed<any>(() => getClinicInvitations.value);
const pendingStatus = computed(() => getPendingStatus.value);

const confirmation = ref();
const loading = ref(false);
const search = ref("");
const headers = ref([
  { text: "Clinic Name", value: "company" },
  { text: "Requested By", value: "requestedBy" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

const fetchNewClinicRequest = async () => {
  await fetchClinicInvitations({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(pendingStatus.value?.id),
    isOwner: false,
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
          from: "clinicInvitations",
          requestType: "DOCTOR_APPROVAL",
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
          from: "clinicInvitations",
        });
      }
      return false;
    });
};

onMounted(async () => {
  await fetchClinicInvitations({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(pendingStatus.value?.id),
    isOwner: false,
  });
});
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="headers"
        buttonText="Reload"
        @buttonFunction="fetchNewClinicRequest"
        second-button-visibility="d-none"
        :flat="true"
        base-class="rounded-0 px-3"
      >
        <template #title>Manage the access to my data</template>
        <template v-if="clinicInvitations" #tableBody>
          <tr v-for="(item, index) in clinicInvitations" :key="index">
            <td>{{ item.company ? item.company : "" }}</td>
            <td>{{ item.requestedBy ? item.requestedBy : "" }}</td>
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
