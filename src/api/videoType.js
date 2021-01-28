import request from '@/router/axios';
import url from '@/config/url';

export const videoTypeList = (idstr,authStatus) => request({
    url: url.v1.video.authVideo,
    method: 'post',
    data: {
        idstr: idstr,
        authStatus: authStatus
    }
})
