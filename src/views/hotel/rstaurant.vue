<template>
  <div>
    <avue-crud
      :data="data"
      :option="option"
      :page.sync="page"
      @refresh-change="loadList"
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
        action:  url.v1.upload.file,
        customConfig: {},//wangEditor编辑的配置
        props: {
          res: "data",
          url: "url"
        },
      },
      crud : {
        map: [ 0, 0, "" ] 
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
        title:'餐厅列表',
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
        menuWidth:300,
        column:[
          {
            label:'餐厅名称',
            prop:'name',
            search : true,
            rules: [
              {
                required: true,
                message: '请输入餐厅名称',
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
            label: "餐厅电话",
            prop: "tel",
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
            label: "数据状态",
            prop: "status",
            type: 'switch',
            dicData: [{
              label: '可用',
              value: 1
            }, {
              label: '不可用',
              value: 0
            }],
            showColumn:false,
          },
        //   {
        //     label: "餐厅星级",
        //     prop: "star",
        //     type : 'select',
        //     dicData: [{
        //       label: '一星级',
        //       value :1
        //     },{
        //       label: '二星级',
        //       value :2
        //     },{
        //       label: '三星级',
        //       value :3
        //     },{
        //       label: '四星级',
        //       value :4
        //     },{
        //       label: '五星级',
        //       value :5
        //     },{
        //       label: '六星级',
        //       value :6
        //     },{
        //       label: '七星级',
        //       value :7
        //     }],
        //     rules: [
        //       {
        //         required: true,
        //         message: '请输入餐厅星级',
        //         trigger: 'change'
        //       }
        //     ],
        //     search: true,
        //   },
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
            label: "餐厅简介",
            prop: "introduce",
            showColumn:false,
            rules: [
              {
                required: true,
                message: '请输入餐厅简介',
                trigger: 'blur'
              }
            ],
          },
          {
            label: "餐厅地址",
            prop: "addrDes",
            rules: [
              {
                required: true,
                message: '请输入餐厅地址',
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
        //   {
        //     label: "预订说明",
        //     prop: "booking",
        //      rules: [
        //       {
        //         required: true,
        //         message: '请输入预订说明',
        //         trigger: 'blur'
        //       }
        //     ],
        //     showColumn:false,
        //   },
        //   {
        //     label: "退订政策",
        //     prop: "unsubscribePolicy",
        //     rules: [
        //       {
        //         required: true,
        //         message: '请输入退订政策',
        //         trigger: 'blur'
        //       }
        //     ],
        //     showColumn:false,
        //   },
          {
            label: "经纬度",
            prop: "lonLatTencent",
            type: 'map',
            showColumn:false,
            row : true
          },
        //   {
        //     label: "设置热门推荐",
        //     prop: "hotRecommend",
        //     type: 'switch',
        //     dicData: [{
        //       label: '否',
        //       value: 0
        //     }, {
        //       label: '是',
        //       value: 1
        //     }],
        //     showColumn:false,
        //   },
        //    {
        //     label: "设置爆款推荐",
        //     prop: "popRecommend",
        //     type: 'switch',
        //     dicData: [{
        //       label: '否',
        //       value: 0
        //     }, {
        //       label: '是',
        //       value: 1
        //     }],
        //     showColumn:false,
        //   },
          
          {
            label:'餐厅缩略图',
            prop:'imgUrl',
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
            label:'餐厅轮播图',
            prop:'rstaurantImageList',
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
        //   {
        //     label : "访问量",
        //     prop: 'lookCount',
        //     sortable:true,
        //     display:false,
        //   },
        //   {
        //     label : "分享量",
        //     prop: 'shareCount',
        //     sortable:true,
        //     display:false,
        //   },
        //   {
        //     label : "收藏量",
        //     prop: 'collectCount',
        //     sortable:true,
        //     display:false,
        //   },
        //   {
        //     label : "销量",
        //     prop: 'salesCount',
        //     sortable:true,
        //     display:false,
        //   }
        ]
      }
    }
  },
  created() {
    this.loadList();
  },
  mounted() {},
  computed: {
    
  },
  methods: {
    // 获取餐厅列表
    loadList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.hotel.rstaurantList,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        if(list.length>0){
          for (let i in list){
            let lonLatArr = []
            list[i].rstaurantImage = list[i].rstaurantImage?list[i].rstaurantImage.split('?')[0]:list[i].rstaurantImage
            lonLatArr.push(list[i].lonLatTencent.split(',')[0])
            lonLatArr.push(list[i].lonLatTencent.split(',')[1])
            lonLatArr.push(list[i].lonLatAddress)
            list[i].lonLatTencent = lonLatArr
            if(list[i].rstaurantImageList){
              let  arr = []
              list[i].rstaurantImageList = list[i].rstaurantImageList.split('!#!')
              for(let j in list[i].rstaurantImageList){
                let obj = {}
                obj.label = ''
                obj.value = list[i].rstaurantImageList[j].split('?')[0]
                arr.push(obj)
              }
              list[i].rstaurantImageList = arr
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
      form.province = form.$province
      form.city = form.$city
      form.area = form.$area
      form.rstaurantImage = form.rstaurantImage+'?x-image-process=image/quality,q_80'
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      let img = form.rstaurantImageList;
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.rstaurantImageList = arr
      request({
        url: url.v1.hotel.addRstaurantList,
        data: form,
        method: "post",
      }).then((res) => {
        if(res.status==200){
          this.$message.success("添加成功！");
          that.loadList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 保存编辑
    rowUpdate(form, index, done, loading){
      const that = this
      form.rstaurantImage = form.rstaurantImage+'?x-image-process=image/quality,q_80'
      let img = form.rstaurantImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      form.rstaurantImageList = arr
      form.lonLatAddress = form.lonLatTencent[2]
      form.lonLatTencent = form.lonLatTencent[0] + ',' + form.lonLatTencent[1]
      request({
        url: url.v1.hotel.updateRstaurantList,
        data: form,
        method: "post",
      }).then((res) => {
        if(res.status==200){
          this.$message.success("编辑成功！");
          that.loadList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 删除
    rowDel(form){
      const that = this
      let arr = []
      arr.push(form.id)
      that.$confirm("此操作将删除该餐厅, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.post(url.v1.hotel.delRstaurantList, arr)
        .then(function (res) {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.loadList()
            }else{
              this.$message.error("操作失败！");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
         
        });
    },

    // 分页条数
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.loadList();
    },

    currentChange(val){
      this.page.currentPage = val;
      this.loadList();
    },

    // 搜索
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.loadList();
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
      that.$confirm("此操作将删除选择的餐厅, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          axios.post(url.v1.hotel.delRstaurantList, ids)
        .then(function (res) {
            console.log(res)
            if(res.status==200){
              this.$message.success("删除成功！");
              that.loadList()
            }else{
              this.$message.error("操作失败！");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        });
    }
  }
}
</script>

<style>
.avue-crud {
  background: #fff;
  padding-top: 10px;
}
</style>
