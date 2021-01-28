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
            @row-save="rowSave"
            @row-update="rowUpdate"
            @row-del="rowDel"
            @search-change="searchChange"
            @current-change="currentChange"
            @refresh-change="refreshChange"
            @selection-change="selectionChange"
            @size-change="sizeChange"
            :upload-before="uploadBefore"
            :upload-after="uploadAfter"
            :upload-error="uploadError"
          >
            <!--按钮自定义--->
            <template slot="menuLeft">
              <el-button type="primary" size="small" @click.stop="shelvesBatchIds(1)">批量上架</el-button>
              <el-button type="primary" size="small" @click.stop="shelvesBatchIds(0)">批量下架</el-button>
              <el-button type="primary" size="small" @click.stop="deleteByIds()">批量删除</el-button>
            </template>
            <!--列表按钮自定义--->
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="showDialog(scope.row)"
              >设置规格</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="showSpeDialog(scope.row)"
              >查看规格</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="addWindow(scope.row)"
              >添加到橱窗</el-button>
            </template>
            <!--列表自定义--->
            <template slot="goodsStatus" slot-scope="scope">
              <el-tag>{{status[scope.row.goodsStatus]}}</el-tag>
            </template>
            <!--表单自定义-->
            <!--end-->
          </avue-crud>

          <!-- 设置规格弹框 -->
          <dialog-bar v-model="sendVal" v-if="sendVal"></dialog-bar>

          <el-dialog
            title="查看规格"
            width="80%"
            :visible.sync="speVisible"
            :show-close="false"
            append-to-body
          >
            <avue-crud
              ref="speCrud"
              :data="speData"
              :option="speOption"
              :page.sync="spePage"
              @row-update="speRowUpdate"
              @row-del="speRowDel"
              @search-change="searchChange"
              @current-change="currentChange"
              @refresh-change="refreshChange"
              @selection-change="selectionChange"
              @size-change="sizeChange"
            ></avue-crud>
            <el-button @click.stop="speVisible =false">取消</el-button>
          </el-dialog>
        </span>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dialogBar from "./setSpecifications";
import { request } from "@/util/request";
import { calcDescartes } from "@/util/util";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "goodstList",
  components: {
    "dialog-bar": dialogBar,
  },
  data() {
    return {
      sendVal: false,
      optionChildData: [],
      blackForm: {
        checkedCities: [],
      },
      speData: [],
      queryData: [],
      values: [], // 存储value的数组
      labels: [], // 存储label的数组
      innerVisible: false,
      speVisible: false,
      checkedCities: [],
      form: {
        checkedCities: [],
        info: [],
        idValues: [],
        goodId: undefined,
      },
      obj: {},
      row: {
        goodsTypeId: "",
      },
      speGroupList: {},
      speChildList: [],
      dialogFormVisible: false,
      deleteId: "",
      searchForm: {},
      speData: [],
      data: [],
      spePage: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      status: ["下架", "上架"],
      speOption: {
        addBtn: false,
        title: "规格列表",
        selection: true,
        stripe: true,
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        column: [
          {
            width: 200,
            label: "规格名称",
            prop: "spe",
            display: false,
          },
          {
            label: "规格单价",
            prop: "spePrice",
            display: false,
          },
          {
            label: "规格库存",
            prop: "speStock",
            display: false,
          },
          {
            label: "会员价",
            prop: "goodsMemberPrice",
            display: false,
          },
          {
            label: "一级佣金",
            prop: "goodsFirstMoney",
            display: false,
          },
          {
            label: "二级佣金",
            prop: "goodsTwoMoney",
            display: false,
          },
          {
            label: "橱窗佣金",
            prop: "goodsWindowMoney",
            display: false,
          },
        ],
        group: [
          {
            column: [
              {
                width: 200,
                label: "规格名称",
                prop: "spe",
                disabled: true,
                row: true,
              },
              {
                label: "规格单价",
                prop: "spePrice",
                dataType: "number",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                value: 0,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入规格单价",
                    trigger: "blur",
                  },
                ],
                maxRows: 9999,
              },
              {
                label: "规格库存",
                prop: "speStock",
                type: "number",
                span: 6,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入规格库存",
                    trigger: "blur",
                  },
                ],
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
              {
                label: "会员价",
                prop: "goodsMemberPrice",
                row: true,
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                rules: [
                  {
                    required: true,
                    message: "请输入会员价",
                    trigger: "blur",
                  },
                ],
                value: 0,
                maxRows: 9999,
              },
              {
                label: "一级佣金",
                prop: "goodsFirstMoney",
                type: "number",
                row: true,
                span: 6,
                precision: 2,
                rules: [
                  {
                    required: true,
                    message: "请输入一级佣金",
                    trigger: "blur",
                  },
                ],
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
              {
                label: "二级佣金",
                row: true,
                prop: "goodsTwoMoney",
                type: "number",
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请输入二级佣金",
                    trigger: "blur",
                  },
                ],
                precision: 2,
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
              {
                label: "橱窗佣金",
                row: true,
                prop: "goodsWindowMoney",
                type: "number",
                span: 6,
                rules: [
                  {
                    required: true,
                    message: "请输入橱窗佣金",
                    trigger: "blur",
                  },
                ],
                precision: 2,
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
            ],
          },
        ],
      },
      option: {
        menuWidth: 400,
        viewBtn: true,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "商品列表",
        align: "center",
        menuAlign: "center",
        dialogTop: 40,
        dialogHeight: 600,
        search: {
          searchSize: "small",
          searchGutter: "10",
        },
        column: [
          {
            label: "商品名称",
            prop: "goodsName",

            display: false,
            // searchLabelWidth:100,
            search: true,
          },
          {
            label: "商品图片",
            prop: "goodsFaceImage",
            type: "img",
            display: false,
          },
          {
            label: "商品分类",
            prop: "goodsTypeId",
            type: "select",
            dicUrl: url.v1.market.listChildTree,
            props: {
              label: "label",
              value: "value",
            },
            display: false,
            search: true,
          },
          {
            label: "供应商",
            prop: "supplierId",
            type: "select",
            dicMethod: "post",
            dicUrl: url.v1.supplier.supplierTree,
            props: {
              label: "label",
              value: "value",
            },
            display: false,
            search: true,
          },
          {
            label: "价格",
            prop: "goodsPrice",
            display: false,
          },
          {
            label: "开始价格",
            prop: "startPrice",
            display: false,
            search: true,
            hide: true,
          },
          {
            label: "结束价格",
            prop: "endPrice",
            display: false,
            search: true,
            hide: true,
          },
          {
            label: "上架时间",
            prop: "goodsImportTime",
            type: "datetime",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            format: "yyyy-MM-dd",
            display: false,
          },
          {
            label: "销量",
            prop: "goodsSales",
            display: false,
            sortable: true,
          },
          {
            label: "排序",
            prop: "sort",
            type: "select",
            dicData: [
              {
                label: "全部",
                value: 0,
              },
              {
                label: "销量最多",
                value: 1,
              },
              {
                label: "访问最高",
                value: 2,
              },
              {
                label: "佣金最高",
                value: 3,
              },
              {
                label: "收藏最多",
                value: 4,
              },
            ],
            display: false,
            hide: true,
          },
          {
            label: "库存",
            prop: "goodsStock",
            display: false,
          },
          {
            label: "状态",
            prop: "goodsStatus",
            type: "select",
            display: false,
            search: true,
            dicData: [
              {
                label: "下架",
                value: 0,
              },
              {
                label: "上架",
                value: 1,
              },
            ],
            slot: true,
          },
        ],
        group: [
          {
            label: "商品基本信息",
            prop: "jbxx",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "商品名称",
                prop: "goodsName",

                rules: [
                  {
                    required: true,
                    message: "请输入商品名称",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "商品分类",
                prop: "goodsTypeId",
                type: "select",
                dicUrl: url.v1.market.listChildTree,
                props: {
                  label: "label",
                  value: "value",
                },
                change: ({ value, column }) => {
                  this.findSpeByTypeIdTree(value);
                  this.findForm(value);
                },
                rules: [
                  {
                    required: true,
                    message: "请选择商品分类",
                    trigger: "select",
                  },
                ],
              },

              {
                label: "商品原价",
                prop: "goodsRealPrice",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                maxRows: 99999,
                rules: [
                  {
                    required: true,
                    message: "请输入商品原价",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "折扣价",
                prop: "goodsPrice",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                maxRows: 99999,
                rules: [
                  {
                    required: true,
                    message: "请输入商品价格",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "会员价",
                prop: "goodsMemberPrice",
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                maxRows: 99999,
                value: 0,
                rules: [
                  { required: true, message: "请输入会员价", trigger: "blur" },
                ],
              },
              {
                label: "库存",
                prop: "goodsStock",
                type: "number",
                span: 6,
                minRows: 0,
                maxRows: 9999,
                value: 0,
                row: true,
                rules: [
                  { required: true, message: "请输入库存", trigger: "blur" },
                ],
              },
              {
                label: "销量",
                prop: "goodsSales",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                maxRows: 9999,
              },
              {
                label: "排序",
                prop: "sort",
                type: "number",
                span: 6,
                maxRows: 9999,
                value: 9999,
                minRows: 1,
              },
              {
                label: "重量",
                prop: "goodsWeight",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                maxRows: 9999,
                rules: [
                  { required: true, message: "请输入重量", trigger: "blur" },
                ],
              },
              {
                label: "单位",
                prop: "goodsUnit",
                span: 6,
                type: "select",
                dicData: [
                  {
                    label: "克",
                    value: "克",
                  },
                  {
                    label: "千克",
                    value: "千克",
                  },
                  {
                    label: "毫升",
                    value: "毫升",
                  },
                  {
                    label: "升",
                    value: "升",
                  },
                  {
                    label: "瓶",
                    value: "瓶",
                  },
                  {
                    label: "枚",
                    value: "枚",
                  },
                ],
                rules: [
                  { required: true, message: "请选择单位", trigger: "select" },
                ],
                row: true,
              },
              {
                label: "状态",
                prop: "goodsStatus",
                span: 6,
                type: "switch",

                dicData: [
                  {
                    label: "下架",
                    value: 0,
                  },
                  {
                    label: "上架",
                    value: 1,
                  },
                ],
              },
              {
                label: "包邮",
                prop: "goodsFreePost",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不包邮",
                    value: 0,
                  },
                  {
                    label: "包邮",
                    value: 1,
                  },
                ],
              },
              {
                label: "爆款",
                prop: "goodsHotStatus",
                span: 6,
                type: "switch",
                dicData: [
                  {
                    label: "不推荐",
                    value: 2,
                  },
                  {
                    label: "推荐",
                    value: 1,
                  },
                ],
                row: true,
                hide: true,
              },
              {
                label: "供应商",
                prop: "supplierId",
                type: "select",
                dicMethod: "post",
                dicUrl: url.v1.supplier.supplierTree,
                props: {
                  label: "label",
                  value: "value",
                },
                rules: [
                  {
                    required: true,
                    message: "请选择商品供应商",
                    trigger: "select",
                  },
                ],
              },
              {
                label: "商品图片",
                prop: "goodsFaceImage",
                type: "upload",
                listType: "picture-img",
                span: 24,
                action: url.v1.upload.file,
                rules: [
                  {
                    required: true,
                    message: "请上传商品图片",
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
              {
                label: "商品轮播图",
                prop: "goodsIntroduceImage",
                type: "upload",
                propsHttp: {
                  res: "data",
                },
                span: 24,
                listType: "picture-card",
                rules: [
                  {
                    required: true,
                    message: "请上传商品轮播图片",
                    trigger: "blur",
                  },
                ],
                tip: "只能上传jpg/png文件，且不超过500kb",
                action: url.v1.upload.file,
              },
            ],
          },
          // {
          //   label: "商品规格设置",
          //   prop: "jbxx",
          //   icon: "el-icon-edit-outline",
          //   column: [
          //     {
          //       label: "规格",
          //       prop: "skuName",
          //       span: 6,
          //       formslot: true,
          //       type: "checkbox",
          //     },
          //     {
          //       label: "列表",
          //       prop: "sku",
          //       type: "dynamic",
          //       span: 24,
          //       children: {
          //         align: "center",
          //         headerAlign: "center",
          //         rowAdd: (done) => {
          //           // this.$message.success("新增回调");
          //           done({
          //             skuName: "默认值",
          //           });
          //         },
          //         rowDel: (row, done) => {
          //           // this.$message.success("删除回调" + JSON.stringify(row));
          //           done();
          //         },
          //         column: [
          //           {
          //             width: 200,
          //             label: "规格名称",
          //             prop: "skuName",
          //           },
          //           {
          //             label: "规格单价",
          //             prop: "skuPrice",
          //             dataType: "number",
          //             type: "number",
          //             span: 6,
          //             precision: 2,
          //             minRows: 0,
          //             value: 0,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //           {
          //             label: "规格库存",
          //             prop: "speStock",
          //             type: "number",
          //             span: 6,
          //             minRows: 0,
          //             value: 0,
          //             cell: true,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //           {
          //             label: "会员价",
          //             prop: "goodsMemberPrice",
          //             cell: true,
          //             type: "number",
          //             span: 6,
          //             precision: 2,
          //             minRows: 0,
          //             value: 0,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //           {
          //             label: "一级佣金",
          //             prop: "goodsFirstMoney",
          //             type: "number",
          //             cell: true,
          //             span: 6,
          //             precision: 2,
          //             minRows: 0,
          //             value: 0,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //           {
          //             label: "二级佣金",
          //             cell: true,
          //             prop: "goodsTwoMoney",
          //             type: "number",
          //             span: 6,
          //             precision: 2,
          //             minRows: 0,
          //             value: 0,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //           {
          //             label: "橱窗佣金",
          //             cell: true,
          //             prop: "goodsWindowMoney",
          //             type: "number",
          //             span: 6,
          //             precision: 2,
          //             minRows: 0,
          //             value: 0,
          //             maxRows: 9999,
          //             display: false,
          //           },
          //         ],
          //       },
          //     },
          //   ],
          // },
          {
            label: "商品详情设置",
            prop: "jbxx",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "详情",
                prop: "goodsDetail",
                component: "avueUeditor",
                span: 24,
                options: {
                  //普通图片上传(可配置阿里云oss , 七牛云)
                  action: url.v1.upload.file,
                  //压缩比例
                  canvasOption: {
                    ratio: 0.1,
                  },
                  props: {
                    res: "data",
                    url: "url",
                  },
                },
                rules: [
                  {
                    required: true,
                    message: "请输入详情",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.goodstList();
    // this.findForm();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    showSpeDialog(row) {
      this.row = row;
      request({
        url: url.v1.market.getSkuByGoodId,
        method: "POST",
        data: {
          id: row.id,
        },
      }).then((res) => {
        if (res.status === 200) {
          this.speVisible = true;
          this.speData = res.data.list;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addWindow(row) {
      this.$confirm("此操作将将当前商品添加到橱窗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        request({
          url: url.v1.market.addToWindow,
          method: "POST",
          data: {
            id: row.id,
          },
        }).then((res) => {
          this.$message.success(res.message);
          this.goodstList();
        });
      });
    },
    closeForm() {
      this.$refs.form.resetForm();
      this.dialogFormVisible = false;
    },
    handleCheckedCitiesChange() {
      this.$emit("change", this.checkedCities);
      for (let i = 0; i < this.checkedCities.length; i++) {
        this.values[i] = [];
        this.labels[i] = [];
      }
      for (let index = 0; index < this.checkedCities.length; index++) {
        for (
          let index1 = 0;
          index1 < this.checkedCities[index].length;
          index1++
        ) {
          this.values[index].push(
            this.checkedCities[index][index1].split(":")[0]
          );
          this.labels[index].push(
            this.checkedCities[index][index1].split(":")[1]
          );
        }
      }
    },
    findForm(value) {
      request({
        url: url.v1.market.findSpeGroupTreeForm,
        method: "get",
        data: {
          typeId: value,
        },
      }).then((res) => {
        this.queryData = res.data.list;

        for (let key in res.data.list) {
          this.$set(this.checkedCities, key, []);
        }
      });
    },
    showDialog(row) {
      console.log(row);
      console.log(this.sendVal);
      this.sendVal = !this.sendVal;
      // this.form.goodId = row.id;
    },
    closeInner() {
      this.innerVisible = false;
      for (let index = 0; index < this.checkedCities.length; index++) {
        this.checkedCities[index] = [];
      }
    },
    confirmToBlack() {
      debugger;
      this.form.checkedCities = this.checkedCities;
      this.innerVisible = false;
      let calc = [];
      let labs = [];
      for (let index = 0; index < this.values.length; index++) {
        if (this.values[index].length > 0) {
          labs.push(this.labels[index]);
          calc.push(this.values[index]);
        }
      }
      if (calc.length <= 1 || labs.length <= 1) {
        debugger;
        this.form.info = [];
        this.form.idValues = calc[0];
        for (let j = 0; j < labs.length; j++) {
          for (let i = 0; i < labs[j].length; i++) {
            this.form.info.push({
              skuName: labs[j][i],
              skuPrice: 200,
              speStock: 99,
              goodsMemberPrice: 100,
              goodsFirstMoney: 3.2,
              goodsTwoMoney: 4.5,
              goodsWindowMoney: 5,
            });
          }
        }
      } else {
        let avlues = calcDescartes(calc);
        let labels = calcDescartes(labs);
        this.form.idValues = avlues;
        //生成子表单表格
        this.$message.success("正在添加，请稍后");
        this.form.info = [];
        for (let i = 0; i < labels.length; i++) {
          this.form.info.push({
            skuName: labels[i].join(","),
            skuPrice: 200,
            speStock: 99,
            goodsMemberPrice: 100,
            goodsFirstMoney: 3.2,
            goodsTwoMoney: 4.5,
            goodsWindowMoney: 5,
          });
        }
      }
    },
    submit(form, done) {
      request({
        url: url.v1.market.skuGoodsAdds,
        method: "POST",
        data: this.form,
      }).then((res) => {
        this.$message.success(res.message);
        this.form.info = [];
        this.$refs.form.resetForm();
      });
      setTimeout(() => {
        done();
        this.goodstList();
        this.dialogFormVisible = false;
      }, 3000);
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
    deleteByIds() {
      if (this.deleteId > 0) {
        this.$confirm("此操作将永久删除已选择商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          request({
            url: url.v1.market.deleteByIds,
            method: "POST",
            data: {
              ids: this.deleteId,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.goodstList();
          });
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一个数据",
          type: "warning",
        });
      }
    },
    shelvesBatchIds(status) {
      debugger;
      if (this.deleteId != "") {
        let str = "下架";
        if (status == 1) {
          str = "上架";
        }
        this.$confirm("此操作将永久" + str + "已选择商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          request({
            url: url.v1.market.shelvesBatchIds,
            method: "POST",
            data: {
              ids: this.deleteId,
              status: status,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.goodstList();
          });
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择一个数据",
          type: "warning",
        });
      }
    },
    findSpeByTypeIdTree(typeId) {
      var column = this.option.group[0].column[8];
      //查询规格数据
      request({
        url: url.v1.market.findSpeByTypeIdTree,
        data: {
          typeId: typeId,
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.length <= 0) {
            column.dicData = [];
          } else {
            column.dicData = res.data;
          }
        } else {
          this.$message.error(res.message);
          return false;
        }
      });
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.goodstList();
    },
    goodstList() {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.market.goodsList,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          if (
            element.goodsIntroduceImage != "" &&
            element.goodsIntroduceImage != null &&
            element.goodsIntroduceImage != undefined
          ) {
            element.goodsFaceImage = element.goodsFaceImage.replace(
              /\?x-image-process=image\/quality,q_80/g,
              ""
            );
            element.goodsIntroduceImage = element.goodsIntroduceImage
              .replace(/!#!/g, ",")
              .replace(/\?x-image-process=image\/quality,q_80/g, "");
          }
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.goodstList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.goodstList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.goodstList();
    },
    rowSave(form, done, loading) {
      if (form.goodsStatus == "") {
        form.goodsStatus = 0;
      }
      if (form.goodsFreePost == "") {
        form.goodsFreePost = 0;
      }
      if (form.goodsHotStatus == "") {
        form.goodsHotStatus = 0;
      }
      form.goodsFaceImage =
        form.goodsFaceImage + "?x-image-process=image/quality,q_80";
      for (let index = 0; index < form.goodsIntroduceImage.length; index++) {
        const element = form.goodsIntroduceImage[index];
        element.value = element.value + "?x-image-process=image/quality,q_80";
      }
      form.goodsDetail = form.goodsDetail
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");
      request({
        url: url.v1.market.addGoods,
        method: "POST",
        data: form,
      }).then((res) => {
        this.$message.success(res.message);
        this.goodstList();
        done();
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.market.deleteByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.goodstList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    speRowDel(form) {
      let that = this;
      that
        .$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            url: url.v1.market.deleteSku,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            that.$message.success(res.message);
            request({
              url: url.v1.market.getSkuByGoodId,
              method: "POST",
              data: {
                id: that.row.id,
              },
            }).then((res) => {
              if (res.status === 200) {
                that.speData = res.data.list;
              }
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    speRowUpdate(form, index, done, loading) {
      let that = this;
      request({
        url: url.v1.market.updateSku,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          that.$message.error(res.message);
          loading();
        } else {
          that.$message.success(res.message);
          request({
            url: url.v1.market.getSkuByGoodId,
            method: "POST",
            data: {
              id: that.row.id,
            },
          }).then((res) => {
            if (res.status === 200) {
              that.speData = res.data.list;
            }
          });
          done();
        }
      });
    },
    rowUpdate(form, index, done, loading) {
      if (form.goodsStatus == "") {
        form.goodsStatus = 0;
      }
      if (form.goodsFreePost == "") {
        form.goodsFreePost = 0;
      }
      if (form.goodsHotStatus == "") {
        form.goodsHotStatus = 0;
      }
      form.goodsFaceImage =
        form.goodsFaceImage + "?x-image-process=image/quality,q_80";
      form.goodsIntroduceImage = form.goodsIntroduceImage.replace(
        /,/g,
        "?x-image-process=image/quality,q_80!#!"
      );
      form.goodsIntroduceImage =
        form.goodsIntroduceImage + "?x-image-process=image/quality,q_80";
      form.goodsDetail = form.goodsDetail
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");
      request({
        url: url.v1.market.updateGoods,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.goodstList();
          done();
        }
      });
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
.gg_box /deep/ .el-form-item__content {
  margin-left: 0 !important;
}
</style>
