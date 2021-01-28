<template>
  <div>
    <basic-container>
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :page.sync="page"
        @row-save="rowSave"
        @row-update="rowUpdate"
        @row-del="rowDel"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @selection-change="selectionChange"
        @size-change="sizeChange"
        @sort-change="sortChange"
        @search-change="searchChange"
      >
        <template slot="speValue" slot-scope="scope">
              <el-tag>{{scope.row.speValue}}</el-tag>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "speGroupList",
  data() {
    return {
      roleId: 0,
      menuList: [],
      searchForm: {},
      spanArr:[],
      position:0,
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      option: {
        border: true,
        selection: true,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "编号",
            prop: "id",
            width: "80",
            display: false
          },
           {
            label: "规格组",
            prop: "groupId",
            searchSpan: 4,
            search: true,
            type: "select",
            dicUrl: url.v1.market.findSpeGroupTree,
          },
          {
            label: "规格值",
            prop: "speValue",
            searchSpan: 4,
            slot:true,
            search: true
          },
          
          
        ],
        group: [
          {
            column: [
        
            ]} 
        ]
          
      }
    }
    },
  created() {
    this.speValue();
  
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
      this.speValue();
    },
    speValue() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize
      };
      request({
        url: url.v1.market.speValueList,
        data: { ...data, ...this.searchForm }
      }).then(res => {
        this.page.total = res.data.total;
        this.data = res.data.list;
        this.rowspan();
      });
    },
    sortChange(val) {
      var data = this.searchForm;
      data["sort_name"] = val.prop;
      data["sort_order"] = val.order;
      this.speValue();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.speValue();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.speValue();
    },
    selectionChange(list) {
      this.deleteId = list.map(item => item.id).join(",");
    },
    refreshChange() {
      this.speValue();
    },
    rowSave(form, done, loading) {
      request({
        url: url.v1.market.addSpeValue,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.speValue();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: url.v1.market.deleteSpeValue,
            method: "POST",
            data: {
              id: form.id
            }
          }).then(res => {
            this.$message.success(res.message);
            this.speValue();
            done();
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
        url: url.v1.market.updateSpeValue,
        method: "POST",
        data: form
      }).then(res => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.speValue();
          done();
        }
      });
    },

  }
};
</script>

<style scoped>
.demo {
  display: inline-block;
  width: 630px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.video-js .vjs-icon-placeholder {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
