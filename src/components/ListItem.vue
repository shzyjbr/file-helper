<template>
  <div class="item" :class="active ? 'active' : ''">

    <div class="device">
      <div>可连接设备：{{ deviceName }}</div>
    </div>
    <div class="operation">
      <el-button type="success">连接</el-button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  deviceName: {
    type: String,
    required: true,
    default: "",
  },
})

</script>

<style scoped>
.item {
  height: 50px;
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  border: 1px solid #ccc;
  
}
.device {
  width: 80%;
    padding-right: 5px;
  }
.operation {
  flex-grow:1;

}
.active {
  background-color: gray;
}
</style>
