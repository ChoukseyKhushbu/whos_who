const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// intercepts requests to add Authorization token
const authInterceptor = (config) => {
  config.headers["Authorization"] = `Bearer ${getAuthToken()}`;
  return config;
};

export default authInterceptor;
