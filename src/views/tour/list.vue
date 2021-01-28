<template>
  <div>
    <basic-container>
      <span>
        <avue-crud
          ref="crud"
          :data="data"
          v-model="crud"
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
          :before-open="beforeOpen"
          :upload-before="uploadBefore"
          :upload-after="uploadAfter"
          :upload-error="uploadError"
        >
          <template slot-scope="scope" slot="videoAddrForm">
            <el-upload
              :http-request="uploadSectionFile"
              :show-file-list="false"
              :action="url"
              :before-upload="beforeUploadVideo"
              class="upload-demo"
            >
              <video
                v-if="videoForm.Video !='' && videoFlag == false"
                :src="videoForm.Video"
                class="avatar"
                width="320"
                height="240"
                style="width= 100%; height=100%; object-fit: fill"
                controls="controls"
              >您的浏览器不支持视频播放</video>
              <i
                v-if="videoForm.Video =='' && videoFlag == false"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
              <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top:30px;"
              ></el-progress>
              <P class="text">请保证视频格式正确，且不超过10M</P>
            </el-upload>
          </template>
          <template slot-scope="scope" slot="status">
            <el-tag>{{scope.row.status == true ?"上架":"下架"}}</el-tag>
          </template>
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="small"
              @click.stop="handleDel()"
            >批量删除</el-button>
          </template>
          <template slot="goodsTypeStatus" slot-scope="scope">
            <el-tag>{{statusLabel[scope.row.goodsTypeStatus]}}</el-tag>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click.stop="setRoute(scope.row)"
            >设置路线</el-button>
          </template>
        </avue-crud>

        <el-dialog
          title="选择路线"
          width="80%"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          append-to-body
          :visible.sync="playVisible"
        >
          <avue-crud
            :data="dataDialog"
            :option="optionDialog"
            :page.sync="pageDiglog"
            @search-change="searchChangeDiglog"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChangeDiglog"
            @size-change="sizeChange"
          >
            <template slot="status" slot-scope="scope">
              <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
            </template>
            <template slot="isHot" slot-scope="scope">
              <el-switch name="isHot" v-model="scope.row.isHot" disabled></el-switch>
            </template>
          </avue-crud>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRouteSummit()">确 定</el-button>
            <el-button @click="playVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
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
      url: "http://localhost:6200/" + url.v1.upload.file,
      videoFlag: false,
      crud: {},
      deleteIdDiag:"",
      goodsTypeName: "",
      statusLabel: ["不可用", "可用"],
      permissions: {},
      TypeTreeList: [],
      searchForm: {},
      videoUploadPercent: 0,
      videoForm: {
        Video: "",
      },
      searchFormDiglog: {},
      dataDialog: [],
      playVisible: false,
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      pageDiglog: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "旅游产品列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "产品名称",
            prop: "name",
            width: "380",
            search: true,
            display: false,
          },
          {
            label: "旅行社",
            prop: "agencyId",
            type: "select",
            dicUrl: url.v1.products.agencyListTree,
            search: true,
            display: false,
          },
          {
            label: "目的地名称",
            prop: "targetPlaceId",
            type: "select",
            dicUrl: url.v1.products.targetPlaceListTree,
            searchLabelWidth: "100",
            // search: true,
            display: false,
          },
          {
            label: "销量",
            prop: "salesVolume",
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            type: "select",
            slot: true,
            dicData: [
              {
                label: "上架",
                value: true,
              },
              {
                label: "下架",
                value: false,
              },
            ],
            display: false,
          },
        ],
        group: [
          {
            label: "基本信息",
            prop: "jbxx",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "产品名称",
                prop: "name",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "请输入产品名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "产品标签",
                prop: "title",
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入产品标签",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "旅行社",
                prop: "agencyId",
                type: "select",
                dicUrl: url.v1.products.agencyListTree,
                rules: [
                  {
                    required: true,
                    message: "请输入旅行社",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "目的地",
                prop: "targetPlaceId",
                type: "select",
                dicUrl: url.v1.products.targetPlaceListTree,
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
                label: "销量",
                prop: "salesVolume",
                row: true,
              },
              {
                label: "状态",
                prop: "status",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "下架",
                    value: false,
                  },
                  {
                    label: "上架",
                    value: true,
                  },
                ],
              },
              {
                label: "爆款",
                prop: "isVogue",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "否",
                    value: false,
                  },
                  {
                    label: "是",
                    value: true,
                  },
                ],
                hide: true,
              },
              {
                label: "推荐",
                prop: "isRecommend",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不推荐",
                    value: false,
                  },
                  {
                    label: "推荐",
                    value: true,
                  },
                ],
                row: true,
                hide: true,
              },
              {
                label: "产品封面图",
                prop: "coverPath",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传产品封面图",
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
                row: true,
              },
              {
                label: "轮播图",
                prop: "forverPath",
                type: "upload",
                listType: "picture-card",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传产品封面图",
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
                row: true,
              },
              {
                label: "视频",
                prop: "videoAddr",
                formslot: true,
              },
            ],
          },
          {
            label: "说明",
            prop: "jbxx",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "说明",
                prop: "remark",
                type: "textarea",
                minRows: 10,
                maxlength: 200,
                span: 18,
                showWordLimit: true,
              },
            ],
          },
        ],
      },
      optionDialog: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menu: false,
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "旅游路线列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "目的地图片",
            prop: "imgUrl",
            type: "img",
            display: false,
          },
          {
            label: "起始地",
            prop: "routeStart",
            search: true,
            display: false,
          },
          {
            label: "目的地",
            prop: "routeFinish",
            search: true,
            display: false,
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
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            slot: true,
            display: false,
          },
          {
            label: "热门",
            prop: "isHot",
            width: "80",
            slot: true,
            display: false,
          },
        ],
      },
    };
  },
  created() {
    this.productsList();
    this.routeList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    beforeOpen(done, type) {
      if (["views", "edit"].includes(type)) {
        // 查看和编辑逻辑
        this.videoForm.Video = this.crud.videpAddr;
      } else {
        //新增逻辑
        //一定要用setTimeout包裹，由于form组件底层一些机制的设计
        setTimeout(() => {
          this.videoForm.Video = "";
        }, 0);
      }
      done();
    },
      beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");

        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    uploadSectionFile(params) {
      let self = this;
      let type = 2;
      let data = new FormData();
      data.append(params.filename, params.file);
      data.append("type", 2);
      self.videoUploadPercent = 0;
      self.videoFlag = true;
      setInterval(() => {
        if (self.videoUploadPercent == 100) {
        } else {
          self.videoUploadPercent += 2;
        }
      }, 50);
      axios
        .post(url.v1.upload.file, data)
        .then(function (res) {
          self.videoFlag = false;
          self.videoUploadPercent = 0;
          if (res.status == 200) {
            self.videoFlag = false;
            self.videoUploadPercent = 0;
            self.videoForm.Video = res.data.data.url;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    handleVideoSuccess(res, file) {
      debugger;
      //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.status == 200) {
        this.videoForm.Video = res.data.data.url;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
    },
    uploadUrl() {},
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");

        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },
    routeList(searchData) {
      var data = {
        page: this.pageDiglog.currentPage,
        status:1,
        limit: this.pageDiglog.pageSize,
      };
      request({
        url: url.v1.products.routeList,
        data: { ...data, ...this.searchFormDiglog },
      }).then((res) => {
        this.pageDiglog.total = res.data.total;

        this.dataDialog = res.data.list;
      });
    },
    setRoute(row) {
      this.row = row;
      this.playVisible = true;
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.productsList();
    },
    searchChangeDiglog(params, done) {
      done();
      this.pageDiglog.currentPage = 1;
      this.pageDiglog.pageSize = this.page.pageSize;
      this.searchFormDiglog = params;
      this.routeList();
    },
    productsList(searchData) {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.products.productsList,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          debugger;
          if (element.coverPath != "" && element.coverPath != null) {
            element.coverPath = element.coverPath.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
          }
          if (element.forverPath != "" && element.forverPath != null) {
            element.forverPath = element.forverPath
              .replace(/!#!/g, ",")
              .replace(/\?x-image-process=image\/quality,q_80/g, "");
          }
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.productsList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.productsList();
    },
    selectionChangeDiglog(list){
       this.deleteIdDiag = list;

    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.productsList();
    },
    rowSave(form, done, loading) {
      form.agencyName = form.$agencyId;
      form.targetPlaceName = form.$targetPlaceId;
      delete form.$agencyId;
      delete form.$targetPlaceId;
      if (form.isRecommend != undefined || form.isRecommend != "") {
        form.isRecommend = 0;
      }
      if (form.status != undefined || form.status != "") {
        form.status = 0;
      }
      if (form.isVogue != undefined || form.isVogue != "") {
        form.isVogue = 0;
      }
      let imageUrl = "";
      form.videpAddr = this.videoForm.Video;
      for (let index = 0; index < form.forverPath.length; index++) {
        const element = form.forverPath[index];
        imageUrl = imageUrl === "" ? "" : imageUrl + "!#!";
        imageUrl =
          imageUrl + element.value + "?x-image-process=image/quality,q_80";
      }
      form.forverPath = imageUrl;
      form.coverPath = form.coverPath + "?x-image-process=image/quality,q_80";
      debugger;
      request({
        url: url.v1.products.addProducts,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.productsList();
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
            url: url.v1.products.deleteProduct,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.productsList();
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
      form.videpAddr = this.videoForm.Video;
      form.forverPath = form.forverPath.replace(
        /,/g,
        "?x-image-process=image/quality,q_80!#!"
      );
      form.coverPath = form.coverPath + "?x-image-process=image/quality,q_80";
      request({
        url: url.v1.products.updateProducts,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.productsList();
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
              url: url.v1.products.deleteProduct,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.productsList();
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
          message: "请选择需要删除的数据",
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
    setRouteSummit(){
      let that = this;
      debugger
      if(that.deleteIdDiag.length > 0 && that.deleteIdDiag.length <=1){
         request({
              url: url.v1.products.setRoute,
              method: "POST",
              data: {
                routerId: that.deleteIdDiag[0].id,
                id: that.row.id,
              },
            }).then((res) => {
              that.$message.success(res.message);
              that.playVisible = false,
              that.productsList();
            });
      } else {
        that.$message({
          type: "warning",
          message: "请选择一条数据",
        });
      }
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
      this.productsList();
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

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
