<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="25%"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="省" prop="prov">
        <el-select v-model="dataForm.prov" clearable placeholder="请选择省份" @change="getCity()">
          <el-option
            v-for="(item,index) in provs"
            :key="index"
            :label="item.remark"
            :value="item.paramName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="city">
        <el-select v-model="dataForm.city" clearable placeholder="请选择城市"  @change="getArea()">
          <el-option
            v-for="(item,index) in citys"
            :key="index"
            :label="item.remark"
            :value="item.paramName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区" prop="area">
        <el-select v-model="dataForm.area" clearable placeholder="请选择区">
          <el-option
            v-for="(item,index) in areas"
            :key="index"
            :label="item.remark"
            :value="item.paramId">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      provs:[],
      citys:[],
      areas:[],
      dataForm: {
        prov:'',
        city:'',
        area:''
      },
      dataRule: {
        prov: [
          { required: true, message: '省份不可为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '市不可为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '区不可为空', trigger: 'blur' }
        ],
      }
    }
  },
  created () {
    this.getProv()
  },
  methods: {
    //获得省份下拉信息
    getProv(){
      this.$http({
        url: this.$http.adornUrl('/manage-param/provs'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.provs=data.data
        }
      })
    },
    //获得市区
    getCity(){
      this.dataForm.city=''
      this.dataForm.area=''
      this.$http({
        url: this.$http.adornUrl('/manage-param/cities'),
        method: 'get',
        params: this.$http.adornParams({
          'code':this.dataForm.prov
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.citys=data.data
        }
      })
    },
    //获得区县
    getArea(){
      this.dataForm.area=''
      this.$http({
        url: this.$http.adornUrl('/manage-param/areas'),
        method: 'get',
        params: this.$http.adornParams({
          'code':this.dataForm.city
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.areas=data.data
        }
      })
    },
    //页面开关
    openDialog(flag, val) {
      this.visible = flag;
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData();
          fd.append("paramId", this.dataForm.area);
          this.$http({
            url: this.$http.adornUrl('/manage-param/visit/add'),
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
              })
              this.$parent.getDataList();
              this.visible=false
              this.$refs.dataForm.resetFields();
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

