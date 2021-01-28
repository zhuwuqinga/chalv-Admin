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
            @row-save="rowSave"
            @row-update="rowUpdate"
            @row-del="rowDel"
            @search-change="searchChange"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
          >
            <template slot-scope="scope" slot="status">
              <el-tag>{{statusLabel[scope.row.status-1]}}</el-tag>
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
import url from "@/config/url";
export default {
  name: "manageList",
  data() {
    const validateUpper = (rule, value, callback) => {
      if (value === '') {
        callback(new Error("请输入英文名"));
      } else {
        const reg = /^[A-Za-z]+$/;
        const flag = reg.test(value);
        if (!flag) {
          callback(new Error("请输入正确的英文名"));
        }else{
            callback();
        }
      }
    };
    return {
      menuList: [],
      searchForm: {},
      data: [],
      statusLabel: ["启用", "禁用"],
      sexLabel: ["女", "男"],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      option: {
        selection: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 300,
        column: [
          {
            label: "编号",
            prop: "id",
            display: false,
            search: true
          },
          {
            label: "代码",
            prop: "code",
            search: true,
            display: false,
          },
          {
            label: "分类",
            prop: "ename",
            display: false,
          },
          {
            label: "中文名",
            prop: "name",
            display: false,
            search: true
          },
          {
            label: "状态",
            prop: "status",
            type: "select",
            display: false,
            slot: true,
            dicData: [
              {
                label: "正常",
                value: 1
              },
              {
                label: "停用",
                value: 2
              }
            ],
            search: true
          },
          {
            label: "备注",
            prop: "des",
            display: false
          }
        ],
        group: [
          {
            column: [
              {
                label: "代码",
                prop: "code",
                span: 10,
                rules: [
                  {
                    required: true,
                    message: "请输入代码",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "启用",
                prop: "status",
                type: "select",
                span: 10,
                rules: [
                  {
                    required: true,
                    message: "请选择是否启用",
                    trigger: "change"
                  }
                ]
              },
              {
                label: "中文名",
                prop: "name",
                span: 10,
                rules: [
                  { required: true, message: "请输入中文名", trigger: "blur" }
                ]
              },
              {
                label: "备注",
                prop: "des",
                span: 10
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.typeList();
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
      this.typeList();
    },
    typeList() {
      var data = {
        type: "live",
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      request({
        url: url.v1.ttcSysDict.typeList,
        data: { ...data, ...this.searchForm }
      }).then(res => {
        this.page.total = res.data.count;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.typeList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.typeList();
    },

    refreshChange() {
      this.typeList();
    },

    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.typeList();
    },
    uploadBefore(file, done) {
      done();
    },
    uploadAfter(res, done) {
      done();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.ttcSysDict.saveOrUpdate,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.typeList();
          done();
        }
      });
    },
    rowUpdate(form, index, done, loading) {
      request({
        url: url.v1.ttcSysDict.saveOrUpdate,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.typeList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: url.v1.ttcSysDict.deleteType,
            method: "POST",
            data: {
              id: form.id
            }
          }).then(res => {
            this.$message.success(res.message);
            this.typeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
