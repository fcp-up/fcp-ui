<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="8" :sm="6" :md="4" :lg="8">
        <el-form ref="form" :model="terminal" label-width="100px">
          <el-form-item label="终端编号">
            <el-input v-model="terminal.no"></el-input>
          </el-form-item>
          <el-form-item label="位置经度">
            <el-input v-model="terminal.longitude"></el-input>
          </el-form-item>
          <el-form-item label="位置纬度">
            <el-input v-model="terminal.latitude"></el-input>
          </el-form-item>
          <el-form-item label="报警电话">
            <el-input v-model="terminal.alarmPhoneNo"></el-input>
          </el-form-item>
          <el-form-item label="安装地址">
            <el-input v-model="terminal.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="onSubmit">保存</el-button>
            <el-button size="large" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="8" :sm="6" :md="4" :lg="10">
        <div class="mapzone">
          <el-amap :vid="amapcontainer" :zoom="zoom" :center="center" :events="events">
            <el-amap-marker v-for="marker in markers" :key="marker" :icon="marker.icon" :position="marker.position"> </el-amap-marker>
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
import {saveTerminal} from 'api/terminal';
export default {
  data() {
    let self = this;
    return {
      terminal: {
        no: '',
        name: '',
        longitude: '',
        latitude: '',
        adminDivNo: '',
        alarmPhoneNo: '',
        address: ''
      },
      zoom: 14,
      center: [102.82756, 24.943165],
      markers: [],
      loading: false,
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.terminal.longitude = lng;
          self.terminal.latitude = lat;
          self.marker = { lng, lat };
          self.changePosition([lng,lat]);
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.terminal.address = result.regeocode.formattedAddress;
                self.terminal.adminDivNo = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
    };
  },
  created() {
    console.log(this.$route.query.terminal);
    let curTerminal = this.$route.query.terminal;
    console.log(curTerminal);
    this.terminal.no = curTerminal.no || '';
    this.terminal.latitude = curTerminal.latitude || '';
    this.terminal.longitude = curTerminal.longitude || '';
    this.terminal.adminDivNo = curTerminal.adminDivNo || '';
    this.terminal.alarmPhoneNo = curTerminal.alarmPhoneNo || '';
    this.terminal.address = curTerminal.address || '';
    if (this.terminal.latitude && this.terminal.longitude) {
      this.markers.push({ position: [this.terminal.longitude] })
    } else {
      this.markers.push({ position: this.center });
      this.terminal.longitude = this.center[0];
      this.terminal.latitude = this.center[1];
    }
  },
  methods: {
    onSubmit() {
      saveTerminal(this.terminal).then(response => {
       let res = response.data;
       console.log(res);
        if(res.code == 0) {
          console.log('获取终端存储成功.');
        }else{
          console.log('获取终端存储失败.');
        }
        this.listLoading = false;
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    changePosition(position) {
          this.markers[0].position = position;
        }

  }
};
</script>
