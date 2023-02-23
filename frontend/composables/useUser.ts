import { storeToRefs } from "pinia";
import { useUserStore } from "~~/stores/user";

export const useUser = () => {
    const userStore = useUserStore();
    const {
        fetchDoctors,
    } = userStore;

    const {
        getAllDoctors,
        getAllDoctorWithOutAuthUser
    } = storeToRefs(userStore);


    return {
        fetchDoctors,
        getAllDoctors,
        getAllDoctorWithOutAuthUser
    }

}

