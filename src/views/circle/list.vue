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
        <template slot="isTop" slot-scope="scope">
          <el-switch name="isTop" v-model="scope.row.isTop" @change="setIsTop(scope.row)"></el-switch>
        </template>

        <template slot="status" slot-scope="scope">
          <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
        </template>

        <template slot="authStatus" slot-scope="scope">
          <el-tag>{{authStatusLabel[scope.row.authStatus]}}</el-tag>
        </template>

        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            :disabled="scope.row.authStatus!=0"
            @click.stop="auth(scope.row.id,1)"
          >审核通过</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            :disabled="scope.row.authStatus!=0"
            @click.stop="auth(scope.row.id,2)"
          >驳回审核</el-button>
          <el-button type="text" size="small" icon="el-icon-view" @click="clickView(scope.row)">查看详情</el-button>
        </template>
      </avue-crud>

      <el-dialog
        title="查看详情"
        append-to-body
        modal-append-to-body
        :visible.sync="playVisible"
        width="44%"
      >
        标题:
        <h4 style="margin-left: 20px;">{{this.titile}}</h4>内容：
        <p style="margin-left: 20px;">
          <span>{{this.fileContent}}</span>
        </p>
        <div style="z-index:100000;">
          <viewer :images="photo">
            <img height="200" width="200" v-for="(src,index) in photo" :src="src" :key="index" />
          </viewer>
        </div>
        <div class="demo" v-if="row.isVideo == 1">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          ></video-player>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" icon="el-icon-edit"   v-if="row.authStatus==0"  @click.stop="auth(row.id,1)">审核通过</el-button>
          <el-button type="primary" size="small" @click.stop="auth(row.id,2)" v-if="row.authStatus==0" >驳回审核</el-button>
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
import configObj from "@/../vue.config.js";
export default {
  name: "circle",

  data() {
    return {
      roleId: 0,
      menuList: [],
      authStatusLabel: ["待审核", "审核通过", "驳回审核"],
      playVisible: false,
      searchForm: {},
      position: 0,
      photo: {},
      titile: "",
      fileContent: "",
      row: "",
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        menuWidth: 350,
        border: true,
        addBtn: false,
        editBtn: false,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "标题",
            prop: "fileTitle",
            display: true,
            width: 300,
            search: true,
            searchSpan: 8,
          },
          {
            label: "用户名称",
            prop: "userName",
            search: true,
            searchSpan: 8,
            display: true,
          },
          {
            label: "手机号码",
            prop: "userPhone",
            search: true,
            display: true,
            searchSpan: 8,
            hide: true,
          },
          {
            label: "发布时间",
            prop: "gmtCreate",
            type: "datetimerange",
            searchRange: true,
            searchSpan: 10,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            format: "yyyy-MM-dd HH:mm:ss",
            startPlaceholder: "时间日期开始范围自定义",
            endPlaceholder: "时间日期结束范围自定义",
            display: true,
            search: true,
          },
          {
            label: "是否置顶",
            prop: "isTop",
            slot: true,
            display: true,
          },
          {
            label: "栏目类型",
            prop: "tourType",
            type: "select",
            dicUrl: url.v1.circle.specialListTree,
            searchSpan: 8,
            props: {
              label: "label",
              value: "value",
            },
            display: true,
            search: true,
          },
          {
            label: "浏览量",
            prop: "playCount",
            sortable: true, //排序
            display: true,
          },
          {
            label: "点赞量",
            prop: "giveCount",
            sortable: true, //排序
            display: true,
          },
          {
            label: "收藏量",
            prop: "collectCount",
            sortable: true, //排序
            display: true,
          },

          {
            label: "评论量",
            prop: "shareCount",
            sortable: true, //排序
            display: true,
          },
          {
            label: "状态",
            prop: "status",
            type: "select",
            slot: true,
            display: true,
          },
          {
            label: "审核状态",
            prop: "authStatus",
            type: "select",
            search: true,
            dicData:[
              {
                label:'待审核',
                value:0  
              },
               {
                label:'审核通过',
                value:1 
              },
               {
                label:'驳回审核',
                value:2 
              },
              ],
            slot: true,
          },
        ],
        group: [
          {
            column: [],
          },
        ],
      },
      playerOptions: {},
    };
  },
  created() {
    this.circleList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    clickView(row) {
      this.row = row;
      this.photo = row.fcoverAddr != "" ? row.fcoverAddr.split("!#!") : [];
      this.titile = row.fileTitle;
      this.fileContent = row.fileContent;
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
            src: row.videoAddr, //url地址
          },
        ],
        poster: row.fcoverAddr, //你的封面地址
        //width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      };

      this.playVisible = true;
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      //时间处理
      if (params != undefined && params.gmtCreate != undefined) {
        let time = params.gmtCreate;
        params.startTime = time[0];
        params.endTime = time[1];
        delete params.gmtCreate;
      }
      this.searchForm = params;
      this.circleList();
    },
    circleList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.circle.circleList,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          element.isTop = element.isTop == 1 ? true : false;
        });
        this.data = res.data.list;
      });
    },
    sortChange(val) {
      var data = this.searchForm;
      data["sort_name"] = val.prop;
      data["sort_order"] = val.order;
      this.circleList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.circleList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.circleList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.circleList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.market.addSpeValue,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.circleList();
          done();
        }
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
            url: url.v1.circle.deleteCircleInfo,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.circleList();
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
        url: url.v1.market.updateSpeValue,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.circleList();
          done();
        }
      });
    },
    auth(id, status) {
      this.$confirm("此操作将审核当前选择视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          debugger
          request({
            url: url.v1.circle.authTourCircleInfo,
            method: "POST",
            data: {
              id: id,
              authStatus: status,
            },
          }).then((res) => {
            if (res.status == 404) {
              this.$message.error(res.message);
              loading();
            } else {
              this.$message.success(res.message);
              this.circleList();
              this.playVisible = false;
              done();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消审核",
          });
        });
    },
    setIsTop(row) {
      let str = "取消";
      let data = {
        id: row.id,
        status: row.isTop === true ? 1 : 0,
      };
      if (row.isTop) {
        str = "设置";
      }
      this.$confirm("此操作将" + str + "当前数据的置顶, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.circle.setIsTop,
            method: "POST",
            data: data,
          }).then((res) => {
            if (res.status == 404) {
              this.$message.error(res.message);
              loading();
            } else {
              this.$message.success(res.message);
              this.circleList();
              done();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
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
