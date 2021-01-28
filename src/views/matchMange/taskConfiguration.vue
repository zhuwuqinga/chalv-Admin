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
        <el-row :gutter="50">
          <el-col :span="10">
            <h5>每日默认票数</h5>
            <el-form-item label="每日默认" prop="dayInit">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.dayInit" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>

            <h5>每日签到</h5>
            <el-form-item label="每日签到" prop="checkinDay">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.checkinDay" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="可获积分" prop="checkinIntegral">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.checkinIntegral" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">积分</template>
                </el-input>
              </div>
            </el-form-item>

            <h5>邀请新用户</h5>
            <el-form-item label="邀请一位新用户成功注册" prop="inviteTicket">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.inviteTicket" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
                <!-- <span style="color: #ccc; font-size: 12px">*不做次数限制</span> -->
              </div>
            </el-form-item>
            <el-form-item label="可获积分" prop="inviteIntegral">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.inviteIntegral" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">积分</template>
                </el-input>
              </div>
            </el-form-item>

            <h5>发布短视频、旅游圈</h5>
            <el-form-item label="发布一个短视频或旅游圈" prop="publishTicket">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.publishTicket" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="可获积分" prop="publishIntegral">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.publishIntegral" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">积分</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="每天最多可奖励" prop="publishDay">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.publishDay" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">次</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <h5>点赞短视频、旅游圈</h5>
            <el-form-item label="点赞一个或旅游圈" prop="likeTicket">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.likeTicket" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="可获积分" prop="likeIntegral">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.likeIntegral" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">积分</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="每天最多可奖励" prop="likeDay">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.likeDay" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">次</template>
                </el-input>
              </div>
            </el-form-item>

            <h5 style="margin-top: 60px;">购买商品</h5>
            <el-form-item label="购买任意商品" prop="buyTicket">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.buyTicket" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="每天最多可奖励" prop="buyDay">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.buyDay" :maxlength="5"  oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">次</template>
                </el-input>
              </div>
            </el-form-item>

            <h5>评论</h5>
            <el-form-item label="评论短视频、旅游圈" prop="commentTicket">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.commentTicket"  :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">票数</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="可获积分" prop="commentIntegral">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.commentIntegral" :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">积分</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="每天最多可奖励" prop="commentDay">
              <div>
                <el-input placeholder="请输入" v-model="ruleForm.commentDay"  :maxlength="5" oninput="value=value.replace(/[^\d]/g,'')">
                  <template slot="append">次</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="btn_right">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
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
        dayInit: "",
        checkinDay: "",
        inviteTicket: "",
        publishTicket: "",
        publishDay: "",
        likeTicket: "",
        likeDay: "",
        buyTicket: "",
        buyDay: "",
        commentTicket: "",
        commentDay: "",
      },
      rules: {
        dayInit: [{ required: true, message: "不能为空", trigger: "blur" }],
        checkinDay: [{ required: true, message: "不能为空", trigger: "blur" }],
        inviteTicket: [{ required: true, message: "不能为空", trigger: "blur" },],
        publishTicket: [
          { required: true, message: "不能为空", trigger: "blur" },],
        publishDay: [{ required: true, message: "不能为空", trigger: "blur" }],
        likeTicket: [{ required: true, message: "不能为空", trigger: "blur" }],
        likeDay: [{ required: true, message: "不能为空", trigger: "blur" }],
        buyTicket: [{ required: true, message: "不能为空", trigger: "blur" }],
        buyDay: [{ required: true, message: "不能为空", trigger: "blur" }],
        commentTicket: [{ required: true, message: "不能为空", trigger: "blur" },],
        commentDay: [{ required: true, message: "不能为空", trigger: "blur" }],
        checkinIntegral: [{ required: true, message: "不能为空", trigger: "blur" }],
        inviteIntegral: [{ required: true, message: "不能为空", trigger: "blur" }],
        publishIntegral: [{ required: true, message: "不能为空", trigger: "blur" }],
        likeIntegral: [{ required: true, message: "不能为空", trigger: "blur" }],
        commentIntegral: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  mounted(){
      this.getConfig();
  },
  methods: {
    getConfig() {
      request({
        url: url.v1.match.matchListGet,
        method: "POST",
      }).then((res) => {
        this.ruleForm = res.data
      });
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          request({
            url: url.v1.match.matchUpdate,
            method: "POST",
            data: this.ruleForm,
          }).then((res) => {
            console.log(res);
            this.$message.success(res.message);
          });
        } else {
          console.log("error submit!!");
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
.task_content .is-success .el-input-number__increase {
  right: 0 !important;
}
.task_content .el-input-number__increase {
  border-left: 1px solid #e0e0e0 !important;
}
.btn_right {
  margin-left: 30% !important;
}
</style>