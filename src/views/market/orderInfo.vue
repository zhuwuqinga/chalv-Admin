<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          订单编号:
          <span style="margin-left: 20px;">{{this.orderNo}}</span>
        </span>
        <span style="margin-left: 20px;">
          申请时间:
          <span style="margin-left: 5px;">{{this.payCreatAt}}</span>
        </span>
        <!--<el-button style="float: right; padding: 3px 0" type="text" >提交修改</el-button>-->
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="text item">
                <div class="box1">
                  <h2 style="margin-left: 20px;">{{this.titleData[this.orderInfoStatus]}}</h2>
                  <p style="margin-left: 20px;">
                    <span>{{this.detailData[this.orderInfoStatus]}}</span>
                  </p>
                  <p style="margin-left: 20px;">
                    <span>
                      订单总额:
                      <span style="color:#FFA500;margin-left: 10px;">{{this.orderPrice}}</span> 元
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </el-col>
          <!--步骤条-->
          <el-col :span="15" v-if="this.orderInfoStatus < 4 && this.orderInfoStatus > 0">
            <el-steps :active="active" align-center>
              <el-step title="买家下单" :description="active >=1 ? payCreatAt:''"></el-step>
              <el-step title="买家付款" :description="active >=2 ? orderPayDate:''"></el-step>
              <el-step title="商家发货" :description="active >=3 ? orderPostDate:''"></el-step>
              <el-step title="交易完成" :description="active >=4 ? oderFinishDate:''"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="15" v-if="this.orderInfoStatus == 5 || this.orderInfoStatus == 7">
            <el-steps :active="active" align-center>
              <el-step title="买家下单" :description="active >=1 ? payCreatAt:''"></el-step>
              <el-step title="买家付款" :description="active >=2 ? orderPayDate:''"></el-step>
              <el-step title="申请退款" :description="active >=3 ? returnDate:''"></el-step>
              <el-step title="订单关闭" :description="active >=4 ? oderFinishDate:''"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="15" v-if="this.orderInfoStatus > 5 && this.orderInfoStatus !=7">
            <el-steps :active="active" align-center>
              <el-step title="买家下单" :description="active >=1 ? payCreatAt:''"></el-step>
              <el-step title="买家取消" :description="active >=2 ? orderCanelDate:''"></el-step>
              <el-step title="订单关闭" :description="active >=3 ? oderFinishDate:''"></el-step>
            </el-steps>
          </el-col>
          <el-col :span="15" v-if="this.orderInfoStatus == -1 ">
            <el-steps :active="active" align-center>
              <el-step title="买家下单" :description="active>=1 ? payCreatAt:''"></el-step>
              <el-step title="订单关闭" :description="active>=2 ? orderCanelDate:''"></el-step>
            </el-steps>
          </el-col>
        </el-row>
        <div>
          <el-divider></el-divider>
        </div>
        <el-row :gutter="20">
          <avue-crud ref="crud" :data="goodsData" :option="option" :page.sync="page"></avue-crud>
        </el-row>
        <el-row :gutter="20">
          <el-card class="box-card">
            <div class="text item">
              <div class="box1">
                <h2>收货人信息</h2>
                <p>
                  收货人:
                  <span style="margin-left: 10px;">{{this.consignees[0].userName}}</span>
                </p>
                <p>
                  联系电话:
                  <span style="margin-left: 10px;">{{this.consignees[0].phone}}</span>
                </p>
                <p>
                  收货地址:
                  <span style="margin-left: 10px;">{{this.consignees[0].address}}</span>
                </p>
              </div>
              <div class="box2" v-if="flag">
                <h2>配送信息(发货)</h2>
                <p>
                  快递方式:
                  <span style="margin-left: 10px;">{{this.consignees[1].userName}}</span>
                  <span style="margin-left: 10px;">
                    <el-popover placement="right" width="400" trigger="hover">
                      <el-timeline :reverse="reverse" style="height:500px">
                        <el-scrollbar style="height:100%">
                          <el-timeline-item
                            v-for="(activity, index) in activities"
                            :key="index"
                            :timestamp="activity.ftime"
                          >{{activity.context}}</el-timeline-item>
                        </el-scrollbar>
                      </el-timeline>
                      <el-button style="height:21px;padding:'0" type="text" slot="reference">物流信息</el-button>
                    </el-popover>
                  </span>
                </p>
                <p>
                  快递单号:
                  <span style="margin-left: 10px;">{{this.consignees[1].phone}}</span>
                </p>
                <p>
                  发货时间:
                  <span style="margin-left: 10px;">{{this.consignees[1].address}}</span>
                </p>
              </div>
            </div>
          </el-card>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "orderInfo",
  data() {
    return {
      reverse: false,
      active: 1,
      flag: false,
      goodsData: undefined,
      orderInfoStatus: undefined,
      payCreatAt: undefined,
      orderPayDate: undefined,
      orderPostDate: undefined,
      oderFinishDate: undefined,
      returnDate: undefined,
      orderInfoId: undefined,
      orderInfoData: undefined,
      orderNo: undefined,
      orderCanelDate:undefined,
      orderPrice: undefined,
      consignees: [
        { userName: undefined, phone: undefined, address: undefined },
        { userName: undefined, phone: undefined, address: undefined },
      ],
      data: [],
      activities: [],
      titleData: ["买家下单", "买家付款", "商家发货", "交易完成", "订单关闭"],
      detailData: [
        "买家已下单,请催促买家付款.",
        "买家已付款,请及时进行发货.",
        "商家已发货,请确认快递信息.",
        "交易已完成,请耐心等待.",
        "订单已关闭,请bababababa!",
      ],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        selection: false,
        menu: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "商品名称",
            prop: "goodsName",
            width: "100",
            display: false,
            searchSpan: 4,
          },
          {
            label: "商品图片",
            prop: "goodsFaceImage",

            type: "img",
            display: false,
          },
          {
            label: "数量",
            prop: "goodsCount",
            display: false,
            searchSpan: 4,
          },
          {
            label: "单价",
            prop: "goodsPrice",
            display: false,
            searchSpan: 4,
          },
          {
            label: "规格",
            prop: "goodsSpe",
            width: "150",
            sortable: true,
            display: false,
          },
          {
            label: "小计",
            prop: "orderPrice",
            width: "150",
            sortable: true,
            display: false,
          },
          {
            label:"供应商",
            prop:"supplierName",
            display: false,
          }
        ],
      },
    };
  },
  created() {
    this.orderInfoId = this.$route.query.orderId;
    this.orderInfo();
  },
  methods: {
    orderInfo() {
      let that = this;
      request({
        url: url.v1.market.getOrderInfo,
        data: { orderNo: this.orderInfoId },
        methods: "get",
      }).then((res) => {
        that.orderInfoData = res.data.orderInfo;
        that.active = res.data.orderInfo.active;
        res.data.orderInfo.goods.forEach((element) => {
          if (
            element.goodsFaceImage != "" &&
            element.goodsFaceImage != null &&
            element.goodsFaceImage != undefined
          ) {
            element.goodsFaceImage = element.goodsFaceImage.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
          }
        });
        that.goodsData = res.data.orderInfo.goods;
        that.payCreatAt = res.data.orderInfo.createAt;
        that.orderPayDate = res.data.orderInfo.orderPayDate;
        that.orderPostDate = res.data.orderInfo.orderPostDate;
        that.oderFinishDate = res.data.orderInfo.oderFinishDate;
        that.returnDate =  res.data.orderInfo.returnDate;
        that.flag = res.data.orderInfo.consignees.length >= 2 ? true : false;
        that.orderInfoStatus = res.data.orderInfo.status;
        that.orderCanelDate = res.data.orderInfo.orderCanelDate;
        that.orderNo = res.data.orderInfo.orderNo;
        that.orderPrice = res.data.orderInfo.orderPrice;
        that.consignees = res.data.orderInfo.consignees;
        if(res.data.orderInfo.fastVo.data!=null){
          that.activities =res.data.orderInfo.fastVo.data;
        }
         ;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.orderInfo();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.orderInfo();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.orderInfo();
    },
  },
};
</script>
<style>
.text {
  display: flex;
}
.box1 {
  margin-right: 200px;
}
.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  margin-bottom: 50px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>