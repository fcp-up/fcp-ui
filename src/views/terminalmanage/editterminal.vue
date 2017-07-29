<<template>
  <div>
      终端编辑界面{{this.$router.row}}
      <el-button @click="handleEdit()">click me</el-button>
  </div>    
</template>

<script>
import {getTerminalList} from 'api/terminal';
export default {
  data() {
    return {
      formInline: {
        no: '1234512345',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        position: '102.00000111,73.000011116778'
      }
    };
  },
  created() {
  
  },
  methods: {   
    handleEdit() {
      console.log(this.$route.query); 
    }
  }
};
</script>
