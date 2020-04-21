import request from '@/utils/request'

export default {

  createStatistics(day) {
    return request({
      url: `/staservice/daily/registerCount/${day}`,
      method: 'post'
    })
  },
  getDataSta(searchObj) {
    return request({
      url: `/staservice/daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  },

}