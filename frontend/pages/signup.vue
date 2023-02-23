<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as yup from "yup";
import { Field, Form } from "vee-validate";
import { useCommonStore } from "~~/stores/common";
import { useAuthStore } from "~~/stores/auth";

const authUserStore = useAuthStore();
const commonStore = useCommonStore();
const { fetchCountries, fetchLanguages, fetchNationalities } = commonStore;
const { signUp } = authUserStore;
const {
  getCountries: countries,
  getMultiLanguages: languages,
  getAllNationalities: nationalities,
} = storeToRefs(commonStore);

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
  email: yup.string().required().email().label("Email"),
  username: yup
    .string()
    .matches(/^[0-9a-zA-Z]+$/, "This field only contains alpha-numeric characters")
    .required()
    .label("Username"),
  birthDate: yup.string().required().label("Date of birth"),
  password: yup.string().required().min(4).label("Password"),
});

const SecondSchema = yup.object({
  address: yup.string().required().label("Address"),
  country: yup.string().required().label("Country"),
  nationality: yup.string().required().label("Nationality"),
  language: yup.string().required().label("Language"),
});

const registerStep = ref("step1");
const firstName = ref();
const lastName = ref();
const email = ref();
const username = ref();
const birthDate = ref();
const password = ref();
const address = ref();
const country = ref();
const nationality = ref();
const language = ref();

const changeWindow = () => {
  registerStep.value = registerStep.value === "step1" ? "step2" : "step1";
};
const onSubmit = async () => {
  await signUp({
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    password: password.value,
    birthdate: birthDate.value,
    email: email.value,
    address: address.value,
    addressTwo: address.value,
    country: country.value,
    nationality: Number(nationality.value),
    language: language.value,
    isCaregiver: false,
  });
};

const invalid = computed(() => {});

onMounted(async () => {
  await fetchCountries();
  await fetchLanguages();
  await fetchNationalities();
});
</script>

<template>
  <div class="tw-mb-32">
    <v-container
      id="login"
      class="fill-height tw-flex tw-justify-center tw-items-center tw-min-h-max"
      tag="section"
    >
      <v-row>
        <v-col>
          <v-card elevation="10">
            <v-row>
              <v-col lg="5" class="pr-0">
                <div class="pa-7 pa-sm-12">
                  <div class="d-flex justify-space-between align-center">
                    <h2
                      class="font-weight-bold mt-4 blue-grey--text text--darken-2"
                    >
                      Create Account
                    </h2>
                    <v-btn
                      :class="registerStep === 'step1' ? 'd-none' : ''"
                      color="info"
                      icon="mdi-chevron-double-left"
                      size="small"
                      @click="changeWindow"
                    >
                    </v-btn>
                  </div>

                  <v-window v-model="registerStep">
                    <v-window-item value="step1">
                      <Form
                        as="v-form"
                        v-slot="{ meta }"
                        :validation-schema="schema"
                      >
                        <Field
                          name="firstName"
                          type="text"
                          v-slot="{ field, errors }"
                          v-model="firstName"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="First Name"
                            class="mt-3"
                            variant="underlined"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <Field
                          name="lastName"
                          v-slot="{ field, errors }"
                          v-model="lastName"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="Last Name"
                            class="mt-3"
                            variant="underlined"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <Field
                          name="email"
                          v-slot="{ field, errors }"
                          v-model="email"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="E-mail"
                            class="mt-3"
                            variant="underlined"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <Field
                          name="username"
                          v-slot="{ field, errors }"
                          v-model="username"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="Username"
                            class="mt-3"
                            variant="underlined"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <Field
                          name="birthDate"
                          v-slot="{ field, errors }"
                          v-model="birthDate"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="Date of Birth"
                            class="mt-3"
                            type="date"
                            variant="underlined"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <Field
                          name="password"
                          v-slot="{ field, errors }"
                          v-model="password"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="Password"
                            class="mt-3"
                            variant="underlined"
                            type="password"
                            hide-details="auto"
                          ></v-text-field>
                        </Field>
                        <v-btn
                          color="info"
                          block
                          :disabled="!(meta.valid && meta.dirty)"
                          @click="changeWindow()"
                          class="py-6 mt-8"
                          >Proceed</v-btn
                        >
                      </Form>
                    </v-window-item>
                    <v-window-item value="step2">
                      <Form
                        as="v-form"
                        v-slot="{ meta }"
                        :validation-schema="SecondSchema"
                      >
                        <Field
                          name="address"
                          v-slot="{ field, errors }"
                          v-model="address"
                        >
                          <v-text-field
                            v-bind="field"
                            :error-messages="errors"
                            label="Address"
                            class="mt-3"
                            variant="underlined"
                            hide-details="auto"
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
                            label="Country"
                            class="mt-3"
                            :items="countries"
                            item-title="name"
                            item-value="code"
                            variant="underlined"
                            hide-details="auto"
                          ></v-select>
                        </Field>
                        <Field
                          name="nationality"
                          v-slot="{ field, errors }"
                          v-model="nationality"
                        >
                          <v-select
                            v-bind="field"
                            :error-messages="errors"
                            label="Nationality"
                            class="mt-3"
                            :items="nationalities"
                            item-title="name"
                            item-value="code"
                            variant="underlined"
                            hide-details="auto"
                          ></v-select>
                        </Field>
                        <Field
                          name="language"
                          v-slot="{ field, errors }"
                          v-model="language"
                        >
                          <v-select
                            v-bind="field"
                            :error-messages="errors"
                            label="Language"
                            class="mt-4"
                            :items="languages"
                            item-title="name"
                            item-value="id"
                            variant="underlined"
                            hide-details="auto"
                          ></v-select>
                        </Field>
                        <v-btn
                          :disabled="!(meta.valid && meta.dirty)"
                          @click="onSubmit"
                          color="info"
                          block
                          class="mt-8 py-6"
                          >Sign Up</v-btn
                        >
                      </Form>
                    </v-window-item>
                  </v-window>
                </div>
              </v-col>
              <v-col
                lg="7"
                class="bg-info d-none d-md-flex align-center justify-center"
              >
                <div class="d-none d-sm-block">
                  <div class="d-flex align-center pa-10">
                    <div>
                      <h2 class="text-h4 text-white font-weight-medium">
                        Welcome Back!
                      </h2>
                      <h6
                        class="text-subtitle-1 text-high-emphasis mt-4 text-white font-weight-regular"
                      >
                        To Keep connected with us please login with your
                        personnel info
                      </h6>
                      <v-btn
                        class="mt-6 text-capitalize"
                        size="large"
                        variant="outlined"
                        color="white"
                        to="/start"
                        >LOG IN</v-btn
                      >
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.text-white {
  color: #ffffff !important;
}
</style>
