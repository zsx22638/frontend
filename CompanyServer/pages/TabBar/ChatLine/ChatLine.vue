<template>
  <view v-for="(item, index) in userList" :key="item.sessionId">
	  <view style="margin-bottom: 10rpx;">
	  	<ChatItem :contact="item" @click="goTo(item)" />
	  	<!-- 红点提示 -->
	  	<view v-if="getUnreadCount(item.user1Id) > 0 " class="red-dot">
	  	  {{ getUnreadCount(item.user1Id) }}
	  	</view>
	  </view>
	
  </view>

</template>

<script setup>
  import { onShow } from '@dcloudio/uni-app';
  import { getUserList } from '@/api/index.js';
  import { ref, computed, nextTick } from 'vue';
  import { useChatStore } from '@/stores/chat';

  const chatStore = useChatStore();
  
  const userList = ref([]);

  // 计算未读消息数
  const getUnreadCount = (user1Id) => {
	  console.log('用户id',user1Id)
	console.log('拿到红点数据：',chatStore.unreadMessages[user1Id])
    return chatStore.unreadMessages[user1Id] || 0; // 如果没有未读消息，默认返回 0
  };
  
  


  // 页面展示时获取聊天用户
  onShow(() => {
	//获取会话
    getChatSession();
	getUnreadCount();
    console.log('获取历史会话成功：', userList.value);
  });

  // 获取聊天会话列表
  const getChatSession = async () => {
    const res = await getUserList();
    if (res.code == 200) {
     
      userList.value = res.data;
	   console.log('获取聊天列表成功：', userList.value);
    }
  };

  // 跳转到聊天窗口
  const goTo = (item) => {
    chatStore.markAsRead(item.user1Id); // 清除该用户的未读消息
    console.log('测试item', item);
    uni.navigateTo({
      url: '/pages/TabBar/ChatLine/ChatWindow/ChatWindow?object=' + encodeURIComponent(JSON.stringify(item)),
    });
  };
</script>

<style scoped lang="scss">
  .red-dot {
    width: 35rpx;
    height: 35rpx;
    background-color: red;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    font-size: 25rpx;
    line-height: 35rpx;
    position: relative;
    top: -60rpx;
    right: -650rpx;
    // transform: translate(20%, -20%); /* 微调位置 */
  }

  .red-dot span {
    font-size: 10px;
    font-weight: bold;
  }
</style>
