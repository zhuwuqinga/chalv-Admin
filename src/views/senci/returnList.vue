
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
            <template slot="returnStatus" slot-scope="scope">
              <el-tag>{{returnStatus[scope.row.returnStatus]}}</el-tag>
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
                @click.stop="showReturnDialog(scope.row)"
              >退款</el-button> -->
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                v-if="scope.row.returnStatus == 0 || scope.row.returnStatus == 0 "
                @click.stop="authOrder(scope.row)"
              >审核通过</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                v-if="scope.row.returnStatus == 0|| scope.row.returnStatus == 0 "
                @click.stop="showReturnDialog(scope.row)"
              >审核拒绝</el-button>
            </template>
          </avue-crud>
        </span>
        <el-dialog title="拒绝退款" :visible.sync="dialogReturnResouz" append-to-body>
          <el-form ref="form1" :model="form1" label-width="80px">
            <!-- <el-form-item>
              <el-form-item label="退款状态">
                <el-select v-model="form1.returnStatus" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form-item> -->
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
      dialogReturnResouz: false,
      form1: { id: undefined, returnStatus: undefined,returnAuthReason: undefined},
      options:[{
        value: '0',
          label: '待审核'
        }, {
          value: '2',
          label: '驳回'
        }, {
          value: '3',
          label: '已退款'
      }],
      value: '',
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
      returnStatus: [
        "待审核",
        "同意",
        "驳回",
        "已退款",
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
        title: "景点订单退款列表",
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
            label: "景点名称",
            prop: "spotsName",
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
            prop: "returnStatus",
            type: "select",
            display: false,
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
              {
                label: "已退款",
                value: 4,
              }
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
            label: "门票类型",
            prop: "ticketType",
            sortable: true,
            display: true,
          },
          {
            label: "订单金额",
            prop: "price",
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
          url: url.v1.scenic.returnExportExcel,
          method: "post",
          data: searchData,
          responseType: "blob", // 表明返回服务器返回的数据类型
        }).then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "景点退款订单列表excel.xls");
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
      console.log(this.searchForm );
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
      request({//退款订单列表
        url: url.v1.scenic.returnList,
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
    showDialog(row) {
      this.$router.push({
        path: "/returnInfo",
        query: { id: row.id },
      });
    },
    showReturnDialog(row) {
      console.log(row);
      this.form1.id = row.id;
      this.form1.returnStatus = "2";
      this.dialogReturnResouz = true;
    },
    confirmToBlack(row) {
      request({
        url: url.v1.scenic.auditRefundOrder,
        method: "POST",
        data: this.form1,
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.$message.success(res.message);
          this.dialogReturnResouz = false;
          this.marketList();
        } else {
          this.$message.error(res.message);
        }
        this.marketList();
      });
    },
    authOrder(row) {
      this.$confirm("此操作将审核退款订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.scenic.auditRefundOrder,
            method: "POST",
            data: {
              id: row.id,
              returnStatus: "1",
              returnAuthReason: "同意",
            },
          }).then((res) => {
            if (res.status === 200) {
              this.marketList();
              this.$message.success(res.message);
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
