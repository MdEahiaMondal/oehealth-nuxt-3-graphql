<script setup lang="ts">
import { format } from "date-fns";
import ConfirmationDialog from "~/components/base/ConfirmationDialog.vue";
import { useAuth } from "~~/composables/useAuth";
import { useInvitation } from "~/composables/useInvitation";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";
import { PatientInvitationsType } from "~~/types/company";

definePageMeta({
  layout: "admin",
  middleware: "doctor",
});

components: {
  ConfirmationDialog;
}

const { getUserProfile } = useAuth();
const {
  acceptPatientInvitation,
  rejectPatientInvitation,
  fetchPatientInvitations,
  getAllPatientsInvitations,
} = useInvitation();
const { fetchActiveCompanyForUser } = useClinic();
const { getApprovedStatus, getPendingStatus } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const pendingStatus = computed(() => getPendingStatus.value);
const patientInvitations = computed(() => getAllPatientsInvitations.value);
const activeCompany = ref<any>();
const confirmation = ref();
const search = ref("");

const searchInvitations: any = computed(() => {
  return patientInvitations.value.filter((invitation) => {
    return (
      invitation.name.toLowerCase().includes(search.value.toLowerCase()) ||
      invitation.company.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

const headers = ref([
  { text: "Name", value: "name" },
  { text: "Company Name", value: "company" },
  { text: "Email", value: "email" },
  { text: "Phone", value: "phone" },
  { text: "Requested At", value: "requestedAt" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

const datetime = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy");
};

const managePatientInvitations = async () => {
  fetchPatientInvitations({
    companyId: Number(activeCompany.value?.id),
    groupName: "Patient",
    doctorId: Number(authUser.value?.id),
    userId: null,
    statusId: Number(pendingStatus.value?.id),
    from: "patientInvitations",
  });
};

const getActiveCompany = async () => {
  const userCompany: any = await fetchActiveCompanyForUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isActive: true,
  });

  if (userCompany && userCompany.edges && userCompany.edges.length > 0) {
    activeCompany.value = userCompany.edges[0].node.company;
  }
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
          from: "myInvitation",
          requestType: "DOCTOR_ACCEPT_PATIENT_REQUEST",
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
          from: "myInvitation",
        });
      }
      return false;
    });
};

const fetchNewPatientRequest = async () => {
  managePatientInvitations();
};

onMounted(async () => {
  await getActiveCompany();
  await managePatientInvitations();
});
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="headers"
        button-text="RELOAD"
        second-button-visibility="d-none"
        @buttonFunction="fetchNewPatientRequest"
      >
        <template #search>
          <v-text-field
            label="Search"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            hide-details
            v-model="search"
          ></v-text-field>
        </template>
        <template v-if="searchInvitations" #tableBody>
          <tr v-for="(item, index) in searchInvitations" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.company }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.phone }}</td>
            <td>{{ datetime(item.requestedAt) }}</td>
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
        <template v-if="searchInvitations.length === 0" #noData
          >No Data Found</template
        >
      </CommonEditableTable>
    </v-col>
    <ConfirmationDialog ref="confirmation" />
  </v-row>
</template>
