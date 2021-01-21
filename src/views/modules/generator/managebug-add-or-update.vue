<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="BUG名称" prop="bugName">
      <el-input v-model="dataForm.bugName" placeholder="BUG名称"></el-input>
    </el-form-item>
    <el-form-item label="项目id" prop="projectId">
      <el-input v-model="dataForm.projectId" placeholder="项目id"></el-input>
    </el-form-item>
    <el-form-item label="严重程度" prop="level">
      <el-input v-model="dataForm.level" placeholder="严重程度"></el-input>
    </el-form-item>
    <el-form-item label="状态0,：激活，1：已解决，2：已关闭" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态0,：激活，1：已解决，2：已关闭"></el-input>
    </el-form-item>
    <el-form-item label="创建人id" prop="createUserId">
      <el-input v-model="dataForm.createUserId" placeholder="创建人id"></el-input>
    </el-form-item>
    <el-form-item label="创建日期" prop="createDate">
      <el-input v-model="dataForm.createDate" placeholder="创建日期"></el-input>
    </el-form-item>
    <el-form-item label="指派给" prop="assigneeId">
      <el-input v-model="dataForm.assigneeId" placeholder="指派给"></el-input>
    </el-form-item>
    <el-form-item label="解决方案0：已解决，1：无法重现，2：待发测试，3：已发测试，4：设计问题，5：重复bug，6：延期处理，7：外部原因，8：不予解决" prop="resolveMethod">
      <el-input v-model="dataForm.resolveMethod" placeholder="解决方案0：已解决，1：无法重现，2：待发测试，3：已发测试，4：设计问题，5：重复bug，6：延期处理，7：外部原因，8：不予解决"></el-input>
    </el-form-item>
    <el-form-item label="BUG类型0：代码错误，1：安全问题，2：性能问题，3：设计问题，4：其他" prop="bugType">
      <el-input v-model="dataForm.bugType" placeholder="BUG类型0：代码错误，1：安全问题，2：性能问题，3：设计问题，4：其他"></el-input>
    </el-form-item>
    <el-form-item label="开始日期" prop="beginDate">
      <el-input v-model="dataForm.beginDate" placeholder="开始日期"></el-input>
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-input v-model="dataForm.endDate" placeholder="结束日期"></el-input>
    </el-form-item>
    <el-form-item label="优先级" prop="priority">
      <el-input v-model="dataForm.priority" placeholder="优先级"></el-input>
    </el-form-item>
    <el-form-item label="相关任务" prop="relatedTaskId">
      <el-input v-model="dataForm.relatedTaskId" placeholder="相关任务"></el-input>
    </el-form-item>
    <el-form-item label="重现步骤" prop="reproSteps">
      <el-input v-model="dataForm.reproSteps" placeholder="重现步骤"></el-input>
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
          bugId: 0,
          bugName: '',
          projectId: '',
          level: '',
          status: '',
          createUserId: '',
          createDate: '',
          assigneeId: '',
          resolveMethod: '',
          bugType: '',
          beginDate: '',
          endDate: '',
          priority: '',
          relatedTaskId: '',
          reproSteps: ''
        },
        dataRule: {
          bugName: [
            { required: true, message: 'BUG名称不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '项目id不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '严重程度不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态0,：激活，1：已解决，2：已关闭不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '创建人id不能为空', trigger: 'blur' }
          ],
          createDate: [
            { required: true, message: '创建日期不能为空', trigger: 'blur' }
          ],
          assigneeId: [
            { required: true, message: '指派给不能为空', trigger: 'blur' }
          ],
          resolveMethod: [
            { required: true, message: '解决方案0：已解决，1：无法重现，2：待发测试，3：已发测试，4：设计问题，5：重复bug，6：延期处理，7：外部原因，8：不予解决不能为空', trigger: 'blur' }
          ],
          bugType: [
            { required: true, message: 'BUG类型0：代码错误，1：安全问题，2：性能问题，3：设计问题，4：其他不能为空', trigger: 'blur' }
          ],
          beginDate: [
            { required: true, message: '开始日期不能为空', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '结束日期不能为空', trigger: 'blur' }
          ],
          priority: [
            { required: true, message: '优先级不能为空', trigger: 'blur' }
          ],
          relatedTaskId: [
            { required: true, message: '相关任务不能为空', trigger: 'blur' }
          ],
          reproSteps: [
            { required: true, message: '重现步骤不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.bugId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.bugId) {
            this.$http({
              url: this.$http.adornUrl(`/generator/managebug/info/${this.dataForm.bugId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bugName = data.manageBug.bugName
                this.dataForm.projectId = data.manageBug.projectId
                this.dataForm.level = data.manageBug.level
                this.dataForm.status = data.manageBug.status
                this.dataForm.createUserId = data.manageBug.createUserId
                this.dataForm.createDate = data.manageBug.createDate
                this.dataForm.assigneeId = data.manageBug.assigneeId
                this.dataForm.resolveMethod = data.manageBug.resolveMethod
                this.dataForm.bugType = data.manageBug.bugType
                this.dataForm.beginDate = data.manageBug.beginDate
                this.dataForm.endDate = data.manageBug.endDate
                this.dataForm.priority = data.manageBug.priority
                this.dataForm.relatedTaskId = data.manageBug.relatedTaskId
                this.dataForm.reproSteps = data.manageBug.reproSteps
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
              url: this.$http.adornUrl(`/generator/managebug/${!this.dataForm.bugId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'bugId': this.dataForm.bugId || undefined,
                'bugName': this.dataForm.bugName,
                'projectId': this.dataForm.projectId,
                'level': this.dataForm.level,
                'status': this.dataForm.status,
                'createUserId': this.dataForm.createUserId,
                'createDate': this.dataForm.createDate,
                'assigneeId': this.dataForm.assigneeId,
                'resolveMethod': this.dataForm.resolveMethod,
                'bugType': this.dataForm.bugType,
                'beginDate': this.dataForm.beginDate,
                'endDate': this.dataForm.endDate,
                'priority': this.dataForm.priority,
                'relatedTaskId': this.dataForm.relatedTaskId,
                'reproSteps': this.dataForm.reproSteps
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
