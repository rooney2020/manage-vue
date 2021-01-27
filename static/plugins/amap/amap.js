//高德地图
import Vue from 'vue'
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '58ab6d27d6aa92a897405347ad7af217',
  plugin: ['AMap.Geolocation','AMap.Geocoder','AMap.Circle'],
  v: '1.4.4',
  uiVersion: '1.0'
})
