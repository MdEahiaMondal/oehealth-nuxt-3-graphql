<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { format } from "date-fns";
import { useChatStore } from "~~/stores/chat";
import { useChat } from "~~/composables/useChat";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  layout: "admin",
});

const { getUserProfile: authUser, isDoctor } = useAuth();
const chatStore = useChatStore();
const { getConnectedUsers: ConnectedUsers, getConversation: conversations } =
  storeToRefs(chatStore);
const toast = useToast();
const {
  setUser,
  setAuthUser,
  setPatientOrDoctorUsers,
  fetchPatientByDoctor,
  fetchDoctorsByPatient,
  fetchConnectedUser,
  checkConnection,
  createConnection,
  fetchConversation,
} = chatStore;
const {
  joinChatRoom,
  receiveMessage,
  sendMessage: sendChatMessage,
  sendMessageWhenOpen,
  scrollToBottom,
} = useChat();
const { fetchActiveCompanyForUser } = useClinic();
const { getApprovedStatus } = useCommon();
const route: any = useRoute();
const router: any = useRoute();

const approvedStatus = computed(() => getApprovedStatus.value);
const setAvatarLetter = computed(() => {
  const fullName = `${authUser.value.firstName} ${authUser.value.lastName}`;
  let letters = fullName.match(/(?<=(\s|^))[a-z]/gi);
  let acronym = letters?.join("").toUpperCase();
  return acronym;
});
const fullName = computed(() => {
  return `${authUser.value.firstName} ${authUser.value.lastName}`;
});
const avatar = (name: string) => {
  let TextAvatar = "";
  const array = name?.split(" ");
  array?.forEach((item) => {
    TextAvatar += item.substring(0, 1);
  });
  return TextAvatar;
};

const searchResult = ref<any[]>();
const searchUser = ref("");
const selectedUser = ref();
const connectionId = ref();
const messageBox = ref<HTMLElement | null>(null);
const message = ref("");
const singleConversation = ref();
const editableItem = ref();
const isEditing = ref(false);
const activeCompany = ref<any>();
const el = ref<HTMLElement | null>(null);

setAuthUser({
  id: authUser.value?.id,
  name: `${authUser.value?.firstName} ${authUser.value?.lastName}`,
  username: authUser.value?.username,
  avatar: authUser.value?.avatar,
});
function openMessages(con: any) {
  singleConversation.value = con;
}
const checkChatConnection = async (user: any) => {
  selectedUser.value = user;
  setUser(user);
  const sender = parseInt(authUser.value?.id);
  const receiver = parseInt(user.id);

  const connectionData: any = await checkConnection(sender, receiver);
  connectionId.value = connectionData?.id;
  if (!connectionId.value) {
    const { connection }: any = await createConnection(sender, receiver);
    connectionId.value = connection?.id;
    await fetchConversation(parseInt(connectionId.value));
    joinChatRoom(connectionId.value);
    receiveMessage();
  } else {
    await fetchConversation(parseInt(connectionId.value));
    joinChatRoom(connectionId.value);
    receiveMessage();
  }
  scrollToBottom(el.value);
};

const setDefaultMessage = (appointmentDetails: any, startDate: any) => {
  let tooth: any = "";
  let diagnosis: any = "";
  let treatment: any = "";
  appointmentDetails.forEach((detail: any) => {
    if (detail && detail.node && detail.node.tooth) {
      tooth += tooth
        ? ", " + detail.node.tooth.number
        : detail.node.tooth.number;
    }

    if (detail && detail.node && detail.node.diagnosis) {
      diagnosis += diagnosis
        ? ", " + detail.node.diagnosis.name
        : detail.node.diagnosis.name;
    }

    if (detail && detail.node && detail.node.treatment) {
      treatment += treatment
        ? ", " + detail.node.treatment.name
        : detail.node.treatment.name;
    }
  });
  const defaultMessage = `${startDate} Tooth: ${tooth}; Diagnostic: ${diagnosis}; Treatment: ${treatment}`;
  return defaultMessage;
};

watch(conversations, () => {
  scrollToBottom(el.value);
});

watch(searchUser, () => {
  if (searchUser.value.length > 0) {
    searchResult.value = ConnectedUsers.value.filter((item: any) => {
      return Object.keys(item).some((key) => {
        let string = String(item[key]);
        return (
          string.toLowerCase().indexOf(searchUser.value.toLowerCase()) > -1
        );
      });
    });
  } else {
    searchResult.value = ConnectedUsers.value;
  }
});

const datetime = (date: string) => {
  return format(new Date(date), "hh:mm a dd/MM/yy ");
};

const focusMessageBox = () => {
  messageBox.value?.focus();
};
const reset = () => {
  isEditing.value = false;
  editableItem.value = undefined;
  message.value = "";
  focusMessageBox();
};

const editConversation = (conversation: any) => {
  editableItem.value = conversation;
  isEditing.value = true;
  message.value = conversation.message;
  focusMessageBox();
};

const messageButton = computed(() => {
  if (isEditing.value) return "Update";
  else return "Send";
});

const setFirstPosition = () => {
  const users: any = searchResult.value;
  if (Number(users[0].id) !== Number(selectedUser.value.id)) {
    const index = users.findIndex((user: any) => {
      return Number(user.id) === Number(selectedUser.value.id);
    });
    users.splice(index, 1);
    users.splice(0, 0, selectedUser.value);
    searchResult.value = users;
  }
};

const sendMessage = (defaultMessage: string) => {
  let newMessage: string =
    defaultMessage.length > 0 ? defaultMessage : message.value;
  if (newMessage.length === 0) {
    toast.error("Please type your text first");
    return;
  }
  if (selectedUser.value.id) {
    setFirstPosition();
  }

  const connectId = parseInt(connectionId.value);
  const sender = parseInt(authUser.value?.id);
  const receiver = parseInt(selectedUser.value?.id);
  if (isEditing.value) {
    const id = parseInt(editableItem.value?.id || 0);
    const data = {
      id,
      connection: connectId,
      sender: sender,
      receiver: receiver,
      message: newMessage,
      is_seen: false,
      is_edited: true,
      is_auto_message: !!defaultMessage.length,
      created_by: authUser.value?.id,
      updated_by: authUser.value?.id,
    };
    sendChatMessage(data);
  } else {
    const data = {
      connection: connectId,
      sender: sender,
      receiver: receiver,
      message: newMessage,
      is_seen: false,
      is_edited: false,
      is_auto_message: !!defaultMessage.length,
      created_by: authUser.value?.id,
      updated_by: authUser.value?.id,
    };
    if (defaultMessage.length) {
      sendMessageWhenOpen(data);
      router.push("/admin/messages");
    } else {
      sendChatMessage(data);
    }
  }
  reset();
  setTimeout(() => {
    scrollToBottom(el.value);
  }, 500);
};

const getActiveCompany = async () => {
  const userCompany: any = await fetchActiveCompanyForUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isActive: true,
  });

  if (userCompany && userCompany.edges && userCompany.edges.length > 0) {
    activeCompany.value = userCompany.edges[0].node.company;
  }
};

onMounted(async () => {
  let newMessage: string = "";
  let appointmentDetails: any = route?.query && route?.query.history;
  let startDate: any = route.query && route.query.startDate;
  if (appointmentDetails) {
    appointmentDetails = JSON.parse(appointmentDetails);
    if (appointmentDetails && appointmentDetails.length > 0 && startDate) {
      newMessage = setDefaultMessage(appointmentDetails, startDate);
    }
  }

  await fetchConnectedUser(authUser.value?.id);

  if (isDoctor.value) {
    await getActiveCompany();
    const userCompany: any = await fetchPatientByDoctor({
      companyId: Number(activeCompany.value?.id),
      groupName: "Patient",
      doctorId: Number(authUser.value?.id),
      statusName: "Approve",
      statusId: Number(approvedStatus.value?.id),
    });

    const patients = userCompany?.edges?.map((user: any) => {
      return {
        id: user.node.user.id,
        firstName: user.node.user.firstName,
        lastName: user.node.user.lastName,
        name: user.node.user.name,
        email: user.node.user.email,
        username: user.node.user.username,
        avatar: user.node.user.avatar,
        lastConversation: null,
      };
    });
    setPatientOrDoctorUsers(patients);
  } else {
    const userCompany: any = await fetchDoctorsByPatient({
      userId: Number(authUser.value?.id),
      groupName: "Patient",
      statusId: Number(approvedStatus.value?.id),
    });

    const doctors = userCompany?.edges?.map((doctor: any) => {
      return {
        id: doctor.node.doctor.id,
        firstName: doctor.node.doctor.firstName,
        lastName: doctor.node.doctor.lastName,
        name: doctor.node.doctor.name,
        email: doctor.node.doctor.email,
        username: doctor.node.doctor.username,
        avatar: doctor.node.doctor.avatar,
        lastConversation: null,
      };
    });
    setPatientOrDoctorUsers(doctors);
  }

  if (ConnectedUsers.value && ConnectedUsers.value.length > 0) {
    searchResult.value = ConnectedUsers.value;
    let user = ConnectedUsers.value[0];
    checkChatConnection(user).finally(() => {
      if (newMessage) {
        sendMessage(newMessage);
      }
    });
  }
});
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card class="height">
        <BaseLeftRightPart>
          <!---/Left chat list -->
          <template v-slot:leftpart>
            <div class="pa-5 border-bottom">
              <v-text-field
                label="Search"
                variant="underlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                hide-details
                v-model="searchUser"
              ></v-text-field>
            </div>
            <v-list>
              <!-- chat list -->
              <v-list-item
                v-for="(user, i) in searchResult"
                :key="i"
                class="mb-2"
                :class="
                  selectedUser && selectedUser.id === user.id ? 'active' : 's'
                "
                :value="user"
                @click="openMessages(user), checkChatConnection(user)"
                two-line
              >
                <template v-slot:prepend>
                  <v-btn
                    v-if="user.avatar"
                    elevation="0"
                    icon
                    color="transparent"
                    variant="text"
                    :ripple="false"
                  >
                    <v-avatar size="45" color="grey">
                      <img :src="user.avatar" alt="" />
                    </v-avatar>
                  </v-btn>
                  <v-btn
                    v-else
                    elevation="0"
                    icon
                    color="transparent"
                    variant="text"
                    :ripple="false"
                  >
                    <v-avatar size="45" color="info">
                      <p>{{ avatar(user.name) }}</p>
                    </v-avatar>
                  </v-btn>
                </template>

                <v-list-item>
                  <v-list-item-title class="font-weight-medium">
                    <h4>{{ user.name }}</h4>
                  </v-list-item-title>
                </v-list-item>
              </v-list-item>
            </v-list>
          </template>
          <!---/Right chat list -->
          <template v-slot:rightpart>
            <template v-if="singleConversation">
              <div class="d-flex pa-4 align-center">
                <div class="mr-2">
                  <v-btn
                    v-if="singleConversation.avatar"
                    elevation="0"
                    icon
                    color="transparent"
                    variant="text"
                    :ripple="false"
                  >
                    <v-avatar size="45" color="info">
                      <img :src="singleConversation.avatar" alt="" />
                    </v-avatar>
                  </v-btn>
                  <v-btn
                    v-else
                    elevation="0"
                    icon
                    color="transparent"
                    variant="text"
                    :ripple="false"
                  >
                    <v-avatar size="45" color="info">
                      {{ avatar(singleConversation.name) }}
                    </v-avatar>
                  </v-btn>
                </div>
                <div class="user-about">
                  <h4>{{ singleConversation.name }}</h4>
                </div>
              </div>
              <v-divider></v-divider>
              <!---singleConversation Room-->
              <perfect-scrollbar ref="el">
                <div class="chat-room pa-4">
                  <div
                    v-for="conversation in conversations"
                    class="d-flex align-center mb-4 tw-space-x-2"
                    light
                    :class="{
                      fromMe: conversation.sender.id != singleConversation.id,
                      messageItem: true,
                    }"
                  >
                    <!-- <div :key="key" class="chat-date-divider">
                      <v-subheader class="chat-date">
                        {{ date(key) }}
                      </v-subheader>

                      <v-divider inset> </v-divider>
                    </div> -->
                    <v-hover v-slot="{ isHovering, props }">
                      <div
                        v-if="conversation.sender.id != singleConversation.id"
                        v-bind="props"
                      >
                        <v-btn
                          elevation="0"
                          icon
                          color="transparent"
                          variant="text"
                          :ripple="false"
                        >
                          <v-avatar size="35" color="info">
                            {{ avatar(conversation.sender.name) }}
                          </v-avatar>
                        </v-btn>
                      </div>
                      <div v-else>
                        <v-btn
                          elevation="0"
                          icon
                          color="transparent"
                          variant="text"
                          :ripple="false"
                        >
                          <v-avatar size="35" color="info">
                            {{ avatar(singleConversation.name) }}
                          </v-avatar>
                        </v-btn>
                      </div>
                      <v-chip
                        v-if="conversation.isAutoMessage"
                        variant="flat"
                        :color="conversation.isAutoMessage ? 'red' : ''"
                        v-bind="props"
                      >
                        <span
                          :class="
                            conversation.isAutoMessage ? 'tw-text-white' : ''
                          "
                          >{{ conversation.message }}</span
                        >
                      </v-chip>
                      <v-chip v-else v-bind="props">
                        {{ conversation.message }}
                      </v-chip>
                      <div
                        class="tw-opacity-0 tw-py-3 tw-transition-all tw-duration-400 tw-ease-in-out"
                        :class="{ 'show-date': isHovering }"
                      >
                        <p
                          v-bind="props"
                          class="text-caption"
                          v-if="conversation.sender.id != singleConversation.id"
                        >
                          <v-icon
                            class="mr-2 tw-cursor-pointer"
                            :class="
                              conversation.isAutoMessage ? 'tw-opacity-0' : ''
                            "
                            size="small"
                            @click="editConversation(conversation)"
                          >
                            mdi-pencil
                          </v-icon>
                          {{ datetime(conversation.datetime) }}
                        </p>
                        <p
                          class="text-caption"
                          v-if="conversation.sender.id == singleConversation.id"
                        >
                          {{ datetime(conversation.datetime) }}
                        </p>
                      </div>
                    </v-hover>
                  </div>
                </div>
              </perfect-scrollbar>
              <!---Send Message Footer-->
              <div class="pa-4">
                <v-textarea
                  ref="messageBox"
                  v-model.trim="message"
                  name="input-4-1"
                  rows="2"
                  variant="underlined"
                  hide-details
                  no-resize
                  :label="$t('messages.hitEnter')"
                  @keydown.enter="sendMessage('')"
                ></v-textarea>
              </div>
            </template>
            <template v-else>
              <div class="d-flex justify-center h-100 align-center">
                <h4>Start Conversation</h4>
              </div>
            </template>
          </template>
        </BaseLeftRightPart>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.fromMe {
  flex-direction: row-reverse;
}

.ps {
  height: calc(100vh - 370px) !important;
}

.height {
  min-height: calc(100% + 40px);
}

.show-date {
  opacity: 1;
}
</style>
