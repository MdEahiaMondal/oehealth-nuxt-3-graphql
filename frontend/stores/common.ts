import { cloneDeep } from "lodash-es";
import { defineStore } from "pinia";
import {
  fetchGroupsQuery,
  fetchCountriesQuery,
  fetchLanguagesQuery,
  fetchSpecialtiesQuery,
  fetchNationalitiesQuery,
} from "@/query/common";
import {
  Country,
  Language,
  Specialties,
  Group,
  ApprovalStatus,
  NationalityListType,
} from "@/types/common";

export const useCommonStore = defineStore("common", () => {
  const countries = ref<Country[]>([]);
  const nationality = ref<NationalityListType[]>([]);
  const languages = ref<Language[]>([]);
  const specialties = ref<Specialties[]>([]);
  const groups = ref<Group[]>([]);
  const approvalStatuses = ref<ApprovalStatus[]>([]);
  const showOverlay = ref(false);

  // start getters
  const getCountries = computed(() => countries.value);
  const getMultiLanguages = computed(() => languages.value);
  const getSpecialties = computed(() => specialties.value);
  const getGroups = computed(() => groups.value);
  const getApprovalStatuses = computed(() => approvalStatuses.value);
  const getApprovedStatus = computed(() => {
    return approvalStatuses.value.find((item: any) => {
      return item.name === "Approve";
    });
  });
  const getPendingStatus = computed(() => {
    return approvalStatuses.value.find((item: any) => {
      return item.name === "Pending";
    });
  });
  const getRejectStatus = computed(() => {
    return approvalStatuses.value.find((item: any) => {
      return item.name === "Reject";
    });
  });
  const getAllNationalities = computed(() => nationality.value);
  const showingOverlay = computed(() => showOverlay.value);
  // end getters

  const fetchCountries = () => {
    const { onResult: onFetchCountriesDone }: any =
      useQuery(fetchCountriesQuery);
    onFetchCountriesDone(({ data }: any) => {
      const { countryList }: any = data;
      setCountry(countryList);
    });
  };

  const setCountry = (countriesLists: Country[]) => {
    countries.value = countriesLists;
  };

  const fetchLanguages = () => {
    const { onResult: onFetchLanguagesDone }: any =
      useQuery(fetchLanguagesQuery);
    onFetchLanguagesDone(({ data }: any) => {
      languages.value = data?.multiLanguage;
    });
  };

  const fetchSpecialties = ({ langId }: any) => {
    const variables = { langId };
    const { onResult: onSpecialitiesDone }: any = useQuery(
      fetchSpecialtiesQuery,
      variables
    );
    onSpecialitiesDone(({ data }: any) => {
      const { specializations }: any = data;
      const newSpecializations = specializations.map((item: any) => {
        if (
          item.specializationlangSet &&
          item.specializationlangSet.edges?.length > 0
        ) {
          return {
            id: item.id,
            name: item.specializationlangSet.edges[0]?.node?.name,
          };
        } else {
          return {
            id: item.id,
            name: item.name,
          };
        }
      });
      specialties.value = newSpecializations;
    });
  };

  const fetchGroups = () => {
    const { onResult: onGroupDone }: any = useQuery(fetchGroupsQuery);
    onGroupDone(({ data }: any) => {
      const { groups: groupsData }: any = data;
      groups.value = groupsData;
    });
  };

  const fetchNationalities = () => {
    const { onResult: onFetchNationalitiesDone }: any = useQuery(
      fetchNationalitiesQuery
    );
    onFetchNationalitiesDone(({ data }: any) => {
      const { nationalityList }: any = data;
      const deepClone = cloneDeep(nationalityList);
      nationality.value = deepClone;
    });
  };

  const setApprovalStatus = async (payload: ApprovalStatus[]) => {
    approvalStatuses.value = payload;
  };

  const setOverlay = (payload: boolean) => {
    showOverlay.value = payload;
  };

  return {
    countries,
    fetchCountries,
    getCountries,
    fetchLanguages,
    getMultiLanguages,
    fetchSpecialties,
    getSpecialties,
    fetchGroups,
    getGroups,
    setApprovalStatus,
    getApprovalStatuses,
    getApprovedStatus,
    getPendingStatus,
    getRejectStatus,
    setOverlay,
    showingOverlay,
    fetchNationalities,
    getAllNationalities,
  };
});
