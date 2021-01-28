<template>
  <div>
    <basic-container>
      <avue-crud
        :data="data"
        :option="option"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @selection-change="selectionChange"
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            size="small"
            icon="el-icon-user-solid"
            v-if="scope.row.id != 1"
            @click.stop="handleEdit(scope.row,scope.index)"
          >编辑权限</el-button>
        </template>
      </avue-crud>

      <el-dialog
        :title="type === 'create' ? '创建' : '修改'"
        :visible.sync="dialogFormVisible"
        @close="dialogClose"
        append-to-body
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="form.roleName" :disabled="type === 'edit'" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="界面选择">
            <el-tree
              ref="tree"
              :data="routerList"
              :props="props"
              show-checkbox
              node-key="label"
              :default-checked-keys="check"
              @check-change="handleCheckChange"
            ></el-tree>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" v-if="type === 'edit'" @click="modifyRole">修 改</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
// import customValid from '@/util/customValidate'
import { setStore, getStore } from "@/util/store";
import url from "@/config/url";
export default {
  name: "roleList",
  data() {
    return {
      loading: true,
      roleId: 0,
      recouceType:"",
      checkedEquipments: [], //随意修改后的checked项（即要传到后台的变更数据）
      checkAll: false,
      asyncRouterMap: [],
      dialogVisible: false,
      deleteId: [],
      checkedall: [],
      data: [],
      form: {
        roleId: undefined,
        roleName: undefined,
        permissions: undefined,
      },
      type: "create",
      dialogFormVisible: false,
      routerList: [],
      props: {
        label: "label",
      },
      check: [1],
      defaultAllCheck: [],
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        index: true,
        dialogHeight: 250,
        column: [
          {
            label: "编号",
            prop: "id",
            width: "80",
            display: false,
          },
          {
            label: "角色名称",
            prop: "roleName",
            display: false,
          },
          {
            label: "角色类型",
            dataType: "string",
            prop: "roleType",
            dicData: [
              {
                label: "系统用户",
                value: "1",
              },
              {
                label: "普通用户",
                value: "2",
              },
            ],
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "角色类型",
                prop: "roleType",
                type: "select",
                span: 24,
                dataType: "string",
                dicData: [
                  {
                    label: "系统用户",
                    value: 1,
                  },
                  {
                    label: "普通用户",
                    value: 2,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择角色类型",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "角色名称",
                prop: "roleName",
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "请输入角色名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "模块类型",
                prop: "type",
                type: "select",
                span: 24,
                dataType: "string",
                cascaderItem: ["resourceId"],
                dicData: [
                  {
                    label: "酒店",
                    value: "hotel",
                  },
                  {
                    label: "景点",
                    value: "scenic",
                  },
                  {
                    label: "旅行社",
                    value: "products",
                  },
                ],
                change: ({ value, column }) => {
                  let that = this;
                  if (value) {
                    that.recouceType = value;
                  }
                },
                rules: [
                  {
                    required: true,
                    message: "请选择模块类型",
                    trigger: "change",
                  },
                ],
              },
              {
                label:"关联资源",
                prop: "resourceId",
                type: "select",
                filterable:true,
                cascaderIndex:0,
                dicMethod:"post",
                dicUrl:`${url.v1.role.resourceIdList}/{{key}}`,
              }
            ],
          },
        ],
      },
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 12,
      },
    };
  },
  created() {
    this.roleList();
    this.generetorRouter();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    modifyRole() {},
    dialogClose() {
      setTimeout(() => {
        this.$nextTick(function () {
          this.$refs["tree"].setCheckedKeys([]);
          this.checkedall = [];
        });
      }, 0);
    },
    handleCheckChange(data, checked, indeterminate) {
      this.checkedall.push(this.$refs.tree.getNode(data));
    },
    modifyRole() {
      var list = this.$refs.tree.getHalfCheckedKeys();
      this.form.permissions = this.$refs.tree.getCheckedKeys();
      this.form.permissions = this.form.permissions.concat(list);
      request({
        url: url.v1.role.modifyRole,
        method: "POST",
        data: this.form,
      }).then((res) => {
        this.$message.success(res.message);
        this.dialogFormVisible = false;
        this.roleList();
        setTimeout(() => {
          this.$nextTick(function () {
            this.$refs["tree"].setCheckedKeys([]);
            this.checkedall = [];
          });
        }, 0);
      });
    },
    handleEdit(row) {
      this.form.roleId = row.id;
      let that = this;
      that.dialogFormVisible = true;
      request({
        url: url.v1.role.findOne,
        data: {
          id: row.id,
        },
      }).then((res) => {
        if (res.data.indexOf("*") !== -1) {
          that.check = that.defaultAllCheck;
        } else {
          that.check = res.data;
        }
        that.type = "edit";
        that.form.roleName = row.roleName;
      });
    },
    generetorRouter() {
      let num = 0;
      let childrenNum = 100;
      this.routerList = [];
      let that = this;
      request({
        url: url.v1.naction.list,
      }).then((res) => {
        that.asyncRouterMap = res.data;
        that.asyncRouterMap.forEach((router) => {
          //菜单
          num = num + 1;
          let routes = [];
          var rter = {
            label: router.title,
            id: num,
            value: router.name,
            children: [],
          };
          if (router.children == undefined || router.children == null) {
            return false;
          }
          router.children.forEach((children) => {
            childrenNum = childrenNum + 1;
            rter.children.push({
              label: children.title,
              id: childrenNum,
              value: children.name,
            });
          });
          routes.push(rter);
          that.routerList = that.routerList.concat(routes);
        });

        that.defaultAllCheck = that.routerList.map((router) => router.label);
      });
    },

    roleList() {
      this.checkedall = [];
      request({
        url: url.v1.role.list,
        data: {
          page: this.page.currentPage,
          limit: this.page.pageSize,
        },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.roleList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.roleList();
    },
    refreshChange() {
      this.roleList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.role.add,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.roleList();
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
            url: url.v1.role.delete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.roleList();
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
        url: url.v1.role.edit,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.roleList();
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
              url: url.v1.role.delete,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.roleList();
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
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    handleDialogClose(done) {
      this.roleId = 0;
      done();
    },
    handleSelectAll(row, index) {
      if (this.roleData[index].selectAll) {
        this.roleData[index].action_select = this.roleData[
          index
        ].action_type.map((item) => item.action);
      } else {
        this.roleData[index].action_select = [];
      }
    },
    handleChangeRole() {
      var selectAction = this.roleData
        .map((item) => {
          return {
            Name: item.name,
            Value: item.action_select,
          };
        })
        .filter((item) => item.Value.length > 0);
      request({
        url: url.v1.role.roleEditValue,
        method: "POST",
        data: {
          Id: this.roleId,
          Value: JSON.stringify(selectAction),
        },
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
        } else {
          this.$message.success(res.message);
          this.roleId = 0;
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 0 20px;
}
.menu-header {
  padding: 8px 0;
}
</style>