import { request } from "@/utils/request";

//验证码接口
export function sendSMSCode(data) {
	return request({
		url: '/code/send',
		data
	})
} 
//注册接口
export function userRegister(data) {
	return request({
		url:'/jobseeker/register',
		method:'POST',
		data,
	})
}

//登录接口  
export function userLogin(data) {
	return request({
		url:'/jobseeker/login',
		method:'POST',
		data,
	})
}

//获取用户信息
export function getUserInfo(data) {
	return request({
		url:'/jobseeker/info',
		data
	})
}


//更新用户信息  /jobseeker/update
export function updateUserInfo(data) {
	return request({
		url:'/jobseeker/update',
		method:'POST',
		data
	})
}

//获取所有面试接口  /jobseeker/interview/list
export function getUserInterViewList() {
	return request({
		url:'/jobseeker/interview/list',
	})
}


//密码修改接口
export function updateUserPassword(data) {
	return request({
		url:'/jobseeker/updatePassword',
		method:'PUT',
		data
	})
}


//用户退出登录接口
export function userLoginOut() {
	return request({
		url:'/jobseeker/logout',
		method:'POST'
	})
}

//首页轮播图接口  /admin/overall/getJobseekerCarousels
export function getCarousels() {
	return request({
		url:'/admin/overall/getJobseekerCarousels',
		method:'GET'
	})
}


//获取网站信息   /admin/overall/getWebsiteInfo  
export function getWebsiteInfo() {
	return request({
		url:'/admin/overall/getWebsiteInfo',
		method:'GET'
		
	})
}



//首页职位展示接口   /jobseeker/recommendations
export function getPositionList(data) {
	return request({
		url:'/jobseeker/recommendations',
		method:'POST',
		data
	})
}


//用户新建简历  /resume/publish
export function publicResume(data) {
	return request({
		url:'/resume/publish',
		method:'POST',
		data
	})
}

//用户获取所有的简历  /resume/list
export function getResumeList() {
	return request({
		url:'/resume/list'
	})
}

//更新简历  /resume/update
export function updateResume(data) {
	return request({
		url:'/resume/update',
		method:'POST',
		data
	})
}

//删除简历 /resume/delete/{resumeId}
export function deleteResume(resumeId) {
	return request({
		url:'/resume/delete/' + resumeId,
		method:'DELETE',
		
	})
}


//预约面试接口  
export function commitInterView(data) {
	return request({
		url: '/interview/addInterview',
		method:'POST',
		data
	})
}


//查看用户是否已经投递过这个职位  /jobseeker/interview/check/{positionId}
export function isCommit(positionId) {
	return request({
		url: '/jobseeker/interview/check/' + positionId,
		method:'get',
	})
}

