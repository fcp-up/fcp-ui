<template>
  <div class="monitor-container">
    <el-amap :vid="amapcontainer" :zoom="zoom" :center="center">
      <el-amap-marker v-for="marker in markers" :key="marker" :icon="marker.icon" :position="marker.position"> </el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import normalMarker from '../../assets/marker/normal.png';
import alarmMarker from '../../assets/marker/alarm.png';
// import store from './store';
import { fetchDeviceList } from 'api/monitor';
import { mapGetters } from 'vuex';

//const url = ['ws://', location.href.replace(/http?:\/\/([^\/]+).*/, '$1'), '/fcp/ws/socket/', store.getters.sessionId].join('');
// const ws = new WebSocket(url);

const WSP = {
  ST: {
    wsvr: 1,
    client: 2
  },
  STSTR: {
    1: '发送',
    2: '浏览器客户端'
  },
  MT: {
    txt: 1,
    arch: 2,
    termOnline: 3,
    deviceAlarm: 4
  }
};

const archId = {
  terminal: 1,
  device: 2
};

const archName = {
  1: '终端',
  2: '设备'
}

export default {
  data() {
    return {
      zoom: 14,
      center: [102.82756, 24.943165],
      markers: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'sessionId'
    ])
  },
  methods: {
    getMarkers() {
      this.loading = true;
      this.markers = [];
      fetchDeviceList().then(response => {
        let res = response.data;
        if (res.data.length) {
          let deviceList = res.data;
          deviceList.forEach(function (item) {
            if (item.longitude && item.latitude) {
              // console.log("longitude:" + item.longitude + ' latitude:' + item.latitude);
              item.icon = (item.icon == 1) ? alarmMarker : normalMarker;
              // item.icon = alarmMarker;
              let marker = {
                devNo: item.no,
                position: [item.longitude, item.latitude],
                icon: item.icon
              }
              this.markers.push(marker)
            }
          }, this)
        }
        this.loading = false;
      })
    },
    createWs(markers, alarmMarker) {
      const url = ['ws://', location.href.replace(/http?:\/\/([^\/]+).*/, '$1'), '/api/fcp/ws/socket/', this.sessionId].join('');
      let ws = new WebSocket(url);
      function reconnect(markers, alarmMarker) {
        let rews = new WebSocket(url);
        rews.onmessage = function (res) {
          // res为接收到的数据
          let msg = eval('(' + res.data + ')');
          if (msg.type === WSP.MT.deviceAlarm) {
            // msg = ['设备告警：', msg.msg, '<br>'].join('');
            let alarmMsg = eval('(' + msg.msg + ')');
            alarmMsg.forEach(item => {
              if (item.device) {
                // 获取经纬度信息
                let dev = item.device;
                markers.forEach(item => {
                  if (item.devNo === dev.no) {
                    item.icon = alarmMarker
                  }
                })
              }
            });
          }
        };
        rews.onclose = function () {
          //dosomthing
        };
      };

      ws.onopen = function () {
        // console.log('连接成功');
      };
      ws.onmessage = function (res) {
        // res为接收到的数据
        let msg = eval('(' + res.data + ')');
        console.log(msg);
        if (msg.type === WSP.MT.deviceAlarm) {
          // msg = ['设备告警：', msg.msg, '<br>'].join('');
          let alarmMsg = eval('(' + msg.msg + ')');
          alarmMsg.forEach(item => {
            if (item.device) {
              // 获取经纬度信息
              let dev = item.device;
              markers.forEach(item => {
                if (item.devNo === dev.no) {
                  item.icon = alarmMarker
                }
              })
            }
          });
        }
      };
      ws.onerror = function (e) { // e为错误信息
        console.log("WebSocket Error: ", e);
      };
      ws.onclose = function (e) { // e为关闭的原因
        console.log("Connection closed", e);
        const that = this;
        setTimeout(function () {
          reconnect();
        }, 5000);
      };
    },
    getSessionId() {
      if (!this.sessionId) {
        this.$store.dispatch('GetSessionId').then(() => {
          this.createWs(this.markers, alarmMarker);
        })
      }
    }
  },
  created() {
    this.getMarkers();
    this.getSessionId();
  }
};
</script>
<style scoped>
.monitor-container {
  width: 100%;
  height: 92vh;
}
</style>

