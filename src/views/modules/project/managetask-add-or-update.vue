<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="项目id" prop="projectId">
      <el-input v-model="dataForm.projectId" placeholder="项目id"></el-input>
    </el-form-item>
    <el-form-item label="任务名称" prop="taskName">
      <el-input v-model="dataForm.taskName" placeholder="任务名称"></el-input>
    </el-form-item>
    <el-form-item label="状态0：未开始，1：进行中，2：已完成，3：已关闭" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态0：未开始，1：进行中，2：已完成，3：已关闭"></el-input>
    </el-form-item>
    <el-form-item label="指派给" prop="assigneeId">
      <el-input v-model="dataForm.assigneeId" placeholder="指派给"></el-input>
    </el-form-item>
    <el-form-item label="完成者" prop="completeUserId">
      <el-input v-model="dataForm.completeUserId" placeholder="完成者"></el-input>
    </el-form-item>
    <el-form-item label="预计" prop="estimate">
      <el-input v-model="dataForm.estimate" placeholder="预计"></el-input>
    </el-form-item>
    <el-form-item label="已消耗" prop="usedTime">
      <el-input v-model="dataForm.usedTime" placeholder="已消耗"></el-input>
    </el-form-item>
    <el-form-item label="截止日期" prop="endDate">
      <el-input v-model="dataForm.endDate" placeholder="截止日期"></el-input>
    </el-form-item>
    <el-form-item label="相关需求" prop="relatedTaskId">
      <el-input v-model="dataForm.relatedTaskId" placeholder="相关需求"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="beginDate">
      <el-input v-model="dataForm.beginDate" placeholder="开始时间"></el-input>
    </el-form-item>
    <el-form-item label="实际开始时间" prop="realBeginDate">
      <el-input v-model="dataForm.realBeginDate" placeholder="实际开始时间"></el-input>
    </el-form-item>
    <el-form-item label="完成时间" prop="finishDate">
      <el-input v-model="dataForm.finishDate" placeholder="完成时间"></el-input>
    </el-form-item>
    <el-form-item label="任务类型0：需求，1：前端开发，2：后端开发，3：其他" prop="taskType">
      <el-input v-model="dataForm.taskType" placeholder="任务类型0：需求，1：前端开发，2：后端开发，3：其他"></el-input>
    </el-form-item>
    <el-form-item label="任务描述" prop="comment">
      <el-input v-model="dataForm.comment" placeholder="任务描述"></el-input>
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
          taskId: 0,
          projectId: '',
          taskName: '',
          status: '',
          assigneeId: '',
          completeUserId: '',
          estimate: '',
          usedTime: '',
          endDate: '',
          relatedTaskId: '',
          beginDate: '',
          realBeginDate: '',
          finishDate: '',
          taskType: '',
          comment: ''
        },
        dataRule: {
          projectId: [
            { required: true, message: '项目id不能为空', trigger: 'blur' }
          ],
          taskName: [
            { required: true, message: '任务名称不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态0：未开始，1：进行中，2：已完成，3：已关闭不能为空', trigger: 'blur' }
          ],
          assigneeId: [
            { required: true, message: '指派给不能为空', trigger: 'blur' }
          ],
          completeUserId: [
            { required: true, message: '完成者不能为空', trigger: 'blur' }
          ],
          estimate: [
            { required: true, message: '预计不能为空', trigger: 'blur' }
          ],
          usedTime: [
            { required: true, message: '已消耗不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '截止日期不能为空', trigger: 'blur' }
          ],
          relatedTaskId: [
            { required: true, message: '相关需求不能为空', trigger: 'blur' }
          ],
          beginDate: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          realBeginDate: [
            { required: true, message: '实际开始时间不能为空', trigger: 'blur' }
          ],
          finishDate: [
            { required: true, message: '完成时间不能为空', trigger: 'blur' }
          ],
          taskType: [
            { required: true, message: '任务类型0：需求，1：前端开发，2：后端开发，3：其他不能为空', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '任务描述不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.taskId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.taskId) {
            this.$http({
              url: this.$http.adornUrl(`/manage-task/info/${this.dataForm.taskId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.projectId = data.manageTask.projectId
                this.dataForm.taskName = data.manageTask.taskName
                this.dataForm.status = data.manageTask.status
                this.dataForm.assigneeId = data.manageTask.assigneeId
                this.dataForm.completeUserId = data.manageTask.completeUserId
                this.dataForm.estimate = data.manageTask.estimate
                this.dataForm.usedTime = data.manageTask.usedTime
                this.dataForm.endDate = data.manageTask.endDate
                this.dataForm.relatedTaskId = data.manageTask.relatedTaskId
                this.dataForm.beginDate = data.manageTask.beginDate
                this.dataForm.realBeginDate = data.manageTask.realBeginDate
                this.dataForm.finishDate = data.manageTask.finishDate
                this.dataForm.taskType = data.manageTask.taskType
                this.dataForm.comment = data.manageTask.comment
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
              url: this.$http.adornUrl(`/manage-task/${!this.dataForm.taskId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'taskId': this.dataForm.taskId || undefined,
                'projectId': this.dataForm.projectId,
                'taskName': this.dataForm.taskName,
                'status': this.dataForm.status,
                'assigneeId': this.dataForm.assigneeId,
                'completeUserId': this.dataForm.completeUserId,
                'estimate': this.dataForm.estimate,
                'usedTime': this.dataForm.usedTime,
                'endDate': this.dataForm.endDate,
                'relatedTaskId': this.dataForm.relatedTaskId,
                'beginDate': this.dataForm.beginDate,
                'realBeginDate': this.dataForm.realBeginDate,
                'finishDate': this.dataForm.finishDate,
                'taskType': this.dataForm.taskType,
                'comment': this.dataForm.comment
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
