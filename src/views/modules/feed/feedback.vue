<template>
  <div class="mod-feedback">
    <div class="title">
      <p class="titleText">尊敬的公司人员，您好，本公司将虚心接受您的宝贵意见与反馈！</p>
    </div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="反馈意见" prop="content">
        <el-input type="textarea" v-model="dataForm.content" maxlength="1000" show-word-limit :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button @click="reset()">重置</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
name: "feedback",
  data(){
    return{
      dataForm:{
        content:''
      },
      dataRule: {
        content: [
          { required: true, message: '反馈意见不可为空', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    //重置
    reset(){
      this.$refs.dataForm.resetFields()
    },
    //提交
    dataFormSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/manage-feedback/save'),
            method: 'post',
            data: this.$http.adornData({
              'content':this.dataForm.content
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '提交成功,请耐心等待相关工作人员的答复',
                type: 'success',
                duration: 1500,
              })
              this.$refs.dataForm.resetFields()
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

<style scoped>
.mod-feedback{
  width: 100%;
}
.title{
  width: 100%;
}
.title .titleText{
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.btn{
  margin: 0 auto;
  width: 200px;
}
</style>
