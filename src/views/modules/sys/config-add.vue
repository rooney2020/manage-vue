<template>
  <el-dialog
    title="新增参数"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="参数名" prop="paramName">
        <el-input v-model="dataForm.paramName" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="dataForm.paramValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        groupId:'',
        dataForm: {
          paramName: '',
          paramValue: '',
          remark: ''
        },
        dataRule: {
          paramName: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (a,b) {
        this.visible = a
        this.groupId=b
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/manage-param/save'),
              method: 'post',
              data: this.$http.adornData({
                'groupId':this.groupId,
                'paramName': this.dataForm.paramName,
                'paramValue': this.dataForm.paramValue,
                'remark': this.dataForm.remark
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
