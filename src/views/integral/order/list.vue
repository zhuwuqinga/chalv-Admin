<template>
  <div>
    <basic-container>
      <el-row :gutter="20">
        <span>
          <avue-crud
            ref="crud"
            v-model="crud"
            :data="data"
            :option="option"
            :page.sync="page"
            @search-change="searchChange"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChange"
            @size-change="sizeChange"
          >
            <!--按钮自定义--->
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click.stop="downloadExcel">导出</el-button>
            </template>
            <template slot="orderState" slot-scope="scope">
              <el-tag>{{orderState[scope.row.orderState+1]}}</el-tag>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                v-if="scope.row.orderState == 2"
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                @click.stop="showFast(scope.row)"
              >添加快递单号</el-button>
              <el-button
                v-if="scope.row.orderState == 3 || scope.row.orderState == 4"
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                @click.stop="handleQueryKaidi(scope.row)"
              >查看物流</el-button>
            </template>
          </avue-crud>
          <el-dialog :visible.sync="dialogFormVisibleWuliu" width="40%" append-to-body>
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>物流信息</span>
              </div>
              <div class="filter-container"></div>
              <el-timeline :reverse="reverse" style="height:500px">
                <el-scrollbar style="height:100%">
                  <el-timeline-item
                    v-for="(activity, index) in kuaidi"
                    :key="index"
                    :timestamp="activity.timestamp"
                  >{{activity.context}}</el-timeline-item>
                </el-scrollbar>
              </el-timeline>
            </el-card>
          </el-dialog>
          <el-dialog :visible.sync="dialogFastDto" width="40%" append-to-body>
            <el-form ref="form" :model="fast">
              <el-form-item label="快递公司">
                <el-select v-model="fast.logisticsCode" filterable  :placeholder="`快递公司`">
                  <el-option
                    v-for="item in fastOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="快递单号" label-width="80px">
                <el-input v-model="fast.fastNo" :placeholder="`快递单号`"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addLogisticsNo">添加</el-button>
                <el-button @click="dialogFastDto=false">取消</el-button>
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
  name: "integralOrderList",
  data() {
    return {
      reverse: false,
      dialogFormVisible: false,
      dialogFormVisibleWuliu: false,
      dialogFastDto: false,
      roleId: 0,
      deleteId: "",
      orderInfo: {
        title: "测试",
      },
      fastOption: {},
      fast: {
        orderNo: undefined,
        fastNo: undefined,
        logisticsCode: undefined,
        logisticsName: undefined,
      },
      searchForm: {},
      orderState: [
        "订单关闭",
        "订单完成",
        "待付款",
        "待发货",
        "待收货",
        "待评价",
        "待退款",
        "已删除",
        "退款完成",
      ],
      data: [],
      kuaidi: [],
      crud: {},
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      activities: [
        {
          content: "上海分拨中心发车",
          timestamp: "2018-04-15",
        },
        {
          content: "上海分拨中心装车",
          timestamp: "2018-04-13",
        },
        {
          content: "通知揽收",
          timestamp: "2018-04-11",
        },
      ],
      option: {
        editBtn: false,
        addBtn: false,
        delBtn: false,
        selection: true,
        stripe: true,
        title: "商城订单列表",
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "订单编号",
            prop: "orderCode",

            display: false,
            search: true,
          },
          {
            label: "创建时间",
            prop: "orderCreateDate",
            type: "datetimerange",
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            searchRange: true,
            display: false,
            search: true,
          },
          {
            label: "订单状态",
            prop: "orderState",
            type: "select",
            display: false,
            slot: true,
            dicData: [
              {
                label: "待付款",
                value: 1,
              },
              {
                label: "待发货",
                value: 2,
              },
              {
                label: "待收货",
                value: 3,
              },
              {
                label: "待退款",
                value: 5,
              },
              {
                label: "待评价",
                value: 4,
              },
              {
                label: "已删除",
                value: 6,
              },
              {
                label: "退款完成",
                value: 7,
              },
              {
                label: "订单完成",
                value: 0,
              },
              {
                label: "订单关闭",
                value: -1,
              },
            ],
            search: true,
          },
          {
            label: "手机号码",
            prop: "receiptPhone",
            display: false,
            search: true,
          },
          {
            label: "订单价格",
            prop: "orderTotal",
            display: false,
          },
        ],
      },
    };
  },
  created() {
    this.integralOrderList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
 
    downloadExcel() {
      if (this.searchForm.startTime != null) {
        this.$confirm(`确定导出查询的数据吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let searchData = this.searchForm;
          request({
            url: url.v1.integralOrder.exportExcel,
            method: "post",
            data: searchData,
            responseType: "blob", // 表明返回服务器返回的数据类型
          }).then((res) => {
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
          });
        });
      } else {
        this.$message({
          type: "info",
          message: "请输入查询时间",
        });
      }
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.integralOrderList();
    },
    integralOrderList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      let searchData = this.searchForm;
      if (searchData != null && searchData.orderCreateDate != undefined) {
        searchData.startTime = searchData.orderCreateDate[0];
        searchData.endTime = searchData.orderCreateDate[1];
        delete searchData.orderCreateDate;
      }
      request({
        url: url.v1.integralOrder.list,
        method: "post",
        data: { ...data, ...searchData },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.integralOrderList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.integralOrderList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.integralOrderList();
    },
    showCommet(row) {
      //  this.dialogFormVisibleComment = true;
    },
    showFast(row) {
      this.dialogFastDto = true;
      this.fast.orderNo = row.orderCode;
      this.selectFastTree();
    },
    selectFastTree() {
      request({
        url: url.v1.market.expressListTree,
      }).then((res) => {
        this.fastOption = res.data;
      });
    },
    handleQueryKaidi(row) {
      let that = this;
      var data = {
        com: row.logisticsCode,
        num: row.logisticsNo,
        phone: row.receiptPhone,
      };
      request({
        url: url.v1.market.queryKaidi,
        method: "post",
        data: { ...data },
      }).then((res) => {
        if (res.data.data.data != null) {
          that.kuaidi = res.data.data.data;
          that.dialogFormVisibleWuliu = true;
        } else {
          that.$message.warning(res.data.data.message);
        }
      });
    },
    showDialog(row) {
      this.$router.push({
        path: "/orderInfo/index",
        query: { orderId: row.orderCode },
      });
    },
    addLogisticsNo() {
      request({
        url: url.v1.integralOrder.addLogisticsNo,
        method: "POST",
        data: this.fast,
      }).then((res) => {
        if (res.status === 200) {
          this.integralOrderList();
          this.dialogFastDto = false;
          this.fast = {};
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style>
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
