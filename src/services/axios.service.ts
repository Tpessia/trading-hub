import Axios from "axios";

const axiosService = Axios.create({
    // baseURL: 'https://some-domain.com/api/',
    timeout: 10000,
    withCredentials: true
    // headers: { 'X-Custom-Header': 'foobar' }
});

export default axiosService;