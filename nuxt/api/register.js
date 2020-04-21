import request from '@/utils/request'
export default {
    //根据手机号发送验证码
  sendCode(phone) {
    return request({
      url: `/edumsm/message/send/${phone}`,
      method: 'get'
    })
  },
  registerMember(formItem){
    return request({
      url: `/educenter/member/register`,
      method: 'post',
      data: formItem
    })
  }
  
}