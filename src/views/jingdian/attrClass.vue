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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
    >
    <!-- <template slot="menuLeft">
      <el-button type="primary" icon="el-icon-delete" size="small" @click.stop="handleDel">批量删除</el-button>
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
export default {
  name: "attrClass",
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
      option:{
        title:'类型列表',
        page:true,
        align:'center',
        menuAlign:'center',
        columnBtn : false,
        border:true,
        indexLabel:'序号',
        index:true,
        labelWidth : '130',
        viewBtn: true,
        column:[
          {
            label:'类型名称',
            prop:'type',
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
            dicData: [{
              label: '可用',
              value: 1
            }, {
              label: '不可用',
              value: 0
            }],
            type: 'radio',
            border:true,
            rules: [
              {
                required: true,
                message: '请选择状态',
                trigger: 'blur'
              }
            ],
          },{
            label: "排序",
            prop: "orderby",
            sortable:true
          },{
            label: "类型说明",
            prop: "remark",
            rules: [
              {
                required: true,
                message: '请输入类型说明',
                trigger: 'blur'
              }
            ],
            showColumn:false,
            row : true,
          },{
            label:'类型图标',
            prop:'icon',
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
          }
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
  props: [],
  methods: {
    // 获取酒店列表
    loadList(){
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.scenic.classList,
        data: { ...data, ...this.searchForm },
        method: "post",
      }).then((res) => {
        this.page.total = res.data.total;
        let list = res.data.list
        for (let i in list){
          list[i].icon = list[i].icon.split('?')[0]
        }
        this.data = list;
      });
    },

    // 保存新增
    rowSave(form, done, loading){
      const that = this
      form.icon = form.icon+'?x-image-process=image/quality,q_80'
      request({
        url: url.v1.scenic.addSpots,
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
      console.log(form)
      form.icon = form.icon+'?x-image-process=image/quality,q_80'
      request({
        url: url.v1.scenic.updateSpots,
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
      }).catch((res)=>{
        done()
      });
    },

    // 删除
    rowDel(form){
      const that = this
      that.$confirm("此操作将删除该类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delSpots,
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
      
      console.log(params)
      this.searchForm = params;
      this.loadList();
    },

    // 多选
    selectionChange(list){
      this.deleteId = list.map(item => item.id).join(",");
    },

    handleDel() {
      let ids = this.deleteId;
      console.log(ids)
      if(ids.length==0){
        this.$message({
          message: '请选择需要删除的数据！',
          type: 'warning'
        });
        return false
      }
      const that = this
      that.$confirm("此操作将删除选择的类型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request({
            url: url.v1.scenic.delSpots,
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
