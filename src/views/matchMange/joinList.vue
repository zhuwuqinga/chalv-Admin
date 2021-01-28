<template>
  <div>
      
      <basic-container>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="参赛队伍" name="first">
                <span>
                    <avue-crud
                    ref="crud"
                    :data="data"
                    :option="option"
                    :page.sync="page"
                    @row-save="rowSave"
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
                    <!--列表按钮自定义--->
                    <template slot-scope="scope" slot="menu">
                      <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="rowUpdate(scope.row)"
                      >编辑</el-button>
                        <!-- <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="toParticipate(scope.row)"
                        >查看详情</el-button> -->
                        <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="promotion(scope.row)"
                        >晋级</el-button
                        >
                        <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="degrade(scope.row)"
                        >降级</el-button>
                      <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="rowTicket(scope.row)"
                      >增加虚拟票数</el-button>
                      <el-button
                        type="text"
                        size="small"
                        icon="el-icon-setting"
                        @click.stop="weekStat(scope.row)"
                      >周投票统计</el-button>
                    </template>

                    <template slot-scope="scope" slot="proUrlForm">
                        <el-upload
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :action="url"
                        :before-upload="beforeUploadvideo"
                        class="upload-demo"
                        >
                        <video
                            v-if="videoForm.video != '' && videoFlag == false"
                            :src="videoForm.video"
                            class="avatar2"
                            width="320"
                            height="240"
                            style="width=100%;height=100%;object-fit:fill"
                            controls="controls"
                        >
                            您的浏览器不支持视频播放
                        </video>
                        <i
                            v-if="videoForm.video == '' && videoFlag == false"
                            class="el-icon-plus avatar-uploader-icon"
                        ></i>
                        <el-progress
                            v-if="videoFlag == true"
                            type="circle"
                            :percentage="videoUploadPercent"
                            style="margin-top: 30px"
                        ></el-progress>
                        <P class="text">点击按钮上传(请保证视频格式正确，且不超过100M)</P>
                        </el-upload>
                    </template>

                    <template slot-scope="scope" slot="summaryForm">
                        <avue-ueditor
                        v-model="summaryTxt"
                        :options="ueditorOptions"
                        ></avue-ueditor>
                    </template>

                    <template slot-scope="scope" slot="memberListForm">
                        <div>
                        <el-row
                            :span="24"
                            :gutter="20"
                            v-for="item in legTime"
                            :key="item.index"
                            class="leg_left"
                        >
                            <el-col :span="4">
                            <el-select v-model="item.role" placeholder="请选择" @change="changeRole(item.role, scope)">
                                <el-option
                                v-for="itemR in roleOptions"
                                :key="itemR.value"
                                :label="itemR.label"
                                :value="itemR.value"
                                >
                                </el-option>
                            </el-select>
                            </el-col>
                            <el-col :span="4">
                            <avue-input
                                v-model="item.memberName"
                                placeholder="请输入姓名"
                            ></avue-input>
                            </el-col>
                            <el-col :span="4">
                            <el-input
                                v-model="item.age"
                                :maxlength="3"
                                placeholder="请输入年龄"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                            ></el-input>
                            </el-col>
                            <el-col :span="4">
                            <el-input
                                v-model="item.phone"
                                :maxlength="11"
                                placeholder="请输入电话"
                                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                            ></el-input>
                            </el-col>
                            <el-button
                            type="warning"
                            icon="el-icon-delete"
                            size="small"
                            plain
                            @click.stop="handleLegDel()"
                            v-if="item.delbtn"
                            >删除</el-button
                            >
                        </el-row>
                        <el-button
                            type="primary"
                            icon="el-icon-plus"
                            size="small"
                            plain
                            @click.stop="handleLegAdd()"
                            >新增</el-button
                        >
                        </div>
                    </template>

                    <template slot-scope="scope" slot="cityIdForm">
                        <div>
                          <el-row :span="24" :gutter="20">
                              <el-col :span="6">
                              <el-select
                                  v-model="value"
                                  placeholder="请选择赛区"
                                  @change="changeUrban(value)"
                              >
                                  <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  >
                                  </el-option>
                              </el-select>
                              </el-col>
                          </el-row>
                        </div>
                    </template>

                    <template slot-scope="scope" slot="sectionIdForm">
                        <div>
                        <el-row :span="24" :gutter="20">
                            <el-col :span="6">
                            海选报名 
                            </el-col>
                        </el-row>
                        </div>
                    </template>

                    </avue-crud>
                </span>
            </el-tab-pane>
            <el-tab-pane label="待审核队伍" name="second">
                <span>
                    <avue-crud
                    ref="crud"
                    :data="dataStay"
                    :option="option2"
                    :page.sync="page2"
                    @search-change="searchChange2"
                    @current-change="currentChange2"
                    @refresh-change="refreshChange2"
                    @selection-change="selectionChange2"
                    @size-change="sizeChange2"
                    :upload-before="uploadBefore"
                    :upload-after="uploadAfter"
                    :upload-error="uploadError"
                    >
                    <!--列表按钮自定义--->
                      <template slot-scope="scope" slot="menu">
                          <!-- <el-button
                          type="text"
                          size="small"
                          icon="el-icon-setting"
                          @click.stop="toParticipate(scope.row)"
                          >查看详情</el-button
                          > -->
                          <el-button
                            type="text"
                            size="small"
                            icon="el-icon-setting"
                            @click.stop="rowUpdate(scope.row)"
                          >编辑</el-button>
                          <el-button
                          type="text"
                          size="small"
                          icon="el-icon-setting"
                          @click.stop="whetherInspect(scope.row,2)"
                          >同意</el-button
                          >
                          <el-button
                          type="text"
                          size="small"
                          icon="el-icon-setting"
                          @click.stop="whetherInspect(scope.row,1)"
                          >拒绝</el-button>
                      </template>
                    </avue-crud>
                </span>
            </el-tab-pane>
        </el-tabs>

        <el-dialog
          title="增加虚拟票数"
          :visible.sync="dialogVisible"
          width="30%">
            <el-form ref="form" :model="formTicket" label-width="100px">
              <el-form-item label="队伍ID：">
                <span>{{formTicket.teamId}}</span>
              </el-form-item>
              <el-form-item label="队伍名称：">
                <span>{{formTicket.name}}</span>
              </el-form-item>
              <el-form-item label="票数：">
                <el-input v-model="formTicket.ticket" style="width:180px" size="small" :maxlength="7" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
              </el-form-item>
            </el-form>
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="submitFormTicket()" size="small" >确 定</el-button>
        </el-dialog>

        <el-dialog
          title="周票数统计"
          :visible.sync="dialogVisible3"
          width="30%">
            <el-table
              :data="weekStatList"
              style="width: 100%">
              <el-table-column
                align="center"
                prop="weekNum"
                label="周数">
              </el-table-column>
              <el-table-column
                align="center"
                prop="startDate"
                label="开始日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="endDate"
                label="结束日期">
              </el-table-column>
              <el-table-column
                align="center"
                prop="ticket"
                label="实际投票">
              </el-table-column>
              <el-table-column
                align="center"
                prop="virtualWeekTicket"
                label="虚拟票数">
              </el-table-column>
            </el-table>
            <el-button @click="dialogVisible3 = false" size="small" style="margin-top:10px">取 消</el-button>
        </el-dialog>
        
      <el-dialog
        title="编辑"
        :visible.sync="dialogVisible2"
        width="60%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="队伍名称" prop="teamName">
            <el-input v-model="ruleForm.teamName" placeholder="请填写队伍名称" style="width:200px" size="small"></el-input>
          </el-form-item>
          <el-form-item label="赛区" prop="cityId">
            <el-select
                v-model="value"
                placeholder="请选择赛区"
                @change="changeUrban(value)"
                size="small"
            >
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前赛段" prop="sectionId">
            <el-select
                v-model="ruleForm.SectionList"
                placeholder="请选择赛段"
                @change="changeUrban2(ruleForm.SectionList)"
                size="small"
                disabled
            >
                <el-option
                v-for="item in SectionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作品封面" prop="pic">
            <el-upload
              :http-request="uploadSectionFilePic"
              :show-file-list="false"
              :action="url"
              class="upload-demo"
            >
              <img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="作品" prop="proUrl">
            <el-upload
              :http-request="uploadSectionFile"
              :show-file-list="false"
              :action="url"
              :before-upload="beforeUploadvideo"
              class="upload-demo"
            >
            <video
                v-if="videoForm.video != '' && videoFlag == false"
                :src="videoForm.video"
                width="320"
                height="240"
                style="width=100%;height=100%;object-fit:fill"
                controls="controls"
            >
                您的浏览器不支持视频播放
            </video>
            <i
                v-if="videoForm.video == '' && videoFlag == false"
                class="el-icon-plus avatar-uploader-icon"
            ></i>
            <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top: 30px"
            ></el-progress>
            <P class="text">点击按钮上传(请保证视频格式正确，且不超过100M)</P>
            </el-upload>
          </el-form-item>
          <el-form-item label="队伍成员" prop="memberList">
            <div>
              <el-row
                  :span="24"
                  :gutter="20"
                  v-for="item in legTime"
                  :key="item.index"
                  class="leg_left"
              >
                  <el-col :span="4">
                  <el-select v-model="item.role" size="small" placeholder="请选择" @change="changeRole2(item.role)">
                      <el-option
                        v-for="itemRole in roleOptions"
                        :key="itemRole.value"
                        :label="itemRole.label"
                        :value="itemRole.value"
                      >
                      </el-option>
                  </el-select>
                  </el-col>
                  <el-col :span="4">
                  <avue-input
                      v-model="item.memberName"
                      placeholder="请输入姓名"
                      size="small"
                  ></avue-input>
                  </el-col>
                  <el-col :span="4">
                  <el-input
                      v-model="item.age"
                      :maxlength="3"
                      placeholder="请输入年龄"
                      onkeyup="value=value.replace(/[^\d\.]/g,'')"
                      size="small"
                  ></el-input>
                  </el-col>
                  <el-col :span="4">
                  <el-input
                      v-model="item.phone"
                      :maxlength="11"
                      placeholder="请输入电话"
                      onkeyup="value=value.replace(/[^\d\.]/g,'')"
                      size="small"
                  ></el-input>
                  </el-col>
                  <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="small"
                  plain
                  @click.stop="handleLegDel()"
                  v-if="item.delbtn"
                  >删除</el-button
                  >
              </el-row>
              <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  plain
                  @click.stop="handleLegAdd()"
                  >新增</el-button
              >
              </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存编辑</el-button>
            <el-button size="small" @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
     </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import { log } from "util";
export default {
  name: "joinList",
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      weekStatList:[],
      action2:url.v1.upload.file,
      ruleForm: {
        teamName: '',
        cityId:'',
        sectionId:'',
        pic:'',
        proUrl:'',
        memberList:'',
        SectionList:''
      },
      rules: {
        teamName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        cityId: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        sectionId: [
          { required: true, message: '请选择', trigger: 'blur' },
        ],
        pic: [
          { required: true, message: '请上传', trigger: 'blur' },
        ],
        proUrl: [
          { required: true, message: '请上传', trigger: 'blur' },
        ],
        memberList: [
          { required: true, message: '请填写', trigger: 'blur' },
        ],
      },
      formTicket:{},
      activeName: 'first',
      summaryTxt: "",
      legTxt: "",
      form: "海选报名阶段",
      legTime: [
        {
          memberName:'',
          phone:'',
          age:'',
          role:'',
          delbtn: false,
        },
      ],
      roleOptions: [
        {
          value: "1",
          label: "队员",
        },
        {
          value: "2",
          label: "队长",
        },
      ],
      SectionList:[],
      options: [], //市
      value: "",
      checkedCities: [],
      cities: [], //区
      urbanTags: [],
      role: "",
      deleteId: "",
      permissions: {},
      searchForm: {},
      data: [],
      dataStay:[],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      page2: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      url: "http://localhost:6200/" + url.v1.upload.file,
      videoUploadPercent: 0,
      videoFlag: false,
      videoForm: {
        video: "",
        videoImg: "",
      },
      ueditorOptions: {
        action: url.v1.upload.file80,
        customConfig: {}, //wangEditor编辑的配置
        props: {
          res: "data",
          url: "url",
        },
      },
      option: {
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        disabled:false,
        editBtn:false,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "队伍ID",
            prop: "id",
            display: false,
            search: true,
          },
          {
            label: "队伍名称",
            prop: "teamName",
            display: false,
            search: true,
          },
          {
            label: "报名方式",
            prop: "applyType",
            display: false,
            search: true,
            dicData: [
              {
                label: "线上",
                value: 1,
              },
              {
                label: "线下",
                value: 2,
              },
            ],
          },
          {
            label: "赛事名称",
            prop: "matchTitle",
            display: false,
          },
          {
            label: "报名时间",
            prop: "createDate",
            display: false,
            search: true,
            type: "datetimerange",
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            searchRange: true,
          },
          {
            label: "负责人电话",
            prop: "phone",
            display: false,
          },
          {
            label: "赛区",
            prop: "cityId",
            display: false,
            search: true,
            type: "select",
            dicUrl: url.v1.match.getMatchAreaList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "赛制阶段",
            prop: "sectionId",
            display: false,
            search: true,
            type: "select",
            dicUrl: url.v1.match.getMatchSectionList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "作品封面",
            prop: "pic",
            type: "upload",
            listType: "picture-img",
            propsHttp: {
              res: "data",
            },
            rules: [
              {
                required: true,
                message: "请上传图片",
                trigger: "blur",
              },
            ],
            action: url.v1.upload.file,
            display: false,
          },
          {
            label: "本周得票数",
            prop: "weekTicket",
            display: false,
          },
          {
            label: "总得票数",
            prop: "totalTicket",
            display: false,
          },
          {
            label: "虚拟票数",
            prop: "virtualTicket",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "队伍名称",
                prop: "teamName",
                rules: [
                  {
                    required: true,
                    message: "请输入名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "赛区",
                prop: "cityId",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
                // rules: [
                //   {
                //     required: true,
                //     message: "请输入",
                //     trigger: "blur",
                //   },
                // ],
              },
              {
                label: "当前赛段",
                prop: "sectionId",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
              },
              {
                label: "作品封面",
                prop: "pic",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传作品封面",
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
              {
                label: "作品",
                prop: "proUrl",
                formslot: true,
                showColumn: false,
                viewDisplay: false,
              },
              {
                label: "队伍成员",
                prop: "memberList",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
                // rules: [
                //   {
                //     required: true,
                //     message: "请输入队员",
                //     trigger: "blur",
                //   },
                // ],
              },
            //   {
            //     label: "周奖金配置",
            //     prop: "weekPrize",
            //     formslot: true,
            //     showColumn: false,
            //     span: 24,
            //     viewDisplay: false,
            //   },
            ],
          },
        ],
      },
      
      option2: {
        menuWidth: 300,
        editBtn: false,
        addBtn:false,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "队伍ID",
            prop: "id",
            display: false,
            search: true,
          },
          {
            label: "队伍名称",
            prop: "teamName",
            display: false,
            search: true,
          },
          {
            label: "赛事名称",
            prop: "matchTitle",
            display: false,
          },
          {
            label: "报名时间",
            prop: "createDate",
            display: false,
            search: true,
            type: "datetimerange",
            startPlaceholder: "开始时间",
            endPlaceholder: "结束时间",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            searchRange: true,
          },
          {
            label: "负责人电话",
            prop: "phone",
            display: false,
          },
          {
            label: "赛区",
            prop: "cityId",
            display: false,
            search: true,
            type: "select",
            dicUrl: url.v1.match.getMatchAreaList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "赛制阶段",
            prop: "sectionId",
            display: false,
            search: true,
            type: "select",
            dicUrl: url.v1.match.getMatchSectionList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "作品封面",
            prop: "pic",
            type: "upload",
            listType: "picture-img",
            propsHttp: {
              res: "data",
            },
            rules: [
              {
                required: true,
                message: "请上传图片",
                trigger: "blur",
              },
            ],
            action: url.v1.upload.file,
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "队伍名称",
                prop: "teamName",
                rules: [
                  {
                    required: true,
                    message: "请输入名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "赛区",
                prop: "cityId",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
                // rules: [
                //   {
                //     required: true,
                //     message: "请输入",
                //     trigger: "blur",
                //   },
                // ],
              },
              {
                label: "当前赛段",
                prop: "sectionId",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
              },
              {
                label: "封面图片",
                prop: "pic",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传封面图片",
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
              {
                label: "视频",
                prop: "proUrl",
                formslot: true,
                showColumn: false,
                viewDisplay: false,
              },
              {
                label: "队伍成员",
                prop: "memberList",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
                // rules: [
                //   {
                //     required: true,
                //     message: "请输入队员",
                //     trigger: "blur",
                //   },
                // ],
              },
            //   {
            //     label: "周奖金配置",
            //     prop: "weekPrize",
            //     formslot: true,
            //     showColumn: false,
            //     span: 24,
            //     viewDisplay: false,
            //   },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.matchId = this.$route.query.id;
    this.supplierList();
    this.unreviewedList();
    this.getUrban();
    this.getMatchSectionList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {

    handleClick(tab, event) {//切换
        // console.log(tab, event);
    },

    handleLegAdd() {
      this.legTime.push({
        memberName:'',
        phone:'',
        age:'',
        role:'',
        delbtn: true,
      });
    },

    handlePrizeAdd() {
      this.weekPrize.push({
        id: this.weekPrize.length + 1,
        prize: "",
        delbtn: true,
      });
    },

    handleLegDel() {
      this.legTime.splice(-1, 1);
    },

    handlePrizeDel() {
      this.weekPrize.splice(-1, 1);
    },

    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.supplierList();
    },

    searchChange2(params, done) {
      done();
      this.page2.currentPage = 1;
      this.page2.pageSize = this.page2.pageSize;
      this.searchForm = params;
      this.unreviewedList();
    },

    supplierList(searchData) {
      var data = {
        matchId: this.matchId,
        page: this.page.currentPage,
        limit: this.page.pageSize,
        cityId: this.cityName
      };
      request({
        url: url.v1.match.getMatchTeamList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },

    unreviewedList(){//带参赛列表查询
      var data = {
        matchId: this.matchId,
        page: this.page2.currentPage,
        limit: this.page2.pageSize,
      };
      request({
        url: url.v1.match.unreviewedList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page2.total = res.data.total;
        this.dataStay = res.data.list;
      });
    },

    whetherInspect(row,type){
        var data = {
            id: row.id,
            status:type,
        };
        if(type == 2){
            this.$confirm('是否同意？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                
                request({
                    url: url.v1.match.whetherInspect,
                    method: "post",
                    data: { ...data, ...this.searchForm },
                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '已同意'
                    });
                    this.unreviewedList();
                    this.supplierList();
                });
            });
        }else{
            this.$confirm('是否拒绝？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                
                request({
                    url: url.v1.match.whetherInspect,
                    method: "post",
                    data: { ...data, ...this.searchForm },
                }).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '已拒绝'
                    });
                    this.unreviewedList();
                    this.supplierList();
                });
            });
        }
    },

    getUrban() {//赛区下拉列表
      var data = {
        id: this.matchId,
      };
      request({
        url: url.v1.match.getMatchAreaList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
          this.options = res.data;
      });
    },
    changeUrban(val){
        this.cityId = val;
    },

    getMatchSectionList() {//赛段下拉列表
      var data = {
        id: this.matchId,
      };
      request({
        url: url.v1.match.getMatchSectionList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
          this.SectionList = res.data;
      });
    },
    changeUrban2(val){
        this.cityId = val;
    },

    
    uploadSectionFilePic(params) {
      let self = this;
      let type = 1;
      let data = new FormData();
      data.append(params.filename, params.file);
      data.append("type", 1);
      axios
        .post(url.v1.upload.file, data)
        .then(function (res) {
          if (res.status == 200) {
            self.ruleForm.pic = res.data.data.url;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },

    changeRole(value,ind){
        // console.log(value,"value");
    },
    changeRole2(value,ind){
        // console.log(value,"value");
    },

    toParticipate(row) {
      this.$router.push({
        path: "/joinList",
        query: { id: row.id },
      });
    },

    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.supplierList();
    },

    sizeChange2(val) {
      this.page2.currentPage = 1;
      this.page2.pageSize = val;
      this.unreviewedList();
    },

    currentChange(val) {
      this.page.currentPage = val;
      this.supplierList();
    },

    currentChange2(val) {
      this.page2.currentPage = val;
      this.unreviewedList();
    },

    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },

    selectionChange2(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },

    refreshChange() {
      this.supplierList();
    },

    refreshChange2() {
      this.unreviewedList();
    },

    promotion(form){
      this.$confirm("确定晋级?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.match.promotion,
            method: "POST",
            data: {
              id: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.unreviewedList();
            this.supplierList();
          });
        })
    },

    degrade(form){
      this.$confirm("确定降级?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.match.degrade,
            method: "POST",
            data: {
              id: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.unreviewedList();
            this.supplierList();
          });
        })
    },
    
    handleAvatarSuccess2(res, file) {
      this.ruleForm.pic = URL.createObjectURL(file.raw);
    },

    rowSave(form, done, loading) {
      const _this = this;
      form.matchId = _this.matchId;
      form.video = _this.video;
      form.summary = _this.summaryTxt;
      form.memberList = _this.legTime;
      form.cityId = _this.cityId;
      form.proUrl = _this.videoForm.video
      request({
        url: url.v1.match.getMatchAddTeam,
        method: "POST",
        data: form,
        type: "noPost",
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          // loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.supplierList();
          done();
        }
      });
    },
    
    rowUpdate(row) {//编辑回显
      this.dialogVisible2 = true;
      request({
        url: url.v1.match.getDetail,
        method: "POST",
        data: {id:row.id},
      }).then((res) => {
        this.ruleForm.id = res.data.id;
        this.ruleForm.teamName = res.data.teamName;
        this.value = res.data.cityId;
        this.ruleForm.SectionList = res.data.sectionId;
        this.ruleForm.pic = res.data.pic;
        this.videoForm.video = res.data.proUrl;
        this.legTime = res.data.memberList;
        this.legTime.map((item) =>{
          item.role = item.role + "";
          if(item.role>=2){
            item.delbtn = true
          }
        })
      });
    },

    weekStat(row){
      this.dialogVisible3 = true;
      request({
        url: url.v1.match.getDetail,
        method: "POST",
        data: {id:row.id},
      }).then((res) => {
        this.weekStatList = res.data.weekTicketList;
      });
    },

    rowTicket(row){
      this.dialogVisible = true;
      this.formTicket = {
        teamId:row.id,
        name:row.teamName,
      }
    },
    submitFormTicket(){//虚拟票增加
      this.formTicket = {
        teamId:this.formTicket.teamId,
        name:this.formTicket.name,
        ticket:this.formTicket.ticket
      }
      request({
        url: url.v1.match.increaseTicket,
        method: "POST",
        data: this.formTicket,
        type: "noPost"
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.message);
          this.dialogVisible = false;
          this.supplierList();
        } else {
          this.$message.error(res.message);

        }
      });
    },

    submitForm(){
      this.ruleForm.proUrl = this.videoForm.video;
      this.ruleForm.memberList = this.legTime;
      this.ruleForm.cityId = this.value;
      this.ruleForm.sectionId = this.ruleForm.SectionList;
      request({
        url: url.v1.match.updateTeam,
        method: "POST",
        data: this.ruleForm,
        type: "noPost"
      }).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.message);
          this.supplierList();
          this.dialogVisible2 = false;
        } else {
          this.$message.error(res.message);

        }
      });
    },
    resetForm(formName) {
      this.dialogVisible2 = false;
    },

    rowDel(form) {
      this.$confirm("此操作将删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.match.matchDelete,
            method: "POST",
            data: {
              id: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.unreviewedList();
            this.supplierList();
          });
        })
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
            self.videoForm.video = res.data.data.url;
            self.videoForm.videoImg = res.data.data.coverUrl;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },

    beforeUploadvideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 100;
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
        this.$message.error("上传视频大小不能超过100MB哦!");
        return false;
      }
    },

    // nodeClick(data) {
    //   this.goodsTypeName = data.label;
    //   this.page.currentPage = 1;
    //   this.supplierList();
    // },
    // nodeClick(data) {
    //   this.goodsTypeName = data.label;
    //   this.page.currentPage = 1;
    //   this.supplierList();
    // },
  },
};
</script>

<style>
.avue-crud {
  background: #fff;
  padding-top: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload {
  text-align: left;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
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
.leg_left:first-child .el-col:first-child {
  margin-left: -10px;
}
.v-modal{
  background: transparent;
  z-index: 0;
}
.el-dialog__footer{
  text-align: left;
}
.el-dialog__body {
    padding:30px 20px;
}
.avatar2 {
  width: 400px;

  display: block;
}
</style>
