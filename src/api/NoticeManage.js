import request from '@/router/axios';
import url from '@/config/url';

export function getNoticeManageList(data) {
   return request({
        url: url.v1.NoticeManage.list,
        method: 'post',
        data
    })
} 

export function getGoodList(params) {
    return request({
         url: url.v1.market.goodsList,
         method: 'get',
         params
     })
 } 

 export function addList(data) {
    return request({
         url: url.v1.NoticeManage.add,
         method: 'post',
         data
     })
 } 
 