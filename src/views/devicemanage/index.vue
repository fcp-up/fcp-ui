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
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="no" label="终端编号" width="120">
        </el-table-column>
        <el-table-column prop="alarmPhone" label="报警电话" width="200">
        </el-table-column>
        <el-table-column prop="state" label="当前状态" width="100">
        </el-table-column>
        <el-table-column prop="date" label="状态时间" width="120">
        </el-table-column>
        <el-table-column prop="address" label="安装地址" width="300">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
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
  margin:0 auto
}
</style>

<script>
import {getList} from '../../api/article';
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
      tableData: [{
        no: '1234512345',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        state: '在线',
        date: '2016-05-02',
        alarmPhone: '13500000000'
      }, {
        no: '1231',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        state: '在线',
        date: '2016-05-02',
        alarmPhone: '13500000000'
      }, {
        no: '12311',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        state: '在线',
        date: '2016-05-02',
        alarmPhone: '13500000000'
      }, {
        no: '123111',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        state: '在线',
        date: '2016-05-02',
        alarmPhone: '13500000000'
      }],
      currentPage4: 4
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.list = response.data;
        this.listLoading = false;
      })
    },
    handleDownload() {
      require.ensure([], () => {
        const {
            export_json_to_excel
          } = require('vendor/Export2Excel');
        const tHeader = ['序号', '文章标题', '作者', '阅读数', '发布时间'];
        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time'];
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
      console.log("index, row");
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
