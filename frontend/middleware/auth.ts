import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useAuth();
  if (!process.server && !loggedIn.value) {
    return navigateTo("/start");
  }
});
