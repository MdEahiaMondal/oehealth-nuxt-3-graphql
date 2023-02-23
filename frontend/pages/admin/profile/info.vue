<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as yup from "yup";
import { Field, Form } from "vee-validate";
import { differenceInYears } from "date-fns";
import { useCommonStore } from "~~/stores/common";
import { useClinicStore } from "~~/stores/clinic";
import { useAuthStore } from "~~/stores/auth";

const authUserStore = useAuthStore();
const commonStore = useCommonStore();
const clinicStore = useClinicStore();

const { fetchCountries, fetchLanguages, fetchSpecialties, setOverlay } =
  commonStore;

const {
  reFetchAuthUserProfile,
  updateUserProfile,
  updateUserGroup,
  deleteUserSpecialization,
  createUserSpecialization,
} = authUserStore;
const {
  fetchAuthUserCompanies,
  createUserCompany,
  fetchActiveCompanyForUser,
  createCompanyUserForCompanyOwner,
} = clinicStore;

const {
  getCountries,
  getMultiLanguages,
  getSpecialties,
  getGroups,
  getApprovedStatus,
} = storeToRefs(commonStore);
const { getUserProfile } = storeToRefs(authUserStore);

const authUser = computed<any>(() => getUserProfile.value);
const allGroups = computed(() => getGroups.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const isSwitchToDoctor = ref(false);

const schema = yup.object({
  firstName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "This field only contains alphabetic characters")
    .required()
    .label("First Name"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z ]*$/, "This field only contains alphabetic characters")
    .required()
    .label("Last Name"),
  username: yup
    .string()
    .matches(
      /^[0-9a-zA-Z]+$/,
      "This field only contains alpha-numeric characters"
    )
    .required()
    .label("Username"),
  email: yup.string().required().email().label("Email"),
  dateOfBirth: yup.date().required().label("Date of birth"),
  street: yup.string().required().label("Street"),
  street2: yup.string().nullable().label("Street Two"),
  city: yup.string().nullable().label("City"),
  country: yup.string().required().label("Country"),
});

fetchCountries();
fetchLanguages();
fetchSpecialties({
  langId: authUser.value?.lang?.id,
});

const calculateDateOfYear = (event: any) => {
  let isSwitch = false;
  if (authUser.value.dateOfBirth) {
    const dateOfBirth = new Date(authUser.value.dateOfBirth);
    const currentDate = new Date();
    const year = differenceInYears(currentDate, dateOfBirth);
    isSwitch = year > 22 ? true : false;
  } else {
    isSwitch = false;
  }
  isSwitchToDoctor.value = isSwitch;
};

const onSubmit = async () => {
  setOverlay(true);
  await updateUserProfile({
    ...authUser.value,
    id: Number(authUser?.value.id),
    isCaregiver: authUser?.value.isDentist,
    lang: Number(authUser.value?.lang?.id)
  });
  const doctorTypeGroup = allGroups.value.find((item) => {
    return item.name === "Doctor";
  });

  const groupName = authUser.value.isDentist ? "Doctor" : "Patient";

  await updateUserGroup({
    userId: authUser?.value.id,
    group: groupName,
  });

  if (authUser.value.isDentist) {
    const isCompanyEmpty = await checkCompaniesEmptyOrNot();
    if (isCompanyEmpty) {
      // user company
      const { data }: any = await createUserCompany({
        name: authUser.value?.firstName + " " + authUser.value?.lastName,
        ...authUser.value,
        createdBy: authUser.value?.id,
        updatedBy: authUser.value?.id,
      });     
      const { createCompany } = data;
      const isActiveCompany = await isExistActiveCompany();
      
      await createCompanyUserForCompanyOwner({
        companyId: createCompany?.company.id,
        userId: authUser?.value.id,
        doctorId: null,
        groupId: Number(doctorTypeGroup?.id),
        status: "Approve",
        isOwner: true,
        isActive: !isActiveCompany,
        joinedDatetime: new Date().toISOString(),
        approvalById: authUser?.value.id,
        approvalAt: new Date().toISOString(),
        requestedBy: authUser?.value.id,
      });
    }

    await deleteUserSpecialization({ userId: authUser?.value.id });
    authUser.value?.Specialty?.forEach(async (id: string) => {
      await createUserSpecialization({
        userId: authUser.value.id,
        specialitiesId: id,
      });
    });
  }
  await reFetchAuthUserProfile();
  setOverlay(false);  
};

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

const checkCompaniesEmptyOrNot = async () => {
  const response: any = await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  return response && response.value.length === 0 ? true : false;
};

onMounted(async() => {
  await calculateDateOfYear({});
});
</script>

<template>
  <ClientOnly>
    <v-card flat class="mb-7 rounded-0">
      <Form as="v-form" :validation-schema="schema" @submit="onSubmit">
        <v-card-text class="pa-5">
          <h3 class="title text-h6">{{ $t("info.profile") }}</h3>

          <div class="mt-4">
            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.firstName") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="firstName"
                  v-slot="{ field, errors }"
                  v-model="authUser.firstName"
                >
                  <v-text-field
                    v-model="authUser.firstName"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.lastName") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="lastName"
                  v-slot="{ field, errors }"
                  v-model="authUser.lastName"
                >
                  <v-text-field
                    v-model="authUser.lastName"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.username") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="username"
                  v-slot="{ field, errors }"
                  v-model="authUser.username"
                >
                  <v-text-field
                    v-model="authUser.username"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    type="tel"
                    filled
                    readonly
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.email") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="email"
                  v-slot="{ field, errors }"
                  v-model="authUser.email"
                >
                  <v-text-field
                    v-model="authUser.email"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.birthDate") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="dateOfBirth"
                  v-slot="{ field, errors }"
                  v-model="authUser.dateOfBirth"
                >
                  <v-text-field
                    v-model="authUser.dateOfBirth"
                    @change="calculateDateOfYear"
                    v-bind="field"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                    type="date"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.street") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="street"
                  v-slot="{ field, errors }"
                  v-model="authUser.street"
                >
                  <v-text-field
                    v-model="authUser.street"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label> Street Two</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="street2"
                  v-slot="{ field, errors }"
                  v-model="authUser.street2"
                >
                  <v-text-field 
                    v-model="authUser.street2"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.country") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="country"
                  v-slot="{ field, errors }"
                  v-model="authUser.country"
                >
                <v-select
                  v-model="authUser.country"
                  :items="getCountries"
                  item-value="code"
                  item-title="name"
                  hide-details="auto"
                  filled
                  background-color="transparent"
                ></v-select>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.city") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <Field
                  name="city"
                  v-slot="{ field, errors }"
                  v-model="authUser.city"
                >
                  <v-text-field
                    v-model="authUser.city"
                    v-bind="field"
                    :error-messages="errors"
                    hide-details="auto"
                    filled
                    background-color="transparent"
                  ></v-text-field>
                </Field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.language") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <v-combobox
                  v-model="authUser.lang"
                  :items="getMultiLanguages"
                  item-title="name"
                  hide-details="auto"
                  filled
                  background-color="transparent"
                  outlined
                 />
              </v-col>
            </v-row>

            <v-row v-if="isSwitchToDoctor">
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.permissionMessage") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <v-checkbox
                  v-model="authUser.accessSurvey"
                  color="green"
                  :label="$t('info.AccessLabel')"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="isSwitchToDoctor">
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.onBehalf") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <v-checkbox
                  v-model="authUser.isDentist"
                  color="green"
                  :label="$t('info.dentist')"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row v-if="isSwitchToDoctor && authUser.isDentist">
              <v-col cols="12" sm="2" class="d-flex align-center">
                <label>{{ $t("info.specialty") }}</label>
              </v-col>
              <v-col cols="12" sm="10">
                <v-autocomplete
                  v-model="authUser.Specialty"
                  hide-details="auto"
                  :items="getSpecialties"
                  item-title="name"
                  item-value="id"
                  multiple
                  clips
                ></v-autocomplete>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <div class="pa-5 text-right">
          <v-btn color="success" type="submit" class="text-capitalize mr-2"
            >{{ $t("info.save") }}
          </v-btn>
          <v-btn color="warning" class="text-capitalize" dark>
            {{ $t("info.discard") }}</v-btn
          >
        </div>
      </Form>
    </v-card>
  </ClientOnly>
</template>
