<template>
  <el-dialog
    :title="!dataForm.projectId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" :inline="true">
    <el-form-item label="项目名称" prop="projectName" >
      <el-input v-model="dataForm.projectName" placeholder="项目名称" style="width: 220px"></el-input>
    </el-form-item>
      <el-form-item label="负责人id" prop="managerId">
        <el-select v-model="dataForm.managerId" clearable placeholder="请选择状态" style="width: 220px">
          <el-option
            v-for="(item,index) in manageIds"
            :key="index"
            :label="item.chineseName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
<!--    <el-form-item label="开始日期" prop="beginDate">-->
<!--      <el-input v-model="dataForm.beginDate" placeholder="开始日期"></el-input>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="结束日期" prop="endDate">-->
<!--      <el-input v-model="dataForm.endDate" placeholder="结束日期"></el-input>-->
<!--    </el-form-item>-->
      <el-form-item label="日期" prop="limitDate">
        <el-date-picker
          v-model="dataForm.limitDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        style="width: 530px">
        </el-date-picker>
      </el-form-item>
    <el-form-item label="总工时" prop="totalCount" >
      <el-input v-model="dataForm.totalCount" placeholder="总工时" style="width: 220px"></el-input>
    </el-form-item>

      <el-form-item label="状态" prop="status" >
        <el-select v-model="dataForm.status" clearable placeholder="请选择状态" style="width: 220px">
          <el-option
            v-for="(item,index) in statusData"
            :key="index"
            :label="item.statusName"
            :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input type="textarea" :rows="2" v-model="dataForm.comment" placeholder="备注" style="width: 530px"></el-input>
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
        manageIds:[],
        statusData:[
          {
            status:0,
            statusName:'未开始'
          },
          {
            status:1,
            statusName:'进行中'
          },
          {
            status:2,
            statusName:'已完成'
          },
          {
            status:3,
            statusName:'已关闭'
          }
        ],
        dataForm: {
          projectId: '',
          projectName: '',
          managerId: '',
          limitDate:'',
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
          limitDate: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ],
          totalCount: [
            { required: true,pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '总工时不能为空且为数字', trigger: 'blur' }
          ],
          comment: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          status:[
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getmanageIds()
    },
    methods: {
      getmanageIds(){
        this.$http({
          url: this.$http.adornUrl('/sys/user/super'),
          method: 'get',
          params: this.$http.adornParams({
            chineseName:''
          })
        }).then(({data}) => {
          this.manageIds=data.data
        })
      },
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
                // this.dataForm.beginDate = data.manageProject.beginDate
                // this.dataForm.endDate = data.manageProject.endDate
                this.dataForm.limitDate=[data.manageProject.beginDate,data.manageProject.endDate]
                this.dataForm.totalCount = data.manageProject.totalCount
                this.dataForm.comment = data.manageProject.comment
                this.dataForm.createUserId = data.manageProject.createUserId
                this.dataForm.createTime = data.manageProject.createTime
                this.dataForm.updateTime = data.manageProject.updateTime
                this.dataForm.status = data.manageProject.status
                this.dataForm.projectId=data.manageProject.projectId
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
                'projectName': this.dataForm.projectName,
                'managerId': this.dataForm.managerId,
                'beginDate': this.dataForm.limitDate[0],
                'endDate': this.dataForm.limitDate[1],
                'totalCount': this.dataForm.totalCount,
                'comment': this.dataForm.comment,
                'status': this.dataForm.status,
                'projectId':this.dataForm.projectId
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
