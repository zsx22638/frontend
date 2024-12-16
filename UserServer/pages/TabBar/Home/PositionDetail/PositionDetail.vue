<template>
	<view class="container">


		<view class="top">
			<view class="left">
				{{ PositionData.positionName }}
			</view>
			<view class="right">
				{{ PositionData.positionSalary }} 元
			</view>
		</view>



		<view class="hr">
			<up-avatar :src="PositionData.companyAvatar" size="100rpx"></up-avatar>
			<view class="right">
				<view class="company-item">
					<text class="icon">🏢</text>
					<view class="company-name">{{ PositionData.companyName }}</view>
				</view>
				<view class="company-item">
					<text class="icon">📍</text> {{ PositionData.companyLocation }}
				</view>
				<view class="company-item">
					<text class="icon">📞</text>
					<view class="company-phone">{{ PositionData.companyPhone }}</view>
				</view>
			</view>
			<view class="time">
				发布时间: {{ PositionData.createTime.split(' ')[0] }}
			</view>
		</view>


		<!-- 分割线 -->
		<up-line length="90%" margin="30rpx auto"></up-line>

		<view class="position">
			<view class="position-description">
				<text class="icon">📝</text>
				职位描述: {{ PositionData.positionDescription }}
			</view>


			<view class="position-skills">
				<view><text class="icon">🔧</text> 技能要求:</view>
				<view class="tags">
					<view v-for="(skill, index) in PositionData.positionSkills.split(',')" :key="index">
						<up-tag :text="skill" plain size="mini" type="primary" style="margin: 0rpx 5rpx;"></up-tag>
					</view>
				</view>
			</view>
		</view>







		<view class="title">公司信息</view>
		<view class="company-details">
			<view class="company-item">
				<text class="icon">📍</text>
				<view class="company-location">{{ PositionData.companyLocation }}</view>
			</view>
			<view class="company-item">
				<text class="icon">📞</text>
				<view class="company-phone">{{ PositionData.companyPhone }}</view>
			</view>
			<view class="company-item">
				<text class="icon">✉️</text>
				<view class="company-email">{{ PositionData.companyEmail }}</view>
			</view>
			<view class="company-item">
				<text class="icon">👥</text>
				<view class="company-scale">公司规模: {{ PositionData.companyScale }}</view>
			</view>
			<view class="company-item">
				<text class="icon">📜</text>
				<view class="company-license">{{ PositionData.companyLicense }}</view>
			</view>
		</view>

		<!-- 分割线 -->
		<up-line color="#2979ff" length="90%" margin="30rpx auto"></up-line>

		<!-- 投递按钮 -->
		<view class="apply-btn">


			<view>
				<up-button type="primary" @click="selectResume" plain>请选择你要投递的简历</up-button>
				<view class="resumeSelected">

				</view>
			</view>

			<view class="dateTime">
				<text>面试时间：</text>
				<up-datetime-picker class="picker" hasInput :show="showDate" v-model="selectTime" mode="datetime"
					@confirm="confirmDate" placeholder="请选择日期" @cancel="cancelDate"></up-datetime-picker>
			</view>

			<view>
				<up-button type="primary" @click="applyForJob">预约面试</up-button>
			</view>


		</view>

		<up-popup :show="show" mode="bottom" @close="close" @open="open" :closeable="true" :customStyle="customStyle">
			<view class="resumeSelect">
				
				<view class="head">
					<view>
						简历选择
					</view>
				</view>
				<up-radio-group v-model="interViewData.resumeId" placement="column" iconPlacement="right" class="groupResume">
					<up-radio :customStyle="customStyleRadio" v-for="(item,index) in resumeList"
						:key="item.resumeId" :label="item.targetPosition" :name="item.resumeId">
					</up-radio>
				</up-radio-group>


			</view>
		</up-popup>



	</view>





</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		onMounted,
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	import {
		getResumeList,
		isCommit,
		commitInterView
	} from '@/api/index.js';
	import {
		userInfoStore
	} from '@/stores/useInfoStore.js'

import dayjs from 'dayjs'; // 时间格式化工具
	const {
		userInfo
	} = userInfoStore()



	const resumeList = ref([]); // 使用 ref 存储简历数据



	// 获取简历列表
	const getResumeListData = async () => {
		const res = await getResumeList();
		if (res.code === 200) {
			resumeList.value = res.data; // 更新简历数据
		} else {
			uni.showToast({
				title: '简历数据获取失败',
				icon: 'none'
			});
		}
	};


	const PositionData = ref({
		companyAvatar: '',
		companyEmail: 'service@alibaba.com',
		companyId: 15,
		companyLicense: '浙ICP备12000001号',
		companyLocation: '杭州市西湖区',
		companyName: '阿里巴巴集团',
		companyPhone: '0571-85022111',
		companyScale: '25000+',
		companyUsername: 'alibaba_group',
		createTime: '2024-11-13 10:03:46',
		positionDescription: '作为HRBP，你将与公司各部门合作，推动人力资源战略。',
		positionId: 33,
		positionName: 'HRBP',
		positionSalary: 3500,
		positionSkills: '员工关系,招聘,薪酬管理',
		interviewAddress: '杭州市西湖区阿里巴巴大厦',
		interviewTime: '2024-11-14 10:00:00',
		updateTime: '2024-11-13 10:03:46',
	});

	// 格式化面试时间
	const formattedInterviewTime = ref('');

	onMounted(() => {
		const instance = getCurrentInstance().proxy;
		const eventChannel = instance.getOpenerEventChannel();

		eventChannel.on('acceptDataFromOpenerPage', function(data) {
			PositionData.value = data.data || {}; // 确保 PositionData 不为 null
		});
	});



	// 创建响应式数据  
	const show = ref(false);

	// 定义方法  
	function open() {
		// 打开逻辑，比如设置 show 为 true  
		show.value = true;
		// console.log('open');  
	}

	function close() {
		if(interViewData.resumeId == null) {
			uni.showToast({
				title:'请选择一份简历',
				icon:"error"
			})
			return;
		}
		// 关闭逻辑，设置 show 为 false  
		show.value = false;
		// console.log('close');  
	}

	
	const selectResume = async () => {
		await getResumeListData();
		console.log(resumeList.value)
		show.value = true
	}

	const customStyle = reactive({
		height: "800rpx"
	})
	const customStyleRadio = reactive({
		marginBottom: '20rpx'
	})
	
	// const radioChange = (n) => {
	// 	console.log(n)
	// }

	//时间选择器
	const showDate = ref(false);
	const selectTime = ref(new Date().getTime());
	//处理确定
	const confirmDate = (value) => {
		showDate.value = false
	}
	//处理取消
	const cancelDate = () => {
		showDate.value = false
	}
	
	
	const interViewData = reactive({
		//这个时间默认是当前时间，用户1可以选择之后的时间
		interviewTime: dayjs(selectTime.value).format('YYYY-MM-DD HH:mm'),
		positionName: PositionData.value.positionName,
		interviewAddress: PositionData.value.interviewAddress,
		positionId: PositionData.value.positionId,
		userId: userInfo.userId,
		resumeId: null
	})
	
	
	// 投递简历的方法
	const applyForJob = async () => {
		
		//校验简历是否已经选择了
		if(interViewData.resumeId == null) {
			uni.showToast({
				title:'请选择要投递简历',
				icon:'error'
			})
			return;
		}
		
		//这里判断用户是否投递过这个职位
		const result = await isCommit(PositionData.value.positionId)
		console.log(PositionData.value.positionId,result)
		if(result.data == 1){
			uni.showToast({
				title:'您已经投递过这个职位了！',
				icon:'error'
			})
			return;
		}
		
		//提交数据
		const res = await commitInterView(interViewData)
		console.log('投递情况：',res)
		if(res.code == 200) {
			uni.showToast({
				title:'投递成功',
				icon: 'success'
			})
			uni.switchTab({
				url:'/pages/TabBar/InterView/InterView'
			})
		}
		
		uni.showToast({
			title: res.message,
			icon: 'error'
		})
		
		// console.log('打印;',res)
		// console.log('投递简历');
	};
	
	
</script>

<style scoped lang="scss">
	::v-deep .u-tag__text--primary {
		font-size: 22rpx;
	}
	.container {
		padding: 30rpx;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx;

			.left {
				font-size: 48rpx;
			}

			.right {
				color: $uni-color-primary;
			}
		}

		.hr {
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			gap: 50rpx;

			.right {
				display: flex;
				flex-direction: column;
				font-size: 25rpx;

				.company-item {
					display: flex;
					align-items: center;
					gap: 5rpx;
				}
			}

			.time {
				font-size: 20rpx;
				align-self: flex-end;
				/* 将第三个元素垂直对齐到底部 */
				padding: 10rpx 0;
				color: lightslategray
			}
		}
	}

	.position {
		.position-description {
			margin-top: 30rpx;
		}

		.position-skills {
			margin-top: 30rpx;
			display: flex;
			gap: 10rpx;
		}
	}

	.title {
		margin: 30rpx;
		font-size: 35rpx;
		color: $uni-color-primary;
	}

	.company-details {
		.company-item {
			margin-top: 10rpx;
			gap: 5rpx;
			display: flex;
		}
	}

	.apply-btn {
		.dateTime {
			padding: 20rpx;
			width: 600rpx;
			display: flex;
			align-items: center;

			text {
				color: $uni-color-primary;
			}

			.picker {

				flex: 2;
			}
		}
	}

	.resumeSelect {
		padding: 30rpx;
		.head {
			margin-top: 30rpx;
			display: flex;
			justify-content: space-around;
			
		}
		.groupResume {
			padding: 50rpx;
			
		}
	}

	.icon {
		font-size: 30rpx;
		margin-right: 8rpx;
	}

	//兼容微信小程序写法
	.tags {
		display: flex;
		gap: 7rpx;
	}
</style>