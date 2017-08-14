<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline"> 
        <el-form-item>
          <el-select v-model="formInline.currentKind"> 
            <el-option 
              v-for="item in queryKind"
              :key="item.value"
              :label="item.label" 
              :value="item.value"> 
            </el-option>
          </el-select>          
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.keywords" placeholder="输入相应内容检索"></el-input>
        </el-form-item>       
        <el-form-item label="终端状态">
          <el-select v-model="formInline.currentState">
            <el-option v-for="item in terminalStates" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
          <el-button style='margin-bottom:20px;float:right' type="primary" icon="document" @click="handleDownload">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" 
        highlight-current-row style="width: 100%" max-height="500" >
        <el-table-column prop="no" label="终端编号" width="140" fixed="left">
          <template scope="scope">
            <span>{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="终端名称" width="250" >
           <template scope="scope">
            <span>{{ scope.row.name }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="address" label="安装地址" width="300">
            <template scope="scope">
             <span>{{ scope.row.address }}</span>
           </template>
        </el-table-column>        
        <el-table-column prop="alarmPhone" label="报警电话" width="300">
            <template scope="scope">
            <span>{{ scope.row.alarmPhone }}</span>
           </template>
        </el-table-column>        
        <el-table-column prop="state" label="当前状态" width="100">
          <template scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
         <el-table-column prop="lastOnlineTime" label="状态时间" width="180">
           <template scope="scope">
             <span>{{ scope.row.stateTime }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="lastSignal" label="信号强度" width="100">
            <template scope="scope">
            <span>{{ scope.row.lastSignal }}</span>
           </template>
        </el-table-column>       
      </el-table>
    </el-row>
    <el-row>
       <div class="pagination" v-if="page.total">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
         :page-size="page.pageSize" layout="total,prev, pager, next" :total="page.total">
        </el-pagination>
      </div> 
    </el-row>
  </div>
</template>

<style scoped>
.el-select {
  width: 130px;
}
.el-form-item {
  margin-bottom: 0px;
}
.pagination {
  text-align: center;
}
</style>

<script>
import {getTerminalList} from 'api/terminal';
import { parseTime } from 'utils/index';
export default {
  data() {
    return {
      formInline: {
        dateValue: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        currentState: 0,
        keywords: '',
        currentKind: 'terminalNo'
      },
      queryKind: [
        { label: '按终端编号', value: 'terminalNo' },
        { label: '按终端名称', value: 'terminalName' }
      ],
      terminalStates: [
        { label: '全部', value: 0 }, 
        { label: '在线', value: 1 }, 
        { label: '离线', value: 2 }],
      list: [],
      listQuery: null,
      listLoading: true, 
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0 
      }     
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = false;      
      this.listQuery = {
        pageSize: this.page.pageSize || 10,
        pageIndex: this.page.currentPage || 1
      }
      getTerminalList(this.listQuery).then(response => {
        let res = response.data;
        if(res.code === 0){         
          this.list = res.data;
          this.page.total = res.total;
          this.list.forEach(function(item,index){
             this.list[index].state = item.lastOnlineState == 1 ? '在线' : (item.lastOnlineState == 0?'离线':item.lastOnlineState);
             this.list[index].stateTime = item.lastOnlineTime == undefined ? '' : parseTime(item.lastOnlineTime) ; 
          },this);
        }else{
          console.log('查询终端状态出错.');
        }
        this.listLoading = false;
      })
    },
    onQuery() {
      this.fetchData()
    },
    handleDownload() {
      require.ensure([], () => {
        const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
        const tHeader = ['终端编号', '终端名称', '安装地址', '报警电话', '当前状态', '状态时间', '信号强度'];
        const filterVal = ['no', 'name', 'address', 'alarmPhone', 'state', 'stateTime', 'lastSignal'];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '列表excel');
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleSizeChange(val) {
       console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.fetchData();
    }
  }
};
</script>
