<script setup lang="ts">
import { format, addMinutes } from "date-fns";
import { useAuth } from "~~/composables/useAuth";
import { usePatient } from "~/composables/usePatient";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";
import { useAppointment } from "~/composables/useAppointment";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const { getUserProfile, isDoctor } = useAuth();
const { fetchAppointments, getAppointments } = useAppointment();
const { fetchPatients, getAppointmentPatients } = usePatient();
const { fetchActiveCompanyForUser } = useClinic();
const { getApprovedStatus } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const patients = computed(() => getAppointmentPatients.value);
const appointments = computed(() => getAppointments.value);

const searchAppointments: any = computed(() => {
  return appointments.value.filter((appointment) => {
    if (isDoctor.value) {
      return appointment.patient
        .toLowerCase()
        .includes(search.value.toLowerCase());
    } else {
      return appointment.doctor
        .toLowerCase()
        .includes(search.value.toLowerCase());
    }
  });
});
fetchPatients();

const datetime = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy");
};

let calender = ref(false);
const search = ref("");
const showCalenderEvents = () => {
  calender.value = true;
};
const hideCalenderEvents = () => {
  calender.value = false;
};
const headers = ref([
  { text: "Start Date", value: "startDate" },
  { text: "End Date", value: "endDate" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

const activeCompany = ref<any>();

if (isDoctor.value) {
  headers.value.splice(0, 0, { text: "Patient", value: "patient" });
  if (authUser.value.accessSurvey) {
    headers.value.splice(1, 0, { text: "Survey", value: "survey" });
  }
} else {
  headers.value.splice(0, 0, { text: "Doctor", value: "doctor" });
}

const patinetName = (id: any) => {
  const data = patients.value.find((item: any) => {
    return item.id == Number(id);
  });
  return data?.name;
};

const getEndDate = (startDate: string, duration: number) => {
  let endDate = "";
  if (startDate && duration) {
    endDate = addMinutes(new Date(startDate), duration).toISOString();
  }
  return datetime(endDate);
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
  if (route.query?.patient) {
    await fetchAppointments({
      patientId: route.query?.patient,
      doctorId: null,
      companyId: null,
      langId: authUser.value?.lang?.id,
      isActive: null
    });
  } else {
    if (isDoctor.value) {
      await getActiveCompany();

      await fetchAppointments({
        patientId: null,
        doctorId: Number(authUser.value?.id),
        companyId: Number(activeCompany.value?.id),
        langId: authUser.value?.lang?.id,
        isActive: true
      });
    } else {
      await fetchAppointments({
        patientId: Number(authUser.value?.id),
        doctorId: null,
        companyId: null,
        langId: authUser.value?.lang?.id,
        isActive: null
      });
    }
  }
});
</script>

<template>
  <ClientOnly>
    <v-row>
      <v-col class="d-flex align-center justify-space-between">
        <div v-if="isDoctor">
          <v-btn color="info" dark to="/admin/appointments/entry">
            {{ $t("adminAppointment.newAppointment").toUpperCase() }}
          </v-btn>
        </div>
        <div v-else></div>

        <div>
          <v-btn @click="hideCalenderEvents" class="ma-2" variant="outlined" color="info">
            <v-icon>mdi-format-list-bulleted-square</v-icon>
            <span class="ml-2">{{ $t("adminAppointment.ListView") }}</span>
          </v-btn>
          <v-btn @click="showCalenderEvents" class="ma-2" variant="outlined" color="info">
            <v-icon>mdi-calendar-account</v-icon>
            <span class="ml-2"> {{ $t("adminAppointment.CalendarView") }}</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!calender">
      <v-col>
        <CommonEditableTable :table-header="headers" visibility="d-none" second-button-visibility="d-none">
          <template #search>
            <v-text-field label="Search" variant="underlined" density="compact" append-inner-icon="mdi-magnify"
              hide-details v-model="search"></v-text-field>
          </template>
          <template v-if="searchAppointments" #tableBody>
            <tr v-for="item in searchAppointments" :key="item.id">
              <td>{{ isDoctor? item.patient : item.doctor }}</td>
              <td :class="headers[1].text == 'Survey' ? '' : 'tw-hidden'">
                <nuxt-link class="tw-text-blue-700" v-if="item.survey.edges && item.survey.edges.length > 0"
                  :to="`/admin/appointments/question-survey?appointmentId=${item.id}`">{{
                    item.survey.edges[0].node.survey.name
                  }}</nuxt-link>
                <span v-else></span>
              </td>
              <td>{{ datetime(item.startDate) }}</td>
              <td>{{ getEndDate(item.startDate, item.duration) }}</td>
              <td>
                <v-btn class="text-info cursor-pointer" small icon flat variant="text" title="View"
                  :to="`/admin/appointments/entry?editableId=${item.id}`">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-if="searchAppointments.length === 0" #noData>No Data Found</template>
        </CommonEditableTable>
      </v-col>
    </v-row>

    <v-row v-if="calender">
      <v-col>
        <CommonCalenderEvents />
      </v-col>
    </v-row>
  </ClientOnly>
</template>
