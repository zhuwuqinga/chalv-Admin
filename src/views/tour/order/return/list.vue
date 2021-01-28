<template>
  <div>
    <basic-container>
      <span>
        <avue-crud
          ref="crud"
          :data="data"
          :option="option"
          :page.sync="page"
          @row-save="rowSave"
          @row-update="rowUpdate"
          @row-del="rowDel"
          @search-change="searchChange"
          @current-change="currentChange"
          @refresh-change="refreshChange"
          @selection-change="selectionChange"
          @size-change="sizeChange"
        >
          <template slot="returnStatus" slot-scope="scope">
            <el-tag>{{statusLabel[scope.row.returnStatus]}}</el-tag>
          </template>

          <template slot-scope="scope" slot="menu">
            <el-button type="text" size="small" @click.stop="showDialog(scope.row)">查看原因</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.returnStatus!=0"
              @click.stop="authReturnOrder(scope.row,1)"
            >审核通过</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.returnStatus!=0"
              @click.stop="authReturnOrder(scope.row,2)"
            >驳回审核</el-button>
          </template>
        </avue-crud>

        <el-dialog
          title="查看原因"
          width="80%"
          :show-close="false"
          append-to-body
          :visible.sync="playVisible"
        >
        
        </el-dialog>
      </span>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "hostList",
  data() {
    return {
      deleteId: "",
      statusLabel: ["不可用", "可用"],
      permissions: {},
      searchForm: {},
      playVisible: false,
      statusLabel: ["待审核", "通过", "驳回", "已退款"],
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "退款单号",
            prop: "returnNo",
            search: true,
            display: false,
          },
          {
            label: "产品封面图",
            prop: "productFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "产品名称",
            prop: "productName",
            display: false,
          },
          {
            label: "状态",
            prop: "returnStatus",
            slot: true,
            display: false,
          },
          {
            label: "购买数量",
            prop: "count",
            display: false,
          },
          {
            label: "退款方式",
            prop: "returnWay",
            display: false,
          },
          {
            label: "退款金额",
            prop: "returnPrice",
            display: false,
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
        ],
        group: [
          {
            column: [],
          },
        ],
      },
    };
  },
  created() {
    this.returnList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.returnList();
    },
    returnList() {
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
        url: url.v1.products.returnList,
        method: "post",
        data: { ...data, ...searchData },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    showDialog(row) {
      this.playVisible = true;
    },
    authReturnOrder(row, status) {
      var data = {
        returnNo: row.returnNo,
        returnStatus: status,
      };
      request({
        url: url.v1.products.authReturnOrder,
        method: "post",
        data: data,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.returnList();
          done();
        }
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.returnList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.returnList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.returnList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.products.addStartPlace,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.returnList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.products.deleteStartPlace,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.returnList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    rowUpdate(form, index, done, loading) {
      request({
        url: url.v1.products.updateStartPlace,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.returnList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            request({
              url: url.v1.products.deleteStartPlace,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.returnList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的分类",
        });
      }
    },
    uploadBefore(file, done, loading, column) {
      // 上传文件之前校验图片格式和大小
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2m = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        done(file);
        this.$message.error("上传图片只能是 PNG、JPG 格式!");
        return false;
      }
      if (!isLt2m) {
        done(file);
        this.$message.error("上传图片大小不能超过2M!");
        return false;
      }
      done(file);
      return true;
    },
    uploadError(error, column) {
      done();
      this.$message.success("上传失败");
    },
    uploadAfter(res, done, loading, column) {
      done();
    },

    nodeClick(data) {
      this.goodsTypeName = data.label;
      this.page.currentPage = 1;
      this.returnList();
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
