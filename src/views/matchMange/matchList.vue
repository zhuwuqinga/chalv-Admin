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
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click.stop="toParticipate(scope.row)"
              >参赛队伍</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click.stop="awards(scope.row)"
              >获奖名单</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click.stop="ranking(scope.row)"
              >用户投票排名</el-button
            >
          </template>

          <template slot-scope="scope" slot="videoForm">
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

          <template slot-scope="scope" slot="sectionConfigListForm">
            <div>
              <el-row
                :span="24"
                :gutter="20"
                v-for="item in legTime"
                :key="item.index"
                class="leg_left"
              >
                <el-col :span="6">
                  <avue-input
                    v-model="item.sectionName"
                    placeholder="请输入赛段名称"
                  ></avue-input>
                </el-col>
                <el-col :span="6">
                  <avue-date
                    v-model="item.startDate"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="开始时间"
                  ></avue-date>
                </el-col>
                <el-col :span="1" style="text-align: center"> - </el-col>
                <el-col :span="6">
                  <avue-date
                    v-model="item.endDate"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间"
                  ></avue-date>
                </el-col>
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="small"
                  plain
                  @click.stop="handleLegDel(1)"
                  v-if="item.delbtn"
                  >删除</el-button
                >
              </el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                plain
                @click.stop="handleLegAdd(1)"
                >新增</el-button
              >
            </div>
          </template>

          <template slot-scope="scope" slot="matchAreaListForm">
            <div>
              <el-row :span="24" :gutter="20">
                <el-col :span="6">
                  <el-select
                    v-model="value"
                    placeholder="请选择"
                    @change="changeUrban(value, 1)"
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
                <el-col :span="24">
                  <el-checkbox-group v-model="checkedCities">
                    <el-checkbox
                      v-for="city in cities"
                      :label="city.id"
                      :value="city.id"
                      :key="city.id"
                      @change="checkedTagAdd(city, $event, 1)"
                      >{{ city.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-col>
                <el-col :span="24">
                  <el-tag
                    closable
                    v-for="tag in urbanTags"
                    :key="tag.id"
                    style="margin-right: 10px"
                    @close="handleCloseUrban(tag, 1)"
                    >{{ tag.name }}</el-tag
                  >
                </el-col>
              </el-row>
            </div>
          </template>

          <template slot-scope="scope" slot="weekPrizeForm">
            <div>
              <el-row
                :span="24"
                :gutter="20"
                v-for="item in weekPrize"
                :key="item.index"
                class="leg_left"
              >
                <el-col :span="2"> 第{{ item.id }}名： </el-col>
                <el-col :span="6">
                  <avue-input
                    v-model.number="item.prize"
                    :maxlength="5"
                    placeholder="请输入金额"
                    style="width: 180px"
                  ></avue-input>
                </el-col>
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="small"
                  plain
                  @click.stop="handlePrizeDel(1)"
                  v-if="item.delbtn"
                  >删除</el-button
                >
              </el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                plain
                @click.stop="handlePrizeAdd(1)"
                >新增</el-button
              >
            </div>
          </template>
        </avue-crud>
      </span>

      <el-dialog title="编辑" :visible.sync="dialogVisible" width="60%">

        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="title">
            <el-input
              v-model="ruleForm.title"
              style="width: 200px"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="作品封面" prop="pic">
            
            <el-upload
              :http-request="uploadSectionFilePic"
              :show-file-list="false"
              :action="url"
              class="upload-demo"
            >
              <img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="作品" prop="videoForm2">
            <el-upload
              :http-request="uploadSectionFile2"
              :show-file-list="false"
              :action="url"
              :before-upload="beforeUploadvideo"
              class="upload-demo"
            >
              <video
                v-if="videoForm2.video != '' && videoFlag == false"
                :src="videoForm2.video"
                class="avatar2"
                style="width=100%;height=100%;object-fit:fill"
                controls="controls"
              >
                您的浏览器不支持视频播放
              </video>
              <i
                v-if="videoForm2.video == '' && videoFlag == false"
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
          <el-form-item label="赛事简介" prop="summary">
            <avue-ueditor
              v-model="ruleForm.summary"
              :options="ueditorOptions2"
            ></avue-ueditor>
          </el-form-item>
          <el-form-item label="活动赛段" prop="sectionName">
            <div>
              <el-row
                :span="24"
                :gutter="20"
                v-for="item in ruleForm.sectionConfigList"
                :key="item.index"
                class="leg_left"
              >
                <el-col :span="6">
                  <avue-input
                    v-model="item.sectionName"
                    size="small"
                    placeholder="请输入赛段名称"
                  ></avue-input>
                </el-col>
                <el-col :span="6">
                  <avue-date
                    v-model="item.startDate"
                    size="small"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="开始时间"
                  ></avue-date>
                </el-col>
                <el-col :span="1" style="text-align: center"> - </el-col>
                <el-col :span="6">
                  <avue-date
                    v-model="item.endDate"
                    size="small"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间"
                  ></avue-date>
                </el-col>
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="small"
                  plain
                  @click.stop="handleLegDel(2)"
                  v-if="item.delbtn"
                  >删除</el-button
                >
              </el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                plain
                @click.stop="handleLegAdd(2)"
                >新增</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="活动赛区" prop="matchAreaList">
            <div>
              <el-row :span="24" :gutter="20">
                <el-col :span="6">
                  <el-select
                    v-model="ruleForm.value"
                    placeholder="请选择"
                    size="small"
                    @change="changeUrban(ruleForm.value, 2)"
                  >
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <el-checkbox-group v-model="ruleForm.checkedIds">
                    <el-checkbox
                      v-for="city in ruleForm.cities2"
                      :label="city.id"
                      :value="city.id"
                      :key="city.id"
                      @change="checkedTagAdd(city, $event, 2)"
                      >{{ city.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-col>
                <el-col :span="24">
                  <el-tag
                    closable
                    v-for="tag in ruleForm.urbanTags"
                    :key="tag.id"
                    style="margin-right: 10px"
                    @close="handleCloseUrban(tag, 2)"
                    >{{ tag.name }}</el-tag
                  >
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="周奖金配置" prop="sectionName">
            <div>
              <el-row
                :span="24"
                :gutter="20"
                v-for="item in ruleForm.weekPrize"
                :key="item.index"
                class="leg_left"
              >
                <el-col :span="2"> 第{{ item.id }}名： </el-col>
                <el-col :span="6">
                  <avue-input
                    v-model.number="item.prize"
                    size="small"
                    :maxlength="5"
                    placeholder="请输入金额"
                    style="width: 180px"
                  ></avue-input>
                </el-col>
                <el-button
                  type="warning"
                  icon="el-icon-delete"
                  size="small"
                  plain
                  @click.stop="handlePrizeDel(2)"
                  v-if="item.delbtn"
                  >删除</el-button
                >
              </el-row>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                plain
                @click.stop="handlePrizeAdd(2)"
                >新增</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="周奖金图片" prop="weekPrizePic">
            <el-upload
              :http-request="uploadSectionFilePic2"
              :show-file-list="false"
              :action="url"
              class="upload-demo"
            >
              <img
                v-if="ruleForm.weekPrizePic"
                :src="ruleForm.weekPrizePic"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="总决赛" prop="finalsPrizePic">
            <el-upload
              :http-request="uploadSectionFilePic3"
              :show-file-list="false"
              :action="url"
              class="upload-demo"
            >
              <img
                v-if="ruleForm.finalsPrizePic"
                :src="ruleForm.finalsPrizePic"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="报名说明" prop="applyDesc">
            <el-input
              v-model="ruleForm.applyDesc"
              size="small"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="submitForm('ruleForm')"
              >保存编辑</el-button
            >
            <el-button size="small" @click="resetForm('ruleForm')"
              >取消</el-button
            >
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
  name: "hostList",
  data() {
    return {
      dialogVisible: false,
      action2: url.v1.upload.file,
      ruleForm: {
        title: "",
        pic: "",
        summary: "",
        sectionConfigList: [
          {
            sectionName: "海选报名阶段",
            startDate: "2020-01-01",
            endDate: "2020-01-01",
            delbtn: false,
            sectionType: 1,
          },
        ],
        value: "",
        checkedIds: [],
        cities2: [], //区
        urbanTags: [],
        weekPrize: [
          {
            id: "1",
            prize: "",
          },
          {
            id: "2",
            prize: "",
          },
          {
            id: "3",
            prize: "",
          },
        ],
        weekPrizePic: "",
        finalsPrizePic: "",
        applyDesc: "",
      },
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        pic: [{ required: true, message: "请输入上传图片", trigger: "blur" }],
        weekPrizePic: [
          { required: true, message: "请输入上传图片", trigger: "blur" },
        ],
        finalsPrizePic: [
          { required: true, message: "请输入上传图片", trigger: "blur" },
        ],
        applyDesc: [{ required: true, message: "请输入说明", trigger: "blur" }],
      },
      summaryTxt: "",
      legTxt: "",
      form: "海选报名阶段",
      legTime: [
        {
          sectionName: "海选报名阶段",
          startDate: "2020-01-01",
          endDate: "2020-01-01",
          delbtn: false,
          sectionType: 1,
        },
      ],
      options: [], //市
      options2: [], //市
      value: "",
      checkedCities: [],
      cities: [], //区
      urbanTags: [],
      weekPrize: [
        {
          id: "1",
          prize: "",
        },
        {
          id: "2",
          prize: "",
        },
        {
          id: "3",
          prize: "",
        },
      ],
      deleteId: "",
      permissions: {},
      searchForm: {},
      data: [],
      page: {
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
      videoForm2: {
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
      ueditorOptions2: {
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
        editBtn: false,
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "赛事ID",
            prop: "id",
            display: false,
          },
          {
            label: "活动赛事名称",
            prop: "title",
            display: false,
          },
          {
            label: "作品封面",
            prop: "pic",
            display: false,
            type: "upload",
            listType: "picture-img",
            propsHttp: {
              res: "data",
            },
            display: false,
          },
          {
            label: "赛段开始日期",
            prop: "startDate",
            display: false,
          },
          {
            label: "赛段结束日期",
            prop: "endDate",
            display: false,
          },
          {
            label: "创建时间",
            prop: "createDate",
            display: false,
          },
          {
            label: "修改时间",
            prop: "updateDate",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "赛事名称",
                prop: "title",
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
                prop: "video",
                formslot: true,
                showColumn: false,
                viewDisplay: false,
              },
              {
                label: "赛事简介",
                prop: "summary",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
                // rules: [
                //   {
                //     required: true,
                //     message: '请输入赛事简介',
                //     trigger: 'blur'
                //   }
                // ],
              },
              {
                label: "活动赛段",
                prop: "sectionConfigList",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
              },
              {
                label: "活动赛区",
                prop: "matchAreaList",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
              },
              {
                label: "周奖金配置",
                prop: "weekPrize",
                formslot: true,
                showColumn: false,
                span: 24,
                viewDisplay: false,
              },
              {
                label: "周奖金",
                prop: "weekPrizePic",
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
                label: "总决赛奖励",
                prop: "finalsPrizePic",
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
                label: "报名说明",
                prop: "applyDesc",
                rules: [
                  {
                    required: true,
                    message: "请输入报名说明",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.supplierList();
    this.getDistrict();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    handleLegAdd(type) {
      if (type == 1) {
        this.legTime.push({
          sectionName: "",
          startDate: "",
          endDate: "",
          delbtn: true,
          sectionType: "",
        });
      } else {
        this.ruleForm.sectionConfigList.push({
          sectionName: "",
          startDate: "",
          endDate: "",
          delbtn: true,
          sectionType: "",
        });
      }
    },

    handlePrizeAdd(type) {
      if (type == 1) {
        if (this.weekPrize.length >= 20) {
          this.$message.error("周奖金配置已达到最高限制");
          return;
        }

        this.weekPrize.push({
          id: this.weekPrize.length + 1,
          prize: "",
          delbtn: true,
        });
      } else {
        if (this.ruleForm.weekPrize.length >= 20) {
          this.$message.error("周奖金配置已达到最高限制");
          return;
        }
        this.ruleForm.weekPrize.push({
          id: this.ruleForm.weekPrize.length + 1,
          prize: "",
          delbtn: true,
        });
      }
    },

    handleLegDel(type) {
      if (type == 1) {
        this.legTime.splice(-1, 1);
      } else {
        this.ruleForm.sectionConfigList.splice(-1, 1);
      }
    },

    handlePrizeDel(type) {
      if (type == 1) {
        this.weekPrize.splice(-1, 1);
      } else {
        this.ruleForm.weekPrize.splice(-1, 1);
      }
    },

    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.supplierList();
    },

    supplierList(searchData) {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.match.matchList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },

    getDistrict() {
      request({
        url: url.v1.match.getDistrict,
        method: "post",
        data: { pid: 0 },
      }).then((res) => {
        res.data.map((item) => {
          this.options.push({
            value: item.id,
            label: item.name,
          });
          this.options2.push({
            value: item.id,
            label: item.name,
          });
        });
      });
    },

    changeUrban(val, type) {
      request({
        url: url.v1.match.getDistrict,
        method: "post",
        data: { pid: val },
      }).then((res) => {
        this.cities = [];
        this.ruleForm.cities2 = [];
        res.data.map((item) => {
          if (type == 2) {
            this.ruleForm.cities2.push({
              id: item.id,
              name: item.name,
            });

            this.ruleForm.urbanTags.map((itemTag) => {
              if (item.id == itemTag.id) {
                this.ruleForm.checkedIds.push(item.id);
              }
            });
          } else {
            this.cities.push({
              id: item.id,
              name: item.name,
            });
          }
        });
      });
    },

    checkedTagAdd(val, checked, type) {
      if (type == 1) {
        if (checked) {
          var k = false;
          this.urbanTags.map((item) => {
            if (item.id == val.id) {
              k = true;
            }
          });
          if (!k) {
            this.urbanTags.push({ id: val.id, name: val.name });
          }
        } else {
          this.urbanTags.map((item) => {
            if (item.id == val.id) {
              this.urbanTags.splice(
                this.urbanTags.findIndex((item) => item.id === val.id),
                1
              );
            }
          });
        }
      } else {
        if (checked) {
          var k = false;
          this.ruleForm.urbanTags.map((item) => {
            if (item.id == val.id) {
              k = true;
            }
          });
          if (!k) {
            this.ruleForm.urbanTags.push({ id: val.id, name: val.name });
          }
        } else {
          this.ruleForm.urbanTags.map((item) => {
            if (item.id == val.id) {
              this.ruleForm.urbanTags.splice(
                this.ruleForm.urbanTags.findIndex((item) => item.id === val.id),
                1
              );
            }
          });
        }
      }
    },

    handleCloseUrban(val, type) {
      if (type == 1) {
        this.checkedCities = [];
        this.urbanTags.map((tag) => {
          if (val.id == tag.id) {
            this.urbanTags.splice(
              this.urbanTags.findIndex((item) => item.id == val.id),
              1
            );
          }
        });
        this.urbanTags.map((tag) => {
          this.checkedCities.push(tag.id);
        });
      } else {
        this.ruleForm.checkedIds = [];
        this.ruleForm.urbanTags.map((tag) => {
          if (val.id == tag.id) {
            this.ruleForm.urbanTags.splice(
              this.ruleForm.urbanTags.findIndex((item) => item.id == val.id),
              1
            );
          }
        });
        this.ruleForm.urbanTags.map((tag) => {
          this.ruleForm.checkedIds.push(tag.id);
        });
      }
    },

    toParticipate(row) {
      this.$router.push({
        path: "/joinList",
        query: { id: row.id },
      });
    },

    awards(row) {
      this.$router.push({
        path: "/awards",
        query: { id: row.id },
      });
    },

    ranking(row) {
      this.$router.push({
        path: "/ranking",
        query: { id: row.id },
      });
    },

    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.supplierList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.supplierList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.supplierList();
    },
    rowSave(form, done) {
      const _this = this;
      form.video = _this.videoForm.video;
      form.summary = _this.summaryTxt;
      form.sectionConfigList = _this.legTime;
      form.weekPrize = _this.weekPrize;

      var list = [];
      this.urbanTags.map((item) => {
        list.push(item.id);
      });
      form.matchAreaList = list;

      request({
        url: url.v1.match.matchListAdd,
        method: "POST",
        data: form,
        type: "noPost",
      }).then((res) => {
        
        if (res.status !== 200) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.supplierList();
          done();
        }
      });
    },

    rowUpdate(row) {
      //编辑回显
      this.dialogVisible = true;
      this.getDistrict();
      request({
        url: url.v1.match.getMatchDetail,
        method: "POST",
        data: { id: row.id },
      }).then((res) => {
        this.ruleForm.id = res.data.id;
        this.ruleForm.applyDesc = res.data.applyDesc;
        this.ruleForm.pic = res.data.pic;
        this.videoForm2.video = res.data.video;
        this.ruleForm.finalsPrizePic = res.data.finalsPrizePic;
        this.ruleForm.sectionConfigList = res.data.sectionConfigList;
        this.ruleForm.summary = res.data.summary;
        this.ruleForm.title = res.data.title;
        this.ruleForm.weekPrize = [];
        var weekPrizeList = res.data.weekPrize.split(",");
        for (var i = 0; i < weekPrizeList.length; i++) {
          if (i < 3 && this.ruleForm.weekPrize[i] != null) {
            this.ruleForm.weekPrize[i].prize = weekPrizeList[i];
          } else {
            this.ruleForm.weekPrize.push({
              id: i + 1,
              prize: weekPrizeList[i],
              delbtn: i > 2,
            });
          }
        }

        this.ruleForm.urbanTags = [];
        res.data.matchAreaList.map((item) => {
          this.ruleForm.urbanTags.push({
            id: item.cityId,
            name: item.cityName,
          });
        });

        this.ruleForm.weekPrizePic = res.data.weekPrizePic;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var list = [];
          this.ruleForm.urbanTags.map((item) => {
            list.push(item.id);
          });
          this.ruleForm.matchAreaList = list;
          this.ruleForm.video = this.videoForm2.video;
          request({
            url: url.v1.match.updateMatch,
            method: "POST",
            data: this.ruleForm,
            type: "noPost",
          }).then((res) => {
            if (res.status == 200) {
              this.$message.success(res.message);
              this.page.currentPage = 1;
              this.supplierList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
    },

    rowDel(form) {
      this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: url.v1.match.deleteMatch,
          method: "POST",
          data: {
            id: form.id,
          },
        }).then((res) => {
          this.$message.success(res.message);
          this.supplierList();
        });
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          request({
            url: url.v1.supplier.delete,
            method: "POST",
            data: {
              ids: this.deleteId,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.supplierList();
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的分类",
        });
      }
    },

    handleAvatarSuccess(res, file) {
      this.ruleForm.pic = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess2(res, file) {
      this.ruleForm.weekPrizePic = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccess3(res, file) {
      this.ruleForm.finalsPrizePic = URL.createObjectURL(file.raw);
    },

    uploadBefore(file, done, column) {
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
    uploadAfter(res, done, column) {
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
    uploadSectionFilePic2(params) {
      let self = this;
      let type = 1;
      let data = new FormData();
      data.append(params.filename, params.file);
      data.append("type", 1);
      axios
        .post(url.v1.upload.file, data)
        .then(function (res) {
          if (res.status == 200) {
            self.ruleForm.weekPrizePic = res.data.data.url;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    uploadSectionFilePic3(params) {
      let self = this;
      let type = 1;
      let data = new FormData();
      data.append(params.filename, params.file);
      data.append("type", 1);
      axios
        .post(url.v1.upload.file, data)
        .then(function (res) {
          if (res.status == 200) {
            self.ruleForm.finalsPrizePic = res.data.data.url;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    
    uploadSectionFile2(params) {
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
            self.videoForm2.video = res.data.data.url;
            self.videoForm2.videoImg = res.data.data.coverUrl;
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
        this.$message.error("上传视频大小不能超过10MB哦!");
        return false;
      }
    },

    nodeClick(data) {
      this.goodsTypeName = data.label;
      this.page.currentPage = 1;
      this.supplierList();
    },
  },
};
</script>

<style>
.v-modal {
  background: transparent;
  z-index: 0;
}
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
.avatar2 {
  width: 400px;
  display: block;
}
.avatar {
  width: 150px;
  height: 150px;
}
.leg_left:first-child .el-col:first-child {
  margin-left: -10px;
}
.el-dialog__footer {
  text-align: left;
}
.el-form-item {
  margin-bottom: 5px;
}
.el-dialog__body {
  padding: 8px 20px;
}
</style>
