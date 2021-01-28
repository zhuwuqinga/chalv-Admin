<template>
  <div>
    <basic-container>
      <el-row :gutter="20">
          <span>
            <avue-crud
              ref="crud"
              :data="data"
              :option="option"
              :page.sync="page"
              @search-change="searchChange"
              @row-save="rowSave"
              @row-update="rowUpdate"
              @row-del="rowDel"
              @current-change="currentChange"
              @refresh-change="refreshChange"
              @selection-change="selectionChange"
              @size-change="sizeChange"
            >
              <template slot="menuLeft">
                <el-button
                  type="primary"
                  icon="el-icon-delete"
                  size="small"
                  @click.stop="handleDel()"
                >批量删除</el-button>
              </template>
              <template slot="status" slot-scope="scope">
                <el-switch
                  name="status"
                  v-model="scope.row.status"
                  @change="statusClick(scope.row, scope.$index)"
                ></el-switch>
              </template>
            </avue-crud>
          </span>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "manageList",
  data() {
    return {
      deleteId: "",
      menuList: [],
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 300,
        column: [
          {
            label: "编号",
            prop: "id",
            display: false
          },
          {
            label: "名称",
            prop: "name",
           
            display: false,
            search: true
          },
          // {
          //   label: "创建人",
          //   prop: "userName",
          //  
          //   display: false
          // },
          {
            label: "备注",
            prop: "remark",
           
            display: false
          },
          {
            label: "禁用",
            prop: "status",
            slot: true,
            width: "80",
            display: false,
            search: true
          },
          {
            label: "添加时间",
            prop: "createAt",
            display: false,
            type: "daterange",
            valueFormat: "yyyy-MM-dd",
            searchSpan: 8,
            searchRange: true,
            search: true
          }
        ],
        group: [
          {
            column: [
              {
                label: "分类名称",
                prop: "name",
                span: 24,
                rules: [
                  { required: true, message: "请输入分类名称", trigger: "blur",}
                ]
              },
               {
                label: "禁用",
                prop: "status",
                type: "switch",
                span: 4
              },
              {
                label: "备注",
                prop: "remark",
                span: 24,
              },
            ]
          }
        ]
      }
    };
  },
  created() {
    this.VideoTypeList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.VideoTypeList();
    },
    VideoTypeList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      let searchData = this.searchForm;
      if(searchData!=null && searchData.createAt != undefined){
           searchData.startTime = searchData.createAt[0];
           searchData.endTime = searchData.createAt[1];
           delete searchData.createAt;
      }
      request({
        url: url.v1.video.videoTypeList,
        data: {...data, ...searchData}
      }).then(res => {
        this.page.total = res.data.count;
         res.data.list.forEach(element => {
         element.status = element.status == 1 ?true:false
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.managerList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.managerList();
    },
    selectionChange(list) {
      this.deleteId = list.map(item => item.id).join(",");
    },
    refreshChange() {
      this.VideoTypeList();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.video.videoTypeEdit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
           this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.VideoTypeList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: url.v1.video.videoTypeDelete,
            method: "POST",
            data: {
              ids: form.id
            }
          }).then(res => {
            this.$message.success(res.message);
            this.VideoTypeList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    rowUpdate(form, index, done, loading) {
      request({
        url: url.v1.video.videoTypeEdit,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.VideoTypeList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request({
              url: url.v1.video.videoTypeDelete,
              method: "POST",
              data: {
                ids: this.deleteId
              }
            }).then(res => {
              this.$message.success(res.message);
              this.VideoTypeList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的分类"
        });
      }
    },
    statusClick(item) {
      request({
        url: url.v1.video.videoTypeUpdateStatus,
        method: "POST",
        data: {
          id: item.id,
          status: item.status === true ? 1 : 0
        }
      }).then(res => {
        if (res.status === 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    nodeClick(data) {
      this.roleId = data.value;
      this.page.currentPage = 1;
      this.VideoTypeList();
    },
  }
};
</script>

<style>
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
