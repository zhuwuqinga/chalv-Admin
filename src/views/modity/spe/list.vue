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
      >
        <template slot="speName" slot-scope="scope">
          <el-tag>{{scope.row.speName}}</el-tag>
        </template>
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
            label: "组名称",
            prop: "speName",
            searchSpan: 4,
            slot: true,
            search: true,
            display: false,
          },
          {
            label: "分类",
            prop: "typeId",
            search: true,
            type: "select",
            cascaderItem: ["pid"],
            dicUrl: url.v1.market.listChildTree,
            display: false,
          },
          {
            label: "上级规格",
            prop: "pid",
            type: "select",
            cascaderIndex: 0,
            dicUrl: `${url.v1.market.speGroupListTree}/{{key}}`,
            display: false,
          },
          
        ],
        group: [
          {
            column: [
              {
                label: "规格名称",
                prop: "speName",
              },
              {
                label: "分类",
                prop: "typeId",
                type: "select",
                cascaderItem: ["pid"],
                dicUrl: url.v1.market.listChildTree,
                dicFormatter: res => {
                  return res.data; //返回字典的层级结构
                },
                rules: [
                  {
                    required: true,
                    message: "请选择分类",
                    trigger: "blur"
                  }
                ],
                row: true,
              },
              {
                label: "上级规格",
                prop: "pid",
                type: "select",
                row: true,
                cascaderIndex: 0,
                dicUrl: `${url.v1.market.speGroupListTree}/{{key}}`,
                rules: [
                  {
                    required: true,
                    message: "请选择上级规格",
                    trigger: "blur"
                  }
                ]
              },  
            ],
          },
        ],
      },
    };
  },
  created() {
    this.speGroup();
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
      this.speGroup();
    },
    speGroup() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.market.speGroupList,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sortChange(val) {
      var data = this.searchForm;
      data["sort_name"] = val.prop;
      data["sort_order"] = val.order;
      this.speGroup();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.speGroup();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.speGroup();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.speGroup();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.market.addSpeGroup,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.speGroup();
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
            url: url.v1.market.deleteSpeGroup,
            method: "POST",
            data: {
              id: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.speGroup();
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
        url: url.v1.market.updateSpeGroup,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.speGroup();
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
