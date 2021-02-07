<template>
  <div class="mod-location">
    <div class="map">
      <el-amap id="lnglat" vid="amapDemo" :amap-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
      </el-amap>
    </div>
    <div class="right">
      <p style="font-size: 20px;font-weight: 600">您可以鼠标点击地图进行标点，选取打卡地点</p>
      <p>当前定位地点:{{area}}</p>
      <p>当前选中地点:{{handleArea}}</p>
      <el-row style="margin: 0 auto;width: 240px">
        <el-button type="primary" plain @click="punchArea(1)" :disabled="area===''">定位位置</el-button>
        <el-button type="success" plain @click="punchArea(2)" :disabled="handleArea===''">标点位置</el-button>
      </el-row>
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
      area:'',
      jingwei:[0,0],
      dwJw:[],
      handleArea:'',
      zoom: 10,
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
  methods:{
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
          _this.dwJw=lnglatXY
          _this.jingwei=[result.position.Q,result.position.R]
          _this.area=result.formattedAddress
        }else{
          console.log(result)
        }
      });
      // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: lnglatXY
      });
      var aa = null;
      this.map.on('click', function(e) {
        _this.map.remove(marker);
        document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        _this.jingwei=[e.lnglat.getLng(),e.lnglat.getLat()]
        console.log(_this.jingwei)
        marker = new AMap.Marker({
          position: _this.jingwei,
        });
        if(aa){
          _this.map.remove(aa);
        }
        aa = marker
        // 将创建的点标记添加到已有的地图实例：
        console.log(marker)
        console.log(e)
        _this.map.add(marker);
        regeoCode()
      })
      var geocoder = new AMap.Geocoder({
        city: "010", //城市设为北京，默认：“全国”
        radius: 500 //范围，默认：500
      });
      //逆地理编码
      function regeoCode() {
        var lnglat  = document.getElementById('lnglat').value.split(',');
        geocoder.getAddress(lnglat, function(status, result) {
          if (status === 'complete'&&result.regeocode) {
            var address = result.regeocode.formattedAddress;
            _this.handleArea=address
          }else{
            log.error('根据经纬度查询地址失败')
          }
        });
      }
      console.log(this.map)
    },
    //提交
    punchArea(a){
      let jw=[]
      let area=''
      if(a===1){
        jw=this.dwJw
        area=this.area
      }else{
        jw=this.jingwei
        area=this.handleArea
      }
      this.$confirm('确定选择'+area+'为打卡地点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let fd = new FormData();
        fd.append("position", area);
        fd.append("tudes", jw);
        this.$http({
          url: this.$http.adornUrl('/manage-param/location/save'),
          method: 'post',
          headers:{
            'Content-Type':'application/x-www-form-urlencoded'
          },
          contentType:"'application/x-www-form-urlencoded'",
          type:"application/x-www-form-urlencoded",
          data:fd
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '提交失败'
        });
      });
    }
  }
}
</script>

<style scoped>
.mod-location{
  width: 100%;
  height: 80vh;
}
.map{
  width: 50%;
  float: left;
  height: 100%;
}
.right{
  padding-top: 20vh;
  width: 47%;
  height: 80vh;
  float: right;
}
.right p{
  text-align: center;
  font-size: 18px;
}

</style>

