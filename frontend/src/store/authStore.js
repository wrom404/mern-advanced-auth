import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api/auth" : "/api/auth";  // this "/api/auth" will run if the import.meta.env.MODE is not equal to dev or it's in production mode. "/api/auth" this endpoint is basically run regardless of the url in the production mode

axios.defaults.withCredentials = true; //configuration. In every single request axios will put the cookies into the request header

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.msg || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.msg || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ isLoading: false, error: null, isAuthenticated: false });
    } catch (error) {
      set({ error: "Error logging in", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.msg || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    await new Promise((resolve) => resolve(setTimeout(resolve, 3000)));
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.log("way katapusang error");
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.msg, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.msg || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (password, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ isLoading: false, error: null, message: response.data.msg });
    } catch (error) {
      set({ isLoading: false, message: response.data.msg });
      throw error;
    }
  },
}));
