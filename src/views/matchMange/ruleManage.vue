<template>
  <div class="task_content">
    <basic-container>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <h5>新增规则</h5>
        <el-form-item label="规则名称">
            <span>活动规则</span> 
        </el-form-item>
        <el-form-item label="客服电话" prop="activityPhone">
            <el-input style="width:200px" type="text" v-model="ruleForm.activityPhone" maxLength='11' oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="规则详情" prop="activityDetails">
            <avue-ueditor v-model="ruleForm.activityDetails" style="width:50%"></avue-ueditor>
        </el-form-item>

        <el-form-item label="规则名称">
            <span>投票规则</span> 
        </el-form-item>
        <el-form-item label="客服电话" prop="ticketPhone">
            <el-input style="width:200px" type="text" v-model="ruleForm.ticketPhone" maxLength='11' oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="规则详情" prop="ticketDetails">
            <avue-ueditor v-model="ruleForm.ticketDetails" style="width:50%"></avue-ueditor>
        </el-form-item>

        <el-form-item class="btn_right">
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import { request } from "@/util/request";
import url from "@/config/url";
export default {
  data() {
    return {
      ruleForm: {
          activityPhone:"",
          activityDetails:"",
          ticketPhone:"",
          ticketDetails:"",
      },
      rules: {
        activityPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        activityDetails:[{ required: true, message: "详情不能为空！", trigger: "blur" }],
        ticketPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        ticketDetails:[{ required: true, message: "详情不能为空！", trigger: "blur" }],
      },
    };
  },
  mounted(){
      this.getConfig();
  },
  methods: {

    getConfig() {
      request({
        url: url.v1.match.matchActivityGet,
        method: "POST",
      }).then((res) => {
            console.log(res);
        this.ruleForm = res.data
      });
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          request({
            url: url.v1.match.matchActivityUpdate,
            method: "POST",
            data: this.ruleForm,
          }).then((res) => {
            console.log(res);
            this.$message.success(res.message);
          });
        } else {
            this.$message.success(res.message);
          return false;
        }
      });
    },

    resetForm(ruleForm) {
      this.getConfig();
    },

  },
};
</script>

<style>
</style>