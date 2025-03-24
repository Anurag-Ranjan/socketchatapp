import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useChatStore = create((set) => ({
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

  //todo:optimize this later
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
