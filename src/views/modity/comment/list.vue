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
            @row-del="rowDel"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChange"
            @size-change="sizeChange"
          >
            <template slot="score" slot-scope="scope">
              <el-rate
                v-model="scope.row.score"
                :allow-half="true"
                disabled
                text-color="#ff9900"
              ></el-rate>
            </template>
            <template slot="menuLeft">
              <el-button
                type="primary"
                icon="el-icon-delete"
                size="small"
                @click.stop="handleDel()"
              >批量删除</el-button>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit-outline"
                @click.stop="comCockmit(scope.row)"
              >置顶</el-button>
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
      option: {
        selection: true,
        stripe: true,
        addBtn: false,
        editBtn: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "订单号",
            prop: "orderNo",

            hide: true,
            search: true,
            display: false,
          },
          {
            label: "评论图片",
            prop: "addrImg",

            type: "img",
            display: false,
          },
          {
            label: "点赞数",
            prop: "giveCount",
            type: "number",
            sortable: true,
            display: false,
          },
          {
            label: "评论类型",
            prop: "resourceType",

            type: "select",
            dicData: [
              {
                label: "商品",
                value: "GOODS",
              },
              {
                label: "景点",
                value: "SCENIC",
              },
              {
                label: "酒店",
                value: "HOTEL",
              },
              {
                label: "旅游产品",
                value: "TOUR_PRODUCT",
              },
            ],
            display: false,
          },
          {
            label: "评论对象",
            prop: "resourceName",

            display: false,
          },
          {
            label: "评论对象规格",
            prop: "resourceSpe",

            display: false,
          },
          {
            label: "状态",
            prop: "status",

            type: "select",
            dicData: [
              {
                label: "不正常",
                value: false,
              },
              {
                label: "正常",
                value: true,
              },
            ],
            display: false,
          },
          {
            label: "内容",
            prop: "content",
            dataType: "text",
            width: 300,
            display: false,
            search: true,
          },
          {
            label: "评分",
            prop: "score",
            slot: true,
            width: 140,
            sortable: true,
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            display: false,
            type: "datetime",
            width: 150,
            valueFormat: "yyyy-MM-dd",
            format: "yyyy-MM-dd hh:mm:ss",
          },
        ],
        group: [
          {
            column: [
              {
                label: "名称",
                prop: "name",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入热搜词名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "是否热门",
                prop: "isHot",
                type: "switch",
                row: true,
                value: 0,
              },
              {
                label: "排序",
                prop: "sort",
                type: "number",
                span: 6,
                minRows: 0,
                value: 99,
                maxRows: 9999,
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入排序",
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
    this.appInfoList();
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
      this.appInfoList();
    },
    appInfoList(searchData) {
      var data = {
        type: "GOODS",
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.market.appInfoList,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        debugger
        res.data.list.forEach((element) => {
          if (element.addrImg != "" && element.addrImg!=null) {
            element.addrImg = element.addrImg.split("!#!");
          }
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.appInfoList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.appInfoList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.appInfoList();
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.market.deleteAppInfo,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.appInfoList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
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
              url: url.v1.market.deleteAppInfo,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.appInfoList();
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
    comCockmit(row) {
      this.$confirm("此操作将置顶该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.market.updateAppInfoIsTop,
            method: "POST",
            data: {
              id: row.id,
              top: 1,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.appInfoList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
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
