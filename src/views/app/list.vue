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
          <template slot="status" slot-scope="scope">
            <el-switch name="status" v-model="scope.row.status" @change="setStatus(scope.row)"></el-switch>
          </template>
          <template slot="isCompelUpdate" slot-scope="scope">
            <el-switch
              name="isCompelUpdate"
              v-model="scope.row.isCompelUpdate"
              disabled
            ></el-switch>
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
    const validatePhone = (rule, value, callback) => {
      let str = /^1[0-9]{10}$/;
      if (!str.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      deleteId: "",
      statusLabel: ["不可用", "可用"],
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
        title: "app列表",
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
                label: "安卓",
                value: "Android",
              },
              {
                label: "苹果",
                value: "iOS",
              },
            ],
            display: false,
          },
          {
            label: "版本",
            prop: "version",
            display: false,
          },
          {
            label: "备注",
            prop: "remark",
            display: false,
          },
          {
            label: "是否强制更新",
            prop: "isCompelUpdate",
            slot: true,
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            slot: true,
            display: false,
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "类型",
                type: "select",
                prop: "type",
                dicData: [
                  {
                    label: "安卓",
                    value: "Android",
                  },
                  {
                    label: "苹果",
                    value: "iOS",
                  },
                ],
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请选择类型",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "版本",
                prop: "version",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入版本",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "apk地址",
                prop: "downloadurl",
                prepend: "http://",
                row: true,
              },
              {
                label: "文件大小",
                prop: "fileSize",
                type: "number",
                precision: 2,
                minRows: 0,
                maxRows: 99999,
                row: true,
              },
              {
                label: "二维码图片",
                prop: "ercodeurl",
                type: "upload",
                listType: "picture-img",
                row:true,
                propsHttp: {
                  res: "data",
                },
                tip: "只能上传jpg/png文件，且不超过500kb",
                action: "os/obs/upload",
              },
              {
                label: "强制更新",
                prop: "isCompelUpdate",
                type: "select",
                dicData: [
                  {
                    label: "是",
                    value: true,
                  },
                  {
                    label: "否",
                    value: false,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择是否强制更新",
                    trigger: "select",
                  },
                ],
                row: true,
              },
              {
                label: "状态",
                prop: "status",
                type: "select",
                dicData: [
                  {
                    label: "可用",
                    value: true,
                  },
                  {
                    label: "不可用",
                    value: false,
                  },
                ],
                rules: [
                  { required: true, message: "请选择状态", trigger: "select" },
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
    this.releaseList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    setStatus(row){
      let info = row.status == true ?"可用":"不可用";
      let data = {
        id: row.id,
        status: row.status === true ? 1 : 0,
      };
      this.$confirm("此操作设置当前数据"+info,"是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.releaseUpdate,
            method: "POST",
            data: data,
          }).then((res) => {
            this.$message.success(res.message);
            this.releaseList();
          });
        })
        .catch(() => {
         this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.releaseList();
    },
    releaseList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.releaseList,
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
      this.releaseList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.releaseList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.releaseList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.releaseAdd,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.releaseList();
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
            url: url.v1.releaseDelete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.releaseList();
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
        url: url.v1.releaseUpdate,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.releaseList();
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
              url: url.v1.releaseDelete,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.releaseList();
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
        this.$message.error("上传图片只能是 PNG、JPG 格式!");
        loading();
        return false;
      }
      if (!isLt2m) {
        this.$message.error("上传图片大小不能超过2M!");
        loading();
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
