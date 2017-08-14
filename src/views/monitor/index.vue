<template>
  <div class="monitor-container">
    <el-amap vid="amapcontainer" :zoom="zoom" :center="center">
      <el-amap-marker v-for="marker in markers" :key="marker" :icon="marker.icon" :position="marker.position" :events="marker.events">
      </el-amap-marker>
      <el-amap-info-window v-for="window in tipWindows" :key="window" :position="window.position" :visible="window.visible" :content="window.content"></el-amap-info-window>
    </el-amap>
  </div>
</template>

<script>
import normalMarker from '../../assets/marker/normal.png';
import alarmMarker from '../../assets/marker/alarm.png';
import { fetchDeviceList } from 'api/monitor';
import { mapGetters } from 'vuex';

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
      tipWindows: [],
      loading: false,
      listQuery: null,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0 
      }
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
      this.listQuery = {
        pageSize: this.page.pageSize || 10000,
        pageIndex: this.page.currentPage || 1
      }
      fetchDeviceList(this.listQuery).then(response => {
        let res = response.data;
        if (res.code === 0) {
          let deviceList = res.data;
          let self = this;
          deviceList.forEach(function (item) {
            if (item.longitude && item.latitude) {
              // console.log("longitude:" + item.longitude + ' latitude:' + item.latitude);
              item.icon = (item.icon == 1) ? alarmMarker : normalMarker;
              // item.icon = alarmMarker;
              let marker = {
                devNo: item.no,
                position: [item.longitude, item.latitude],
                icon: item.icon,
                visible: false,
                content: `<div class="prompt">设备${item.no}</div>`,
                events: {
                  click() {
                    for (let i = 0; i < self.tipWindows.length; i++) {
                      self.tipWindows[i].visible = false;                      
                    }                    
                    self.$nextTick(() => {
                      for (let i = 0; i < self.tipWindows.length; i++) {
                        if ( self.tipWindows[i].devNo === marker.devNo) {
                           self.tipWindows[i].visible = true;           
                        }            
                      }  
                    });                                        
                  }
                }
              }
              this.markers.push(marker);
              this.tipWindows.push(marker);
            }
          }, this)
        }
        this.loading = false;
      })
    },
    createWs(markers) {
      // const url = ['ws://', location.href.replace(/http?:\/\/([^\/]+).*/, '$1'), '/api/fcp/ws/socket/', this.sessionId].join('');
      const url = ['ws://', location.href.replace(/http?:\/\/([^\/]+).*/, '$1'), '/fcp/ws/socket/', this.sessionId].join('');
      let ws = new WebSocket(url);
      let tConnected = null;
      function reconnect() {
        // console.log('链接断开，重新链接.');
        let rews = new WebSocket(url);
        rews.onmessage = function (response) {
          // res为接收到的数据
          // console.log(response.data);
          let msg = eval('(' + response.data + ')');
          if (msg.type === WSP.MT.deviceAlarm) {
            let alarmMsg = eval('(' + msg.msg + ')');
            for (var i = 0; i < markers.length; i++) {
              let marker = markers[i];
              for (var j = 0; j < alarmMsg.length; j++) {
                let amsg = alarmMsg[j];
                if (amsg.device && amsg.device.no === marker.devNo) {
                  //设置告警状态
                  markers[i].icon = alarmMarker;
                }
              }
            }
          }
        };
        rews.onclose = function () {
          tConnected = window.setTimeout(reconnect, 3000);
        };
        ws.onopen = function () {
          // console.log('连接成功');
          if (tConnected) {
            // console.log('链接成功，清除定时器.');
            window.clearInterval(tConnected);
          }
        };
      };

      ws.onopen = function () {
        // console.log('连接成功');
      };
      ws.onmessage = function (res) {
        // res为接收到的数据
        let msg = eval('(' + res.data + ')');
        if (msg.type === WSP.MT.deviceAlarm) {
          // msg = ['设备告警：', msg.msg, '<br>'].join('');
          let alarmMsg = eval('(' + msg.msg + ')');
          for (var i = 0; i < markers.length; i++) {
            let marker = markers[i];
            for (var j = 0; j < alarmMsg.length; j++) {
              let amsg = alarmMsg[j];
              if (amsg.device && amsg.device.no === marker.devNo) {
                //设置告警状态
                markers[i].icon = alarmMarker;
              }
            }
          }
        }
      };
      ws.onerror = function (e) { // e为错误信息
        // console.log("WebSocket Error: ", e);
      };
      ws.onclose = function (e) { // e为关闭的原因
        tConnected = window.setTimeout(reconnect, 3000);
      };
    },
    getSessionId() {
      if (!this.sessionId) {
        this.$store.dispatch('GetSessionId').then(() => {
          this.createWs(this.markers);
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

