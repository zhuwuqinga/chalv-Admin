import axios from '@/router/axios';
import store from '@/store/';
import { Message } from 'element-ui';
import router from '@/router/router';
import { formNullToEmpty } from '@/util/util'

export const request = (t) => {
    return new Promise((resolve) => {
        var method = t.method || 'get';
        var headers = t.headers || { 'Content-type': 'application/json' }
        var responseType = t.responseType;
        var type = t.type;
        var options = {
            url: t.url,
            method: method,
            headers: headers,
            responseType: responseType
        }
        if (method.toUpperCase() === "get".toUpperCase()) {
            options["params"] = formNullToEmpty(t.data)
        } else if (method.toUpperCase() === "post".toUpperCase() && type === undefined) {
            options["data"] = formNullToEmpty(t.data)
        }else{
            options["data"] = t.data
        }
        axios(options).then((res) => {
            if (res.status != 200) {
                if (res.status == 401) {
                    Message({
                        message: "登陆超时",
                        type: 'warning',
                        onClose: function() {
                            store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
                        }
                    })
                } else {
                    Message({
                        message: "网络请求失败",
                        type: 'error'
                    })
                }
            } else {
                if (res.data.status == 200) {
                    resolve({
                        data: res.data.data,
                        message: res.data.msg,
                        status: res.data.status
                    });
                } else if (res.data.status == 404) {
                    Message({
                        message: res.data.message,
                        type: 'error'
                    })
                } else if (res.status == 401) {
                    store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
                }else if(res.status == 200){
                    resolve({
                        data: res.data,
                        message: res.msg,
                        status: res.status
                    });
                }
            }
        });
    })
}