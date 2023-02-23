import { storeToRefs } from "pinia";
import { useClinicStore } from "~~/stores/clinic";
import { fetchAuthUserCompaniesTypes } from "~/types/common";

export const useClinic = () => {
  const clinicStore = useClinicStore();
  const {
    fetchAuthUserCompanies,
    deleteUserCompany,
    createUserCompany,
    updateUserCompany,
    fetchSingleCompany,
    createCompanyUserForCompanyOwner,
    createDoctorTypeUserForCompany,
    setActiveClinic,
    deleteCompanyUser,
    fetchActiveCompanyForUser,
    fetchCompanies,
    setCurrentActiveClinic,
    REMOVE_CLINIC,
    fetchRequestedDoctorListByAuthUser,
    fetchDoctorLists,
    createPatientTypeUserForCompany,
    SET_EMPTY_CLINIC,
    PUSH_REQUESTED_DOCTORS,
  } = clinicStore;

  const {
    getAuthUserCompanies,
    getUserActiveCompany,
    getAllClinics,
    getDoctors,
  } = storeToRefs(clinicStore);

  const fetchRelatedCompaniesByAuthUser = async (
    params: fetchAuthUserCompaniesTypes
  ) => {
    await fetchAuthUserCompanies({ ...params });
  };

  const fetchCities = () => {
    return [
      { text: "Dhaka", value: "bn" },
      { text: "Kolkata", value: "ar" },
      { text: "Islamabad", value: "pk" },
      { text: "Modina", value: "in" },
    ];
  };

  return {
    fetchAuthUserCompanies,
    fetchRelatedCompaniesByAuthUser,
    deleteUserCompany,
    getAuthUserCompanies,
    getUserActiveCompany,
    createUserCompany,
    updateUserCompany,
    fetchSingleCompany,
    fetchCities,
    createCompanyUserForCompanyOwner,
    createDoctorTypeUserForCompany,
    setActiveClinic,
    deleteCompanyUser,
    fetchActiveCompanyForUser,
    fetchCompanies,
    getAllClinics,
    setCurrentActiveClinic,
    REMOVE_CLINIC,
    fetchRequestedDoctorListByAuthUser,
    fetchDoctorLists,
    createPatientTypeUserForCompany,
    SET_EMPTY_CLINIC,
    PUSH_REQUESTED_DOCTORS,
    getDoctors,
  };
};
