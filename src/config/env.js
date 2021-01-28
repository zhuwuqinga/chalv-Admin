// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['567566_qo5lxgtishg', '567566_pwc3oottzol', '1066523_v8rsbcusj5q', '1559549_0uz6eneemftl'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
    //baseUrl = `http://test.api.chalykj.com/`; // 开发环境地址
    // baseUrl = `http://localhost:6500/`; // 开发环境地址
    baseUrl = ``;
} else if (env.NODE_ENV == 'production') {
    baseUrl = ``; //生产环境地址
} else if (env.NODE_ENV == 'test') {
    baseUrl = ``; //测试环境地址
}
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}