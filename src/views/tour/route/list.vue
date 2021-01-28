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
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="small"
              @click.stop="handleDel()"
            >批量删除</el-button>
          </template>
          <template slot="status" slot-scope="scope">
            <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
          </template>
          <template slot="isHot" slot-scope="scope">
            <el-switch name="isHot" v-model="scope.row.isHot" disabled></el-switch>
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
        pageSize: 10
      },
      option: {
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "行程列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "目的地图片",
            prop: "imgUrl",
            type: "img",
            display: false
          },
          {
            label: "起始地",
            prop: "routeStart",
            search: true,
            display: false
          },
          {
            label: "目的地",
            prop: "routeFinish",
            search: true,
            display: false
          },
          {
            label: "天数",
            prop: "routeDay",
            type: "number",
            span: 6,
            minRows: 0,
            value: 0,
            cell: true,
            maxRows: 9999,
            display: false
          },
          {
            label: "状态",
            prop: "status",
            slot: true,
            display: false
          },
          {
            label: "热门",
            prop: "isHot",
            width: "80",
            slot: true,
            display: false
          }
        ],
        group: [
          {
            column: [
              {
                label: "起始地",
                prop: "startPlaceId",
                type: "select",
                dicUrl: url.v1.products.startPlaceListTree,
                rules: [
                  {
                    required: true,
                    message: "请选择起始地",
                    trigger: "blur"
                  }
                ],
                row: true
              },
              {
                label: "目的地",
                prop: "targetPlaceId",
                type: "select",
                row: true,
                dicUrl: url.v1.products.targetPlaceListTree,
                rules: [
                  {
                    required: true,
                    message: "请选择目的地",
                    trigger: "blur"
                  }
                ]
              },
              {
                label: "天数",
                prop: "routeDay",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                cell: true,
                maxRows: 9999,
                rules: [
                  {
                    required: true,
                    message: "请输入天数",
                    trigger: "blur"
                  }
                ],
                row: true
              },
              {
                label: "热门",
                prop: "isHot",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "否",
                    value: false
                  },
                  {
                    label: "是",
                    value: true
                  }
                ],
                hide: true
              },
              {
                label: "状态",
                prop: "status",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不可用",
                    value: false
                  },
                  {
                    label: "可用",
                    value: true
                  }
                ],
                row: true,
                hide: true
              },
              {
                label: "路线封面图",
                prop: "imgUrl",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传目的地图片",
                    trigger: "blur"
                  }
                ],
                propsHttp: {
                  res: "data"
                },
                // 压缩比例
                canvasOption: {
                  ratio: 0.1
                },
                tip: "只能上传jpg/png文件，且不超过2M",
                row: true
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.routeList();
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
      this.routeList();
    },
    routeList(searchData) {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      request({
        url: url.v1.products.routeList,
        data: { ...data, ...this.searchForm }
      }).then(res => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.routeList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.routeList();
    },
    selectionChange(list) {
      this.deleteId = list.map(item => item.id).join(",");
    },
    refreshChange() {
      this.routeList();
    },
    rowSave(form, done, loading) {

      form.routeStart = form.$startPlaceId;
      form.routeFinish = form.$targetPlaceId;
      if (form.status == undefined || form.status == "") {
        form.status = 0;
      }
      request({
        url: url.v1.products.addRoute,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.routeList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: url.v1.products.deleteRoute,
            method: "POST",
            data: {
              ids: form.id
            }
          }).then(res => {
            this.$message.success(res.message);
            this.routeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rowUpdate(form, index, done, loading) {
      request({
        url: url.v1.products.updateRoute,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.routeList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request({
              url: url.v1.products.deleteRoute,
              method: "POST",
              data: {
                ids: this.deleteId
              }
            }).then(res => {
              this.$message.success(res.message);
              this.routeList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的分类"
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
      this.routeList();
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
