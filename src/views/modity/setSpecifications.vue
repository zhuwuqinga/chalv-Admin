<template>
  <div>
    <el-dialog
      title="选择规格"
      :visible.sync="sendVal"
      width="60%"
      :show-close="false"
      append-to-body
    >
      <p>1、商品规格</p>
      <el-row>
        <el-checkbox v-model="enableSpec" size="large">启用规格</el-checkbox>
        <!-- <span class="tip"
          >* 启用商品规格后，商品的价格及库存以商品规格为准</span
        > -->
        <el-button
          type="primary"
          :disabled="this.specs.length === 2"
          v-if="enableSpec"
          @click="addType"
          size="small"
          class="mar-t"
          >添加规格</el-button
        >
      </el-row>
      <div class="specs">
        <!-- specs不存在直接不渲染 -->
        <template v-if="specs.length != 0">
          <div class="spec" v-for="(spec, index) in specs" v-show="enableSpec">
            <p>
              * 规格{{ index + 1 }}
              <el-button
                class="del_btn"
                type="primary"
                @click="deleteType(index)"
                size="mini"
                >删除规格</el-button
              >
            </p>
            <div>
              <el-row>
                商品分类:
                <!-- <el-input
                  placeholder="请输入规格名，例如：尺寸"
                  class="spec-type"
                  v-model.trim.lazy="spec.type"
                ></el-input> -->

                <el-select v-model="spec.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-row>

              <el-row>
                规格项:
                <!-- <el-input
                  placeholder="请输入规格项，例如：XXL"
                  class="spec-type"
                  v-model.trim.lazy="newSpecName[index]"
                ></el-input> -->
              </el-row>
              <el-row>
                <i style="color: red"> 颜色：</i>
                <el-checkbox-group v-model="checkedModel">
                  <el-checkbox
                    v-for="model in Specifications"
                    :label="model"
                    :key="model"
                    >{{ model }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-row>
              <el-row>
                <i style="color: red"> 重量：</i>
                <el-checkbox-group v-model="checkedModel">
                  <el-checkbox
                    v-for="model in Specifications"
                    :label="model"
                    :key="model"
                    >{{ model }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-row>
              <!-- <el-row>
                规格项:
                <br />
                <el-button
                  @click="addSpec(spec.children, newSpecName[index], index)"
                  size="small"
                  >+添加</el-button
                >
                <br />
              </el-row> -->
            </div>
          </div>
        </template>
      </div>

      <div class="price-wra">
        <br />
        <p>2、商品价格</p>
        <p v-show="enableSpec" class="mar-t">批量填写</p>
        <el-row class="price-wra">
          &nbsp;&nbsp;<b class="must-fill">*</b>价格
          <el-input
            v-model="displayedPrices.advicePrice"
            class="goods-price"
          ></el-input
          >&nbsp;&nbsp; 重量
          <el-input
            v-model="displayedPrices.cost"
            class="goods-price"
          ></el-input
          >&nbsp;&nbsp; <b class="must-fill">*</b>库存
          <el-input
            v-model="displayedPrices.cost"
            class="goods-price"
          ></el-input
          >&nbsp;&nbsp; 成本价
          <el-input
            v-model="displayedPrices.cost"
            class="goods-price"
          ></el-input
          >&nbsp;&nbsp;基础销量
          <el-input
            v-model="displayedPrices.amount"
            class="goods-price"
          ></el-input
          >&nbsp;&nbsp;<!-- <el-button type="primary">确定</el-button> -->
        </el-row>
        <!-- <h4>{{displayedPrices.amount}}</h4> -->
        <br />
        <template v-if="enableSpec">
          <!-- specs不存在直接不渲染 -->
          <template v-if="specs.length != 0">
            <el-table :data="tableData" border key="aTable" class="specs_table">
              <el-table-column prop="spec0" :label="specs[0].type" width="150">
                <input type="text" value="123" />
              </el-table-column>
              <el-table-column
                prop="spec1"
                label="颜色"
                width="100"
                v-if="specs.length == 2"
              ></el-table-column>
              <el-table-column label="大小" width="150" min-width="200">
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      大小:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.marketPrice"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.marketPrice }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="prices.advicePrice"
                label="价格"
                width="150"
              >
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      价格:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.advicePrice"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.advicePrice }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="prices.cost" label="库存" width="150">
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      库存:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.cost"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.cost }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="prices.amount" label="重量" width="150">
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      重量:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.amount"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.amount }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="prices.amount"
                label="规格编码"
                width="150"
              >
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      规格编码:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.amount"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.amount }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="prices.amount" label="成本价" width="150">
                <template scope="scope">
                  <el-popover trigger="click" placement="top">
                    <p>
                      成本价:
                      <el-input
                        size="mini"
                        class="price-modi"
                        v-model.number="scope.row.prices.amount"
                      ></el-input>
                    </p>
                    <div style="text-align: right; margin: 0">
                      <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                      <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.prices.amount }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              @click="addSpec()"
              size="small"
              style="margin-left: 94%;"
              >+添加</el-button
            >
          </template>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

 <script>
const modelOptions = ["上海", "北京", "广州", "深圳", "深圳", "深圳"];
export default {
  name: "setSpecific",
  props: {
    value: {},
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      checkedModel: ["500g", "400g"],
      Specifications: modelOptions,
      sendVal: true,
      arr: [1, 3, 5],
      visible2: false,
      // local
      // __flag
      // 规格种类的数量
      typesLength: null,
      enableSpec: null,
      // __data
      // 注意此项为数组 type Array
      originalPrices: [
        {
          marketPrice: 110,
          advicePrice: 100,
          cost: 90,
          amount: 110,
        },
      ],
      // 批量填写价格
      defaultAddPrices: {
        marketPrice: 100,
        advicePrice: 90,
        cost: 80,
        amount: 50,
      },
      // from backend
      specs: [
        {
          type: "颜色",
          children: ["红", "蓝"],
        },
        {
          type: "尺寸",
          children: ["大", "中"],
        },
      ],
      // from backend
      _specs: [
        {
          type: "颜色",
          children: ["红", "蓝"],
        },
        {
          type: "尺寸",
          children: ["大", "中"],
        },
      ],
      // from backend
      specPrices: [
        {
          specs: ["红", "大"],
          prices: {
            marketPrice: 90,
            advicePrice: 60,
            cost: 40,
            amount: 10,
          },
        },
        {
          specs: ["红", "中"],
          prices: {
            marketPrice: 30,
            advicePrice: 70,
            cost: 30,
            amount: 10,
          },
        },
        {
          specs: ["蓝", "大"],
          prices: {
            marketPrice: 20,
            advicePrice: 10,
            cost: 30,
            amount: 10,
          },
        },
        {
          specs: ["蓝", "中"],
          prices: {
            marketPrice: 50,
            advicePrice: 40,
            cost: 30,
            amount: 10,
          },
        },
      ],
      newSpecName: ["", ""],
    };
  },
  methods: {
    arrTest() {
      this.arr = 0;
      var t = 0;
      var _t = "0";
      console.log("Boolean(t)");
      console.log(Boolean(t));
      console.log(Boolean(_t));
    },
    test() {
      console.log(this.specs);
    },
    deleteType(index) {
      var r = confirm("确定删除规格名么?");
      if (r) {
        console.log("......" + r);
        this.specs.splice(index, 1);
        // 刷新 mySpecPrices
        var myDefaultAddPrices = JSON.parse(
          JSON.stringify(this.defaultAddPrices)
        );
        this.mySpecPrices(this.specCombinations(), myDefaultAddPrices);
      } else {
        return;
      }
    },
    deleteSpec(index, spec) {
      spec.splice(index, 1);
      // 刷新 mySpecPrices
      var myDefaultAddPrices = JSON.parse(
        JSON.stringify(this.defaultAddPrices)
      );
      this.mySpecPrices(this.specCombinations(), myDefaultAddPrices);
    },
    modiSpec(specName, spec, index) {
      spec[index] = specName;
      console.log(this.specs);
    },
    addType() {
      // alert()
      var obj = {};
      obj.type = "";
      obj.children = [];
      this.specs.push(obj);
    },
    addSpec(spec, newSpecName, index) {
      console.log(newSpecName + "111");
      // 检测新规格名是否规范 1, 不为空. 2,不重复
      if (!newSpecName) {
        alert("规格项名称不能为空");
        return;
      } else if (spec.includes(newSpecName)) {
        alert("规格项名称不能为重复");
        return;
      }
      spec.push(newSpecName);
      console.log(spec);

      // 每次点击添加, 保存一个defaultAddPrices的深拷贝副本, 防止数据关联
      var myDefaultAddPrices = JSON.parse(
        JSON.stringify(this.defaultAddPrices)
      );
      var specCombinations = this.specCombinations();
      this.mySpecPrices(specCombinations, myDefaultAddPrices);

      this.newSpecName[index] = "";
      // console.log(this.specs)
    },
    modiPrice() {},
    // 规格组合数组
    specCombinations() {
      console.log(this.specs);
      var arrWra = [];
      // 有2个规格type
      if (this.specs.length == 2) {
        var arr1 = this.specs[0].children;
        var arr2 = this.specs[1].children;
        // 判断arr1是否为[], 如果是 为其添加个空字符串占位
        if (arr1.length == 0) {
          arr1 = [""];
        }
        if (arr2.length == 0) {
          arr2 = [""];
        }
        var arr = [];
        for (var t = 0; t < arr1.length; t++) {
          for (var i = 0; i < arr2.length; i++) {
            arr = [];
            arr.push(arr1[t]);
            arr.push(arr2[i]);
            arrWra.push(arr);
          }
        }
        console.log(arrWra);
        return arrWra;
        // 只有1个规格type
      } else if (this.specs.length == 1) {
        var arr = this.specs[0].children;
        if (arr.length == 0) {
          arr = [""];
        }
        for (var i = 0; i < arr.length; i++) {
          var _arr = [];
          _arr.push(arr[i]);
          arrWra.push(_arr);
        }
        console.log(arrWra);
        console.log("arrWra............");
        return arrWra;
      }
    },
    // 规格价格数据 local
    // 数据更新
    mySpecPrices(specCombinations, myDefaultAddPrices) {
      // function sameSpecs(element) {
      //   return element.specs == arr[i];
      // }
      var arrWra = [];
      // 规格组合 数组
      var arr = specCombinations;
      console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        // 新增 规格价格 项
        var obj = {};
        obj.specs = arr[i];
        // !注意 a类型为数组
        // 对比 新的 规格组合数组 与原价格数组
        var oldItem = this.specPrices.filter((element) => {
          return element.specs + "" === arr[i] + "";
        });
        var newItem = this.specPrices.filter((element) => {
          return element.specs + "" != arr[i] + "";
        });
        // 注意这里用的是length因为 空数组,空对象的布尔值为true
        // 旧规各项价格
        if (oldItem.length) {
          obj.prices = oldItem[0].prices;
          console.log(oldItem[0]);
          // 新规各项价格
        } else {
          console.log(newItem);
          console.log("_____");
          // if (newItem.length != 0) {
          // 这里用深拷贝否则各新项目的价格数据会关联
          newItem[0].prices = JSON.parse(JSON.stringify(myDefaultAddPrices));
          obj.prices = newItem[0].prices;
          // }
        }
        arrWra.push(obj);
      }
      console.log(arrWra);
      this.specPrices = arrWra;
    },
    // spec type 只有一个时, 检查重复 并 去重
    // checkDuplicate() {
    //   console.log(this.specPrices)
    // }
  },
  mounted() {
    this.showMask = this.value;
  },
  watch: {
    value(newVal, oldVal) {
      this.showMask = newVal;
    },
    showMask(val) {
      this.$emit("input", val);
    },
  },
  computed: {
    displayedPrices() {
      // console.log(this.enableSpec ? this.defaultAddPrices : this.originalPrices[0])
      return this.enableSpec ? this.defaultAddPrices : this.originalPrices[0];
    },

    // 表格数据
    tableData() {
      var arr = this.specPrices;
      console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        arr[i].spec0 = arr[i].specs[0];
        arr[i].spec1 = arr[i].specs[1];
      }
      // console.log(this.mySpecPrices)
      return arr;
    },
  },
  created() {
    // this.defaultAddPrices = this.goodsData.defaultAddPrices
    // this.originalPrices = this.goodsData.originalPrices

    this.specs = this._specs;
    this.specs = [];
    this.specPrices = [];

    if (this.specs.length == 0) {
      // 初始化规格数据
      var obj = {};
      obj.type = "";
      obj.children = [];
      this.specs.push(obj);
      // console.log(this.specs)

      // 初始化价格数据
      var _obj = [{}];
      _obj[0].specs = [""];
      _obj[0].prices = {
        marketPrice: 0,
        advicePrice: 0,
        cost: 0,
        amount: 0,
      };
      this.specPrices = _obj;
    }

    this.typesLength = this.specs.length;
    this.enableSpec = this.typesLength ? true : false;

    this.enableSpec = false;

    console.log(this.enableSpec);
    console.log(this.typesLength);
    console.log(this.specCombinations);
    console.log("this.specCombinations");

    if (this.typesLength === 2) {
      this.typeName1 = this.goodsData[0].type;
      this.typeName2 = this.goodsData[0].type;
    }
  },
};
</script>

<style scoped>
.tip {
  color: red;
  font-size: 12px;
}

input[type="text"] {
  width: 280px;
}

.price-wra input[type="text"] {
  width: 30px;
}

.el-input {
  width: auto;
}

.must-fill {
  color: red;
}

.el-row {
  margin-top: 15px;
}

.spec-table {
  margin-top: 15px;
}

.spec,
.price-wra .el-row,
.specs_table {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #c1c1c1;
  border-radius: 5px;
}

.goods-price {
  width: 100px;
}

.del_btn {
  float: right;
}

.mar-t {
  margin-top: 20px;
}

.price-modi {
  width: 70px;
}

.el-checkbox-group {
  width: 94%;
  float: right;
}
</style>
