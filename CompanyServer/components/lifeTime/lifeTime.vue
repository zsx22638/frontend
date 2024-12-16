<template>
  <view>
    <text>欢迎来到我的页面!</text>
  </view>
</template>

<script setup>
import { onLoad, onShow, onReady, onHide, onUnload, onPullDownRefresh, onReachBottom, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

// 页面加载时触发
onLoad((options) => {
  console.log("页面加载", options);
});

// 页面显示时触发
onShow(() => {
  console.log("页面显示");
});

// 页面首次渲染完成时触发
onReady(() => {
  console.log("页面首次渲染完成");
});

// 页面隐藏时触发
onHide(() => {
  console.log("页面隐藏");
});

// 页面卸载时触发
onUnload(() => {
  console.log("页面卸载");
});

// 监听用户下拉刷新动作
onPullDownRefresh(() => {
  console.log("用户下拉刷新");
  // 模拟数据加载
  setTimeout(() => {
    // 停止下拉刷新动画
    uni.stopPullDownRefresh();
  }, 2000);
});

// 页面滚动到最底部时触发
onReachBottom(() => {
  console.log("页面触底");
  // 可以进行数据加载
});

// 页面转发事件
onShareAppMessage(() => {
  console.log("用户点击分享");
  return {
    title: "分享标题",
    path: "/pages/my-page/my-page" // 替换为当前页面路径
  };
});

// 分享到朋友圈事件
onShareTimeline(() => {
  console.log("用户点击分享到朋友圈");
  return {
    title: "分享标题",
    path: "/pages/my-page/my-page" // 替换为当前页面路径
  };
});
</script>

<style>
/* 页面样式 */
view {
  padding: 20px;
  background-color: #f5f5f5;
}

text {
  font-size: 20px;
  color: #333;
}
</style>
