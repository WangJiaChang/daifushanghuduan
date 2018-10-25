<template>
  <div id="app">
    <div>
      <!-- 顶部部分 -->
      <div class="header-box">
        <el-dropdown>
          <span class="el-dropdown-link user-info">
            {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="pwd">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 左边导航部分 -->
      <el-row class="tac">
        <el-col>
          <el-menu
            default-active="$route.path"
            class="el-menu-vertical-demo"
            router 
            :default-openeds="openeds">
            <el-menu-item index="/daifuguanli" >
              <i class="el-icon-menu"></i>
              <span slot="title">代付通道</span>
              <!-- <el-menu-item  index="/">代付通道</el-menu-item> -->
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <!-- 右边内容部分(路由login的话也用这块) -->
      <div class="right-cont">
        <router-view v-on:nameevent="nameevent">
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'App',
  data () {
      return {
        name:this.$cookies.get("name"),
        openeds: ['/'],
      };
    },
    methods:{
      // 子传父自定义方法
      nameevent(e){
        this.name = e;
      },
      // 跳转password
      pwd(){
        this.$router.push({path:'/password'});
      },
      // 退出登陆
      loginOut(){
        let url = "https://dfapi.dimuen.com/user/loginOut";
        let that = this;
        that.$http.post(url, {
            headers:{'Content-Type':'multipart/form-data'}
        })
        .then(function(response){
          if(response.body.result != 1){
            that.open(2,response.body.msg);
            that.reshImg();
          }
          else{//成功的
            that.open(1,response.body.msg);
            that.$router.push({path:'/login'})
          }
        },function(err){
            that.open();
        }) 
      },
      open(i,msg) {
        let that = this;
        if(i==1){
            that.$message({
                type: 'success',
                message:msg
            });
        }
        else
        that.$message.error(msg);
      }
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin: 0;
}
.el-col{
  width: 170px;
  height: calc(100vh - 61px);
  border-right:1px solid #e6e6e6;
}
.el-menu-vertical-demo{
  border:0;
}
.tac{
  display: inline-block;
  vertical-align: top;
}
.el-menu--inline>.is-active{
  padding-left:20px;
}
.xiala{
  float: right
}
.header-box{
  height: 61px;
  line-height: 61px;
  border-bottom: 1px solid #e6e6e6;
}
.el-dropdown{
  float: right;
  margin-right: 20px;
}
.el-submenu .el-menu-item{
  min-width: 169px;
}
.user-info{
  cursor: pointer;
}
.right-cont{
  display: inline-block;
  margin-left:-7px;
  width: calc(100vw - 190px);
  vertical-align: top;
  overflow: hidden;
  height: calc(100vh - 61px);
}

</style>
