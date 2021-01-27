<template>
  <div class="mod-manage">
    <el-form :inline="true"  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-date-picker
          v-model="punchDate"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
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
        prop="userName"
        header-align="center"
        align="center"
        width="100"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="upTime"
        header-align="center"
        align="center"
        label="上班打卡时间">
      </el-table-column>
      <el-table-column
        prop="upPosition"
        header-align="center"
        align="center"
        label="上班打卡地点">
      </el-table-column>
      <el-table-column
        prop="upType"
        header-align="center"
        align="center"
        label="上班打卡类型">
      </el-table-column>
      <el-table-column
        prop="downTime"
        header-align="center"
        align="center"
        label="下班打卡时间">
      </el-table-column>
      <el-table-column
        prop="downPosition"
        header-align="center"
        align="center"
        label="下班打卡地点">
      </el-table-column>
      <el-table-column
        prop="downType"
        header-align="center"
        align="center"
        width="180"
        label="下班打卡类型">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      punchDate:'',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
    }
  },
  activated () {
    let time=new Date()
    let year=time.getFullYear()
    let month=time.getMonth()+1
    month = month < 10 ? '0' + month : month;
    let date=time.getDate()
    date = date < 10 ? '0' + date : date;
    this.punchDate=year+'-'+month+'-'+date
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-punch/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'date': this.punchDate
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.dataList.forEach(el=>{
            if(el.upType!==0&&el.upType!==null){
              el.upType='外勤上班打卡'
            }else{
              el.upType='正常上班打卡'
            }

            if(el.downType!==0&&el.downType!==null){
              el.downType='外勤下班打卡'
            }else{
              el.downType='正常下班打卡'
            }
          })
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
