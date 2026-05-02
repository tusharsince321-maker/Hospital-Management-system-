import axios from "axios";

const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL || "";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

