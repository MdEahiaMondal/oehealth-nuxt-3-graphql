<script setup lang="ts">
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { format } from "date-fns";
import { userLookupType } from "~~/types/common";
import { useClinic } from "~~/composables/useClinic";
import { useAuth } from "~~/composables/useAuth";
import { useInvitationStore } from "~/stores/invitation";
import ConfirmationDialog from "~/components/base/ConfirmationDialog.vue";

definePageMeta({
  layout: "admin",
  middleware: "doctor",
});

const router = useRouter();
const toast = useToast();
const { getUserProfile } = useAuth();
const {
  fetchAuthUserCompanies,
  fetchRelatedCompaniesByAuthUser,
  deleteUserCompany,
  getAuthUserCompanies,
} = useClinic();
const invitationStore = useInvitationStore();
const { fetchUserLookup } = invitationStore;

const confirmation = ref();
const search = ref("");

const authUser = computed<any>(() => getUserProfile.value);
const companies: any = computed<any>(() => getAuthUserCompanies.value);

const searchClinics: any = computed(() => {
  return companies.value.filter((company: any) => {
    return company.company
      .toLowerCase()
      .includes(search.value.toLowerCase());
  });
});

const manageFetchAllCompanies = async () => {
  const { data }: any = await fetchUserLookup();
  const { approvalStatuses } = data;
  const status = approvalStatuses.find((item: userLookupType) => {
    return item.name === "Approve";
  });
  await fetchAuthUserCompanies({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(status.id),
    isOwner: true,
    approvalById: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  await fetchRelatedCompaniesByAuthUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(status.id),
    isOwner: false,
    approvalById: null,
    langId: authUser.value?.lang?.id,
  });
};

const datetime = (date: string) => {
  return format(new Date(date), "dd/MM/yyyy");
};

const editCompany = (item: any) => {
  router.push(
    `/admin/profile/clinic-management/add-clinic/?edit=${item.companyId}`
  );
};

const removeUserCompany = async (item: any) => {
  confirmation.value
    .open("Delete", "Are you want to delete?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        await deleteUserCompany({
          userCompanyId: Number(item.id),
        });
        await manageFetchAllCompanies();
        toast.success("Successfully deleted!");
      }
      return false;
    });
};

onMounted(async() => {
  await manageFetchAllCompanies();
});

const headers = ref([
  { text: "Clinic Name", value: "company" },
  { text: "Joined", value: "joinedDatetime" },
  { text: "Actions", value: "action", sortable: false, align: "center" },
]);

const AddClinic = () => {
  router.push("/admin/profile/clinic-management/add-clinic");
};
const JoinClinic = () => {
  router.push("/admin/profile/clinic-management/join-clinic");
};
</script>

<template>
  <v-row>
    <v-col>
      <CommonEditableTable
        :table-header="headers"
        :table-data="companies"
        button-text="ADD CLINIC"
        second-button-text="JOIN CLINIC"
        :flat="true"
        base-class="rounded-0 px-3"
        @buttonFunction="AddClinic"
        @secondButtonFunction="JoinClinic"
      >
       <template #search>
          <v-text-field
            label="Search"
            variant="underlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            hide-details
            v-model="search"
          ></v-text-field>
        </template>
        <template #title>Manage Clinics</template>
        <template v-if="searchClinics" #tableBody>
          <tr v-for="item in searchClinics" :key="item.id">
            <td>{{ item.company }} {{ item.isOwner ? "(Owner)" : "" }}</td>
            <td>{{ datetime(item.joinedDatetime) }}</td>
            <td>
              <v-menu v-if="item.isOwner" transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    class="text-info cursor-pointer"
                    small
                    icon
                    flat
                    variant="text"
                    title="Setting"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </template>

                <v-list class="pa-0">
                  <v-list-item class="tw-cursor-pointer">
                    <v-list-item-title @click="editCompany(item)">
                      <v-icon class="mr-1" size="small">mdi-pencil</v-icon>
                      Edit
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                v-else
                @click="removeUserCompany(item)"
                class="text-info cursor-pointer"
                small
                icon
                flat
                color="red"
                variant="text"
                title="Delete"
              >
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template v-if="searchClinics.length === 0" #noData>No Data Found</template>
      </CommonEditableTable>
    </v-col>
    <ConfirmationDialog ref="confirmation" />
  </v-row>
</template>
