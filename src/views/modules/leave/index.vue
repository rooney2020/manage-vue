<template>
  <div class="mod-index">
    <el-row class="btnGroup">
      <el-button plain @click="getDataList(0)" :class="{activeFlag:activeFlag===0}">未审核</el-button>
      <el-button plain @click="getDataList(1)">批准</el-button>
      <el-button plain @click="getDataList(2)">拒绝</el-button>
      <el-button plain @click="getDataList()">全部</el-button>
    </el-row>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="leaveId"
        header-align="center"
        align="center"
        width="80"
        label="假条ID">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="请假人ID"
      >
      </el-table-column>
      <el-table-column
        prop="dealId"
        header-align="center"
        align="center"
        label="处理人ID"
      >
      </el-table-column>
      <el-table-column
        prop="beginTime"
        header-align="center"
        align="center"
        label="开始时间"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="etlTime"
        header-align="center"
        align="center"
        label="处理时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="申请时间"
      >
      </el-table-column>
      <el-table-column
        prop="totalCount"
        header-align="center"
        align="center"
        label="请假总工时">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="请假类型"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.leaveType===0">带薪假</span>
          <span v-show="scope.row.leaveType===1">病假</span>
          <span v-show="scope.row.leaveType===2">无薪假</span>
          <span v-show="scope.row.leaveType===3">事假</span>
          <span v-show="scope.row.leaveType===4">年假</span>
          <span v-show="scope.row.leaveType===5">居家办公</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.status===0">创建</span>
          <span v-show="scope.row.status===1">批准</span>
          <span v-show="scope.row.status===2">拒绝</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="operate(scope.row.leaveId)" :disabled="scope.row.status!==0?true:false">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <operate ref="operate"></operate>
  </div>
</template>

<script>
import operate from './operate'
export default {
  components:{
    operate
  },
  data () {
    return {
      dataForm: {
        title: ''
      },
      activeFlag:0,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  //在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等
  activated () {
    this.getDataList(0)
  },
  methods: {
    //处理
    operate(a){
      this.$refs.operate.openDialog(true,JSON.parse(JSON.stringify(a)))
    },
    // 获取数据列表
    getDataList (status) {
      if(status===undefined){
        status=''
      }
      this.activeFlag=status
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-leave/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'status':status,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          console.log(this.dataList)
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0

        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },

  }
}
</script>
<style scoped>
.btnGroup{
  margin-bottom:20px;
}
.activeFlag{
  border-color: #17B3A3;
  color: #17B3A3;
}
</style>
