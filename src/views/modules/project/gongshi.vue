<template>
  <el-dialog
    :title=title
    :visible.sync="dialogVisible"
    width="70%"
  >
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="taskId"
        header-align="center"
        align="center"
        label="ID"
        width="50">
      </el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="日期"
        >
      </el-table-column>
      <el-table-column
        prop="taskName"
        header-align="center"
        align="center"
        label="工时"
        >
      </el-table-column>
      <el-table-column
        prop="assignName"
        header-align="center"
        align="center"
        label="剩余">
      </el-table-column>
      <el-table-column
        prop="completeName"
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
          <el-button type="text" title="编辑">
            <icon-svg name="bianji" class="icon"></icon-svg>
          </el-button>
          <el-button type="text" title="工时" @click="gongshi(scope.row)">
            <icon-svg name="gongshi" class="icon"></icon-svg>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
name: "gongshi.vue",
  data() {
    return {
      dialogVisible: false,
      dataListLoading:false,
      title:'',
      dataList:[],
      id:''
    };
  },
  methods:{
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
        // if (data && data.code === 0) {
        //   this.dataList = data.page.list
        // }
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
