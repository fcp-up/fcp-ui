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
}, archName = {
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
              let marker = {
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
    createWs() {
      const url = ['ws://', location.href.replace(/http?:\/\/([^\/]+).*/, '$1'), '/api/fcp/ws/socket/', this.sessionId].join('');
      const ws = new WebSocket(url);
      ws.onopen = function () {
        // console.log('连接成功');
      };
      ws.onmessage = function (res) {
        // res为接收到的数据
        var msg = eval('(' + res.data + ')');
        switch (msg.type) {
          case WSP.MT.txt:
            msg = [msg.source.addr, '：', msg.msg, '<br>'].join('');
            break;
          case WSP.MT.arch:
            msg = [archName[msg.msg], '发生变化<br>'].join('');
            break;
          case WSP.MT.termOnline:
            msg = ['终端在线状态变化：', msg.msg, '<br>'].join('');
            break;
          case WSP.MT.deviceAlarm:
            msg = ['设备告警：', msg.msg, '<br>'].join('');
            break;
        }
      };
      ws.onerror = function (e) { // e为错误信息
        console.log("WebSocket Error: ", e);
      };
      ws.onclose = function (e) { // e为关闭的原因
        console.log("Connection closed", e);
      };
    },
    getSessionId() {
      if (!this.sessionId) {
        this.$store.dispatch('GetSessionId').then(() => {
          this.createWs();
        })
      }
    }
  },
  // socket: {
  //   events: {
  //     changed(msg) {
  //       console.log("Something changed: " + msg);
  //       var msg = eval('(' + msg + ')');
  //       switch (msg.type) {
  //         case WSP.MT.txt:
  //           msg = [msg.source.addr, '：', msg.msg, '<br>'].join('');
  //           break;
  //         case WSP.MT.arch:
  //           msg = [archName[msg.msg], '发生变化<br>'].join('');
  //           break;
  //         case WSP.MT.termOnline:
  //           msg = ['终端在线状态变化：', msg.msg, '<br>'].join('');
  //           break;
  //         case WSP.MT.deviceAlarm:
  //           msg = ['设备告警：', msg.msg, '<br>'].join('');
  //           break;
  //       }
  //       console.log(msg);
  //     },
  //     connect() {
  //       console.log("Websocket connected to " + this.$socket.nsp);
  //     },

  //     disconnect() {
  //       console.log("Websocket disconnected from " + this.$socket.nsp);
  //     },
  //     error(err) {
  //       console.error("Websocket error!", err);
  //     }
  //   }
  // },
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

