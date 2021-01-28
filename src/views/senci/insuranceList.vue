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
            @row-save="rowSave"
            @row-update="rowUpdate"
            @row-del="rowDel"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChange"
            @size-change="sizeChange"
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
              <el-switch
                name="status"
                v-model="scope.row.status"
                @change="statusClick(scope.row, scope.$index)"
              ></el-switch>
            </template>
            <template slot="type" slot-scope="scope">
              <el-tag>{{type[scope.row.type-1]}}</el-tag>
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
  name: "hostList",
  data() {
    return {
      deleteId: "",
      permissions: {},
      menuList: [],
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      type:["景点门票","旅游门票"],
      option: {
        selection: true,
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
          },
          {
            label: "保险名称",
            prop: "name",
            display: false,
            search: true,
          },
          {
            label: "保险单价￥",
            prop: "price",
            display: false,
          },
          {
            label: "保险保额￥",
            prop: "coverage",
            display: false,
          },
          {
            label: "保险类型",
            prop: "type",
            type: "select",
            slot: true,
            display: false,
            search: true,
            dicData: [
              {
                label: "旅游产品",
                value: 1,
              },
              {
                label: "景点门票",
                value: 2,
              }
            ],
          },
          {
            label: "保险说明",
            prop: "remark",
            display: false,
          },
          {
            label: "添加时间",
            prop: "createdTime",
            display: false,
            type: "datetime",
            valueFormat: "yyyy-MM-dd",
            format: "yyyy-MM-dd hh:mm:ss",
            searchSpan: 8,
            searchRange: true,
          },
        ],
        group: [
          {
            column: [
              {
                label: "保险名称",
                prop: "name",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入保险名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "保险类型",
                prop: "type",
                type: "select",
                dicData: [
                  {
                    label: "旅游产品",
                    value: 1,
                  },
                  {
                    label: "景点门票",
                    value: 2,
                  },
                ],
                 rules: [
                  {
                    required: true,
                    message: "请选择保险类型",
                    trigger: "select",
                  },
                ],
                row: true,
              },
              {
                label: "价格",
                prop: "price",
                dataType: "number",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                value: 0,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入价格",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "保险保额",
                prop: "coverage",
                dataType: "number",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                value: 0,
                rules: [
                  {
                    required: true,
                    message: "请输入保险保额",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "保险说明",
                prop: "remark",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入保险说明",
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
    this.insuranceList();
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
      this.insuranceList();
    },
    insuranceList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.scenic.insuranceList,
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
      this.insuranceList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.insuranceList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.insuranceList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.scenic.addSave,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          console.log(res);
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.insuranceList();
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
            url: url.v1.scenic.deleteByIdsSave,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.insuranceList();
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
      var data = {
        id:form.id,
        type:form.type,
        name:form.name,
        price:form.price,
        coverage:form.coverage,
        remark:form.remark,
      }
      request({
        url: url.v1.scenic.updateSave,
        method: "POST",
        data: data,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.insuranceList();
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
              url: url.v1.scenic.deleteByIdsSave,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.insuranceList();
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
    statusClick(item) {
      request({
        url: url.v1.scenic.infoStatus,
        method: "POST",
        data: {
          id: item.id,
          status: item.status === true ? 1 : 0,
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
      this.insuranceList();
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
