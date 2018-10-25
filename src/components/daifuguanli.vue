<template>
  <div style="padding:10px">
    <!-- 头部筛选条件 -->
    <div>
      <!-- 第一行的筛选 -->
      <div>
        <div class="cont-header">
          <el-input
            placeholder="请输入银行卡号"
            v-model="condition.account"
            clearable>
          </el-input>
          <el-button round type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header">
          <el-input
            placeholder="请输入开户名"
            v-model="condition.name"
            clearable>
          </el-input>
          <el-button round  type="primary" @click="getData()">搜索</el-button>
        </div>

        <div class="cont-header cont-uninput">
          <div class="block">
            <el-cascader
              :options="options"
              v-model="condition.status"
              @change="handleChange">
            </el-cascader>
          </div>
        </div>
        
        <div class="cont-header cont-uninput">
          <div class="block">
            <el-date-picker
              v-model="condition.start"
              type="date"
              placeholder="开始日期"
              @change="searchStaDate">
            </el-date-picker>
          </div>
        </div>

        <div class="cont-header cont-uninput">
          <div class="block">
            <el-date-picker
              v-model="condition.end"
              type="date"
              placeholder="结束日期"
              @change="searchEndDate">
            </el-date-picker>
          </div>
        </div>
      </div>
      <!-- 第二行的筛选 -->
      <div>
        <div class="cont-two-header">
          <!-- @click="download" -->
          <!-- <el-button type="text" target="view_window"> -->
            <a style="color:#3a8ee6;text-decoration:none;" :href='"https://dfapi.dimuen.com/order/exportExcel?name="+condition.name+"&account="+condition.account+"&status="+condition.status+"&start="+condition.start+"&end="+condition.end'>
            <!-- <a href="https://dfapi.dimuen.com/order/exportExcel"> -->
            导出excel
            </a>
          <!-- </el-button> -->
        </div>
        <!-- 点击上传 -->
        <div class="cont-two-header">
          <el-upload
            class="upload-demo"
            action="https://dfapi.dimuen.com/order/analyzeExcel"
            with-credentials
            :name = "upfile"
            :onSuccess="uploadSuccess"
            :onError="uploadError"
            :show-file-list="showNone">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </div>

      </div>
      
        <!-- 可用额度 -->
        <div class="cont-two-header3"> 
          <span>可用额度：{{balance}}元</span>
          <span>加款总额：{{total}}元</span>
          <span>成功金额：{{successAmount}}元</span>
          <span>成功笔数：{{successCount}}笔</span>
          <span>审核中金额：{{auditAmount}}元</span>
          <span>审核中笔数：{{auditCount}}笔</span>
        </div>
    </div>

    <!-- 主体部分，表格 -->
    <div class="cont-cont">
      <el-table
        :data="tableData"
        height="calc(100vh - 195px)"
        style="width: 100%;" 
        :header-cell-style="{'text-align':'center'}">
        <el-table-column label="订单编号" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.orderno }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="银行名称" width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bankname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户名" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px;">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status=="0"?"审核中":"成功" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间"  width="150">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px">{{ scope.row.createtime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="确认时间"  width="150">
          <template slot-scope="scope" style="text-align=:center">
            <span style="margin-left: 10px" v-show="scope.row.paytime">{{ scope.row.paytime |formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联行号"  width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.linenum }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>  
       <!-- 分页 -->
        <el-pagination
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="10"
          v-show="totalPage"
          :page-count="totalPage"
          style="position:fixed;bottom:50px;">
        </el-pagination>

    </div>

    <!-- 弹窗 -->
    <div>
      <el-dialog :title='"从模板导入       共("+num+")条"' :visible.sync="dialogTableVisible" >
        <el-table :data="gridData">
          <el-table-column property="account" label="银行卡号" width="180"></el-table-column>
          <el-table-column property="linenum" label="联行号"></el-table-column>
          <el-table-column property="bankname" label="开户行" ></el-table-column>
          <el-table-column property="username" label="开户名"></el-table-column>
          <el-table-column property="amount" label="打款金额"></el-table-column>
          <el-table-column property="remark" label="备注"></el-table-column>
        </el-table>
        <div class="btn-sub">
          <el-button type="primary" size="mini" @click="updata">确定上传</el-button>
          <el-button size="mini" @click="dialogTableVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
  
</template>

<script>
import Vue from 'vue';
import { Radio, RadioGroup,RadioButton,Input,Menu } from 'element-ui';
import { setTimeout } from 'timers';
import bus from './bus.js';
import {formatDate} from './formatDate.js';
Vue.use(Input)

export default {
  name: 'daifutongdao',
  data () {
    return {
      condition:{
        page:1,
        limit:10,
        account:'',
        name:'',
        status:'',
        start:'',
        end:''
      },
      upfile:'upfile',
      bool:true,
      num:10,
      totalPage:0,
      showNone:false,
      btnCancel:true,
      btnSub:true,
      token:window.document.cookie,
      options:[{
        value:'',
        label:"请选择"
      },{
        value:0,
        label:"审核中"
      },{
        value:1,
        label:"成功"
      }],
      selectedOptions:[],
      balance:0,
      auditCount:0,
      total:0,
      auditAmount:0,
      successCount:0,
      successAmount:0,
      tableData: [],
      gridData: [],
      dialogTableVisible: false,
      data:{},
      // btnHref:"https://dfapi.dimuen.com/order/exportExcel?name="
      // +this.condition.name+"&account="+this.condition.account+
      // "&status="+this.condition.status+"&start="+this.condition.start+
      // "&end="+this.condition.end
    }
  },
  created:function(){
    // 默认获取数据
    this.getData();
    // 查询余额
    this.getBalance()
  },
  methods:{
    handleChange(e){
      let that = this;
      that.condition.status = e;
      that.getData();
    },
    // 上传文件方法
    uploadSuccess (response, file, fileList) {
      this.gridData = response.obj.list;
      this.num = this.gridData.length;
      this.dialogTableVisible = true;
    },
    uploadError  (response, file, fileList) {
      this.dialogTableVisible  = true;
    },
    // 请求数据
    getData(){
      let that = this;
      let url = "https://dfapi.dimuen.com/order/list";
      let formdata = new FormData();
      formdata.append("page",that.condition.page);
      formdata.append("limit",10);
      if(that.condition.account){
        formdata.append("account",that.condition.account);
      }if(that.condition.name){
        formdata.append("name",that.condition.name);
      }if(that.condition.status && that.condition.status !=""){
        formdata.append("status",that.condition.status);
      }if(that.condition.start){
        formdata.append("start",that.condition.start);
      }if(that.condition.end){
        formdata.append("end",that.condition.end);
      }
      that.$http.post(url,formdata)
      .then(function(response){
        if(response.body.result == "1"){
          //成功的
          that.openAlert(1,response.body.msg);
          that.tableData = response.body.obj;
          that.totalPage = response.body.totalPage;
        }
        else{
          that.openAlert(2,response.body.msg)
        }
      },function(err){})
    },
    searchStaDate(e){
      this.condition.start = new Date(e).getTime();
      this.getData();
    },
    searchEndDate(e){
      this.condition.end = new Date(e).getTime();
      this.getData();
    },
    handleSizeChange(e){
      console.log(e,299)
    },
    handleCurrentChange(e){
      this.condition.page = e;
      this.getData()
    },
    // 余额查询
    getBalance(){
      let that = this;
      let url = "https://dfapi.dimuen.com/order/balance";
      that.$http.post(url)
      .then(function(response){
        if(response.body.result != 1)
          that.openAlert(2,response.body.msg)
        else{//成功的
          that.openAlert(1,response.body.msg);
          that.balance = response.body.obj.balance;
          that.successCount = response.body.obj.successCount;
          that.successAmount = response.body.obj.successAmount;
          that.auditCount = response.body.obj.auditCount;
          that.total = response.body.obj.total;
          that.auditAmount = response.body.obj.auditAmount;
        }
      },function(err){})
    },
    // exel数据提交
    updata(){
      let that = this;
      let url = "https://dfapi.dimuen.com/order/savelist";
      that.$http
      .post(url,{data:that.gridData})
      .then(function(response){
        if(response.body.result != 1)
          that.openAlert(2,response.body.msg)
        else{//成功的
          that.openAlert(1,response.body.msg);
          that.balance = response.body.obj;
          that.dialogTableVisible = false;
          that.getData();
          that.getBalance();
        }
      },function(err){  
        
      })
    },
    // 下载
    download(){
      let that = this;
      let url = "https://dfapi.dimuen.com/order/exportExcel";
      let formdata = new FormData();
      if(that.condition.account){
        formdata.append("account",that.condition.account);
      }if(that.condition.name){
        formdata.append("name",that.condition.name);
      }if(that.condition.status && that.condition.status !=""){
        formdata.append("status",that.condition.status);
      }if(that.condition.start){
        formdata.append("start",that.condition.start);
      }if(that.condition.end){
        formdata.append("end",that.condition.end);
      }
      that.$http
      .post(url,formdata)
      .then(function(response){},function(err){})
    },
    // 提示信息调用
    openAlert(i,msg) {
      let that = this;
      if(i == "1"){
        that.$message({
          type: 'success',
          message:msg
        });
      }
      else{
        that.$message.error(msg);
      }
    }
  },
  filters:{
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cont-header,
.cont-two-header{
  display: inline-block;
  margin-right:15px;
}
.cont-two-header,
.cont-two-header3{
  padding-top: 20px;
}
.cont-two-header3>span{
  margin-right: 15px;
}
.cont-header{
  width: 250px;
}
.cont-header>.el-input{
  width: 159px;
}
.cont-uninput,
.cont-uninput>.block>.el-date-editor{
  width: 159px;
}
.el-dropdown{
  display: block
}
.cont-cont{
  margin-top: 20px;
}
.btn-sub{
  padding-top: 20px;
}
</style>