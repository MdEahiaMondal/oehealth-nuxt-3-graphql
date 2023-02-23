import { useAuth } from "~~/composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
    const { isDoctor, loggedIn } = useAuth();
    if (!loggedIn.value) {
        return navigateTo('/start')
    }
    if (!isDoctor.value) {
        return navigateTo('/admin')
    }
});


