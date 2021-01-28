<template>
  <div>
    <basic-container>
      <el-row :gutter="20">
        <span>
          <avue-crud
            ref="crud"
            :data="data"
            :option="option"
            :page.sync="page"
            @row-save="rowSave"
            @search-change="searchChange"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @size-change="sizeChange"
          >
            <template slot="userSex" slot-scope="scope">
              <el-tag>{{sexLabel[scope.row.userSex]}}</el-tag>
            </template>
            <template slot="roomStatus" slot-scope="scope">
              <el-tag>{{statusLabel[scope.row.roomStatus-1]}}</el-tag>
            </template>
            <template slot="status" slot-scope="scope">
              <el-switch name="status" disabled v-model="scope.row.status"></el-switch>
            </template>
            <template slot-scope="scope" slot="menu">
              <el-button type="text" size="small"   v-if="scope.row.isGuid != 0 ?true:false" @click.stop="showAddrDialog(scope.row)">修改地址</el-button>
              <el-button type="text" size="small" @click.stop="viewsAddr(scope.row)">查看地址</el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="generalStreamName(scope.row)"
                :disabled="scope.row.isGuid ==0"
              >添加地址</el-button>
              <el-button type="text" size="small" @click.stop="showFGDialog(scope.row)">设置房管</el-button>
              <el-button type="text" size="small" @click.stop="selectUserByPhone()">设置主播</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.isGuid != 0 ?true:false"
                @click.stop="stop(scope.row.userId)"
              >关闭演播室</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.roomStatus ==4 || scope.row.roomStatus!=2"
                @click.stop="handleSuccuesAuthRoom(scope.row,scope.index)"
              >封停</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.roomStatus !=4 || scope.row.roomStatus ==2"
                @click.stop="handleErrorAuthRoom(scope.row,scope.index)"
              >解封</el-button>
            </template>
          </avue-crud>
          <el-dialog title="添加地址" :visible.sync="blackDialogVisible" width="30%" append-to-body>
            <el-form ref="form" :model="room" label-width="100px">
              <el-form-item label="推流地址">
                <el-input v-model="room.pushAddr" :placeholder="`推流地址`"></el-input>
              </el-form-item>
              <el-form-item label="播流地址">
                <el-input v-model="room.playAddr" :placeholder="`播流地址`"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="confirmToBlack">添加</el-button>
                <el-button @click="blackDialogVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog
            title="修改播流地址"
            :visible.sync="blackAdrrDialogVisible"
            width="30%"
            append-to-body
          >
            <el-form ref="form" :model="room" label-width="100px">
              <el-form-item label="播流地址">
                <el-input v-model="roomAddr.playAddr" :placeholder="`播流地址`"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="confirmAddrToBlack">修改</el-button>
                <el-button @click="blackAdrrDialogVisible=false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog title="添加房管" :visible.sync="blackFGDialogVisible" width="80%" append-to-body>
            <avue-crud
              ref="crud"
              :data="userInfodata"
              :option="userInfoption"
              :page="userInfopage"
              @current-change="userInfocurrentChange"
              @refresh-change="refreshChange"
              @selection-change="userInfoselectionChange"
              @size-change="userInfosizeChange"
              @search-change="userInfosearchChange"
            ></avue-crud>
            <el-button type="primary" @click="confirmFGToBlack">添加</el-button>
            <el-button @click="blackFGDialogVisible=false">取消</el-button>
          </el-dialog>

          <el-dialog title="地址查看" :visible.sync="addrDialogVisible" width="80%" append-to-body>
            <avue-crud ref="crud" :data="addrData" :option="addrOption" :page="addrPage"></avue-crud>
            <el-button @click="addrDialogVisible=false">取消</el-button>
          </el-dialog>
        </span>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "manageList",
  data() {
    const validatePhone = (rule, value, callback) => {
      let str = /^1[0-9]{10}$/;
      if (!str.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    return {
      blackFGDialogVisible: false,
      blackDialogVisible: false,
      blackAdrrDialogVisible: false,
      addrDialogVisible: false,
      addrData: [],
      addrPage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      roomManager: {
        ids: undefined,
        roomId: undefined,
      },
      roomAddr: {
        roomId: undefined,
        pushAddr: undefined,
      },
      room: {
        roomId: undefined,
        pushAddr: undefined,
        playAddr: undefined,
      },
      userInfodata: [],
      deleteId: undefined,
      menuList: [],
      searchForm: {},
      userInfoSearchForm: {},
      data: [],
      query: {
        type: 1,
      },
      statusLabel: ["待直播", "直播中", "已结束", "封禁", "离开"],
      sexLabel: ["女", "男"],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        editBtn: false,
        delBtn: false,
        selection: false,
        stripe: true,
        menuWidth: 350,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "房间ID",
            prop: "id",
            display: false,
            search: true,
          },
          {
            label: "主播昵称",
            prop: "userName",
            display: false,
            search: true,
          },
          {
            label: "主播性别",
            prop: "userSex",
            display: false,
            slot: true,
          },
          {
            label: "房间收入",
            prop: "totalPrice",
            display: false,
          },
          {
            label: "总观看人数",
            prop: "lookCount",
            display: false,
          },
          {
            label: "房间状态",
            prop: "roomStatus",
            type: "select",
            display: false,
            slot: true,
            search: true,
            dicData: [
              {
                label: "待直播",
                value: 1,
              },
              {
                label: "直播中",
                value: 2,
              },
              {
                label: "已结束",
                value: 3,
              },
              {
                label: "封禁",
                value: 4,
              },
              {
                label: "离开",
                value: 5,
              },
            ],
          },
        
          {
            label: "直播分类",
            prop: "liveType",
            type: "select",
            addDisplay: false,
            span: 18,
            search: true,
            dicUrl: url.v1.ttcSysDict.list,
            rules: [
              {
                required: true,
                message: "请选择分类",
                trigger: "change",
              },
            ],
          },
          {
            label: "禁用",
            prop: "status",
            slot: true,
            addDisplay: false,
            width: "80",
          },
          {
            label: "直播时间",
            prop: "startTime",
            addDisplay: false,
            type: "datetime",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            format: "yyyy-MM-dd HH:mm:ss",
            searchRange: true,
            search: true,
          },
        ],
        group: [
          {
            column: [
              {
                label: "电话号码",
                prop: "userPhone",
                rules: [
                  {
                    required: true,
                    message: "请输入用户电话",
                    validator: validatePhone,
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "房间ID",
                prop: "roomId",
                rules: [
                  {
                    required: true,
                    message: "请输入房间Id",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "房间标题",
                prop: "roomName",
                rules: [
                  {
                    required: true,
                    message: "请输入房间标题",
                    trigger: "blur",
                  },
                ],
              },

              {
                label: "直播时间",
                prop: "startTime",
                type: "datetime",
                valueFormat: "yyyy-MM-dd hh:mm:ss",
                format: "yyyy-MM-dd HH:mm:ss",
                searchRange: true,
                rules: [
                  {
                    required: true,
                    message: "请选择直播时间",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "直播分类",
                prop: "liveType",
                type: "select",
                dicUrl: url.v1.ttcSysDict.list,
                rules: [
                  {
                    required: true,
                    message: "请选择分类",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "清晰分类",
                prop: "resolution",
                type: "select",
                dicUrl: url.v1.ttcSysDict.resolutionTypeList,
                rules: [
                  {
                    required: true,
                    message: "请选择分类",
                    trigger: "change",
                  },
                ],
              },
              {
                label: "是否录制",
                prop: "isTranscribe",
                type: "switch",
                slot: true,
                width: "80",
              },
              {
                label: "是否需要导播台",
                prop: "isCreateHuawei",
                type: "switch",
                slot: true,
                width: "80",
              },
              {
                label: "房间封面",
                prop: "roomPic",
                type: "upload",
                span: 24,
                drag: true,
                propsHttp: {
                  res: "data",
                },
                tip: "只能上传jpg/png文件，且不超过500kb",
                action: "os/obs/upload",
                rules: [
                  {
                    required: true,
                    message: "请选择上传图片",
                    trigger: "change",
                  },
                ],
              },
            ],
          },
        ],
      },
      userInfopage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      userInfoption: {
        menu: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "编号",
            prop: "userNo",
            width: "100",
            display: false,
            searchSpan: 4,
          },
          {
            label: "用户名",
            prop: "userName",
            display: false,
            searchSpan: 4,
            search: true,
          },
          {
            label: "姓名",
            prop: "userRealName",
            display: false,
            searchSpan: 4,
            search: true,
          },
        ],
        group: [{}],
      },
      addrOption: {
        menu: false,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            label: "推流地址",
            prop: "pushAddr",
          },
          {
            label: "播流地址",
            prop: "playAddr",
          },
        ],
        group: [{}],
      },
    };
  },
  created() {
    this.roomList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    stop(userId) {
      this.$confirm("此操作将关闭当前数据的导播台 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: url.v1.anchor.stop,
          data: { userId: userId },
          method: "post",
        }).then((res) => {
          this.$message.success(res.message);
        });
      });
    },

    userInfoList() {
      var data = {
        page: this.userInfopage.currentPage,
        limit: this.userInfopage.pageSize,
      };
      request({
        url: url.v1.user.dialogList,
        data: { ...data, ...this.userInfoSearchForm },
      }).then((res) => {
        this.userInfopage.total = res.data.count;
        this.userInfodata = res.data.list;
      });
    },
    confirmFGToBlack() {
      if (this.roomManager.ids.length > 0) {
        this.$confirm("此操作将将所选用户设置为房管, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          //调用
          request({
            url: url.v1.anchor.addRoomManager,
            method: "POST",
            data: { ...this.roomManager },
          }).then((res) => {
            if (res.status == 404) {
              this.$message.error(res.message);
              loading();
            } else {
              this.$message.success(res.message);
              this.page.currentPage = 1;
              this.blackFGDialogVisible = false;
              done();
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要加入的房管",
        });
      }
    },
    viewsAddr(row) {
      //addrData 查询数据库拿出数据库数据
      var data = {
        roomId: row.roomId,
        pageNum: this.addrPage.currentPage,
        pageSize: this.addrPage.pageSize,
      };
      request({
        url: url.v1.anchor.getRoomAddr,
        method: "post",
        data: data,
      }).then((res) => {
        this.addrPage.total = res.data.total;
        res.data.list.forEach(item =>{
            item.pushAddr = decodeURIComponent(item.pushAddr);
            item.playAddr = decodeURIComponent(item.playAddr);
        })
        this.addrData = res.data.list;
      });
      this.addrDialogVisible = true;
    },
    confirmAddrToBlack() {
      this.blackAdrrDialogVisible = false;
      //调用
      request({
        url: url.v1.anchor.updateRoomInfo,
        method: "POST",
        data: this.roomAddr,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          this.roomAddr = {
            roomId: "",
            playAddr: "",
          };
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.roomAddr = {
            roomId: "",
            playAddr: "",
          };
          this.roomList();
          done();
        }
      });
    },
    confirmToBlack() {
      this.blackDialogVisible = false;
      //调用
      request({
        url: url.v1.anchor.editRoomInfo,
        method: "POST",
        data: this.room,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.roomList();
          done();
        }
      });
    },
    generalStreamName(row) {
      request({
        url: url.v1.anchor.generalStreamName,
        method: "POST",
        data: { roomId: row.roomId },
      }).then((res) => {
        if (res.status === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
          return false;
        }
      });
    },
    selectUserByPhone() {
      this.$prompt("请输入用户电话号码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
        inputErrorMessage: "只能输入正确的电话号码",
      })
        .then(({ value }) => {
          request({
            url: url.v1.manager.updatePassword,
            method: "POST",
            data: {
              id: row.id,
              password: value,
            },
          }).then((res) => {
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
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    userInfoselectionChange(list) {
      this.roomManager.ids = list.map((item) => item.id).join(",");
    },
    userInfosearchChange(params, done) {
      this.userInfopage.currentPage = 1;
      this.userInfopage.pageSize = this.userInfopage.pageSize;
      done();
      this.userInfoSearchForm = params;
      this.userInfoList();
    },
    searchChange(params, done) {
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      done();
      this.searchForm = params;
      this.roomList();
    },
    roomList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      let searchData = this.searchForm;
      if (searchData != null && searchData.startTime != undefined) {
        searchData.endTime = searchData.startTime[1];
        searchData.startTime = searchData.startTime[0];
      }
      request({
        url: url.v1.anchor.roomList,
        data: { ...data, ...searchData },
      }).then((res) => {
        this.page.total = res.data.count;
        res.data.list.forEach((element) => {
          element.status = element.status == 1 ? false : true;
        });
        this.data = res.data.list;
      });
    },
    userInfosizeChange(val) {
      this.userInfopage.currentPage = 1;
      this.userInfopage.pageSize = val;
      this.userInfoList();
    },
    userInfocurrentChange(val) {
      this.userInfopage.currentPage = val;
      this.userInfoList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.roomList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.roomList();
    },
    refreshChange() {
      this.roomList();
    },
    rowSave(form, done, loading) {
      form.roomPic = form.roomPic[0].value;
      if (form.isTranscribe == "") {
         form.isTranscribe = 0;
      }
      request({
        url: url.v1.anchor.addRoom,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.roomList();
          done();
        }
      });
    },
    confirmToBlackFG() {},
    showDialog(row) {
      this.room.roomId = row.roomId;
      this.blackDialogVisible = true;
    },
    showAddrDialog(row) {
      this.roomAddr.roomId = row.roomId;
      this.blackAdrrDialogVisible = true;
    },
    showFGDialog(row) {
      this.roomManager.roomId = row.roomId;
      this.blackFGDialogVisible = true;
      this.userInfoList();
    },
    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.roomList();
    },
    uploadBefore(file, done, loading, column) {
      //如果你想修改file文件,由于上传的file是只读文件，必须复制新的file才可以修改名字，完后赋值到done函数里,如果不修改的话直接写done()即可
      var newFile = new File([file], "1234", { type: file.type });
      done(newFile);
      this.$message.success("上传前的方法");
    },
    uploadError(error, column) {
      this.$message.success("上传失败");
    },
    uploadAfter(res, done, loading, column) {
      done();
      this.$message.success("上传后的方法");
    },
    handleSuccuesAuthRoom(row) {
      this.$confirm("此操作将封停该直播间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.anchor.authRoom,
            method: "POST",
            data: {
              id: row.id,
              status: 0,
            },
          }).then((res) => {
            if (res.status === 200) {
              this.$message.success(res.message);
              this.roomList();
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message.info("取消操作");
        });
    },
    handleErrorAuthRoom(row) {
      this.$confirm("此操作将解封该直播间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.anchor.authRoom,
            method: "POST",
            data: {
              id: row.id,
              status: 1,
            },
          }).then((res) => {
            if (res.status === 200) {
              this.$message.success(res.message);
              this.roomList();
            } else {
              this.$message.error(res.message);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message.info("取消操作");
        });
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
