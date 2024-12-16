<template>
	<view class="card_container">
		<view class="header">
			<view class="jobName">{{props.data.positionName}}</view>
			<view class="salary">{{props.data.positionSalary}}元</view>
		</view>
		<view class="company">
			<view class="name">{{props.data.companyName}}</view>
			<view class="num">{{props.data.companyScale}}人</view>
		</view>
		<view class="tags">
			
			<up-tag v-for="(item,index) in skillList" :key="index" :text="item" plain size="mini" type="primary"
				style="margin:0rpx 7rpx"></up-tag>
		</view>
		<view class="introduce">
			<view class="truncated-introduce">{{props.data.positionDescription}}</view>
			<view class="location">{{props.data.companyLocation}}</view>
		</view>
	</view>
</template>

<script setup>
	import {
		defineProps
	} from 'vue';
	// const skillList = props.data.positionSkills.split(',');
	const props = defineProps({
		data: {
			type: Object,
			required: true
		}
	});
// 使用 split 方法将 positionSkills 字符串分割成数组
const skillList = props.data.positionSkills ? props.data.positionSkills.split(',') : [];

</script>

<style scoped lang="scss">
	.card_container {
		padding: 25rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 15rpx;
		color: #7D7D7D;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.jobName {
				color: black;
				font-size: 35rpx;
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 隐藏溢出的内容 */
				text-overflow: ellipsis;
				/* 超出部分显示省略号 */
			}

			.salary {
				color: #127CF2;
				font-size: 30rpx;
				font-weight: 800;
				margin-right: 20rpx;
			}
		}

		.company {

			display: flex;
			justify-content: space-between;

			.num {
				font-size: 20rpx;
			}
		}

		//兼容微信小程序写法
		.tags {
			display: flex;
			gap: 7rpx;
		}

		.introduce {
			display: flex;
			justify-content: space-between;
			font-size: 25rpx;
			.location {
				color: black;
			}

			
		}
	}


	.truncated-introduce {
		white-space: nowrap;
		/* 不换行 */
		overflow: hidden;
		/* 隐藏溢出的文本 */
		text-overflow: ellipsis;
		/* 添加省略号 */
		width: 400rpx;
		/* 设置宽度以控制显示的长度 */
	}
</style>