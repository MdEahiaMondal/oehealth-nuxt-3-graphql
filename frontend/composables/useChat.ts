import { useChatStore } from "~~/stores/chat";

export const useChat = () => {
  const config = useRuntimeConfig();
  const store = useChatStore();
  const socket = ref();

  const joinChatRoom = (connection: any) => {
    if(process.client){
      socket.value = new WebSocket(`${config.public.wsClient}/chat/${connection}/`);
    }
  };

  const sendMessage = (message: any) => {
    if (socket.value) {
      socket.value.send(JSON.stringify(message));
    }
  };

  const receiveMessage = () => {
    if (socket.value) {
      socket.value.onmessage = (e: any) => {
        const data = JSON.parse(e.data);
        if (data) {
          const { conversation } = data;
          store.pushConversation(conversation);
        }
      };
    }
  };

  const sendMessageWhenOpen = (message: any) => {
    if (socket.value) {
      socket.value.onopen = (e: any) => {
        socket.value.send(JSON.stringify(message));
      };
    }
  };

  const closeSocket = () => {
    if (socket.value) {
      socket.value.close();
    }
  };

  const scrollToBottom = (el: any) => {
    const ps = el.ps;
    if (ps) {
      if (el.$el instanceof HTMLElement) {
        el.$el.scrollTop = el.$el.scrollHeight;
        ps.update();
      }
    }
  };

  return {
    joinChatRoom,
    sendMessage,
    receiveMessage,
    sendMessageWhenOpen,
    closeSocket,
    scrollToBottom,
  };
};
