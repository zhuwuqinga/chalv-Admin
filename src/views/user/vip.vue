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
      >
        <template slot="goodsTagName" slot-scope="scope">
          <el-tag>{{scope.row.goodsTagName}}</el-tag>
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
            label: "封面图",
            prop: "img",
            type: "img",
            display: false,
          },
          {
            label: "权益名称",
            prop: "interestsName",
            searchSpan: 4,
            search: true,
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "图片",
                prop: "img",
                type: "upload",
                listType: "picture-img",
                row: true,
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传图片",
                    trigger: "blur",
                  },
                ],
                propsHttp: {
                  res: "data",
                },
                tip: "只能上传jpg/png文件，且不超过2M",
              },
              {
                label: "权益名称",
                prop: "interestsName",
                rules: [
                  {
                    required: true,
                    message: "请填写分类名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "内容",
                prop: "text",
                component: "avueUeditor",
                span: 24,
                options: {
                  //普通图片上传(可配置阿里云oss , 七牛云)
                  action: url.v1.upload.file,
                  //压缩比例
                  canvasOption: {
                    ratio: 0.1,
                  },
                  props: {
                    res: "data",
                    url: "url",
                  },
                },
                rules: [
                  {
                    required: true,
                    message: "请输入详情",
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
    this.interestList();
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
      this.interestList();
    },
    interestList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.user.interestList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.count;
        this.data = res.data.list;
      });
    },

    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.interestList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.interestList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.interestList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.user.interestAdd,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.interestList();
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
            url: url.v1.user.interestDelete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.interestList();
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
        url: url.v1.user.interestUpdate,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.interestList();
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
