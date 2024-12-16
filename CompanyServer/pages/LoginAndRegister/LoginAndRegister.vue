<template>
	<view class="login-box" :style="{ height: containerHeight }">
		<up-toast ref="uToastRef"></up-toast>
		
		<view class="webInfo">
			<view class="title">{{webInfo.welcomeMessage}}</view>
			<up-avatar :src="webInfo.logoUrl" size="150rpx"></up-avatar>
		</view>
		
		<view class="inner-box">
		
	
			<up-form v-if="isShow" class="fromInput" :model="LoginData">

				<up-form-item prop="identifier">
					<up-input placeholder="请输入用户名或邮箱" prefixIcon="account" v-model="LoginData.identifier"
						prefixIconStyle="font-size: 22px; color: #999999" />
				</up-form-item>

				<up-form-item>
					<up-input placeholder="请输入密码" prefixIcon="lock" v-model="LoginData.password"
						prefixIconStyle="font-size: 22px; color: #999999" :password="isVisible" @focus="pwdFocus"
						@blur="pwdBlur" />
				</up-form-item>

				<view class="btn">
					<up-button type="primary" text="登录" @click="login" class="loginBtn"></up-button>
					<view><up-icon name="arrow-rightward" label="去注册" @click="changeShow"></up-icon></view>
				</view>

			</up-form>

			<!-- 注册 -->
			<up-form v-else class="fromInput" :model="registerData">

				<up-form-item>
					<up-input placeholder="请输入用户名" prefixIcon="account" v-model="registerData.username"
						prefixIconStyle="font-size: 22px; color: #999999" />
				</up-form-item>

				<up-form-item>
					<up-input placeholder="请输入邮箱" prefixIcon="email" v-model="registerData.email"
						prefixIconStyle="font-size: 22px; color: #999999" />
				</up-form-item>

				<up-form-item>
					<up-input placeholder="请输入密码" prefixIcon="lock" v-model="registerData.password"
						prefixIconStyle="font-size: 22px; color: #999999" :password="isVisible" @focus="pwdFocus"
						@blur="pwdBlur" />
				</up-form-item>

				<up-form-item>
					<up-input placeholder="请输入验证码" v-model="registerData.smsCode">
						<template #suffix>
							<up-code ref="uCodeRef" @change="codeChange" :seconds="seconds" changeText="X秒重新获取"
								@end="end"></up-code>
							<view style="width: 150rpx;color: $uni-color-primary;">
								<up-button class="custom-style" @tap="getCode" :text="tips" type="success" size="mini"
									:disabled="btnFlag"></up-button>
							</view>
						</template>
					</up-input>
				</up-form-item>

				<view class="btn">
					<up-button type="primary" :plain="true" text="注册" @click="register"></up-button>
					<view><up-icon name="arrow-leftward" label="去登录" @click="changeShow"></up-icon></view>
				</view>
			</up-form>



		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue';
	import {
		test
	} from "uview-plus"
	import {
		useToast
	} from '@/utils/Toast.js';
	import {
		postRegister,
		sendSMSCode,
		postLogin,
		getWebsiteInfo
	} from '@/api/index.js';
	import { useCompanyStore } from '@/stores/companyInfo/index.js'
	const companyStore = useCompanyStore();
	
	
	onMounted(() => {
		getWebInfoData()
	})
	
	// 使用封装的 Toast
	const {
		uToastRef,
		showToast
	} = useToast();

	const containerHeight = ref('');
	// 获取系统信息
	const systemInfo = uni.getSystemInfoSync();
	const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
	const navbarHeight = 50; // 假设导航栏高度为 50rpx
	// 计算容器高度
	containerHeight.value = `calc(100vh - ${statusBarHeight + navbarHeight}px)`;

	const isShow = ref(true)
	const LoginData = reactive({
		identifier: "company",
		password: "47586988"
	})
	
	
	const webInfo = reactive({})
	
	const getWebInfoData = async () => {
	  const res = await getWebsiteInfo()
	  if (res.code === 200) {
	    Object.assign(webInfo, res.data) // 更新 webInfo 的内容
	    console.log('获取的数据：', webInfo)
	  }
	}

	//注册逻辑
	const registerData = reactive({
		username: '',
		email: 'zsx1469739472@gmail.com',
		smsCode: '',
		password: ''
	})
	const isVisible = ref(true)
	

	//密码框处理
	const pwdFocus = () => {
		isVisible.value = false
	}
	const pwdBlur = () => {
		isVisible.value = true
	}



	// 验证码发送逻辑
	const tips = ref('');
	const seconds = ref(10); //倒计时秒数
	const uCodeRef = ref(null);

	//更新按钮里面的文本
	const codeChange = (text) => {
		tips.value = text;
	};

	//按钮状态
	const btnFlag = ref(false)
	//获取验证码
	const getCode = async () => {
		if (uCodeRef.value.canGetCode) {
			const data = {
				'email': registerData.email
			}

			uni.showLoading({
				title: '正在获取验证码',
			});

			btnFlag.value = true
			let res = await sendSMSCode(data)
			console.log(res)
			if (res.code === 200) {
				// 这里此提示会被start()方法中的提示覆盖
				showToast({
					type: 'success',
					message: '验证码已发送',
					duration: 1000
				})
			}


			uni.hideLoading();
			// 通知验证码组件内部开始倒计时
			uCodeRef.value.start();

		}
	};
	//结束之后取消按钮禁
	const end = () => {
		btnFlag.value = false
	};

	//注册方法
	const register = async () => {
		//数据校验函数
		if (FromDataValidRegister()) {
			let res = await postRegister(registerData)
			console.log('注册状态：', res)
			if (res.code === 200) {
				//切换到登录界面登录
				changeShow()
			} else {
				showToast({
					type: 'error',
					message: '注册失败'
				})
			}
		}

	}

	//注册表单验证函数
	const FromDataValidRegister = () => {

		if (test.isEmpty(registerData.username)) {
			showToast({
				type: 'error',
				message: '用户名不能为空',
				duration: 1000
			})
			return false;
		}

		if (!test.rangeLength(registerData.username, [4, 20])) {
			showToast({
				type: 'error',
				message: '用户名长度需要在4-20位',
				duration: 1000
			})
			return false;
		}

		if (test.isEmpty(registerData.email)) {
			showToast({
				type: 'error',
				message: '邮箱不能为空',
				duration: 1000
			})
			return false;
		}

		if (!test.email(registerData.email)) {
			showToast({
				type: 'error',
				message: '邮箱格式不对',
				duration: 1000
			})
			return false;
		}

		if (test.empty(registerData.password)) {
			showToast({
				type: 'error',
				message: '密码不能为空',
				duration: 1000
			})
			return false;
		}

		if (registerData.password.length < 6) {
			showToast({
				type: 'error',
				message: '密码至少为6位',
				duration: 1000
			})
			return false;
		}

		if (registerData.smsCode.length != 6) {
			showToast({
				type: 'error',
				message: '验证码须位6位',
				duration: 1000
			})
			return false;
		}
		return true;
	}

	//登录方法
	const login = async () => {
		
		if(FromDataValidLogin()) {
			let res = await postLogin(LoginData)
			console.log('登录信息：',res)
			if (res.code === 200) {
				uni.switchTab({
					url: "/pages/TabBar/Mine/Mine"
				})
				
				uni.setStorageSync('token', res.data)
				companyStore.fetchCompanyInfo()
				uni.$u.toast('登录成功')
			}
		}
		
	}
	
	const FromDataValidLogin = () => {
		
		if(test.isEmpty(LoginData.identifier)) {
			showToast({
				type: 'error',
				message: '账号不能为空',
				duration: 1000
			})
			return false;
		}
		
		if(!test.rangeLength(LoginData.identifier,[4,20])){
			showToast({
				type: 'error',
				message: '账号长度需要在4-20',
				duration: 1000
			})
			return false;
		}
		
		
		if(test.isEmpty(LoginData.password)) {
			showToast({
				type: 'error',
				message: '密码不能为空',
				duration: 1000
			})
			return false;
		}
		
		
		if (LoginData.password.length < 6) {
			showToast({
				type: 'error',
				message: '密码至少为6位',
				duration: 1000
			})
			return false;
		}
		
		
		return true;
	}


	//登录和注册界面的切换
	const changeShow = () => {
		isShow.value = !isShow.value
	}
	
</script>

<style lang="scss" scoped>
	.login-box {
		background-repeat: no-repeat;
		background-size: cover;
		padding: 20rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap:200rpx;

		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		height: 100vh;
		/* 父容器高度 */
		
		.webInfo {
			display: flex;
			flex-direction: column;
			gap: 100rpx;
			align-items: center;
			.title {
				font-size: 48rpx;
				color: #4982fc;
			}
		}
	}

	.inner-box {
		background-color: white;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		/* 减少间距以适应空间 */
		justify-content: center;
		align-items: center;
		width: 80%;
		padding: 20rpx;
		border-radius: 20rpx;
		/* 使内容盒子填满父容器 */
		text-align: center;
		 box-shadow: 1px 1px 1px 1px #b8b8b8;
		
	}

	// 表单输入区域
	.fromInput {
		display: flex;
		flex-direction: column;
		/* 减少间距以适应空间 */
	}

	// 按钮区域
	.btn {
		display: flex;
		gap: 20rpx;
		flex-direction: column;
		/* 减少间距以适应空间 */
	}

	.loginBtn {
		background: linear-gradient(135deg, #8d42cb, #4982fc);
		/* 渐变背景色 */
		color: #fff;
		/* 字体颜色 */
		font-size: 1rem;
		/* 字体大小 */
		font-weight: bold;
		/* 加粗 */
		border: none;
		/* 去除边框 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		/* 阴影效果 */
		transition: all 0.3s ease;
		/* 动画过渡效果 */
	}

	.custom-style {
		background-color: $uni-color-primary;
		border-radius: 50rpx;
	}
</style>