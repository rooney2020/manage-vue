<template>
<div class="mod-index">
  <div class="map">
    <el-amap vid="amapDemo" :amap-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
    </el-amap>
  </div>
  <div class="right">
    <el-timeline>
      <el-timeline-item timestamp="上班时间09:00" placement="top">
        <el-card>
          <span>打卡时间:{{punchData.up.createTime}}</span>
          <span v-if="punchData.up.createTime===0">正常</span>
          <span v-if="punchData.up.createTime===1">外勤</span>
          <p>{{punchData.up.position}}</p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="下班时间18:00" placement="top">
        <el-card>
          <span>打卡时间:{{punchData.down.createTime}}</span>
          <span v-if="punchData.down.createTime===2">正常</span>
          <span v-if="punchData.down.createTime===3">外勤</span>
          <p>{{punchData.down.position}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div class="btn" @click="punchGet()" :style="{'background': menuContent===1 ? 'linear-gradient(180deg, #6ce26c 0%, #17b3a3 100%)':'linear-gradient(180deg, #FF4C52 0%, #ff2222 100%)'}">
      <p v-show="punchData.up.createTime===null">上班</p>
      <p v-show="punchData.up.createTime!==null">下班</p>
      <p class="btn2" v-show="menuContent===0">外勤打卡</p>
      <p class="btn2" v-show="menuContent===1">正常打卡</p>
    </div>
    <p class="metion" v-show="menuContent===0" style="color: red">您当前不在打卡范围内，可外勤打卡或重新定位</p>
    <p class="metion" v-show="menuContent===1" style="color: #6ce26c">您已进入打卡范围，可正常打卡</p>
    <h6 style="text-align: center;color: #999999;font-size: 10px">当前位置:{{area}}</h6>
  </div>

</div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import { AMapManager } from 'vue-amap';
let amapManager =new AMapManager()
export default {
name: "index.vue",
  data(){
    const _this=this;
    return {
      map:null,
      amapManager,
      punchData:null,
      area:'',
      cityCode:'',
      menuContent:'',
      zoom: 5,
      rightCenter: [116.59996, 39.197646],//公司经纬度
      events: {
        //初始化
        init(o){
          lazyAMapApiLoaderInstance.load().then(() => {
            _this.initMap();
          });
        }
      }
    }
  },
  mounted () {
    this.getpunchData()
    //获取地图实例  兼容高德地图
    // lazyAMapApiLoaderInstance.load().then(() => {
    //   this.map = new AMap.Map('amapDemo', {
    //     center: this.center,
    //     zoom:this.zoom
    //   });
    // });
  },
  methods:{
    //打卡
    punchGet(){
      if(this.punchData.down.createTime===null){
        this.$http({
          url: this.$http.adornUrl('/manage-punch/punch'),
          method: 'post',
          data: this.$http.adornData({
            position:this.area,
            punchType:this.menuContent
          })
        }).then(({data}) => {
          this.$message({
            message: '打卡成功~',
            type: 'success',
            duration: 1500,
          })
          this.getpunchData()
        })
      }else{
        this.$message({
          message: '您已经打过卡了~',
          type: 'error',
          duration: 1500,
        })
      }
    },
    //今日打卡信息
    getpunchData(){
      this.$http({
        url: this.$http.adornUrl('/manage-punch/status'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.punchData=data
        }
      })
    },
    //地图初始化
    initMap(){
      let _this=this
      let lnglatXY=[]
      //获取地图实例
      this.map=amapManager.getMap();
      //浏览器定位
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        buttonPosition:'RB',    //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
      });
      this.map.addControl(geolocation);//定位按钮
      //获取位置
      geolocation.getCurrentPosition(function(status,result){
        if(status==='complete'){
          lnglatXY = [result.position.Q,result.position.R];
          _this.area=result.formattedAddress
          console.log(result.formattedAddress)
          console.log(lnglatXY)
          debugger
          //判断  是否在范围内
          var dis = AMap.GeometryUtil.distance(_this.rightCenter, lnglatXY);
          console.log(dis)
          if(dis<1000){
            _this.menuContent=1
          }else{
            _this.menuContent=0
          }
        }else{
          console.log(result)
        }
      });
      console.log(this.map)
    },
  }
}
</script>

<style scoped>
.mod-index{
  width: 100%;
  height: 80vh;
}
.map{
  width: 50%;
  float: left;
  height: 100%;
}
.right{
  width: 47%;
  height: 80vh;
  float: right;
}
.right .metion{
  text-align: center;
}
.btn{
  margin: 0 auto;
  width: 160px;
  height: 160px;
  border-radius: 80px;
  color: #ffffff;
  cursor: pointer;
  background: linear-gradient(180deg, #008855 0%, #17b3a3 100%);
}
.btn p{
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  padding-top: 40px;
}
.btn .btn2{
  padding-top: 10px;
  font-weight: 600;
}
</style>
