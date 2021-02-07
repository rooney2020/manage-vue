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
    <div style="overflow-x: scroll">
      <div class="echart" ref="eChart" :style="[{width:xData.length*120+'px'},{height:yData.length*50+'px'}]" ></div>
    </div>

  </div>
</template>

<script>
export default {
name: "canlendar",
  data(){
    return{
      time:[],
      yData:[],
      xData:[],
      gsData:[],
      width:'',
      height:'',
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
    if(month==='02'){
      if(year%4===0){
         time2=year+'-'+month+'-'+'29'
         max=29
      }else{
          time2=year+'-'+month+'-'+'28'
          max=28
      }
    }else if(month==='04'||month==='06'||month==='09'||month==='11'){
          time2=year+'-'+month+'-'+'30'
          max=30
    }else{
          time2=year+'-'+month+'-'+'31'
          max=31
    }
    this.time=[time1,time2]
    for(var i=1;i<=max;i++){
      if(i<10){
        this.xData.push(year+'-'+month+'-'+'0'+i)
      }else{
        this.xData.push(year+'-'+month+'-'+i)
      }
    }
    this.width=this.xData.length*120+'px'
    console.log(this.width)
    this.getChartsData()
  },
  methods:{
    search(){
      this.xData=[]
      console.log(this.time)
      let min=this.time[0].substring(8,10)
      let max=this.time[1].substring(8,10)
      let year=this.time[0].substring(0,4)
      let month=this.time[0].substring(5,7)
      for(var i=min;i<=max;i++){
        if(i<10&&i!==min){
          this.xData.push(year+'-'+month+'-'+'0'+i)
        }else{
          this.xData.push(year+'-'+month+'-'+i)
        }
      }
      this.width=this.xData.length*120+'px'
      console.log(this.width)
      this.getChartsData()
    },
    //获取工时 数据
    getChartsData(){
      this.yData=[]
      this.gsData=[]
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
             this.yData.push(el.chineseName)
             el.records.forEach(al=>{
               this.gsData.push({value:[i,al.beginTime,al.endTime]})
             })
           })
          console.log(this.gsData)
            this.getCharts()
        }
      })
    },
    //画图
    getCharts(){
      console.log(this.xData)
        let chart5 = this.$refs.eChart;
        let myChart5 = this.$echarts.init(chart5);
        console.log(this.gsData)
        // var baseDate=`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
        let option = {
          color: "#0A8BFF",
          backgroundColor:"#fff",
          title: {
            text: '员工请假工时图',
          },
          tooltip: {
            enterable:true,
            //alwaysShowContent:true,
            hideDelay:100,
            backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
            borderRadius: 5,//边框圆角
            padding: [5,0,5,0],    // [5, 10, 15, 20] 内边距
            textStyle:{
              color:'#000'
            },
          },
          legend: {//图例
            data: ['工时'],
            left: '0px',
            top:"6%",
            itemWidth:16,
            itemHeight:16,
            selectedMode: false, // 图例设为不可点击
            textStyle: {
              color: 'rgba(0, 0, 0, 0.45)',
              fontSize:14
            }
          },
          grid: {//绘图网格
            left: '0%',
            right: '3%',
            top: '10%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            position: 'top',
            data: this.xData,
            axisLabel: {
              textStyle: {
                color: 'rgba(0,0,0,0.65)',  //更改坐标轴文字颜色
                fontSize : 14      //更改坐标轴文字大小
              }
            },
            axisLine:{
              lineStyle:{
                color:'rgba(0,0,0,0.1)',
              }
            },

          },
          yAxis: {
            axisLine:{
              lineStyle:{
                color:'rgba(0,0,0,0.1)',
              }
            } ,
            data: this.yData,
            axisLabel: {
              textStyle:{
                color:"rgba(0, 0, 0, 0.65)", //刻度颜色
                fontSize:14  //刻度大小
              },
            }
          },
          series: [
            // 用空bar来显示三个图例
            { name: "工时", type: 'bar', data: [],barMaxWidth:10 },
            // { name: state[1], type: 'bar', data: [],barMaxWidth:10 },
            // { name: state[2], type: 'bar', data: [],barMaxWidth:10 },
            {
              type: 'custom',
              renderItem: function (params, api) {//开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
                var categoryIndex = api.value(0);//这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
                var start = api.coord([api.value(1), categoryIndex]); // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
                var end = api.coord([api.value(2), categoryIndex]);
                // var height = api.size([0, 1])[1];
                var height =20;
                return {
                  type: 'rect',// 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                  shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                  }, { // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }),
                  style: api.style()
                };
              },
              encode: {
                x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
                y: 0// data 中『维度0』对应到 Y 轴
              },
              itemStyle: {
                normal: {
                  color: '#0A8BFF',
                  barBorderRadius: 40,
                },
                emphasis: {
                  barBorderRadius: 30
                }
              },
              data:this.gsData // 维度0 维度1 维度2 //value: [0, `2021-02-1`, `2021-02-12`,'in']//0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
            }
          ]
        };
        myChart5.setOption(option);
    }
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
.mod-canlendar .echart{
  min-height: 70vh;
}
</style>
