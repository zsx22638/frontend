<script setup>
import {onMounted} from "vue";
import {useAdminStore} from "@/store/admin/index.js";

// 使用 Pinia 仓库
const adminStore = useAdminStore();

onMounted(async () => {
  console.log('mounted');

  // 如果用户未登录或者没有 token（没有登录凭证），则不发请求
  if (!adminStore.isLoggedIn && !localStorage.getItem('token')) {
    return;  // 不做任何操作，避免发请求
  }else{
    await adminStore.fetchAdminInfo(); // 调用仓库中的方法获取用户信息
  }

});


</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">

</style>
