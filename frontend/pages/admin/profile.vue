<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";

definePageMeta({
  layout: "admin",
});

const { isPatient, isDoctor } = useAuth();

</script>

<template>
  <div>
    <nav class="bg-white">
      <v-tabs color="info" slider-color="info">
        <v-tab to="/admin/profile/info"> {{ $t("profile.info") }} </v-tab>
        <v-tab v-if="isPatient" to="/admin/profile/diseases">
          {{ $t("profile.diseases") }}
        </v-tab>
        <v-tab to="/admin/profile/medication">
          {{ $t("profile.medication") }}
        </v-tab>
        <v-tab v-if="isDoctor" to="/admin/profile/clinic-management">
          {{ $t("profile.clinicManagement") }}
        </v-tab>
        <v-tab v-if="isPatient" to="/admin/profile/doctors">
          {{ $t("profile.doctors") }}
        </v-tab>
        <v-tab v-if="isPatient" to="/admin/profile/access-management">
          {{ $t("profile.accessManagement") }}
        </v-tab>
      </v-tabs>
    </nav>
    <NuxtPage />
  </div>
</template>
