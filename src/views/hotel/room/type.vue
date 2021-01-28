<template>
  <div>
    <avue-crud
      ref="crud"
      :data="data"
      :option="option"
      :page.sync="page"
      @refresh-change="roomList"
      @size-change="sizeChange"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @current-change="currentChange"
    >
    <template slot="menuLeft">
      <el-button
        type="primary"
        icon="el-icon-delete"
        size="small"
        @click.stop="handleDel()"
      >批量删除</el-button>
    </template>
    <template slot-scope="scope" slot="menu">
      <el-button
        type="text"
        size="small"
        icon="el-icon-view"
        @click.stop="watchChild(scope.row,scope.index)"
      >查看子房型</el-button>
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
export default {
  name: "hotel",
  data() {
    return {
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      deleteId : [],
      searchForm: {},
      data: [],
      hotelId:'',
      hotelName:'',
      option:{
        title:'房型列表',
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
            label:'id',
            prop:'hotelId',
            disabled : true,
            display:false,
            showColumn:false,
          },
          {
            label:'所属酒店',
            prop:'hotelName',
            disabled : true,
            value : ''
          },
          {
            label:'房型名称',
            prop:'roomTypeName',
            rules: [
              {
                required: true,
                message: '请输入房型名称',
                trigger: 'blur'
              }
            ],
          },
          {
            label:'排序',
            prop:'orderby',
            rules: [
              {
                required: true,
                message: '请输入排序',
                trigger: 'blur'
              }
            ],
            sortable:true,
          },
          {
            label:'状态',
            prop:'status',
            type : 'radio',
            dicData:[{
              label:'可用',
              value:1
            },{
              label:'不可用',
              value:0
            }],
            border:true,
          },
          {
            label:'房型缩略图',
            prop:'roomTypeImage',
            type: 'upload',
            listType: 'picture-img',
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
            action: url.v1.upload.file
          },
          {
            label:'房型图集',
            prop:'roomTypeImageList',
            type: 'upload',
            listType: 'picture-card',
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
            showColumn : false,
            row : true,
            span:24,
          }
          
        ],
        group:[
          {
            label: '房型参数',
            prop: 'roomTypeFacilities',
            icon: 'el-icon-edit-outline',
            column: [
              {
                label: '面积大小',
                prop: 'size',
                rules: [
                  {
                    required: true,
                    message: '请输入面积大小',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '楼层',
                prop: 'flour',
                rules: [
                  {
                    required: true,
                    message: '请输入楼层',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '是否有窗',
                prop: 'isWindow',
                type: 'radio',
                border:true,
                dicData:[{
                  label:'是',
                  value:2
                },{
                  label:'否',
                  value:1
                }],
                rules: [
                  {
                    required: true,
                    message: '请选择是否有窗',
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'Wifi',
                prop: 'isWifi',
                type: 'radio',
                border:true,
                dicData:[{
                  label:'免费Wifi',
                  value:2
                },{
                  label:'无Wifi',
                  value:1
                }],
                rules: [
                  {
                    required: true,
                    trigger: 'change',
                    message: '请选择有无Wifi',
                  }
                ],
              },
              {
                label: '床尺寸',
                prop: 'bed',
                rules: [
                  {
                    required: true,
                    message: '请输入床尺寸',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '床型',
                prop: 'bedSize',
                type: 'radio',
                border:true,
                dicData:[{
                  label:'小床',
                  value:1
                },{
                  label:'大床',
                  value:2
                },{
                  label:'超大床',
                  value:3
                }],
                rules: [
                  {
                    required: true,
                    message: '请选择床尺寸',
                    trigger: 'change'
                  }
                ],
              },
              {
                label: '是否含早',
                prop: 'isMorning',
                type: 'radio',
                border:true,
                dicData:[{
                  label:'不含早',
                  value:1
                },{
                  label:'含单早',
                  value:2
                },{
                  label:'含双早',
                  value:3
                },{
                  label:'含三早',
                  value:4
                }],
                rules: [
                  {
                    required: true,
                    message: '请选择是否含早',
                    trigger: 'change'
                  }
                ],
                span:24,
              },
              {
                label: '停车',
                prop: 'isStop',
                type: 'radio',
                border:true,
                dicData:[{
                  label:'免费停车',
                  value:1
                },{
                  label:'停车收费',
                  value:2
                },{
                  label:'不可停车',
                  value:3
                }],
                rules: [
                  {
                    required: true,
                    message: '请选择是否可停车',
                    trigger: 'change'
                  }
                ],
              }
            ]
          }],   
      }
    }
  },
  
  mounted() {},
  created() {
    this.hotelId = this.$route.query.hotelid;
    this.hotelName = this.$route.query.hotelname;
    this.option.column[1].value = this.$route.query.hotelname
    
    this.roomList();
  },
  methods: {
    roomList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        hotelId:this.hotelId
      };
      request({
        url: url.v1.hotel.roomlist,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        for (let i in list){
          list[i].roomTypeFacilities = JSON.parse(list[i].roomTypeFacilities)
          list[i].size = list[i].roomTypeFacilities.size
          list[i].flour = list[i].roomTypeFacilities.flour
          list[i].isWindow = list[i].roomTypeFacilities.isWindow
          list[i].isWifi = list[i].roomTypeFacilities.isWifi
          list[i].bed = list[i].roomTypeFacilities.bed
          list[i].bedSize = list[i].roomTypeFacilities.bedSize
          list[i].isMorning = list[i].roomTypeFacilities.isMorning
          list[i].isStop = list[i].roomTypeFacilities.isStop
          
          list[i].roomTypeImage = list[i].roomTypeImage.split('?')[0]
          if(list[i].roomTypeImageList && list[i].roomTypeImageList!=null){
            let  arr = []
            list[i].roomTypeImageList = list[i].roomTypeImageList.split('!#!')
            for(let j in list[i].roomTypeImageList){
              let obj = {}
              obj.label = ''
              obj.value = list[i].roomTypeImageList[j].split('?')[0]
              arr.push(obj)
            }
            list[i].roomTypeImageList = arr
          }
        }
        this.data = list;
      });
    },

    // 保存新增
    rowSave(form, done, loading){
      const that = this
      let room_type_facilities = {},formdata = {}
      room_type_facilities.size = form.size
      room_type_facilities.flour = form.flour
      room_type_facilities.isWindow = form.isWindow
      room_type_facilities.isWifi = form.isWifi
      room_type_facilities.bed = form.bed
      room_type_facilities.bedSize = form.bedSize
      room_type_facilities.isMorning = form.isMorning
      room_type_facilities.isStop = form.isStop
      room_type_facilities = JSON.stringify(room_type_facilities)
      formdata.roomTypeFacilities = room_type_facilities
      formdata.hotelId = that.hotelId
      formdata.hotelName = that.hotelName
      formdata.roomTypeName = form.roomTypeName
      formdata.orderby = form.orderby
      formdata.roomTypeImage = form.roomTypeImage + '?x-image-process=image/quality,q_80'
      formdata.status = form.status
      let img = form.roomTypeImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      formdata.roomTypeImageList = arr
      request({
        url: url.v1.hotel.addroom,
        data: formdata,
        method: "post",
      }).then((res) => {
        if(res.status==200){
          this.$message.success("添加成功！");
          that.roomList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 保存编辑
    rowUpdate(form, index, done, loading){
      const that = this
      let room_type_facilities = {},formdata = {}
      formdata.id = form.id,
      formdata.operationType = 1
      room_type_facilities.size = form.size
      room_type_facilities.flour = form.flour
      room_type_facilities.isWindow = form.isWindow
      room_type_facilities.isWifi = form.isWifi
      room_type_facilities.bed = form.bed
       room_type_facilities.bedSize = form.bedSize
      room_type_facilities.isMorning = form.isMorning
      room_type_facilities.isStop = form.isStop
      room_type_facilities = JSON.stringify(room_type_facilities)
      formdata.roomTypeFacilities = room_type_facilities
      formdata.hotelId = that.hotelId
      formdata.hotelName = that.hotelName
      formdata.roomTypeName = form.roomTypeName
      formdata.orderby = form.orderby
      formdata.roomTypeImage = form.roomTypeImage + '?x-image-process=image/quality,q_80'
      formdata.status = form.status
      let img = form.roomTypeImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      formdata.roomTypeImageList = arr
      request({
        url: url.v1.hotel.updateroom,
        data: formdata,
        method: "post",
      }).then((res) => {
        // console.log(res)
        if(res.status==200){
          this.$message.success("编辑成功！");
          that.roomList()
        }else{
          this.$message.error("操作失败！");
        }
        done()
      });
    },

    // 删除
    rowDel(form){
      const that = this
      that.$confirm("此操作将删除该房型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.hotel.updateroom,
            data: {
              id :form.id,
              isDelete : 1,
              operationType : 2
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.roomList()
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

    watchChild(row,index){
      this.$router.push({
        path: "/roomlist/index",
        query: { roomid: row.id ,roomname:row.roomTypeName,hid:row.hotelId,hname:row.hotelName},
      });
    },

    

    // 分页条数
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.roomList();
    },

    // 搜索
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      
      console.log(params)
      this.searchForm = params;
      this.roomList();
    },

    // 多选
    selectionChange(list){
      this.deleteId = list.map(item => item.id);
    },
    currentChange(val){
      this.page.currentPage = val;
      this.hotelList();
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
      that.$confirm("此操作将删除选择的主房型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.post(url.v1.hotel.delAllRoom, ids)
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
  }
}
</script>

<style>
.avue-crud {
  background: #fff;
  padding-top: 10px;
}
</style>
