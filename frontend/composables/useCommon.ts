import { storeToRefs } from "pinia";
import { useCommonStore } from "~~/stores/common";

export const useCommon = () => {
    const commonStore = useCommonStore();
    const {
        fetchNationalities,
        fetchCountries,
        fetchGroups,
        fetchLanguages,
        fetchSpecialties,
        setOverlay,
    } = commonStore;

    const {
        getAllNationalities,
        getApprovedStatus,
        getPendingStatus,
        getGroups,
        getCountries,
        getRejectStatus,
        getApprovalStatuses,
        getMultiLanguages,
        getSpecialties,
    } = storeToRefs(commonStore);


    return {
        fetchNationalities,
        fetchCountries,
        fetchGroups,
        fetchLanguages,
        fetchSpecialties,
        setOverlay,
        getAllNationalities,
        getApprovedStatus,
        getGroups,
        getCountries,
        getPendingStatus,
        getRejectStatus,
        getApprovalStatuses,
        getMultiLanguages,
        getSpecialties,
    }

}

