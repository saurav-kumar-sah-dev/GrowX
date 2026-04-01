import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/config/api";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const message = error.response?.data?.message || '';
      
      if (message.includes('deleted') || message.includes('not found')) {
        try {
          await axios.get(`${API.user}/logout`, {
            withCredentials: true,
          });
        } catch (logoutError) {
          console.error('Logout error:', logoutError);
        }
        
        toast.error('Your account has been deleted. Please login again.');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    }
    
    return Promise.reject(error);
  }
);

// Redux
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

// Google Auth
import { GoogleOAuthProvider } from "@react-oauth/google";

// UI
import { Toaster } from "./components/ui/sonner.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);