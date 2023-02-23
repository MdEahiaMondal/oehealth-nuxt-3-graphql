import { cloneDeep } from "lodash-es";
import { defineStore } from "pinia";
import {
  fetchAuthUserCompaniesQuery,
  fetchActiveCompanyForUserQuery,
  createUserCompanyMutation,
  updateUserCompanyMutation,
  fetchSingleCompanyQuery,
  createCompanyUserForCompanyOwnerMutation,
  createDoctorTypeUserForCompanyMutation,
  fetchCompaniesQuery,
  setCurrentActiveClinicMutation,
  deleteUserCompanyMutation,
  deleteCompanyUserMutation,
  fetchRequestedDoctorListByAuthUserQuery,
  fetchDoctorListsQuery,
  createPatientTypeUserForCompanyMutation,
} from "~~/query/clinic";

export const useClinicStore = defineStore("clinic", () => {
  const clinics = ref([]);
  const authUserClinics: any = ref([]);
  const requestedDoctors = ref([]);
  const doctors = ref([]);

  const getAuthUserCompanies = computed(() => {
    return authUserClinics.value?.map((clinic: any) => {
      return {
        id: clinic.node?.id,
        companyId: clinic.node.company?.id,
        company: clinic.node.company?.name,
        isOwner: clinic.node.isOwner,
        joinedDatetime: clinic.node.joinedDatetime,
        userId: clinic.node.user?.id,
        user: clinic.node.user?.name,
      };
    });
  });

  const getUserActiveCompany = computed(() => {
    return authUserClinics.value.find((clinic: any) => {
      return clinic?.node?.isActive;
    });
  });

  const relatedAndOwnerCompaniesIdByAuthUser = computed(() => {
    return authUserClinics.value?.map((clinic: any) => {
      return Number(clinic.node.company.id);
    });
  });

  const getAllClinics = computed(() => {
    const newClinics: any = [];
    clinics.value?.forEach((clinic: any) => {
      if (
        !relatedAndOwnerCompaniesIdByAuthUser.value.includes(
          Number(clinic.node.id)
        )
      ) {
        newClinics.push(clinic.node);
      }
    });
    return newClinics;
  });

  const getRequestedDoctors = computed(() => {
    return requestedDoctors.value?.map((item: any) => {
      return {
        company: item.node.company,
        doctor: item.node.doctor || item.node.user,
      };
    });
  });

  const getDoctors = computed(() => {
    let newDoctors: any = [];
    doctors.value.forEach((item: any) => {
      if (!isExistRequest(getRequestedDoctors.value, item.node)) {
        newDoctors.push(item);
      }
    });

    newDoctors = newDoctors.map((item: any) => {
      return item.node;
    });

    return [
      ...new Map(newDoctors.map((item: any) => [item["id"], item])).values(),
    ];
  });

  const isExistRequest = (requestedDoctors: any, userCompany: any) => {
    return requestedDoctors.some((item: any) => {
      return (
        Number(item.company.id) === Number(userCompany.company.id) &&
        Number(item.doctor.id) === Number(userCompany.user.id)
      );
    });
  };

  const setActiveClinic = (id: any) => {
    authUserClinics.value.map((clinic: any) => {
      if (Number(id) === Number(clinic?.node.id)) {
        clinic.node.isActive = true;
      } else {
        clinic.node.isActive = false;
      }
      return clinic;
    });
  };

  const REMOVE_CLINIC = ({ clinicId }: any) => {
    clinics.value = clinics.value?.filter((item: any) => {
      return Number(item.node.id) !== Number(clinicId);
    });
  };

  const SET_EMPTY_CLINIC = () => {
    doctors.value = [];
  };

  const PUSH_REQUESTED_DOCTORS = (payload: any) => {
    doctors.value = doctors.value.filter((doctor: any) => {
      return Number(doctor.node.id) !== Number(payload.node.id);
    });
  };

  const fetchAuthUserCompanies = async ({
    groupName,
    userId,
    statusId,
    isOwner,
    approvalBy,
    langId,
  }: any) => {
    const variables = {
      groupName,
      userId,
      statusId,
      isOwner,
      approvalBy,
      langId,
    };
    const { data }: any = await useAsyncQuery(
      fetchAuthUserCompaniesQuery,
      variables
    );
    const { userCompany } = data.value;
    const newUserCompany = userCompany.edges.map((item: any) => {
      let company = item.node.company;
      if (
        item.node.company &&
        item.node.company.companylangSet &&
        item.node.company.companylangSet.edges?.length > 0
      ) {
        company = {
          id: item.node.company.id,
          name: item.node.company.companylangSet.edges[0]?.node?.name,
        };
      }
      company = item.node.company;
      return item;
    });

    const allClinics = authUserClinics.value.concat(newUserCompany);
    const unique: any = [
      ...new Map(
        allClinics.map((item: any) => [item["node"]["id"], item])
      ).values(),
    ];
    authUserClinics.value = unique;
    return authUserClinics
  };

  const fetchActiveCompanyForUser = async ({
    userId,
    groupName,
    statusId,
    isActive,
  }: any) => {
    const variables = { userId, groupName, statusId, isActive };
    const { data }: any = await useAsyncQuery(fetchActiveCompanyForUserQuery, variables);
    const userCompany = data.value
    return userCompany
  };

  const createUserCompany = async ({
    name,
    street,
    street2,
    state,
    city,
    zipcode,
    country,
    createdBy,
    updatedBy,
  }: any) => {
    try {
      const variables = {
        name,
        street,
        street2,
        state,
        city,
        zipcode,
        country,
        createdBy,
        updatedBy,
      };
      const { mutate: setCreateUserCompany } = useMutation(
        createUserCompanyMutation,
        { variables }
      );
      return await setCreateUserCompany();
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserCompany = async ({
    id,
    name,
    street,
    street2,
    state,
    city,
    zipcode,
    country,
    updatedBy,
  }: any) => {
    try {
      const variables = {
        id,
        name,
        street,
        street2,
        state,
        city,
        zipcode,
        country,
        updatedBy,
      };
      const { mutate: setUpdateUserCompany } = useMutation(
        updateUserCompanyMutation,
        { variables }
      );
      return await setUpdateUserCompany();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSingleCompany = async ({ companyId, groupName }: any) => {
    const variables = { companyId, groupName };
    const { data }: any = await useAsyncQuery(
      fetchSingleCompanyQuery,
      variables
    );
    const company: any = data.value;
    return company;
  };

  const createCompanyUserForCompanyOwner = async ({
    companyId,
    userId,
    doctorId,
    groupId,
    status,
    isOwner,
    isActive,
    joinedDatetime,
    approvalById,
    approvalAt,
    requestedBy,
  }: any) => {
    try {
      const variables = {
        companyId,
        userId,
        doctorId,
        groupId,
        status,
        isOwner,
        isActive,
        joinedDatetime,
        approvalById,
        approvalAt,
        requestedBy,
      };
      const { mutate: setCreateCompanyUserForCompanyOwner } = useMutation(
        createCompanyUserForCompanyOwnerMutation,
        { variables }
      );
      return await setCreateCompanyUserForCompanyOwner();
    } catch (error) {
      console.log(error);
    }
  };

  const createDoctorTypeUserForCompany = async ({
    companyId,
    userId,
    groupId,
    status,
    isOwner,
    isActive,
    requestedBy,
    joinedDatetime,
    requestType,
  }: any) => {
    try {
      const variables = {
        companyId,
        userId,
        groupId,
        status,
        isOwner,
        isActive,
        requestedBy,
        joinedDatetime,
        requestType,
      };
      const { mutate: setCreateDoctorTypeUserForCompany } = useMutation(
        createDoctorTypeUserForCompanyMutation,
        { variables }
      );
      return await setCreateDoctorTypeUserForCompany();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCompanies = async ({ name, langId }: any) => {
    const variables = { name, langId };

    const { onResult: fetchCompaniesDone } = useQuery(
      fetchCompaniesQuery,
      variables
    );

    fetchCompaniesDone(({ data }: any) => {
      const { companies } = data;
      const newCompanies = companies.edges.map((item: any) => {
        let company = item.node;
        if (
          item.node.companylangSet &&
          item.node.companylangSet.edges?.length > 0
        ) {
          company = {
            id: item.node.id,
            name: item.node.companylangSet.edges[0]?.node?.name,
            city: item.node.companylangSet.edges[0]?.node?.city,
            code: item.node.companylangSet.edges[0]?.node?.code,
            state: item.node.companylangSet.edges[0]?.node?.state,
            street: item.node.companylangSet.edges[0]?.node?.street,
            street2: item.node.companylangSet.edges[0]?.node?.street2,
            zipcode: item.node.companylangSet.edges[0]?.node?.zipcode,
            country: item.node.companylangSet.edges[0]?.node?.country,
            isActive: item.node.isActive,
            companyuserSet: item.node.companyuserSet,
          };
        }
        return (item = { node: company });
      });
      clinics.value = newCompanies;
    });
  };

  const setCurrentActiveClinic = async ({
    companyUserId,
    isActive,
    status,
  }: any) => {
    try {
      const variables = {
        companyUserId,
        isActive,
        status,
      };
      const { mutate: setActiveClinic } = useMutation(
        setCurrentActiveClinicMutation,
        { variables }
      );
      return await setActiveClinic();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUserCompany = async ({ userCompanyId }: any) => {
    try {
      const variables = {
        userCompanyId,
      };
      const { mutate: setDeleteUserCompany } = useMutation(
        deleteUserCompanyMutation,
        { variables }
      );
      return await setDeleteUserCompany();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCompanyUser = async ({ companyUserId }: any) => {
    try {
      const variables = {
        companyUserId,
      };
      const { mutate: setDeleteCompanyUser } = useMutation(
        deleteCompanyUserMutation,
        { variables }
      );
      return await setDeleteCompanyUser();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRequestedDoctorListByAuthUser = async ({ userId }: any) => {
    const variables = { userId };
    const { onResult: fetchRequestedDoctorListByAuthUserDone }: any = useQuery(
      fetchRequestedDoctorListByAuthUserQuery,
      variables
    );
    fetchRequestedDoctorListByAuthUserDone(({ data }: any) => {
      const { userCompany } = data;
      requestedDoctors.value = userCompany.edges;
    });
  };

  const fetchDoctorLists = async ({
    groupName,
    statusId,
    companyName,
    userName,
    userEmail,
    langId,
  }: any) => {
    const variables = {
      groupName,
      statusId,
      companyName,
      userName,
      userEmail,
      langId,
    };
    const { onResult: fetchDoctorListsDone }: any = useQuery(
      fetchDoctorListsQuery,
      variables
    );
    fetchDoctorListsDone(({ data }: any) => {
      const { userCompany } = data;
      const deepClone = cloneDeep(userCompany);

      const newUserCompany = deepClone?.edges?.map((item: any) => {
        let company: any = item.node.company;
        if (
          item.node.company &&
          item.node.company.companylangSet &&
          item.node.company.companylangSet.edges?.length > 0
        ) {
          company = {
            id: item.node.company.id,
            name: item.node.company.companylangSet.edges[0]?.node?.name,
          };
        }
        item.node.company = company;
        return item;
      });

      if (newUserCompany && newUserCompany.length > 0) {
        doctors.value = doctors.value.concat(newUserCompany);
      }
    });
  };

  const createPatientTypeUserForCompany = async ({
    companyId,
    userId,
    doctorId,
    groupId,
    status,
    isOwner,
    isActive,
    requestedBy,
    requestType,
  }: any) => {
    try {
      const variables = {
        companyId,
        userId,
        doctorId,
        groupId,
        status,
        isOwner,
        isActive,
        requestedBy,
        requestType,
      };
      const { mutate: setCreatePatientTypeUserForCompany } = useMutation(
        createPatientTypeUserForCompanyMutation,
        { variables }
      );
      return await setCreatePatientTypeUserForCompany();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchCompanies,
    fetchAuthUserCompanies,
    createUserCompany,
    fetchActiveCompanyForUser,
    createCompanyUserForCompanyOwner,
    getAuthUserCompanies,
    getUserActiveCompany,
    setActiveClinic,
    setCurrentActiveClinic,
    deleteUserCompany,
    deleteCompanyUser,
    updateUserCompany,
    fetchSingleCompany,
    createDoctorTypeUserForCompany,
    getAllClinics,
    REMOVE_CLINIC,
    fetchRequestedDoctorListByAuthUser,
    fetchDoctorLists,
    createPatientTypeUserForCompany,
    SET_EMPTY_CLINIC,
    PUSH_REQUESTED_DOCTORS,
    getDoctors,
  };
});
