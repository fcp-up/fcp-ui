<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="8" :sm="6" :md="4" :lg="8">
        <el-form ref="form" :model="device" label-width="100px">
          <el-form-item label="设备编号">
            <el-input v-model="device.no"></el-input>
          </el-form-item>
          <el-form-item label="安装地址">
            <el-input v-model="device.address"></el-input>
          </el-form-item>
          <el-form-item label="位置经度">
            <el-input v-model="device.longitude"></el-input>
          </el-form-item>
          <el-form-item label="位置纬度">
            <el-input v-model="device.latitude"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="device.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="报警电话">
              <el-input v-model="terminal.alarmPhoneNo"></el-input>
            </el-form-item> -->
          <el-form-item>
            <div class='tips'>{{tips}}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="saveDeviceInfo">保存</el-button>
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
import { addDevice } from 'api/device';
export default {
  data() {
    let self = this;
    return {
      tips: '',
      device: {
        no: '',
        name: '',
        longitude: '',
        latitude: '',
        address: '',
        terminalNo: '0'
      },
      zoom: 14,
      center: [102.82756, 24.943165],
      markers: [],
      loading: false,
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.device.longitude = lng;
          self.device.latitude = lat;
          self.marker = { lng, lat };
          self.changePosition([lng, lat]);
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.device.address = result.regeocode.formattedAddress;
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
    saveDeviceInfo() {
      addDevice(this.device).then(response => {
        let res = response.data;
        if (res.code == 0) {
          this.tips = '设备信息新增存储成功.'
          this.$router.go(-1);
        } else {
          this.tips = '设备信息新增存储失败.'
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