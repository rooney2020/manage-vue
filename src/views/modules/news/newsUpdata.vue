<template>
  <el-dialog
    title="修改"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="新闻标题"></el-input>
      </el-form-item>
      <el-form-item label="原图片地址" prop="points" label-width="110px">
        <img :src="imgUrl" min-width="70px" height="70px" />
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="uploads"
          :action="uploadUrl"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeUpload"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="dataForm.content"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dialogVisible:false,
      imgUrl:'',
      newsId:'',
      isActive:'',
      uploadUrl:'http://192.144.229.232:51110/manage/common/upload',
      dialogImageUrl:'',
      dataForm: {
        title:'',
        content:''
      },
      dataRule: {
        title: [
          { required: true, message: '新闻标题不可为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '新闻内容不可为空', trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    // this.selectData()
  },
  methods: {
    //点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传文件之前的钩子
    beforeUpload(file) {
      var that = this;
      //判断是否是图片
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      //返回file.name这个string对象的一个字串
      const JpjPic = testmsg === "jpg";
      const PngPic = testmsg === "png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!JpjPic && !PngPic) {
        this.$message({
          message: "上传文件只能是jpg、png格式"
        });
        setTimeout(() => this.$refs.uploads.clearFiles(), 100);
        //清空
        this.dialogVisible = false;
      } else if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过10MB",
          type: "error"
        });
      } else {
        let fd = new FormData();
        fd.append("file", file); //传文件
        // 上传 接口 调用
        this.$http({
          url: this.$http.adornUrl('/common/upload'),
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          contentType: "multipart/form-data",
          type: "formData",
          data: fd
        }).then(res => {
          if (res.data.code === 0) {
            this.dialogImageUrl = res.data.fileName;
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "操作失败",
              type: "error"
            });
          }
        });
      }
    },
    //页面开关
    openDialog(flag, val) {
      console.log(val)
      this.visible = flag;
      this.$nextTick(() => {
        console.log(val)
        this.dataForm.title=val.title
        this.dataForm.content=val.content
        this.imgUrl=val.imageUrl
        this.newsId=val.newsId
        this.isActive=val.isActive===true ? 0 : 1
      });
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        console.log(this.imgUrl)
        console.log(this.dialogImageUrl)
        let url=''
        if(this.dialogImageUrl!==''){
          url=this.dialogImageUrl
        }else{
          url=this.imgUrl.slice(28)
          console.log('11111')
        }
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/manage-news/update'),
            method: 'post',
            data: this.$http.adornData({
              'newsId':this.newsId,
              'title':this.dataForm.title,
              'imageUrl':url,
              'content':this.dataForm.content,
              'isActive': this.isActive
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.$parent.getDataList();
              this.visible=false
              this.dialogImageUrl=''
              this.$refs.uploads.clearFiles()
              this.$forceUpdate()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>


