import request from '@/router/axios';
import url from '@/config/url';

export const loginByUsername = (userName, password, code, redomStr) => request({
    url: url.v1.login,
    method: 'post',
    meta: {
        isToken: false
    },
    data: {
        userName,
        password,
        code,
        redomStr
    }
})

export const getUserInfo = () => request({
    url: url.v1.userInfo,
    method: 'get'
});

export const refeshToken = (token) => request({
    url: url.v1.refreshToken,
    method: 'post',
    data: {
        AccessToken: token
    }
})

export const getMenu = (parent = 33) => request({
    url: url.v1.indexMenu,
    method: 'get',
    params: {
        parent: parent
    }
});

export const getTopMenu = () => request({
    url: url.v1.indexTopMenu,
    method: 'get'
});

export const sendLogs = (list) => request({
    url: url.v1.sendLogs,
    method: 'post',
    data: list
})

export const logout = () => request({
    url: url.v1.logout,
    method: 'get'
})