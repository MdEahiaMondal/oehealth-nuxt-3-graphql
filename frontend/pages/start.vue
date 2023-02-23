<script setup lang="ts">
import * as yup from "yup";
import { Field, Form } from "vee-validate";
import { useAuthStore } from "~~/stores/auth";

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(4).required(),
});

const authStore = useAuthStore();

const onSubmit = (data: any) => {
  authStore.logIn({ username: data.username, password: data.password });
};

const valid = ref(true);
const password = ref("");
const username = ref("");
</script>

<template>
  <div class="tw-mb-20">
    <v-container
      offset-lg="1"
      offset-xl="2"
      lg="10"
      class="tw-min-h-max tw-flex tw-justify-center tw-items-center"
      tag="section"
    >
      <v-row>
        <v-col>
          <v-card elevation="10">
            <v-row>
              <v-col
                lg="7"
                class="bg-info d-none d-md-flex align-center justify-center"
              >
                <div class="d-none d-sm-block">
                  <div class="d-flex align-center pa-10 v-col-10">
                    <div>
                      <h2 class="text-h4 text-white font-weight-medium">
                        Hello, Friend!
                      </h2>
                      <h6
                        class="text-white text-subtitle-1 text-high-emphasis mt-4 font-weight-regular"
                      >
                        Enter your personal details and start journey with us
                      </h6>
                      <v-btn
                        class="mt-6 text-capitalize"
                        size="large"
                        variant="outlined"
                        color="white"
                        to="/signup"
                        >CREATE A NEW ACCOUNT</v-btn
                      >
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col lg="5">
                <div class="pa-7 pa-sm-12">
                  <h2 class="text-h5 font-weight-bold text--darken-2">
                    Log In
                  </h2>
                  <h6 class="text-subtitle-1 mb-7">Don't have an account?</h6>

                  <Form
                    as="v-form"
                    :validation-schema="schema"
                    @submit="onSubmit"
                    lazy-validation
                  >
                    <Field
                      v-model="username"
                      name="username"
                      v-slot="{ field, errors }"
                    >
                      <v-text-field
                        v-bind="field"
                        :error-messages="errors"
                        label="Username"
                        class="mt-4"
                        required
                        variant="underlined"
                      ></v-text-field
                    ></Field>

                    <Field
                      name="password"
                      v-model="password"
                      v-slot="{ field, errors }"
                    >
                      <v-text-field
                        v-bind="field"
                        :error-messages="errors"
                        label="Password"
                        required
                        variant="underlined"
                        type="password"
                      ></v-text-field
                    ></Field>

                    <v-btn color="info" block class="py-6" type="submit"
                      >LOG IN</v-btn
                    >
                  </Form>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
.text-white {
  color: white !important;
}
.height {
  min-height: 100vh;
}
</style>
