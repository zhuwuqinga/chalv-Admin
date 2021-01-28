<template>
  <div>
    <basic-container>
      <el-form ref="form" :model="form" label-width="100px">
        <el-container>
          <el-main>
            <el-tabs tab-position="left">
              <el-tab-pane label="基本信息">
                <el-form-item label="站点名称">
                  <el-input v-model="form.webname"></el-input>
                </el-form-item>

                <el-form-item label="站点域名">
                  <el-input v-model="form.weburl"></el-input>
                </el-form-item>

                <el-form-item label="站点LOGO">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :on-success="handleAvatarSuccess"
                    :show-file-list="false"
                  >
                    <img v-if="form.weblogo" :src="form.weblogo" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>

                <el-form-item label="公司名称">
                  <el-input v-model="form.webcompany"></el-input>
                </el-form-item>

                <el-form-item label="通讯地址">
                  <el-input v-model="form.webaddress"></el-input>
                </el-form-item>

                <el-form-item label="客服电话">
                  <el-input v-model="form.webtel"></el-input>
                </el-form-item>

                <el-form-item label="传真号码">
                  <el-input v-model="form.webfax"></el-input>
                </el-form-item>

                <el-form-item label="邮箱">
                  <el-input v-model="form.webmail"></el-input>
                </el-form-item>

                <el-form-item label="备案号">
                  <el-input v-model="form.webcrod"></el-input>
                </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="上传设置">
                <el-form-item label="文件服务器">
                  <el-radio-group v-model="form.fileserver" size="small">
                    <el-radio-button label="localhost">本地存储</el-radio-button>
                    <el-radio-button label="aliyun">阿里云OSS</el-radio-button>
                    <el-radio-button label="huaweicloud">华为云OBS</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="上传目录">
                  <el-input v-model="form.filepath" placeholder="文件保存的目录名，自动创建根目录下"></el-input>
                </el-form-item>

                <el-form-item label="保存方式">
                  <el-radio-group v-model="form.filesave" size="small">
                    <el-radio-button label="1">按年月日每天一个目录</el-radio-button>
                    <el-radio-button label="2">按年月/日/存入不同目录</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="编辑器图片">
                  <el-radio-group v-model="form.fileremote" size="small">
                    <el-radio-button label="close">关闭下载</el-radio-button>
                    <el-radio-button label="auto">自动下载</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="文件类型">
                  <el-input v-model="form.fileextension" placeholder="以英文的逗号分隔开，如：“zip,rar”"></el-input>
                </el-form-item>

                <el-form-item label="视频类型">
                  <el-input v-model="form.videoextension" placeholder="以英文的逗号分隔开，如：“mp4,flv”"></el-input>
                </el-form-item>

                <el-form-item label="附件大小">
                  <el-input-number controls-position="right" v-model="form.attachsize" size="small">
                    <template slot="append">KB</template>
                  </el-input-number>
                </el-form-item>

                <el-form-item label="视频大小">
                  <el-input-number controls-position="right" v-model="form.videosize" size="small">
                    <template slot="append">KB</template>
                  </el-input-number>
                </el-form-item>

                <el-form-item label="图片大小">
                  <el-input-number controls-position="right" v-model="form.imgsize" size="small">
                    <template slot="append">KB</template>
                  </el-input-number>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-main>
          <el-footer>
            <el-form-item style="text-align: center;">
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-footer>
        </el-container>
      </el-form>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { request } from "@/util/request"
import { baseUrl } from "@/config/env";
import url from "@/config/url";
export default {
  name: "roleList",
  data() {
    return {
      uploadUrl: baseUrl + "upload/uploadFile",
      form: {}
    };
  },
  created() {
  //   request({
  //     url: url.v1.configDetails,
  //     method: "POST"
  //   }).then(res => {
  //     this.form = res.data;
  //   })
  },
  mounted() { },
  computed: {
    ...mapGetters(["permission"])
  },
  props: [],
  methods: {
    onSubmit() {
      request({
        url: url.v1.configEdit,
        method: "POST",
        data: this.form
      }).then(res => {
        if (res.status == 200) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      })
    },
    handleAvatarSuccess(res) {
      if (res.status == 200) {
        this.form.weblogo = res.data.url;
      } else {
        this.$message.error(res.message);
      }
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
