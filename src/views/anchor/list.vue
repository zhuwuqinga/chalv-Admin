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
            <template slot="isRecord" slot-scope="scope">
              <el-switch
                name="isRecord"
                v-model="scope.row.isRecord"
                @change="setIsRecord(scope.row)"
              ></el-switch>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                :disabled="scope.row.realStatus!=1"
                @click.stop="handleAuthSuccess(scope.row,scope.index)"
              >审核通过</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                :disabled="scope.row.realStatus!=1"
                @click.stop="handleAuthError(scope.row,scope.index)"
              >审核拒绝</el-button>
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
import { anchorAuth } from "@/api/anchor";
import url from "@/config/url";
export default {
  name: "manageList",
  data() {
    return {
      authids: "",
      menuList: [],
      searchForm: {},
      data: [],
      userInfoData: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        editBtn: false,
        addBtn: false,
        delBtn: false,
        selection: true,
        stripe: true,
        slot: "暂无数据",
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 300,
        column: [
          {
            label: "用户昵称",
            prop: "userName",
            display: false,
            search: true,
          },
          {
            label: "用户真实姓名",
            prop: "userRealName",
            display: false,
          },
          {
            label: "身份证号码",
            prop: "userIdentityNumber",
            width: "300",
            display: false,
          },
          {
            label: "手机号码",
            prop: "userPhone",
            display: false,
            search: true,
          },

          {
            label: "审核状态",
            prop: "realStatus",
            type: "select",
            search: true,
            dicData: [
              {
                label: "未认证",
                value: 0,
              },
              {
                label: "认证中",
                value: 1,
              },
              {
                label: "认证通过",
                value: 2,
              },
              {
                label: "认证驳回",
                value: 3,
              },
            ],
          },
          {
            label: "录播权限",
            prop: "isRecord",
            slot: true,
            width: "80",
            display: false,
          },
        ],
      },
    };
  },
  created() {
    this.anchorList();
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
      this.anchorList();
    },
    anchorList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.anchor.list,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.count;
        res.data.list.forEach((element) => {
          element.isRecord = element.isRecord == 1 ? true : false;
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.anchorList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.anchorList();
    },
    setIsRecord(row) {
      let data = {
        id: row.id,
        status: row.isRecord === true ? 1 : 0,
      };
      this.$confirm("此操作设置当前数据的录播权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.anchor.setIsRecord,
            method: "POST",
            data: data,
          }).then((res) => {
            this.$message.success(res.message);
            this.anchorList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    selectionChange(list) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (
          element.userIdentityNumber != null &&
          element.userIdentityNumber != "" &&
          element.userRealName != null &&
          element.userRealName != ""
        ) {
          this.authids = list.map((item) => ietm.id).join(",");
        } else {
          this.$message.error("数据不完整,必须要实名认证过才能成为主播");
          return false;
        }
      }
    },
    refreshChange() {
      this.anchorList();
    },
    handleAuthSuccess(row) {
      if (
        row.userIdentityNumber != null &&
        row.userIdentityNumber != "" &&
        row.userRealName != null &&
        row.userRealName != ""
      ) {
        this.$confirm("此操作将审核通过当前选择主播, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            anchorAuth(row.id, 2).then((res) => {
              if (res.data.status == 200) {
                this.$message.success(res.data.msg);
                this.anchorList();
                done();
              } else {
                this.$message.error(res.data.message);
                loading();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核",
            });
          });
      } else {
        this.$message.error("数据不完整,必须要实名认证过才能成为主播");
      }
    },
    handleAuthError(row) {
      if (
        row.userIdentityNumber != null &&
        row.userIdentityNumber != "" &&
        row.userRealName != null &&
        row.userRealName != ""
      ) {
        this.$confirm("此操作将驳回当前选择主播, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            anchorAuth(row.id, 3).then((res) => {
              this.$message.success(res.data.msg);
              this.anchorList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核",
            });
          });
      } else {
        this.$message.error("数据不完整,必须要实名认证过才能成为主播");
      }
    },
    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.anchorList();
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
