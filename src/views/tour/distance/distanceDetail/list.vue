<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        v-model="crud"
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
      crud: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        column: [
           {
            label: "行程名称",
            prop: "destanceName",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "标题",
            prop: "title",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "内容",
            prop: "content",
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            display: false,
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
          },
        ],
        group: [
          {
            column: [
            {
                label: "选择行程",
                prop: "destanceId",
              
                type:"select",
                rules: [
                  {
                    required: true,
                    message: "请选择行程",
                    trigger: "select",
                  },
                ],
            },
                {
                    label: "标题",
                    prop: "title",
                    rules: [
                    {
                    required: true,
                    message: "请输入标题",
                    trigger: "blur",
                  },
                ],
                },
                {
                    label: "内容",
                    prop: "content",
                    rules: [
                    {
                    required: true,
                    message: "请输入内容",
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
    this.detailList();
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
      this.detailList();
    },
    detailList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.products.detailList,
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
      this.detailList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.detailList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.detailList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.products.addDistanceDetail,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.detailList();
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
            url: url.v1.products.deleteDistanceDetailByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.detailList();
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
        url: url.v1.products.updateDistanceDetail,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.detailList();
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
