<template>
	<view class="container">
			<form>
				<view class="field">
					<view>旧密码：</view>
					<input :type="showOldPassword ? 'text' : 'password'" class="input" v-model="pwdData.oldPassword" placeholder="请输入旧密码" />
					<view class="eye-icon" @click="toggleShowOldPassword">{{ showOldPassword ? '🙈' : '👁️' }}</view>
				</view>
				
				<view class="field">
					<view>新密码：</view>
					<input :type="showNewPassword ? 'text' : 'password'" class="input" v-model="pwdData.newPassword" placeholder="请输入新密码" />
					<view class="eye-icon" @click="toggleShowNewPassword">{{ showNewPassword ? '🙈' : '👁️' }}</view>
				</view>
				
				<view class="field">
					<view>重复密码：</view>
					<input :type="showConfirmPassword ? 'text' : 'password'" class="input" v-model="pwdData.confirmPassword" placeholder="请再次输入新密码" />
					<view class="eye-icon" @click="toggleShowConfirmPassword">{{ showConfirmPassword ? '🙈' : '👁️' }}</view>
				</view>
				
				<view class="btn">
					<button type="submit" class="submit" @click="submit">确认修改</button>
					<button type="button" class="clear" @click="clear">清空</button>
				</view>
				
			</form>
		</view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { updatePassword } from '@/api/index.js';
import { useCompanyStore } from '@/stores/companyInfo/index.js';
	
const companyStore = useCompanyStore();



// 表单数据
const pwdData = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: ""
});

// 控制密码显示状态的变量
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// 切换密码显示状态的方法
const toggleShowOldPassword = () => showOldPassword.value = !showOldPassword.value;
const toggleShowNewPassword = () => showNewPassword.value = !showNewPassword.value;
const toggleShowConfirmPassword = () => showConfirmPassword.value = !showConfirmPassword.value;

const submit = async () => {
	// 基本校验
	if (!pwdData.oldPassword || !pwdData.newPassword || !pwdData.confirmPassword) {
		uni.$u.toast("所有字段都必须填写");
		return;
	}
	if (pwdData.newPassword !== pwdData.confirmPassword) {
		uni.$u.toast("新密码和确认密码不一致");
		return;
	}
	
	if(pwdData.newPassword.length < 8 || pwdData.ConfirmPassword.length < 8){
		console.log('11')
		uni.$u.toast("密码长度不能少于8位");
		return;
	}
	// console.log('提交方法')
	try {
		const res = await updatePassword({
			oldPassword: pwdData.oldPassword,
			newPassword: pwdData.newPassword,
			confirmPassword: pwdData.confirmPassword
		});
		console.log(res)
		if (res.code == 200) {
			uni.$u.toast('修改成功');
			companyStore.clearCompanyInfo();
			uni.$u.toast('退出成功');
			uni.redirectTo({
				url:"/pages/LoginAndRegister/LoginAndRegister"
			})
			uni.clearStorageSync();
		} else {
			uni.$u.toast('修改失败');
		}
	} catch (error) {
		uni.$u.toast('请求失败，请稍后再试');
		console.error("Error updating password:", error);
	}
};

const clear =  () => {
	pwdData.confirmPassword = ''
	pwdData.newPassword = ''
	pwdData.oldPassword = ''
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	padding: 20px;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.field {
	display: flex;
	align-items: center;
	margin-bottom: 15px;

}

.input {
	width: 320rpx;
	padding: 12px 15px;
	border: 1px solid #ddd;
	border-radius: 8px;
	background-color: #fff;
	font-size: 16px;
	color: #333;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.eye-icon {
	margin-left: 10rpx;
	font-size: 20px;
	color: #007aff;
	cursor: pointer;
}

.btn {
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
}

.submit, .clear {
	width: 300rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 18px;
	text-align: center;
	border-radius: 8px;
}

.submit {
	background-color: #007aff;
	color: #fff;
	box-shadow: 0px 4px 6px rgba(0, 122, 255, 0.3);
}

.submit:active {
	background-color: #005bb5;
}

.clear {
	background-color: transparent;
	border: 2px solid #007aff;
	color: #007aff;
	box-shadow: 0px 4px 6px rgba(0, 122, 255, 0.2);
}

.clear:active {
	background-color: #e3e3e3;
}
</style>
