import axios from "axios";

export const serverAxios = axios.create({
  baseURL: process.env.REACT_APP_API_ADDRESS,
});
