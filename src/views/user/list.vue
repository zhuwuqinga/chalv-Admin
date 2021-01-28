<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :page.sync="page"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @sort-change="sortChange"
        @search-change="searchChange"
        :upload-before="uploadBefore"
        :upload-after="uploadAfter"
      >
      
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "userList",
  data() {
    return {
      roleId: 0,
      deleteId: "",
      menuList: [],
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        selection: true,
        stripe: true,
        editBtn:false,
        addBtn:false,
        delBtn:false,
        menu:false,
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
            searchSpan: 4,
            search: true,
          },
          {
            label: "头像",
            prop: "headImg",
            type: "img",
            display: false,
          },
          {
            label: "用户名",
            prop: "userName",
            display: false,
            searchSpan: 4,
            search: true,
          },
          {
            label: "姓名",
            prop: "userRealName",
            display: false,
            searchSpan: 4,
            search: true,
          },
          {
            label: "手机号码",
            prop: "userPhone",
            width: "100",
            display: false,
            searchSpan: 4,
            search: true,
          },
          {
            label: "上级手机号码",
            prop: "topPhone",
            width: "100",
            display: false,
          },
          {
            label: "是否会员",
            prop: "isMember",
            type:"select",
            dicData:[
              {
                label:"是",
                value:true
              },
              {
                label:"否",
                value:false
              },
              ],
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "关注数",
            prop: "focusCount",
            width: "150",
            sortable: true,
            display: false,
          },
          {
            label: "点赞数",
            prop: "giveCount",
            width: "150",
            sortable: true,
            display: false,
          },
          {
            label: "粉丝数",
            prop: "fansCount",
            width: "150",
            sortable: true,
            display: false,
          },
          {
            label: "时间",
            prop: "gmtCreate",
            display: false,
            type: "date",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        ],
        group: [
          {
            column: [
              {
                label: "禁用",
                prop: "status",
                type: "switch",
              },
              {
                label: "登录名",
                prop: "user_name",
                span: 24,
                rules: [
                  { required: true, message: "请输入登录名", trigger: "blur" },
                ],
              },
              {
                label: "登录密码",
                prop: "user_password",
                type: "password",
                editDisplay: false,
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "请输入登录密码",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "头像",
                prop: "head_img",
                span: 24,
                type: "upload",
                listType: "picture-img",
                action: url.v1.upload.file,
                propsHttp: {
                  res: "data",
                },
              },
              {
                label: "背景图片",
                prop: "background_img",
                span: 24,
                type: "upload",
                listType: "picture-img",
                action: url.v1.upload.file,
                propsHttp: {
                  res: "data",
                },
              },
              {
                label: "姓名",
                span: 24,
                prop: "user_real_name",
              },
              {
                label: "手机号",
                span: 24,
                prop: "user_phone",
                rules: [{ validator: customValid.isMobile, trigger: "blur" }],
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.userList();
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
      this.userList();
    },
    userList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.user.list,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.count;
        res.data.list.forEach((element) => {
          if (element.headImg != null) {
            element.headImg = element.headImg.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
          }
        });
        this.data = res.data.list;
      });
    },
    sortChange(val) {
      var data = this.searchForm;
      data["sort_name"] = val.prop;
      data["sort_order"] = val.order;
      this.userList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.userList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.userList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.userList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.user.edit,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.userList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.user.delete,
            method: "POST",
            data: {
              id: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.userList();
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
        url: url.v1.user.edit,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.userList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            request({
              url: url.v1.user.delete,
              method: "POST",
              data: {
                id: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.userList();
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
          message: "请选择需要删除的角色",
        });
      }
    },
    statusClick(item) {
      request({
        url: url.v1.user.updateStatus,
        method: "POST",
        data: {
          id: item.id,
          status: item.is_lock === true ? 1 : 0,
        },
      }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.userList();
    },
    uploadBefore(file, done) {
      done();
    },
    uploadAfter(res, done) {
      done();
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
            url: url.v1.user.updatePassword,
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
