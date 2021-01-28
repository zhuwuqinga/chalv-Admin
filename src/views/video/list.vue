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
        :upload-before="uploadBefore"
        :upload-after="uploadAfter"
      >
        <template slot-scope="{type, size, row}" slot="menu">
          <el-button icon="el-icon-view" :size="size" :type="type" @click="clickView(row)">查看视频</el-button>
        </template>

        <template slot="menuLeft">
          <el-button
            type="primary"
            icon="el-icon-delete"
            size="small"
            @click.stop="handleDel()"
          >批量删除</el-button>
          <el-button type="primary" size="small"  @click.stop="handleAuthSuccess()">批量审核通过</el-button>
          <el-button type="primary" size="small"  @click.stop="handleAuthError()">批量审核拒绝</el-button>
         
        </template>

        <template slot="status" slot-scope="scope">
          <el-switch
            name="status"
            v-model="scope.row.status"
            @change="statusClick(scope.row, scope.$index)"
          ></el-switch>
        </template>
      </avue-crud>

      <el-dialog
        modal-append-to-body
        append-to-body
        title="查看视频"
        :visible.sync="playVisible"
        width="44%"
      >
        <div class="demo">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" size="small" @click.stop="AuthSuccess()">审核通过</el-button>
          <el-button type="primary" size="small" @click.stop="AuthError()">驳回审核</el-button>
          <el-button @click="playVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import { authVideo } from "@/api/video";
import customValid from "@/util/customValidate";
import { dateFormat, getDay } from "@/util/date";
import url from "@/config/url";
export default {
  name: "videoList",
  data() {
    return {
      roleId: 0,
      playVisible: false,
      deleteId: "",
      menuList: [],
      row:"",
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      option: {
        addBtn: false,
        editBtn: false,
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "编号",
            prop: "id",
            width: "80",
            display: false
          },
           {
            label: "审核状态",
            prop: "authStatus",
            searchSpan: 4,
            search: true,
            display: false,
            type: "select",
            dicData: [
              {
                label: "待审核",
                value: 0
              },
              {
                label: "审核通过",
                value: 1
              },
              {
                label: "审核拒绝",
                value: 2
              },
            ],
          },
          {
            label: "封面",
            prop: "coverPath",
            type: "img",
            display: false
          },
          {
            label: "发布用户",
            prop: "userName",
            display: false,
            searchSpan: 4,
            search: true
          },
          {
            label: "标题",
            prop: "videoTitle",
            display: false,
            searchSpan: 4,
            search: true
          },
          {
            label: "分享数",
            prop: "shareCount",
            width: "150",
            sortable: true,
            display: false
          },
          {
            label: "点赞数",
            prop: "giveCount",
            width: "150",
            sortable: true,
            display: false
          },
          {
            label: "播放数",
            prop: "playCount",
            width: "150",
            sortable: true,
            display: false
          },
          {
            label: "评论数",
            prop: "commontCount",
            width: "150",
            sortable: true,
            display: false
          },
          {
            label: "启用",
            prop: "status",
            type: "select",
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
            slot: true,
            width: "80",
            search: true,
            searchSpan: 4,
            display: false
          },
          {
            label: "时间",
            prop: "gmtCreate",
            display: false,
            type: 'datetimerange',
            span:24,
            row:true,
            startPlaceholder: '时间日期开始范围自定义',
            endPlaceholder: '时间日期结束范围自定义',
            valueFormat: "yyyy-MM-dd",
            format:"yyyy-MM-dd HH:mm:ss",
            searchSpan: 8,
            searchRange: true,
            search: true
          }
        ],
        group: [
          {
            column: [
              {
                label: "禁用",
                prop: "status",
                type: "switch"
              },
              {
                label: "登录名",
                prop: "user_name",
                span: 24,
                rules: [
                  { required: true, message: "请输入登录名", trigger: "blur" }
                ]
              },
              {
                label: "登录密码",
                prop: "user_password",
                type: "password",
                editDisplay: false,
                span: 24,
                rules: [
                  { required: true, message: "请输入登录密码", trigger: "blur" }
                ]
              },
              {
                label: "头像",
                prop: "head_img",
                span: 24,
                type: "upload",
                listType: "picture-img",
                action: url.v1.upload.file,
                propsHttp: {
                  res: "data"
                }
              },
              {
                label: "背景图片",
                prop: "background_img",
                span: 24,
                type: "upload",
                listType: "picture-img",
                action: url.v1.upload.file,
                propsHttp: {
                  res: "data"
                }
              },
              {
                label: "姓名",
                span: 24,
                prop: "user_real_name"
              },
              {
                label: "手机号",
                span: 24,
                prop: "user_phone",
                rules: [{ validator: customValid.isMobile, trigger: "blur" }]
              }
            ]
          }
        ]
      },
      playerOptions: {}
    };
  },
  created() {
    this.videoList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    clickView(row) {
      this.playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: row.videoPath //url地址
          }
        ],
        poster: row.coverPath, //你的封面地址
        //width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      };
      this.row = row;
      this.playVisible = true;
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.videoList();
    },
    videoList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      if (
        this.searchForm != undefined &&
        this.searchForm.gmtCreate != undefined
      ) {
        this.searchForm.startTime = this.searchForm.gmtCreate[0];
        this.searchForm.endTime = this.searchForm.gmtCreate[1];
        delete this.searchForm.gmtCreate;
      }
      request({
        url: url.v1.video.list,
        data: { ...data, ...this.searchForm }
      }).then(res => {
        this.page.total = res.data.count;
        this.data = res.data.list;
      });
    },
    sortChange(val) {
      var data = this.searchForm;
      data["sort_name"] = val.prop;
      data["sort_order"] = val.order;
      this.videoList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.videoList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.videoList();
    },
    selectionChange(list) {
      this.deleteId = list.map(item => item.id).join(",");
    },
    refreshChange() {
      this.videoList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.video.edit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.videoList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // const dataTime = dateFormat(new Date(form.gmtCreate));
          // const ThreesTime = getDay(-3);
          // if (dataTime < ThreesTime) {
            request({
              url: url.v1.video.delete,
              method: "POST",
              data: {
                idstr: form.id
              }
            }).then(res => {
              this.$message.success(res.message);
              this.videoList();
            });
          // } else {
          //   this.$message({
          //     type: "info",
          //     message: "只能删除当时时间前三天的数据!"
          //   });
          // }
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
        url: url.v1.video.edit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.videoList();
          done();
        }
      });
    },
    handleDel() {
      let ids = this.deleteId.split(",");
      if (this.deleteId.length > 0 && ids.length <= 10) {
        this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            for (var i = 0; i < this.deleteId.split(",").length; i++) {
              const deleteData = this.data.filter(
                item => item.id == this.deleteId.split(",")[i]
              );
              // const dataTime = dateFormat(new Date(deleteData[0].gmtCreate));
              // const ThreesTime = getDay(-3);
              // if (dataTime >= ThreesTime) {
              //   this.$message({
              //     type: "info",
              //     message: "只能删除三天前的数据! 数据id 为:" + deleteData[0].id
              //   });
              //   return false;
              // }
            }
            request({
              url: url.v1.video.delete,
              method: "POST",
              data: {
                idstr: this.deleteId
              }
            }).then(res => {
              this.$message.success(res.message);
              this.videoList();
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
          message: "请选择需要删除的视频或者选择的数据小于10 条"
        });
      }
    },
    AuthSuccess(){
      this.$confirm("此操作将审核通过当前选择视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            authVideo(this.row.id,1).then(res => {
              this.$message.success(res.data.msg);
              this.videoList();
             this.playVisible =false;
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
    },
    AuthError(){
         this.$confirm("此操作将驳回当前选择视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            authVideo(this.row.id,2).then(res => {
              this.$message.success(res.data.msg);
              this.videoList();
               this.playVisible =false;
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
    },
    handleAuthSuccess(row) {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将审核通过当前选择视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            authVideo(this.deleteId,1).then(res => {
              this.$message.success(res.data.msg);
              this.videoList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要审核的视频"
        });
      }
    },
    handleAuthError() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将驳回当前选择视频, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            authVideo(this.deleteId,2).then(res => {
              this.$message.success(res.data.msg);
              this.videoList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消审核"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要审核的视频"
        });
      }
    },
    statusClick(item) {
      request({
        url: url.v1.video.updateStatus,
        method: "POST",
        data: {
          id: item.id,
          status: item.status === true ? 1 : 0
        }
      }).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.videoList();
    },
    uploadBefore(file, done) {
      done();
    },
    uploadAfter(res, done) {
      done();
    },
    handleEditPassword(row) {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\w){2,20}$/,
        inputErrorMessage: "只能输入2-20个字母、数字、下划线"
      })
        .then(({ value }) => {
          request({
            url: url.v1.video.updatePassword,
            method: "POST",
            data: {
              id: row.id,
              password: value
            }
          }).then(res => {
            if (res.status === 200) {
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message.info("取消输入");
        });
    }
  }
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
