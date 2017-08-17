<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.currentKind" placeholder="按设备编号"> 
            <el-option 
              v-for="item in queryKind"
              :key="item.value"
              :label="item.label" 
              :value="item.value"> 
            </el-option>
          </el-select>          
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.queryStr" placeholder="输入相应内容检索"></el-input>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-select v-model="formInline.deviceState" placeholder="默认"> 
            <el-option 
              v-for="item in deviceStateList"
              :key="item.value"
              :label="item.label" 
              :value="item.value"> 
            </el-option>
          </el-select>          
        </el-form-item>        
        <el-form-item>
          <el-button type="primary" icon="search" @click="onQuery">查询</el-button>
          <el-button style='margin-bottom:20px;float:right' type="primary" icon="document" @click="handleDownload">导出excel</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" 
        fit highlight-current-row  tooltip-effect="dark" style="width: 100%" max-height="500">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="no" label="设备编号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="设备名称" width="230" :show-overflow-tooltip="true">
        </el-table-column> 
        <el-table-column prop="lastAlarm" label="当前状态" width="100">
          <template scope="scope">
            <span v-bind:class="{'isAlarm': scope.row.isAlarm }">{{ scope.row.lastAlarm }}</span>
          </template>
        </el-table-column>        
        <el-table-column prop="alarmTime" label="数据时间" width="180">
        </el-table-column>   
        <el-table-column prop="address" label="设备安装位置" width="250" :show-overflow-tooltip="true">
        </el-table-column>             
        <el-table-column prop="lastPressure" label="电池电压" width="120">
        </el-table-column> 
        <el-table-column prop="lastSignal" label="信号强度" width="120">
        </el-table-column> 
        <el-table-column prop="terminalNo" label="终端编号" width="140">
        </el-table-column>    
      </el-table>
    </el-row>
    <el-row>
      <div class="pagination" v-if="page.total">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
        :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total">
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
.isAlarm {
  color: red;
}
</style>

<script>
import { getDeviceDataList } from 'api/device';
import { parseTime } from 'utils/index';
export default {
  data() {
    return {
      formInline: {
        startTime: '',
        endTime: '',
        queryStr: '',
        currentKind: 'subDeviceNo',
        deviceState: '0'
      },
      pickerOptions: {
        onPick({maxDate, minDate}) {
          console.log('甩甩有')
        }
      },
      list: null,
      listLoading: true, 
      queryKind: [
        { label: '按设备编号', value: 'subDeviceNo' },
        { label: '按设备名称', value: 'subDeviceName' },
        { label: '按终端编号', value: 'subTerminalNo' },
        { label: '按终端名称', value: 'subTerminalName' }
      ],
      deviceStateList: [
        { label: '默认', value: '0' },
        { label: '正常', value: '1' },
        { label: '报警', value: '2' }
      ],
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
      let listQuery = {
        'pageSize': this.page.pageSize || 10,
        'pageIndex': this.page.currentPage || 1
      }
      // 根据条件查询
      if (this.formInline.queryStr  != '') {
          if(this.formInline.currentKind == 'subDeviceNo'){
             listQuery.subDeviceNo = this.formInline.queryStr
          }else if (this.formInline.currentKind == 'subDeviceName') {
             listQuery.subDeviceName = this.formInline.queryStr
          }else if (this.formInline.currentKind == 'subTerminalNo') {
             listQuery.subTerminalNo = this.formInline.queryStr
          }else{
             listQuery.subTerminalName = this.formInline.queryStr
          }
      }
      getDeviceDataList(listQuery).then(response => {
        let res = response.data;
        if (res.code == 0){
          this.list = res.data;
          this.page.total = res.data.length;
          this.list.forEach(function(item,index){
            if(item.lastAlarmTime){
              this.list[index].lastAlarm = item.lastIsAlarm == 1 ? '报警' : '正常';
              this.list[index].alarmTime = item.lastAlarmTime == undefined ? '' : parseTime(item.lastAlarmTime) ; 
              this.list[index].isAlarm = item.lastIsAlarm == 1 ? true : false ; 
            }
          },this);
        }
        this.listLoading = false;
      })
    },
    onQuery() {
      this.fetchData();
    },
    handleDownload() {
      require.ensure([], () => {
        const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
        const tHeader = ['设备编号', '设备名称', '安装地址', '终端编号', '设备状态', '数据时间', ,'电池电压', '信号强度'];
        const filterVal = ['no', 'name', 'address', 'terminalNo', 'lastAlarm', 'alarmTime', 'lastPressure', 'lastSignal'];
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