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
import { fetchDeviceList } from 'api/monitor';

export default {
  data() {
    return {
      zoom: 14,
      center: [102.82756, 24.943165],
      markers: [
  {
    "position": [
      102.82756,
      24.943165
    ],
    "icon": 1
  },
  {
    "position": [
      102.828043,
      24.945081
    ],
    "icon": 0
  }
],
      loading: false
    }
  },
  methods: {
    getMarkers() {
      this.loading = true;
      // this.markers = [];
      // fetchDeviceList().then(response => {
      //   let res = response.data;
      //   if (res.data.length) {
      //     let deviceList = res.data;
      //     deviceList.forEach(function(item){
      //       if (item.longitude && item.latitude) {
      //         item.icon = (item.icon == 1) ? alarmMarker : normalMarker;
      //         let marker = {
      //           position: [item.longitude,item.latitude],
      //           icon: 1
      //         }
      //         this.markers.push(marker)
      //       }
      //     },this)
      //   }
      //   this.loading = false;
      // })
    }
  },
  created() {
    this.getMarkers();
  }
};
</script>
<style scoped>
.monitor-container {
  width: 100%;
  height: 92vh;
}
</style>

