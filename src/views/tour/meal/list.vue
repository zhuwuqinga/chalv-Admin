<template>
  <div>
    <basic-container>
      <span>
        <avue-crud
          ref="crud"
          v-model="crud"
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
          :before-open="beforeOpen"
          :upload-before="uploadBefore"
          :upload-after="uploadAfter"
          :upload-error="uploadError"
        >
          <template slot="menuLeft">
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="small"
              @click.stop="handleDel()"
            >批量删除</el-button>
          </template>
          <template slot-scope="scope" slot="prcieForm">
            <el-calendar>
              <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
              <template slot="dateCell" slot-scope="{date, data}">
                <div slot="reference" class="div-Calendar" @click="setPrice(data,date)">
                  <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                    <i
                      :class="[data.isSelected ?'el-icon-check':'']"
                    ></i>
                    <!--<i v-if="_.indexOf(isArrange, data.day)>0" class="el-icon-s-claim"></i>-->
                    <!-- <i class="el-icon-coffee-cup"></i> -->
                  </p>
                </div>
              </template>
            </el-calendar>
          </template>
          <template slot="status" slot-scope="scope">
            <el-tag>{{scope.row.status == true ?"可用":"不可用"}}</el-tag>
          </template>
        </avue-crud>
        <el-dialog title="设置价格" :visible.sync="dialogPriceVisible" append-to-body>
          <el-form
            class="small-space"
            :model="temp"
            label-position="left"
            label-width="100px"
            style="width: 500px; margin-left:50px;"
          >
            <el-form-item label="原价">
              <el-input-number v-model="temp.price" :precision="2" :step="0.1" :min="1" :max="9999"></el-input-number>
            </el-form-item>
            <el-form-item label="折扣价">
              <el-input-number
                v-model="temp.discountPrice"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="9999"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="库存">
              <el-input-number v-model="temp.stock" :min="1" :max="99999"></el-input-number>
            </el-form-item>
            <el-form-item label="一级佣金">
              <el-input-number
                v-model="temp.productFirstMoney"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="9999"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="二级佣金">
              <el-input-number
                v-model="temp.productTwoMoney"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="9999"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="橱窗佣金">
              <el-input-number
                v-model="temp.productWindowMoney"
                :precision="2"
                :step="0.1"
                :min="1"
                :max="9999"
              ></el-input-number>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPriceVisible = false">取 消</el-button>
            <el-button type="primary" @click="putPrice">确 定</el-button>
          </div>
        </el-dialog>
      </span>
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
      priceDate: "2020-01-01",
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400 * 1000;
        },
      },
      crud: {},
      dialogPriceVisible: false,
      priceList: new Map(),
      viewType: "",
      row: undefined,
      deleteId: "",
      temp: {
        name: undefined,
        data: undefined,
        is_part: 0,
      },
      statusLabel: ["不可用", "可用"],
      permissions: {},
      searchForm: {},
      TimeData: undefined,
      data: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
      },
      option: {
        tabs: true,
        tabsActive: 1,
        menuWidth: 300,
        dialogClickModal: false,
        selection: true,
        stripe: true,
        title: "套餐列表",
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "套餐名称",
            prop: "name",
            width: "380",
            search: true,
            display: false,
          },
          {
            label: "套餐内天数",
            prop: "dayCount",
            display: false,
          },
          {
            label: "套餐说明",
            prop: "remark",
            // search: true,
            display: false,
          },
          {
            label: "状态",
            prop: "status",
            slot: true,
            display: false,
          },
        ],
        group: [
          {
            icon: "el-icon-info",
            label: "基本信息",
            prop: "group1",
            column: [
              {
                label: "套餐名称",
                prop: "name",
                span: 12,
                rules: [
                  {
                    required: true,
                    message: "套餐名称",
                    trigger: "blur",
                  },
                ],
                row: true,
              },
              {
                label: "旅游产品",
                prop: "productId",
                type: "select",
                cascaderItem: ["routeId"],
                dicUrl: url.v1.products.productsListTree,
                row: true,
                dicFormatter: (res) => {
                  return res.data; //返回字典的层级结构
                },
                rules: [
                  {
                    required: true,
                    message: "请输入产品标签",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "旅游线路",
                prop: "routeId",
                type: "select",
                cascaderIndex: 0,
                dicUrl: `${url.v1.products.productRouteListTree}/{{key}}`,
                row: true,
                rules: [
                  {
                    required: true,
                    message: "请输入产品标签",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "天数",
                prop: "dayCount",
                type: "number",
                span: 6,
                minRows: 0,
                value: 0,
                cell: true,
                rules: [
                  {
                    required: true,
                    message: "请输入天数",
                    trigger: "blur",
                  },
                ],
                maxRows: 9999,
              },
              {
                label: "状态",
                prop: "status",
                span: 6,
                type: "switch",
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
                row: true,
              },
              {
                label: "说明",
                prop: "remark",
                type: "textarea",
                minRows: 10,
                maxlength: 200,
                span: 18,
                showWordLimit: true,
              },
            ],
          },
          {
            icon: "el-icon-info",
            label: "价格设置",
            prop: "group2",
            column: [
              {
                label: "",
                prop: "prcie",
                formslot: true,
                span: 24,
              },
            ],
          },
        ],
      },
    };
  },
  created() {
    this.productMealList();
    this.priceDate = new Date();
    this.nowMonth = this.priceDate.getMonth();
    this.calendarMonth = this.nowMonth;
    this.nowDay =
      this.priceDate.getFullYear() * 10000 +
      (1 + this.priceDate.getMonth()) * 100 +
      this.priceDate.getDate();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: [],
  methods: {
    // jsonStrToStrMap(jsonStr) {
    //   var strMap = new Map();
    //   for (var index in jsonStr) {
    //     var str = new Map(Object.entries(jsonStr[index]));
    //     for (let item of str.entries()) {
    //       strMap.set(item[0],item[1]);
    //     }
    //   }
    //   debugger
    //   this.priceList =strMap;
    //   return strMap;
    // },
    //点击日期块
    calendarOnClick(e) {
      console.log(e);
      // this.isArrange.push("2020-06-19");
      this.$notify.error({
        title: "日历块点击",
        message: e,
        position: "top-left",
      });
    },
    beforeOpen(done, type) {
      var that = this;
      that.viewType = type;
      done();
    },
    refreshPrice(data) {
      if (!data.isSelected) {
        return true;
      }
      if (data.day.slice(5, 7) === this.calendarMonth + 1 + "") {
        return true;
      }
      this.calendarMonth = data.day.slice(5, 7) - 1;
      var that = this;
      that.$forceUpdate();
    },
    putPrice() {
        var that = this;
        that.dialogPriceVisible = false;
      //保存数据库
      //请求保存数据接口
      that.temp.mealId = that.crud.id;
      that.temp.calendar =that.TimeData.day;
      that.temp.productId =that.crud.productId;
      that.temp.routeId = that.crud.routeId;
      request({
          url: url.v1.products.addCalendar,
          method:"post",
          data: that.temp
        }).then((res) => {
           if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
         } 
        });
    },
    setPrice(data, date) {
        var that = this;
      that.TimeData = data;
      if (that.nowDay > data.day.replace(/-/g, "")) {
        return false;
      }
      //代表是编辑 则查询数据库数据 显示给用户 拿到当前行
      if (that.viewType === "edit") {
        request({
          url: url.v1.products.findOneByMealIdAndDateTime,
          data: {
            mealId: that.crud.id,
            dateTime: data.day,
          },
        }).then((res) => {
          let temps = res.data;
          that.temp = {
            price: temps.price,
            discountPrice: temps.discountPrice,
            stock: temps.stock,
            productFirstMoney: temps.productFirstMoney,
            productTwoMoney: temps.productTwoMoney,
            productWindowMoney: temps.productWindowMoney,
          };
        });
      } else {
        var list = that.priceList.get(that.TimeData.day);
        if (list == undefined) {
          that.temp = {
            price: "",
            discountPrice: "",
            stock: "",
            productFirstMoney: "",
            productTwoMoney: "",
            productWindowMoney: "",
          };
        } else {
          var data = list.split(",");
          that.temp = {
            price: data[1],
            discountPrice: data[0],
            stock: data[2],
            productFirstMoney: data[3],
            productTwoMoney: data[4],
            productWindowMoney: data[5],
          };
        }
      }
      that.dialogPriceVisible = true;
    },
    searchChange(params, done) {
      done();
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSize;
      this.searchForm = params;
      this.productMealList();
    },
    productMealList(searchData) {
      var data = {
        page: this.page.currentPage,
        limit: this.page.pageSize,
      };
      request({
        url: url.v1.products.productMealList,
        data: { ...data, ...this.searchForm },
      }).then((res) => {
        this.page.total = res.data.total;
        this.data = res.data.list;
      });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.productMealList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.productMealList();
    },
    selectionChange(list) {
      this.deleteId = list.map((item) => item.id).join(",");
    },
    refreshChange() {
      this.productMealList();
    },
    rowSave(form, done, loading) {
      var that = this;
      let array = [];
      that.priceList.forEach((item, index) => {
        var data = item.split(",");
        var obj = { calendar: "", stock: "", price: "", discountPrice: "" };
        obj.calendar = index;
        obj.stock = data[2];
        obj.price = data[1];
        obj.discountPrice = data[0];
        (obj.productFirstMoney = data[3]),
          (obj.productTwoMoney = data[4]),
          (obj.productWindowMoney = data[5]),
          array.push(obj);
      });
      form.prcie = array;
      request({
        url: url.v1.products.addProductMeal,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status !== 200) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.page.currentPage = 1;
          this.productMealList();
          this.priceList = new Map();
          done();
        }
      });
    },
    rowDel(form) {
      this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: url.v1.products.deleteMealByIds,
            method: "POST",
            data: {
              ids: form.id,
            },
          }).then((res) => {
            this.$message.success(res.message);
            this.productMealList();
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
      request({
        url: url.v1.products.updateProductMeal,
        method: "POST",
        data: form,
      }).then((res) => {
        if (res.status == 404) {
          this.$message.error(res.message);
          loading();
        } else {
          this.$message.success(res.message);
          this.productMealList();
          done();
        }
      });
    },
    handleDel() {
      if (this.deleteId.length > 0) {
        this.$confirm("此操作将永久删除该数据吗?, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            request({
              url: url.v1.products.deleteMealByIds,
              method: "POST",
              data: {
                ids: this.deleteId,
              },
            }).then((res) => {
              this.$message.success(res.message);
              this.productMealList();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要删除的分类",
        });
      }
    },
    uploadBefore(file, done, loading, column) {
      // 上传文件之前校验图片格式和大小
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2m = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        loading();
        this.$message.error("上传图片只能是 PNG、JPG 格式!");
        return false;
      }
      if (!isLt2m) {
        loading();
        this.$message.error("上传图片大小不能超过2M!");
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
    nodeClick(data) {
      this.goodsTypeName = data.label;
      this.page.currentPage = 1;
      this.productMealList();
    },
  },
};
</script>

<style>
.is-selected {
  color: #1989fa;
}
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
._calendar .div-Calendar {
  height: 122px;
  box-sizing: border-box;
  padding: 8px;
}
._calendar .el-calendar-table .el-calendar-day {
  padding: 0px;
  height: 122px;
}
._calendar .el-container,
._calendar .el-calendar {
  height: 100%;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
