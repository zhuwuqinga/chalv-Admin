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
            <el-switch name="status" v-model="scope.row.status"  @change="setStatus(scope.row)"></el-switch>
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
      permissions: {},
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        tabs: true,
        tabsActive: 1,
        delBtn: false,
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "数据字典表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "类型",
            prop: "ename",
            search: true,
            display: false,
          },
          {
            label: "代码",
            prop: "code",
            search: true,
            display: false,
          },
          {
            label: "中文名称",
            prop: "name",
            search: true,
            display: false,
          },
           {
            label: "状态",
            prop: "status",
            slot: true,
            display: false,
          },
          {
            label: "描述",
            prop: "des",
            display: false,
          },
        ],
        group: [
          {
            icon: "el-icon-info",
            label: "基本信息",
            prop: "group1",
            column: [
              {
                label: "名称",
                prop: "presentName",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入礼物名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "礼物价格",
                prop: "presentPrice",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                maxRows: 99999,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入礼物价格",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "茶旅豆",
                prop: "presentTeaBean",
                type: "number",
                span: 6,
                minRows: 0,
                maxRows: 9999,
                row: true,
                value: 1,
                row: true,
                rules: [
                  { required: true, message: "请输入茶旅豆", trigger: "blur" },
                ],
              },
              {
                label: "礼物图片",
                prop: "presentImages",
                type: "upload",
                listType: "picture-img",
                row: true,
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传礼物图片",
                    trigger: "blur",
                  },
                ],
                propsHttp: {
                  res: "data",
                },
                // 压缩比例
                canvasOption: {
                  ratio: 0.1,
                },
                tip: "只能上传jpg/png文件，且不超过2M",
              },
              {
                label: "gif动态图",
                prop: "presentGif",
                type: "upload",
                listType: "picture-img",
                row: true,
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传礼物的gif动态图",
                    trigger: "blur",
                  },
                ],
                propsHttp: {
                  res: "data",
                },
                // 压缩比例
                canvasOption: {
                  ratio: 0.1,
                },
                tip: "只能上传jpg/png文件，且不超过2M",
              },
              {
                label: "动图名称",
                prop: "animationImgTag",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入动图名称",
                    trigger: "blur",
                  },
                ],
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
    this.dataList();
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
      this.dataList();
    },
    dataList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.ttcSysDict.dataList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.count;
        res.data.list.forEach((element) => {
          element.status = element.status == 1 ? true : false;
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.dataList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.dataList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.dataList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.ttcSysDict.saveOrUpdateAdm,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.dataList();
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
            url: url.v1.ttcSysDict.deletePresentInfo,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.dataList();
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
        url: url.v1.ttcSysDict.saveOrUpdateAdm,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.dataList();
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
              url: url.v1.products.deleteAgency,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.dataList();
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
            url: url.v1.ttcSysDict.setStatus,
            method: "POST",
            data: data,
          }).then((res) => {
            this.$message.success(res.message);
            this.dataList();
          });
        })
        .catch(() => {
         this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
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

    nodeClick(data) {
      this.goodsTypeName = data.label;
      this.page.currentPage = 1;
      this.dataList();
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
