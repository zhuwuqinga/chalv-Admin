<template>
  <div>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page.sync="page"
      :before-open="beforeOpen"
      @refresh-change="hotelList"
      @current-change="currentChange"
      @size-change="sizeChange"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      v-model="crud"
    >
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-delete" size="small" @click.stop="handleDel">批量删除</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchChild(scope.row,scope.index)"
      >查看主房型</el-button>
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchClerk(scope.row,scope.index)"
      >查看核销员</el-button>
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
    <template slot-scope="scope" slot="introForm">
      <avue-ueditor v-model="introTxt" :options="ueditorOptions"></avue-ueditor>
    </template>
    <!-- <template slot-scope="scope" slot="lonLatTencentForm">
      <avue-map v-model="mapText"></avue-map>
    </template> -->
    
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import configObj from "@/../vue.config.js";
import axios from 'axios'
var validatePhone = (rule, value, callback)=>{
  if (!(/^1[3456789]\d{9}$/.test(value)) && !/^0\d{3,4}-\d{7,8}$/.test(value) ) {
    callback(new Error('号码格式不正确！'));
  } else {
    callback();
  }
};
export default {
  name: "hotellist",
  data() {
    return {
      introTxt:"",
      ueditorOptions : {
        action:  url.v1.upload.file80,
        customConfig: {},//wangEditor编辑的配置
        props: {
          res: "data",
          url: "url"
        },
      },
      crud : {
        map: [ 0, 0, "" ] 
      },
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
      district:{
          province: '0',
          city: '110100',
          area: '110101'
       },
      deleteId : [],
      searchForm: {},
      data: [],
      option:{
        title:'酒店列表',
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
            label:'酒店名称',
            prop:'name',
            rules: [
              {
                required: true,
                message: '请输入酒店名称',
                trigger: 'blur'
              }
            ],
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
              return res.data;
            },
            rules: [
              {
                required: true,
                message: '请选择省份',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "酒店电话",
            prop: "phone",
            rules: [{ required: true,validator: validatePhone, trigger: 'blur' }],
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
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "酒店星级",
            prop: "star",
            type : 'select',
            props: {
              label: 'name',
              value: 'code'
            },
            dicUrl: url.v1.hotel.starlist,
            dicMethod:'post',
            dicQuery:{
              hotelType:2
            },
            dicFormatter:(res)=>{
              let  list = res.data.list
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
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "规则说明",
            prop: "userRules",
            rules: [
              {
                required: true,
                message: '请输入规则说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "酒店地址",
            prop: "addrDes",
            rules: [
              {
                required: true,
                message: '请输入酒店地址',
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
            label: "预订说明",
            prop: "booking",
             rules: [
              {
                required: true,
                message: '请输入预订说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "退订政策",
            prop: "unsubscribePolicy",
            rules: [
              {
                required: true,
                message: '请输入退订政策',
                trigger: 'blur'
              }
            ],
            showColumn:false,
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
            label: "酒店简介",
            prop: "intro",
            formslot: true,
            showColumn:false,
            span:24,
            viewDisplay : false,
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入酒店简介',
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
            label: "数据状态",
            prop: "status",
            type: 'radio',
            border:true,
            dicData: [{
              label: '不可用',
              value: 0
            }, {
              label: '可用',
              value: 1
            }],
            row : true,
            value : 1
          },
          {
            label:'酒店缩略图',
            prop:'hotelImage',
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
            action: url.v1.upload.file
          },
          {
            label:'视频封面图',
            prop:'coverUrl',
            type: 'upload',
            listType: 'picture-img',
            display:false
          },
          {
            label:'酒店轮播图',
            prop:'hotelImageList',
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
            label: "视频",
            prop: "videoUrl",
            formslot: true,
            showColumn:false,
            viewDisplay:false,
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
  methods: {
    // 获取酒店列表
    hotelList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.hotel.list,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        if(list.length>0){
          for (let i in list){
            let lonLatArr = []
            list[i].hotelImage = list[i].hotelImage?list[i].hotelImage.split('?')[0]:list[i].hotelImage
            list[i].coverUrl = list[i].coverUrl?list[i].coverUrl.split('?')[0]:list[i].coverUrl
            lonLatArr.push(list[i].lonLatTencent.split(',')[0])
            lonLatArr.push(list[i].lonLatTencent.split(',')[1])
            lonLatArr.push(list[i].lonLatAddress)
            list[i].lonLatTencent = lonLatArr
            
            if(list[i].hotelImageList){
              let  arr = []
              list[i].hotelImageList = list[i].hotelImageList.split('!#!')
              for(let j in list[i].hotelImageList){
                let obj = {}
                obj.label = ''
                obj.value = list[i].hotelImageList[j].split('?')[0]
                arr.push(obj)
              }
              list[i].hotelImageList = arr
            }
          }
        }
        // console.log(list)

        this.data = list;
      });
    },

    // 保存新增
    rowSave(form, done, loading){
      const that = this
      let arr = []
      console.log(form)
      form.province = form.$province
      form.city = form.$city
      form.area = form.$area
      form.hotelImage = form.hotelImage+'?x-image-process=image/quality,q_80'
      form.coverUrl = that.videoForm.VideoImg
      form.videoUrl = that.videoForm.Video
      form.intro = that.introTxt
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      let img = form.hotelImageList;
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.hotelImageList = arr
      request({
        url: url.v1.hotel.addhotel,
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
      form.operationType = 1
      form.province = form.$province
      form.city = form.$city
      form.area = form.$area
      form.hotelImage = form.hotelImage+'?x-image-process=image/quality,q_80'
      form.coverUrl = that.videoForm.VideoImg
      form.videoUrl = that.videoForm.Video
      form.intro = that.introTxt
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      let img = form.hotelImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.hotelImageList = arr
      request({
        url: url.v1.hotel.updatehotel,
        data: form,
        method: "post",
      }).then((res) => {
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
      that.$confirm("此操作将删除该酒店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.hotel.updatehotel,
            data: {
              id :form.id,
              isDelete : 1,
              operationType : 2
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              that.$message.success("删除成功！");
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

    currentChange(val){
      this.page.currentPage = val;
      this.hotelList();
    },

    // 搜索
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.hotelList();
    },

    watchChild(row,index){
      this.$router.push({
        path: "/typelist/index",
        query: { hotelid: row.id ,hotelname:row.name},
      });
    },

    // 多选
    selectionChange(list){
      this.deleteId = list.map(item => item.id);
    },

    handleDel() {
      let ids = this.deleteId;
      const that = this
      if(ids.length==0){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      that.$confirm("此操作将删除选择的酒店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.post(url.v1.hotel.delAllHotel, ids)
          .then(function (res) {
            console.log(res)
            if(res.status==200){
                that.$message.success("删除成功！");
                that.hotelList()
              }else{
                that.$message.error("操作失败！");
              }
          })
          .catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    watchClerk(row,index){
      this.$router.push({
          path: "/hotelclerk/index",
          query: { hotelid: row.id},
        });
    },
    beforeOpen(done, type) {
      if (["views", "edit"].includes(type)) {
        // 查看和编辑逻辑
        this.videoForm.Video = this.crud.videoUrl;
        this.videoForm.VideoImg = this.crud.coverUrl;
        this.introTxt = this.crud.intro;
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
            self.videoForm.VideoImg = res.data.data.coverUrl;
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
