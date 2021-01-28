import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache'; //页面缓冲
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import * as filters from './filters' // 全局filter
import i18n from './lang' // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'
// 引入avue的包
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import AvueUeditor from 'avue-plugin-ueditor'
//视频播放
import VideoPlayer from 'vue-video-player'
import AvueMap from 'avue-plugin-map'

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(VideoPlayer)
Vue.use(AvueUeditor)
Vue.use(AvueMap)
Vue.use(Viewer)
Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Avue, {
        i18n: (key, value) => i18n.t(key, value)
    })
    //注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('basicBlock', basicBlock)
    // 加载相关url地址
Object.keys(urls).forEach(key => {
        Vue.prototype[key] = urls[key];
    })
    // 加载过滤器
Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })
    // 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')