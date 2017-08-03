<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="状态类型">
          <el-select v-model="formInline.currentState" placeholder="请选择">
            <el-option v-for="item in formInline.states" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在/离线时间">
          <el-date-picker v-model="formInline.dateValue" type="daterange" placeholder="选择时间范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终端编号">
          <el-input v-model="formInline.terminalNo" placeholder="输入关键词检索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
          <el-button style='margin-bottom:20px;float:right' type="primary" icon="document" @click="handleDownload">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" 
        fit highlight-current-row  tooltip-effect="dark" style="width: 100%" max-height="500" >
        <el-table-column prop="no" label="终端编号" width="140" fixed="left">
          <template scope="scope">
            <span>{{ scope.row.no }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="终端名称" width="250" show-overflow-tooltip="true">
           <template scope="scope">
            <span>{{ scope.row.name }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="address" label="安装地址" width="300" show-overflow-tooltip="true">
            <template scope="scope">
             <span>{{ scope.row.address }}</span>
           </template>
        </el-table-column>        
        <el-table-column prop="alarmPhone" label="报警电话" width="300" show-overflow-tooltip="true">
            <template scope="scope">
            <span>{{ scope.row.alarmPhone }}</span>
           </template>
        </el-table-column>        
        <el-table-column prop="state" label="当前状态" width="100">
          <template scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
         <el-table-column prop="lastOnlineTime" label="状态时间" width="180" show-overflow-tooltip="true">
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
        :page-sizes="page.pageSizes" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<style scoped>
.el-select {
  width: 100px;
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
        states: [{ 'label': '全部', value: -1 }, { 'label': '在线', value: 1 }, { 'label': '离线', value: 0 }],
        currentState: -1,
        terminalNo: ''
      },
      list: null,
      listLoading: true, 
      page: {
        currentPage: null,
        pageSize: 10,
        total: null,
        pageSizes: null
      }     
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;      
      getTerminalList(this.listQuery).then(response => {
        if(!response.code){
          this.list = response.data.data;
          this.page.total = this.list.length;
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
