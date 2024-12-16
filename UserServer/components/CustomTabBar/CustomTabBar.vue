<template>
  <view>
    <up-tabbar
      :value="value6"
      @change="handleTabChange"
      :fixed="true"
      :placeholder="true"
      :safeAreaInsetBottom="true"
      activeColor="#2cbcff"
    >
      <!-- 动态渲染 TabBar 项 -->
      <up-tabbar-item
        v-for="(item, index) in tabBarList"
        :key="index"
        :text="item.text"
        :icon="item.iconPath"
      ></up-tabbar-item>
    </up-tabbar>
  </view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoleStore } from '@/stores/useRoleStore'; // 引入角色仓库

// 从 Pinia 中获取角色状态
const roleStore = useRoleStore();

// 用来存储当前选中的 Tab
const value6 = ref(null);

onMounted(() => {
  const role = uni.getStorageSync('role');
  roleStore.setRole(role);

  // 获取激活的 Tab 索引（如果存在）
  const activeTabIndex = uni.getStorageSync('activeTabIndex');

  // 如果有激活的 Tab 索引，设置为当前的选中值
  if (activeTabIndex !== undefined) {
    value6.value = activeTabIndex;
  } else {
    // 如果没有存储的值，默认选中第一个 Tab
    value6.value = 0;
  }
});

// 获取当前角色的 tabBarList 配置
const tabBarList = computed(() => roleStore.role.tabBarList);

// 切换 Tab 时更新 Tab 状态，并进行页面跳转
const handleTabChange = (name) => {
  console.log('Tab Changed: ', name);
  
  // 获取当前选中的 Tab 信息
  const selectedTab = tabBarList.value[name];

  // 执行页面跳转逻辑
  if (selectedTab) {
    uni.setStorageSync('activeTabIndex', name);  // 存储激活的Tab索引

    uni.navigateTo({
      url: selectedTab.pagePath,  // 跳转到对应的页面
    });
  }
};
</script>

<style scoped>
/* TabBar 样式配置，可以根据需求调整 */
</style>
