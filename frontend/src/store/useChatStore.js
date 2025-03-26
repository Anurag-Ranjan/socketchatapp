import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  isUsersLoading: false,
  isMessagesLoading: false,
  messages: [],
  users: [],
  selectedUser: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.messsage);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    //optimise this later
    // The reason for optimisation ---- When the user has selected a different chat then if any sender sends our user a message, the user should be able to see the chat only when opening the chat of the user that sent him the message, but it seems without optimisation no matter where the user is present, the chat will appear and will seem like this user has sent the message but it was sent by a different user
    //Unoptimised code
    // socket.on("newMessage", (newMessage) => {
    //   set({
    //     messages: [...get().messages, newMessage],
    //   });
    // });
    //optimised code
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  //todo:optimize this later (no need) it works perfectly
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
