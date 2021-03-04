<template>
  <div>
  <el-dialog
    :title=title
    :visible.sync="dialogVisible"
    width="70%"
  >
    <el-button type="primary" size="small" @click="bianji()" style="margin-bottom: 1vh">添 加</el-button>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="recordId"
        header-align="center"
        align="center"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        prop="recordDate"
        header-align="center"
        align="center"
        label="日期"
        >
      </el-table-column>
      <el-table-column
        prop="consume"
        header-align="center"
        align="center"
        label="消耗工时"
        >
      </el-table-column>
      <el-table-column
        prop="remain"
        header-align="center"
        align="center"
        label="剩余工时">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
      width="500">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="210"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" title="编辑" @click="bianji(scope.row)">
            <icon-svg name="bianji" class="icon"></icon-svg>
          </el-button>
          <el-button type="text" title="删除" @click="shanchu(scope.row)">
            <icon-svg name="shanchu" class="icon"></icon-svg>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog
    :title=title1
    :visible.sync="bianjiVisible"
    width="50%"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  label-width="80px">
      <el-form-item label="消耗工时" prop="consume">
        <el-input v-model="dataForm.consume" placeholder="消耗工时"></el-input>
      </el-form-item>
      <el-form-item label="剩余工时" prop="remain">
        <el-input v-model="dataForm.remain" placeholder="剩余工时"></el-input>
      </el-form-item>
      <el-form-item label="日期" prop="beginDate">
        <el-date-picker
          v-model="dataForm.beginDate"
          type="date"
          placeholder="日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="content">
        <el-input type="textarea" v-model="dataForm.content"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="bianjiVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
name: "gongshi.vue",
  data() {
    return {
      dialogVisible: false,
      dataListLoading:false,
      bianjiVisible:false,
      title:'',
      taskId:'',
      recordId:'',
      title1:'',
      dataList:[],
      id:'',
      dataForm:{
        beginDate:'',
        consume:'',
        remain:'',
      },
      dataRule: {
        consume: [
          { required: true, pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,message: '消耗工时不可为空且为正数', trigger: 'blur' }
        ],
        remain: [
          { required: true,pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '剩余工时不可为空且为正数', trigger: 'blur' }
        ],
        beginDate: [
          { required: true, message: '日期不可为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods:{
    //删除
    shanchu(val){
      this.$http({
        url: this.$http.adornUrl('/manage-task/worktime/delete'),
        method: 'get',
        params: this.$http.adornParams({
          'recordId':val.recordId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          })
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //编辑 添加
    bianji(val){
      console.log(val)
      this.bianjiVisible=true
      if(val===undefined){
        this.title1='新增'
      }else{
        this.title1='编辑'
        this.recordId=val.recordId
        this.dataForm.beginDate=val.recordDate
        this.dataForm.consume=val.consume
        this.dataForm.remain=val.remain
        this.dataForm.remark=val.content
      }
    },
    //编辑提交接口
    dataFormSubmit(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let a={}
          if(this.title1==='新增'){
            a={
              'taskId':this.id,
              'recordDate':this.dataForm.beginDate,
              'consume':Number(this.dataForm.consume),
              'remain': Number(this.dataForm.remain),
              'remark':this.dataForm.content
            }
          }else{
            a={
              'recordId':this.recordId,
              'taskId':this.id,
              'recordDate':this.dataForm.beginDate,
              'consume':Number(this.dataForm.consume),
              'remain': Number(this.dataForm.remain),
              'remark':this.dataForm.content
            }
          }
          this.$http({
            url: this.$http.adornUrl('/manage-task/worktime/save'),
            method: 'post',
            data: this.$http.adornData(a)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
              this.bianjiVisible=false
              this.$refs.dataForm.resetFields();
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    openDialog(a){
      this.title='【'+a.id+'】'+a.title
      this.id=a.id
      this.dialogVisible=true;
      this.$nextTick(()=>{
        this.getList()
      })

    },
    getList(){
      console.log(this.id)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-task/worktime'),
        method: 'get',
        params: this.$http.adornParams({
          'taskId':this.id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data
        }
        this.dataListLoading = false
      })
    }
  }
}
</script>

<style scoped>
.icon{
  color: #1296db;
  font-weight: 600;
  font-size: 20px;
}
</style>
