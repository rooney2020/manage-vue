<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="项目id" prop="projectId">
        <el-select v-model="dataForm.projectId" clearable placeholder="请选择项目id" @change="getDataList">
          <el-option
            v-for="(item,index) in projectIds"
            :key="index"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button @click="getDataList()">查询</el-button>-->
<!--        <el-button v-if="isAuth('project:managetask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
<!--        <el-button v-if="isAuth('project:managetask:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
<!--      </el-form-item>-->
    </el-form>
    <el-row :gutter="20" style="margin-bottom: 1vh">
      <el-col :span="18">
        <el-button type="primary" plain ref="moren" @click="handleBtn('all')" :class="{activeFlag:option===''}">全部</el-button>
        <el-button type="primary" plain @click="handleBtn(0)" :class="{activeFlag:option===0}">指派给我</el-button>
        <el-button type="primary" plain @click="handleBtn(1)" :class="{activeFlag:option===1}">由我创建</el-button>
        <el-button type="primary" plain @click="handleBtn(2)" :class="{activeFlag:option===2}">由我完成</el-button>
      </el-col>
      <el-col :span="6">
        <el-button v-if="isAuth('project:managetask:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('project:managetask:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-col>
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
        label="项目名"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="taskName"
        header-align="center"
        align="center"
        label="任务名称"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0">未开始</span>
          <span v-if="scope.row.status===1">进行中</span>
          <span v-if="scope.row.status===2">已完成</span>
          <span v-if="scope.row.status===3">已关闭</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="assignName"
        header-align="center"
        align="center"
        label="指派给">
      </el-table-column>
      <el-table-column
        prop="completeName"
        header-align="center"
        align="center"
        label="完成者">
      </el-table-column>
      <el-table-column
        prop="estimate"
        header-align="center"
        align="center"
        label="预计"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="usedTime"
        header-align="center"
        align="center"
        label="已消耗"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="beginDate"
        header-align="center"
        align="center"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="endDate"
        header-align="center"
        align="center"
        label="截止日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="210"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.status!==0" title="开始" @click="caozuo(scope.row)">
            <icon-svg name="kaishi" :class="[{icon:scope.row.status===0},{icon1 : scope.row.status!==0}]"></icon-svg>
          </el-button>
          <el-button type="text" :disabled="scope.row.status!==1" title="完成" @click="caozuo(scope.row)">
            <icon-svg name="wancheng" :class="[{icon:scope.row.status===1},{icon1 : scope.row.status!==1}]"></icon-svg>
          </el-button>
          <el-button type="text" :disabled="scope.row.status!==2" title="关闭" @click="caozuo(scope.row)">
            <icon-svg name="jieshu4" :class="[{icon:scope.row.status===2},{icon1 : scope.row.status!==2}]"></icon-svg>
          </el-button>
          <el-button type="text" title="编辑" @click="addOrUpdateHandle(scope.row.taskId)">
            <icon-svg name="bianji" class="icon"></icon-svg>
          </el-button>
          <el-button type="text" title="工时" @click="gongshi(scope.row)">
            <icon-svg name="gongshi" class="icon"></icon-svg>
          </el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <gongshi ref="gongshiDialog"></gongshi>
  </div>
</template>

<script>
  import AddOrUpdate from './managetask-add-or-update'
  import gongshi from './gongshi'
  export default {
    data () {
      return {
        projectIds:[],
        dataForm: {
          projectId:''
        },
        option:'',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      gongshi
    },
    activated () {
      this.getDataList()
      this.getprojectIds()
    },
    methods: {
      //操作
      caozuo(val){
        this.$http({
          url: this.$http.adornUrl('/manage-task/status'),
          method: 'post',
          data: this.$http.adornData({
            'taskId': val.taskId,
            'status': val.status+1
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          }
        })
      },
      //工时
      gongshi(val){
        let a={
          title:val.taskName,
          id:val.taskId
        }
        this.$refs.gongshiDialog.openDialog(a)
      },
      handleBtn(val){
        if(val==='all'){
          this.option=''
        }else{
          this.option=val
        }
        this.getDataList()
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/manage-task/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'projectId': this.dataForm.projectId,
            'option':this.option
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.taskId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/manage-task/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style>
.mod-config .icon{
  color: #1296db;
  font-weight: 600;
  font-size: 20px;
}
.mod-config .icon1{
  font-weight: 600;
  font-size: 20px;
}
.mod-config .el-button--text{
  margin-right: -0.7vw;
}
.mod-config .activeFlag{
  background-color: #409EFF!important;
  color: #ffffff;
}
</style>
