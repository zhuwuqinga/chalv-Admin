
<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 基本信息 -->
      <el-row :gutter="20">
        <el-col :span="24" class="order_col1">
          <div>当前订单状态：
            <span v-if="this.returnStatusHed == 0">待审核</span>
            <span v-if="this.returnStatusHed == 1">同意</span>
            <span v-if="this.returnStatusHed == 2">驳回</span>
            <span v-if="this.returnStatusHed == 3">已退款</span>
          </div>
        </el-col>
        <el-col :span="24" class="order_col2">
          <div>基本信息</div>
        </el-col>
        <!-- 1-->
        <el-col :span="4" class="order_col3">
          <div>订单编号</div>
        </el-col>
        <!-- 2 -->
        <el-col :span="4" class="order_col4">
          <div>售后类型</div>
        </el-col>
        <!-- 3 -->
        <el-col :span="4" class="order_col5">
          <div>景点名称</div>
        </el-col>
        <!-- 4 -->
        <el-col :span="4" class="order_col3">
          <div>退款单号</div>
        </el-col>
        <!-- 5 -->
        <el-col :span="4" class="order_col4">
          <div>退款方式</div>
        </el-col>
        <!-- 6 -->
        <el-col :span="4" class="order_col5">
          <div>创建人</div>
        </el-col>
        <!-- 1 -->
        <el-col :span="4">
          <div>{{this.orderNo}}</div>
        </el-col>
        <!-- 2 -->
        <el-col :span="4">
          <div>{{this.backType}}</div>
        </el-col>
        <!-- 3 -->
        <el-col :span="4">
          <div>{{this.spotsName}}</div>
        </el-col>
        <!-- 4 -->
        <el-col :span="4">
          <div>{{this.returnNo}}</div>
        </el-col>
        <!-- 5 -->
        <el-col :span="4">
          <div>{{this.returnWay}}</div>
        </el-col>
        <!-- 6 -->
        <el-col :span="4">
          <div>{{this.createdBy}}</div>
        </el-col>
      </el-row>
      <!-- 退款信息 -->
      <div class="senci_row">
        <p>退款信息</p> 
        <avue-crud :data="refundData" :option="refundOption" v-model="user">
          <template slot="returnStatus" slot-scope="scope">
            <el-tag>{{returnStatus[scope.row.returnStatus+1]}}</el-tag>
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
  name: "returnInfo",
  data() {
    return {
      returnStatusHed:'',
      user: {},
      id: undefined,
      orderNo:'',
      backType:'',
      returnNo:'',
      spotsName:'',
      returnWay:'',
      backType:'',
      createdBy:'',
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
            label: "退款说明",
            prop: "returnExplain",
          },
          {
            label: "驳回原因",
            prop: "returnAuthReason",
          },
          {
            label: "退款凭证",
            prop: "returnProof",
          },
          {
            label: "产品封面图",
            prop: "productFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "退款时间",
            prop: "returnPriceDate",
          },
          {
            label: "操作时间",
            prop: "returnOperateDate",
          },
          // {
          //   label: "退款状态",
          //   prop: "returnProof",
          //   slot: true,
          //   dicData: [
          //     {
          //       label: "待审核",
          //       value: 0,
          //     },
          //     {
          //       label: "同意",
          //       value: 1,
          //     },
          //     {
          //       label: "驳回",
          //       value: 2,
          //     },
          //     {
          //       label: "已退款",
          //       value: 3,
          //     },
          //   ],
          // },
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
        url: url.v1.scenic.returnDetail,
        method: "post",
        data: { ...data},
      }).then((res) => {
        console.log(res.data);
        let returnData = res.data;
        this.returnStatusHed = returnData.returnStatus;
        this.orderNo = returnData.orderNo;
        this.backType = returnData.backType;
        this.returnNo = returnData.returnNo;
        this.spotsName = returnData.spotsName;
        this.returnWay = returnData.returnWay;
        this.createdBy = returnData.createdBy;
        this.refundData = [{
          returnPriceDate:returnData.returnPriceDate,
          returnExplain:returnData.returnExplain,
          updatedBy:returnData.updatedBy,
          returnAuthReason:returnData.returnAuthReason,
          returnProof:returnData.returnProof,
          productFaceImage:returnData.productFaceImage.split("!#!"),
          
          returnPriceDate:returnData.returnPriceDate,
          returnOperateDate:returnData.returnOperateDate
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
