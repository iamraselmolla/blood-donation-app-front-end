import http from "./httpServices";

const baseUrl = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },
};

const registerUser = (userData) => {
  return http.post(baseUrl.auth.register, userData);
};

const loginUser = (credentials) => {
  return http.post(baseUrl.auth.login, credentials);
};

export default { registerUser, loginUser };
