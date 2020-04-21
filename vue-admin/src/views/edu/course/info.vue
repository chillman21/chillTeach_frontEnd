<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/file/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: "",
        subjectId: "", //二级分类id
        subjectParentId: "", //一级分类id
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover:
          "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586766225&di=4e34098acd7884b42f85da0a7461c7c2&src=http://crawl.ws.126.net/dd604e23d67d5816d8c865418cf8035f.png",
        price: 0
      },
      courseId: "",
      teacherList: [], //封装所有的讲师
      subjectOneList: [], //一级分类
      subjectTwoList: [], //一级分类
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },

  created() {
    //获取路由中的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    } else {
      //初始化所有讲师
      this.getListTeacher();
      //初始化一级分类
      this.getOneSubject();
    }
    if(this.courseInfo.cover.length==0){
      this.courseInfo.cover='https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586766225&di=4e34098acd7884b42f85da0a7461c7c2&src=http://crawl.ws.126.net/dd604e23d67d5816d8c865418cf8035f.png'
    }
  },

  methods: {
    //根据课程id查询信息
    getCourseInfo() {
      this.getOneSubject();
      course.getCourseInfoById(this.courseId).then(response => {
        this.courseInfo = response.data.courseInfoVo;

        //  subject.getAllSubject()
        //  .then(response => {
        // this.subjectOneList = response.data.list;
        for (var i = 0; i < this.subjectOneList.length; i++) {
          //获取每个一级分类
          var oneSubject = this.subjectOneList[i];
          if (this.courseInfo.subjectParentId == oneSubject.id) {
            this.subjectTwoList = oneSubject.children;
          }
        }
        console.log(this.subjectTwoList)
        //});
        
        this.getListTeacher();
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res); // 上传响应
      console.log(URL.createObjectURL(file.raw)); // base64编码
      this.courseInfo.cover = res.data.url;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    subjectLevelOneChanged(value) {
      for (var i = 0; i < this.subjectOneList.length; i++) {
        var oneSubject = this.subjectOneList[i];
        //判断：所有一级分类id
        if (value === oneSubject.id) {
          this.subjectTwoList = oneSubject.children;
          //把二级分类id清空
          this.courseInfo.subjectId = "";
        }
      }
    },
    //查询所有一级分类
    getOneSubject() {
      subject.getAllSubject().then(response => {
        this.subjectOneList = response.data.list;
      });
    },
    //查询所有讲师
    getListTeacher() {
      course.getListTeacher().then(response => {
        this.teacherList = response.data.items;
      });
    },
    //添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo).then(response => {
        //显示提示信息
        this.$message({
          type: "success",
          message: "添加课程信息成功!"
        });
        //跳转到第二步
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId
        });
      });
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(response=>{
         //显示提示信息
        this.$message({
          type: "success",
          message: "修改课程信息成功!"
        });
        //跳转到第二步
        this.$router.push({
          path: "/course/chapter/" + this.courseId
        });
      })
    },
    next() {
      if (!this.courseInfo.id) {
        this.addCourse();
      }else{
        this.updateCourse();
      }
    }
  }
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>