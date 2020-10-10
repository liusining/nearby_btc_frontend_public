<template>
  <baidu-map-marker
    :position="$store.state.geo.userLocation || {}"
    animation="BMAP_ANIMATION_DROP"
    :icon="icon"
  ></baidu-map-marker>
</template>

<script>
import BaiduMapMarker from "vue-baidu-map/components/overlays/Marker";
import peopleMarkerIcon from "../assets/isometric-people-map-marker.png";
export default {
  name: "UserLocationMarker",
  components: {
    BaiduMapMarker,
  },
  data() {
    return {
      icon: {
        url: peopleMarkerIcon,
        size: { width: 60, height: 67 },
      },
    };
  },
};
</script>
