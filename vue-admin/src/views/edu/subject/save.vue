<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="'https://chillteach.oss-cn-beijing.aliyuncs.com/example/01.xls'">点击下载模版</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/import'"
          name="file"
          accept="application/vnd.ms-excel"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API, // 接口API地址
      importBtnDisabled: false, // 按钮是否禁用,
      loading: false
    };
  },
  created() {},
  methods: {
    submitUpload() {
      //提交上传
      this.fileUploadBtnText = "正在上传";
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();
    },
    fileUploadSuccess() {
      //上传成功
      this.loading = false;
      this.$message({
        type: "success",
        message: "添加成功"
      });
      //跳转到课程分类列表页面
      this.$router.push({path:'/subject/list'})
    },
    fileUploadError() {
      //上传失败
      this.loading = false;
      this.$message({
        type: "error",
        message: "添加失败"
      });
    }
  }
};
</script>