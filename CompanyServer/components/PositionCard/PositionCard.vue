<template>
	<view class="job-detail">
		<!-- 职位名称 -->
		<view class="job-title">
			<text class="title">{{ position.positionName }}</text>
		</view>

		<!-- 薪资 -->
		<view class="job-salary">
			<text class="label">薪资：</text>
			<text class="value">{{ position.positionSalary }} 元</text>
		</view>

		<!-- 根据 status 显示不同的按钮 -->
		<view>
			<!-- status 为 0: 显示 编辑和 删除 -->
			<view v-if="position.status === 0" class="action-buttons">
				<button class="action-btn edit-btn" @click="editJob">编辑</button>
				<button class="action-btn delete-btn" @click="deleteJob">删除</button>
			</view>

			<!-- status 为 1: 显示 编辑, 删除, 查看面试 -->
			<view v-else-if="position.status === 1" class="action-buttons">
				<button class="action-btn edit-btn" @click="editJob">编辑</button>
				<button class="action-btn delete-btn" @click="deleteJob">删除</button>
				<button class="action-btn interview-btn" @click="viewInterview(position.positionId)">查看面试</button>
			</view>

			<!-- status 为 2: 显示 编辑和 删除 -->
			<view v-else-if="position.status === 2" class="action-buttons">
				<button class="action-btn edit-btn" @click="editJob">编辑</button>
				<button class="action-btn delete-btn" @click="deleteJob">删除</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { defineProps } from 'vue';
	import { throttle } from 'lodash';
	import { getPositionInterView } from '@/api/index.js'
	
	// 定义接收的职位信息对象
	const props = defineProps({
		position: {
			type: Object,
			required: true,
		},
	});

	// 方法：编辑职位
	const editJob = throttle(() => {
	uni.setStorageSync('positionData',props.position)
	 uni.navigateTo({
	 	url: '/pages/TabBar/PositionManage/PublishPosition/PublishPosition'
	 });
	}, 1000); // 限制每 1000 毫秒内只能点击一次
	

	// 方法：删除职位
	const deleteJob = () => {
		console.log("删除职位");
		// 这里可以执行删除的逻辑
	};

	// 方法：查看面试
	const viewInterview = (positionId) => {
		console.log("查看面试:(拿到id)",positionId);
		
	};
</script>

<style scoped>
	/* 外层容器样式 */
	.job-detail {
		padding: 40rpx;
		background-color: #f9f9f9;
	}

	/* 职位名称 */
	.job-title {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	/* 薪资展示 */
	.job-salary {
		margin-bottom: 20rpx;
	}

	/* 标签文字样式 */
	.label {
		font-weight: bold;
		color: #333;
	}

	/* 内容文字样式 */
	.value {
		color: #666;
	}

	/* 按钮组样式 */
	.action-buttons {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-between; /* 按钮间隔 */
		flex-wrap: wrap; /* 在小屏幕下按钮换行 */
	}

	/* 按钮基础样式 */
	.action-btn {
		width: 170rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 4px;
		font-size: 25rpx;
		cursor: pointer;
		text-align: center;
	}

	/* 编辑按钮样式 */
	.edit-btn {
		background-color: #007aff;
		color: white;
		border: none;
	}

	/* 删除按钮样式 */
	.delete-btn {
		background-color: #ff3b30;
		color: white;
		border: none;
	}

	/* 查看面试按钮样式 */
	.interview-btn {
		background-color: #34c759;
		color: white;
		border: none;
	}

	/* 按钮的悬停效果 */
	.action-btn:hover {
		opacity: 0.8;
	}
</style>
