<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="danger" @click="readHandle()" :disabled="dataListSelections.length <= 0">设为已读</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="msId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="msContent"
        header-align="center"
        align="center"
        label="内容">
      </el-table-column>
      <el-table-column
        prop="msFromUser.chineseName"
        header-align="center"
        align="center"
        label="发送人姓名">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="isRead"
        header-align="center"
        align="center"
        label="已读">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRead === 0" size="small" type="danger">未读</el-tag>
          <el-tag v-else size="small">已读</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="readHandle(scope.row.msId)">已读</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.msId)">删除</el-button>
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
  </div>
</template>
<script>
  import mainNavbarVue from '../../main-navbar.vue'
  var main = mainNavbarVue
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    components: {
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/manage-message/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
      // 已读
      readHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.msId
        })
        let fd = new FormData();
        fd.append("msIds", ids);
        this.$http({
          url: this.$http.adornUrl('/manage-message/read'),
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
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.msId
        })
        let fd = new FormData();
        fd.append("msIds", ids);
        this.$http({
          url: this.$http.adornUrl('/manage-message/remove'),
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
      }
    }
  }
</script>
