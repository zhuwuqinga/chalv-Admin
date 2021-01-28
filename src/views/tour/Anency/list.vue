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
            <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click.stop="showFGDialog(scope.row)"
            >设置核销员</el-button>
          </template>
        </avue-crud>

        <el-dialog title="添加核销员" :visible.sync="blackFGDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="80%" append-to-body>
          <avue-crud
            ref="crud"
            :data="userInfodata"
            :option="userInfoption"
            :page="userInfopage"
            @current-change="userInfocurrentChange"
            @refresh-change="refreshChange"
            @selection-change="userInfoselectionChange"
            @size-change="userInfosizeChange"
            @search-change="userInfosearchChange"
          ></avue-crud>
          <el-button type="primary" @click="confirmFGToBlack">添加</el-button>
          <el-button @click="closeFgb">取消</el-button>
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
      userInfodata: [],
      roomManager: {
        ids: "",
      },
      row: {},
      userInfopage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      blackFGDialogVisible: false,
      statusLabel: ["不可用", "可用"],
      permissions: {},
      searchForm: {},
      data: [],
      userInfoSearchForm: {},
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      userInfoption: {
        menu: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "编号",
            prop: "userNo",
            width: "100",
            display: false,
          },
          {
            label: "用户名",
            prop: "userName",
            display: false,
          },
          {
            label: "姓名",
            prop: "userRealName",
            display: false,
          },
          {
            label: "电话号码",
            prop: "userPhone",
            display: false,
            searchSpan: 4,
            search: true,
          },
        ],
        group: [{}],
      },
      option: {
        tabs: true,
        tabsActive: 1,
        delBtn: false,
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "logo",
            prop: "logo",
            type: "img",
            display: false,
          },
          {
            label: "名称",
            prop: "name",
            width: "380",
            search: true,
            display: false,
          },
          {
            label: "电话",
            prop: "phone",
            width: "380",
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
            label: "创建时间",
            prop: "createdTime",
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd",
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
                prop: "name",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入旅行社名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "电话号码",
                prop: "phone",
                rules: [
                  {
                    required: true,
                    message: "请输入电话",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "logo",
                prop: "logo",
                type: "upload",
                listType: "picture-img",
                row: true,
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传logo图片",
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
          {
            icon: "el-icon-info",
            label: "费用说明",
            prop: "group2",
            column: [
              {
                label: "详情",
                prop: "costRemark",
                component: "avueUeditor",
                span: 24,
                options: {
                  //普通图片上传(可配置阿里云oss , 七牛云)
                  action: url.v1.upload.file,
                  //压缩比例
                  canvasOption: {
                    ratio: 0.1,
                  },
                  props: {
                    res: "data",
                    url: "url",
                  },
                },
                rules: [
                  {
                    required: true,
                    message: "请输入详情",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
          {
            icon: "el-icon-info",
            label: "预定说明",
            prop: "group3",
            column: [
              {
                label: "详情",
                prop: "scheduleRemark",
                component: "avueUeditor",
                span: 24,
                options: {
                  //普通图片上传(可配置阿里云oss , 七牛云)
                  action: url.v1.upload.file,
                  //压缩比例
                  canvasOption: {
                    ratio: 0.1,
                  },
                  props: {
                    res: "data",
                    url: "url",
                  },
                },
                rules: [
                  {
                    required: true,
                    message: "请输入详情",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
          {
            icon: "el-icon-info",
            label: "退定说明",
            prop: "group4",
            column: [
              {
                label: "详情",
                prop: "unsubRemark",
                component: "avueUeditor",
                span: 24,
                options: {
                  //普通图片上传(可配置阿里云oss , 七牛云)
                  action: url.v1.upload.file,
                  //压缩比例
                  canvasOption: {
                    ratio: 0.1,
                  },
                  props: {
                    res: "data",
                    url: "url",
                  },
                },
                rules: [
                  {
                    required: true,
                    message: "请输入详情",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.agencyList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    closeFgb(){
      this.blackFGDialogVisible = false;
      this.userInfodata = [];
      this.userInfoSearchForm = [];
    },
    showFGDialog(row) {
      this.blackFGDialogVisible = true;
      this.row = row;
    },
    userInfoselectionChange(list) {
      this.roomManager.ids = list.map((item) => item.id).join(",");
    },
    userInfosearchChange(params, done) {
      this.userInfopage.currentPage = 1;
      this.userInfopage.pageSize = this.userInfopage.pageSize;
      done();
      this.userInfoSearchForm = params;
      if (
        params.userPhone != null &&
        params.userPhone != "" &&
        params.userPhone != undefined
      ) {
        this.userInfoList();
      } else {
        this.$message.error("请输入手机号码查询");
      }
    },
    userInfoList() {
      var data = {
        pageNum: this.userInfopage.currentPage,
        pageSize: this.userInfopage.pageSize,
      };
      request({
        url: url.v1.user.dialogList,
        data: { ...data, ...this.userInfoSearchForm },
      }).then((res) => {
        this.userInfopage.total = res.data.count;
        this.userInfodata = res.data.list;
      });
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.agencyList();
    },
    agencyList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.products.agencyList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          element.logo = element.logo.replace(
            /\?x-image-process=image\/quality,q_80/g,
            ""
          );
        });
        this.data = res.data.list;
      });
    },
    userInfosizeChange(val) {
      this.userInfopage.currentPage = 1;
      this.userInfopage.pageSize = val;
      this.userInfoList();
    },
    userInfocurrentChange(val) {
      this.userInfopage.currentPage = val;
      this.userInfoList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.agencyList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.agencyList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.agencyList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.products.addAgency,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.agencyList();
          done();
        }
      });
    },
    confirmFGToBlack() {
      let that = this;
      if (
        that.roomManager.ids != null &&
        that.roomManager.ids != "" &&
        that.roomManager.ids != undefined
      ) {
        this.$confirm("此操作将该数据设置为核销员吗?, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            request({
              url: url.v1.products.addVerificationOffice,
              method: "POST",
              data: {
                userId: that.roomManager.ids,
                anecyId: that.row.id
              },
            }).then((res) => {
              this.$message.success("成功!");
              this.agencyList();
            });
              this.blackFGDialogVisible = false;
              this.userInfodata = [];
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      } else {
        that.$message.error("请勾选一条数据");
      }
    },
    rowDel(form) {
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
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.agencyList();
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
        url: url.v1.products.updateAgency,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.agencyList();
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
              this.agencyList();
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

    nodeClick(data) {
      this.goodsTypeName = data.label;
      this.page.currentPage = 1;
      this.agencyList();
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
