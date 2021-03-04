<template>
  <div class="newsShow">
    <h6>{{title}}</h6>
    <img :src="img" alt="">
    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{content}}</span>
  </div>
</template>

<script>
export default {
  name: 'newsShow',
  data(){
    return{
      img:'',
      title:'',
      content:'',
      time:'',
    }
  },
  activated() {
    this.getActive()
  },
  methods:{
    getActive(){
      this.$http({
        url: this.$http.adornUrl('/manage-news/list/active'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          data.data.forEach(el=>{
            if(el.newsId===this.$route.query.id){
              this.img='http://192.144.229.232:51120'+el.imageUrl
              this.title=el.title
              this.content=el.content
              this.time=el.time
            }
          })

        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.newsShow{
  width: 100%;
  h6{
    font-size: 20px;
    margin: 0;
    padding: 0;
    text-align: center;
    margin-bottom: 20px;
  }
  img{
    width: 50%;
    margin: 0 auto;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  span{
    font-size: 14px;
    line-height: 25px;
  }
}

</style>
