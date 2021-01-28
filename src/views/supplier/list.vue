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
            label: "名称",
            prop: "name",
            search: true,
            display: false,
          },
          {
            label: "电话号码",
            prop: "phone",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "名称",
                prop: "name",
                rules: [
                  {
                    required: true,
                    message: "请输入名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "电话号码",
                prop: "phone",
                rules: [
                  {
                    required: true,
                    message: "请输入名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.supplierList();
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
      this.supplierList();
    },
    supplierList(searchData) {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.supplier.list,
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
      this.supplierList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.supplierList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.supplierList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.supplier.add,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.supplierList();
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
            url: url.v1.supplier.delete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.supplierList();
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
         url: url.v1.supplier.update,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.supplierList();
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
             url: url.v1.supplier.delete,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.supplierList();
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
      this.supplierList();
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
