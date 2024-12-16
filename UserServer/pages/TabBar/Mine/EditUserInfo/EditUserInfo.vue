<template>
  <view class="form-container">
    <!-- 表单开始 -->
    <up-form  :model="userInfo" :rules="rules" ref="formRef" labelPosition="left"  labelWidth="150rpx">
      
      <!-- 头像字段 -->
      <up-form-item label="头像" prop="userAvatar">
        <u-avatar :src="userInfo.userAvatar"  @click="chooseAvatar" />
      </up-form-item>
      

        <!-- 邮箱（展示不可编辑） -->
         <up-form-item label="邮箱" prop="userEmail">
           <view class="display-only">{{ userInfo.userEmail }}</view>
         </up-form-item>
   
         <!-- 用户名（展示不可编辑） -->
         <up-form-item label="用户名" prop="userName">
           <view class="display-only">{{ userInfo.userName }}</view>
         </up-form-item>
		 
		   <!-- 使用 v-for 循环简化表单项 -->
		   <up-form-item 
		     v-for="(item, index) in formItems" 
		     :key="index" 
		     :label="item.label" 
		     :prop="item.prop"
		   >
		     <up-input 
		       v-model="userInfo[item.prop]" 
		       :placeholder="item.placeholder" 
		       border="none" 
		       :style="[inputStyle, isFocused[item.index] ? activeStyle : {}]"
		       :clearable="true"
		       @focus="handleFocus(item.index)"
		       @blur="handleBlur(item.index)"
		     />
		   </up-form-item>

			<up-form-item label="性别" prop="userSex" @click="chooseSex">
			  <up-input
			    v-model="userInfo.userSex"
			    placeholder="请选择性别"
			    border="none"
			    readonly
			  />
			  <template #right>
			    <up-icon name="arrow-right"  color="#007aff"/>
			  </template>
			</up-form-item>
			
    </up-form>

    <!-- 按钮组 -->
    <view class="button-group">
      <button @click="submitForm" class="submit-btn">保存修改</button>
      <button @click="clearForm" class="reset-btn">重置表单</button>
    </view>
	
	    <!-- 性别选择 ActionSheet -->
	    <up-action-sheet :actions="list" :title="title" :show="show" @close="show = false" @select="onSexSelect" />
	
	  
		
		
  </view>
</template>



<script setup>
import { ref } from 'vue';
import { userInfoStore } from '@/stores/useInfoStore.js';
import { getUserInfo, updateUserInfo } from '@/api/index.js'
const { setInfo, clearInfo, setAvatar,userInfo } = userInfoStore();
  const formRef = ref(null);




// 表单项定义数组
const formItems = ref([
  { index: 0 , label: '姓名', prop: 'userFullName', placeholder: '请输入姓名' },
  { index: 1 , label: '城市', prop: 'userCity', placeholder: '请输入城市' },
  { index: 2 , label: '手机号码', prop: 'userPhone', placeholder: '请输入手机号码' },
]);

// 表单验证规则
const rules = {
  userFullName: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { min: 2, message: '姓名长度不能少于2个字符', trigger: 'blur' },
  ],
  userPhone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  userCity: [
    { required: true, message: '城市不能为空', trigger: 'blur' },
    { min: 2, message: '城市名称不能少于2个字符', trigger: 'blur' },
  ],
  userSex: [
    { required: true, message: '性别不能为空' },
  ]
};

// 性别选项列表
const list = ref([
  { name: '男', value: '男' },
  { name: '女', value: '女' },
]);

// 标题
const title = ref('请选择性别');

// 控制 ActionSheet 显示
const show = ref(false);

// 选择性别方法
const chooseSex = () => {
  show.value = true; // 打开 ActionSheet
};

// 处理性别选择
const onSexSelect = (item) => {
  userInfo.userSex = item.value; // 更新选中的性别
  show.value = false; // 关闭 ActionSheet
};

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
	  let oldFileName = '';
	  if(userInfo.userAvatar){
		  // 设定旧文件名，这里可以根据实际情况获取
		  oldFileName = userInfo.userAvatar.split('/').pop(); // 假设现有头像路径包含文件名
		  console.log("选择的图片路径:", tempFilePath,'-------',oldFileName);
		  // 上传图片到服务器
		  
	  }
    uploadAvatar(tempFilePath, oldFileName);
     
    },
  });
};


// 上传图片到服务器并更新头像
const uploadAvatar = (filePath, oldFileName) => {
  const token = uni.getStorageSync('token'); // 确保 token 存在
  const formData = {};

  // 如果 oldFileName 存在，添加到 formData
  if (oldFileName) {
    formData.oldFileName = oldFileName;
  }

  uni.uploadFile({
    url: 'http://localhost:8080/oss/upload/file', // 替换为实际的图片上传接口
    filePath: filePath,
    name: 'file',
    header: {
      'Authorization': token,
    },
    formData, // 根据条件设置 formData
    success: (uploadRes) => {
		console.log(uploadRes)
      const data = JSON.parse(uploadRes.data);
	  
      if (data.code == 200) {
		  console.log(data)
		  console.log('头像url：',data.data.fileUrl)
		  setAvatar(data.data.fileUrl)
        submitForm(); // 上传成功后提交表单
      } else {
        uni.showToast({ title: '图片上传失败', icon: 'none' });
      }
    },
    fail: () => {
      uni.showToast({ title: '图片上传失败', icon: 'none' });
    },
  });
};
;







// 提交表单
const submitForm = async () => {
  try {
    const valid = await formRef.value.validate(); // 使用 await 等待表单验证结果
    if (valid) {
      // console.log('校验通过', userInfo);
	 
      let res = await updateUserInfo(userInfo); // 更新用户信息
      console.log('更新结果：', res);
	  uni.showToast({
	  	title:'修改成功！',
		icon:'success'
	  })
    } else {
      console.log('校验失败');
    }
  } catch (error) {
    console.log('校验失败', error);
  }
};


// 重置表单
const clearForm = () => {
	userInfo.userCity = ''
	userInfo.userFullName = ''
	userInfo.userPhone = ''
	userInfo.userSex = ''
};

const inputStyle = ref({
  height:'60rpx',
  paddingLeft:'20rpx',
  border: '1px solid #ccc', // 默认边框
  borderRadius: '5rpx',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
});

const activeStyle = ref({
	border: '1px solid #007aff', // 聚焦时边框颜色
})

const isFocused = ref([false, false, false, false]); // 对应每个表单项的焦点状态

const handleFocus = (index) => {
	isFocused.value[index] = true;
  
};

const handleBlur = (index) => {
	isFocused.value[index] = false;
  
};


</script>

<style scoped lang="scss">


.form-container {
  padding: 30rpx;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

up-form-item {
  margin-bottom: 30rpx;
}

label {
  font-size: 28rpx;
  color: #333;
}

input {
  border: 1px solid #ccc;
  border-radius: 5rpx;
  padding: 15rpx;
  font-size: 28rpx;
  width: 100%;
}

.avatar-upload {
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
}

button {
  font-size: 30rpx;
  padding: 20rpx;
  border-radius: 10rpx;
}

.display-only {
  font-size: 28rpx;
  color: #666;
  padding: 15rpx;
  border-bottom: 1px solid #ddd;
}


.button-group {
  display: flex;
  margin: 20rpx;
  gap:50rpx;
  .submit-btn {
    background-color: #007aff;
    color: #fff;
    width: 100%;
  }
  
  .reset-btn {
    background-color: #ffffff;
    color: #333;
    width: 100%;
  }
  
}
</style>

