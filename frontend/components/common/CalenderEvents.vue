<script setup>
import { format, addMinutes } from "date-fns";
import { useAuth } from "~~/composables/useAuth";
import { useAppointment } from "~/composables/useAppointment";

const { isDoctor, getUserProfile: authUser } = useAuth();
const { fetchAppointments, getAppointments } = useAppointment();
const attributes = computed(() => {
  const appointmentData = getAppointments.value.map((data) => ({
    key: data.id,
    highlight: {
      color: "blue",
      fillMode: "outline",
    },
    popover: {
      visibility: "focus",
    },
    customData: {
      doctor: data.doctor,
      patient: data.patient,
      startDate: data.startDate,
      duration: data.duration,
    },
    dates: new Date(data.startDate)
  }));
  return appointmentData
});

const masks = {
  weekdays: "WWW",
};

const datetime = (date) => {
  return format(new Date(date), "dd/MM/yy h:mm a");
};

const getEndDate = (startDate, duration) => {
  let endDate = addMinutes(new Date(startDate), duration).toISOString();
  return datetime(endDate);
};

onMounted(async () => {
  await fetchAppointments({
    patientId: Number(authUser.value?.id),
    doctorId: null,
    companyId: null,
    langId: authUser.value?.lang?.id,
  });
  if (isDoctor.value) {
    await fetchAppointments({
      doctorId: Number(authUser.value?.id),
      patientId: null,
      companyId: null,
      langId: authUser.value?.lang?.id
    });
  }
});
</script>

<template>
  <div class="text-center section relative">
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template #day-popover="{ attributes }">
        <div class="tw-px-2 tw-pb-2">
          <div
            class="tw-text-left tw-pt-2"
            v-for="item in attributes"
            :key="item.key"
            :attribute="item"
          >
            <v-btn
              class="cursor-pointer"
              large
              icon
              flat
              variant="outlined"
              size="small"
              :to="`/admin/appointments/entry?editableId=${item.key}`"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <span class="tw-text-lg tw-ml-1"> Appointment Summary </span>
            <hr class="tw-mt-2" />
            <p v-if="isDoctor" class="tw-block tw-text-lg">
              Patient's Name: {{ item.customData.patient }}
            </p>

            <p v-else class="tw-block tw-text-lg">
              Doctor's Name: {{ item.customData.doctor }}
            </p>
            <hr />
            <p class="tw-block tw-text-lg">
              Start Date:
              {{ datetime(item.customData.startDate) }}
            </p>
            <hr />
            <p class="tw-text-lg">
              End Date:
              {{
                getEndDate(item.customData.startDate, item.customData.duration)
              }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>
