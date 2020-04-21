import request from '@/utils/request'
export default {
    //登录
  submitLogin(userInfo) {
    return request({
      url: `/educenter/member/login`,
      method: 'post',
      data: userInfo
    })
  },
  submitLogout() {
    return request({
      url: `/educenter/member/logout`,
      method: 'delete'
    })
  },
  //根据token获取用户信息
  getLoginUserInfo(){
    return request({
      url: `/educenter/member/getMemberInfo`,
      method: 'get'
    })
  }
  
}