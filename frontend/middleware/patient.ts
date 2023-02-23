import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
const { isPatient, loggedIn } = useAuth();
    if (!loggedIn.value) {
        return navigateTo('/start')
    }
    if (!isPatient.value) {
        return navigateTo('/admin')
    }
});


