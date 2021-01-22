<template>
  <el-dialog
    title="请假处理"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="25%"
  >
    <el-form :model="dataForm" ref="dataForm"  label-width="80px">
      <el-form-item label="处理意见" prop="status">
        <el-switch
          style="display: block;margin-top: 8px"
          v-model="dataForm.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="批准"
          inactive-text="拒绝"
        >
        </el-switch>
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
      leaveId: '',
      dataForm: {
        status:true
      }
    }
  },
  methods: {
    //页面开关
    openDialog(flag, val) {
      console.log(val)
      this.visible = flag;
      this.leaveId=val
    },
    // 表单提交
    dataFormSubmit () {
      let status=this.dataForm.status===true?1:2
          this.$http({
            url: this.$http.adornUrl('/manage-leave/deal'),
            method: 'post',
            data: this.$http.adornData({
              'leaveId':this.leaveId,
              'status':status,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.visible=false
              this.$parent.getDataList(0)
            } else {
              this.$message.error(data.msg)
            }
          })
    }
  }
}
</script>
<style scoped>
/deep/.el-dialog{
  width: 25%!important;
}
</style>


