<template>
  <div class="mod-home">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="topLeft">
          <el-row>
            <el-col :span="5">
              <div class="topText">
                <p>{{userName}},您好!</p>
                <p>新的一天祝你开心快乐!</p>
                <icon-svg name="w_aixin" class="icon"></icon-svg>
              </div>
            </el-col>
            <el-col :span="19">
              <div class="rightText">
                <span style="color: rgba(0,0,0,.5)">{{time}}</span>
                <span>今天剩余工作统计</span>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <p>我的任务</p>
                    <h5>{{taskNum}}</h5>
                  </el-col>
                  <el-col :span="6">
                    <p>我的项目</p>
                    <h5>{{projectNum}}</h5>
                  </el-col>
                  <el-col :span="6">
                    <p>进行中的项目</p>
                    <h5>0</h5>
                  </el-col>
                  <el-col :span="6">
                    <p>未关闭的项目</p>
                    <h5>0</h5>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="topRight">
          <p v-show="isReported===false"><icon-svg name="big-circle" class="icon"></icon-svg>您还未进行疫情填报,请尽快填报</p>
          <p v-show="isReported===true"><icon-svg name="big-circle" class="icon"></icon-svg>您已填写疫情报表，请注意防疫规定</p>
          <p v-show="up===0"><icon-svg name="big-circle" class="icon"></icon-svg>您还未进行上班打卡，请注意打开时间</p>
          <p v-show="up===1&&down===0"><icon-svg name="big-circle" class="icon"></icon-svg>您已经上班打卡，请注意下班打卡时间</p>
          <p v-show="up===1&&down===1"><icon-svg name="big-circle" class="icon"></icon-svg>您今天已经完成打卡,回家注意安全</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" >
      <el-col :span="16" class="botLeft">
        <el-carousel :interval="5000" arrow="always" height="350px" indicator-position="outside">
          <el-carousel-item v-for="(item,index) in activeScroll" :key="index" style="cursor: pointer" >
            <img :src="item.imageUrl" alt="" style="object-fit: contain;width: 100%" @click="newsShow(item)">
            <div class="botTitle">
              <p>{{item.title}}</p>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="8" class="botRight">
        <el-row :gutter="20" v-for="(item,index) in active" :key="index" style="cursor: pointer">
          <el-col :span="7">
            <img :src="item.imageUrl" alt="" style="width: 100%" @click="newsShow(item)">
          </el-col>
          <el-col :span="17">
            <p @click="newsShow(item)">{{item.title}}</p>
            <h6 @click="newsShow(item)">{{item.content}}</h6>
            <span>{{item.createTime}}</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        time:'',
        isReported:'',
        up:'',
        down:'',
        active:[],
        activeScroll:[],
        projectNum:'',
        taskNum:'',
      }
    },
    computed:{
      userName:{
        get () { return this.$store.state.user.name }
      }
    },
    mounted () {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth();//得到月份
      var date = now.getDate();//得到日期
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      this.time = year + "年" + month + "月" + date + "日";
      this.getProjectNum()
      this.getReport()
      this.getTaskNum()
      this.getPunched()
      this.getActive()
    },
    methods:{
      newsShow(val){
        this.$router.push({
          path: "/newsShow",
          query: { id: val.newsId }
        });
      },
      //新闻
      getActive(){
        this.$http({
          url: this.$http.adornUrl('/manage-news/list/active'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.active=data.data
            this.active.forEach(el=>{
              el.imageUrl='http://192.144.229.232:51120'+el.imageUrl
            })
            this.activeScroll=this.active.slice(0,5)

          }
        })
      },
      //任务数
      getTaskNum(){
        this.$http({
          url: this.$http.adornUrl('/manage-task/assign/num'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.taskNum=data.data
          }
        })
      },
      //项目数量
      getProjectNum(){
        this.$http({
          url: this.$http.adornUrl('/manage-project/projects/num'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.projectNum=data.data
          }
        })
      },
      //是否填报
      getReport(){
        this.$http({
          url: this.$http.adornUrl('/manage-form/isreport'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.isReported=data.isReported
          }
        })
      },
      //是否打卡
      getPunched(){
        this.$http({
          url: this.$http.adornUrl('/manage-punch/ispunched'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.up=data.up
            this.down=data.down
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-thumb {
  background: rgba(201, 205, 215, 1);
  border-radius: 4px;
  min-height: 40px!important;
  max-height: 80px!important;
  opacity: 0.85;
}
.mod-home{
  width: 100%;
  .topLeft{
    width: 100%;
    height: 180px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .topText{
      width: 100%;
      margin-top: 45px;
      text-align: center;
      border-right: 1px solid rgba(0,0,0,.1);
      .icon{
        font-size: 30px;
      }
    }
    .rightText{
      margin-top: 25px;
      margin-left: 1vw;
      p{
        text-align: center;
        margin-top: 20px;
      }
      h5{
        text-align: center;
        font-size: 40px;
        margin: 0;
        padding: 0;
      }
    }
  }
  .topRight{
    width: 100%;
    height: 180px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    padding: 20px;
    p{
      margin-top: 30px;
      .icon{
        font-size: 8px;
        margin-right: 1vw;
      }
    }
  }
  .botLeft{
    margin-top: 20px;
    position: relative;
    .botTitle{
      padding: 5px 10px;
      background-color: rgba(0,0,0,.5);
      position: absolute;
      bottom: 0;
      width: 100%;
      p{
        text-align: center;
        padding: 0;
        margin: 0;
        color: #ffffff;
      }
    }
  }
  .botRight{
    margin-top: 20px;
    height: 400px;
    overflow-y: scroll;
    .el-row{
      margin-bottom: 15px;
      height: 80px;
      border-bottom: 1px solid rgba(0,0,0,.1);
      position: relative;
      p{
        margin: 0;
        padding: 0;
        font-size: 14px;
      }
      h6{
        font-size: 12px;
        margin-top: 5px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: 400;
      }
      span{
        font-size: 12px;
        color: #8c939d;
        position: absolute;
        bottom: 10px;
      }
    }
  }
}
</style>

