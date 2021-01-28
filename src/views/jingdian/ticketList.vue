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
      >设置价格</el-button>
    </template>
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
        <el-form-item label="门票名称" style="width:500px;">
          <el-input v-model="temp.ticketName" :disabled="true"></el-input>
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
          <el-input-number v-model="temp.stock"></el-input-number>
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
        <el-form-item label="费用说明">
          <el-input
            v-model="temp.priceRemark"
          ></el-input>
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
export default {
  name: "ticketlist",
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
      priceList:[],
      scenicSpotsId : '',
      dialogPriceVisible : false,
      dialogPriceVisible2:false,
      formtype : 0,
      temp: {
        scenicSpotsId:'',
        spotsName:'',
        ticketId :'',
        ticketName:'',
        calendar:'',
        stock:'',
        price : '',
        discountPrice:'',
        firstMoney:'',
        twoMoney:'',
        windowMoney:'',
        priceRemark:'',
        endCalendar :''
      },
      option:{
        title:'类型列表',
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
              label:'所属景点',
              prop:'spotsName',
              disabled:true,
              value:''
            },
            {
            label:'门票类型',
            prop:'typeId',
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
            dicUrl: url.v1.scenic.ticketTypeList,
            dicQuery:{
              scenicSpotsId:''
            },
            dicFormatter:(res)=>{
              return res.data;//返回字典的层级结构
            },
          },
          {
            label:'门票名称',
            prop:'name',
            rules: [
              {
                required: true,
                message: '请输入类型名称',
                trigger: 'blur'
              }
            ],
          },{
            label: "状态",
            prop: "status",
            type: 'radio',
            border:true,
            dicData: [
              {
                label: "可用",
                value: 1,
              },
              {
                label: "不可用",
                value: 0,
              },
            ],
          },{
            label: "入园时间",
            prop: "startTime",
            type: "time",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message: '请选择入园时间',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },
          {
            label: "离开时间",
            prop: "leaveTime",
            type: "time",
            valueFormat: "HH:mm",
            rules: [
              {
                required: true,
                message: '请选择离开时间',
                trigger: 'blur'
              }
            ],
            showColumn:false,
          },{
            label: "门票说明",
            prop: "remark",
            rules: [
              {
                required: true,
                message: '请输入门票说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
            row : true,
          },
          {
            label : "销量",
            prop: 'saleCount',
            sortable:true,
            display:false,
          }
        ]
      }
    }
  },
  created() {
    this.scenicSpotsId = this.$route.query.scenicSpotsId;
    this.option.column[0].value = this.$route.query.scenicSpotsName

    this.option.column[1].dicQuery.scenicSpotsId = this.$route.query.scenicSpotsId
    this.loadList();
  },
  mounted() {},
  computed: {
    
  },
  props: [],
  methods: {
    // 获取酒店列表
    loadList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        scenicSpotsId : this.scenicSpotsId
      };
      request({
        url: url.v1.scenic.ticketList,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        this.data = list;
      });
    },

    // 保存新增
    rowSave(form, done, loading){
      const that = this
      form.scenicSpotsId = that.scenicSpotsId
      form.typeName = form.$typeId
      request({
        url: url.v1.scenic.addTicketList,
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
      form.typeName = form.$typeId
      delete form.createdTime
      request({
        url: url.v1.scenic.updateTicketList,
        data: form,
        method: "post",
      }).then((res) => {
        // console.log(res)
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
      that.$confirm("此操作将删除该门票, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delTicketPriceList,
            data: {
              ids :form.id,
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.loadList()
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
      this.loadList();
    },

    // 页面切换
    currentChange(val) {
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

    // 多选
    selectionChange(list){
      this.deleteId = list.map(item => item.id).join(",");
    },

    handleDel() {
      let ids = this.deleteId;
      if(ids.length==0){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      const that = this
      that.$confirm("此操作将删除选择的门票, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delTicketPriceList,
            data: {
              ids : ids
            },
            method: "post",
          }).then((res) => {
            if(res.status==200){
              this.$message.success("删除成功！");
              that.loadList()
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
      this.dialogPriceVisible = true
      this.temp.ticketId = row.id
      this.temp.ticketName = row.name
      this.temp.scenicSpotsId = row.scenicSpotsId
      this.temp.spotsName = row.spotsName
      this.loadRiliList()
    },
    loadRiliList(){
      let that = this
      var data = {
        pageNum: 1,
        pageSize: 99999,
        scenicSpotsId : this.temp.scenicSpotsId,
        spotsName : this.temp.spotsName,
        ticketId : this.temp.ticketId,
        ticketName : this.temp.ticketName
      };
      // console.log(data)
      request({
        url: url.v1.scenic.ticketPriceList,
        data: { ...data},
        method: "post",
      }).then((res) => {
        if(res.status==200){
          let list = res.data.list,array = [],arr = []
          for(let i in list){
            arr[list[i].calendar] = list[i].price
          }
          that.priceList = arr
        }else{
          
        }
      });
    },
    setPrice(data,date){
      this.dialogPriceVisible2 = true
      this.temp.calendar  = data.day
      this.loadRiliList2(this.temp.roomId,data.day)
    },

    loadRiliList2(id,date){
      let that = this
      var data = {
        pageNum: '',
        pageSize: '',
        scenicSpotsId : this.temp.scenicSpotsId,
        spotsName : this.temp.spotsName,
        ticketId : this.temp.ticketId,
        ticketName : this.temp.ticketName,
        calendar : date
      };
      request({
        url: url.v1.scenic.ticketPriceList,
        data: { ...data},
        method: "post",
      }).then((res) => {
        if(res.status==200){
          if(res.data.list.length>0){
            that.temp.stock  = res.data.list[0].stock
            that.temp.price  = res.data.list[0].price
            that.temp.discountPrice  = res.data.list[0].discountPrice
            that.temp.firstMoney  = res.data.list[0].firstMoney
            that.temp.twoMoney  = res.data.list[0].twoMoney
            that.temp.windowMoney  = res.data.list[0].windowMoney
            that.temp.priceRemark = res.data.list[0].priceRemark
            that.temp.id = res.data.list[0].id
            that.formtype = 1
          }else{
            that.temp.stock  = ''
            that.temp.price  = ''
            that.temp.discountPrice  = ''
            that.temp.firstMoney  = ''
            that.temp.twoMoney  = ''
            that.temp.windowMoney  = ''
            that.temp.priceRemark = ''
            that.formtype = 0
          }
        }
      })
    },
    putPrice(){
      let that = this,postUrl = '',dataArr = [],jsonstr = '[',formdata = {}
      that.temp.isClosed=='上架'?that.temp.isClosed = 0 : that.temp.isClosed=1
      if(that.formtype==0){
        postUrl = url.v1.scenic.addTicketPriceList
        dataArr = that.getYearAndMonthAndDay(that.temp.calendar,that.temp.endCalendar)
        for(let i in dataArr){
          jsonstr += '{"scenicSpotsId":"'+that.temp.scenicSpotsId+'","ticketId":"'+that.temp.ticketId+'","calendar":"'+dataArr[i]+'","stock":"'+that.temp.stock+'","price":"'+that.temp.price+'","discountPrice":"'+that.temp.discountPrice+'","firstMoney":"'+that.temp.firstMoney+'","twoMoney":"'+that.temp.twoMoney+'","windowMoney":"'+that.temp.windowMoney+'","priceRemark":"'+that.temp.priceRemark+'"},'
        }
        jsonstr = jsonstr.substring(0,jsonstr.length-1)
        jsonstr = jsonstr + ']'
      }else{
        postUrl = url.v1.scenic.updateTicketPriceList
        jsonstr += '{"id":"'+that.temp.id+'","scenicSpotsId":"'+that.temp.scenicSpotsId+'","ticketId":"'+that.temp.ticketId+'","calendar":"'+that.temp.calendar+'","stock":"'+that.temp.stock+'","price":"'+that.temp.price+'","discountPrice":"'+that.temp.discountPrice+'","firstMoney":"'+that.temp.firstMoney+'","twoMoney":"'+that.temp.twoMoney+'","windowMoney":"'+that.temp.windowMoney+'","priceRemark":"'+that.temp.priceRemark+'"}'
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
</style>
