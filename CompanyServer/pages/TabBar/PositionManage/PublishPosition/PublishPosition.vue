<template>
	<view class="container">
		<view class="title">职位发布</view>

		<form>
			<!-- 职位名称 -->
			<view class="inputPosition">
				<input v-model="positionForm.positionName" type="text" placeholder="请输入职位名称" />
			</view>

			<!-- 薪资 -->
			<view class="inputPosition">
				<input v-model="positionForm.positionSalary" type="number" placeholder="请输入薪资" />
			</view>

			<!-- 技能选择 -->
			<view class="input-item">
				<view class="label">选择技能（多选）</view>
				<scroll-view scroll-y="true">
					<checkbox-group :value="selectedSkills" @change="onSkillsChange" class="skills-scroll">
						<view v-for="(skill, index) in skillsList" :key="index" class="checkbox-item">
							<checkbox :value="skill">{{ skill }}</checkbox>
						</view>
					</checkbox-group>
				</scroll-view>
			</view>

			<!-- 职位描述 -->
			<view class="textDescription">
				<textarea v-model="positionForm.positionDescription" placeholder="请输入职位描述" />
			</view>

			<!-- 提交按钮 -->
			<view class="button-container">
				<view v-if="positionForm.positionId">
					<button type="submit" class="submit-btn" @click="updateSubmit">更新职位</button>
				</view>
				<view v-else>
					<button type="submit" class="submit-btn" @click="handleSubmit">发布职位</button>
				</view>
			</view>
		</form>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { publishPosition, updatePosition } from '@/api/index.js';
	import { useCompanyStore } from '@/stores/companyInfo/index.js';
	import { onLoad } from '@dcloudio/uni-app';
	
	// 页面加载时，获取本地存储的职位数据
	onLoad(() => {
		const storedData = uni.getStorageSync('positionData');
		uni.removeStorageSync('positionData');
		if (storedData) {
			positionForm.value = storedData;
			// 设置已选技能
			selectedSkills.value = storedData.positionSkills.split(', '); // 默认勾选已有技能
		} else {
			console.log('没有拿到职位数据');
		}
	});
	
	const companyStore = useCompanyStore();

	// 职位发布表单数据
	const positionForm = ref({
		positionId: null,
		positionName: '',
		positionSalary: '',
		positionSkills: '', // 多选技能的数组
		positionDescription: '',
		companyId: companyStore.companyId,
	});

	// 技能列表
	const skillsList = [
		'Spring Boot', 'Vue', 'Axios', 'Ant Design', 'React',
		'JavaScript', 'TypeScript', 'Node.js', 'Express', 'Kotlin',
		'Flutter', 'Django', 'FastAPI', 'Flask', 'Ruby on Rails',
		'Laravel', 'Symfony', 'ASP.NET Core', 'Android', 'iOS',
		'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL',
		'Docker', 'Kubernetes', 'Terraform', 'Git', 'Jenkins'
	];

	// 用于存储选中的技能
	const selectedSkills = ref([]);

	// 手动收集选中的技能
	const onSkillsChange = (e) => {
		console.log('选中的技能：', e.detail.value);
		selectedSkills.value = e.detail.value; // 更新选中的技能数组
		positionForm.value.positionSkills = selectedSkills.value.join(', '); // 更新职位技能
	};

	// 更新职位提交
	const updateSubmit = async () => {
		try {
			const res = await updatePosition(positionForm.value);
			if (res.code == 200) {
				uni.showToast({
					title: '职位更新成功',
					icon: 'success',
				});
				uni.switchTab({
					url: '/pages/TabBar/PositionManage/PositionManage'
				});
			} else {
				uni.showToast({
					title: '职位更新失败，请稍后再试',
					icon: 'none',
				});
			}
		} catch (error) {
			console.error('更新职位失败:', error);
			uni.showToast({
				title: '更新失败，请稍后再试',
				icon: 'none',
			});
		}
	};
	
	// 发布职位提交表单
	const handleSubmit = async () => {
		try {
			const res = await publishPosition(positionForm.value);
			if (res.code == 200) {
				uni.showToast({
					title: '职位发布成功',
					icon: 'success',
				});
				// 清空表单
				positionForm.value = {
					positionName: '',
					positionSalary: '',
					positionSkills: [],
					positionDescription: ''
				};
				
				uni.switchTab({
					url: '/pages/TabBar/PositionManage/PositionManage'
				});
			} else {
				uni.showToast({
					title: '职位发布失败，请稍后再试',
					icon: 'none',
				});
			}
		} catch (error) {
			console.error('发布职位失败:', error);
			uni.showToast({
				title: '发布失败，请稍后再试',
				icon: 'none',
			});
		}
	};
</script>

<style scoped>
	.container {
		padding: 20px;
		background-color: #f9f9f9;
	}

	.inputPosition {
		position: relative;
		border: 1px solid #ccc;
		border-radius: 4px;
		height: 70rpx;
		padding: 10px;
		background-color: #fff;
		display: flex;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		margin: 20rpx 0;
	}

	.skills-scroll {
		max-height: 400rpx;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 4px;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.checkbox-item {
		width: 280rpx;
		margin-right: 4%;
		margin-bottom: 8px;
	}

	.textDescription {
		margin: 30rpx 0;
	}

	.textDescription textarea {
		width: 100%;
		height: 300rpx;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		color: #333;
		background-color: #fff;
		resize: vertical;
		box-sizing: border-box;
	}

	.submit-btn {
		background-color: #007aff;
		color: white;
		padding: 12px 20px;
		font-size: 16px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		width: 100%;
	}

	.submit-btn:hover {
		background-color: #005bb5;
	}
</style>
