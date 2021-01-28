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
        :upload-before="uploadBefore"
        :upload-after="uploadAfter"
        :upload-error="uploadError"
        @search-change="searchChange"
      >
        <template slot="status" slot-scope="scope">
          <el-tag>{{scope.row.status == 1 ? "可用":"不可用"}}</el-tag>
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
      searchForm: {},
      recouceType: 0,
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
        column: [
          {
            label: "轮播图",
            prop: "imageUrl",
            type: "img",
            display: false,
          },
          {
            label: "分类",
            prop: "type",
            span: 6,
            type: "select",
            dicData: [
              {
                label: "商城",
                value: 0,
              },
              {
                label: "景点门票",
                value: 1,
              },
              {
                label: "旅游产品",
                value: 2,
              },
              {
                label: "酒店",
                value: 3,
              },
            ],
            display: false,
            search: true,
          },
          {
            label: "排序",
            prop: "sort",
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            type: "select",
            search: true,
            dicData: [
              {
                label: "不可用",
                value: false,
              },
              {
                label: "可用",
                value: true,
              },
            ],
            slot: true,
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                label: "分类",
                prop: "type",
                span: 12,
                type: "select",
                rules: [
                  { required: true, message: "请选择单位", trigger: "select" },
                ],
                change: ({ value, column }) => {
                  let that = this;
                  if (value) {
                    that.recouceType = value;
                  }
                },
                row: true,
              },
              {
                label: "外部连接",
                span: 12,
                prop: "htmlUrl",
                prepend: "http://",
                row: true,
              },
              {
                label: "资源",
                prop: "resourceId",
                type: "table",
                span: 12,
                children: {
                  border: true,
                  column: [
                    {
                      label: "资源名称",
                      search: true,
                      prop: "name",
                    },
                  ],
                },
                onLoad: ({ page, value, data }, callback) => {
                  request({
                    url: url.v1.circle.list,
                    method: "POST",
                    data: {
                      name:data,
                      type: this.recouceType,
                      pageNum: page.currentPage,
                      pageSize: page.pageSize
                    },
                  }).then((res) => {
                      callback(res.data)
                  });
                },
                row: true,
                formatter: (row) => {
                  if (!row.name) return "";
                  return row.name;
                },
                rules: [
                  {
                    required: true,
                    message: "请选择关联的资源",
                    trigger: "blur",
                  },
                ],
                props: {
                  label: "name",
                  value: "id",
                },
              },
              {
                label: "排序",
                prop: "sort",
                type: "number",
                span: 12,
                minRows: 0,
                value: 0,
                maxRows: 9999,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入排序",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "状态",
                prop: "status",
                span: 6,
                type:"select",
                row: true,
                dicData:[
                  {
                    label:"可用",
                    value:true
                  },
                  {
                    label:"不可用",
                    value: false
                  }
                ]
              },
              {
                label: "轮播图",
                prop: "imageUrl",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传轮播图",
                    trigger: "blur",
                  },
                ],
                propsHttp: {
                  res: "data",
                },
                // 压缩比例
                canvasOption: {
                  ratio: 0.1,
                },
                tip: "只能上传jpg/png文件，且不超过2M",
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.carouselList();
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
      this.carouselList();
    },
    carouselList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.carousel.list,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.count;
        res.data.list.forEach((el) => {
          el.imageUrl = el.imageUrl.replace(
            /\?x-image-process=image\/quality,q_80/g,
            ""
          );
        });
        this.data = res.data.list;
      });
    },
    uploadBefore(file, done, loading, column) {
      // 上传文件之前校验图片格式和大小
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2m = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 PNG、JPG 格式!");
        loading();
        return false;
      }
      if (!isLt2m) {
        this.$message.error("上传图片大小不能超过2M!");
        loading();
        return false;
      }
      done(file);
      return true;
    },
    uploadError(error, column) {
      done();
      this.$message.success("上传失败");
    },
    uploadAfter(res, done, loading, column) {
      done();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.carouselList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.carouselList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.carouselList();
    },
    rowSave(form, done, loading) {
      if(form.status){
          form.status = 1;
      }else{
        form.status = 0;
      }
      request({
        url: url.v1.circle.addCarousel,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          done();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.carouselList();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该规格组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.circle.deleteByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.carouselList();
            done();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    rowUpdate(form, index, done, loading) {
       if(!form.status){
          form.status = 0;
      }else{
        form.status = 1;
      }
      form.htmlUrl =  form.htmlUrl;
      request({
        url: url.v1.circle.updateCarousel,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.carouselList();
          done();
        }
      });
    },
  },
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
