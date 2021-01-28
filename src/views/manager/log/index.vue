<template>
  <div>
    <basic-container>
      <el-tag>具体配置build/webpack.base.conf.js配置环境变量的地方1111111</el-tag>
      <editor v-model="msg"></editor>
      <h4>{{msg}}</h4>
    </basic-container>
  </div>
</template>

<script>
export default {
  name: 'dev',
  data() {
    return {
      msg: '<h2><img src="http://img.baidu.com/hi/jx2/j_0003.gif"/>Vue + UEditor + v-model双向绑定</h2>'
    }
  },
  created() {
  },
  computed: {
    envText: function () {
      return this.env
    }
  }
}
</script>

<style>
</style>
