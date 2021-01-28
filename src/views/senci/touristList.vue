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
            @current-change="currentChange"
            @size-change="sizeChange"
          >
            <template slot="type" slot-scope="scope">
              <el-tag>{{scope.row.type == 1 ? "旅游产品":"景点门票"}}</el-tag>
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
  name: "hostList",
  data() {
    return {
      permissions: {},
      menuList: [],
      searchForm: {},
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 300,
        addBtn:false,
        editBtn:false,
        delBtn:false,
        menu:false,
        column: [
          {
            label: "编号",
            prop: "id",
            display: false,
          },
          {
            label: "姓名",
            prop: "name",
            search: true,
          },
          {
            label: "证件类型",
            prop: "credentialsType",

            display: false,
          },
          {
            label: "证件号",
            prop: "credentialsNo",
            display: false,
          },
          {
            label: "联系方式",
            prop: "phone",
            display: false,
          },
          {
            label: "用户名称",
            prop: "userName",
            display: false,
          },
          {
            label: "保险类型",
            prop: "type",
            type: "select",
            slot: true,
            display: false,
          },
          {
            label: "添加时间",
            prop: "createdTime",
            display: false,
            type: "datetime",
            valueFormat: "yyyy-MM-dd",
            format: "yyyy-MM-dd hh:mm:ss",
            searchSpan: 8,
            searchRange: true,
          },
        ],
      },
    };
  },
  created() {
    this.insuranceList();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.insuranceList();
    },
    insuranceList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.scenic.touristList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.insuranceList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.insuranceList();
    },
  },
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
