import request from '@/utils/request'
export default{
    //讲师列表 分页
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            //data表示把对象转换成json进行传递
            data: teacherQuery
          })
    },
    //删除讲师
    removeTeacherById(id){
        return request({
            url: `/eduservice/teacher/delete/${id}`,
            method: 'delete'
          })
    },
    addTeacher(teacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
          })
    },
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
          })
    },
    //修改讲师
    updateTeacherInfo(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data:teacher
          })
    }
}
