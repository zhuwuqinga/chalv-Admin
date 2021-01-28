<template>
  <div>
    <basic-container>
      <span>
        <avue-crud
          ref="crud"
          :data="data"
          :option="option"
          :page.sync="page"
          @search-change="searchChange"
          @current-change="currentChange"
          @refresh-change="refreshChange"
          @selection-change="selectionChange"
          @size-change="sizeChange"
        >
        </avue-crud>
      </span>

    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import customValid from "@/util/customValidate";
import url from "@/config/url";
import { log } from 'util';
export default {
  name: "hostList",
  data() {
    return {
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        editBtn:false,
        addBtn:false,
        menu:false,
        stripe: true,
        title: "起始地列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "用户ID",
            prop: "userId",
            display: false,
            search: true,
          },
          {
            label: "用户姓名",
            prop: "userName",
            display: false,
          },
          {
            label: "用户头像",
            prop: "headImg",
            display: false,
            type: "upload",
            listType: "picture-img",
          },
          {
            label: "用户手机",
            prop: "userPhone",
            display: false,
          },
          {
            label: "排名",
            prop: "rank",
            display: false,
          },
          {
            label: "总投票数",
            prop: "ticket",
            display: false,
          },
        ],
      },
    };
  },
    created() {
        this.matchId = this.$route.query.id;
        this.rangkingList();
    },
    mounted() {},
    computed: {
        ...mapGetters(["permission"]),
    },
    props: [],
    methods:{
        rangkingList(){
            var data = {
                matchId: this.matchId,
                page: this.page.currentPage,
                limit: this.page.pageSize,
            };
            request({
                url: url.v1.match.getRankList,
                method: "post",
                data: { ...data, ...this.searchForm },
            }).then((res) => {
                this.page.total = res.data.data.total;
                this.data = res.data.data.list;
            });
        },
        
        sizeChange(val) {
            this.page.currentPage = 1;
            this.page.pageSize = val;
            this.rangkingList();
        },
        
        refreshChange() {
            this.rangkingList();
        },

        selectionChange(list) {
            this.deleteId = list.map((item) => item.id).join(",");
        },
        
        currentChange(val) {
            this.page.currentPage = val;
            this.rangkingList();
        },

        searchChange(params, done) {
            done();
            this.page.currentPage = 1;
            this.page.pageSize = this.page.pageSize;
            this.searchForm = params;
            this.rangkingList();
        },
    }
  };
</script>

<style>
</style>
