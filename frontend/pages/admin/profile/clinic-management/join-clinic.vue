<script setup lang="ts">
import { useToast } from "vue-toastification";
import debounce from "lodash.debounce";
import { GroupType } from "~/types/company";
import { useAuth } from "~~/composables/useAuth";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  middleware: "doctor",
});

const { getUserProfile } = useAuth();
const toast = useToast();
const {
  fetchAuthUserCompanies,
  fetchRelatedCompaniesByAuthUser,
  createDoctorTypeUserForCompany,
  fetchCompanies,
  getAllClinics,
  REMOVE_CLINIC,
} = useClinic();

const { getApprovedStatus, getGroups } = useCommon();

const authUser = computed<any>(() => getUserProfile.value);
const clinics = computed<any>(() => getAllClinics.value);
const allGroups = computed(() => getGroups.value);
const approvedStatus = computed(() => getApprovedStatus.value);

const search = ref("");
const searchClinics = debounce(async function () {
  await fetchCompanies({
    name: search.value,
    langId: authUser.value?.lang?.id,
  });
}, 500);

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

const sendAccessRequestEvent = async (clinic: any) => {
  const doctorTypeGroup: GroupType = allGroups.value.find((item: GroupType) => {
    return item.name === "Doctor";
  }) as object;

  try {
    const { data }: any = await createDoctorTypeUserForCompany({
      companyId: Number(clinic.id),
      userId: Number(authUser.value?.id),
      groupId: Number(doctorTypeGroup.id),
      status: "Pending",
      isOwner: false,
      isActive: false,
      requestedBy: authUser.value?.id,
      joinedDatetime: new Date().toISOString(),
      requestType: "DOCTOR_REQUEST",
    });
    const { createCompanyUser } = data;
    if (createCompanyUser) {
      REMOVE_CLINIC({ clinicId: clinic.id });
      toast.success("Invitations Successfully Sent!");
    }
  } catch (error: any) {
    toast.error(error.response?.errors[0]?.message || "Something wrong!");
  }
};

const manageFetchAllCompanies = async () => {
  await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });

  await fetchRelatedCompaniesByAuthUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isOwner: false,
    approvalById: null,
    langId: authUser.value?.lang?.id,
  });
};

onMounted(async () => {
  await fetchCompanies({
    name: null,
    langId: authUser.value?.lang?.id,
  });
  await manageFetchAllCompanies();
});
</script>

<template>
  <v-row>
    <v-col>
      <v-card class="mt-6">
        <v-card-text class="mt-3">
          <v-text-field
            label="Search Clinics"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            hide-details
            v-model="search"
            @keyup="searchClinics"
            @paste="searchClinics"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row class="mt-4">
    <v-col
      cols="12"
      sm="6"
      lg="3"
      v-for="(clinic, index) in clinics"
      :key="index"
    >
      <v-card class="relative" height="410px">
        <div>
          <div class="d-flex justify-center mt-6">
            <v-avatar v-if="clinic.image" size="40">
              <v-img :src="clinic.image" />
            </v-avatar>
            <span v-else class="white--text text-h5">
              <v-avatar class="profile" color="grey" size="120" alt="user">
                {{ avatar(clinic.name) }}
              </v-avatar>
            </span>
          </div>
          <v-card-text>
            <div class="text-center">
              <div class="mb-4">
                <h2 class="text-h6 font-weight-regular">{{ clinic.name }}</h2>
                <p class="text-caption text-grey-darken-1">
                  {{
                    clinic.companyuserSet.edges.length
                      ? clinic.companyuserSet.edges[0].node.user.name
                      : ""
                  }}
                </p>
              </div>
              <p class="mb-0">{{ clinic.phone }}</p>
              <p class="text-caption text-grey-darken-1">
                {{ clinic.street }}, {{ clinic.street2 }}, {{ clinic.state }},
                {{ clinic.city }}, {{ clinic.zipcode }},
                {{ clinic.country }}
              </p>
            </div>
          </v-card-text>
        </div>
        <v-btn
          class="absolute"
          rounded="0"
          block
          color="info"
          dark
          x-large
          @click="sendAccessRequestEvent(clinic)"
          >{{ $t("joinClinic.accessRequest") }}</v-btn
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
