<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :data="tableData"
        :option="option"
        :page="page"
        :table-loading="tableLoading"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @row-del="rowDel"
        @search-reset="resetHandle"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @sort-change="sortChange"
        @search-change="searchChange"
        :upload-before="uploadBefore"
        :upload-after="uploadAfter"
        :upload-error="uploadError"
      >
        <template slot="isTop" slot-scope="scope">
          <el-tag>{{scope.row.isTop == 1 ?"置顶":"不置顶"}}</el-tag>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" size="small" @click.stop="showAddrDialog(scope.row)">关联橱窗</el-button>
          <el-button type="text" size="small" @click.stop="showWindowDialog(scope.row)">查看橱窗</el-button>
        </template>
      </avue-crud>
    </basic-container>

    <el-dialog
      title="橱窗列表"
      :visible.sync="windowDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="80%"
      append-to-body
    >
      <avue-crud
        ref="crud"
        :data="windowdata"
        :option="windowoption"
        :page.sync="windowpage"
        @current-change="windowcurrentChange"
        @selection-change="windowselectionChange"
        @size-change="windowsizeChange"
        @search-change="windowsearchChange"
      ></avue-crud>
      <el-button type="primary" @click="addRetaion()">添加</el-button>
      <el-button @click="closeWindow">取消</el-button>
    </el-dialog>

    <el-dialog
      title="橱窗列表"
      :visible.sync="viewswindowDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="80%"
      append-to-body
    >
      <avue-crud ref="crud1" :data="windowdata" :option="viewsoption" @row-del="rowDelViews"></avue-crud>
      <el-button @click="viewswindowDialogVisible=false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { option, goodOption } from "@/const/noticeManage/listTableOption";
import { getNoticeManageList, getGoodList, addList } from "@/api/NoticeManage";
import url from "@/config/url";
import { request } from "@/util/request";

export default {
  data() {
    return {
      windowsIds: [],
      tableData: [],
      windowdata: [],
      row: {},
      windowDialogVisible: false,
      viewswindowDialogVisible: false,
      tableLoading: false,
      option: option,
      windowoption: {
        selection: true,
        stripe: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
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
            label: "资源名称",
            prop: "windowGoodsName",
            searchSpan: 4,
            search: true,
            display: false,
          },
          {
            label: "资源类型",
            prop: "resourceType",
            type: "select",
            searchSpan: 4,
            search: true,
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
            label: "橱窗图片",
            prop: "windowGoodsFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "资源原价",
            prop: "windowGoodsRealPrice",
            type: "number",
            display: false,
          },
          {
            label: "资源价格",
            prop: "windowGoodsPrice",
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
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            display: false,
          },
        ],
        group: [
          {
            column: [],
          },
        ],
      },
      viewsoption: {
        stripe: true,
        addBtn: false,
        editBtn: false,
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
            label: "资源名称",
            prop: "windowGoodsName",
            display: false,
          },
          {
            label: "资源类型",
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
            label: "橱窗图片",
            prop: "windowGoodsFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "资源原价",
            prop: "windowGoodsRealPrice",
            type: "number",
            display: false,
          },
          {
            label: "资源价格",
            prop: "windowGoodsPrice",
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
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            display: false,
          },
        ],
        group: [
          {
            column: [],
          },
        ],
      },
      windowpage: {
        currentPage: 1, //当前页码
        total: 0, //total
        pageSize: 10, //每页显示多少条
      },
      page: {
        currentPage: 1, //当前页码
        total: 0, //total
        pageSize: 10, //每页显示多少条
      },
      //查询条件
      listQuery: {
        page: 1, //当前页码
        limit: 10, //每页显示多少条
        startTime: "",
        endTime: "",
        fileTitle: "",
      },
      windowsearchForm: [],
      goodPage: {
        currentPage: 1, //当前页码
        total: 0, //total
        pageSize: 10, //每页显示多少条
      },
      goodData: [],
      goodOption: goodOption,
      goodLoading: false,
      //查询条件
      goodQuery: {
        page: 1, //当前页码
        limit: 10, //每页显示多少条
        goodsName: "",
      },
    };
  },
  methods: {
    rowSave(form, done, loading) {
      request({
        url: url.v1.NoticeManage.add,
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
        this.getList(this.listQuery);
      });
    },
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
    closeWindow() {
      (this.windowDialogVisible = false), (this.windowdata = []);
    },
    showWindowDialog(row) {
      let that = this;
      that.row = row;
      that.viewswindowDialogVisible = true;
      request({
        url: url.v1.circle.getListByResourceId,
        data: {
          id: row.id,
        },
      }).then((res) => {
        res.data.list.forEach((element) => {
          if (
            element.windowGoodsFaceImage != null &&
            element.windowGoodsFaceImage != ""
          ) {
            element.windowGoodsFaceImage = element.windowGoodsFaceImage.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
          }
        });
        that.windowdata = res.data.list;
      });
    },

    //请求列表数据
    getList(data) {
      let that = this;
      getNoticeManageList(data).then((res) => {
        that.page.total = res.data.data.total;
        that.tableData = res.data.data.list;
        that.page.pageSize = that.listQuery.limit;
        // that.tableLoading = false;
      });
    },
    windowcurrentChange(val) {
      this.windowpage.currentPage = val;
      this.windowsList();
    },
    // 切换页面时触发该事件
    currentChange(val) {
      this.page.currentPage = val;
      this.listQuery.page = val;
      this.getList(this.listQuery);
    },
    //页面每页显示的条数触发该事件
    windowsizeChange(size) {
      this.windowpage.pageSize = size;
      this.windowsList();
    },
    windowsearchChange(params, done) {
      done();
      this.windowpage.currentPage = 1;
      this.windowpage.pageSize = this.page.pageSize;
      this.windowsearchForm = params;
      this.windowsList();

      this.listQuery.page = val;
      this.getList(this.listQuery);
    },
    //页面每页显示的条数触发该事件
    sizeChange(size) {
      this.listQuery.limit = size;
      this.getList(this.listQuery);
    },
    //点击刷新按钮触发该事件
    refreshChange() {
      this.getList(this.listQuery);
    },
    //调用排序后触发该事件
    sortChange() {},
    //点击搜索后触发该事件
    searchChange(form, done) {
      this.listQuery.fileTitle = form.fileTitle || "";
      this.listQuery.startTime = form.gmtCreate ? form.gmtCreate[0] : "";
      this.listQuery.endTime = form.gmtCreate ? form.gmtCreate[1] : "";
      this.getList(this.listQuery);
      done();
    },
    // 搜索清空
    resetHandle() {
      this.listQuery.fileTitle = "";
      this.listQuery.startTime = "";
      this.listQuery.endTime = "";
      this.getList(this.listQuery);
    },
    windowsList() {
      let that = this;
      var data = {
        pageNum: that.windowpage.currentPage,
        pageSize: that.windowpage.pageSize,
      };
      request({
        url: url.v1.circle.windowList,
        data: { ...data, ...that.windowsearchForm },
        method: "post",
      }).then((res) => {
        that.windowpage.total = res.data.total;
        res.data.list.forEach((element) => {
          if (
            element.windowGoodsFaceImage != null &&
            element.windowGoodsFaceImage != ""
          ) {
            element.windowGoodsFaceImage = element.windowGoodsFaceImage.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
          }
        });
        that.windowdata = res.data.list;
      });
    },
    showAddrDialog(row) {
      this.row = row;
      this.windowsList();
      this.windowDialogVisible = true;
    },
    selectionChange(arr) {
      this.addForm.goodIds = arr.map((item) => item.id);
    },
    windowselectionChange(arr) {
      this.windowsIds = arr.map((item) => item.id).join(",");
    },
    goodRefreshChange() {
      this.getGoodListApi(this.goodQuery);
    },
    goodCurrentChange(val) {
      this.goodQuery.page = val;
      this.getGoodListApi(this.goodQuery);
    },
    goodSizeChange(val) {
      this.goodQuery.limit = val;
      this.getGoodListApi(this.goodQuery);
    },
    goodResetHandle() {
      this.goodQuery.goodsName = "";
      this.getGoodListApi(this.goodQuery);
    },
    goodSearchChange(form, done) {
      this.goodQuery.goodsName = form.goodsName || "";
      this.getGoodListApi(this.goodQuery);
      done();
    },
    beforeUpload(file) {
      let testmsg = file.type.substring(file.type.lastIndexOf("/") + 1);
      let isLt2M = file.size / 1024 / 1024 < 1;
      if (testmsg != "jpg" && testmsg != "jpeg" && testmsg != "png") {
        this.$message({
          message: "上传文件只能是 jpg、jpeg、png格式!",
          type: "warning",
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 1MB!",
          type: "warning",
        });
        return false;
      }
    },
    rowDelViews(form) {
      let that = this;
      let data = {
        id: that.row.id,
        windowId: form.id,
      };
      this.$confirm("此操作将取消关联该橱窗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.circle.deleteWindow,
            method: "POST",
            data: data,
          }).then((res) => {
            request({
              url: url.v1.circle.getListByResourceId,
              data: {
                id: that.row.id,
              },
            }).then((res) => {
              res.data.list.forEach((element) => {
                if (
                  element.windowGoodsFaceImage != null &&
                  element.windowGoodsFaceImage != ""
                ) {
                  element.windowGoodsFaceImage = element.windowGoodsFaceImage.replace(
                    /\?x-image-process=image\/quality,q_80/g,
                    ""
                  );
                }
              });
              that.windowdata = res.data.list;
            });
            that.$message.success(res.message);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.circle.deleteCirleInfo,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.getList(this.listQuery);
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
        url: url.v1.circle.updateCircleInfo,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.getList(this.listQuery);
          done();
        }
      });
    },
  },
  created() {
    this.getList(this.listQuery);
  },
};
</script>

<style scoped>
.flexButtonBox {
  display: flex;
  justify-content: flex-end;
}

.activeOneBox {
  margin-top: 20px;
}
.activeTwoBox {
  margin-top: 20px;
}
.activeOneBox .fontsizeSpan {
  font-size: 12px;
}
</style>

<style>
#goodTable .avue-crud__pagination .el-pagination {
  display: block !important;
}
</style>