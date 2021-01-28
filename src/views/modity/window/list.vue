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
        @search-change="searchChange"
      ></avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "speGroupList",
  data() {
    return {
      roleId: 0,
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
        editBtn: true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "编号",
            prop: "id",
            width: "80",
            display: false,
          },
          {
            label: "商品名称",
            prop: "windowGoodsName",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "橱窗图片",
            prop: "windowGoodsFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "商品原价",
            prop: "windowGoodsRealPrice",
            type: "number",
            display: false,
          },
          {
            label: "商品价格",
            prop: "windowGoodsPrice",
            type: "number",
            display: false,
          },
          {
            label: "销量",
            prop: "windowGoodsSales",
            type: "number",
            display: false,
          },
          {
            label: "状态",
            prop: "resourceStatus",
            span: 6,
            type: "switch",
            dicData: [
              {
                label: "下架",
                value: 0,
              },
              {
                label: "上架",
                value: 1,
              },
            ],
            display: false,
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
          },
        ],
        group: [
          {
            column: [
              {
                label: "商品名称",
                prop: "windowGoodsName",
                rules: [
                  {
                    required: true,
                    message: "请填写分类名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "商品图片",
                prop: "windowGoodsFaceImage",
                type: "upload",
                listType: "picture-img",
                row: true,
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传商品图片",
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
                label: "商品原价",
                prop: "windowGoodsRealPrice",
                dataType: "number",
                type: "number",
                row: true,
                span: 6,
                precision: 2,
                minRows: 0,
                value: 0,
                maxRows: 9999,
                rules: [
                  {
                    required: true,
                    message: "请输入商品原价",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "商品价格",
                prop: "windowGoodsPrice",
                type: "number",
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请输入商品价格",
                    trigger: "blur",
                  },
                ],
                minRows: 0,
                precision: 2,
                value: 0,
                maxRows: 9999,
              },
              {
                label: "销量",
                prop: "windowGoodsSales",
                type: "number",
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请输入销量",
                    trigger: "blur",
                  },
                ],
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.goodsWindowList();
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
      this.goodsWindowList();
    },
    goodsWindowList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.market.goodsWindowList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          element.windowGoodsFaceImage = element.windowGoodsFaceImage.replace(
            /\?x-image-process=image\/quality,q_80/g,
            ""
          );
        });
        this.data = res.data.list;
      });
    },

    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.goodsWindowList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.goodsWindowList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.goodsWindowList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.market.addGoodTypeTag,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.goodsWindowList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该规格组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.market.deleteGoodsWindowByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.goodsWindowList();
            done();
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
        url: url.v1.market.updateWindow,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.goodsWindowList();
          done();
        }
      });
    },
  },
};
</script>

<style scoped>
.demo {
  display: inline-block;
  width: 630px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.video-js .vjs-icon-placeholder {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
