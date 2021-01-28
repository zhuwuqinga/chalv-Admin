// // 基础路径 注意发布之前要先修改这里
let baseUrl = './'

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
    devServer: {
        port: 6099, // 启动端口
        open: true, // 启动后是否自动打开网页
        proxy: {
            '': {
                target: 'http://test.api.chalykj.com',
                  //接口域名
                // target: 'http://localhost:6200/', //接口域名
                // target: 'http://192.168.1.190:6200/', //接口域名 测试环境
                // target: 'http://172.18.9.123:6200/', //接口域名 测试环境
                // target: 'http://192.168.0.20:6200/',//正式环境    
                changeOrigin: true,
                              //是否跨域
                ws: true,
                                        //是否代理 websockets
                secure: true,
                                    //是否https接口
                // pathRewrite: {                  //路径重置
                //     '^/v1': ''
                // }
            }
        }
    },
    publicPath: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: true,
    productionSourceMap: false,
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         return {
    //             plugins: [
    //                 new BundleAnalyzerPlugin()
    //             ]
    //         }
    //     }
    // },
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    }
}