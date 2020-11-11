<template>
  <div id="app">
    <div style="float: left">
      <el-upload
        class="avatar-uploader"
        :action="actionUrl"
        :data="formData"
        name="file"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <el-button @click="findPic">根据图片ID回显</el-button>
    </div>
    <div>
     <el-upload class="avatar-uploader"
                           :action="actionUrl1"
                           :on-progress="uploadVideoProcess"
                           :on-success="handleVideoSuccess"
                           v-bind:before-upload="beforeUploadVideo"
                           v-bind:show-file-list="false">
                    <video v-if="videoForm.showVideoPath !='' && !videoFlag"
                           v-bind:src="videoForm.showVideoPath"
                           class="avatar video-avatar"
                           controls="controls">
                        您的浏览器不支持视频播放
                    </video>
                    <i v-else-if="videoForm.showVideoPath =='' && !videoFlag"
                       class="el-icon-plus avatar-uploader-icon"></i>
                    <el-progress v-if="videoFlag == true"
                                 type="circle"
                                 v-bind:percentage="videoUploadPercent"
                                 style="margin-top:7px;"></el-progress>
                </el-upload>
    </div>
    <div></div>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
export default {
  data() {
    return {
      imageUrl: "",
      actionUrl: "/api/upload/",
      actionUrl1: "/api/upload1/",
      formData: {},
 videoFlag: false,
            //是否显示进度条
            videoUploadPercent: "",
            //进度条的进度，
            isShowUploadVideo: false,
            //显示上传按钮
            videoForm: {
                showVideoPath: ''
            }
    };
  },
  methods: {
            //上传前回调
            beforeUploadVideo(file) {
                var fileSize = file.size / 1024 / 1024 < 50;
                if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) == -1) {
                    this.$message.error("请上传正确的视频格式");
                    return false;
                }
                if (!fileSize) {
                    this.$message.error("视频大小不能超过50MB");
                    return false;
                }
                this.isShowUploadVideo = false;
            },
            //进度条
            uploadVideoProcess(event, file, fileList) {
                this.videoFlag = true;
                this.videoUploadPercent = file.percentage.toFixed(0) * 1;
            },
            //上传成功回调
            handleVideoSuccess(res, file) {
              debugger
                this.isShowUploadVideo = true;
                this.videoFlag = false;
                this.videoUploadPercent = 0;
                
    
                //后台上传地址
                if (0 == 0) {
                    this.videoForm.showVideoPath = "http://localhost:7000/repository/default/7060f1e1-fd44-4f9c-8c11-e1671148f454"
                } else {
                    this.$message.error(res.Message);
                }
            },
    // 查找图片
    findPic() {
      let that = this;
      this.$axios({
        method: "post",
        url: "/api/download",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          id: "图片.png",
        },
        responseType: "arraybuffer", // 关键 设置 响应类型为二进制流
      }).then(function (response) {
        // 将后台的图片二进制流传华为base64
        let blob = new Blob([response.data], {
          type: "application/octest-stream",
        });
        that.imageUrl = URL.createObjectURL(blob);
      });
    },
    // 上传图片失败
    handleAvatarError(err, file) {
      this.$message.error("上传头像失败!");
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>