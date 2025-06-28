import axios from "axios";

const API_BASE = "https://apisl.mammutepd.ir"; // Change this in production
axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post["Content-Type"] = "application/json";

// Restore token from localStorage if available
const token = localStorage.getItem("auth_access_token_smartlight");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  phone: string;
  password: string;
}

export interface DeviceCreate {
  name: string;
  mac_address: string;
}

export interface EventCreate {
  device_id: number;
  turned_on_at: string; // ISO string
  turned_off_at?: string;
}

export interface CommandPayload {
  command: string;
  target?: string;
  payload?: Record<string, any>;
}
export async function login(
  username: string,
  password: string
): Promise<Token> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await axios.post<Token>("/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // Set token in Axios and localStorage
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${res.data.access_token}`;
  localStorage.setItem("auth_access_token_smartlight", res.data.access_token);

  return res.data;
}

export async function getStats(): Promise<any> {
  const res = await axios.get("/stats/");
  return res;
}

export async function getDevices(): Promise<any> {
  const res = await axios.get("/devices/db/");
  return res.data;
}

export async function getOnlineDevices(): Promise<any> {
  const res = await axios.get("/devices/online/");
  return res.data;
}
export async function sendCommand(
  mac_address: string,
  payload: CommandPayload
): Promise<any> {
  const res = await axios.post(`/send-command/${mac_address}`, payload);
  return res.data;
}

