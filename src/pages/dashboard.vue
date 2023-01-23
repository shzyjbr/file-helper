<template>
    <el-container class="layout-container-demo" style="height: 100%;">
        <el-aside width="300px" style="border-right: 1px solid #ccc;">
            <el-scrollbar>
                <el-menu>
                    <ListItem deviceName="1"></ListItem>
                    <ListItem deviceName="2"></ListItem>
                    <ListItem deviceName="3"></ListItem>
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <el-container>

            <el-main>
                <el-scrollbar>
                    <div class="tips" v-if="chooseOne">
                        <div class="inner-text">点右侧连接一个设备进行传输</div>
                    </div>

                    <div v-if="!chooseOne">
                        <router-view v-slot="{ Component }" class="content" :key="route.params.id" >
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </router-view>
                    </div>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { useRoute, useRouter } from "vue-router";
import ListItem from '@/components/ListItem.vue'

const router = useRouter();
const route = useRoute();
const choose = (index, id) => {
    checkIndex.value = index;
    router.push("/index/friend/" + id);
};
const chooseOne = ref(true)
// const tableData = ref(Array.from({ length: 10 }).fill(item))
const tableData = ref([{ name: '可连接设备1', }, { name: '可连接设备2', }, { name: '可连接设备3', }])
window.myAPI.handleUpdateRegister((event, ipList) => {
    console.log('call success')
    for(let i = 0; i < ipList.size; i++) {
        tableData.value[i].name='可连接设备:'+ip
    }
})
</script>

<style scoped>
.tips {
    width: 100%;
    height: 100%;
    display: flex;

}

.inner-text {
    margin: 33%;
    width:25%;
    height: 25%;

}

.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}
</style>
