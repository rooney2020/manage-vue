<template>
  <el-dialog
    title="新增参数组"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="组名" prop="paramKey">
        <el-input v-model="dataForm.groupName" placeholder="参数名"></el-input>
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
      dataForm: {
        groupName:''
      },
      dataRule: {
        groupName: [
          { required: true, message: '组名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/manage-paramgroup/save'),
            method: 'post',
            data: this.$http.adornData({
              groupName:this.dataForm.groupName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.$parent.getDataList();
              this.visible = false
              this.$refs['dataForm'].resetFields()
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

