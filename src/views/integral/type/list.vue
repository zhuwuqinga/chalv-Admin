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
              <template slot="goodsTypeStatus" slot-scope="scope">
                <el-switch
                  name="goodsTypeStatus"
                  v-model="scope.row.goodsTypeStatus"
                  @change="setIsRecord(scope.row)"
                ></el-switch>
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
      goodsTypeName: "",
      statusLabel: ["不可用", "可用"],
      permissions: {},
      TypeTreeList: [],

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
        title: "商品列表",
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "类别名称",
            prop: "goodsTypeName",

            search: true,
            display: false,
          },

          {
            label: "商品分类图片",
            prop: "goodsTypeImage",
            type: "img",
            display: false,
          },
          {
            label: "数据状态",
            prop: "goodsTypeStatus",
            slot: true,
            width: "80",
            display: false,
          },

          {
            label: "排序",
            prop: "sort",

            display: false,
          },
          {
            label: "添加时间",
            prop: "createdTime",
            display: false,
            type: "datetime",
            valueFormat: "yyyy-MM-dd",
            format: "yyyy-MM-dd HH:mm:ss",
            searchSpan: 8,
            searchRange: true,
          },
        ],
        group: [
          {
            column: [
              {
                label: "类别名称",
                prop: "goodsTypeName",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入类别名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "排序",
                prop: "sort",
                row: true,
              },
              {
                label: "数据状态",
                prop: "goodsTypeStatus",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不可用",
                    value: 0,
                  },
                  {
                    label: "可用",
                    value: 1,
                  },
                ],
                row: true,
                hide: true,
              },
              {
                label: "商品分类图片",
                prop: "goodsTypeImage",
                type: "upload",
                listType: "picture-img",
                span: 24,
                row: true,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传商品分类图片",
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
            ],
          },
        ],
      },
    };
  },
  created() {
    this.goodsType();
    this.list();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    list() {
      request({
        url: url.v1.market.goodsTypeTree,
      }).then((res) => {
        this.TypeTreeList = res.data;
      });
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.goodsType();
    },
    goodsType() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
        goodsTypeName: "",
      };
      if (this.goodsTypeName != "" || this.goodsTypeName != undefined) {
        data.goodsTypeName = this.goodsTypeName;
        this.goodsTypeName = "";
      }
      request({
        url: url.v1.integralType.typeList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          if (element.goodsTypeImage != "") {
            element.goodsTypeImage = element.goodsTypeImage.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
            element.goodsTypeStatus = element.goodsTypeStatus == 1 ?true:false;
          }
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.goodsType();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.goodsType();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.goodsType();
    },
     setIsRecord(row) {
      let data = {
        ids: row.id,
        status: row.goodsTypeStatus === true ? 1 : 0,
      };
      let str = row.goodsTypeStatus == true ?"启用":"禁用";
  
      this.$confirm("此操作将"+str+"当前数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.integralType.updateStatus,
            method: "POST",
            data: data,
          }).then((res) => {
            this.$message.success(res.message);
             this.goodsType();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    rowSave(form, done, loading) {
      form.goodsTypeImage =
        form.goodsTypeImage + "?x-image-process=image/quality,q_80";
      request({
        url: url.v1.integralType.typeAdd,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          done();
        }
        this.goodsType();
        this.list();
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
            url: url.v1.integralType.typeDelete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.goodsType();
            this.list();
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
      form.goodsTypeImage =
        form.goodsTypeImage + "?x-image-process=image/quality,q_80";
      request({
        url: url.v1.integralType.typeUpdate,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.goodsType();
          this.list();
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
              url: url.v1.integralType.typeDelete,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.goodsType();
              this.list();
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
      this.goodsType();
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
