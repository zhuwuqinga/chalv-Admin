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
              <el-button
                type="primary"
                size="small"
                @click.stop="shelvesBatchIds(1)"
                >批量上架</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click.stop="shelvesBatchIds(0)"
                >批量下架</el-button
              >
              <el-button type="primary" size="small" @click.stop="deleteByIds()"
                >批量删除</el-button
              >
            </template>
            <!--列表按钮自定义--->
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="showDialog(scope.row)"
                >设置规格</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="showSpeDialog(scope.row)"
                >查看规格</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="el-icon-setting"
                @click.stop="addWindow(scope.row)"
                >添加到橱窗</el-button
              >
            </template>

            <template slot="goodsStatus" slot-scope="scope">
              <el-tag>{{
                scope.row.goodsStatus == 1 ? "上架" : "下架"
              }}</el-tag>
            </template>
            <template slot="deleteStatus" slot-scope="scope">
              <el-switch
                name="deleteStatus"
                v-model="scope.row.deleteStatus"
                @change="setIsRecord(scope.row)"
              ></el-switch>
            </template>
          </avue-crud>
          <el-dialog
            title="选择规格"
            :visible.sync="dialogFormVisible"
            width="80%"
            :show-close="false"
            append-to-body
          >
            <avue-form
              ref="form"
              v-model="form"
              :option="formOption"
              @submit="submit"
            >
              <template slot-scope="scope" slot="checkedCities">
                <el-button
                  type="primary"
                  icon="el-icon-share"
                  @click.stop="innerVisible = true"
                  >选择规格</el-button
                >
              </template>
              <template slot-scope="scope" slot="skuNameForm">
                <el-form-item
                  v-for="(item, index) in queryData"
                  :key="index"
                  :label="item.labelProds + ':'"
                >
                  <el-checkbox-group
                    v-model="checkedCities[index]"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox-button
                      v-for="(child, childIndex) in item.childSpe"
                      :key="childIndex"
                      :label="child.pid + ':' + child.name"
                      >{{ child.name }}</el-checkbox-button
                    >
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </avue-form>

            <el-dialog
              width="30%"
              title="选择规格"
              :visible.sync="innerVisible"
              :show-close="false"
              append-to-body
            >
              <el-form ref="form1" :model="blackForm" label-width="80px">
                <el-form-item
                  v-for="(item, index) in queryData"
                  :key="index"
                  :label="item.labelProds + ':'"
                >
                  <el-checkbox-group
                    v-model="checkedCities[index]"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox-button
                      v-for="(child, childIndex) in item.childSpe"
                      :key="childIndex"
                      :label="child.pid + ':' + child.name"
                      >{{ child.name }}</el-checkbox-button
                    >
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click.stop="confirmToBlack"
                    >添加</el-button
                  >
                  <el-button @click.stop="closeInner">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-button @click.stop="dialogFormVisible = false">取消</el-button>
          </el-dialog>

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
            <el-button @click.stop="speVisible = false">取消</el-button>
          </el-dialog>
        </span>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request";
import { calcDescartes } from "@/util/util";
import customValid from "@/util/customValidate";
import url from "@/config/url";
export default {
  name: "presentInfoList",
  data() {
    return {
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
      formOption: {
        dialogClickModal: false,
        emptyBtn: false,
        submitText: "保存",
        emptyText: "取消",
        column: [
          {
            label: "商品分类",
            prop: "goodsTypeId",
            type: "select",
            span: 12,
            row: true,
            dicUrl: url.v1.integralType.listTree,
            rules: [
              { required: true, message: "请输入商品名称", trigger: "select" },
            ],
            change: ({ value, column }) => {
              let that =this;
              that.findForm(value);
            },
          },
          {
            label: "规格",
            prop: "checkedCities",
            formslot: true,
            span: 12,
            type: "checkbox",
            row: true,
            rules: [{ required: true, message: "请选择规格", trigger: "blur" }],
          },
          {
            label: "规格详情",
            prop: "info",
            type: "dynamic",
            span: 24,
            children: {
              align: "center",
              headerAlign: "center",
              rowAdd: (done) => {
                this.$message.success("新增回调");
                done({
                  skuName: "默认值",
                });
              },
              rowDel: (row, done) => {
                // this.$message.success("删除回调" + JSON.stringify(row));
                done();
              },
              column: [
                {
                  width: 200,
                  label: "规格名称",
                  prop: "skuName",
                },
                {
                  label: "规格单价",
                  prop: "skuPrice",
                  dataType: "number",
                  type: "number",
                  span: 6,
                  precision: 2,
                  minRows: 0,
                  value: 0,
                  maxRows: 9999,
                  display: false,
                },
                {
                  label: "规格库存",
                  prop: "speStock",
                  type: "number",
                  span: 6,
                  minRows: 0,
                  value: 0,
                  cell: true,
                  maxRows: 9999,
                  display: false,
                },
                {
                  label: "积分",
                  prop: "goodsIntegral",
                  cell: true,
                  type: "number",
                  span: 6,
                  precision: 2,
                  minRows: 0,
                  value: 0,
                  maxRows: 9999,
                  display: false,
                },
              ],
            },
          },
        ],
      },
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
            label: "积分",
            prop: "goodsIntegral",
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
                label: "积分",
                prop: "goodsIntegral",
                row: true,
                type: "number",
                span: 6,
                precision: 2,
                minRows: 0,
                rules: [
                  {
                    required: true,
                    message: "请输入积分",
                    trigger: "blur",
                  },
                ],
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
        delBtn: false,
        tabs: 1,
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
            dicUrl: url.v1.integralType.listTree,
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
            label: "库存",
            prop: "goodsStock",
            display: false,
          },
          {
            label: "状态",
            prop: "goodsStatus",
            display: false,
            slot: true,
          },
          {
            label: "启用",
            prop: "deleteStatus",
            display: false,
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
                dicUrl: url.v1.integralType.listTree,
                props: {
                  label: "label",
                  value: "value",
                },
                change: ({ value, column }) => {
                  debugger
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
    this.presentInfoList();
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
        url: url.v1.IntegralGoodsSpe.getSkuByGoodId,
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
        url: url.v1.integralGroup.findSpeGroupTreeForm,
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
      this.form.goodId = row.id;
      this.dialogFormVisible = true;
    },
    closeInner() {
      this.innerVisible = false;
      for (let index = 0; index < this.checkedCities.length; index++) {
        this.checkedCities[index] = [];
      }
    },
    confirmToBlack() {
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
        this.form.info = [];
        this.form.idValues = calc[0];
        for (let j = 0; j < labs.length; j++) {
          for (let i = 0; i < labs[j].length; i++) {
            this.form.info.push({
              skuName: labs[j][i],
              skuPrice: 200,
              speStock: 99,
              goodsIntegral: 100,
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
            goodsIntegral: 100,
          });
        }
      }
    },
    submit(form, done) {
      request({
        url: url.v1.IntegralGoodsSpe.skuGoodsAdds,
        method: "POST",
        data: this.form,
      }).then((res) => {
        this.$message.success(res.message);
        this.form.info = [];
        this.$refs.form.resetForm();
      });
      setTimeout(() => {
        done();
        this.presentInfoList();
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
            url: url.v1.integral.delete,
            method: "POST",
            data: {
              ids: this.deleteId,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.presentInfoList();
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
            url: url.v1.integral.shelvesBatchIds,
            method: "POST",
            data: {
              ids: this.deleteId,
              status: status,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.presentInfoList();
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
        url: url.v1.integralGroup.findSpeByTypeIdTree,
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
      this.presentInfoList();
    },
    presentInfoList() {
      var data = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      request({
        url: url.v1.integral.goodsList,
        method: "post",
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        res.data.list.forEach((element) => {
          element.goodsFaceImage = element.goodsFaceImage.replace(
            /\?x-image-process=image\/quality,q_80/g,
            ""
          );
          element.goodsIntroduceImage = element.goodsIntroduceImage
            .replace(/!#!/g, ",")
            .replace(/\?x-image-process=image\/quality,q_80/g, "");
          element.deleteStatus = element.deleteStatus == 0 ? true : false;
        });
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.presentInfoList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.presentInfoList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.presentInfoList();
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
        url: url.v1.integral.add,
        method: "POST",
        data: form,
      }).then((res) => {
        this.$message.success(res.message);
        this.presentInfoList();
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
            url: url.v1.integral.delete,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.presentInfoList();
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
      that.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          request({
            url: url.v1.IntegralGoodsSpe.deleteSku,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            that.$message.success(res.message);
            request({
              url: url.v1.IntegralGoodsSpe.getSkuByGoodId,
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
        url: url.v1.IntegralGoodsSpe.updateSku,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          that.$message.error(res.message);
          loading();
        } else {
          that.$message.success(res.message);
          request({
            url: url.v1.IntegralGoodsSpe.getSkuByGoodId,
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
        url: url.v1.integral.update,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.presentInfoList();
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
