<script setup>
import { useRouter } from "vue-router";
import { format } from "date-fns";
import { useAuth } from "~~/composables/useAuth";
import { useAppointment } from "~/composables/useAppointment";

definePageMeta({
  layout: "admin"
});

const { getUserProfile } = useAuth();
const { fetchAppointments, getAppointments } = useAppointment();
const authUser = computed(() => getUserProfile.value);
const appointments = computed(() => getAppointments.value);
const router = useRouter();

const search = ref("");
const searchHistory = computed(() => {
  return appointments.value.filter((appointment) => {
    return (
      appointment.companyName
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

const openChat = (item) => {
  console.log(item, 'itemm')
  router.push(
    `/admin/messages?patient=${item.doctorId}&history=${JSON.stringify(
      item.appointmentDetails.edges
    )}&startDate=${format(new Date(item.startDate), "dd/MM/yyyy")}`
  );
};
const datetime = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};
const tableHeader = [
  {
    id: 1,
    text: "Clinic Name",
  },
  {
    id: 2,
    text: "Assigned Dentist",
  },
  {
    id: 3,
    text: "Date",
  },
  {
    id: 4,
    text: "Type of Consultation",
  },
  {
    id: 5,
    text: "Tooth",
  },
  {
    id: 6,
    text: "Diagnostic",
  },
  {
    id: 7,
    text: "Treatment",
  },
  {
    id: 8,
    text: "Message the Dentist",
  },
];

onMounted(async () => {
  await fetchAppointments({
    patientId: Number(authUser.value?.id),
    doctorId: null,
    companyId: null,
    langId: authUser.value?.lang?.id,
  });
});
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="tableHeader"
        visibility="d-none"
        second-button-visibility="d-none"
      >
        <template #title>General history</template>
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
        <template v-if="searchHistory" #tableBody>
          <tr v-for="item in searchHistory">
            <td>{{ item.companyName }}</td>
            <td>{{ item.doctor }}</td>
            <td>{{ datetime(item.startDate) }}</td>
            <td>
              <v-chip v-for="priority in item.appointmentprioritySet.edges">
                {{ priority.node.priority.name }}
              </v-chip>
            </td>

            <td>
              <span v-for="details in item.appointmentDetails.edges">
                <v-chip v-if="details && details.node && details.node.tooth">
                  {{ details.node.tooth.number }}
                </v-chip>
              </span>
            </td>

            <td>
              <span v-for="details in item.appointmentDetails.edges">
                <v-chip
                  v-if="details && details.node && details.node.diagnosis"
                >
                  {{ details.node.diagnosis.name }}
                </v-chip>
              </span>
            </td>
            <td>
              <span v-for="details in item.appointmentDetails.edges">
                <v-chip
                  v-if="details && details.node && details.node.treatment"
                >
                  {{ details.node.treatment.name }}
                </v-chip>
              </span>
            </td>
            <td>
              <v-btn
                class="text-info cursor-pointer ml-10"
                small
                icon
                flat
                color="grey"
                variant="text"
                title="Message"
                @click="openChat(item)"
              >
                <v-icon>mdi-email</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-if="searchHistory.length === 0" #noData
          >No Data Found</template
        >
      </CommonEditableTable>
    </v-col>
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
