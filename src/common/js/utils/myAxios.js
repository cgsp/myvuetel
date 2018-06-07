import axios from 'axios';

// axios.defaults.baseURL = 'https://localhost:3000';
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const myAxios = axios;

export { myAxios };
