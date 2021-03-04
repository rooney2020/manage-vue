<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px" :inline="true">
      <el-form-item label="项目id" prop="projectId">
        <el-select v-model="dataForm.projectId" clearable placeholder="请选择项目id" style="width: 220px">
          <el-option
            v-for="(item,index) in projectIds"
            :key="index"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="dataForm.taskName" placeholder="任务名称" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item label="指派给" prop="assigneeId">
        <el-select v-model="dataForm.assigneeId" clearable placeholder="请选择指派员工" style="width: 220px">
          <el-option
            v-for="(item,index) in assigneeIds"
            :key="index"
            :label="item.chineseName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计" prop="estimate">
        <el-input v-model="dataForm.estimate" placeholder="预计" style="width: 220px"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="beginDate">
        <el-date-picker
          v-model="dataForm.beginDate"
          type="date"
          placeholder="开始日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" prop="endDate">
        <el-date-picker
          v-model="dataForm.endDate"
          type="date"
          placeholder="截止日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="相关需求" prop="relatedTaskId">
        <el-select v-model="dataForm.relatedTaskId" clearable placeholder="请选择相关需求" style="width: 220px">
          <el-option
            v-for="(item,index) in relatedTaskIds"
            :key="index"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="dataForm.taskType" clearable placeholder="请选择相关需求" style="width: 220px">
          <el-option
            v-for="(item,index) in taskTypes"
            :key="index"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述" prop="comment">
        <el-input type="textarea" :rows="2" v-model="dataForm.comment" placeholder="任务描述" style="width: 520px"></el-input>
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
      projectIds: [],
      assigneeIds:[],
      relatedTaskIds:[],
      taskTypes:[
        {
          type:0,
          name:'需求'
        },
        {
          type:1,
          name:'前端开发'
        },
        {
          type:2,
          name:'后端开发'
        },
        {
          type:3,
          name:'其他'
        }
      ],
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
          {required: true, message: '项目id不能为空', trigger: 'blur'}
        ],
        taskName: [
          {required: true, message: '任务名称不能为空', trigger: 'blur'}
        ],
        assigneeId: [
          {required: true, message: '指派给不能为空', trigger: 'blur'}
        ],
        estimate: [
          {required: true,pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '预计不能为空且为数', trigger: 'blur'}
        ],
        endDate: [
          {required: true, message: '截止日期不能为空', trigger: 'blur'}
        ],
        relatedTaskId: [
          {required: true, message: '相关需求不能为空', trigger: 'blur'}
        ],
        beginDate: [
          {required: true, message: '开始日期不能为空', trigger: 'blur'}
        ],
        taskType: [
          {required: true, message: '任务类型不能为空', trigger: 'blur'}
        ],
        comment: [
          {required: true, message: '任务描述不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getprojectIds()
    this.getassigneeIds()
    this.getrelatedTaskIds()
  },
  methods: {
    getrelatedTaskIds(){
      this.$http({
        url: this.$http.adornUrl('/manage-task/requirements'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.relatedTaskIds=data.data
        }
      })
    },
    getprojectIds(){
      this.$http({
        url: this.$http.adornUrl('/manage-project/projects'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.projectIds=data.data
        }
      })
    },
    getassigneeIds(){
      this.$http({
        url: this.$http.adornUrl('/sys/user/users'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.assigneeIds=data.data
        }
      })
    },
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
              this.dataForm.assigneeId = data.manageTask.assigneeId
              this.dataForm.estimate = data.manageTask.estimate
              this.dataForm.endDate = data.manageTask.endDate
              this.dataForm.relatedTaskId = data.manageTask.relatedTaskId
              this.dataForm.beginDate = data.manageTask.beginDate
              this.dataForm.taskType = data.manageTask.taskType
              this.dataForm.comment = data.manageTask.comment
              this.dataForm.status=data.manageTask.status
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
<style>
</style>
