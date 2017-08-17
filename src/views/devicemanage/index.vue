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
          <el-input v-model="formInline.queryStr" placeholder="输入相应内容检索"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:20px;">
          <el-button type="primary" icon="search" @click="fetchData">查询</el-button>
          <el-button type="primary" icon="document" @click="handleDownload">导出excel</el-button>
          <!-- <el-button style='margin-bottom:20px;float:right' type="primary" icon="plus" @click="onAdd">新增</el-button> -->
        </el-form-item>
      </el-form>
    </el-row>
     <el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" 
        border style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="no" label="设备编号" width="120">
        </el-table-column >
          <el-table-column prop="name" label="设备名称" width="200" :show-overflow-tooltip="true">
        </el-table-column >
        <el-table-column prop="address" label="设备安装地址" width="230" :show-overflow-tooltip="true">
        </el-table-column> 
        <el-table-column prop="alarmPhone" label="报警电话" width="230">
        </el-table-column >
        <el-table-column prop="terminalNo" label="终端编号" width="120">
        </el-table-column >                 
         <el-table-column prop="longitude" label="位置经度" width="150">
        </el-table-column >
        <el-table-column prop="latitude" label="位置纬度" width="150">
        </el-table-column >        
        <el-table-column label="操作" width="220" fixed="right">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>            
            <el-button size="small" icon="edit" @click="handleAlarmPhoneEdit(scope.$index, scope.row)">报警电话</el-button>
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
  width: 130px;
}

.el-input {
  width: 300px;
}

.el-form-item {
  margin-bottom: 0px;
}

.el-table-column {
  white-space: nowrap;
}

.pagination {
  text-align: center;
}
</style>

<script>
import { getDeviceList } from 'api/device';
export default {
  data() {
    return {
      formInline: {
        queryStr: '',
        currentKind: 'subDeviceNo'
      },
      queryKind: [
        { label: '按设备编号', value: 'subDeviceNo' },
        { label: '按设备名称', value: 'subDeviceName' },
        { label: '按终端编号', value: 'subTerminalNo' },
        { label: '按终端名称', value: 'subTerminalName' }
      ],
      list: null,
      listLoading: true, 
      page: {
        currentPage: 0,
        pageSize: 10,
        total: 0,
        pageSizes: 0
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      let requestParams = {
        pageIndex: this.page.currentPage || 1,
        pageSize: this.page.pageSize || 10
      }
      // 根据条件查询
      if (this.formInline.queryStr  != '') {
          if(this.formInline.currentKind == 'subDeviceNo'){
             requestParams.subDeviceNo = this.formInline.queryStr
          }else if (this.formInline.currentKind == 'subDeviceName') {
             requestParams.subDeviceName = this.formInline.queryStr
          }else if (this.formInline.currentKind == 'subTerminalNo') {
             requestParams.subTerminalNo = this.formInline.queryStr
          }else{
             requestParams.subTerminalName = this.formInline.queryStr
          }
      }       
      getDeviceList(requestParams).then(response => {
        let res = response.data;
        console.log(res);
        if (res.code == 0) {
          this.list = res.data;
          this.page.total = res.total;
        } else {
          console.log('获取终端列表失败.');
        }
        this.listLoading = false;
      })
    },
    handleDownload() {
      require.ensure([], () => {
        const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
        const tHeader = ['设备编号', '设备名称','终端编号','安装地址'];
        const filterVal = ['no', 'name', 'terminalNo', 'address'];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, '列表excel');
      })
    },
    onAdd() {

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
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push({ path: 'editdevice', query: { device: row } });
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleAlarmPhoneEdit(index, row) {
      // this.$router.push({ path: 'setterminalalarmphone', query: { terminal: row } });
    }
  }
};
</script>