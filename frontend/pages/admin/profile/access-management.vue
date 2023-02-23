<script setup lang="ts">
import { format } from "date-fns";
import ConfirmationDialog from "~~/components/base/ConfirmationDialog.vue";
import { PatientInvitationsType } from "~~/types/company";
import { useAuth } from "~~/composables/useAuth";
import { usePatient } from "~~/composables/usePatient";
import { useInvitation } from "~~/composables/useInvitation";

definePageMeta({
  layout: "admin",
  middleware: "patient",
});

components: {
  ConfirmationDialog;
}

const { getUserProfile } = useAuth();
const { fetchUserRequest, getUserRequest } = usePatient();
const { acceptPatientInvitation, rejectPatientInvitation } = useInvitation();

const authUser = computed<any>(() => getUserProfile.value);
const allRequests = computed(() => getUserRequest.value);

const search = ref("");
const confirmation = ref();
const headers = ref([
  { text: "Doctor Name", value: "doctorName" },
  { text: "Granted access data", value: "joinedDatetime" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

const datetime = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy");
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
          from: "accessManagement",
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
          from: "accessManagement",
          requestType: "PATIENT_REVOKE_DOCTOR_ACCESS"
        });
      }
      return false;
    });
};

onMounted(async () => {
  await fetchUserRequest({
    userId: Number(authUser.value?.id),
    groupName: "Patient",
  });
});
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="headers"
        visibility="d-none"
        second-button-visibility="d-none"
        :flat="true"
        base-class="rounded-0 px-3"
      >
        <template #title>Manage the access to my data</template>
        <template v-if="allRequests" #tableBody>
          <tr
            v-for="(item, index) in allRequests"
            :key="index"
            :class="[item.status.name === 'Approve' ? '' : 'tw-bg-gray-200']"
          >
            <td>{{ item.doctorName }}</td>
            <td>
              {{ item.joinedDatetime ? datetime(item.joinedDatetime) : "" }}
            </td>
            <td>
              <v-btn
                v-if="item.status.name === 'Approve'"
                @click="rejectPatientInvitationEvent(item)"
                class="text-info cursor-pointer"
                small
                icon
                flat
                color="red"
                variant="text"
                title="Reject Approved"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
                <v-btn
                v-if="item.status.name === 'Reject'"
                  @click="acceptPatientInvitationEvent(item)"
                  class="cursor-pointer"
                  small
                  icon
                  flat
                  variant="text"
                  color="black"
                  title="Accept Request"
                >
                  <v-icon>mdi-arrow-u-left-top</v-icon>
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
