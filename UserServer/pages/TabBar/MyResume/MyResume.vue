<template>
	<!-- 顶部分类栏 -->
	<up-sticky bgColor="#fff">
		<up-tabs :list="list1" lineWidth="30" @click="changeView" current="1"></up-tabs>
	</up-sticky>
	
	
	<view class="container" v-if="show === 0">
		<!-- 渲染简历列表，并监听子组件的刷新事件 -->
		<Resume v-for="(item, index) in categorizedResumes.pending" :key="item.resumeId" :data="item" @refresh="handleRefresh" />
	
		
	</view>
	

	<view class="container" v-else-if="show === 1">
		<!-- 渲染简历列表，并监听子组件的刷新事件 -->
		<Resume v-for="(item, index) in categorizedResumes.approved" :key="item.resumeId" :data="item" @refresh="handleRefresh" />
		<button class="publish" @click="goTo" type="primary">创建新简历</button>
	</view>
	
	
	<view class="container" v-else="show === 2">
		<Resume v-for="(item, index) in categorizedResumes.rejected" :key="item.resumeId" :data="item" @refresh="handleRefresh" />
	</view>
	
	
	
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		getResumeList
	} from '@/api/index.js';
	import {
		ref,
		reactive,
		watch
	} from 'vue';
	
	import _ from 'lodash';
	
	// 创建响应式数据  
	const list1 = reactive([{
			name: '待审核',
			
		},
		{
			name: '已通过',
			
		},
		{
			name: '已驳回',
		}

	]);
	
	const changeView = (item,index) => {
		console.log('回调item',index)
		show.value = index
	}
	
	//默认显示已经通过审核的简历
	const show = ref(1)
	
	// 响应式的分类数据
	const categorizedResumes = ref({
	  pending: [],   // 待审核
	  approved: [],  // 审核通过
	  rejected: []   // 已驳回
	});

	
	
	
	const resumeList = ref([]); // 使用 ref 存储简历数据

	// 获取简历列表
	const getResumeListData = async () => {
		const res = await getResumeList();
		if (res.code === 200) {
			resumeList.value = res.data; // 更新简历数据
			console.log('简历数据：', resumeList.value)
		} else {
			uni.showToast({
				title: '简历数据获取失败',
				icon: 'none'
			});
		}
	};

	// 页面展示时调用获取简历数据
	onShow(async () => {
		await getResumeListData();
		console.log(categorizedResumes.value)
	});

	// 处理刷新事件
	const handleRefresh = () => {
		// console.log('收到刷新事件，重新获取简历数据');
		getResumeListData(); // 重新获取简历列表
	};

	// 新建简历按钮的跳转
	const goTo = () => {
		uni.navigateTo({
			url: '/pages/TabBar/MyResume/PublishResume/PublishResume'
		});
	};
	
	
	// 自动更新分类逻辑
	watch(
	  resumeList,
	  (newResumes) => {
	    const grouped = _.groupBy(newResumes, 'status');
	    categorizedResumes.value = {
	      pending: grouped[0] || [],
	      approved: grouped[1] || [],
	      rejected: grouped[2] || []
	    };
	  },
	  { immediate: true, deep: true }
	);
	
	
	
	
	
</script>

<style>
	:deep(.u-tabs__wrapper__nav) {
		margin-left: 200rpx;

	}

	.container {
		padding: 30rpx;
	}

	.publish {
		margin-top: 50rpx;
		background-color: $uni-color-primary;
		color: white;
	}
</style>