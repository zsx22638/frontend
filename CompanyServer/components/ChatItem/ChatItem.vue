<template>
  <view class="container">
    <view class="left">
      <image :src="props.contact.user1Avatar" />
    </view>
    <view class="right">
      <view class="top">
        <view class="name">{{ props.contact.userFullName }}</view>
        <view class="time">{{ formatTime(lastMessageTime) }}</view>
      </view>
      <view class="bottom">{{ lastMessageContent }}</view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, watch, ref,onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';

// 接收的联系人信息
const props = defineProps({
  contact: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
	console.log('组件中拿到的数据：',props.contact)
})


// 本地状态：存储最后的消息内容和时间
const lastMessageContent = ref(props.contact.lastMessageContent || '');
const lastMessageTime = ref(props.contact.lastMessageTime || '');

// 监听 props.contact 的变化，确保最后的消息内容能及时更新
watch(() => props.contact, (newContact) => {
  lastMessageContent.value = newContact.lastMessageContent || '';  // 更新消息内容
  lastMessageTime.value = newContact.lastMessageTime || '';  // 更新消息时间
}, { immediate: true });  // 初始时也进行更新




// 获取 chatStore
const chatStore = useChatStore();

// 监听接收到的新消息
watch(
  () => chatStore.receivedMessages,
  (newMessages) => {
    // 判断新消息是否属于当前聊天会话
    if (newMessages.senderId === props.contact.user1Id) {
      lastMessageContent.value = newMessages.content; // 更新消息内容
      lastMessageTime.value = newMessages.createTime; // 更新消息时间
    }
  },
  { immediate: true } // 初始化时即检查已有消息
);






// 时间格式化函数
const formatTime = (time) => {
  const messageTime = new Date(time);
  const currentTime = new Date();
  const timeDifference = currentTime - messageTime;

  if (timeDifference < 86400000) {
    const hours = messageTime.getHours().toString().padStart(2, '0');
    const minutes = messageTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  if (timeDifference < 172800000) {
    return '昨天';
  }

  if (timeDifference < 604800000) {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfWeek = messageTime.getDay();
    return `星期${weekDays[dayOfWeek]}`;
  }

  const year = messageTime.getFullYear();
  const month = (messageTime.getMonth() + 1).toString().padStart(2, '0');
  const day = messageTime.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
</script>

<style scoped lang="scss">
.container {
  padding: 15rpx 50rpx;
  display: flex;
  align-items: center;
  gap: 40rpx;
  background-color: #e2e1e1;

  .left {
    display: flex;
    image {
      width: 100rpx;
      height: 100rpx;
    }
  }

  .right {
    width: 600rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .top {
      font-size: 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .time {
        font-size: 25rpx;
        color: #999999;
      }
    }

    .bottom {
      color: #999999;
      font-size: 25rpx;
    }
  }
}
</style>
