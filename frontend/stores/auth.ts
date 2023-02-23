import { cloneDeep } from "lodash-es";
import { ApolloError } from "@apollo/client";
import { defineStore } from "pinia";
import { AuthResult, User } from "~~/types/user";
import { useNotificationStore } from "./notification";
import { useCommonStore } from "./common";
import { differenceInYears } from "date-fns";
import { useToast } from "vue-toastification";
import {
  fetchAuthUserProfileQuery,
  logInMutation,
  SignUpMutation,
  logOutMutation,
  updateUserProfileMutation,
  updateUserGroupMutation,
  deleteUserSpecializationMutation,
  createUserSpecializationMutation,
} from "@/query/auth";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  const router = useRouter();
  const { onLogin, onLogout, getToken } = useApollo();
  const notificationStore = useNotificationStore();
  const { joinNotificationRoom } = useNotification()
  const { setApprovalStatus, fetchGroups } = useCommonStore();

  const token = ref("");
  const authUser = ref<any>("");
  const loggedIn = computed(() => token.value);
  const getUserProfile = computed(() => authUser.value);
  const isSwitchToDoctor = computed(() => {
    let isSwitch = false;
    if (authUser.value?.dateOfBirth) {
      const dateOfBirth = new Date(authUser.value.dateOfBirth);
      const currentDate = new Date();
      const year = differenceInYears(currentDate, dateOfBirth);
      isSwitch = year > 22 ? true : false;
    } else {
      isSwitch = false;
    }
    return isSwitch;
  });
  const isDoctor = computed(() => {
    let doctor = false
    authUser.value.groups?.edges.forEach((item: any) => {
      if (item.node.name === "Doctor") {
        return (doctor = true);
      }
    });
    return doctor;
  });

  const isPatient = computed(() => {
    let patient = false
    authUser.value.groups?.edges.forEach((item: any) => {
      if (item.node.name === 'Patient') {
        return patient = true
      }
    })
    return patient
  })

  const setToken = (item: string) => {
    token.value = item;
    onLogin(item);
  };

  const {
    mutate: logIn,
    loading: logInLoading,
    onDone: onLogInDone,
    onError: onLogInError,
  } = useMutation<AuthResult>(logInMutation);

  onLogInDone(({ data }: any) => {
    if (data?.tokenAuth) {
      setToken(data?.tokenAuth?.token ?? "");
      fetchAuthUserProfile({ token: data?.tokenAuth?.token, langId: null });
      notificationStore.fetchAllNotification(Number(data?.tokenAuth?.user?.id));
      
      if (data?.tokenAuth?.user?.isFirstLogin === true) {
        router.push("/admin/profile/diseases");
        setPageLayout("admin");
      } else {
        router.push("/admin");
        setPageLayout("admin");
      }
    }   
  });

  onLogInError((error: ApolloError) => {
    toast.error(error.message || "Something wrong!");
  });

  const {
    mutate: signUp,
    onDone: onSignUpDone,
    onError: onSignUpError,
  } = useMutation<AuthResult>(SignUpMutation);

  onSignUpDone(({ data }: any) => {
    if (data) {
      toast.success("Success! We sent an email to finish registration.");
      router.push("/start");
    }
  });

  onSignUpError((error: ApolloError) => {
    toast.error(error.message || "Something Wrong!");
  });
  
  const fetchAuthUserProfile = async ({ token, langId }: any) => {
    const variables = { token, langId };
    const { onResult: onFetchAuthUserDone } = useQuery(
      fetchAuthUserProfileQuery,
      variables
    );

    onFetchAuthUserDone(async ({ data }: any) => {
      const deepClone = cloneDeep(data);
      const { viewer, approvalStatuses }: any = deepClone;
      await setAuthUserProfile(viewer);
      await setApprovalStatus(approvalStatuses);
      fetchGroups();
    });
  };

  const setAuthUserProfile = async (payload: any) => {
    let doctor = false;
    payload.groups?.edges.forEach((item: any) => {
      if (item.node.name === "Doctor") {
        return (doctor = true);
      }
    });
    payload.isDentist = doctor;

    if (payload.userspecializationSet?.edges?.length > 0) {
      const ids = payload.userspecializationSet.edges.map((item: any) => {
        return item.node.specialization.id;
      });
      payload.Specialty = [...new Set(ids)];
    } else {
      payload.Specialty = [];
    }
    payload.patientsManaged = [];
    if (payload.userlangSet && payload.userlangSet.edges?.length > 0) {
      payload.firstName = payload.userlangSet.edges[0]?.node?.firstName;
      payload.lastName = payload.userlangSet.edges[0]?.node?.lastName;
      payload.name = payload.userlangSet.edges[0]?.node?.name;
      payload.phone = payload.userlangSet.edges[0]?.node?.phone;
      payload.state = payload.userlangSet.edges[0]?.node?.state;
      payload.street = payload.userlangSet.edges[0]?.node?.street;
      payload.street2 = payload.userlangSet.edges[0]?.node?.street2;
      payload.zip = payload.userlangSet.edges[0]?.node?.zip;
      payload.city = payload.userlangSet.edges[0]?.node?.city;
    }
    authUser.value = payload;
    // join to websocket
    joinNotificationRoom(payload.id)
  };

  const {
    mutate: logOut,
    loading: logOutLoading,
    onDone: onLogOutDone,
    onError: onLogOutError,
  } = useMutation(logOutMutation);

  onLogOutDone(() => {
    setToken("");
    onLogout();
    authUser.value = "";
    setPageLayout("default");
    router.push("/start");
  });

  onLogOutError((error: ApolloError) => {
    toast.error(error.message || "Something wrong!");
  });

  const {
    mutate: updateUserProfile,
    loading: updateUserProfileLoading,
    onDone: updateUserProfileDone,
  } = useMutation(updateUserProfileMutation);
  updateUserProfileDone(() => {
    toast.success("Updated Successfully");
  });

  const updateUserGroup = async ({ userId, group }: any) => {
    const variables = { userId, group };
    const { mutate: setUpdateUserGroup } = useMutation(
      updateUserGroupMutation,
      {
        variables,
      }
    );
    return await setUpdateUserGroup();
  };

  const deleteUserSpecialization = async ({ userId }: any) => {
    const variables = { userId };
    const { mutate: setDeleteUserSpecialization } = useMutation(
      deleteUserSpecializationMutation,
      {
        variables,
      }
    );
    return await setDeleteUserSpecialization();
  };
  const createUserSpecialization = async ({ userId, specialitiesId }: any) => {
    const variables = { userId, specialitiesId };
    const { mutate: setCreateUserSpecialization } = useMutation(
      createUserSpecializationMutation,
      {
        variables,
      }
    );
    return await setCreateUserSpecialization();
  };

  const reFetchAuthUserProfile = () => {
    const token = getToken();
    fetchAuthUserProfile({ token, langId: null });
  };

  return {
    fetchAuthUserProfile,
    reFetchAuthUserProfile,
    authUser,
    getUserProfile,
    isSwitchToDoctor,
    isDoctor,
    isPatient,
    loggedIn,
    setToken,
    signUp,
    logIn,
    logInLoading,
    logOut,
    logOutLoading,
    updateUserProfile,
    updateUserProfileLoading,
    updateUserGroup,
    deleteUserSpecialization,
    createUserSpecialization,
  };
});
