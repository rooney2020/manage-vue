<template>
  <div class="mod-index">
    <div class="title">
      <p>你好，请您认真填写请假信息</p>
    </div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" class="mainLeft">
      <p>请假申请表</p>
      <el-form-item label="请假时段" prop="time">
        <el-date-picker
          v-model="dataForm.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请假类型" prop="leaveType" style="width: 100%">
        <el-select v-model="dataForm.leaveType" placeholder="请选择请假类型" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请假工时" prop="totalCount" style="width: 100%">
        <el-input-number v-model="dataForm.totalCount" :min="1" :step="4" step-strictly  label="请假工时" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item>
        <div style="margin: 0 auto;width: 180px">
        <el-button @click="reset()">重置</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="mainRight">
      <p>剩余假期工时统计情况</p>
      <div v-for="(item,index) in quota" :key="index">
        <span>剩余{{item.key}}{{item.value}}</span>
        <el-progress :percentage="item.value/item.original*100" :stroke-width="12" :class="sstt[index%3]"></el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "index",
  data(){
    return{
      quota:[],
      sstt:[
        "ss1",
        "ss2",
        "ss3",
      ],
      dataForm:{
        time:'',
        leaveType:'',
        totalCount:''
      },
      options: [{
        value: 0,
        label: '带薪假'
      }, {
        value: 1,
        label: '病假'
      }, {
        value: 2,
        label: '无薪假'
      }, {
        value: 3,
        label: '事假'
      }, {
        value: 4,
        label: '年假'
      }, {
        value: 5,
        label: '居家办公'
      }],
      dataRule: {
        time: [
          { required: true, message: '请假时段不能为空', trigger: 'blur' }
        ],
        leaveType: [
          { required: true, message: '请假类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.iii()
  },
  methods:{
  //获得 假期 余额
    iii(){
      this.$http({
        url: this.$http.adornUrl('/manage-leave/personal'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.quota=data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //重置
    reset(){
      this.$refs.dataForm.resetFields()
    },
    //提交
    dataFormSubmit(){
      console.log(this.dataForm)
      let begin=this.dataForm.time[0]
      let end=this.dataForm.time[1]
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/manage-leave/save'),
            method: 'post',
            data: this.$http.adornData({
              'beginTime':begin,
              'endTime':end,
              'leaveType':this.dataForm.leaveType,
              'totalCount':this.dataForm.totalCount
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
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
.mod-index{
  width: 100%;
}
.title{
  width: 100%;
  margin-bottom: 10vh;
}
.title p{
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.mainLeft{
  width: 35%;
  float: left;
}
.mainLeft p{
  text-align: center;
  font-size: 14px;
}
.mainRight{
  margin-left: 5%;
  width: 60%;
  float: left;
}
.mainRight p{
  text-align: center;
  font-size: 14px;
}
.ss1 /deep/.el-progress-bar__inner{
  background: #409eff!important;
}
.ss2 /deep/.el-progress-bar__inner{
  background: rgb(230, 162, 60);
}
.ss3 /deep/.el-progress-bar__inner{
  background: rgb(92, 184, 122);
}
</style>
