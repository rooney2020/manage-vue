<template>
  <div class="mod-index">
    <div class="top">
      各位同事：鉴于疫情管控工作所需，现持续排查近期到访过疫情地区，及大陆以外境外地区的员工名单和人员接触情况，请各位同事主动申报相关情况，谢谢。
    </div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" class="formData">
      <p>1、请选择您近期工作的省市区</p>
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
      <p>2、 自今日起之前14天内，您本人、家人、共同居住者或密切接触者是否到访过疫情地区？</p>
      <el-form-item>
        <el-radio-group v-model="dataForm.isVisit">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.isVisit===1">
        <el-checkbox-group v-model="dataForm.visitProv">
          <el-checkbox :label="item.paramId" v-for="(item,index) in epodemicData" :key="index">{{item.remark}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <p>3、身体状况</p>
      <el-form-item>
        <el-radio-group v-model="dataForm.healthStatus">
          <el-radio :label="0">发烧感冒</el-radio>
          <el-radio :label="1">一切正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <p>4、工作状态</p>
      <el-form-item>
        <el-radio-group v-model="dataForm.workStatus">
          <el-radio :label="0">在家隔离</el-radio>
          <el-radio :label="1">正常上班</el-radio>
          <el-radio :label="2">请假休假</el-radio>
        </el-radio-group>
      </el-form-item>
      <p>5、工作地点</p>
      <el-form-item>
        <el-input v-model="dataForm.workPlace"></el-input>
      </el-form-item>
      <p>6、接触同事范围</p>
      <el-form-item>
        <el-input v-model="dataForm.workmateRange"></el-input>
      </el-form-item>
      <p>7、后续安排</p>
      <el-form-item>
        <el-radio-group v-model="dataForm.arrangement">
          <el-radio :label="0">自我隔离</el-radio>
          <el-radio :label="1">预约核酸检测</el-radio>
          <el-radio :label="2">等待核酸结果</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="display: block">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
name: "index",
  data(){
    return{
      provs:[],
      citys:[],
      areas:[],
      epodemicData:[],
      epodemicRemack:'',
      dataForm: {
        prov:'',
        city:'',
        area:'',
        isVisit:0,
        visitProv:[],
        healthStatus:1,
        workStatus:1,
        workPlace:'',
        workmateRange:'',
        arrangement:0
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
  mounted () {
    this.epodemicList()
  },
  methods: {
    //获取疫情地区 地址
    epodemicList(){
      let remark=[]
      this.$http({
        url: this.$http.adornUrl('/manage-param/visit'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.epodemicData=data.data
          this.epodemicData.forEach(el=>{
            remark.push(el.remark)
          })
        }
      })
      this.epodemicRemack=remark
    },
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
      this.$http({
        url: this.$http.adornUrl('/manage-param/cities'),
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
    //重置
    resetForm(){
      this.$refs.dataForm.resetFields();
    },
    // 表单提交
    submitForm () {
      let prov=''
      prov=this.dataForm.visitProv.toString()
      console.log(prov)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let fd = new FormData();
          fd.append("paramId", this.dataForm.area);
          this.$http({
            url: this.$http.adornUrl('/manage-form/save'),
            method: 'post',
            data: this.$http.adornData({
              'provId':this.dataForm.area,
              'isVisit':this.dataForm.isVisit,
              'visitProv':prov,
              'healthStatus':this.dataForm.healthStatus,
              'workStatus':this.dataForm.workStatus,
              'workPlace':this.dataForm.workPlace,
              'workmateRange':this.dataForm.workmateRange,
              'arrangement':this.dataForm.arrangement
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              })
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

<style scoped>
.mod-index{
  width: 100%;
}
.top{
  border-radius: 3px;
  color: #ffffff;
  width: 81%;
  height: 40px;
  line-height: 40px;
  padding-left: 5px;
  background-color: #3b97d7;
  margin: 0 auto;
}
.formData{
  width: 80%;
  margin: 0 auto;
}
.formData p{
  margin-left: 50px;
}
.el-form-item{
  display: inline-block;
}
</style>
