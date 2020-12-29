import axios from 'axios';

const Axios = axios.create({});

Axios.interceptors.request.use(
  config => {
    // eslint-disable-next-line no-param-reassign
    config.headers = {
      ...config.headers,
      Authorization: `Token ${localStorage.getItem('token')}`,
    };

    return config;
  },
  error => Promise.reject(error),
);

export default Axios;
