import { request } from '@/utils/request.js'

//获取历史聊天记录
export function getHistoryMessage(user1Id,user2Id) {
	return request({
		url:`/chat/history/${user1Id}/company/${user2Id}/jobseeker`,
		method:'GET'
	})
}

//获取跟哪些求职者聊天过了  
export function getUserList() {
	return request({
		url:'/chat/getUser',
		method:'GET'
	})
}



//验证码接口
export function sendSMSCode(data) {
	return request({
		url: '/code/send',
		data
	})
} 


// 发送消息接口
export function sendMessage(data) {
  return request({
    url: '/chat/send', // 假设后端接口路径
    method: 'POST',
    data
  })
}

// 获取历史聊天记录接口
export function getChatHistory(userId, receiverId) {
  return request({
    url: `/chat/history/${userId}/company/${receiverId}/jobseeker`,
    method: 'GET'
  })
}

//获取网站信息   /admin/overall/getWebsiteInfo  
export function getWebsiteInfo() {
	return request({
		url:'/admin/overall/getWebsiteInfo',
		method:'GET'
		
	})
}


//公司注册接口
export function postRegister(data) {
	return request({
		url: '/company/register',
		method:'POST',
		data
	})
}


//公司登录接口  /company/login 
export function postLogin(data) {
	return request({
		url: '/company/login',
		method:'POST',
		data
	})
}

//查询公司信息
export function getCompanyInfo() {
	return request({
		url: '/company/info',
		method:'GET'
	})
}

//修改密码    /company/updatePassword
export function updatePassword(data) {
	return request({
		url: '/company/updatePassword',
		method:'POST',
		data
	})
}

//修改公司信息  /company/update  
export function updateCompanyInfo(data) {
	return request({
		url: '/company/update',
		method:'POST',
		data
	})
}

//退出登录   /company/logout
export function loginCompanyOut() {
	return request({
		url: '/company/logout',
		method:'POST'
	})
}



//获取所有职位  分待审核  已通过  已驳回
export  function getPositionList() {
	return request({
		url: '/position/list',
		method: 'GET'
	})
}

//发布职位   /position/publish 
export function publishPosition(data) {
	return request({
		url: '/position/publish' ,
		method:'POST',
		data
	})
}

//修改职位   /position/update
export function updatehPosition(data) {
	return request({
		url: '/position/update' ,
		method:'PUT',
		data
	})
}

//删除职位  /position/delete
export function deletePosition(positionId) {
	return request({
		url: '/position/delete/' + positionId,
		method:'DELETE'
	})
}




//根据职位id查询这个职位面试记录  /company/interview/list/{positionId}
export function getPositionInterView(positionId) {
	return request({
		url: '/company/interview/list/' + positionId ,
		method:'GET'
	})
}