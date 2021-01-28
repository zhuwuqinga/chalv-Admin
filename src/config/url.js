/**
 * 全局配置文件
 */
export default {
    v1: {
        //上传
        upload: {
            file: "os/obs/upload",
            file80:"os/obs/uplodImgFile80",
            video:"os/obs/uploadVideo",
        },
        login: "adm/admin/login", //登陆
        userInfo: "adm/admin/UserInfo", //获取当前管理员信息
        refreshToken: "adm/admin/refreshToken", //刷新token
        indexMenu: "adm/admin/getMenu", //左侧菜单
        indexTopMenu: 'adm/admin/getTopMenu', //头部菜单
        logout: "adm/admin/logout", //退出
        sendLogs: "adm/admin/sendLogs", //同步前端日志到数据库
        //系统配置
        configDetails: "adm/admin/config/details", //获取系统配置
        configEdit: "adm/admin/config/edit", //修改系统配置
        thGetArea: "th/common/getArea", //修改系统配置
        reasonList: "adm/reason/list",
        reasonAdd: "adm/reason/add",
        reasonDelete: "adm/reason/delete",
        reasonUpdate: "adm/reason/update",
        upgradeList:"adm/upgrade/list",
        upgradeUpdate:"adm/upgrade/update",
        upgradeAdd:"adm/upgrade/add",
        upgradeDelete:"adm/upgrade/delete",
        releaseList:"adm/release/list",
        releaseUpdate:"adm/release/update",
        releaseAdd:"adm/release/add",
        releaseDelete:"adm/release/delete",
        //菜单
        menu: {
            //菜单管理
            accessOptions: "v1/admin/menu/AccessOptions", //菜单权限选项
            selectOptions: "v1/admin/menu/SelectOptions", //菜单权限选项
            list: "v1/admin/menu/List", //菜单数据
            details: "v1/admin/menu/details", //菜单详情
            edit: "v1/admin/menu/edit", //添加/编辑
            delete: "v1/admin/menu/delete", //删除菜单
            checkName: "v1/admin/menu/checkName", //删除菜单
        },
        //管理员
        manager: {
            verifyName: "v1/manager/verifyName", //验证名字是否重复
            roleTree: "adm/role/roleTree", //权限树
            roleSelect: "v1/admin/manager/roleSelect", //权限下拉
            list: "adm/admin/manager/list", //管理员列表 
            edit: "adm/admin/manager/edit", //修改管理员信息
            updateStatus: "adm/admin/manager/updateStatus", //修改状态
            details: "v1/admin/manager/details", //管理员信息
            updateFields: "v1/admin/manager/UpdateFields", //修改字段
            delete: "adm/admin/manager/Delete", //删除管理员
            updatePassword: "adm/admin/manager/UpdatePassword" //修改密码
        },
        naction: {
            list: "adm/naction/list", //
            menuLeftList: "adm/naction/menuLeftList", //
            details: "adm/naction/details", //
            selectOptions: "adm/naction/selectOptions", //
            saveOrUpdate: "adm/naction/saveOrUpdate", //
            delete: "adm/naction/delete", //
        },
        //角色
        role: {
            list: "adm/role/list", //角色列表
            modifyRole: "adm/role/modifyRole", //修改角色权限
            edit: "adm/role/updateRole", //编辑角色
            findOne: "adm/role/findOne", //查询校色权限
            delete: "adm/role/deleteRole", //删除角色
            add: "adm/role/addRole", //添加角色
            roleTree: "adm/role/roleTree", //
            resourceIdList: "adm/role/resourceIdList",
        },
        carousel: {
            list: "adm/carousel/list", //轮播图列表    
        },
        //用户
        user: {
            list: "adm/user/userList", //用户列表
            edit: "v1/admin/users/edit", //修改管理员信息
            updateStatus: "v1/admin/users/updateStatus", //修改状态
            details: "v1/admin/users/details", //管理员信息
            updateFields: "v1/admin/users/UpdateFields", //修改字段
            delete: "v1/admin/users/Delete", //删除管理员
            updatePassword: "v1/admin/users/UpdatePassword", //修改密码
            buildTreeUserInfoByUserId: "adm/user/buildTreeUserInfoByUserId", //trees
            dialogList: "adm/user/dialogList", //管理员选择用户信息
            interestList: "adm/interest/list", //
            interestUpdate: "adm/interest/update", //
            interestAdd: "adm/interest/add", //
            interestDelete: "adm/interest/delete", //
        },
        //短视频
        video: {
            list: "vi/video/list", //短视频列表
            edit: "video/video/edit", //修改管理员信息
            updateStatus: "vi/video/updateStatus", //修改状态
            details: "v1/video/details", //短视频信息
            updateFields: "v1/video/UpdateFields", //修改字段
            delete: "vi/video/delete_video", //删除短视频
            authVideo: "vi/video/auth_video", //审核短视频
            videoTypeList: "vi/videoType/list", //短视频分类列表
            videoTypeEdit: "vi/videoType/saveOrEdit", //短视频分类编辑新增接口
            videoTypeDelete: "vi/videoType/deleteVideoType", //短视频分类删除接口
            videoTypeUpdateStatus: "vi/videoType/updateStatus", //短视频分类修改状态接口
        },
        //主播
        anchor: {
            presentInfoList: "live/presentInfo/list", //主播列表
            addPresentInfo: "live/presentInfo/addPresentInfo", //主播审核
            deletePresentInfo: "live/presentInfo/deletePresentInfo", //直播间列表
            updatePresentInfo: "live/presentInfo/updatePresentInfo", //封停直播间 or 解封直播间   
            //end
            list: "live/anchor/list", //主播列表
            auth: "live/anchor/auth", //主播审核
            roomList: "live/roomInfo/list", //直播间列表
            authRoom: "live/roomInfo/authRoom", //封停直播间 or 解封直播间
            addRoom: "live/roomInfo/add_room", //开直播
            editRoomInfo: "live/roomInfo/editRoomInfo", //添加地址
            updateRoomInfo: "live/roomInfo/updateRoomInfo",
            stop: "live/roomInfo/stop", //
            addRoomManager: "live/roomInfo/addRoomManager", //添加房管
            generalStreamName: "live/roomInfo/generalStreamName", //添加地址
            getRoomAddr: "live/roomInfo/getRoomAddr", //查看地址
            setIsRecord: "live/anchor/setIsRecord", //设置是否录播
        },
        Agreement: {
            list: "adm/agreement/list",
            addAgreement: "adm/agreement/addAgreement",
            updateAgreement: "adm/agreement/updateAgreement", //添加房管
            deleteAgreement: "adm/agreement/deleteAgreement", //添加地址   
        },
        //数据字典
        ttcSysDict: {
            dataList: "adm/ttcSysDict/dataList", //
            saveOrUpdateAdm: "adm/ttcSysDict/saveOrEdit", //这直播分类修改删除
            setStatus:"adm/ttcSysDict/setStatus",
            list: "live/ttcSysDict/liveTypeTrees", //直播分类select列表
            resolutionTypeList: "live/ttcSysDict/resolutionTypeList", //直播视频分类select列表
            typeList: "live/ttcSysDict/typeList", //直播分类列表
            saveOrUpdate: "live/ttcSysDict/saveOrEdit", //这直播分类修改删除
            deleteType: "live/ttcSysDict/deleteType", //
        },
        supplier:{
             list:"adm/supplier/list",
             delete: "adm/supplier/delete", 
             update: "adm/supplier/update", 
             add: "adm/supplier/add", 
             supplierTree:"adm/supplier/supplierTree",
        },
        //商城
        market: {
            downloadExcel:"mark/market/exportExcel",
            updateWindow: "mark/goodsWindow/update",
            deleteSku: "mark/goodsSpe/delete",
            updateSku: "mark/goodsSpe/updateSku",
            getSkuByGoodId: "mark/goodsSpe/getSkuByGoodId",
            goodsWindowList: "mark/goodsWindow/list",
            deleteGoodsWindowByIds: "mark/goodsWindow/deleteByIds", //
            addToWindow: "mark/goods/addToWindow", //添加到橱窗
            expressListTree: "mark/express/listTree", //快递公司接口
            list: "mark/market/list", //商城订单列表接口
            queryKaidi: "mark/market/queryOrder", //快递100 查询
            getOrderInfo: "mark/market/orderInfo", //订单详情
            returnOrderExcel:"mark/ttcMarketReturnOrder/exportExcel",
            returnOrderList: "mark/ttcMarketReturnOrder/list", //退款订单列表
            authOrder: "mark/ttcMarketReturnOrder/authOrderReturn", //审核退款订单
            returnOrderInfo: "mark/ttcMarketReturnOrder/returnOrderInfo", //退款单详情
            goodsList: "mark/goods/list", //商品列表
            listChildTree: "mark/goodsType/listChildTree", //商品类别tree
            goodTypeTree: "mark/goodsType/listTree", //商品列表上级tree
            goodsTypeTree: "mark/goodsType/goodTypeTree", //tree
            findSpeByTypeIdTree: "mark/speGroup/findSpeByTypeIdTree", //商品规格tree
            addGoods: "mark/goods/addGoods", //添加商品
            addLogisticsNo: "mark/market/addLogisticsNo", //添加快递单号 发货
            deleteByIds: "mark/goods/deleteByIds", //批量删除商品
            shelvesBatchIds: "mark/goods/shelvesBatchIds", //批量上下架商品
            updateGoods: "mark/goods/updateGoods", //修改商品
            speGroupList: "mark/speGroup/list", //规格组列表
            addSpeGroup: "mark/speGroup/addSpeGroup",
            updateSpeGroup: "mark/speGroup/updateSpeGroup",
            deleteSpeGroup: "mark/speGroup/deleteSpeGroup",
            speValueList: "mark/goodsSpeValue/list", //规格组列表
            addSpeValue: "mark/goodsSpeValue/addSpeValue",
            updateSpeValue: "mark/goodsSpeValue/updateSpeValue",
            deleteSpeValue: "mark/goodsSpeValue/deleteSpeValue",
            findSpeGroupTree: "mark/speGroup/findSpeGroupTree",
            findSpeGroupTreeForm: "mark/speGroup/findSpeGroupTreeForm",
            skuGoodsAdds: "mark/goodsSpe/skuGoodsAdds", //规格设置接口
            goodsHotList: "mark/hostsearch/list", //热搜词列表
            addHostSearcher: "mark/hostsearch/addHostSearcher", //添加热搜词
            deleteHostSearcher: "mark/hostsearch/deleteHostSearcher", //删除热搜词
            updateHostSearcher: "mark/hostsearch/updateHostSearcher", //修改热搜词
            appInfoList: "mark/appraise/list", //评论列表
            deleteAppInfo: "mark/appraise/deleteAppInfo", //删除评论
            updateAppInfoIsTop: "mark/appraise/updateAppInfoIsTop", //置顶
            goodsTypeList: "mark/goodsType/list", //类别列表
            addGoodType: "mark/goodsType/addGoodType", //添加
            deleteGoodType: "mark/goodsType/deleteGoodType", //删除
            updateGoodType: "mark/goodsType/updateGoodType", //修改
            goodsTypeTagListTree: "mark/goodsTypeTag/listTree", //商品标签tree 数据 
            authOrderReturnFail: "mark/ttcMarketReturnOrder/authOrderReturnFail", //订单退款   
            confirmOrder: "mark/ttcMarketReturnOrder/confirmOrder", //确认订单   
            goodsTypeTagList: "mark/goodsTypeTag/list", //标签列表 
            addGoodTypeTag: "mark/goodsTypeTag/addGoodTypeTag", //添加
            deleteByIdsTag: "mark/goodsTypeTag/deleteByIds", //删除
            updateGoodsTypeTag: "mark/goodsTypeTag/updateGoodsTypeTag",
            speGroupListTree: "mark/speGroup/listTree", //
        },
        integral:{
               goodsList:"mark/integral/list", 
               delete:"mark/integral/delete",
               shelvesBatchIds:"mark/integral/shelvesBatchIds",
               add:"mark/integral/add",
               update:"mark/integral/update",

        },
        IntegralGoodsSpe:{
            skuGoodsAdds:"mark/IntegralGoodsSpe/skuGoodsAdds",
            deleteSku: "mark/IntegralGoodsSpe/delete",
            updateSku: "mark/IntegralGoodsSpe/updateSku",
            getSkuByGoodId: "mark/IntegralGoodsSpe/getSkuByGoodId",
        },
        integralType:{
               typeList:"mark/integralType/list",
               typeAdd:"mark/integralType/add",
               typeUpdate:"mark/integralType/update",
               typeDelete:"mark/integralType/delete",
               updateStatus:"mark/integralType/updateStatus",
               listTree:"mark/integralType/listTree",
        },
        integralGroup:{
                list:"mark/integralSpeGroup/list",
                add:"mark/integralSpeGroup/add",
                update:"mark/integralSpeGroup/update",
                delete:"mark/integralSpeGroup/delete",
                listTree:"mark/integralSpeGroup/listTree",
                findSpeByTypeIdTree:"mark/integralSpeGroup/findSpeByTypeIdTree",
                findSpeGroupTreeForm:"mark/integralSpeGroup/findSpeGroupTreeForm",
        },
        integralOrder:{
             list:"mark/integralOrder/list",   
             addLogisticsNo: "mark/integralOrder/addLogisticsNo", //添加快递单号 发货
             exportExcel:"mark/integralOrder/exportExcel",//下载
        },
        //旅游产品
        products: {
            addWindow:"products/product/addWindow",//旅游产品添加到橱窗
            agencyList: "products/agency/list", //旅行社
            addAgency: "products/agency/addAgency", //旅行社
            updateAgency: "products/agency/updateAgency", //旅行社
            deleteAgency: "products/agency/deleteAgency", //旅行社
            addVerificationOffice: "products/agency/addVerificationOffice", //
            //end
            setRoute: "products/product/setRoute", //
            productsList: "products/product/list", //旅游产品列表
            addProducts: "products/product/addProducts", //旅游产品添加
            updateProducts: "products/product/updateProducts", //修改产品
            deleteProduct: "products/product/deleteProduct", //删除旅游产品
            agencyListTree: "products/agency/listTree", //旅行社数据tree
            targetPlaceListTree: "products/targetPlace/listTree", //目的地数据tree
            productMealList: "products/meal/list", //套餐列表
            productsListTree: "products/product/listTree", //旅游产品树形
            updateProductMeal: "products/meal/updateProductMeal", //修改套餐
            addProductMeal: "products/meal/addProductMeal", //添加套餐
            mealListTree: "products/meal/listTree", //套餐下拉数据tree
            deleteMealByIds: "products/meal/deleteMealByIds", //删除套餐
            startPlaceList: "products/startPlace/list", //起始地列表
            deleteStartPlace: "products/startPlace/deleteStartPlace", //删除起始地
            addStartPlace: "products/startPlace/addStartPlace", //添加起始地
            updateStartPlace: "products/startPlace/updateStartPlace", //修改起始地
            targetPlaceList: "products/targetPlace/list", //起始地列表
            deleteTargetPlace: "products/targetPlace/deleteTargetPlace", //删除起始地
            addTargetPlace: "products/targetPlace/addTargetPlace", //添加起始地
            updateTargetPlace: "products/targetPlace/updateTargetPlace", //修改起始地
            getProvince: "products/district/getProvince", //拿到省份
            getArea: "products/district/getArea", //拿到城市
            routeList: "products/route/list", //行程列表
            startPlaceListTree: "products/startPlace/listTree", //起始点tree 数据接口
            addRoute: "products/route/addRoute", //添加行程
            updateRoute: "products/route/updateRoute", //修改行程
            deleteRoute: "products/route/deleteRoute", //删除行程
            productRouteListTree: "products/productRoute/listTree", //
            productRouteTrafficListTree: "products/productRoute/listTreeTracc", //
            findOneByMealIdAndDateTime: "products/calendar/findOneByMealIdAndDateTime", //
            addCalendar: "products/calendar/addCalendar", //
            insuranceInfoList: "products/insuranceInfo/list", //保险列表
            addInsuranceInfo: "products/insuranceInfo/addInsuranceInfo", //
            updateInsuranceInfo: "products/insuranceInfo/updateInsuranceInfo",
            delete: "products/insuranceInfo/delete", //
            infoStatus: "products/insuranceInfo/infoStatus", //
            distanceList: "products/distance/list", //
            addDistance: "products/distance/addDistance", //
            updateDistance: "products/distance/updateDistance", //
            deleteDistanceByIds: "products/distance/deleteDistanceByIds", //
            detailList: "products/detail/list", //
            addDistanceDetail: "products/detail/addDistanceDetail",
            updateDistanceDetail: "products/detail/updateDistanceDetail", //
            deleteDistanceDetailByIds: "products/detail/deleteDistanceDetailByIds", //
            orderList: "products/ttcTourOrder/list", //订单列表
            returnList: "products/returnOrder/list", //退款订单接口
            authReturnOrder: "products/returnOrder/authReturnOrder", //退款审核
            //start
            trafficList: "products/traffic/list", //
            addTraffic: "products/traffic/addTraffic", //订单列表
            updateTraffic: "products/traffic/updateTraffic", //退款订单接口
            deleteTraffic: "products/traffic/deleteTraffic", //退款审核
            //end        

        },
        circle: {
            specialListTree: "circle/special/listTree",
            circleList: "circle/tourCircle/list",
            setIsTop: "circle/tourCircle/setIsTop",
            deleteCircleInfo: "circle/tourCircle/deleteCircleInfo",
            authTourCircleInfo: "circle/tourCircle/authTourCircleInfo",
            updateCarousel: "adm/carousel/updateCarousel", //
            updateCircleInfo: "circle/tourCircle/updateCircleInfo",
            deleteCirleInfo: "circle/tourCircle/deleteCircleInfo",
            list: "adm/carousel/resourcesList", //
            addCarousel: "adm/carousel/addCarousel", //
            updateCarousel: "adm/carousel/updateCarousel", //
            deleteByIds: "adm/carousel/deleteCarousel", //
            windowList: "circle/window/list", //橱窗列表
            addRelation: "circle/relation/addRelation", //
            getListByResourceId: "circle/relation/getListByResourceId", //
            deleteWindow: "circle/relation/deleteWindow", //
        },
        special: {
            list: "circle/special/list",
            addSpecialType: "circle/special/addSpecialType",
            updateGoodsTypeTag: "circle/special/updateGoodsTypeTag",
            deleteByIds: "circle/special/deleteByIds",
        },
        NoticeManage: {
            list: "circle/tourCircle/noticeList",
            add: 'circle/tourCircle/addCircleInfo'
        },
        hotel: {
            selectHotle: "th/hotel/admin/selectHotle",
            list: "th/hotel/admin/selectHotleInfoList", //酒店列表
            addhotel: "th/hotel/admin/addHotleInfoList",
            updatehotel: "th/hotel/admin/updateHotleInfoList",
            roomlist: "th/hotel/admin/selectHotleRoomTypeList",
            addroom: "th/hotel/admin/addHotleRoomTypeList",
            updateroom: "th/hotel/admin/updateHotleRoomTypeList",
            childRoomList: "th/hotel/admin/selectHotleRoomChildList",
            addChildRoomList: "th/hotel/admin/addHotleRoomChildList",
            updateChildRoomList: "th/hotel/admin/updateHotleRoomChildList",
            priceList: "th/hotel/admin/selectHotlePriceList",
            addHotlePriceList: "th/hotel/admin/addHotlePriceList",
            updateHotlePriceList: "th/hotel/admin/updateHotlePriceList",
            delAllHotel: "th/hotel/admin/delHotleInfo",
            delAllRoom: "th/hotel/admin/delHotleRoomType",
            delAllChildRoom: "th/hotel/admin/delHotleRoomChild",
            rstaurantList: "th/hotel/admin/selectRstaurantList",
            addRstaurantList: "th/hotel/admin/addRstaurant",
            updateRstaurantList: "th/hotel/admin/updateRstaurant",
            delRstaurantList: "th/hotel/admin/delRstaurant",
            clerk: "th/hotel/admin/selectVerificationList",
            addClerk: "th/hotel/admin/addVerification",
            selectHotleOrderList: "th/hotel/admin/selectHotleOrderList", //酒店订单列表
            selectHotleOrderInfo: "th/hotel/admin/selectHotleOrderInfo", //酒店订单详情
            selectHotleRefundList: "th/hotel/admin/selectHotleRefundList", //退款列表
            hotelReturnOrder: "th/hotel/return/returnOrder", //退款申请
            starlist: "th/hotel/admin/selectHotleDictList",
            starExportExcel: "th/hotel/admin/exportExcel",
            refudExportExcel: "th/hotel/admin/refudExportExcel",
        },
        scenic: {
            list: "scenic/order/list", //景点列表
            senciDetail: "/scenic/order/detail", //景点详情
            returnList: "/scenic/order/return_list", //退款列表
            returnDetail: "/scenic/order/return_detail", //景点退款详情
            auditRefundOrder: "/scenic/order/audit_refund_order", //景点退款审核
            insuranceOrderList: "/scenic/insurance_order/list", //保险列表
            insuranceList: "/scenic/insurance/list", //保险信息列表
            addSave: "/scenic/insurance/save", //新增保险
            updateSave: "/scenic/insurance/update", //新增保险
            deleteByIdsSave: "/scenic/insurance/deleteByIds", //删除保险
            touristList: "/scenic/tourist/list", //游客信息
            touristExportExcel: "/scenic/order/exportExcel", //订单导出
            returnExportExcel: "/scenic/order/exportExcelReturnOrder", //订单退款导出
            classListType: "scenic/spots_type/list_type",
            classList: "scenic/spots_type/list",
            addSpots: "scenic/spots_type/save",
            updateSpots: "scenic/spots_type/update",
            delSpots: "scenic/spots_type/deleteByIds",
            attrList: "scenic/spots/list",
            addAttrList: "scenic/spots/save",
            updateAttrList: "scenic/spots/update",
            delAttrList: "scenic/spots/deleteByIds",
            ticketList: "scenic/spots_ticket/list",
            addTicketList: "scenic/spots_ticket/save",
            updateTicketList: "scenic/spots_ticket/update",
            ticketType: "scenic/ticket_type/list",
            addTicketType: "scenic/ticket_type/save",
            updateTicketType: "scenic/ticket_type/update",
            delTicketType: "scenic/ticket_type/deleteByIds",
            ticketTypeList: "scenic/ticket_type/list_ticket_type",
            ticketPriceList: "scenic/ticket_calendar/list",
            addTicketPriceList: "scenic/ticket_calendar/save",
            updateTicketPriceList: "scenic/ticket_calendar/update",
            delTicketPriceList: "scenic/spots_ticket/deleteByIds",
            clerk: "scenic/verification/list",
            addClerk: "scenic/verification/add_verification",
            addGoodsWindow: "scenic/goods_window/add_goods_window",
            liststar: "scenic/common/list_star",
            cancelWindow: "scenic/goods_window/cancle_goods_window",

        },
        feedback: {
            report: "scenic/user/list_report",
            feedList: "scenic/user/list_feed_back",
        },
        match:{
            matchList:"circle/matchInfo/list",//赛事列表
            matchListAdd:"circle/matchInfo/addMatch",//赛事列表新增
            weekNumList:"circle/matchTeam/weekNumList",//赛事列表获取查询周期下拉
            prizeRecordList:"circle/matchTeam/prizeRecordList",//赛事列表获取奖单
            getRankList:"circle/matchInfo/getRankList",//赛事列表用户排名
            getMatchDetail:"circle/matchInfo/getMatchDetail",//赛事列表编辑回显
            updateMatch:"circle/matchInfo/updateMatch",//赛事列表编辑
            deleteMatch:"circle/matchInfo/deleteMatch",//赛事列表删除
            getDistrict:"circle/ttcDistrict/getDistrict",//赛事区域
            getMatchTeamList:"circle/matchTeam/list",//参赛队伍
            promotion:"circle/matchTeam/promotion",//赛事队伍晋级
            degrade:"circle/matchTeam/degrade",//赛事队伍降级
            getDetail:"circle/matchTeam/getDetail",//赛事队伍编辑回显
            updateTeam:"circle/matchTeam/updateTeam",//赛事队伍编辑回显保存
            increaseTicket:"circle/matchTeam/increaseTicket",//赛事队伍增加虚拟票数
            unreviewedList:"circle/matchTeam/unreviewedList",//待参赛队伍
            whetherInspect:"circle/matchTeam/inspect",//待参赛是否同意
            matchDelete:"circle/matchTeam/delete",//参赛、待参赛删除
            getMatchAreaList:"circle/matchInfo/getMatchAreaList",//赛区筛选
            getMatchSectionList:"circle/matchInfo/getMatchSectionList",//赛段筛选
            getMatchAddTeam:"circle/matchTeam/addTeam",//新增队伍
            matchListGet:"circle/matchTicket/getConfig",//任务配置查询
            matchUpdate:"circle/matchTicket/updateConfig",//任务配置修改
            matchServiGet:"circle/matchConfig/getServiceConfig",//客服配置查询
            matchServiUpdate:"circle/matchConfig/updateServiceConfig",//客服配置修改
            matchActivityGet:"circle/matchConfig/getActivityConfig",//规则查询
            matchActivityUpdate:"circle/matchConfig/updateActivityConfig",//规则修改
        }
    },
    v2: {
        //java 开发
    }
}