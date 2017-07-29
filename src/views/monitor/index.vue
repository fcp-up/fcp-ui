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
import { fetchMarkers } from 'api/monitor';
export default {
  data() {
    return {
      zoom: 14,
      center: [102.82756,24.943165],
      markers: [],
      loading: false
    }
  },
  methods: {
    getMarkers() {
      this.loading = true;
      this.markers = [];
      fetchMarkers().then(response => {
          let res = response.data;
          res.forEach(function(element) {
            element.icon = (element.icon == 1) ? alarmMarker : normalMarker;
            this.markers.push(element)
          }, this);
          this.loading = false;
        })
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

