<template>
  <div class="mod-newsList">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="新闻标题" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="newsAdd()">新增</el-button>
<!--        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        prop="newsId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="新闻标题"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="内容"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="130"
        label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" width="70px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="isActive"
        header-align="center"
        align="center"
        label="状态"
        width="180">
        <template slot-scope="scope">
<!--          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>-->
<!--          <el-tag v-else size="small">正常</el-tag>-->
          <el-switch
            style="display: block"
            v-model="scope.row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="正常"
            @change="stateChange(scope.row)"
            inactive-text="禁用"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="newUpdata(scope.row)">修改</el-button>
<!--          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>-->
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
    <newsAdd ref="addData"></newsAdd>
    <newsUpdata ref="editData"></newsUpdata>
  </div>
</template>

<script>
import newsAdd from './newsAdd'
import newsUpdata from  './newsUpdata'
export default {
  components:{
    newsAdd,
    newsUpdata
  },
  data () {
    return {
      dataForm: {
        title: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    //修改状态
    stateChange(a){
      console.log(a)
      let flag=''
      if(a.isActive===true){
        flag=0
      }else{
        flag=1
      }
      let url=a.imageUrl.slice(28)
      this.$http({
        url: this.$http.adornUrl('/manage-news/update'),
        method: 'post',
        data: this.$http.adornData({
          'newsId':a.newsId,
          'title': a.title,
          'imageUrl':url,
          'content':a.content,
          'isActive': flag
        })
      }).then(({data}) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
        })
        this.getDataList()
      })
    },
    //修改
    newUpdata(a){
      this.$refs.editData.openDialog(true,JSON.parse(JSON.stringify(a)));
    },
    //新增
    newsAdd(){
      this.$refs.addData.openDialog(true);
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/manage-news/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'title': this.dataForm.title
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data.list
          this.dataList.forEach(el=>{
            el.imageUrl='http://192.144.229.232:51120'+el.imageUrl
            if(el.isActive===0){
              el.isActive=true
            }else{
              el.isActive=false
            }
          })
          console.log(this.dataList)
          this.totalPage = data.data.totalCount
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

    // 删除
    deleteHandle (id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/user/delete'),
          method: 'post',
          data: this.$http.adornData(userIds, false)
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
      }).catch(() => {})
    }
  }
}
</script>
