import axios from 'axios';

let token = null;
if (typeof window !== 'undefined') {
  token = window.localStorage.getItem('access-token');
}
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  withCredentials: true,
  headers: { Authorization: `Basic ${token}` },
});
export default instance;
