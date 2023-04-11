import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { isPatient } = useAuth();
  if (process.client && !isPatient.value) {
    return navigateTo("/admin");
  }
});
