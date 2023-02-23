import { defineStore } from "pinia";
import { format } from "date-fns";
import groupBy from "lodash.groupby";
import {
  fetchPatientByDoctorQuery,
  fetchDoctorsByPatientQuery,
  createConnectionMutation,
  fetchConnectedUserQuery,
  fetchConversationsQuery,
  checkConnectionQuery,
} from "~/query/chat";

const snakeToCamel = (str: any) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group: any) => group.slice(-1).toUpperCase());

export const useChatStore = defineStore("chat", () => {
  let conversations: any = ref([]);
  const user: any = ref();
  const authUser: any = ref();
  const connectedUsers: any = ref([]);

  //getters
  const getConversation = computed(() => {
    let array = [];
    if (conversations) {
      const edges = conversations.value?.edges;
      array = edges?.map((item: { node: any }) => {
        const conversation = {
          ...item.node,
        };
        if (item.node.datetime) {
          conversation.date = format(
            new Date(item.node.datetime),
            "yyyy-mm-dd"
          );
        }
        return conversation;
      });
    }
    return array;
    // const group =  groupBy(array, "date");
    // return group
  });
  const getConnectedUsers = computed(() => {
    return [
      ...new Map(
        connectedUsers.value.map((item: any) => [item["id"], item])
      ).values(),
    ];
  });

  //actions
  const setUser = async (payload: any) => {
    user.value = payload;
  };

  const setAuthUser = async (payload: any) => {
    authUser.value = payload;
  };

  const setPatientOrDoctorUsers = async (payload: any) => {
    if (payload && payload.length > 0) {
      connectedUsers.value = payload.concat(connectedUsers.value);
    }
  };

  const setLastConversation = async ({ lastConversation, receiver }: any) => {
    let lastMessage = lastConversation.node
      ? lastConversation.node
      : lastConversation;
    connectedUsers?.value.map((user: any) => {
      if (Number(user.id) === Number(receiver)) {
        user.lastConversation = JSON.parse(JSON.stringify(lastMessage));
      }
      return user;
    });
  };

  const pushConversation = async (payload: any) => {
    const edges = conversations.value;
    if (edges) {
      const array = payload;

      const obj = array[0];
      const fields = { ...obj.fields };
      let output: any = {};
      for (var key in fields) {
        output[snakeToCamel(key)] = fields[key];
      }

      let sender = user.value;
      if (authUser && authUser.value.id == output.sender) {
        sender = authUser.value;
      }

      const node = {
        id: obj.pk,
        ...output,
        sender,
      };

      let receiverId = null;
      if (Number(node.createdBy) === Number(authUser.value.id)) {
        receiverId = node.receiver;
      } else {
        receiverId = node.createdBy;
      }

      const index = edges.edges.findIndex((_: any) => _.node.id === obj.pk);
      if (index > -1) {
        conversations.value.edges.splice(index, 1, { node });
        const lastConversation = conversations.value.edges.slice(-1)[0];
        setLastConversation({
          lastConversation,
          receiver: receiverId,
        });
      } else {
        if (Number(receiverId) === Number(user.value.id)) {
          conversations.value.edges.push({ node });
        }
        setLastConversation({
          lastConversation: node,
          receiver: receiverId,
        });
      }
    }
  };

  const updateConversation = async (payload: any) => {
    let messages = JSON.parse(JSON.stringify(conversations.value));
    if (messages) {
      const index = messages.value?.edges?.findIndex(
        (_: any) => _.node.id === payload.id
      );
      if (index > -1) {
        conversations.value?.edges?.splice(index, 1, { node: payload });
      }
    }
  };

  const checkConnection = async (sender: any, receiver: any) => {
    const variables = { sender, receiver };
    const { data }: any = await useAsyncQuery(checkConnectionQuery, variables);
    const { checkConnection } = data.value;
    return checkConnection;
  };

  const createConnection = async (sender: any, receiver: any) => {
    try {
      const variables = { sender, receiver };
      const { mutate: setCreateConnection } = useMutation(
        createConnectionMutation,
        { variables }
      );
      return await setCreateConnection();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPatientByDoctor = async ({
    companyId,
    groupName,
    doctorId,
    statusId,
    statusName,
  }: any) => {
    const variables = { companyId, groupName, doctorId, statusId, statusName };
    const { data }: any = await useAsyncQuery(
      fetchPatientByDoctorQuery,
      variables
    );
    const { userCompany } = data.value;
    return userCompany;
  };

  const fetchDoctorsByPatient = async ({
    userId,
    groupName,
    statusId,
  }: any) => {
    const variables = { userId, groupName, statusId };
    const { data }: any = await useAsyncQuery(
      fetchDoctorsByPatientQuery,
      variables
    );
    const { userCompany } = data.value;
    return userCompany;
  };

  const fetchConversation = async (connectionId: any) => {
    const variables = { connectionId };
    const { onResult: fetchConversationIsDone } = useQuery(
      fetchConversationsQuery,
      variables
    );
    fetchConversationIsDone(({ data }: any) => {
      conversations.value = data.conversations || [];
      return conversations.value;
    });
  };
  const fetchConnectedUser = async ({ userId }: any) => {
    const variables = { userId };
    const { onResult: fetchConnectedUserIsDone } = useQuery(
      fetchConnectedUserQuery,
      variables
    );

    fetchConnectedUserIsDone(({ data }: any) => {
      const connectedUser = data.connections?.map((connection: any) => {
        const findConnectedUser = (connection: any, userId: any) => {
          let lastConversation = null;
          if (connection.coversationConnectionId.edges.length > 0) {
            lastConversation = connection.coversationConnectionId.edges[0].node;
          }
          if (
            connection.receiver &&
            Number(connection.receiver.id) === Number(userId)
          ) {
            return {
              ...connection.sender,
              lastConversation,
            };
          } else {
            return {
              ...connection.receiver,
              lastConversation,
            };
          }
        };
        return findConnectedUser(connection, userId);
      });
      connectedUsers.value = connectedUser;
    });
  };

  return {
    setUser,
    setAuthUser,
    setPatientOrDoctorUsers,
    setLastConversation,
    getConversation,
    getConnectedUsers,
    fetchPatientByDoctor,
    fetchDoctorsByPatient,
    pushConversation,
    updateConversation,
    checkConnection,
    createConnection,
    fetchConversation,
    fetchConnectedUser,
  };
});
