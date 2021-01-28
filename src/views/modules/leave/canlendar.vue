<template>
  <div class="mod-canlendar">
    <div id="eChart" ref="eChart" />
  </div>
</template>

<script>
export default {
name: "canlendar",
  data(){
    return{

    }
  },
  mounted () {
    this.getCharts()
  },
  methods:{
    getCharts(){
        let chart5 = this.$refs.eChart;
        let myChart5 = this.$echarts.init(chart5);
        let option = {
          title: {
            text: '员工请假工时图',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
              var tar;
              if (params[1].value !== '-') {
                tar = params[1];
              }
              else {
                tar = params[0];
              }
              return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
          },
          legend: {
            data: ['请假工时']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'category',
            splitLine: {show: false},
            data: function () {
              var list = [];
              for (var i = 1; i <= 11; i++) {
                list.push('11月' + i + '日');
              }
              return list;
            }()
          },
          xAxis: {
            type: 'value'
          },
          series: [
            {
              name: '辅助',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              },
              emphasis: {
                itemStyle: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
                }
              },
              data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
            },
            {
              name: '请假工时',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                color: 'rgb(10,194,240)'
              },
              label: {
                show: true,
                position: 'top'
              },
              data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
            },
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
#eChart{
  width: 100%;
  height: 79vh;
}
</style>
