<template>
  <div class="mod-canlendar">
    <div>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button @click="search()">搜索</el-button>
    </div>
    <p>员工请假工时图</p>
    <h6>标<div style="background-color: rgb(10,194,240);width: 20px;height: 10px;border-radius: 2px;display: inline-block"></div>色为该员工当天请假</h6>
    <el-table
      :data="tableData"
      height="65vh"
      id="tableid"
      cellspacing="0"
      cellpadding="0"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label=""
        fixed
        width="100">
      </el-table-column>
      <el-table-column
        v-for="(item,index) in columnList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        width="93"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
name: "canlendar",
  data(){
    return{
      time:[],
      gsData:[],
      tableData:[],
      begin:0,
      end:0,
      columnList:[]
    }
  },
  mounted () {
    //初始化 时间
    let time=new Date()
    let year=time.getFullYear()
    let month=time.getMonth()+1
    month = month < 10 ? '0' + month : month;
    let time1=year+'-'+month+'-'+'01'
    let time2=''
    let max=''
    if(month===2){
      if(year%4===0){
         time2=year+'-'+month+'-'+'29'
         max=29
      }else{
          time2=year+'-'+month+'-'+'28'
          max=28
      }
    }else if(month===4||month===6||month===9||month===11){
          time2=year+'-'+month+'-'+'30'
          max=30
    }else{
          time2=year+'-'+month+'-'+'31'
          max=31
    }
    this.time=[time1,time2]
    for(var i=1;i<=max;i++){
      this.columnList.push(
        {
          label:year+'-'+month+'-'+i,
          prop:'c'+i
        }
      )
    }
    this.getChartsData()
  },
  methods:{
    search(){
      this.columnList=[]
      console.log(this.time)
      let min=this.time[0].substring(8,10)
      let max=this.time[1].substring(8,10)
      let year=this.time[0].substring(0,4)
      let month=this.time[0].substring(5,7)
      console.log(min,max,year,month)
      for(var i=min;i<=max;i++){
        this.columnList.push(
          {
            label:year+'-'+month+'-'+i,
            prop:'c'+i
          }
        )
      }
      this.getChartsData()
    },
    //获取工时 数据
    getChartsData(){
      this.tableData=[]
      console.log(this.time[0].substring(8,10))
      console.log('99999999999999')
      this.$http({
        url: this.$http.adornUrl('/manage-leave/records'),
        method: 'get',
        params: this.$http.adornParams({
          'beginDate': this.time[0],
          'endDate': this.time[1],
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          data.data.forEach((el,i)=>{
            this.gsData=[]
            this.tableData.push({
              userName:el.chineseName
            })
            let gsTrue=[]
            el.records.forEach((al,y)=>{
              let a=al.beginTime.substring(8,10)-this.time[0].substring(8,10)+1
              let b=al.endTime.substring(8,10)-this.time[0].substring(8,10)+1
              for(let g=a;g<=b;g++){
                gsTrue.push('c'+g)
                this.gsData.push(g)
              }

            })
            gsTrue.forEach(gl=>{
              let z=gl
              this.tableData[i][z]=1
            })
            this.$nextTick(()=>{
              let l=document.getElementsByClassName('cell')
              this.gsData=Array.from(l)
              this.gsData.forEach((ol,b)=>{
                if(ol.innerText==='1'){
                  ol.style.background='rgb(10,194,240)'
                  ol.style.color='rgb(10,194,240)'
                }
              })
            })
            console.log(this.tableData)
          })
        }
      })
    },
    //设置指定行、列、具体单元格颜色
    // cellStyle({row, column, rowIndex, columnIndex}) {
    //   this.gsData.forEach(el=>{
    //     if (rowIndex === el[0] && columnIndex === el[1]) { //指定坐标rowIndex ：行，columnIndex ：列
    //       return 'background:rgb(10,194,240)'
    //     } else {
    //       return ''
    //     }
    //   })
    //
    // }
    // //画图
    // getCharts(){
    //     let chart5 = this.$refs.eChart;
    //     let myChart5 = this.$echarts.init(chart5);
    //     let option = {
    //       title: {
    //         text: '员工请假工时图',
    //       },
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //           type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //         },
    //         formatter: function (params) {
    //           var tar;
    //           if (params[1].value !== '-') {
    //             tar = params[1];
    //           }
    //           else {
    //             tar = params[0];
    //           }
    //           return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
    //         }
    //       },
    //       legend: {
    //         data: ['请假工时']
    //       },
    //       grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //       },
    //       yAxis: {
    //         type: 'category',
    //         splitLine: {show: false},
    //         data: this.userData
    //       },
    //       xAxis: {
    //         type: 'value'
    //       },
    //       series: [
    //         {
    //           name: '辅助',
    //           type: 'bar',
    //           stack: '总量',
    //           itemStyle: {
    //             barBorderColor: 'rgba(0,0,0,0)',
    //             color: 'rgba(0,0,0,0)'
    //           },
    //           emphasis: {
    //             itemStyle: {
    //               barBorderColor: 'rgba(0,0,0,0)',
    //               color: 'rgba(0,0,0,0)'
    //             }
    //           },
    //           data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
    //         },
    //         {
    //           name: '请假工时',
    //           type: 'bar',
    //           stack: '总量',
    //           itemStyle: {
    //             color: 'rgb(10,194,240)'
    //           },
    //           label: {
    //             show: true,
    //             position: 'top'
    //           },
    //           data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
    //         },
    //       ]
    //     };
    //     myChart5.setOption(option);
    // }
  }
}
</script>

<style scoped>
.mod-canlendar{
  width: 100%;
  height: 100%;
}
.mod-canlendar p{
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.mod-canlendar h6{
  display: inline-block;
  margin: 0;
  padding: 0;
  color: #8c939d;
}
</style>
