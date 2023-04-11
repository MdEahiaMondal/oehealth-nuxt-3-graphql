import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { isDoctor } = useAuth();
  if (process.client && !isDoctor.value) {
    return navigateTo("/admin");
  }
});
