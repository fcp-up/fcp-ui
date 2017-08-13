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
        <el-form-item>
          <el-button type="primary" icon="search" @click="onQuery">查询</el-button>
          <el-button type="primary" icon="document" @click="handleDownload">导出excel</el-button>
          <el-button style='margin-bottom:20px;float:right' type="primary" icon="plus" @click="onAdd">新增终端</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" 
        fit highlight-current-row  tooltip-effect="dark" style="width: 100%">
         <!-- <el-table-column type="index" label="序号" width="80">
        </el-table-column>  -->
        <el-table-column prop="no" label="终端编号" width="120" fixed>
        </el-table-column >
        <el-table-column prop="name" label="终端名称" width="280" :show-overflow-tooltip="true">
        </el-table-column >
        <el-table-column prop="alarmPhone" label="报警电话" width="320" :show-overflow-tooltip="true">
        </el-table-column>      
        <el-table-column prop="address" label="安装地址" width="400" :show-overflow-tooltip="true">
        </el-table-column>
         <el-table-column prop="longitude" label="位置经度" width="150">
        </el-table-column >
        <el-table-column prop="latitude" label="位置纬度" width="150">
        </el-table-column > 
        <el-table-column label="操作" width="220" fixed="right">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)">编辑终端</el-button>
            <!-- <el-button size="small" icon="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            <el-button size="small" icon="edit" @click="handleAlarmPhoneEdit(scope.$index, scope.row)">报警电话</el-button>
          </template>
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
import { getTerminalList} from 'api/terminal';
export default {
  data() {
    return {
      formInline: {
        queryStr: '',
        currentKind: '1'
      },
      queryKind: [
        { label: '按终端编号', value: '1' },
        { label: '按终端名称', value: '2' }
      ],
      list: null,
      listLoading: true, 
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      requestParams: ''
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      const requestParams = {
        queryStr: this.formInline.queryStr || '',
        currentPage: this.page.currentPage || 1,
        pageSize: this.page.pageSize || 10
      }  
      getTerminalList(requestParams).then(response => {
        let res = response.data;
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
      this.page.currentPage = val;
      this.fetchData();
    },
    onQuery() {
      this.fetchData();
    },
    onAdd() {
      this.$router.push({ path: 'addterminal' });
    },
    handleEdit(index, row) {
      this.$router.push({ path: 'editterminal', query: { terminal: row } });
    },
    handleAlarmPhoneEdit(index, row) {
      this.$router.push({ path: 'setterminalalarmphone', query: { terminal: row } });
    }
  }
};
</script>
