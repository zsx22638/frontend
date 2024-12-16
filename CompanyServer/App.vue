<template>
	
</template>

<script setup>
	import { onLaunch,onShow,onHide,onError,onPageNotFound,onThemeChange,onUnhandledRejection } from '@dcloudio/uni-app';
	import { onMounted,onUnmounted,ref,watch } from 'vue';
	import { useCompanyStore } from '@/stores/companyInfo/index.js'
	import { useChatStore } from '@/stores/chat/index.js'; // 引入你之前的 WebSocket 仓库
	
	
	//websocketStore获取
	const chatStore = useChatStore();
	

	const companyStore = useCompanyStore();
	
	const audioContext = uni.createInnerAudioContext(); // 创建音频上下文
	
	onMounted( () => {
		audioContext.src = '/static/Tips.mp3'; // 设置音频路径
		audioContext.autoplay = false; // 是否自动播放
		console.log('音频初始化完成');
		// console.log('执行了')
		const token = uni.getStorageSync('token')
		if(token) {
			//登录之后有了token就去初始化这个连接
			chatStore.initWebSocket(token)
			 companyStore.fetchCompanyInfo()
		}
	})
	
	
	
	onUnmounted(() => {
		chatStore.clear(); // 关闭 WebSocket 连接
	    audioContext.destroy(); // 组件卸载时销毁音频上下文
	    console.log('音频上下文已销毁');
	});
	
	
	function playAudio() {
	  audioContext.play(); // 播放音频
	  audioContext.onPlay(() => {
	    console.log('音频播放中');
	  });
	  audioContext.onError((err) => {
	    console.error('音频播放失败', err);
	  });
	}
	
	
	// 监听接收到的新消息
	watch(() => chatStore.receivedMessages, (newMessages) => {
		playAudio()
		console.log('收到新信息开始播放音频：',newMessages)
	});
	
	
		
	// onLaunch(() => {
	// 	console.log('页面初始化')
	// })
	onShow(() => {
		console.log('应用进入前台')
	})
	// onHide(() => {
	// 	console.log('应用进入后台')
	// })
	// onError(() => {
	// 	console.log('应用发生错误')
	// })
	// onPageNotFound(() => {
	// 	console.log('访问的页面不能存在')
	// })
	// onThemeChange((theme) => {
	// 	console.log('系统主题发生改变',theme)
	// })
	// onUnhandledRejection((res) => {
	// 	console.log('未处理的Promise拒绝的',res)
	// })
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-plus/index.scss";
	@import "static/icons/iconfont.css"
	
	

</style>