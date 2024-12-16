import axios from 'axios';
import  router  from "@/router/index.js";
import message from "@/utils/message.js";

const Base_url = "http://localhost:8080";

// 创建 axios 实例
const instance = axios.create({
    baseURL: Base_url,
    timeout: 10000, // 请求超时时间
});



// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 获取 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token; // 设置 Authorization 请求头
        }
        return config;
    },
    (error) => {
        message.error('网络错误或超时');
        return Promise.reject(error); // 拦截请求错误
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 响应成功
        if (response.status === 200) {
            return response.data; // 返回接口数据
        }
        return Promise.reject(response);
    },
    (error) => {
        // 响应错误处理
        if (error.response) {
            const { status } = error.response;
            console.error('响应错误状态码:', status);

            if (status === 401) {
                message.error('未登录或登录已过期');
                // 未授权，跳转到登录页面
                router.push('/login');
            } else if (status === 403) {
                message.error('无权限访问该资源');
            } else if (status === 500) {
                message.error('服务器内部错误');
            }
        } else {
            console.error('网络错误或超时:', error.message);
        }
        return Promise.reject(error); // 拦截响应错误
    }
);

// 封装请求函数
export function request(config = {}) {
    const { url, method = 'GET', headers, data, params } = config;

    return instance({
        url,
        method,
        headers,
        data,
        params,
    });
}
