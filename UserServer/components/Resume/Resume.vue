<template>
  <view class="card_container">
    <image src="../../static/images/pdf.png" class="left"></image>
    <view class="right">
      <view class="title">{{ props.data.targetPosition }}</view>
      <view>
		  <view v-if="props.data.status == 0" class="btn1">
		  	 <button plain="true" size="mini" @click="goToPreView" class="preview-button">预览</button>
		  </view>
		  
		  
		  <view v-else-if="props.data.status == 1" class="btn2">
			  <button type="warn" size="mini" @click="delResume">删除</button>
		  	 <button plain="true" size="mini" @click="goToPreView" class="preview-button">预览</button>
		  </view>
		  
		  <view v-else="props.data.status == 2" class="btn3">
			  <button type="primary" plain="true" size="mini" @click="EditResume">编辑</button>
			  <button type="warn" size="mini" @click="delResume">删除</button>
			  <button plain="true" size="mini" @click="goToPreView" >预览</button>
		  </view>
	
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { deleteResume } from '@/api/index.js';
import { throttle } from 'lodash';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const emit = defineEmits();

// 编辑按钮
const EditResume = throttle(() => {
  uni.setStorageSync('resumeData', props.data);
  uni.navigateTo({
    url: '/pages/TabBar/MyResume/PublishResume/PublishResume'
  });
}, 1000); // 限制每 1000 毫秒内只能点击一次

// 删除按钮
const delResume =  () => {
  uni.showModal({
  	title:'提示',
	content:'您确定要删除嘛？',
	success: async (flag) => {
		if(flag.confirm) {
			const res = await deleteResume(props.data.resumeId);
			if (res.code === 200) {
			  uni.showToast({
			    title: "删除成功！",
			    icon: "success"
			  });
			  // 删除成功后，通知父组件刷新
			  emit('refresh');
			} else {
			  uni.showToast({
			    title: "删除失败！",
			    icon: "none"
			  });
			}
		}else {
			uni.showToast({
				title:'已取消',
				icon:'none'
			})
		}
	}
  })
};

const goToPreView = () => {
	uni.setStorageSync('resumeUrl',props.data.resumeUrl)
	uni.navigateTo({
		url:'/pages/TabBar/MyResume/PreviewResume/PreviewResume'
	})
}
</script>

<style scoped lang="scss">
.card_container {
  padding: 25rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin-top: 30rpx;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid $uni-color-primary;
  display: flex;
  gap: 30rpx;
  color: #7D7D7D;
}
.left {
  height: 150rpx;
  width: 150rpx;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.title {
  color: $uni-color-primary;
}
.btn3,.btn2 {
  gap: 20rpx;
  display: flex;
}


.preview-button {
	width: 200rpx;
	color: #19be6b;
	border: solid 1px #19be6b;
}

.preview-button:hover {
	background-color: #eaeaeb;
}



</style>
