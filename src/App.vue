<script>
import Layer from '@/components/Layer.vue'
export default {
  name:'App',
  components:{ Layer }, 
}
</script>
<template>
  <Layer>
  <router-view/>
  </Layer>
</template>

<style lang="css">
html {
  font-size: 16px;
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
