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
          :upload-before="uploadBefore"
          :upload-after="uploadAfter"
          :upload-error="uploadError"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="small"
              @click.stop="handleDel()"
            >批量删除</el-button>
          </template>
          <template slot="status" slot-scope="scope">
            <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
          </template>
        </avue-crud>
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
      // 类型（1.商城订单取消原因 2.景点门票 3.旅游产品 4.酒店住宿 5、商城订单退款原因）
      typeLabel: ["商城订单取消", "景点", "旅游产品", "酒店", "商城订单退款"],
      permissions: {},
      searchForm: {},
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
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "类型",
            prop: "type",
            type: "select",
            search: true,
            dicData: [
              {
                label: "商城订单取消",
                value: "1",
              },
              {
                label: "景点",
                value: "2",
              },
              {
                label: "旅游产品",
                value: "3",
              },
              {
                label: "酒店",
                value: "4",
              },
              {
                label: "商城订单退款",
                value: "5",
              },
            ],
            display: false,
          },
          {
            label: "原因",
            prop: "value",
            display: false,
          },
          {
            label: "备注",
            prop: "typeVal",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "类型",
                prop: "type",
                type: "select",
                dicData: [
                  {
                    label: "商城订单取消",
                    value: "1",
                  },
                  {
                    label: "景点",
                    value: "2",
                  },
                  {
                    label: "旅游产品",
                    value: "3",
                  },
                  {
                    label: "酒店",
                    value: "4",
                  },
                  {
                    label: "商城订单退款",
                    value: "5",
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择类型",
                    trigger: "select",
                  },
                ],
                row: true,
              },
              {
                label: "原因",
                prop: "value",
                rules: [
                  {
                    required: true,
                    message: "请输入原因",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "排序",
                prop: "sort",
                type: "number",
                span: 6,
                minRows: 0,
                value: 99,
                cell: true,
                maxRows: 99,
                rules: [
                  {
                    required: true,
                    message: "请输入排序",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "备注",
                prop: "typeVal",
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.reasonList();
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
      this.reasonList();
    },
    reasonList(searchData) {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.reasonList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.reasonList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.reasonList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.reasonList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.reasonAdd,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.reasonList();
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
            url: url.v1.reasonDelete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.reasonList();
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
        url: url.v1.reasonUpdate,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.reasonList();
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
              url: url.v1.reasonDelete,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.reasonList();
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
      this.reasonList();
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
