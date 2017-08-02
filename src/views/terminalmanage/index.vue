<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.terminalNo" placeholder="输入终端编号或名称关键词检索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onQuery">查询</el-button>
          <el-button type="primary" icon="document" @click="handleDownload">导出excel</el-button>
          <el-button style='margin-bottom:20px;float:right' type="primary" icon="plus" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="list" style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="no" label="终端编号" width="120">
        </el-table-column >
        <el-table-column prop="alarmPhone" label="报警电话" width="300">
        </el-table-column>
        <el-table-column prop="longitude" label="位置经度" width="120">
        </el-table-column >
        <el-table-column prop="latitude" label="位置纬度" width="120">
        </el-table-column >
        <el-table-column prop="address" label="安装地址" width="300">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="small" icon="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            <el-button size="small" type="info" @click="handleAlarmPhoneEdit(scope.$index, scope.row)">设置报警电话</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div class="pagetoolbar" v-if="total" >
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<style scoped>
.el-input {
  width: 300px;
}

.el-form-item {
  margin-bottom: 0px;
}

.el-table-column {
  white-space: nowrap;
}

.pagetoolbar {
  text-align: center;
}
</style>

<script>
import { getTerminalList, saveTerminal } from 'api/terminal';
export default {
  data() {
    return {
      formInline: {
        dateValue: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        states: [{ 'label': '全部', value: -1 }, { 'label': '在线', value: 1 }, { 'label': '离线', value: 0 }],
        lastOnlineState: -1,
        no: ''
      },
      listLoading: true,
      list: [],
      currentPage: '',
      total: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getTerminalList().then(response => {
        let res = response.data;
        if (res.code == 0) {
          this.list = res.data;
          this.total = res.data.length;
          this.currentPage = 1;
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
        const tHeader = ['终端编号', '报警电话', '安装地址'];
        const filterVal = ['no', 'alarmPhone', 'address'];
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
      console.log(`当前页: ${val}`);
    },
    onQuery() {
      console.log("index, row");
    },
    onAdd() {
      this.$router.push({ path: 'addterminal' });
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push({ path: 'editterminal', query: { terminal: row } });
    },
    handleAlarmPhoneEdit(index, row) {
      console.log(index, row);
      this.$router.push({ path: 'setterminalalarmphone', query: { terminal: row } });
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
