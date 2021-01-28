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
        disabled:false,
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
            label: "队伍ID",
            prop: "teamId",
            display: false,
            search: true,
          },
          {
            label: "队伍名称",
            prop: "teamName",
            display: false,
          },
          {
            label: "周数",
            prop: "weekNum",
            type: "select",
            search: true,
            dicUrl: url.v1.match.weekNumList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "统计开始时间",
            prop: "startDate",
            display: false,
          },
          {
            label: "统计结束时间",
            prop: "endDate",
            display: false,
          },
          {
            label: "负责人电话",
            prop: "phone",
            display: false,
          },
          {
            label: "赛区",
            prop: "cityId",
            display: false,
            search: true,
            type: "select",
            dicUrl: url.v1.match.getMatchAreaList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "赛制阶段",
            prop: "sectionId",
            display: false,
            type: "select",
            search: true,
            dicUrl: url.v1.match.getMatchSectionList,
            dicMethod: "post",
            dicQuery: {
              id: this.$route.query.id,
            },
          },
          {
            label: "作品封面",
            prop: "pic",
            display: false,
            type: "upload",
            listType: "picture-img",
            propsHttp: {
              res: "data",
            },
            display: false,
          },
          {
            label: "本周得票数",
            prop: "weekTicket",
            display: false,
          },
          {
            label: "排名",
            prop: "prizeRank",
            display: false,
          },
          {
            label: "晋级",
            prop: "promotionFlag",
            display: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
            }],
            search: true,
            type: "select",
          },
          {
            label: "奖金",
            prop: "prizeAmount",
            display: false,
          },
        ],
      },
    };
  },
    created() {
        this.matchId = this.$route.query.id;
        this.awardsList();
    },
    mounted() {},
    computed: {
        ...mapGetters(["permission"]),
    },
    props: [],
    methods:{
        awardsList(){
            var data = {
                matchId: this.matchId,
                page: this.page.currentPage,
                limit: this.page.pageSize,
            };
            request({
                url: url.v1.match.prizeRecordList,
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
            this.awardsList();
        },
        
        refreshChange() {
            this.awardsList();
        },

        selectionChange(list) {
            this.deleteId = list.map((item) => item.id).join(",");
        },
        
        currentChange(val) {
            this.page.currentPage = val;
            this.awardsList();
        },

        searchChange(params, done) {
            done();
            this.page.currentPage = 1;
            this.page.pageSize = this.page.pageSize;
            this.searchForm = params;
            this.awardsList();
        },
    }
  };
</script>

<style>
</style>
