import request from '@/utils/request'
export default{
    //课程分类
    getAllSubject(){
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
          })
    }
}
