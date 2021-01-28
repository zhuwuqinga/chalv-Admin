/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { baseUrl } from '@/config/env';

axios.defaults.timeout = 50000;
axios.defaults.baseURL = baseUrl;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = false;
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    const meta = (config.meta || {});
    const isToken = meta.isToken === false;
    if (getToken() && !isToken) {
        config.headers['Authorization'] = getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    
    //headers中配置serialize为true开启序列化  && meta.isSerialize === true
    // if (config.method === 'post') {
    //     config.headers['Content-Type'] = "application/json; charset=utf-8";
    // }
    if (config.method === 'post') {
        config.headers['Content-Type'] = "application/json; charset=utf-8";
        // config.data = qs.stringify(config.data)
    }
    return config
}, error => {
    NProgress.done()
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    const status = Number(res.data.status) || 200;
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg || '友情提示: 错误,请联系管理员解决！';
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    //如果是401则跳转到登录页面
    if (status === 401) store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    }
    return res;
  }, error => {
    NProgress.done();
    return Promise.reject(new Error(error));
  })

export default axios;