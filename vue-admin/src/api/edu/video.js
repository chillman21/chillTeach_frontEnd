import request from '@/utils/request'
export default{
    addVideo(video){
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data:video
          })
    },
    getVideoInfo(videoId){
        return request({
            url: `/eduservice/video/getVideoInfo/${videoId}`,
            method: 'get',
          })
    },
    updateVideo(video){
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data:video
          })
    },
    //删除小节
    deleteVideo(videoId){
        return request({
            url: `/eduservice/video/deleteVideo/${videoId}`,
            method: 'delete',
          })
    },
    //删除视频
    removeVideo(id){
        return request({
            url: `/eduvod/video/removeVideo/${id}`,
            method: 'delete',
          })
    },


}
