
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
      <!-- 游客信息 -->
      <div class="senci_row">
        <p>游客信息</p> 
        <avue-crud :data="touristInfo" :option="touristOption"></avue-crud>
      </div>
      <!-- 支付信息 -->
      <div class="senci_row">
        <p>支付信息</p> 
        <avue-crud :data="paymentData" :option="paymentOption" v-model="user">
        </avue-crud>
      </div>
      <!-- 退款信息 -->
      <div class="senci_row">
        <p>退款信息</p> 
        <avue-crud :data="refundData" :option="refundOption" v-model="user">
          <template slot="returnStatus" slot-scope="scope">
            <el-tag>{{returnStatus[scope.row.returnStatus-1]}}</el-tag>
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
            label: "景点名称",
            prop: "spotsName",
            slot: false,
          },
          {
            label: "门票名称",
            prop: "ticketName",
          },
          {
            label: "使用日期",
            prop: "useDate",
          },
          {
            label: "数量",
            prop: "count",
          },
          {
            label: "单价",
            prop: "price",
          },
          {
            label: "总价",
            prop: "totalPrice",
          }
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
            label: "游客ID",
            prop: "userId",
            slot: false,
          },
          {
            label: "姓名",
            prop: "name",
          },
          {
            label: "用户名称",
            prop: "userName",
          },
          {
            label: "证件类型",
            prop: "credentialsType",
          },
          {
            label: "证件号",
            prop: "credentialsNo",
          },
          {
            label: "联系方式",
            prop: "phone",
          },
          {
            label: "创建时间",
            prop: "createdTime",
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
            label: "交易方式",
            prop: "payType",
            slot: false,
          },
          {
            label: "交易流水",
            prop: "thirdOrderNo",
          },
          {
            label: "交易时间",
            prop: "payTime",
          },
          {
            label: "支付金额",
            prop: "payPrice",
          },
          {
            label: "收款方",
            prop: "count",
          },
          {
            label: "收款账号",
            prop: "price",
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
            label: "退款时间",
            prop: "updatedTime",
            slot: false,
          },
          {
            label: "操作人",
            prop: "updatedBy",
          },
          {
            label: "退款状态",
            prop: "returnStatus",
            slot: true,
            dicData: [
              {
                label: "待审核",
                value: 0,
              },
              {
                label: "同意",
                value: 1,
              },
              {
                label: "驳回",
                value: 2,
              },
              {
                label: "已退款",
                value: 3,
              },
            ],
          },
        ],
      },
      returnStatus: [
        "待审核",
        "同意",
        "驳回",
        "已退款",
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
      request({//订单详情
        url: url.v1.scenic.senciDetail,
        method: "post",
        data: { ...data},
      }).then((res) => {
        console.log(res.data);
        let orderData = res.data;
        this.orderNo = orderData.orderNo;
        this.userPhone = orderData.userPhone;
        this.userName = orderData.userName;
        this.touristInfo = orderData.touristVOList,
        this.orderStatusHed = orderData.orderStatus
        this.OrderInfo = [{
          spotsName: orderData.spotsName,
          ticketName: orderData.ticketName,
          useDate: orderData.useDate,
          count: orderData.count,
          price: orderData.price,
          totalPrice: orderData.totalPrice,
          orderStatus: orderData.orderStatus,
        }],
        this.paymentData = [{
          payType:orderData.payType,
          thirdOrderNo:orderData.thirdOrderNo,
          payTime:orderData.payTime,
          payPrice:orderData.payPrice,
          count:orderData.count,
          price:orderData.price,
        }]
        this.refundData = [{
          updatedTime:orderData.updatedTime,
          updatedBy:orderData.updatedBy,
          returnStatus:orderData.returnStatus
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
