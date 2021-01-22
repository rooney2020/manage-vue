<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.paramKey" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增参数组</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      row-key="uuid"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="groupId"
        sortable
        label="组ID"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="组名"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="paramId"
        label="参数ID"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="paramName"
        label="参数名"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="paramValue"
        label="参数值"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="configADD(scope.row.groupId)" v-if="!scope.row.paramId">新增参数</el-button>
          <el-button type="text" size="small" @click="configUpdata(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteConfig(scope.row)">删除</el-button>
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
    <configAdd ref="configAdd"></configAdd>
    <AddConfigGroup ref="AddConfigGroup"></AddConfigGroup>
    <configUpdata ref="configUpdata"></configUpdata>
  </div>
</template>

<script>
import configAdd from './config-add'
import AddConfigGroup from './configGroup-add'
import configUpdata from './configUpdata'

export default {
  data () {
    return {
      dataForm: {
        paramKey: ''
      },
      dataList: [],
      canshu:[],
      canshuGroup:[],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    configAdd,
    AddConfigGroup,
    configUpdata
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-param/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'name': this.dataForm.paramKey
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data.page.list)
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
    // 新增参数组
    addOrUpdateHandle () {
      this.$refs.AddConfigGroup.init(true)
    },
    //新增参数
    configADD(a){
      this.$refs.configAdd.init(true,JSON.parse(JSON.stringify(a)))
    },
    //修改
    configUpdata(a){
      this.$refs.configUpdata.init(true,JSON.parse(JSON.stringify(a)))
    },
    // 删除
    deleteConfig(a){
      if(a.paramId){
        let paramIds=[]
        paramIds.push(a.paramId)
        this.$confirm(`确定对参数ID为${a.paramId}的参树进行删除操作吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/manage-param/delete'),
            method: 'post',
            data:paramIds
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
        })
      }else {
        let groupIds=[]
        groupIds.push(a.groupId)
        this.$confirm(`确定对参数ID为${a.groupId}的参树进行删除操作吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/manage-paramgroup/delete'),
            method: 'post',
            data:groupIds
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
        })
      }

    },
    //批量删除
    deleteHandle () {
      this.dataListSelections.forEach(el=>{
        if(el.paramId){
          this.canshu.push(el.paramId)
        }else{
          this.canshuGroup.push(el.groupId)
        }
      })
      this.$confirm(`确定对选中的参数进行删除操作吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.canshu!==[]){
          this.$http({
            url: this.$http.adornUrl('/manage-param/delete'),
            method: 'post',
            data:this.canshu
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除选中参数成功',
                type: 'success',
                duration: 500,
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }
        if(this.canshuGroup!==[]){
          this.$http({
            url: this.$http.adornUrl('/manage-paramgroup/delete'),
            method: 'post',
            data:this.canshuGroup
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除选中参数组成功',
                type: 'success',
                duration: 500,
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }

        this.canshuGroup=[]
        this.canshu=[]
      }).catch(() => {
      })
    }
  }
}
</script>
