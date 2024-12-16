<template>
	<view class="container">
		<view class="header">
			<image :src="item.companyAvatar || defaultAvatar" class="avatar"></image>
			<text class="company-name">{{ item.companyName }}</text>
		</view>
		<view class="info">
			<text class="info-item">
				<text class="icon">🏢</text> 公司介绍：{{ item.companyDescription || '暂无介绍' }}
			</text>
			<text class="info-item">
				<text class="icon">📍</text> 公司地址：{{ item.companyLocation || '暂无地址' }}
			</text>
			<text class="info-item">
				<text class="icon">📧</text> 公司邮箱：{{ item.companyEmail }}
			</text>
			<text class="info-item">
				<text class="icon">📞</text> 公司电话：{{ item.companyPhone }}
			</text>
			<text class="info-item">
				<text class="icon">👥</text> 公司规模：{{ item.companyScale }}
			</text>
			<text class="info-item">
				<text class="icon">📄</text> 职位名称：{{ item.positionName }}
			</text>
			<text class="info-item">
				<text class="icon">💰</text> 职位薪资：{{ item.positionSalary }}元
			</text>
			<text class="info-item">
				<text class="icon">📅</text> 面试时间：{{ formattedInterviewTime }}
			</text>
			<text class="info-item">
				<text class="icon">📌</text> 面试地点：{{ item.interviewAddress }}
			</text>
			<text class="info-item">
				<text class="icon">🔧</text> 技能要求：{{ item.positionSkills }}
			</text>
			<text class="info-item">
				<text class="icon">📝</text> 职位描述：{{ item.positionDescription }}
			</text>
			<text class="info-item">
				<text class="icon">📊</text> 面试状态：<text :class="statusClass">{{ interviewStatusText }}</text>
			</text>
		</view>
	</view>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 默认头像
const defaultAvatar = "https://example.com/default-avatar.png"

// 响应式数据
const item = reactive({})

onLoad((options) => {
	// 解析传递的 JSON 数据
	Object.assign(item, JSON.parse(options.item))
})

// 格式化面试时间
const formattedInterviewTime = computed(() => item.interviewTime.split("T")[0])

// 面试状态文本
const interviewStatusText = computed(() => {
	switch (item.interviewStatus) {
		case 0: return '待审核'
		case 1: return '已通过'
		case 2: return '已拒绝'
		default: return '未知状态'
	}
})

// 状态文本样式
const statusClass = computed(() => {
	return item.interviewStatus === 1 ? 'status-pass' :
		item.interviewStatus === 2 ? 'status-rejected' : 'status-pending'
})
</script>

<style>
.container {
	padding: 20rpx;
	font-family: Arial, sans-serif;
	color: #333;
}

.header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin-right: 20rpx;
}

.company-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #007BFF;
}

.info {
	font-size: 28rpx;
	color: #555;
	line-height: 40rpx;
}

.info-item {
	margin-bottom: 10rpx;
	display: flex;
	align-items: center;
}

.icon {
	font-size: 30rpx;
	color: #007BFF;
	margin-right: 10rpx;
}

.status-pass {
	color: green;
}

.status-rejected {
	color: red;
}

.status-pending {
	color: gray;
}
</style>
