<template>
  <el-dialog
    :title="type"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="参数组名" prop="groupName" v-if="type==='修改参数组'">
        <el-input v-model="dataForm.groupName" placeholder="参数组名"></el-input>
      </el-form-item>
      <el-form-item label="参数组ID" prop="groupId" v-if="type==='修改参数'">
        <el-input v-model="dataForm.groupId" placeholder="参数组ID"></el-input>
      </el-form-item>
      <el-form-item label="参数名" prop="paramName" v-if="type==='修改参数'">
        <el-input v-model="dataForm.paramName" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue" v-if="type==='修改参数'">
        <el-input v-model="dataForm.paramValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark" v-if="type==='修改参数'">
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
      zuId:'',
      type:'',
      canshuId:'',
      dataForm: {
        groupId:'',
        groupName:'',
        paramName: '',
        paramValue: '',
        remark: ''
      },
      dataRule: {
        groupId: [
          { required: true, message: '参数组ID不能为空', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '参数组名不能为空', trigger: 'blur' }
        ],
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
      if(b.paramId){
        this.type='修改参数'
        this.dataForm.groupId=b.groupId,
        this.dataForm.paramName=b.paramName,
        this.dataForm.remark=b.remark,
        this.dataForm.paramValue=b.paramValue
        this.canshuId=b.paramId
      }else{
        this.type='修改参数组'
        this.dataForm.groupName=b.groupName
        this.zuId=b.groupId
      }
      this.$nextTick(()=>{
        this.visible = a
      })
    },
    // 表单提交
    dataFormSubmit () {
      if(this.type==='修改参数组'){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/manage-paramgroup/update'),
              method: 'post',
              data: this.$http.adornData({
                'groupId':this.zuId,
                'groupName':this.dataForm.groupName
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
      }else{
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/manage-param/update'),
              method: 'post',
              data: this.$http.adornData({
                'paramId':this.canshuId,
                'groupId':this.dataForm.groupId,
                'paramName':this.dataForm.paramName,
                'paramValue':this.dataForm.paramValue,
                'remark':this.dataForm.remark
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
}
</script>
