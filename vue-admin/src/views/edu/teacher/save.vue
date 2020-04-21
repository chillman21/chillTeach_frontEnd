<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" type="text" maxlength="10" show-word-limit="true" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          maxlength="1"
          show-word-limit="true"
          controls-position="right"
          min="1"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input
          v-model="teacher.intro"
          :rows="10"
          type="textarea"
          maxlength="200"
          show-word-limit="true"
        />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//引入调用teacher.js文件
import teacherApi from "@/api/edu/teacher"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "http://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586673948&di=cc8461b55b2f9701e0e826d9e6072b51&src=http://img.jk51.com/img_jk51/319179563.jpeg"
      },
      //上传弹窗是否显示
      imagecropperShow:false,
      //上传组件key值
      imagecropperKey:0,
      //获取dev.env.js里面的地址 
      BASE_API:process.env.BASE_API,
      saveBtnDisabled: false // 保存按钮是否禁用
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      //路由变化的方式，路由发生变化就会执行
      console.log("watch $route");
      this.init();
    }
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getTeacherInfo(id);
      } else {
        //路径没有id值，就添加
        //清空表单
        this.teacher = {};
        this.teacher.avatar ="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586673948&di=cc8461b55b2f9701e0e826d9e6072b51&src=http://img.jk51.com/img_jk51/319179563.jpeg"
      }
    },
    close(){//关闭上传弹框的方法
      this.imagecropperShow = false
      //每次关闭，进行 上传组件初始化 
      this.imagecropperKey=this.imagecropperKey+1
    },
    cropSuccess(data){
      this.imagecropperShow = false
      //返回图片地址
      this.teacher.avatar = data.url
      this.imagecropperKey=this.imagecropperKey+1
    },

    getTeacherInfo(id) {
      teacherApi.getTeacherInfo(id).then(response => {
        this.teacher = response.data.teacher;
        if(response.data.teacher.avatar.length==0){
          this.teacher.avatar='https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586673948&di=cc8461b55b2f9701e0e826d9e6072b51&src=http://img.jk51.com/img_jk51/319179563.jpeg'
        }
      });
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },
    updateTeacher() {
      teacherApi.updateTeacherInfo(this.teacher).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改成功!"
        });
        //回到列表页面，路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    },
    //添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then(response => {
        //添加成功
        //提示信息
        this.$message({
          type: "success",
          message: "添加成功!"
        });
        //回到列表页面，路由跳转
        this.$router.push({ path: "/teacher/table" });
      });
    }
  }
};
</script>