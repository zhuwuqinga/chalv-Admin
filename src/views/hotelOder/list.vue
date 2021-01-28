
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
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click.stop="downloadExcel">导出</el-button>
            </template>
            <template slot="orderStatus" slot-scope="scope">
              <el-tag>{{orderStatus[scope.row.orderStatus-1]}}</el-tag>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                @click.stop="showDialog(scope.row)"
              >查看详情</el-button>
                <!-- <el-button
                              type="text"
                              size="small"
                              icon="el-icon-edit-outline"
                              @click.stop="showDialog(scope.row)"
                >核销</el-button>-->
              </template>
          </avue-crud>
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
  name: "marketList",
  data() {
    return {
      reverse: false,
      dialogFormVisible: false,
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
      orderStatus: [
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
      data: [],
      kuaidi: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        editBtn: false,
        addBtn: false,
        delBtn: false,
        excelBtn: false,
        selection: true,
        stripe: true,
        title: "酒店订单列表",
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "订单ID",
            prop: "id",
            sortable: true, //排序
            display: true,
          },
          {
            label: "订单编号",
            prop: "orderNo",
            display: false,
            search: true,
          },
          {
            label: "酒店名称",
            prop: "hotelName",
            display: false,
            search: true,
          },
          {
            label: "联系电话",
            prop: "userPhone",
            display: false,
            search: true,
          },
          {
            label: "创建时间",
            prop: "createdTime",
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
            prop: "orderStatus",
            type: "select",
            display: false,
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
            search: true,
          },
          {
            label: "下单人",
            prop: "userName",
            sortable: true,
            display: true,
          },
          {
            label: "房型名称",
            prop: "roomTypeName",
            sortable: true,
            display: true,
          },
          {
            label: "酒店略缩图",
            prop: "hotelUrl",
            type: "img",
            display: false,
          },
          {
            label: "总金额",
            prop: "totalPrice",
            sortable: true,
            display: true,
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
          url: url.v1.hotel.starExportExcel,
          method: "post",
          data: { ...searchData },
          responseType: "blob", // 表明返回服务器返回的数据类型
        }).then((res) => {
          console.log(res);
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "酒店订单列表excel.xls");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
      });
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
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      let searchData = this.searchForm;
      if (searchData != null && searchData.createdTime != undefined) {
        searchData.startTime = searchData.createdTime[0];
        searchData.endTime = searchData.createdTime[1];
        delete searchData.createdTime;
      }
      request({
        url: url.v1.hotel.selectHotleOrderList,
        method: "post",
        data: { ...data, ...searchData },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
        res.data.list.forEach((element) => {
          if (element.hotelUrl != "" && element.hotelUrl != null) {
            element.hotelUrl = element.hotelUrl.split("!#!");
          }
        });
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
    showFast(row) {
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
    showDialog(row) {
      this.$router.push({
        path: "/oderDetail",
        query: { id: row.id },
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
