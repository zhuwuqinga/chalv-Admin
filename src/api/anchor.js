import request from '@/router/axios';
import url from '@/config/url';

export const anchorAuth = (idstr,status) => request({
    url: url.v1.anchor.auth,
    method: 'post',
    data: {
        idstr: idstr,
        status: status
    }
})
