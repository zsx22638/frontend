<template>
	<!-- 顶部分类栏 -->
	<up-sticky bgColor="#fff">
		<up-tabs :list="list1" lineWidth="30" @click="changeView" current="1"></up-tabs>
	</up-sticky>


	<view class="container" v-if="show === 0" v-for="(item,index) in categorizedPositions.pending"
		:key="item.positionId">
		<PositionCard :position="item"></PositionCard>
	</view>


	<view v-else-if="show === 1" class="container" >
		<view v-for="(item,index) in categorizedPositions.approved" style="margin-top:20rpx" >
			<PositionCard :position="item"></PositionCard>
		</view>

		<button class="publish" @click="goTo" type="primary">发布新职位</button>
	</view>


	<view class="container" v-else="show === 2" v-for="(item,index) in categorizedPositions.rejected">
		<PositionCard :position="item"></PositionCard>
	</view>



</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';
	import {
		getPositionList,
		publishPosition
	} from '@/api/index.js'
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
			name: '已拒绝',
		}

	]);

	const changeView = (item, index) => {
		console.log('回调item', index)
		show.value = index
	}

	//默认显示已经通过审核的简历
	const show = ref(1)

	// 响应式的分类数据
	const categorizedPositions = ref({
		pending: [], // 待审核
		approved: [], // 审核通过
		rejected: [] // 已驳回
	});


	// 发布新职位按钮的跳转
	const goTo = () => {
		uni.navigateTo({
			url: '/pages/TabBar/PositionManage/PublishPosition/PublishPosition'
		});
	};


	const postionList = ref([]); // 使用 ref 存储简历数据

	// 获取简历列表
	const getPositionData = async () => {
		const res = await getPositionList();
		console.log('11111', res)
		if (res.code === 200) {
			postionList.value = res.data; // 更新简历数据
			console.log('职位数据：', postionList.value)
		} else {
			uni.showToast({
				title: '职位数据获取失败',
				icon: 'none'
			});
		}
	};

	// 页面展示时调用获取简历数据
	onShow(async () => {
		await getPositionData();
	});

	// 处理刷新事件
	const handleRefresh = () => {
		// console.log('收到刷新事件，重新获取简历数据');
		getPositionData(); // 重新获取简历列表
	};


	// 自动更新分类逻辑
	watch(
		postionList,
		(newPositions) => {
			const grouped = _.groupBy(newPositions, 'status');
			categorizedPositions.value = {
				pending: grouped[0] || [],
				approved: grouped[1] || [],
				rejected: grouped[2] || []
			};
		}, {
			immediate: true,
			deep: true
		}
	);
</script>

<style>
	:deep(.u-tabs__wrapper__nav) {
		margin-left: 200rpx;

	}

	.container {
		padding: 20rpx;
	}

	.publish {
		margin-top: 50rpx;
		background-color: $uni-color-primary;
		color: white;
	}
</style>