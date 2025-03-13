import axios from "axios";
import localforage from "localforage";
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import "./global.scss";


axios.interceptors.request.use(config => {
  config.baseURL = import.meta.env.VITE_API_END_POINT;

  let token = localStorage.getItem("access_token");
  let tokenType = localStorage.getItem("token_type");
  if (token !== null && tokenType !== null)
    config.headers.Authorization = `${tokenType} ${token}`;

  return config;
});

localforage.config({
  storeName: "HSPC2025"
})

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
)
