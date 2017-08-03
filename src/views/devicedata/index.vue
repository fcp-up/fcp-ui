<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="数据时间">
          <el-date-picker v-model="formInline.dateValue" type="daterange" placeholder="选择时间范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备编号">
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
        fit highlight-current-row  tooltip-effect="dark" style="width: 100%" max-height="500">
        <el-table-column prop="no" label="设备编号" width="120" fixed="left">
        </el-table-column>        
        <el-table-column prop="name" label="设备名称" width="250" show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="terminalNo" label="终端编号" width="120">
        </el-table-column>
        <el-table-column prop="address" label="安装位置" width="360" show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="signal" label="信号强度" width="100">
        </el-table-column> 
        <el-table-column prop="pressure" label="电池电压" width="100">
        </el-table-column>
        <el-table-column prop="time" label="数据时间" width="200" show-overflow-tooltip="true">
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
import { getDeviceList } from 'api/device';
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
      getDeviceList(this.listQuery).then(response => {
        let res = response.data;
        if (res.code == 0){
          this.list = res.data;
          this.page.total = this.list.length;
          this.list.forEach(function(item,index){
            if(item.time){
              this.list[index].time = item.date == undefined ? '' : parseTime(item.time) ; 
            }
          },this);
        }
        this.listLoading = false;
      })
    },
    handleDownload() {
      require.ensure([], () => {
        const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
        const tHeader = ['设备编号', '设备名称', '安装地址', '信号强度', '电池电压'];
        const filterVal = ['no', 'name', 'address', 'deviceSignal', '电池电压'];
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
