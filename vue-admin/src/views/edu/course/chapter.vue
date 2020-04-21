<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="primary" icon="el-icon-circle-plus" @click="openChapterDialog" plain>添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in ChapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="openAddVideo(chapter.id)"
              round
            >添加课时</el-button>
            <el-button
              type="warning"
              @click="openEditChapter(chapter.id)"
              icon="el-icon-edit"
              round
            >编辑</el-button>
            <el-button
              type="danger"
              @click="removeChapter(chapter.id)"
              icon="el-icon-delete"
              round
            >删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              ●{{" "+ video.title }}
              <span class="acts">
                <el-button icon="el-icon-edit" @click="openEditVideo(video.id)"></el-button>
                <el-button icon="el-icon-delete" @click="removeVideo(video.id)"></el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div style="text-align: center;">
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :on-progress="uploadVideoProcess"
            :action="BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
            <el-progress
              v-if="videoFlag == true"
              type="circle"
              :percentage="videoUploadPercent"
              style="margin-top:30px;"
            ></el-progress>
          </el-upload>
          <span
            style="color:blue;text-align: center;float:left;"
            v-if="this.video.videoOriginalName!=''"
          >已经上传的视频：{{this.video.videoOriginalName}}</span>
          <span style="color:red;text-align: center;float:left;" v-else>该小节尚未上传课程视频</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false,
      ChapterVideoList: [],
      courseId: "",
      videoFlag: false,
      videoUploadPercent: 0,
      chapter: {
        //封装章节数据
        title: "",
        sort: 0
      },
      video: {
        // 课时对象
        title: "",
        sort: 0,
        isFree: false,
        videoSourceId: "",
        videoOriginalName: ""
      },
      dialogChapterFormVisible: false, //章节弹框
      dialogVideoFormVisible: false
    };
  },

  created() {
    //获取路由中的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },

  methods: {
    //点击x调用的方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}？`);
    },
    //点击确认删除调用的方法
    handleVodRemove() {
      //调用接口中的删除视频方法
      video.removeVideo(this.video.videoSourceId).then(response => {
        this.$message({
          type: "success",
          message: "删除视频成功!"
        });
        //把文件列表清空
        this.fileList = [];
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
      });
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
    },
    //上传成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId;
      this.video.videoOriginalName = file.name;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
    },
    //文件数量超出限制时的钩子
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    openAddVideo(chapterId) {
      this.dialogVideoFormVisible = true;
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;
      this.video.title = "";
      this.video.sort = 0;
      this.video.videoOriginalName="";
      this.video.isFree = false;
      this.fileList=[]
    },
    //修改章节数据回显
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getChapterInfo(chapterId).then(response => {
        this.chapter = response.data.chapter;
      });
    },
    //修改章节数据回显
    openEditVideo(videoId) {
      this.dialogVideoFormVisible = true;
      video.getVideoInfo(videoId).then(response => {
        this.video = response.data.video;
        if (this.video.videoOriginalName != ""&&this.video.videoOriginalName != null) {
          this.fileList.push(this.video.videoOriginalName);
        }else{
          this.fileList=[]
        }
        console.log(this.video);
      });
    },
    openChapterDialog() {
      this.dialogChapterFormVisible = true;
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确认
          chapter.deleteChapter(chapterId).then(response => {
            //删除成功
            //提示信息
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            //刷新页面
            this.getChapterVideo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除课时
    removeVideo(videoId) {
      this.$confirm("此操作将删除该课时, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确认
          video.deleteVideo(videoId).then(response => {
            //删除成功
            //提示信息
            this.$message({
              type: "success",
              message: "删除小节成功!"
            });
            //刷新页面
            this.getChapterVideo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addChapter() {
      this.chapter.courseId = this.courseId;
      //console.log(this.chapter.courseId)
      chapter.addChapter(this.chapter).then(response => {
        //关弹框
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "添加章节成功!"
        });
        this.getChapterVideo();
      });
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then(response => {
        //关弹框
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "修改章节成功!"
        });
        this.getChapterVideo();
      });
    },
    saveOrUpdateChapter() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    addVideo() {
      video.addVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加课时成功!"
        });
        this.getChapterVideo();
        this.fileList = [];
      });
    },
    updateVideo() {
      video.updateVideo(this.video).then(response => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改课时成功!"
        });
        this.getChapterVideo();
      });
    },
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo();
      } else {
        this.addVideo();
      }
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },

    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId).then(response => {
        this.ChapterVideoList = response.data.ChapterVideo;
      });
    }
  }
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList p {
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  color: #009999;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>