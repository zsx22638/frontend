const Base_url = "http://localhost:8080"

export function request(config={}) {
	let {
		url,
		method='GET',
		header,
		data
	} = config
	url = Base_url + url
	const token = uni.getStorageSync('token')//这里已经确定有了
	return new Promise((resolve,reject) => {
		uni.request({
			url,
			method,
			data,
			header: {
				'Authorization':  token,
				...header,
			},
			success: (res) => {
				// console.log('工具封装：',res)
				if(res.statusCode == 200) {
					console.log('工具类测试打印',res)
					resolve(res.data)
				}
				
			},
			fail: (err) => {
				console.log('错误请求:',err)
				reject(err)
			}
			
		})
	})
}