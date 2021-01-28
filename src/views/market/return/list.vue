<template>
  <div>
    <basic-container>
      <el-row :gutter="20">
        <span>
          <avue-crud
            ref="crud"
            :data="data"
            :option="option"
            :page.sync="page"
            @search-change="searchChange"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChange"
            @size-change="sizeChange"
          >
            <template slot="returnStatus" slot-scope="scope">
              <el-tag>{{returnState[scope.row.returnStatus]}}</el-tag>
            </template>
         <!--按钮自定义--->
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click.stop="downloadExcel">导出</el-button>
            </template>

            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                @click.stop="showDialog(scope.row)"
              >查看详情</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                v-if="scope.row.backType == '退货退款' && scope.row.returnStatus == 3"
                @click.stop="confirmOrder(scope.row)"
              >确认收货</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                v-if="scope.row.returnStatus == 0"
                @click.stop="authOrder(scope.row)"
              >审核通过</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                v-if="scope.row.returnStatus == 0"
                @click.stop="showReturnDialog(scope.row)"
              >审核拒绝</el-button>
            </template>
          </avue-crud>
          <el-dialog
            title="退款单详情"
            :visible.sync="dialogFormVisibleWuliu"
            width="80%"
            append-to-body
          >
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>
                  订单编号:
                  <span style="margin-left: 20px;">{{this.returnInfo.orderNo}}</span>
                </span>
                <span style="margin-left: 20px;">
                  申请时间:
                  <span style="margin-left: 5px;">{{this.returnInfo.createAt}}</span>
                </span>
              </div>
              <div>
                <el-row :gutter="20">
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <div class="text item">
                        <div class="box1">
                          <h2 style="margin-left: 20px;">{{this.titleData[this.returnInfo.status]}}</h2>
                          <p style="margin-left: 20px;">
                            <span>{{this.detailData[this.status]}}</span>
                          </p>
                          <p style="margin-left: 20px;">
                            <span>
                              订单总额:
                              <span
                                style="color:#FFA500;margin-left: 10px;"
                              >{{this.returnInfo.orderPrice}}</span> 元
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>

                  <el-col :span="15" v-if="backType == '仅退款'">
                    <el-steps :active="active" align-center>
                      <el-step title="申请退款" :description="active >=1 ? createAt:''"></el-step>
                      <el-step v-if="active == 1" title="平台处理" :description="active >=1 ? createAt:''"></el-step>
                      <el-step v-if="active >= 2 " :title="status == 1 || status == 4?'同意退款':'拒绝退款'" :description="active >=2 ? returnPriceDate:''"></el-step>
                      <el-step v-if="active >= 3 " :title="status == 1 || status == 4?'退款成功':'订单关闭'" :description="active >=3 ? returnOperateDate:''"></el-step>
                    </el-steps>
                  </el-col>
                  <el-col :span="15" v-else>
                    <el-steps :active="active" align-center v-if="status == 0">
                    <!--退款状态(0:待审核;1:同意;2:驳回,3平台待收货,4:已退款5.平台确认收到货-->
                      <el-step title="申请退货退款"></el-step>
                      <el-step title="平台处理" :description="active >=1 ? createAt:''"></el-step>
                    </el-steps>
                    <el-steps :active="active" align-center v-if="status == 1">
                      <el-step title="申请退货退款"></el-step>
                      <el-step title="同意退款" :description="active >=1 ? createAt:''"></el-step>
                      <el-step title="平台待收货" :description="active >=1 ? createAt:''"></el-step>
                      <el-step title="确认收货" :description="active >=1 ? createAt:''"></el-step>
                      <el-step title="已退款" :description="active >=1 ? createAt:''"></el-step>
                    </el-steps>
                     <el-steps :active="active" align-center v-if="status == 2">
                      <el-step title="申请退货退款"></el-step>
                      <el-step title="拒绝退款" :description="active >=1 ? createAt:''"></el-step>
                      <el-step title="订单关闭" :description="active >=1 ? createAt:''"></el-step>
                    </el-steps>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                  <div class="text item">
                    <div class="box1">
                      <p style="margin-left: 20px;">
                        退款原因:
                        <span style="margin-left: 20px;">{{this.returnInfo.returnReason}}</span>
                      </p>
                      <p style="margin-left: 20px;">
                        退款说明:
                        <span style="margin-left: 20px;">{{this.returnInfo.returnExplain}}</span>
                      </p>
                    </div>
                    <div class="box1">
                      <img
                        width="200px"
                        style="margin-right:20px"
                        v-for="(d, index) of datas"
                        :src="d.url"
                        @click="openPreview(index)"
                      />
                    </div>
                  </div>
                </el-row>
                <div>
                  <el-divider></el-divider>
                </div>
                <el-row>
                  <avue-crud ref="crud" :data="goodsData" :option="dialogoption" :page="dialogpage"></avue-crud>
                </el-row>
              </div>
            </el-card>
          </el-dialog>

          <el-dialog title="拒绝退款" :visible.sync="dialogReturnResouz" append-to-body>
            <el-form ref="form1" :model="form1" label-width="80px">
              <el-form-item>
                <el-form-item label="驳回原因">
                  <el-input type="textarea" v-model="form1.returnAuthReason"></el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click.stop="confirmToBlack">确定</el-button>
                <el-button @click.stop="dialogReturnResouz = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </span>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "marketReturnList",
  data() {
    return {
      dialogFormVisibleWuliu: false,
      dialogReturnResouz: false,
      roleId: 0,
      goodsData: undefined,
      returnState: ["待审核", "同意退款", "拒绝退款", "平台待收货", "已退款"],
      deleteId: "",
      createAt:'',
      returnPriceDate:'',
      returnOperateDate:'',
      menuList: [],
      status: undefined,
      backType: undefined,
      form1: { returnNo: undefined, returnAuthReason: undefined },
      returnInfo: {
        orderNo: undefined,
        createAt: undefined,
        status: undefined,
        orderPrice: undefined,
        returnReason: undefined,
        returnExplain: undefined,
      },
      active: undefined,
      searchForm: {},
      data: [],
      datas: [],
      titleData: ["申请退款", "同意退款", "拒绝退款", "待收货", "已退款"],
      detailData: [
        "客户商品需要寄回,请检查商品完好无损再进行退款确认.",
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
        editBtn: false,
        addBtn: false,
        title: "商城退款订单列表",
        delBtn: false,
    
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "退款单号",
            prop: "returnNo",
            display: false,
          },
          {
            label: "订单编号",
            prop: "orderNo",
            display: false,
            search: true,
          },
          {
            label: "退款金额",
            prop: "returnPrice",
            display: false,
          },
          {
            label: "退款状态",
            prop: "returnStatus",
            type: "select",
            slot: true,
            display: false,
            dicData: [
              {
                label: "待审核",
                value: 0,
              },
              {
                label: "退款中",
                value: 1,
              },
              {
                label: "平台待收货",
                value: 3,
              },
              {
                label: "已退款",
                value: 4,
              },
            ],
            search: true,
          },
          {
            label: "退款方式",
            prop: "returnWay",
            display: false,
          },
          {
            label: "售后类型",
            prop: "backType",
            display: false,
            dicData: [
              {
                label: "退款",
                value: 1,
              },
              {
                label: "退货退款",
                value: 2,
              },
            ],
          },

          {
            label: "退款理由",
            prop: "returnReason",
            display: false,
          },
          {
            label: "创建时间",
            prop: "createdTime",
            type: "datetime",
            display: false,
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        ],
      },
      dialogpage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      dialogoption: {
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
        ],
      },
    };
  },
  created() {
    this.marketList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
     downloadExcel() {
        this.$confirm(`确定导出查询的数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let searchData = this.searchForm;
          request({
            url: url.v1.market.returnOrderExcel,
            method: "post",
            data: searchData,
            responseType: "blob", // 表明返回服务器返回的数据类型
          })
            .then((res) => {
              let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
              let url = window.URL.createObjectURL(blob);
              let aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.setAttribute("download", "excel.xls");
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink);
              window.URL.revokeObjectURL(url);
            })
        });
    },
    confirmOrder(row) {
      this.form1.returnNo = row.returnNo;
      request({
        url: url.v1.market.confirmOrder,
        method: "POST",
        data: this.form1,
      }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
        this.marketList();
      });
    },
    confirmToBlack(row) {
      request({
        url: url.v1.market.authOrderReturnFail,
        method: "POST",
        data: this.form1,
      }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.message);
          this.dialogReturnResouz = false;
        } else {
          this.$message.error(res.message);
        }
        this.marketList();
      });
    },
    showReturnDialog(row) {
      this.form1.returnNo = row.returnNo;
      this.dialogReturnResouz = true;
    },
    openPreview(index = 0) {
      this.$ImagePreview(this.datas, index);
    },
    showDialog(row) {
      let that = this;
      request({
        url: url.v1.market.returnOrderInfo,
        method: "get",
        data: {
          returnNo: row.returnNo,
        },
      }).then((res) => {
        that.returnInfo = res.data.returnInfo;
        that.backType = res.data.returnInfo.backType;
        that.status = res.data.returnInfo.status;
        that.active = res.data.returnInfo.active;
        that.goodsData = res.data.returnInfo.goods;
        that.returnPriceDate = res.data.returnInfo.returnPriceDate;
        that.returnOperateDate = res.data.returnInfo.returnOperateDate;
        that.createAt = res.data.returnInfo.createAt;
        that.datas = res.data.returnInfo.imageUrls;
      });
      that.dialogFormVisibleWuliu = true;
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.marketList();
    },
    marketList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      let searchData = this.searchForm;
      if (searchData != null && searchData.addTime != undefined) {
        searchData.startTime = searchData.addTime[0];
        searchData.endTime = searchData.addTime[1];
        delete searchData.addTime;
      }
      request({
        url: url.v1.market.returnOrderList,
        method: "get",
        data: { ...data, ...searchData },
      }).then((res) => {
        this.page.total = res.data.count;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.marketList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.marketList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.marketList();
    },
    authOrder(row) {
      this.$confirm("此操作将审核退款订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.market.authOrder,
            method: "POST",
            data: {
              returnNo: row.returnNo,
            },
          }).then((res) => {
            if (res.status === 200) {
              this.$message.success(res.message);
              this.marketList();
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message.info("取消操作");
        });
    },
  },
  handleEditPassword(row) {
    this.$prompt("请输入新密码", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^(\w){2,20}$/,
      inputErrorMessage: "只能输入2-20个字母、数字、下划线",
    })
      .then(({ value }) => {
        request({
          url: url.v1.manager.updatePassword,
          method: "POST",
          data: {
            id: row.id,
            password: value,
          },
        }).then((res) => {
          if (res.status === 200) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
            return false;
          }
        });
      })
      .catch(() => {
        this.$message.info("取消输入");
      });
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
.avue-upload .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avue-upload .el-upload:hover {
  border-color: #409eff;
}
.avue-upload__icon,
.avue-upload__avatar {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px !important;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
