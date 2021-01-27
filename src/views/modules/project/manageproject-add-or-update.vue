<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="项目名称" prop="projectName">
      <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input>
    </el-form-item>
    <el-form-item label="负责人id" prop="managerId">
      <el-input v-model="dataForm.managerId" placeholder="负责人"></el-input>
    </el-form-item>
    <el-form-item label="开始日期" prop="beginDate">
      <el-input v-model="dataForm.beginDate" placeholder="开始日期"></el-input>
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-input v-model="dataForm.endDate" placeholder="结束日期"></el-input>
    </el-form-item>
    <el-form-item label="总工时" prop="totalCount">
      <el-input v-model="dataForm.totalCount" placeholder="总工时"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="comment">
      <el-input v-model="dataForm.comment" placeholder="备注"></el-input>
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
          projectId: 0,
          projectName: '',
          managerId: '',
          beginDate: '',
          endDate: '',
          totalCount: '',
          comment: '',
          createUserId: '',
          createTime: '',
          updateTime: '',
          status: ''
        },
        dataRule: {
          projectName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ],
          managerId: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ],
          beginDate: [
            { required: true, message: '开始日期不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '结束日期不能为空', trigger: 'blur' }
          ],
          totalCount: [
            { required: true, message: '总工时不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.projectId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.projectId) {
            this.$http({
              url: this.$http.adornUrl(`/manage-project/info/${this.dataForm.projectId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectName = data.manageProject.projectName
                this.dataForm.managerId = data.manageProject.managerId
                this.dataForm.beginDate = data.manageProject.beginDate
                this.dataForm.endDate = data.manageProject.endDate
                this.dataForm.totalCount = data.manageProject.totalCount
                this.dataForm.comment = data.manageProject.comment
                this.dataForm.createUserId = data.manageProject.createUserId
                this.dataForm.createTime = data.manageProject.createTime
                this.dataForm.updateTime = data.manageProject.updateTime
                this.dataForm.status = data.manageProject.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/manage-project/${!this.dataForm.projectId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'projectId': this.dataForm.projectId || undefined,
                'projectName': this.dataForm.projectName,
                'managerId': this.dataForm.managerId,
                'beginDate': this.dataForm.beginDate,
                'endDate': this.dataForm.endDate,
                'totalCount': this.dataForm.totalCount,
                'comment': this.dataForm.comment,
                'createUserId': this.dataForm.createUserId,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'status': this.dataForm.status
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
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
