
import { storeToRefs } from "pinia";
import { useAuthStore } from "~~/stores/auth"

export const useAuth = () => {
    const authUserStore = useAuthStore();
    const {
        reFetchAuthUserProfile,
        updateUserProfile,
        updateUserGroup,
        deleteUserSpecialization,
        createUserSpecialization,
    } = authUserStore;


    const { getUserProfile, isDoctor, isPatient, loggedIn } = storeToRefs(authUserStore);


    return {
        reFetchAuthUserProfile,
        updateUserProfile,
        updateUserGroup,
        deleteUserSpecialization,
        createUserSpecialization,
        getUserProfile,
        isDoctor,
        isPatient,
        loggedIn,
    }
}