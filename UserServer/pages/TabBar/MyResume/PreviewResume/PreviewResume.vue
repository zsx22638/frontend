<template>
	<view>
		<web-view :src="resumeUrl"></web-view>

	</view>
</template>

<script setup>
	import {  onLoad } from '@dcloudio/uni-app'
	import { ref } from 'vue'

	// 创建一个响应式变量 resumeUrl
	const resumeUrl = ref('');

	onLoad(() => {
		// 从本地存储获取 resumeUrl
		const storedResumeUrl = uni.getStorageSync('resumeUrl');
		console.log(storedResumeUrl);

		// 将获取的值赋给响应式变量
		if (storedResumeUrl) {
			resumeUrl.value = storedResumeUrl;
		}

		// 移除存储的值
		uni.removeStorageSync('resumeUrl');
	});
</script>

<style scoped>
	/* 你的样式代码 */
</style>
