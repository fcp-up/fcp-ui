<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="8" :sm="6" :md="4" :lg="8">
        <el-form :model="terminal" :rules="terminalRules" ref="terminalForm"  label-width="100px">
          <el-form-item label="终端编号">
            <el-input v-model="terminal.no"></el-input>
          </el-form-item>
          <el-form-item label="终端名称">
            <el-input v-model="terminal.name"></el-input>
          </el-form-item>
          <el-form-item label="位置经度">
            <el-input v-model="terminal.longitude"></el-input>
          </el-form-item>
          <el-form-item label="位置纬度">
            <el-input v-model="terminal.latitude"></el-input>
          </el-form-item>
          <el-form-item label="安装地址">
            <el-input v-model="terminal.address"></el-input>
          </el-form-item>
          <el-form-item>
            <div class='tips'>{{tips}}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submitForm('terminalForm')">保存</el-button>
            <el-button size="large" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="8" :sm="6" :md="4" :lg="10">
        <div class="mapzone">
          <el-amap vid="amapcontainer" :zoom="zoom" :center="center" :events="events">
            <el-amap-marker :position="marker"> </el-amap-marker>
          </el-amap>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.el-form {
  margin-top: 15px;
}

.tips {
  font-size: 14px;
  color: red;
}

.mapzone {
  width: 80%;
  height: 270px;
  margin: 15px 15px 15px 15px;
}

.amap-logo {
  right: 0 !important;
  left: auto !important;
  display: none;
}

.amap-copyright {
  right: 70px !important;
  left: auto !important;
}
</style>


<script>
import { addTerminal } from 'api/terminal';
import { visWsTerminalNo } from 'utils/validate';
export default {
  data() {
    let self = this;
    const validateTerminalNo = (rule, value, callback) => {
      console.log(visWsTerminalNo(value));
      if (!visWsTerminalNo(value)) {
        callback(new Error('请输入正确的合法手机号'));
      } else {
        callback();
      }
    };
    return {
      tips: '',
      terminal: {
        no: '',
        name: '',
        longitude: '102.82756',
        latitude: '24.943165',
        adminDivNo: '',
        alarmPhoneNo: '',
        address: ''
      },
      terminalRules: {
        alarmPhoneNo: [
          { required: true, trigger: 'blur', validator: validateTerminalNo }
        ]
      },
      zoom: 14,
      center: [102.82756, 24.943165],
      marker: [102.82756, 24.943165],
      loading: false,
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.terminal.longitude = lng;
          self.terminal.latitude = lat;
          self.marker = { lng, lat };
          self.changePosition([lng, lat]);
          // // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.terminal.address = result.regeocode.formattedAddress;
                //self.terminal.adminDivNo = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
    };
  },
  created() { },
  methods: {
    submitForm(terminalForm) {
      this.$refs[terminalForm].validate(valid => {
        console.log(valid);
        return;
        if (valid) {
          addTerminal(this.terminal).then(response => {
            let res = response.data;
            if (res.code == 0) {
              this.tips = '终端信息新增存储成功.'
              this.$router.go(-1);
            } else {
              this.tips = '终端信息新增存储失败.'
            }
            this.listLoading = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.$router.go(-1)
    },
    changePosition(position) {
      this.marker = position;
    }

  }
};
</script>