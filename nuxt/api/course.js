import request from '@/utils/request'
export default {
    //前台分页课程查询
  getCourseList(page,limit,searchObj) {
    return request({
      url: `/eduservice/coursefront/getCourseFrontList/${page}/${limit}`,
      method: 'post',
      data:searchObj
    })
  },
  //查询所有分类的方法
  getAllSubject(){
    return request({
      url: `/eduservice/subject/getAllSubject`,
      method: 'get'
    })
  },
  //获取课程详情
  getCourseInfo(courseId){
    return request({
      url: `/eduservice/coursefront/getCourseFrontInfo/${courseId}`,
      method: 'get'
    })
  }
  
}