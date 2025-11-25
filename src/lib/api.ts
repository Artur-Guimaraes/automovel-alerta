import axios from "axios";
import { supabase } from "@/supabaseClient";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";
export const api = axios.create({ baseURL });

const { data } = await supabase.auth.getSession();
const userId = data.session?.user.id; // <- aqui está
console.log("userId:", userId);

api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  // DEBUG: ver no console se está pegando token
  console.log("[api] header Authorization presente?", Boolean(token));
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👇 expõe no console do navegador (apenas em dev)
if (import.meta.env.DEV) (window as any).api = api;
