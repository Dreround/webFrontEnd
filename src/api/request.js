import axios from 'axios'
// import {getCookie} from '@/utils/cookieUtils';
// 创建axios实例
const service = axios.create({
    baseURL: '', // api 的 base_url
    timeout: 800 // 请求超时时间 10秒
})

// service.defaults.headers.common['Authorization'] = getCookie('token')


export default service