<template>
	<view class="form-container">
		<text class="title">公司信息更新</text>

		<form>

			<!-- 公司头像修改 -->
			<view class="form-group">
				<text class="label">公司头像</text>

			</view>

			<!-- 公司名称 -->
			<view class="form-group">
				<text class="label">公司名称</text>
				<input class="input" v-model="companyForm.companyName" placeholder="请输入公司名称" />
			</view>

			<!-- 用户名 -->
			<view class="form-group">
				<text class="label">用户名</text>
				<input class="input" v-model="companyForm.companyUsername" placeholder="请输入用户名" />
			</view>

			<!-- 邮箱 -->
			<view class="form-group">
				<text class="label">公司邮箱</text>
				<input class="input" v-model="companyForm.companyEmail" type="email" placeholder="请输入邮箱" />
			</view>

			<!-- 手机号 -->
			<view class="form-group">
				<text class="label">公司电话</text>
				<input class="input" v-model="companyForm.companyPhone" type="tel" placeholder="请输入公司电话" />
			</view>

			<!-- 公司许可证 -->
			<view class="form-group">
				<text class="label">公司许可证</text>

			</view>


			<!-- 公司地址 -->
			<view class="form-group">
				<text class="label">公司地址</text>
				<input class="input" v-model="companyForm.companyLocation" placeholder="请输入公司地址" />
			</view>

			<!-- 公司规模 -->
			<view class="form-group">
				<text class="label">公司规模</text>
				<picker class="picker" :value="scaleIndex" :range="scaleOptions" @change="handleScaleChange">
					<view class="picker-text">{{ companyForm.companyScale || '请选择公司规模' }}</view>
				</picker>
			</view>


			<!-- 公司地址 -->
			<view class="form-group">
				<text class="label">公司地址</text>
				<input class="input" v-model="companyForm.companyDescription" placeholder="请输入公司描述信息:" />
			</view>

			<!-- 按钮组 -->
			<view class="button-group">
				<button type="submit" class="btn submit" @click="handleSubmit">提交</button>
				<button type="button" class="btn reset" @click="handleReset">重置</button>
			</view>
		</form>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		updateCompanyInfo
	} from '@/api/index.js';
	import {
		useCompanyStore
	} from '@/stores/companyInfo';

	const companyStore = useCompanyStore();

	// 表单数据（初始化为仓库数据）
	const companyForm = reactive({
		companyId: companyStore.companyId || null,
		companyName: companyStore.companyName || '',
		companyUsername: companyStore.companyUsername || '',
		companyEmail: companyStore.companyEmail || '',
		companyPhone: companyStore.companyPhone || '',
		companyLicense: companyStore.companyLicense || '',
		companyAvatar: companyStore.companyAvatar || '',
		companyLocation: companyStore.companyLocation || '',
		companyScale: companyStore.companyScale || '',
		companyDescription: companyStore.companyDescription || '',
	});



	// 公司规模选项
	const scaleOptions = ['10人以下', '10-50人', '50-200人', '200-500人', '500人以上'];
	const scaleIndex = ref(scaleOptions.indexOf(companyForm.companyScale));

	// 处理公司规模选择
	const handleScaleChange = (event) => {
		scaleIndex.value = event.detail.value;
		companyForm.companyScale = scaleOptions[scaleIndex.value];
	};

	// 提交表单
	const handleSubmit = async () => {
		console.log('提交之前的数据：', companyForm)
		try {
			const response = await updateCompanyInfo(companyForm);
			console.log('更新成功:', response);

			// 更新仓库数据
			companyStore.setCompanyInfo(companyForm);
			uni.showToast({
				title: '公司信息更新成功',
				icon: 'success'
			});
		} catch (error) {
			console.error('更新失败:', error);
			uni.showToast({
				title: '更新失败，请稍后再试',
				icon: 'none'
			});
		}
	};

	// 重置表单
	const handleReset = () => {
		// 遍历 companyForm 的每个字段，将其重置为 companyStore 的初始值
		Object.keys(companyForm).forEach((key) => {
			companyForm[key] = companyStore[key] || '';
		});

		// 更新公司规模选项的索引
		scaleIndex.value = scaleOptions.indexOf(companyStore.companyScale);

		// 提示用户表单已重置
		uni.showToast({
			title: '表单已重置',
			icon: 'none'
		});
	};
</script>


<style scoped>
	/* 页面容器 */
	.form-container {
		padding: 20rpx;
		background-color: #f9f9f9;
	}

	/* 标题 */
	.title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20rpx;
		color: #333;
	}

	/* 表单组 */
	.form-group {
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: column;
	}

	/* 表单标签 */
	.label {
		font-size: 28rpx;
		color: #555;
		margin-bottom: 10rpx;
	}

	/* 表单输入框 */
	.input {
		font-size: 28rpx;
		padding: 10rpx;
		border: 1px solid #ddd;
		border-radius: 8rpx;
		background-color: #fff;
		color: #333;
	}

	/* 按钮组 */
	.button-group {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	/* 按钮样式 */
	.btn {
		flex: 1;
		padding: 16rpx;
		font-size: 28rpx;
		text-align: center;
		border-radius: 8rpx;
		border: none;
		margin-right: 10rpx;
		color: #fff;
	}

	/* 提交按钮 */
	.submit {
		background-color: #4caf50;
	}

	/* 重置按钮 */
	.reset {
		background-color: #f44336;
	}

	/* 取消最后一个按钮的右边距 */
	.button-group .btn:last-child {
		margin-right: 0;
	}
</style>