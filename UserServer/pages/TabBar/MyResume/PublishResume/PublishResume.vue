<template>
  <view class="container">
    <up-form
      labelPosition="left"
      :model="resumeData"
      :rules="rules"
      ref="formRef"
      labelWidth="150rpx"
    >
      <!-- 姓名 -->
      <up-form-item label="姓名" prop="name" borderBottom>
        <up-input
          v-model="resumeData.name"
          border="none"
          placeholder="请输入姓名"
          :disabled="true" 
        ></up-input>
      </up-form-item>

      <!-- 联系方式 -->
      <up-form-item label="联系方式" prop="contact" >
        <up-input
          v-model="resumeData.contact"
          border="none"
          placeholder="请输入联系方式"
          :disabled="true"  
        ></up-input>
      </up-form-item>

      <!-- 目标职位 -->
      <up-form-item label="目标职位" prop="targetPosition" >
        <up-input
          v-model="resumeData.targetPosition"
          border="none"
          placeholder="请输入目标职位"
        ></up-input>
      </up-form-item>

      <!-- 简历描述 -->
      <up-form-item label="简历描述" prop="description" >
        <up-textarea
          v-model="resumeData.description"
          border="none"
          placeholder="请输入简历描述"
        ></up-textarea>
      </up-form-item>

      <!-- 技能 -->
      <up-form-item label="技能" prop="skills" >
        <up-input
          v-model="resumeData.skills"
          border="none"
          placeholder="请输入技能"
        ></up-input>
      </up-form-item>

      <!-- 上传文件 -->
      <up-form-item label="上传简历" prop="resumeUrl">
        <up-upload
          v-model="resumeData.resumeUrl"
          :auto-upload="false"
          accept="application/pdf"
          :multiple="false"
          :deletable="true"
          class="upload-box"
          @afterRead="handleAfterRead"
        >
          <!-- 如果没有选择文件，显示上传区域 -->
          <view v-if="!resumeData.resumeUrl" class="upload-placeholder">
            <text class="upload-text">+</text>
          </view>
          <!-- 如果文件已选择，显示文件图标或文件名 -->
          <view v-else class="file-preview">
            <image class="file-icon" src="@/static/images/pdf.png" />
          </view>
        </up-upload>
      </up-form-item>

    </up-form>

    <!-- 按钮组 -->
    <view class="button-group">
		<view v-if="resumeData.resumeId">
			<button @click="updateCommit" class="submit-btn">更新保存</button>
		</view>
		<view v-else>
			<button @click="submitForm" class="submit-btn">提交</button>
			<button @click="clearForm" class="reset-btn">重置表单</button>
		</view>
    </view>
  </view>
</template>

<script setup>
import { ref,reactive,onMounted, onUnmounted } from 'vue';
import { publicResume,updateResume } from '@/api/index.js'
import { userInfoStore } from '@/stores/useInfoStore.js'
import { onLoad } from '@dcloudio/uni-app'

const { userInfo } = userInfoStore()

const formRef = ref(null);


// 表单数据模型
const resumeData = ref({
	resumeId:null,
	name: userInfo.userFullName,  // 姓名，禁用输入
	contact: userInfo.userPhone,  // 联系方式，禁用输入
	targetPosition: '',
	description: '',
	skills: '',
	resumeUrl: '',  // 存储文件URL
	userId: userInfo.userId,
	status:0
});


onLoad(() => {
  // 获取存储的 resumeData
  const storedData = uni.getStorageSync('resumeData');
  uni.removeStorageSync('resumeData')
  if (storedData) {
    resumeData.value = storedData;
  } else {
    console.log('没有找到简历数据');
  }
});

//更新时
const updateCommit = async () => {

	uni.showLoading({
		title:'加载中...'
	})
	
	  // 修改 resumeData 的 status 或其他字段
	  resumeData.value.status = 0;
	  console.log('更新之后的数据：', resumeData.value);
	
	const res = await updateResume(resumeData.value)
	uni.hideLoading()
	if(res.code == 200) {
		
		uni.switchTab({
			url:'/pages/TabBar/MyResume/MyResume'
		})
		
		uni.showToast({
			title:'更新成功！',
			icon:'success'
		})
	}
	
	uni.showToast({
		title: res.message,
		icon:'error'
	})
	
}




// 表单验证规则
const rules = ref({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
  targetPosition: [{ required: true, message: '目标职位不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '简历描述不能为空', trigger: 'blur' }],
  skills: [{ required: true, message: '技能不能为空', trigger: 'blur' }],
  resumeUrl: [{ required: true, message: '请上传简历', trigger: 'change' }],
});

const handleAfterRead = async (file) => {
  // 只通过文件名的扩展名来判断是否为 PDF
  if (file && !file.file.name.endsWith('.pdf')) {
    uni.showToast({ title: '请选择PDF文件', icon: 'none' });
    return;
  }

  // 获取本地存储中的 token
  const token = uni.getStorageSync('token');  // 假设你的 token 存储在 uni 的本地存储中

  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }

  console.log(file.file)
  uni.showLoading({
  	title:'上传中...',
	mask:true
  })
  // 使用 uni.uploadFile 进行文件上传
  uni.uploadFile({
    url: 'http://localhost:8080/oss/upload/file', // 服务器的文件上传接口
    name: 'file',  // 文件字段名（需要根据后端接口来设置）
    filePath: file.file.url,
    header: {
      'Authorization': token  // 将 token 作为 Bearer Token 传递
    },
    success: (uploadFileRes) => {
      // 上传成功后的回调
      const response = JSON.parse(uploadFileRes.data);  // 假设返回的是 JSON 格式
      console.log(response)
      if (response.code === 200) {
        // 上传成功，获取文件 URL
        resumeData.value.resumeUrl = response.data.fileUrl;  // 更新简历 URL
        uni.showToast({ title: '文件上传成功', icon: 'success' });
      } else {
        // 上传失败，显示错误信息
        uni.showToast({ title: response.message || '文件上传失败', icon: 'none' });
      }
    },
	
    fail: (error) => {
      // 上传失败的回调
      console.error('文件上传失败:', error);
      uni.showToast({ title: '文件上传失败，请重试', icon: 'none' });
    },
	complete: () => {
		uni.hideLoading()
	}
  });
};

// 表单提交
const submitForm = async () => {
  try {
    const isValid = await formRef.value.validate();  // 校验表单
	if (!isValid) {
	  console.log('验证失败:', formRef.value.errors);
	}
    if (isValid) {
      // 提交表单数据到服务器
      console.log('验证通过，表单数据:', resumeData.value);
	  uni.showLoading({
	     title: '提交中...',
	     mask: true,
	   });
      const res = await publicResume(resumeData.value);
      console.log('简历：', res);
	  uni.hideLoading()
	  if(res.code == 200) {
		  uni.switchTab({
		  	url:'/pages/TabBar/MyResume/MyResume'
		  })
	  }
	  uni.showToast({ title: res.data.message, icon: 'success' });
	
    }
  } catch (error) {
    console.log('表单验证失败', error);
  }
};

// 清空表单
const clearForm = () => {
  resumeData.value = {
    name: '',
    contact: '',
    targetPosition: '',
    description: '',
    skills: '',
    resumeUrl: '',
    userId: 0,
  };
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.upload-text {
  color: #2979ff;
  text-decoration: underline;
}

.upload-box {
  width: 200rpx;
  height: 200rpx;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  color: #007aff;
}

.file-preview {
  margin-top: 10rpx;
}

.file-icon {
  width: 200rpx;
  height: 200rpx;
  object-fit: cover;
}

.up-form-item {
  margin-bottom: 20rpx;
}
</style>
