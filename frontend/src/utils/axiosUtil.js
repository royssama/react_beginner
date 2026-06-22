import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

const axiosUtil = {
  get: async (url, params = {}, config = {}) => {
    return axiosInstance.get(url, { params, ...config });
  },
  post: async (url, data = {}, config = {}) => {
    return axiosInstance.post(url, data, config);
  },
};

export default axiosUtil;
