<template>
  <div>
    <basic-container>

<el-container style="height: 700px;">
  <el-aside>
   <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="menuList"
      show-checkbox
      :props="defaultProps"
      default-expand-all
      empty-text="暂无数据"
      highlight-current
      check-strictly
      :filter-node-method="filterNode"
      ref="tree">
    </el-tree>
  </el-aside>
  
  <el-container>
    <el-header class="menu-header" style="text-algin: right;">
       <el-button-group>
            <el-button type="primary"
                      icon="el-icon-plus"
                      size="small"
                      @click.native="handleAdd"
                     >新增</el-button>
            <el-button type="primary"
                      icon="el-icon-edit"
                      size="small"
                      @click.native="handleEdit"
                      >编辑</el-button>
            <el-button type="primary"
                      icon="el-icon-delete"
                      size="small"
                      @click.native="handleDel"
                     >删除</el-button>
          </el-button-group>
    </el-header>
    
    <el-main>
      <avue-form :option="option" ref="form" v-model="form" @submit="submitForm"></avue-form>
    </el-main>
  </el-container>
</el-container>
      <el-row :gutter="20">
          <avue-affix :offset-top="500">
          <el-col :span="5">
            
          </el-col>
          </avue-affix>
          <el-col :span="17">
            <el-main>
              <el-header class="menu-header">
               
              </el-header>
              
            </el-main>
          </el-col>
        </el-row>
    </basic-container>
  </div>
</template>
<script src="https://cdn.bootcss.com/Sortable/1.10.0-rc2/Sortable.min.js"></script>
<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from '@/util/customValidate'
import iconList from '@/const/iconList'
import url from "@/config/url";
export default {
  name: "menu",
  data() {
    var validateName = (rule, value, callback) => {
      setTimeout(() => {
        request({
          url: url.v1.menu.checkName,
          data: {
            id: this.form.id || 0,
            name: value
          }
        }).then(res => {
          if (res.data) {
            callback(new Error('别名已存在'));
          } else {
            callback();
          }
        });
      }, 1000);
    };
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuList: [],
      form: {
        sort_id: 99
      },
      option: {
        submitBtn: false,
        emptyBtn: false,
        card: false,
        submitText: '完成',
        column: [
          {
            label: "上级菜单",
            prop: "parentId",
            type: "select",
            span: 24,
            dicUrl: url.v1.naction.selectOptions,
            valueDefault: "0",
            rules: [
              {
                required: true,
                message: '请选择上级菜单',
                trigger: 'change'
              }
            ]
          },
          {
            label: "是否隐藏",
            prop: "isLock",
            type: "switch",
            span: 24,
            dicData: [
              {
                label: '否',
                value: 0
              }, {
                label: '是',
                value: 1
              }
            ]
          },
          {
            label: "调用别名",
            prop: "name",
            span: 24,
            rules: [
              { required: true, message: '请输入调用别名', trigger: 'blur' },
              // validator: validateName,
            ]
          },
          {
            label: "导航标题",
            prop: "title",
            span: 24
          },
          {
            label: "副标题",
            prop: "subTitle",
            span: 24
          },
          {
            label: "图标",
            prop: "iconUrl",
            type: 'icon-select',
            span: 24,
            iconList: iconList,
            rules: [
              { required: true, message: '请选择图标', trigger: 'change' }
            ]
          },
          {
            label: "导航路径",
            prop: "linkName",
            span: 24
          },
          {
            label: "导航地址",
            prop: "linkUrl",
            span: 24
          },
          {
            label: "排序",
            prop: "sortId",
            type: 'number',
            span: 4,
            valueDefault: "99",
            rules: [
              { required: true, message: '请选择排序数字', trigger: 'blur' },
              { validator: customValid.isInteger, trigger: 'blur' }
            ]
          },
          {
            label: "备注说明",
            prop: "remark",
            span: 24
          },
          // {
          //   label: "权限资源",
          //   prop: "actionType",
          //   span: 24,
          //   type: 'select',
          //   drag: true,
          //   multiple: true,
          //   dicUrl: url.v1.menu.accessOptions,
          //   rules: [
          //     { required: true, message: '请选择权限资源', trigger: 'blur' }
          //   ]
          // }
        ]
      }
    };
  },
  created() {
    // this.navSelect();
    this.navList();
  },
  mounted() {

  },
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    // navSelect() {
    //   //上级菜单
    //   request({
    //     url: url.v1.naction.selectOptions,
    //     method:"get"
    //   }).then((res) => {
    //     this.parentList = res.data;
    //   });
    // },
    navList() {
      //左侧菜单
      request({
        url: url.v1.naction.menuLeftList
      }).then((res) => {
        this.menuList = res.data;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleAdd() {
      var node = this.$refs.tree.getCheckedNodes();
      if (node.length > 1) {
        this.$message({
          showClose: true,
          message: "请选择一个需要添加的上级菜单",
          type: "warning"
        });
        return false;
      }
      this.$refs.form.resetForm();
      if (node[0]) {
        this.form["parent_id"] = node[0].id + "";
      } else {
        this.form["parent_id"] = "0";
      }
      this.form["sort_id"] = "99";
      this.option.submitText = "添加";
      this.option.submitBtn = true;
     
    },
    handleEdit() {
      var node = this.$refs.tree.getCheckedNodes();
      if (node.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择菜单",
          type: "warning"
        });
        return false;
      }
      if (node.length > 1) {
        this.$message({
          showClose: true,
          message: "请选择一个需要编辑的菜单",
          type: "warning"
        });
        return false;
      }
      request({
        url: url.v1.naction.details,
        data: {
          id: node[0].value
        }
      }).then((res) => {
        this.form = Object.assign({}, res.data);
        this.option.submitText = "修改";
        this.option.submitBtn = true;
      })
    },
    handleDel() {
      this.$confirm(`是否确认删除该数据吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var node = this.$refs.tree.getCheckedNodes();
          let arr = node.map(item=>item.value).join(",");
          request({
            url: url.v1.naction.delete,
            method: "POST",
            data: {
              ids: arr
            }
          }).then((res) => {
            this.$message.success(res.message);
            this.navList();
          })
        })
        .catch(() => { });
    },
    submitForm(form, done) {
          request({
            url: url.v1.naction.saveOrUpdate,
            method: "POST",
            data: form
          }).then((res) => {
            this.form = form;
            this.navList();
            this.$refs.form.init(this.option);
            this.$message.success(res.message);
            //this.$store.dispatch("GetTopMenu");
            //this.$store.dispatch("GetMenu");
            this.$refs.form.resetForm();
            setTimeout(() => {
              done()
            }, 1000)
          });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  padding: 8px 30px;
}
.el-aside {
  width: 200px !important;
}
</style>
