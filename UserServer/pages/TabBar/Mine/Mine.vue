<template>


	<view class="container">
		<up-toast ref="uToastRef"></up-toast>
		<view class="header">
			<up-avatar :src="userInfo.userAvatar" size="150rpx"></up-avatar>
			<view class="info" v-show="userInfo.userId > 0 ? true : false">
				<view>{{userInfo.userFullName}}</view>
				<view>{{userInfo.userCity}}/{{userInfo.userSex}}/{{userInfo.userAge}}岁</view>
			</view>
		</view>

		<view class="NavBar">
			<view class="item" @click="goTo(1)">
				<view class="iconfont-color icon iconfont icon-zhaogongzuo"></view>
				<view>岗位查询</view>
			</view>
			<view class="item" @click="goTo(2)">
				<view class="iconfont-color icon iconfont icon-_mianshijianli"></view>
				<view>我的简历</view>
			</view>
			<view class="item" @click="goTo(3)">
				<view class="iconfont-color icon iconfont icon-zaixianjianli-1"></view>
				<view>我的收藏</view>
			</view>
			<view class="item" @click="goTo(4)">
				<view class="iconfont-color icon iconfont icon-gerenziliaoxiugai"></view>
				<view>资料修改</view>
			</view>
		</view>

		<view class="showDetail">
			<up-cell-group :border="false">
				<up-cell url="/pages/TabBar/Mine/PasswordUpdate/PasswordUpdate" icon="google-circle-fill" title="账号安全"
					:isLink="true" :border="false"></up-cell>
				<up-cell url="/pages/TabBar/Mine/QualificationShow/QualificationShow" icon="checkbox-mark" title="资质公示" :isLink="true"
					:border="false"></up-cell>
				<up-cell url="/pages/TabBar/Mine/Privacy/Privacy" icon="lock" title="隐私政策" :isLink="true" :border="false"></up-cell>
				<up-cell url="pages/TabBar/Mine/EmailFeedback/EmailFeedback" icon="question-circle" title="意见反馈" :isLink="true"
					:border="false"></up-cell>
				<up-cell url="/pages/TabBar/Mine/contactOur/contactOur" icon="kefu-ermai" title="联系我们" :isLink="true"
					:border="false"></up-cell>
			</up-cell-group>

		</view>

		<button class="login_out" @click="LoginOut">退出登录</button>


	</view>

</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue';
	import {
		onMounted,
		getCurrentInstance
	} from 'vue';
	import {
		onLoad,
		onShow,
		onHide,
		onUnload
	} from '@dcloudio/uni-app';
	import {
		useToast
	} from '@/utils/Toast.js';
	// 使用封装的 Toast
	const {
		uToastRef,
		showToast
	} = useToast();
	// const instance = getCurrentInstance();
	import {
		getUserInfo,
		userLoginOut
	} from '@/api/index.js';
	import {
		userInfoStore
	} from '@/stores/useInfoStore.js'

	const {
		setInfo,
		userInfo,
		clearInfo
	} = userInfoStore()


	// 使用 onLoad 生命周期钩子
	onShow(async () => {
		let res = await getUserInfo();
		if (res.code === 200) {
			// console.log(res.data)
			// 直接将获取的用户信息对象存入 Pinia 存储
			setInfo(res.data);
		} else {
			console.log('获取用户信息失败');
		}
		console.log('用户信息:', userInfo);
	});

	//退出登录
	const LoginOut = async () => {
		let res = await userLoginOut()
		console.log(res)

		if (res.code == 200) {
			clearInfo()
			uni.$u.toast('退出成功')
			uni.redirectTo({
				url: "/pages/LoginAndRegister/LoginAndRegister"
			})
			uni.clearStorageSync()
		} else {
			uni.$u.toast('退出失败')
		}
	}

	const goTo = (index) => {
		switch(index) {
			case 1:
				uni.navigateTo({
					url: '/pages/TabBar/Home/SearchPosition/SearchPosition'
				})
				break;
			case 2:
				console.log(2)
				break;
			case 3:
				console.log(3)
				break;
			case 4:
				uni.navigateTo({
					url: '/pages/TabBar/Mine/EditUserInfo/EditUserInfo'
				})
				break;
			default:
				console.log('错误')
		}
		
	}
</script>

<style>

</style>

<style lang="scss" scoped>
	
	// ::v-deep .u-navbar__content {
	// 	// height: calc(env(safe-area-inset-top) + 88rpx); /* 使用设备顶部安全区高度加上导航栏自身高度 */
	// 	color: #fff ;
	// }
	

	
	.container {
		height: calc(100vh - 150px);
		padding: 20rpx 50rpx;
		background: linear-gradient(to bottom, rgba(0, 122, 255, 0.3) 10%, #F7F8FC 50%);

		/* 设置透明度 */
		/* 上半部分渐变，下面是白色 */
		/* 控制颜色过渡距离 */
		.header {
			display: flex;
			gap: 40rpx;

			.info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 20rpx;

				view:first-child {
					font-size: 40rpx;
				}

				&:nth-child(2) {
					font-size: 30rpx;
				}
			}
		}

		.NavBar {
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 36rpx;
			box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
			/* 更柔和的阴影效果 */
			display: flex;
			justify-content: space-between;

			.item {
				display: flex;
				align-items: center;
				gap: 8rpx;
				flex-direction: column;

				view:nth-child(2) {
					font-size: 24rpx;
				}
			}
		}

		.showDetail {
			padding: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 30rpx;
			box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
			/* 更柔和的阴影效果 */

		}

		.login_out {
			margin-top: 50rpx;
			background-color: $uni-color-primary;
			color: white;
		}

	}

	//字体图标的颜色
	.iconfont-color {
		color: $uni-color-primary;
	}
</style>