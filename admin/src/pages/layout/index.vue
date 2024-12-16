<script setup>
import Menu from './menu/index.vue'
import Header from './header/index.vue'
</script>

<template>
  <div class="common-layout">
    <!-- 头部 -->
    <div class="head"><Header /></div>

    <div class="body">
      <!-- 菜单 -->
      <div class="menu"><Menu /></div>

      <!-- 主内容区域 -->
      <div class="main">
        <!-- 为每个路由视图设置唯一的 key -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 使整个布局占满视口高度 */

  .head {

    background-color: pink;
    flex-shrink: 0; /* 固定高度，不可缩小 */
  }

  .body {
    display: flex;
    flex: 1; /* 占据剩余高度 */
    overflow: hidden;

    .menu {
      width: 200px;
      background-color: beige;
      flex-shrink: 0; /* 固定宽度，不可缩小 */
      overflow-y: auto; /* 如果菜单内容过多，出现滚动条 */
    }

    .main {
      padding: 20px;
      flex: 1; /* 占据剩余宽度 */
      background-color: white;
      overflow-y: auto; /* 如果主内容过多，出现滚动条 */
    }
  }
}
</style>
