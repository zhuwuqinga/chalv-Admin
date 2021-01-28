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
        <el-row :gutter="30">
          <el-col :span="6">
            <h5>客服信息配置</h5>
            <el-form-item label="客服微信" prop="customerWechat">
                <el-input v-model="ruleForm.customerWechat"></el-input>
            </el-form-item>
            <el-form-item label="客服电话" prop="customerPhone">
                <el-input type="text" v-model="ruleForm.customerPhone" maxLength='11' oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="二维码" prop="customerCode">
              <avue-form :option="option" v-model="ruleForm" :upload-preview="uploadPreview" :upload-error="uploadError" :upload-exceed="uploadExceed" :upload-delete="uploadDelete" :upload-before="uploadBefore" :upload-after="uploadAfter"> </avue-form>
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
          customerWechat:"",
          customerPhone:"",
          customerCode: '',
      },
      rules: {
        customerWechat: [{ required: true, message: "不能为空", trigger: "blur" }],
        customerPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        customerCode: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      option: {
        labelWidth: 0,
        submitBtn:false,
        emptyBtn:false,
        column: [
          {
            prop: 'customerCode',
            type: 'upload',
            listType: 'picture-img',
            span: 24,
            propsHttp: {
              res: 'data'
            },
            canvasOption: {
              text: 'avue',
              ratio: 0.1
            },
            action: url.v1.upload.file
          },
        ]
      },
    };
  },
  computed: {
    headers() {
      return{
        "Authorization": localStorage.getItem('token')
      }
    }
  },
  mounted(){
      this.getConfig();
  },
  methods: {
    
    uploadDelete(column,file) {
      return this.$confirm(`是否删除图片重新上传？`);
    },
    uploadBefore(file, done, loading,column) {
      // console.log(file,column)
      //如果你想修改file文件,由于上传的file是只读文件，必须复制新的file才可以修改名字，完后赋值到done函数里,如果不修改的话直接写done()即可
      var newFile = new File([file], '1234', { type: file.type });
      done(newFile)
    },
    uploadError(error, column) {
      // console.log(error, column)
    },
    uploadAfter(res, done, loading,column) {
      // console.log(res,column)
      done()
    },
    uploadPreview(file,column,done){
      // console.log(file,column)
      done()//默认执行打开方法
    },
    uploadExceed(limit, files, fileList, column){
      // console.log(limit, files, fileList, column)
    },

    getConfig() {
      request({
        url: url.v1.match.matchServiGet,
        method: "POST",
      }).then((res) => {
        this.ruleForm = res.data
      });
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          request({
            url: url.v1.match.matchServiUpdate,
            method: "POST",
            data: this.ruleForm,
          }).then((res) => {
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
.task_content .is-success .el-input-number__increase {
  right: 0 !important;
}
.task_content .el-input-number__increase {
  border-left: 1px solid #e0e0e0 !important;
}
.btn_right {
  margin-left: 30% !important;
}
.avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409EFF;
}
.avatar-uploader-icon {
font-size: 28px;
color: #8c939d;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
}
.avatar {
width: 178px;
height: 178px;
display: block;
}
</style>