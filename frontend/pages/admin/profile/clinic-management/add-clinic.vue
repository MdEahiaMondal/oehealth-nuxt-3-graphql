<script setup lang="ts">
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { Field, Form } from "vee-validate";
import { useAuth } from "~~/composables/useAuth";
import { DoctorType, GroupType } from "~~/types/company";
import { CityType } from "~~/types/common";
import { useClinic } from "~~/composables/useClinic";
import { useUser } from "~~/composables/useUser";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  middleware: "doctor",
});

const toast = useToast();
const route = useRoute();
const router = useRouter();
const { getUserProfile } = useAuth();
const { getApprovedStatus, getGroups, fetchCountries, getCountries } =
  useCommon();

const {
  createUserCompany,
  updateUserCompany,
  fetchSingleCompany,
  fetchCities,
  createCompanyUserForCompanyOwner,
  createDoctorTypeUserForCompany,
  deleteCompanyUser,
  fetchActiveCompanyForUser,
} = useClinic();

const { fetchDoctors, getAllDoctorWithOutAuthUser } = useUser();

const authUser = computed<any>(() => getUserProfile.value);
const doctors = computed(() => getAllDoctorWithOutAuthUser.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const allGroups = computed(() => getGroups.value);
const countries = computed(() => getCountries.value);

const schema = yup.object({
  clinicName: yup.string().required().label("Clinic name"),
  street: yup.string().required().label("Street"),
  city: yup.string().required().label("City"),
  country: yup.string().required().label("country"),
});

const selectedDoctors = ref<DoctorType[]>([]);
const clinicName = ref("");
const street = ref("");
const streetTwo = ref("");
const zipcode = ref("");
const country = ref();
const city = ref("");
const cities = ref<CityType[]>();
const state = ref("");
const isEditableMode = ref(false);
const existingDoctor = ref<DoctorType[]>([]);

const isExistActiveCompany = async () => {
  const userCompany: any = await fetchActiveCompanyForUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isActive: true,
  });
  if (userCompany && userCompany.edges && userCompany.edges.length > 0) {
    return true;
  } else {
    return false;
  }
};

const removeDoctor = (item: any) => {
  const findIndex: any = selectedDoctors?.value.findIndex((doctor) => {
    return doctor.id === item;
  });
  selectedDoctors.value.splice(findIndex, 1);
};

const submitAddClinic = async () => {
  if (isEditableMode.value) {
    updateCompany();
  } else {
    const isActiveCompany = await isExistActiveCompany();

    const { data }: any = await createUserCompany({
      name: clinicName.value,
      state: state.value,
      street: street.value,
      street2: streetTwo.value,
      city: city.value,
      country: country.value,
      zipcode: zipcode.value,
      createdBy: authUser.value?.id,
      updatedBy: authUser.value?.id,
    });
    const { createCompany } = data;
    if (createCompany && createCompany.company.id) {
      // create company user for auth user
      const doctorTypeGroup: GroupType = allGroups.value.find(
        (item: GroupType) => {
          return item.name === "Doctor";
        }
      ) as object;

      await createCompanyUserForCompanyOwner({
        companyId: Number(createCompany?.company.id),
        userId: Number(authUser?.value.id),
        doctorId: null,
        groupId: Number(doctorTypeGroup.id),
        status: "Approve",
        isOwner: true,
        isActive: !isActiveCompany,
        joinedDatetime: new Date().toISOString(),
        approvalById: authUser?.value.id,
        approvalAt: new Date().toISOString(),
        requestedBy: authUser?.value.id,
      });

      // create a company user for every selected doctor
      selectedDoctors.value.forEach(async (doctor: DoctorType) => {
        await createDoctorTypeUserForCompany({
          companyId: Number(createCompany?.company.id),
          userId: Number(doctor.id),
          groupId: Number(doctorTypeGroup.id),
          status: "Pending",
          isOwner: false,
          isActive: false,
          requestedBy: authUser?.value.id,
          joinedDatetime: new Date().toISOString(),
          requestType: "OWNER_REQUEST",
        });
      });
      resetForm();
      router.back();
      toast.success("New Clinic  Successfully Created!");
    } else {
      toast.error("Something is wrong!, company user not created!");
    }
  }
};

const updateCompany = async () => {
  const existingItems: DoctorType[] = [];
  const newItems: DoctorType[] = [];
  const deleteAbleItems: DoctorType[] = [];

  const existingDoctorIds = existingDoctor.value.map((item: DoctorType) => {
    return item.id;
  });

  const selectedDoctorIds = selectedDoctors.value.map((item: DoctorType) => {
    return item.id;
  });

  selectedDoctors.value.forEach((item: DoctorType) => {
    if (existingDoctorIds.includes(item.id)) {
      existingItems.push(item);
    } else {
      newItems.push(item);
    }
  });

  existingDoctor.value.forEach((item: DoctorType) => {
    if (!selectedDoctorIds.includes(item.id)) {
      deleteAbleItems.push(item);
    }
  });

  if (deleteAbleItems.length > 0) {
    deleteAbleItems.forEach(async (item: DoctorType) => {
      await deleteCompanyUser({ companyUserId: item.companyUserid });
    });
  }

  await updateUserCompany({
    id: Number(route.query.edit),
    name: clinicName.value,
    state: state.value,
    street: street.value,
    street2: streetTwo.value,
    city: city.value,
    zipcode: zipcode.value,
    country: country.value,
    updatedBy: authUser.value?.id,
  });

  if (newItems.length > 0) {
    const doctorTypeGroup: GroupType = allGroups.value.find(
      (item: GroupType) => {
        return item.name === "Doctor";
      }
    ) as object;

    newItems.forEach(async (doctor: DoctorType) => {
      await createDoctorTypeUserForCompany({
        companyId: Number(route.query.edit),
        userId: Number(doctor.id),
        groupId: Number(doctorTypeGroup.id),
        status: "Pending",
        isOwner: false,
        isActive: false,
        requestedBy: authUser?.value.id,
        joinedDatetime: new Date().toISOString(),
        requestType: "OWNER_REQUEST",
      });
    });
  }
  toast.success("Clinic Successfully Updated!");
  discardAll();
};

const discardAll = () => {
  router.push("/admin/profile/clinic-management");
};

const resetForm = () => {
  clinicName.value = "";
  street.value = "";
  streetTwo.value = "";
  zipcode.value = "";
  country.value = "";
  city.value = "";
  state.value = "";
  selectedDoctors.value = [];
};

const manageEditableData = async (id: any) => {
  isEditableMode.value = true;
  const data: any = await fetchSingleCompany({
    companyId: Number(id),
    groupName: "Doctor",
  });
  const company = data.company;

  if (company) {
    clinicName.value = company.name;
    street.value = company.street;
    streetTwo.value = company.street2;
    zipcode.value = company.zipcode;
    country.value = company.country;
    city.value = company.city;
    state.value = company.state;

    let doctors: DoctorType[] = [];

    company.companyuserSet?.edges.forEach((item: any) => {
      if (authUser.value.id !== item.node.user.id) {
        if (
          (item.node.requestedBy &&
            item.node.requestedBy.id === authUser.value.id) ||
          (item.node.requestedBy &&
            item.node.requestedBy.id !== authUser.value.id &&
            item.node.status &&
            item.node.status.id === approvedStatus.value?.id)
        ) {
          doctors.push({
            ...item.node.user,
            companyUserid: item.node.id,
          });
        }
      }
    });
    selectedDoctors.value = doctors;
    existingDoctor.value = Object.assign([], doctors);
  }
};

onMounted(async () => {
  await fetchDoctors({
    email: null,
  });
  await fetchCountries();
  cities.value = fetchCities();
  if (route.query?.edit) {
    await manageEditableData(route.query.edit);
  }
});
</script>

<template>
  <ClientOnly>
    <Form as="v-form" :validation-schema="schema" @submit="submitAddClinic">
      <v-card flat class="flat rounded-0">
        <v-card-text>
          <v-row class="mt-3">
            <v-col cols="12" lg="6">
              <Field
                name="clinicName"
                v-slot="{ field, errors }"
                v-model="clinicName"
              >
                <v-text-field
                  v-model="clinicName"
                  class="py-3"
                  v-bind="field"
                  :error-messages="errors"
                  hide-details="auto"
                  label="Clinic Name"
                  filled
                  background-color="transparent"
                ></v-text-field>
              </Field>
              <Field
                class="my-3"
                name="street"
                v-slot="{ field, errors }"
                v-model="street"
              >
                <v-text-field
                  v-model="street"
                  v-bind="field"
                  :error-messages="errors"
                  hide-details="auto"
                  label="Street"
                  filled
                  background-color="transparent"
                ></v-text-field>
              </Field>
              <v-text-field
                v-model="streetTwo"
                class="my-3"
                hide-details="auto"
                label="Street 2"
                filled
                background-color="transparent"
              ></v-text-field>
              <v-text-field
                v-model="state"
                class="my-3"
                hide-details="auto"
                label="State"
                filled
                background-color="transparent"
              ></v-text-field>
              <v-text-field
                v-model="zipcode"
                class="my-3"
                hide-details="auto"
                label="Zip code"
                filled
                background-color="transparent"
              ></v-text-field>
              <Field name="city" v-slot="{ field, errors }" v-model="city">
                <v-text-field
                  v-model="city"
                  class="my-3"
                  v-bind="field"
                  :error-messages="errors"
                  hide-details="auto"
                  label="City"
                  filled
                  background-color="transparent"
                ></v-text-field>
              </Field>
              <Field
                name="country"
                v-slot="{ field, errors }"
                v-model="country"
              >
                <v-select
                  v-bind="field"
                  :error-messages="errors"
                  class="pb-3"
                  v-model="country"
                  hide-details="auto"
                  label="Country"
                  background-color="transparent"
                  :items="countries"
                  item-value="code"
                  item-title="name"
                ></v-select>
              </Field>
            </v-col>

            <v-col cols="12" lg="6">
              <v-card class="tw-border tw-mt-3">
                <v-card-text class="tw-p-2">
                  <v-autocomplete
                    v-model="selectedDoctors"
                    class="py-3"
                    label="Select Doctors"
                    chips
                    multiple
                    closable-chips
                    :items="doctors"
                    item-title="name"
                    item-value="id"
                    hide-details
                    :placeholder="$t('addClinic.addNewDoctor')"
                  >
                  </v-autocomplete>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <BaseActionButtons
            deleteButton="d-none"
            resetButton="d-none"
            @discardButtonFunction="discardAll"
          />
        </v-card-text>
      </v-card>
    </Form>
  </ClientOnly>
</template>
