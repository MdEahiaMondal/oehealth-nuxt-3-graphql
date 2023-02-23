<script setup lang="ts">
import ConfirmationDialog from "~/components/base/ConfirmationDialog.vue";
import { User } from "~~/types/user";
import { PatientInvitationsType } from "~~/types/company";
import { useAuth } from "~~/composables/useAuth";
import { useInvitation } from "~~/composables/useInvitation";
import { usePatient } from "~~/composables/usePatient";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const { getUserProfile } = useAuth();
const {
  acceptPatientInvitation,
  rejectPatientInvitation,
  getClinicInvitations,
  fetchPatientInvitations,
} = useInvitation();
const { fetchActiveCompanyForUser } = useClinic();
const { getMyPatients } = usePatient();
const { getApprovedStatus } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const patients = computed(() => getMyPatients.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const activeCompany = ref<any>();
const search: any = ref("");
const confirmation = ref();

const searchPatients: any = computed(() => {
  return patients.value.filter((patient) => {
    return patient.requestedBy
      .toLowerCase()
      .includes(search.value.toLowerCase());
  });
});

const headers = ref([
  { text: "Patient", value: "name" },
  { text: "Birthdate", value: "dateOfBirth" },
  { text: "Chat", value: "chat", sortable: false, align: "center" },
  {
    text: "Check the history",
    value: "history",
    sortable: false,
    align: "center",
  },
  { text: "Delete access", value: "action", sortable: false, align: "center" },
]);
const openChat = (user: User) => {
  router.push("/admin/messages?patient=" + user.userId);
};

const openAppointment = (user: User) => {
  router.push("/admin/appointments?patient=" + user.userId);
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
          from: "myPatient",
          requestType:'DOCTOR_ACCEPT_PATIENT_REQUEST'
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
          from: "myPatient",
          requestType: "DOCTOR_REVOKE_PATIENT_ACCESS"
        });
      }
      return false;
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

onMounted(async () => {
  await getActiveCompany();
  await fetchPatientInvitations({
    companyId: Number(activeCompany.value?.id),
    groupName: "Patient",
    doctorId: Number(authUser.value?.id),
    userId: null,
    statusId: null,
    from: "myPatients",
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
        <template v-if="searchPatients" #tableBody>
          <tr
            v-for="(item, index) in searchPatients"
            :key="index"
            :class="[item.status.name === 'Approve' ? '' : 'tw-bg-gray-200']"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.dateOfBirth }}</td>
            <td>
              <v-btn
                class="text-info cursor-pointer -tw-ml-[10px]"
                small
                icon
                flat
                color="green"
                variant="text"
                title="Open chat"
                :disabled="item.status.name === 'Reject'"
                @click="openChat(item)"
              >
                <v-icon>mdi-chat</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                class="text-info cursor-pointer ml-7"
                small
                icon
                flat
                variant="text"
                title="Open Appointment"
                :disabled="item.status.name === 'Reject'"
                @click="openAppointment(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                v-if="item.status.name === 'Approve'"
                @click="rejectPatientInvitationEvent(item)"
                class="text-info cursor-pointer ml-5"
                small
                icon
                flat
                color="red"
                variant="text"
                title="Reject Request"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <template v-else>
                <v-btn
                  v-if="
                    item.approvalBy &&
                    item.approvalBy.id &&
                    item.approvalBy.id === authUser.id
                  "
                  @click="acceptPatientInvitationEvent(item)"
                  class="cursor-pointer ml-4"
                  small
                  icon
                  flat
                  variant="text"
                  color="black"
                  title="Accept Request"
                >
                  <v-icon>mdi-arrow-u-left-top</v-icon>
                </v-btn>
              </template>
            </td>
          </tr>
        </template>
        <template v-if="searchPatients.length === 0" #noData>No Data Found</template>
      </CommonEditableTable>
    </v-col>
    <ConfirmationDialog ref="confirmation" />
  </v-row>
</template>
