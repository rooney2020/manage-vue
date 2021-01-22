<template>
  <div class="mod-manage">
    <el-button v-if="isAuth('sys:user:save')" type="primary" @click="epidemicAdd()">新增</el-button>
    <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">删除</el-button>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;margin-top: 2vh">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="paramId"
        header-align="center"
        align="center"
        width="80"
        label="参数ID">
      </el-table-column>
      <el-table-column
        prop="groupId"
        header-align="center"
        align="center"
        label="所属参数组">
      </el-table-column>
      <el-table-column
        prop="paramName"
        header-align="center"
        align="center"
        label="省份ID">
      </el-table-column>
      <el-table-column
        prop="paramValue"
        header-align="center"
        align="center"
        label="区域码">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="省份名">
      </el-table-column>
    </el-table>
    <epidemicAdd ref="epidemicAdd"></epidemicAdd>
  </div>
</template>

<script>
import epidemicAdd from './epidemic-add'
export default {
  components:{
    epidemicAdd
  },
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    //新增
    epidemicAdd(){
      this.$refs.epidemicAdd.openDialog(true)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-param/visit'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data
        } else {
          this.dataList = []

        }
        this.dataListLoading = false
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 删除
    deleteHandle () {
      let paramIds=[]
      this.dataListSelections.forEach(el=>{
        paramIds.push(el.paramId)
      })
      // paramIds=paramIds.join(',')
      console.log(paramIds)
      this.$confirm('确定要删除选中的疫情地区吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let fd = new FormData();
        fd.append("paramIds", paramIds);
        this.$http({
          url: this.$http.adornUrl('/manage-param/visit/delete'),
          method: 'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          contentType:"'application/x-www-form-urlencoded'",
          type:"application/x-www-form-urlencoded",
          data: fd
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
            })
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

