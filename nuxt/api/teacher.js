import request from '@/utils/request'
export default {
    //前台分页讲师查询
  getTecherList(page,limit) {
    return request({
      url: `/eduservice/teacherfront/getTeacherFrontList/${page}/${limit}`,
      method: 'post'
    })
  },
  //讲师详情的方法
  getTeacherInfo(teacherId){
    return request({
      url: `/eduservice/teacherfront/getTeacherFrontInfo/${teacherId}`,
      method: 'get'
    })
  }
  
}