<template>
  <div>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page.sync="page"
      v-model="crud"
      :before-open="beforeOpen"
      @refresh-change="hotelList"
      @current-change="currentChange"
      @size-change="sizeChange"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
    >
    <template slot="menuLeft">
      <el-button type="primary" icon="el-icon-delete" size="small" @click.stop="handleDel">批量删除</el-button>
    </template>
    <template slot-scope="scope" slot="remarkForm">
      <avue-ueditor v-model="introTxt" :options="ueditorOptions"></avue-ueditor>
    </template>
    <!-- <template slot-scope="scope" slot="lonLatTencentForm">
      <avue-map v-model="mapText"></avue-map>
    </template> -->
    <template slot-scope="scope" slot="menu">
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchChildType(scope.row,scope.index)"
      >查看门票类型</el-button>
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchChild(scope.row,scope.index)"
      >查看门票</el-button>
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchClerk(scope.row,scope.index)"
      >查看核销员</el-button>
      <el-button v-if="scope.row.isWindow==0"
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="setWindow(scope.row,scope.index)"
      >设为橱窗商品</el-button>
      <el-button v-else
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="cancelWindow(scope.row,scope.index)"
      >取消橱窗商品</el-button>
    </template>
    <template slot-scope="scope" slot="videoUrlForm">
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
          style="width=100%;height=100%;object-fit:fill"
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
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import configObj from "@/../vue.config.js";
var validatePhone = (rule, value, callback)=>{
  if (!(/^1[3456789]\d{9}$/.test(value)) && !/^0\d{3,4}-\d{7,8}$/.test(value) ) {
    callback(new Error('号码格式不正确！'));
  } else {
    callback();
  }
};
export default {
  name: "attrList",
  data() {
    return {
      introTxt:"",
      ueditorOptions : {
        action: url.v1.upload.file80,
        customConfig: {},//wangEditor编辑的配置
        props: {
          res: "data",
          url: "url"
        },
      },
      crud: {},
      url: "http://localhost:6200/" + url.v1.upload.file,
      videoUploadPercent: 0,
      videoFlag: false,
      videoForm: {
        Video: "",
        VideoImg : ""
      },
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      deleteId : [],
      searchForm: {},
      data: [],
      option:{
        title:'景点列表',
        page:true,
        align:'center',
        menuAlign:'center',
        columnBtn : false,
        border:true,
        selection: true,
        indexLabel:'序号',
        index:true,
        labelWidth : '130',
        viewBtn: true,
        column:[
          {
            label:'景点类型',
            prop:'spotsTypeId',
            type : 'select',
            props: {
              label: 'type',
              value: 'id'
            },
            rules: [
              {
                required: true,
                message: '请选择景点类型',
                trigger: 'change'
              }
            ],
            dicUrl: url.v1.scenic.classListType,
            dicFormatter:(res)=>{
              return res.data;//返回字典的层级结构
            },
          },
          {
            label : '省份',
            prop : 'province',
            type: 'select',
            props: {
              label: 'fullname',
              value: 'id'
            },
            cascaderItem: ['city', 'area'],
            dicUrl: url.v1.thGetArea+`/0`,
            dicFormatter:(res)=>{
              return res.data;//返回字典的层级结构
            },
            rules: [
              {
                required: true,
                message: '请选择省份',
                trigger: 'change'
              }
            ],
            showColumn:false,
          },
          {
            label:'景点名称',
            prop:'name',
            rules: [
              {
                required: true,
                message: '请输入景点名称',
                trigger: 'blur'
              }
            ],
          },
          {
            label : '市',
            prop : 'city',
            type: 'select',
            props: {
              label: 'fullname',
              value: 'id'
            },
            cascaderIndex:0,
           dicUrl: `${url.v1.thGetArea}/{{key}}`,
            rules: [
              {
                required: true,
                message: '请选择城市',
                trigger: 'change'
              }
            ],
            showColumn:false,
            
          },
          {
            label: "联系电话",
            prop: "phone",
            rules: [{ required: true,validator: validatePhone, trigger: 'blur' }],
          },
          {
            label : '区/县',
            prop : 'area',
            type: 'select',
            props: {
              label: 'fullname',
              value: 'id'
            },
            cascaderIndex:1,
            dicUrl: `${url.v1.thGetArea}/{{key}}`,
            rules: [
              {
                required: true,
                message: '请选择地区',
                trigger: 'change'
              }
            ],
            showColumn:false,
          },{
            label: "景点星级",
            prop: "star",
            type : 'select',
            props: {
              label: 'name',
              value: 'code'
            },
            dicUrl: url.v1.scenic.liststar,
            dicMethod:'get',
            dicFormatter:(res)=>{
              let  list = res.data
              for(let i in list ){
                list[i].code = Number(list[i].code)
              }
              return list;
            },
            rules: [
              {
                required: true,
                message: '请输入酒店星级',
                trigger: 'change'
              }
            ],
            search: true,
          },
          {
            label: "景点地址",
            prop: "addrDes",
            rules: [
              {
                required: true,
                message: '请输入景点地址',
                trigger: 'blur'
              }
            ],
          },
          {
            label: "营业开始时间",
            prop: "startTime",
            type: "time",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message: '请选择营业开始时间',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "营业结束时间",
            prop: "endTime",
            type: "time",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message: '请选择营业结束时间',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "营业时间说明",
            prop: "businessRemark",
             rules: [
              {
                required: true,
                message: '请输入营业时间说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "景点副标题",
            prop: "subTitle",
            rules: [
              {
                required: true,
                message: '请输入景点副标题',
                trigger: 'blur'
              }
            ],
          },
          {
            label: "经纬度",
            prop: "lonLatTencent",
            type: 'map',
            showColumn:false,
            row : true,
            rules: [
              {
                required: true,
                message: '请选择经纬度',
                trigger: 'blur'
              }
            ],
          },
          {
            label: "景点简介",
            prop: "remark",
            formslot: true,
            showColumn:false,
            span:24,
            viewDisplay : false,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入景点简介',
            //     trigger: 'blur'
            //   }
            // ],
          },
          
          {
            label: "设置热门推荐",
            prop: "hotRecommend",
            type: 'switch',
            dicData: [{
              label: '否',
              value: 0
            }, {
              label: '是',
              value: 1
            }],
            showColumn:false,
          },
           {
            label: "设置爆款推荐",
            prop: "popRecommend",
            type: 'switch',
            dicData: [{
              label: '否',
              value: 0
            }, {
              label: '是',
              value: 1
            }],
            showColumn:false,
          },
          {
            label: "设置大牌",
            prop: "bigBrandDirectMarketing",
            type: 'switch',
            dicData: [{
              label: '否',
              value: 0
            }, {
              label: '是',
              value: 1
            }],
            showColumn:false,
          },
          {
            label: "是否有直升机",
            prop: "isGiven",
            type: 'switch',
            dicData: [{
              label: '否',
              value: 0
            }, {
              label: '是',
              value: 1
            }],
            showColumn:false,
          },
          {
            label: "数据状态",
            prop: "status",
            type: 'radio',
            border:true,
            dicData: [{
              label: '可用',
              value: 1
            },{
              label: '不可用',
              value: 0
            }],
            row : true
          },
          {
            label:'景点缩略图',
            prop:'spotsMainUrl',
            type: 'upload',
            listType: 'picture-img',
            propsHttp: {
              res: 'data'
            },
            rules: [
              {
                required: true,
                message: '请上传图片',
                trigger: 'blur'
              }
            ],
            action: url.v1.upload.file,
          },
          {
            label:'是否加入橱窗',
            prop:'isWindow',
            dicData: [{
              label: '否',
              value: 0
            }, {
              label: '是',
              value: 1
            }],
            display:false
          },
          {
            label:'景点轮播图',
            prop:'spotsAtlasUrl',
            type: 'upload',
            listType: 'picture-card',
            propsHttp: {
              res: 'data'
            },
            rules: [
              {
                required: true,
                message: '请上传图片',
                trigger: 'change'
              }
            ],
            action: url.v1.upload.file,
            showColumn:false,
            span : 24
          },
          {
            label:'视频封面图',
            prop:'coverUrl',
            type: 'upload',
            listType: 'picture-img',
            display:false
          },
          {
            label: "视频",
            prop: "videoUrl",
            formslot: true,
            showColumn:false,
            span : 24,
            viewDisplay : false
          },
          {
            label : "访问量",
            prop: 'lookCount',
            sortable:true,
            display:false,
          },
          {
            label : "分享量",
            prop: 'shareCount',
            sortable:true,
            display:false,
          },
          {
            label : "收藏量",
            prop: 'collectCount',
            sortable:true,
            display:false,
          },
          {
            label : "销量",
            prop: 'salesCount',
            sortable:true,
            display:false,
          },
          {
            label: "预定时间说明",
            prop: "reserveDesc",
             rules: [
              {
                required: true,
                message: '请输入预定时间说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },{
            label: "有效期说明",
            prop: "periodDesc",
             rules: [
              {
                required: true,
                message: '请输入有效期说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },{
            label: "费用包含说明",
            prop: "feeIncludesDesc",
             rules: [
              {
                required: true,
                message: '请输入费用包含说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },{
            label: "使用方法说明",
            prop: "useDesc",
             rules: [
              {
                required: true,
                message: '请输入使用方法说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },{
            label: "改退说明",
            prop: "convertRefundDesc",
             rules: [
              {
                required: true,
                message: '请输入改退说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          }
        ]
      }
    }
  },
  created() {
    this.hotelList();
  },
  mounted() {},
  computed: {
    
  },
  props: [],
  methods: {
    // 获取景点列表
    hotelList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.scenic.attrList,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        for (let i in list){
          let lonLatArr = []
          list[i].coverUrl =  list[i].coverUrl ? list[i].coverUrl.split('?')[0] : list[i].coverUrl
          list[i].spotsMainUrl = list[i].spotsMainUrl?list[i].spotsMainUrl.split('?')[0]:list[i].spotsMainUrl
          lonLatArr.push(list[i].lonLatTencent.split(',')[0])
          lonLatArr.push(list[i].lonLatTencent.split(',')[1])
          lonLatArr.push(list[i].lonLatAddress)
          list[i].lonLatTencent = lonLatArr
          if(list[i].spotsAtlasUrl && list[i].spotsAtlasUrl!=null){
            let  arr = []
            list[i].spotsAtlasUrl = list[i].spotsAtlasUrl.split('!#!')
            for(let j in list[i].spotsAtlasUrl){
              let obj = {}
              obj.label = ''
              obj.value = list[i].spotsAtlasUrl[j].split('?')[0]
              arr.push(obj)
              
            }
            list[i].spotsAtlasUrl = arr
          }
        }
        this.data = list;
      });
    },

    // 保存新增
    rowSave(form, done, loading){
      const that = this
      
      let arr = []
      form.province = form.$province
      form.city = form.$city
      form.area = form.$area
      form.spotsMainUrl = form.spotsMainUrl+'?x-image-process=image/quality,q_80'
      form.coverUrl = that.videoForm.VideoImg
      form.videoUrl = that.videoForm.Video
      form.remark = that.introTxt
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      for(let i in form.spotsAtlasUrl){
        arr.push(form.spotsAtlasUrl[i].value + '?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.spotsAtlasUrl = arr
      request({
        url: url.v1.scenic.addAttrList,
        data: form,
        method: "post",
      }).then((res) => {
        
        if(res.status==200){
          this.$message.success("添加成功！");
          that.hotelList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 保存编辑
    rowUpdate(form, index, done, loading){
      const that = this
      let arr = []
      console.log(form.spotsAtlasUrl)
      form.province = form.$province
      form.city = form.$city
      form.area = form.$area
      form.spotsMainUrl = form.spotsMainUrl+'?x-image-process=image/quality,q_80'
      form.coverUrl = that.videoForm.VideoImg
      form.videoUrl = that.videoForm.Video
      form.remark = that.introTxt
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      delete form.createdTime
      delete form.updatedTime
      for(let i in form.spotsAtlasUrl){
        arr.push(form.spotsAtlasUrl[i].value + '?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.spotsAtlasUrl = arr
      request({
        url: url.v1.scenic.updateAttrList,
        data: form,
        method: "post",
      }).then((res) => {
        // console.log(res)
        if(res.status==200){
          this.$message.success("编辑成功！");
          that.hotelList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 删除
    rowDel(form){
      const that = this
      that.$confirm("此操作将删除该景点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delAttrList,
            data: {
              ids :form.id,
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.hotelList()
            }else{
              this.$message.error("操作失败！");
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页条数
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.hotelList();
    },

    // 页面切换
    currentChange(val) {
      this.page.currentPage = val;
      this.hotelList();
    },

    // 搜索
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      
      console.log(params)
      this.searchForm = params;
      this.hotelList();
    },

    // 多选
    selectionChange(list){
      this.deleteId = list.map(item => item.id).join(",");
    },

    rowView(row,index){
      console.log(row)
    },

    handleDel() {
      const that = this
      let ids = that.deleteId;
      if(ids.length==0){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      that.$confirm("此操作将删除选中的景点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delAttrList,
            data: {
              ids :ids,
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.hotelList()
            }else{
              this.$message.error("操作失败！");
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    cancelWindow(row,index){
      this.$confirm("是否取消将该景点设为橱窗商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.cancelWindow,
            data: {
              spotsId : row.id,
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("取消成功！");
              this.hotelList()
            }else{
              this.$message.error("取消失败！");
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    setWindow(row,index){
      this.$confirm("是否将该景点设为橱窗商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.addGoodsWindow,
            data: {
              spotsId : row.id,
              spotsName : row.name,
              spotsMainUrl : row.spotsMainUrl,
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("设置成功！");
              this.hotelList()
            }else{
              this.$message.error("设置失败！");
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    watchChild(row,index){
      this.$router.push({
          path: "/ticketlist/index",
          query: { scenicSpotsId: row.id,scenicSpotsName:row.name },
        });
    },
    watchChildType(row,index){
      this.$router.push({
          path: "/ticketypetlist/index",
          query: { scenicSpotsId: row.id,scenicSpotsName:row.name },
        });
    },

    watchClerk(row,index){
      this.$router.push({
          path: "/clerk/index",
          query: { scenicSpotsId: row.id,scenicSpotsName:row.name },
        });
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
            console.log(res)
            self.videoFlag = false;
            self.videoUploadPercent = 0;
            self.videoForm.Video = res.data.data.url;
            self.videoForm.VideoImg = res.data.data.coverUrl;
          } else {
            self.$message.error("视频上传失败，请重新上传！");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    },
    beforeOpen(done, type) {
      if (["views", "edit"].includes(type)) {
        // 查看和编辑逻辑
        this.videoForm.Video = this.crud.videoUrl;
        this.videoForm.VideoImg = this.crud.coverUrl;
        this.introTxt = this.crud.remark;
      } else {
        //新增逻辑
        //一定要用setTimeout包裹，由于form组件底层一些机制的设计
        setTimeout(() => {
          this.videoForm.Video = "";
          this.videoForm.VideoImg = "";
          this.introTxt = "";
        }, 0);
      }
      
      done();
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
    }

    
  }
}
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
</style>
