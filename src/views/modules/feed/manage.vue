<template>
  <div class="mod-manage">
    <el-row class="btnGroup">
      <el-button plain @click="getDataList()" :class="{activeFlag:activeFlag===''}">全部</el-button>
      <el-button plain @click="getDataList(1)">已处理</el-button>
      <el-button plain @click="getDataList(0)">未处理</el-button>
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
        prop="feedId"
        header-align="center"
        align="center"
        width="80"
        label="反馈ID">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="反馈人ID"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="反馈人手机号"
        >
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="反馈内容"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="反馈时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        >
        <template slot-scope="scope">
          <span v-show="scope.row.status===0">未处理</span>
          <span v-show="scope.row.status===1">已处理</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="resolveUserId"
        header-align="center"
        align="center"
        label="处理人ID"
      >
      </el-table-column>
      <el-table-column
        prop="etlTime"
        header-align="center"
        align="center"
        label="处理时间"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" >处理</el-button>
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
<!--    <newsAdd ref="addData"></newsAdd>-->
<!--    <newsUpdata ref="editData"></newsUpdata>-->
  </div>
</template>

<script>

export default {
  components:{

  },
  data () {
    return {
      dataForm: {
        title: ''
      },
      activeFlag:'',
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
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (status) {
      if(status===undefined){
        status=''
      }
      this.activeFlag=status
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-feedback/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'status':status,
          'resolveUserId':'',
          'userId':''
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
