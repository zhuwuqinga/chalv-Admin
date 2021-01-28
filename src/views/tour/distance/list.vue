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
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            size="small"
            icon="el-icon-setting"
            @click.stop="showDialog(scope.row)"
          >设置行程</el-button>
        </template>
      </avue-crud>
      <el-dialog
        title="新增行程详细"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        :visible.sync="playVisible"
      >
        <avue-crud
          ref="crud"
          :data="dataDialog"
          :option="optionDialog"
          :page.sync="pageDiglog"
          @row-save="rowSaveDiglog"
          @row-update="rowUpdateDialog"
          @row-del="rowDelDialog"
          @search-change="searchChangeDiglog"
          @current-change="currentChangeDialog"
          @refresh-change="refreshChangeDialog"
          @selection-change="selectionChange"
          @size-change="sizeChange"
          :upload-before="uploadBefore"
          :upload-after="uploadAfter"
          :upload-error="uploadError"
        ></avue-crud>
        <span slot="footer" class="dialog-footer">
          <el-button @click="playVisible = false">确 定</el-button>
          <el-button @click="playVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import valueVue from "../../modity/spe/value.vue";
export default {
  name: "speGroupList",
  data() {
    return {
      roleId: 0,
      productsId: 0,

      menuList: [],
      searchForm: {},
      dataDialog: [],
      searchFormDinalog: {},
      playVisible: false,
      crud: {},
      data: [],
      pageDiglog: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },

      optionDialog: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        column: [
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
                label: "标题",
                prop: "title",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入标题",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "图片",
                prop: "imgUrls",
                type: "upload",
                propsHttp: {
                  res: "data",
                },
                span: 24,
                listType: "picture-card",
                rules: [
                  {
                    required: true,
                    message: "请上传图片",
                    trigger: "blur",
                  },
                ],
                tip: "只能上传jpg/png文件，且不超过500kb",
                action: url.v1.upload.file,
              },
              {
                label: "序号",
                prop: "sort",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                cell: true,
                maxRows: 9999,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入序号",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "内容",
                prop: "content",
                row: true,
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
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "产品名称",
            prop: "productName",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "套餐名称",
            prop: "mealName",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "起始地",
            prop: "startAddr",
            searchSpan: 4,
            search: true,
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
                label: "行程序号",
                prop: "distanceOrder",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                cell: true,
                maxRows: 9999,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入行程序号",
                    trigger: "blur",
                  },
                ],
              },
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
                change:({value,column})=>{
                    let that = this;
                    that.productsId = value;
                    console.log("-----测试",value)
                },
                row:true,
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
                    message: "请输入套餐产品",
                    trigger: "select",
                  },
                ],
              },
              //end
              {
                label: "线路选择",
                prop: "routeId",
                type: "select",
                props: {
                  label: "label",
                  value: "value",
                },
                dicUrl: `${url.v1.products.productRouteListTree}/{{productId}}`,
                type:"select",
                cascaderIndex: 1,
                rules: [
                  {
                    required: true,
                    message: "请输入线路选择",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "说明",
                prop: "distanceContent",
                span: 24,
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.distanceList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    uploadBefore(file, done, loading, column) {
      // 上传文件之前校验图片格式和大小
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2m = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 PNG、JPG 格式!");
        loading();
        return false;
      }
      if (!isLt2m) {
        this.$message.error("上传图片大小不能超过2M!");
        loading();
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
    showDialog(row) {
      this.crud = row;
      this.playVisible = true;
      this.detailList();
    },
    rowSaveDiglog(form, done, loading) {
      let imageUrl = "";
      debugger;
      for (let index = 0; index < form.imgUrls.length; index++) {
        const element = form.imgUrls[index];
        imageUrl = imageUrl === "" ? "" : imageUrl;
        imageUrl = imageUrl + element.value;
      }
      form.imgUrls = imageUrl;
      form.destanceId = this.crud.id;
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
    rowDelDialog(form) {
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
    rowUpdateDialog(form, index, done, loading) {
      form.destanceId = this.crud.id;
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
    detailList() {
      var data = {
        destanceId: this.crud.id,
        pageNum: this.pageDiglog.currentPage,
        pageSize: this.pageDiglog.pageSize,
      };
      request({
        url: url.v1.products.detailList,
        method: "post",
        data: { ...data, ...this.searchFormDinalog },
      }).then((res) => {
        this.pageDiglog.total = res.data.total;
        this.dataDialog = res.data.list;
      });
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.distanceList();
    },
    searchChangeDiglog(params, done) {
      done();
      this.pageDiglog.currentPage = 1;
      this.pageDiglog.pageSize = this.page.pageSize;
      this.searchFormDinalog = params;
      this.detailList();
    },
    distanceList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.products.distanceList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChangeDialog() {
      this.pageDiglog.currentPage = 1;
      this.pageDiglog.pageSize = val;
      this.detailList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.distanceList();
    },
    currentChangeDialog() {
      this.pageDiglog.currentPage = val;
      this.detailList();
    },
    refreshChangeDialog() {
      this.detailList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.distanceList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.distanceList();
    },
    rowSave(form, done, loading) {
      form.startAddr = form.$routeId;
      request({
        url: url.v1.products.addDistance,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.distanceList();
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
            url: url.v1.products.deleteDistanceByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.distanceList();
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
        url: url.v1.products.updateDistance,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.distanceList();
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
