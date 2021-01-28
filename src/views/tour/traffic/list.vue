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
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "产品名称",
            prop: "productName",
            width: "200",
            search: true,
            display: false,
          },
          {
            label: "套餐名称",
            prop: "mealName",
            width: "120",
            display: false,
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            search: true,
            dicData: [
              {
                label: "去程",
                value: 1,
              },
              {
                label: "返程",
                value: 2,
              },
            ],
            display: false,
          },
          {
            label: "交通方式",
            prop: "trafficWay",
            display: false,
          },

          {
            label: "出发地",
            prop: "startAddr",
            display: false,
          },

          {
            label: "出发地",
            prop: "endAddr",
            display: false,
          },
          {
            label: "出发时间",
            prop: "startTime",
            display: false,
          },
          {
            label: "到达时间",
            prop: "arriveTime",
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            slot: true,
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "旅游产品",
                prop: "productId",
                type: "select",
                cascaderItem: ["mealId", "routeId"],
                filterable: true,
                dicUrl: url.v1.products.productsListTree,
                dicFormatter: (res) => {
                  return res.data; //返回字典的层级结构
                },
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请选择旅游产品",
                    trigger: "select",
                  },
                ],
              },
              //end
              {
                label: "套餐产品",
                prop: "mealId",
                type: "select",
                dicUrl: `${url.v1.products.mealListTree}/{{key}}`,
                cascaderIndex: 0,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请选择套餐产品",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "线路选择",
                prop: "routeId",
                type: "select",
                row: true,
                props: {
                  label: "label",
                  value: "value",
                },
                dicUrl: `${url.v1.products.productRouteTrafficListTree}/{{productId}}`,
                cascaderIndex: 1,
                rules: [
                  {
                    required: true,
                    message: "请选择线路",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "类型",
                prop: "type",
                row: true,
                type: "select",
                dicData: [
                  {
                    label: "去程",
                    value: 1,
                  },
                  {
                    label: "返程",
                    value: 2,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择类型",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "出发方式",
                prop: "trafficWay",
                row: true,
                type: "select",
                dicData: [
                  {
                    label: "大巴",
                    value: "大巴",
                  },
                  {
                    label: "飞机",
                    value: "飞机",
                  },
                  {
                    label: "高铁",
                    value: "高铁",
                  },
                  {
                    label: "动车",
                    value: "动车",
                  },
                  {
                    label: "船",
                    value: "船",
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请选择出发方式",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "出发地",
                prop: "startAddr",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入出发地",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "目的地",
                prop: "endAddr",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入目的地",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "出发时间",
                prop: "startTime",
                type: "time",
                 row:true,
                valueFormat: "HH:mm",
                rules: [
                  {
                    required: true,
                    message: "请选择出发时间",
                    trigger: "blur",
                  },
                ],
                showColumn: false,
              },
               {
                label: "到达时间",
                prop: "arriveTime",
                type: "time",
                row:true,
                valueFormat: "HH:mm",
                rules: [
                  {
                    required: true,
                    message: "请选择到达时间",
                    trigger: "blur",
                  },
                ],
                showColumn: false,
              },
              {
                label: "状态",
                prop: "status",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不可用",
                    value: false,
                  },
                  {
                    label: "可用",
                    value: true,
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
    this.trafficList();
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
      this.trafficList();
    },
    trafficList(searchData) {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.products.trafficList,
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
      this.trafficList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.trafficList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.trafficList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.products.addTraffic,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.trafficList();
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
            url: url.v1.products.deleteTraffic,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.trafficList();
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
        url: url.v1.products.updateTraffic,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.trafficList();
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
              url: url.v1.products.deleteStartPlace,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.trafficList();
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
      this.trafficList();
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
