<<<<<<< HEAD

<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 基本信息 -->
      <el-row :gutter="20">
        <el-col :span="24" class="order_col1">
          <div>当前订单状态：
            <span v-if="this.orderStatusHed == 1">待支付</span>
            <span v-if="this.orderStatusHed == 2">已支付，待使用</span>
            <span v-if="this.orderStatusHed == 3">退款中</span>
            <span v-if="this.orderStatusHed == 4">已退款</span>
            <span v-if="this.orderStatusHed == 5">已取消</span>
            <span v-if="this.orderStatusHed == 6">已关闭</span>
            <span v-if="this.orderStatusHed == 7">已完成</span>
            <span v-if="this.orderStatusHed == 8">已核销</span>
            <span v-if="this.orderStatusHed == 9">已过期</span>
          </div>
        </el-col>
        <el-col :span="24" class="order_col2">
          <div>基本信息</div>
        </el-col>
        <el-col :span="8" class="order_col3">
          <div>订单编号</div>
        </el-col>
        <el-col :span="8" class="order_col4">
          <div>买家昵称</div>
        </el-col>
        <el-col :span="8" class="order_col5">
          <div>手机号</div>
        </el-col>
        <el-col :span="8">
          <div>{{this.orderNo}}</div>
        </el-col>
        <el-col :span="8">
          <div>{{this.userName}}</div>
        </el-col>
        <el-col :span="8">
          <div>{{this.userPhone}}</div>
        </el-col>
      </el-row>
      <!-- 订单信息 -->
      <div class="senci_row">
        <p>订单信息</p> 
        <avue-crud :data="OrderInfo" :option="option">
          <template slot="orderStatus" slot-scope="scope">
            <el-tag>{{orderStatus[scope.row.orderStatus-1]}}</el-tag>
          </template>
        </avue-crud>
      </div>
      <!-- 房型信息 -->
      <div class="senci_row">
        <p>房型信息</p> 
        <avue-crud :data="touristInfo" :option="touristOption">
          
          <template slot="isWindowHotel" slot-scope="scope">
            <el-tag v-if="isWindowHotel[0]">{{isWindowHotel[0]}}</el-tag>
            <el-tag v-else-if="isWindowHotel[1]">{{isWindowHotel[1]}}</el-tag>
          </template>
        </avue-crud>
      </div>
      <!-- 用户评价对象 -->
      <div class="senci_row">
        <p>用户评价对象</p> 
        <avue-crud :data="paymentData" :option="paymentOption" v-model="user">
        </avue-crud>
      </div>
      <!-- 退款信息 -->
      <div class="senci_row">
        <p>退款信息</p> 
        <avue-crud :data="refundData" :option="refundOption" v-model="user">
          <template slot="returnStatus" slot-scope="scope">
            <el-tag>{{returnStatus[scope.row.returnStatus+2]}}</el-tag>
          </template>
        </avue-crud>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import url from "@/config/url";
export default {
  name: "senciInfo",
  data() {
    return {
      orderStatusHed:'',
      user: {},
      id: undefined,
      orderNo:'',
      userPhone:'',
      userName:'',
      touristInfo:[],
      OrderInfo: [],
      option: {
        page: false,
        addBtn: false, // 表格新增按钮
        menu: false, //	是否显示操作菜单栏
        refreshBtn: false, //刷新按钮
        header: false, //头部显隐
        border:true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "酒店ID",
            prop: "hotelId",
            slot: false,
          },
          {
            label: "酒店名称",
            prop: "hotelName",
          },
          {
            label: "下单数量",
            prop: "roomCount",
          },
        ],
      },
      touristOption: {
        page: false,
        addBtn: false, // 表格新增按钮
        menu: false, //	是否显示操作菜单栏
        refreshBtn: false, //刷新按钮
        header: false, //头部显隐
        border:true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "房型主id",
            prop: "id",
            slot: false,
          },
          {
            label: "子房型名称",
            prop: "roomName",
          },
          {
            label: "库存数量",
            prop: "count",
          },
          {
            label: "是否橱窗商品",
            prop: "isWindowHotel",
            slot: true,
            dicData: [
              {
                label: "否",
                value: 0,
              },
              {
                label: "是",
                value: 1,
              }
            ],
          },
        ],
      },
      orderStatus: [
        "待支付",
        "已支付，待使用",
        "退款中",
        "已退款",
        "已取消",
        "已关闭",
        "已完成",
        "已核销",
        "已过期",
      ],
      paymentData: [],
      paymentOption: {
        page: false,
        addBtn: false, // 表格新增按钮
        menu: false, //	是否显示操作菜单栏
        refreshBtn: false, //刷新按钮
        header: false, //头部显隐
        border:true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "评价内容",
            prop: "content",
          },
          {
            label: "	点赞数",
            prop: "giveCount",
          },
          {
            label: "评分",
            prop: "score",
          },
          {
            label: "图片",
            prop: "addrImg",
            type: "img",
            display: false,
          },
          {
            label: "对象ID",
            prop: "resourceId",
          },
          {
            label: "商家回复",
            prop: "resourceType",
          },
          {
            label: "状态",
            prop: "status",
          },
          {
            label: "评价订单编号",
            prop: "orderNo",
          },
        ],
      },
      refundData: [],
      refundOption: {
        page: false,
        addBtn: false, // 表格新增按钮
        menu: false, //	是否显示操作菜单栏
        refreshBtn: false, //刷新按钮
        header: false, //头部显隐
        border:true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "退款单号",
            prop: "refundNo",
            slot: false,
          },
          {
            label: "退款金额",
            prop: "returnPrice",
          },
          {
            label: "售后类型",
            prop: "backType",
          },
          {
            label: "退款方式",
            prop: "returnWay",
          },
          {
            label: "	退款理由",
            prop: "returnReason",
          },
          {
            label: "退款状态",
            prop: "returnStatus",
            slot: true,
            dicData: [
              {
                label: "待支付",
                value: 1,
              },
              {
                label: "已支付，待使用",
                value: 2,
              },
              {
                label: "退款中",
                value: 3,
              },
              {
                label: "已退款",
                value: 4,
              },
              {
                label: "已取消",
                value: 5,
              },
              {
                label: "已关闭",
                value: 6,
              },
              {
                label: "已完成",
                value: 7,
              },
              {
                label: "已核销，待评价",
                value: 8,
              },
              {
                label: "已过期",
                value: 9,
              },
            ],
          },
          {
            label: "驳回原因",
            prop: "returnAuthReason",
          },
          {
            label: "退款时间",
            prop: "returnPriceDate",
          },
          {
            label: "操作时间",
            prop: "returnOperateDate",
          },
        ],
      },
      returnStatus: [
        "待支付",
        "已支付、待使用",
        "退款中",
        "已退款",
        "已取消",
        "已关闭",
        "已完成",
        "已核销，待评价",
        "已过期",
      ],
      isWindowHotel: [
        "否",
        "是",
      ],
    };
  },
  created() {
    this.orderInfoId = this.$route.query.id;
    this.marketList();
  },
  methods: {
    marketList() {
      var data = {
        id :this.orderInfoId
      };
      request({
        url: url.v1.hotel.selectHotleOrderInfo,
        method: "post",
        data: { ...data},
      }).then((res) => {
        console.log(res);
        let orderData = res.data;
        this.orderNo = orderData.ttcHotelOrderInfo.orderNo;
        this.userPhone = orderData.ttcHotelOrderInfo.userPhone;
        this.userName = orderData.ttcHotelOrderInfo.userName;
        this.orderStatusHed = orderData.ttcHotelOrderInfo.orderStatus,
        this.touristInfo = [{
          id: orderData.ttcHotelRoomChildInfo.id,
          roomName: orderData.ttcHotelRoomChildInfo.roomName,
          count: orderData.ttcHotelRoomChildInfo.count,
          isWindowHotel: orderData.ttcHotelOrderInfo.isWindowHotel,
        }],
        this.OrderInfo = [{
          hotelId: orderData.ttcHotelOrderInfo.hotelId,
          hotelName: orderData.ttcHotelOrderInfo.hotelName,
          roomCount: orderData.ttcHotelOrderInfo.roomCount,
        }]
        if(orderData.ttcAppraiseInfo != null){
          // res.data.ttcAppraiseInfo.forEach((element) => {
            if (orderData.ttcAppraiseInfo.addrImg != "" && orderData.orderData.addrImg!=null) {
              orderData.orderData.addrImg = orderData.orderData.addrImg.split("!#!");
            }
          // });
          this.paymentData = [{
            // content:orderData.ttcAppraiseInfo.content,
            giveCount:orderData.ttcAppraiseInfo.giveCount,
            score:orderData.ttcAppraiseInfo.score,
            addrImg:orderData.ttcAppraiseInfo.addrImg,
            resourceId:orderData.ttcAppraiseInfo.resourceId,
            resourceType:orderData.ttcAppraiseInfo.resourceType,
            status:orderData.ttcAppraiseInfo.status,
            orderNo:orderData.ttcAppraiseInfo.orderNo,
          }]
        }
        this.refundData = [{
          refundNo: orderData.ttcHotelRefundInfo.refundNo,
          returnPrice: orderData.ttcHotelRefundInfo.returnPrice,
          backType: orderData.ttcHotelRefundInfo.backType,
          returnWay: orderData.ttcHotelRefundInfo.returnWay,
          returnReason: orderData.ttcHotelRefundInfo.returnReason,
          returnStatus: orderData.ttcHotelRefundInfo.returnStatus,
          returnAuthReason: orderData.ttcHotelRefundInfo.returnAuthReason,
          returnPriceDate: orderData.ttcHotelRefundInfo.returnPriceDate,
          returnOperateDate: orderData.ttcHotelRefundInfo.returnOperateDate,
        }]
      });
    },
  },
};
</script>
<style scoped>
.box-card {
  margin: 20px;
  padding: 20px;
}
.el-col {
  padding: 20px;
  border: 1px solid rgba(228, 228, 228, 1);
  margin: 0;
}
.el-col .order_row {
  border-bottom: none;
  border-top: none;
}
.order_col1 {
  font-size: 16px;
  color: brown;
  padding: 30px 0;
  background: rgba(243, 243, 243, 1);
}
.order_col2 {
  font-size: 18px;
  border-top: none;
  border-bottom: none;
}
.order_col3,
.order_col4,
.order_col5,
.senci_info .el-col {
  border-bottom: none;
  font-weight: 600;
}
.senci_row {
  margin-top: 20px;
}
.senci_row p{
  font-size: 18px;
}
</style>
