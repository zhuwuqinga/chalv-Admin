<template>
  <div>
    <basic-container>
      <el-row :gutter="20">
        <!-- <el-col :span="4">
          <el-card class="box-card" shadow="always">
            <div slot="header" class="clearfix">
              <span>角色类型</span>
            </div>
            <el-tree
              class="filter-tree"
              :data="menuList"
              default-expand-all
              empty-text="暂无数据"
              @node-click="nodeClick"
              ref="tree"
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="20"> -->
          <span>
            <avue-crud
              ref="crud"
              :data="data"
              :option="option"
              :page.sync="page"
              @search-change="searchChange"
              @row-save="rowSave"
              @row-update="rowUpdate"
              @row-del="rowDel"
              @current-change="currentChange"
              @refresh-change="refreshChange"
              @selection-change="selectionChange"
              @size-change="sizeChange"
              :upload-before="uploadBefore"
              :upload-after="uploadAfter"
            >
              <template slot="menuLeft">
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="small"
                  @click.stop="handleDel()"
                >批量删除</el-button>
              </template>
              <template slot="isLock" slot-scope="scope">
                <el-switch
                  name="isLock"
                  v-model="scope.row.isLock"
                  @change="statusClick(scope.row, scope.$index)"
                ></el-switch>
              </template>
              <template slot-scope="scope" slot="menu">
                <el-button
                  type="text"
                  size="small"
                  icon="el-icon-edit-outline"
                  @click.stop="handleEditPassword(scope.row,scope.index)"
                >修改密码</el-button>
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
  name: "manageList",
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
        pageSize: 10
      },
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "编号",
            prop: "id",
            width: "60",
            display: false
          },
          {
            label: "头像",
            prop: "avatar",
           
            type: "img",
            display: false
          },
          {
            label: "用户名",
            prop: "userName",
            display: false,
            search: true
          },
          {
            label: "姓名",
            prop: "realName",
            display: false,
            search: true
          },
          {
            label: "角色",
            prop: "roleName",
            width: "150",
            dataType:"string",
            dicUrl: url.v1.role.roleTree,

            display: false
          },
          {
            label: "禁用",
            prop: "isLock",
            slot: true,
            width: "80",
            display: false
          },
          {
            label: "添加时间",
            prop: "addTime",
            display: false,
            type: "datetimerange",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            searchSpan: 8,
            searchRange: true,
            search: true
          }
        ],
        group: [
          {
            column: [
              {
                label: "角色类型",
                prop: "roleId",
                type: "select",
                span: 18,
                dicUrl: url.v1.manager.roleTree,
                rules: [
                  {
                    required: true,
                    message: "请选择角色类型",
                    trigger: "change"
                  }
                ]
              },
              {
                label: "禁用",
                prop: "isLock",
                type: "switch",
                span: 4
              },
              {
                label: "登录名",
                prop: "userName",
                span: 24,
                rules: [
                  { required: true, message: "请输入登录名", trigger: "blur",}
                ]
              },
              {
                label: "登录密码",
                prop: "password",
                type: "password",
                editDisplay: false,
                span: 24,
                rules: [
                  { required: true, message: "请输入登录密码", trigger: "blur" }
                ]
              },
              {
                label: "头像",
                prop: "avatar",
                span: 24,
                type: "upload",
                listType: "picture-img",
                action: url.v1.upload.file,
                propsHttp: {
                  res: "data"
                }
              },
              {
                label: "姓名",
                span: 24,
                prop: "realName"
              },
              {
                label: "手机号",
                span: 24,
                prop: "telephone",
                rules: [{ validator: customValid.isMobile, trigger: "blur" }]
              
              },
              {
                label: "邮箱",
                span: 24,
                prop: "email",
                rules: [{ validator: customValid.isEmail, trigger: "blur" }]
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.managerList();
    request({
      url: url.v1.manager.roleTree
    }).then(res => {
      this.menuList = res.data;
    });
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.managerList();
    },
    managerList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      let searchData = this.searchForm; 
      if(searchData!=null && searchData.addTime != undefined){
           searchData.startTime = searchData.addTime[0];
           searchData.endTime = searchData.addTime[1];
           delete searchData.addTime;
      }
      request({
        url: url.v1.manager.list,
        data: {...data, ...searchData}
      }).then(res => {
        this.page.total = res.data.count;
         res.data.list.forEach(element => {
         element.isLock = element.isLock == 1 ?true:false
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.managerList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.managerList();
    },
    selectionChange(list) {
      this.deleteId = list.map(item => item.id).join(",");
    },
    refreshChange() {
      this.managerList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.manager.edit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
           this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.managerList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: url.v1.manager.delete,
            method: "POST",
            data: {
              id: form.id
            }
          }).then(res => {
            this.$message.success(res.message);
            this.managerList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rowUpdate(form, index, done, loading) {
      request({
        url: url.v1.manager.edit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.managerList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request({
              url: url.v1.manager.delete,
              method: "POST",
              data: {
                id: this.deleteId
              }
            }).then(res => {
              this.$message.success(res.message);
              this.managerList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的角色"
        });
      }
    },
    statusClick(item) {
      request({
        url: url.v1.manager.updateStatus,
        method: "POST",
        data: {
          id: item.id,
          status: item.isLock === true ? 1 : 0
        }
      }).then(res => {
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
      this.managerList();
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
        inputErrorMessage: "只能输入2-20个字母、数字、下划线"
      })
        .then(({ value }) => {
          request({
            url: url.v1.manager.updatePassword,
            method: "POST",
            data: {
              id: row.id,
              password: value
            }
          }).then(res => {
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
    }
  }
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
