<template>
    <!-- form表单提交 -->
    <form action=""  method="post" id="myForm"  v-show="loginWeb" enctype="multipart/form-data">
        <div class="login">
            <div class="login-form">
                <div class="login-title">代付管理后台</div>
                <el-form :label-position="labelPosition" label-width="80px" size="small" :model="login">
                    <el-form-item label="账号">
                        <el-input v-model="login.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="login.pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码">
                        <el-input v-model="login.code" class="yanzheng" ></el-input>
                        <div class="img-box" @click="reshImg()">
                            <img :src='loginSrc' alt="">
                        </div>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="login-btn" @click="log()">登陆</el-button>
            </div>
        </div>
    </form>
</template>

<script>
import Vue from 'vue';
import { Radio, RadioGroup,RadioButton,Input,Menu } from 'element-ui';
import { setTimeout } from 'timers';
import bus from './bus.js';
Vue.use(Input)

export default {
  name: 'login',
  data () {
    return {
        // 登陆信息
        login: {
            phone: '',
            pwd: '',
            code: ''
        },
        // 显示与否
        loginWeb:true,
        // 字体靠右
        labelPosition: 'right',
        // 时间戳
        time:new Date().getTime(),
        loginSrc:"https://dfapi.dimuen.com/user/getImage?time="+this.time
    }
  },
  methods:{
        // 登陆提交
        log:function(){ 
            let url = "https://dfapi.dimuen.com/user/login";
            let that = this;
            let formdata = new FormData();
            formdata.append("phone",that.login.phone)
            formdata.append("pwd",that.login.pwd)
            formdata.append("code",that.login.code)
            that.$http.post(url,formdata)
            .then(function(response){
                if(response.body.result != 1){
                    that.open(2,response.body.msg);
                    that.reshImg();
                }
                else{//成功的
                    that.open(1,response.body.msg);
                    // 网络请求头添加cookie
                    const token = response.body.ticket;
                    window.document.cookie = response.body.ticket;
                    // 延迟跳转列表页
                    setTimeout(()=>{
                        that.$router.push({path:'/daifuguanli'});
                    },200);
                    // 子组件传值父组件
                    that.$emit('nameevent',response.body.obj.name);
                    // vue-cookie保存用户名
                    that.$cookies.set("name", response.body.obj.name);
                }
            },function(err){
                that.reshImg();
                that.open(2,response.body.msg);
            }) 
        },
        // 提示信息调用
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
        },
        reshImg(){
            this.time = new Date().getTime()
            this.loginSrc = "https://dfapi.dimuen.com/user/getImage?time="+this.time
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login{
  position: fixed;
  z-index: 99;
  top:0;
  left:0;
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/timg.png");
  background-size: 100% 100%;
}

.login-form{
  width: 400px;
  height: 320px;
  background-color: #fff;
  margin: 0 auto;
  margin-top:16vh;
  border-radius: 5px;
  padding: 20px;
}
.login-title{
  height: 60px;
  line-height: 60px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #003152;
  margin-bottom: 20px;
}
.login-btn{
  width: 60%;
  margin:0 auto;
  display: block;
}
.yanzheng{
  width: 70%;
  vertical-align: middle;
}
.img-box{
  display: inline-block;
  width: 90px;
  height: 32px;
  box-sizing: border-box;
  vertical-align: middle;
  cursor: pointer;
}
.img-box>img{
  width: 100%;
  height: 100%;
}
</style>