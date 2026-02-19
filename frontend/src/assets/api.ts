//one configure axions instance used by all components.
//instead of writing full url + auth header in every component
// we configure it once here, every api.get(),api.post() automatically gets base url + JWT token
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5000/api"; //read backend url from .env file

//create a custom Axios instance with present config
const api = axios.create({
    baseURL : API_BASE_URL,
    headers: {
        "Content-Type": "application/json", //all req send json
    },
});
//Request Interceptor --> runs before api req
//read JWT from localstorage and add to header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    // Bearer token format required by our backend auth middleware
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Must return config — otherwise request is cancelled
  return config;
})
// Resaponse INTERCEPTOR --> runs after every api res,
// if backend returns 401 (token expires/invalid) -->clear session & redirect to login automatically
api.interceptors.response.use(
    (response) => response, //pass reesponse through unchanges
    (error) => {
        if(error?.response?.status === 401){
            localStorage.removeItem("token"); // remove the invalid/expired token from browser
            //only redirect if user is on protected page , avoid redirect loop on /login or /register
            if(window.location.pathname.startsWith("/dashboard")) {
                window.location.assign("/login");
            }
        }
        return Promise.reject(error); //show their own errors
    } 
);
export default api;