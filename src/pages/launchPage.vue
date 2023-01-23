<template>
  <div id='myDiv'>
    <el-row class="mb-4">
      <el-button style="height: 100px;width: 200px;font-size: 25px;" type="success" id="start"
        @click="toDashboard">启动传输服务</el-button>
    </el-row>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const { ipcRenderer } = window.require('electron')
const router = useRouter()

function toDashboard() {
  // 进行网络扫描
  // todo
  // 调用暴露的接口方法其发送上线消息
  ipcRenderer.send('register', 'online')
  router.push('/dashboard')
}

</script>


<style scoped>
#myDiv {
  margin: 25% 40%;
  font-size: 20px;

}

</style>
