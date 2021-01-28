import Layout from '@/page/index/'

export default [{
        path: '/wel',
        component: Layout,
        redirect: '/wel/index',
        children: [{
            path: 'index',
            name: '首页',
            meta: {
                i18n: 'dashboard'
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/wel/index')
        }, {
            path: 'dashboard',
            name: '控制台',
            meta: {
                i18n: 'dashboard',
                menu: false,
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
        }]
    }, {
        path: '/form-detail',
        component: Layout,
        children: [{
            path: 'index',
            name: '详情页',
            meta: {
                i18n: 'detail'
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/util/form-detail')
        }]
    }, {
        path: '/info',
        component: Layout,
        redirect: '/info/index',
        children: [{
                path: 'index',
                name: '个人信息',
                meta: {
                    i18n: 'info'
                },
                component: () =>
                    import ( /* webpackChunkName: "views" */ '@/views/user/info')
            }, {
                path: 'setting',
                name: '个人设置',
                meta: {
                    i18n: 'setting'
                },
                component: () =>
                    import ( /* webpackChunkName: "views" */ '@/views/user/setting')
            },

        ]
    },
    {
        path: '/orderInfo',
        component: Layout,
        children: [{
            path: 'index',
            name: 'orderInfo',
            meta: {
                i18n: 'detail'
            },
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/market/orderInfo')
        }]
    },
    {
        path: '/senciInfo',
        component: Layout,
        children: [{
            path: '/',
            name: '景点订单详情',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/senci/senciInfo')
        }]
    },
    {
        path: '/returnInfo',
        component: Layout,
        children: [{
            path: '/',
            name: '景点退款订单详情',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/senci/returnInfo')
        }]
    },
    {
        path: '/oderDetail',
        component: Layout,
        children: [{
            path: '/',
            name: '酒店订单详情',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/hotelOder/oderDetail')
        }]
    },
    {
        path: '/roomlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '子房型列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/hotel/room/list')
        }]
    }, {
        path: '/ticketlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '门票列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/jingdian/ticketList')
        }]
    }, {
        path: '/ticketypetlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '门票类型列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/jingdian/ticketTypeList')
        }]
    }, {
        path: '/typelist',
        component: Layout,
        children: [{
            path: 'index',
            name: '主房型列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/hotel/room/type')
        }]
    },
    {
        path: '/roomlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '子房型列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/hotel/room/list')
        }]
    }, {
        path: '/ticketlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '门票列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/jingdian/ticketList')
        }]
    }, {
        path: '/ticketypetlist',
        component: Layout,
        children: [{
            path: 'index',
            name: '门票类型列表',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/jingdian/ticketTypeList')
        }]
    }, {
        path: '/clerk',
        component: Layout,
        children: [{
            path: 'index',
            name: '景点核销员',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/jingdian/clerk')
        }]
    }, {
        path: '/hotelclerk',
        component: Layout,
        children: [{
            path: 'index',
            name: '酒店核销员',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/hotel/clerk')
        }]
    },
    {
        path: '/joinList',
        component: Layout,
        children: [{
            path: '/',
            name: '参赛队伍',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/matchMange/joinList')
        }]
    },
    {
        path: '/awards',
        component: Layout,
        children: [{
            path: '/',
            name: '获奖名单',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/matchMange/awards')
        }]
    },
    {
        path: '/ranking',
        component: Layout,
        children: [{
            path: '/',
            name: '用户投票排名',
            component: () =>
                import ( /* webpackChunkName: "views" */ '@/views/matchMange/ranking')
        }]
    },

]