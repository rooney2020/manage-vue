<template>
  <el-dialog
    title="反馈处理"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="新闻标题"></el-input>
      </el-form-item>
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
  methods: {
    //页面开关
    openDialog(flag, val) {
      this.visible = flag;
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/manage-news/create'),
            method: 'post',
            data: this.$http.adornData({
              'title':this.dataForm.title,
              'content':this.dataForm.content,
              'imageUrl':this.dialogImageUrl
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.$parent.getDataList();
              this.visible=false
              this.dataForm.title=''
              this.dataForm.content=''
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


