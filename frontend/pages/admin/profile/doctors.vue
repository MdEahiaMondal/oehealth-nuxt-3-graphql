<script setup lang="ts">
import { useToast } from "vue-toastification";
import debounce from "lodash.debounce";
import { useAuth } from "~~/composables/useAuth";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";
import { GroupType } from "~~/types/company";

definePageMeta({
  middleware: "patient",
});

const { getUserProfile } = useAuth();
const toast = useToast();
const {
  fetchRequestedDoctorListByAuthUser,
  fetchDoctorLists,
  createPatientTypeUserForCompany,
  SET_EMPTY_CLINIC,
  PUSH_REQUESTED_DOCTORS,
  getDoctors,
} = useClinic();

const { getApprovedStatus, getGroups } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const approvedStatus = computed<any>(() => getApprovedStatus.value);

const allGroups = computed(() => getGroups.value);
const doctors = computed<any>(() => getDoctors.value);

const fetchAllDoctorsFromCompanyUsers = async () => {
  await fetchDoctorLists({
    groupName: "Doctor",
    statusId: Number(approvedStatus?.value?.id),
    companyName: null,
    userName: null,
    userEmail: null,
    langId: authUser.value?.lang?.id,
  });
};

const search = ref("");

const searchDoctor = debounce(async function () {
  SET_EMPTY_CLINIC();

  await fetchDoctorLists({
    groupName: "Doctor",
    statusId: Number(approvedStatus.value.id),
    companyName: search.value,
    userName: null,
    userEmail: null,
    langId: authUser.value?.lang?.id,
  });

  await fetchDoctorLists({
    groupName: "Doctor",
    statusId: Number(approvedStatus.value.id),
    companyName: null,
    userName: search.value,
    userEmail: null,
    langId: authUser.value?.lang?.id,
  });

  await fetchDoctorLists({
    groupName: "Doctor",
    statusId: Number(approvedStatus.value.id),
    companyName: null,
    userName: null,
    userEmail: search.value,
    langId: authUser.value?.lang?.id,
  });
}, 500);

const giveAccess = async (doctor: any) => {
  const companyId = doctor.company.id;
  const patientTypeGroup: GroupType = allGroups.value.find(
    (item: GroupType) => {
      return item.name === "Patient";
    }
  ) as object;

  if (companyId) {
    try {
      const { data }: any = await createPatientTypeUserForCompany({
        companyId,
        userId: authUser.value?.id,
        doctorId: doctor.user?.id,
        groupId: patientTypeGroup.id,
        status: "Pending",
        isOwner: false,
        isActive: false,
        requestedBy: authUser.value?.id,
        requestType: "PATIENT_REQUEST_DOCTOR",
      });
      const { createCompanyUser } = data;

      if (createCompanyUser) {
        const node = { node: { ...doctor } };
        toast.success("Request successfully sent!");
        // console.log(node);

        PUSH_REQUESTED_DOCTORS(node);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    toast.error("Something is wrong!");
  }
};

const avatar = (name: string) => {
  let textAvatar = "";
  const array = name?.split(" ");
  if (array) {
    array.forEach((item) => {
      textAvatar += item.substring(0, 1);
    });
  }
  return textAvatar;
};

onMounted(async () => {
  await fetchRequestedDoctorListByAuthUser({
    userId: Number(authUser.value?.id),
  });
  await fetchAllDoctorsFromCompanyUsers();
});
</script>

<template>
  <v-row>
    <v-col>
      <v-card class="mt-6">
        <v-card-text class="mt-3">
          <v-text-field
            label="Search Doctors"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            hide-details
            v-model="search"
            @keyup="searchDoctor"
            @paste="searchDoctor"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row class="mt-4" v-if="doctors">
    <v-col
      cols="12"
      sm="6"
      lg="3"
      v-for="(doctor, index) in doctors"
      :key="index"
    >
      <v-card class="relative" height="330">
        <div class="d-flex justify-center mt-6">
          <v-avatar v-if="doctor.user.avatar" size="40">
            <v-img :src="doctor.user.avatar" />
          </v-avatar>
          <span v-else class="white--text text-h5">
            <v-avatar class="profile" color="grey" size="120">
              {{ avatar(doctor.user.name) }}
            </v-avatar>
          </span>
        </div>
        <v-card-text>
          <div class="p-1 pt-0 text-center">
            <div class="mb-10">
              <h2 class="text-h6 font-weight-regular">
                {{ doctor.user.name }}
              </h2>
              <p class="text-caption text-grey-darken-1">
                {{ doctor.user.email }}
              </p>
              <p class="text-caption text-grey-darken-1">
                {{ doctor.user.phone }}
              </p>
              <p class="text-caption text-grey-darken-1">
                Practice: {{ doctor.company.name }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-btn
          class="absolute rounded-0"
          block
          color="info"
          dark
          x-large
          @click="giveAccess(doctor)"
          >{{ $t("doctors.giveAccess") }}</v-btn
        >
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
  bottom: 0;
}
</style>
