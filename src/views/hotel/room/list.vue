<template>
  <div>
    <avue-crud
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
      >房态设置</el-button>
    </template>
    <!-- <template v-slot:remarkForm="">
      <avue-array v-model="roomNums" placeholder="请输入房号"></avue-array>
    </template> -->
    </avue-crud>

    <el-dialog title="房态设置" :visible.sync="dialogPriceVisible" append-to-body>
      <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
            <div slot="reference" class="div-Calendar" @click="setPrice(data,date)">
                <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split('-').slice(1).join('-') }}
                <i :class="[data.isSelected ?'el-icon-check':'']"></i>
                </p>
                <p>{{priceList[data.day]?'价格：￥'+priceList[data.day]:'暂未设置'}}</p>
            </div>
        </template>
      </el-calendar>
    </el-dialog>
    <el-dialog title="设置价格" :visible.sync="dialogPriceVisible2" append-to-body>
      <el-form
        class="small-space"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="子房型名称" style="width:500px;">
          <el-input v-model="temp.roomName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="日期" style="width:500px;">
          <el-input v-model="temp.calendar" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="截止日期" style="width:500px;" v-if="formtype==0">
          <el-date-picker
            v-model="temp.endCalendar"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="temp.stockCount"></el-input-number>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="temp.price"></el-input-number>
        </el-form-item>
        <el-form-item label="会员价">
          <el-input-number
            v-model="temp.discountPrice"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="一级佣金">
          <el-input-number
            v-model="temp.firstMoney"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="二级佣金">
          <el-input-number
            v-model="temp.twoMoney"
            :max="9999"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="橱窗佣金">
          <el-input-number
            v-model="temp.windowMoney"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.isClosed">
            <el-radio label="可用" value="0"></el-radio>
            <el-radio label="不可用" value="1"></el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="display: flex;">
          <el-button style="margin-left:auto;" @click="dialogPriceVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="putPrice">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import configObj from "@/../vue.config.js";
import qs from 'qs'
import axios from 'axios'
export default {
  name: "room",
  data() {
    return {
      formtype : 0,
      columnObj : {},
      temp: {
        hotelId :'',
        hotelName:'',
        roomTypeId:'',
        roomTypeName:'',
        roomId:'',
        roomName:'',
        calendar:'',
        stockCount:'',
        isClosed : '',
        price : '',
        discountPrice:'',
        firstMoney:'',
        twoMoney:'',
        windowMoney:'',
        endCalendar :''
      },
      roomid : 0,
      priceList : [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      dialogPriceVisible : false,
      dialogPriceVisible2 :false,
      deleteId : [],
      searchForm: {},
      radioObj : {
        isMorning : 1
      },
      data: [],
      roomNums:[''],
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
        menuWidth : '300',
        column:[
          {
            label:'所属酒店',
            prop:'hotelName',
            disabled : true,
            value : ''
          },
          {
            label:'所属主房型',
            prop:'roomTypeName',
            disabled : true,
            value : ''
          },
          {
            label:'房型名称',
            prop:'roomName',
            rules: [
              {
                required: true,
                message: '请输入房型名称',
                trigger: 'blur'
              }
            ],
          },
          
          {
            label:'状态',
            prop:'status',
            type: 'radio',
              border:true,
              dicData:[{
                label:'可用',
                value:1
              },{
                label:'不可用',
                value:0
              }],
              rules: [
                {
                  required: true,
                  message: '请选择状态',
                  trigger: 'change'
                }
              ]
          },
          {
            label:'是否关联橱窗',
            prop:'isWindowHotel',
            type: 'radio',
              border:true,
              dicData:[{
                label:'是',
                value:1
              },{
                label:'否',
                value:0
              }],
              rules: [
                {
                  required: true,
                  message: '请选择是否关联橱窗',
                  trigger: 'change'
                }
              ]
          },
          {
            label:'价格',
            prop:'marketPrice',
            display:false,
            sortable:true
          },
          {
            label:'销量',
            prop:'salesrCount',
            display:false,
            sortable:true
          },
          {
            label:'库存',
            prop:'count',
            rules: [
              {
                required: true,
                message: '请输入库存',
                trigger: 'blur'
              }
            ],
            sortable:true
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
          },{
            label:'房型缩略图',
            prop:'roomChildImage',
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
            action: url.v1.upload.file,
            span : 24
          },
          {
            label:'房型轮播图',
            prop:'roomChildImageList',
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
            span:24,
            showColumn:false,
          }
        ],
        group: [
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
                    message: '请选择有误Wifi',
                    trigger: 'change'
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
                
              },
            ]
          },
          {
            label: '房型价格',
            prop: 'price',
            icon: 'el-icon-edit-outline',
            column: [
              {
                label: '价格',
                prop: 'marketPrice',
                rules: [
                  {
                    required: true,
                    message: '请输入价格',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '会员价',
                prop: 'salePrice',
                rules: [
                  {
                    required: true,
                    message: '请输入会员价',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '一级分销',
                prop: 'firstMoney',
                rules: [
                  {
                    required: true,
                    message: '请输入一级分销价',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '二级分销',
                prop: 'twoMoney',
                rules: [
                  {
                    required: true,
                    message: '请输入二级分销价',
                    trigger: 'blur'
                  }
                ],
              },
              {
                label: '橱窗分销',
                prop: 'windowMoney',
                rules: [
                  {
                    required: true,
                    message: '请输入橱窗分销价',
                    trigger: 'blur'
                  }
                ],
              },
            ]
          },
          {
            label: '房型关联',
            prop: 'room',
            column: [
              {
                label: '关联房号',
                prop: 'remark'
              }
            ],
          }
          
        ]
      }
    }
  },
  created() {
    this.roomid = this.$route.query.roomid;
    this.temp.roomTypeId = this.$route.query.roomid;
    this.temp.roomTypeName = this.$route.query.roomname;
    this.temp.hotelId = this.$route.query.hid;
    this.temp.hotelName = this.$route.query.hname;
    this.option.column[0].value = this.$route.query.hname
    this.option.column[1].value = this.$route.query.roomname
    this.roomList();
  },
  mounted() {},
  computed: {
    
  },
  props: [],
  methods: {
    // 获取酒店列表
    roomList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        roomTypeId : this.roomid
      };
      request({
        url: url.v1.hotel.childRoomList,
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
          
          list[i].roomChildImage = list[i].roomChildImage.split('?')[0]
          if(list[i].roomChildImageList && list[i].roomChildImageList!=null){
            let  arr = []
            list[i].roomChildImageList = list[i].roomChildImageList.split('!#!')
            for(let j in list[i].roomChildImageList){
              let obj = {}
              obj.label = ''
              obj.value = list[i].roomChildImageList[j].split('?')[0]
              arr.push(obj) 
            }
            list[i].roomChildImageList = arr
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
      formdata.hotelId = that.temp.hotelId
      formdata.hotelName = that.temp.hotelName
      formdata.roomTypeName = that.temp.roomTypeName
      formdata.roomTypeId = that.temp.roomTypeId
      formdata.orderby = form.orderby
      formdata.roomName = form.roomName
      formdata.count = form.count
      formdata.marketPrice = form.marketPrice
      formdata.salePrice = form.salePrice
      formdata.firstMoney = form.firstMoney
      formdata.twoMoney = form.twoMoney
      formdata.windowMoney = form.windowMoney
      formdata.roomChildImage = form.roomChildImage + '?x-image-process=image/quality,q_80'
      formdata.status = form.status
      formdata.isWindowHotel = form.isWindowHotel
      formdata.remark = form.remark
      let img = form.roomChildImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      formdata.roomChildImageList = arr
      request({
        url: url.v1.hotel.addChildRoomList,
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
      formdata.hotelId = that.temp.hotelId
      formdata.hotelName = that.temp.hotelName
      formdata.roomTypeName = that.temp.roomTypeName
      formdata.roomTypeId = that.temp.roomTypeId
      formdata.orderby = form.orderby
      formdata.roomName = form.roomName
      formdata.count = form.count
      formdata.marketPrice = form.marketPrice
      formdata.salePrice = form.salePrice
      formdata.firstMoney = form.firstMoney
      formdata.twoMoney = form.twoMoney
      formdata.windowMoney = form.windowMoney
      formdata.roomChildImage = form.roomChildImage + '?x-image-process=image/quality,q_80'
      formdata.status = form.status
      formdata.isWindowHotel = form.isWindowHotel
      let img = form.roomChildImageList,arr = []
      for(let i in img){
        arr.push(img[i].value+'?x-image-process=image/quality,q_80')
      }
      arr = arr.join('!#!')
      formdata.roomChildImageList = arr
      formdata.remark = form.remark
      request({
        url: url.v1.hotel.updateChildRoomList,
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
      that.$confirm("此操作将删除该酒店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.hotel.updateChildRoomList,
            data: {
              id :form.id,
              isDelete : 1,
              operationType :2
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
      this.columnObj = row
      this.dialogPriceVisible = true
      this.loadRiliList(row.id)
      this.temp.roomName = row.roomName
      this.temp.roomId = row.id
    },

    loadRiliList(id){
      let that = this
      var data = {
        pageNum: this.page.currentPage,
        pageSize: 10000,
        roomId : id
      };
      request({
        url: url.v1.hotel.priceList,
        data: { ...data},
        method: "post",
      }).then((res) => {
        if(res.status==200){
          let list = res.data.list,array = [],arr = []
          for(let i in list){
            arr[list[i].calendar] = list[i].price
          }
          that.priceList = arr
          // that.temp.hotelId  = res.data.list[0].hotelId
          // that.temp.hotelName  = res.data.list[0].hotelName
          // that.temp.roomTypeId  = res.data.list[0].roomTypeId
          // that.temp.roomTypeName  = res.data.list[0].roomTypeName
          // that.temp.roomId  = res.data.list[0].roomId
          // that.temp.roomName  = res.data.list[0].roomName
        }else{
          
        }
      });
    },

    loadRiliList2(id,date){
      let that = this
      var data = {
        // pageNum: this.page.currentPage,
        // pageSize: this.page.pageSize,
        roomId : id,
        calendar : date
      };
      request({
        url: url.v1.hotel.priceList,
        data: { ...data},
        method: "post",
      }).then((res) => {
        if(res.status==200){
          if(res.data.list.length>0){
            that.temp.stockCount  = res.data.list[0].stockCount
            that.temp.price  = res.data.list[0].price
            that.temp.discountPrice  = res.data.list[0].discountPrice
            that.temp.firstMoney  = res.data.list[0].firstMoney
            that.temp.twoMoney  = res.data.list[0].twoMoney
            that.temp.windowMoney  = res.data.list[0].windowMoney
            that.temp.isClosed  = res.data.list[0].isClosed==0?'可用':'不可用'
            that.temp.id = res.data.list[0].id
            that.formtype = 1
          }else{
            that.temp.stockCount  = that.columnObj.count
            that.temp.price  = that.columnObj.marketPrice
            that.temp.discountPrice  = that.columnObj.salePrice
            that.temp.firstMoney  = that.columnObj.firstMoney
            that.temp.twoMoney  = that.columnObj.twoMoney
            that.temp.windowMoney  = that.columnObj.windowMoney
            that.temp.isClosed  = '可用'
            that.formtype = 0
          }
        }else{
          
        }
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
      this.searchForm = params;
      this.roomList();
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
      that.$confirm("此操作将删除选择的子房型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.post(url.v1.hotel.delAllChildRoom, ids)
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

    setPrice(data,date){
      this.dialogPriceVisible2 = true
      this.temp.calendar  = data.day
      this.loadRiliList2(this.temp.roomId,data.day)
    },

    currentChange(val){
      this.page.currentPage = val;
      this.hotelList();
    },

    putPrice(){
      let that = this,postUrl = '',dataArr = [],jsonstr = '[',formdata = {}
      that.temp.isClosed=='可用'?that.temp.isClosed = 0 : that.temp.isClosed=1
      if(that.formtype==0){
        postUrl = url.v1.hotel.addHotlePriceList
        dataArr = that.getYearAndMonthAndDay(that.temp.calendar,that.temp.endCalendar)
        console.log(that.temp.calendar)
        console.log(that.temp.endCalendar)
        for(let i in dataArr){
          jsonstr += '{"hotelId":"'+that.temp.hotelId+'","hotelName":"'+that.temp.hotelName+'","roomTypeId":"'+that.temp.roomTypeId+'","roomTypeName":"'+that.temp.roomTypeName+'","roomId":"'+that.temp.roomId+'","roomName":"'+that.temp.roomName+'","calendar":"'+dataArr[i]+'","stockCount":"'+that.temp.stockCount+'","isClosed":"'+that.temp.isClosed+'","price":"'+that.temp.price+'","discountPrice":"'+that.temp.discountPrice+'","firstMoney":"'+that.temp.firstMoney+'","twoMoney":"'+that.temp.twoMoney+'","windowMoney":"'+that.temp.windowMoney+'"},'
        }
        jsonstr = jsonstr.substring(0,jsonstr.length-1)
        jsonstr = jsonstr + ']'
      }else{
        postUrl = url.v1.hotel.updateHotlePriceList
        jsonstr += '{"id":"'+that.temp.id+'","hotelId":"'+that.temp.hotelId+'","hotelName":"'+that.temp.hotelName+'","roomTypeId":"'+that.temp.roomTypeId+'","roomTypeName":"'+that.temp.roomTypeName+'","roomId":"'+that.temp.roomId+'","roomName":"'+that.temp.roomName+'","calendar":"'+that.temp.calendar+'","stockCount":"'+that.temp.stockCount+'","isClosed":"'+that.temp.isClosed+'","price":"'+that.temp.price+'","discountPrice":"'+that.temp.discountPrice+'","firstMoney":"'+that.temp.firstMoney+'","twoMoney":"'+that.temp.twoMoney+'","windowMoney":"'+that.temp.windowMoney+'"}'
        jsonstr = jsonstr + ']'
      }
      formdata = JSON.parse(jsonstr)
      axios.post(postUrl, formdata)
      .then(function (res) {
        that.dialogPriceVisible2 = false
        if(res.data.status==200){
          that.$message.success("保存成功！");
          that.loadRiliList(that.temp.roomId)
        }else{
          that.$message.error("操作失败！");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    getYearAndMonthAndDay(begin,end){
        let that = this
        var arr = [];
　　　　var str_b = begin.split("-");
　　　　var str_e = end.split("-");
　　　　var date_b = new Date();
　　　　date_b.setUTCFullYear(str_b[0], str_b[1] - 1, str_b[2]);
　　　　var date_e = new Date();
　　　　date_e.setUTCFullYear(str_e[0], str_e[1] - 1, str_e[2]);
　　　　var unixDb = date_b.getTime() - 24 * 60 * 60 * 1000;
　　　　var unixDe = date_e.getTime() - 24 * 60 * 60 * 1000;
　　　　for (var j = unixDb; j <= unixDe;) { 
　　　　　　j = j + 24 * 60 * 60 * 1000;
          let date = new Date(parseInt(j))
          let year = date.getFullYear()
          let month = date.getMonth()+1,day=date.getDate()
          month = month>9 ? month : '0'+month
          day = day>9 ? day : '0'+day
          let dateItem = year + '-' + month + '-' + day
          arr.push(dateItem)
　　　　}
　　　　return arr;
      }
    }
  }
</script>

<style>
.avue-crud {
  background: #fff;
  padding-top: 10px;
}
.dialog-footer{
  
  margin-left: auto;
}
</style>
