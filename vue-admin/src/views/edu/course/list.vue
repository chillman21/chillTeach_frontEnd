<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="课程名称">
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseQuery.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-select
          v-model="courseQuery.subjectParentId"
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
        <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getCourseListPage()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading :data="list1" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />
      <el-table-column prop="teacherId" label="讲师ID" width="80"></el-table-column>

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">{{ scope.row.status==='Normal'?'已发布':'未发布' }}</template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时" />

      <el-table-column prop="gmtCreate" label="添加时间" />
      <el-table-column prop="buyCount" label="销售数量" />

      <el-table-column prop="viewCount" label="浏览数量" />

      <el-table-column prop="price" label="售价" />

      <el-table-column label="操作" align="center">
        <template slot-scope="scope" style=" white-space: pre">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改大纲</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourseListPage"
    />
  </div>
</template>
<script>
//引入调用course.js文件
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import teacher from "@/api/edu/teacher";
export default {
  //写核心代码位置
  data() {
    return {
      //定义变量初始值
      list1: [],
      page: 1,
      limit: 5,
      total: 0,
      courseQuery: {
        title: "",
        teacherId: "",
        subjectParentId: "",
        subjectId: ""
      },
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      list2: [],
      teacherName: ""
    };
  },
  created() {
    //页面渲染之前执行，调用methods里边定义的方法
    this.getCourseListPage();
    //初始化所有讲师
    this.getListTeacher();
    //初始化一级分类
    this.getOneSubject();
  },
  methods: {
    //创建具体的方法，调用teacher.js定义的方法
    getCourseListPage(page = 1) {
      this.page = page;
      course
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then(response => {
          //请求成功
          //response接口返回的数据

          this.list1 = response.data.rows;
          this.total = response.data.total;
        });
    },
    resetData() {
      this.courseQuery = {};
      this.getCourseListPage();
    },
    //查询所有讲师
    getListTeacher() {
      course.getListTeacher().then(response => {
        this.teacherList = response.data.items;
      });
    },
    //查询所有一级分类
    getOneSubject() {
      subject.getAllSubject().then(response => {
        this.subjectOneList = response.data.list;
      });
    },
    //删除讲师的方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确认
          course.deleteCourse(id).then(response => {
            //删除成功
            //提示信息
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getCourseListPage();
            //初始化所有讲师
            this.getListTeacher();
            //初始化一级分类
            this.getOneSubject();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    subjectLevelOneChanged(value) {
      for (var i = 0; i < this.subjectOneList.length; i++) {
        var oneSubject = this.subjectOneList[i];
        //判断：所有一级分类id
        if (value === oneSubject.id) {
          this.subjectTwoList = oneSubject.children;
          //把二级分类id清空
          this.courseQuery.subjectId = "";
        }
      }
    }
  }
};
</script>