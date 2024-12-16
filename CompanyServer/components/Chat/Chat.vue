<template>
  <view class="chat-container">
    <view class="chat-card">
      <view class="chat-header">
        <text class="chat-title">聊天</text>
      </view>

      <!-- 聊天记录 -->
      <view class="chat-history">
        <view
          v-for="(msg, index) in messages"
          :key="index"
          :class="['chat-message', msg.senderId === userId ? 'sent' : 'received']"
        >
          <view class="message-content">
            <text>{{ msg.content }}</text>
          </view>
          <view class="message-time">{{ msg.createTime }}</view>
        </view>
      </view>

      <!-- 输入框区域 -->
      <view class="chat-footer">
        <input
          v-model="message"
          placeholder="请输入消息"
          class="chat-input"
          @confirm="sendMessage"
          :maxlength="200"
        />
        <button
          class="send-btn"
          @click="sendMessage"
          :disabled="!message.trim()"
        >
          发送
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import WebSocketService from '@/utils/WebSocketService.js'; // WebSocket 服务
import { getChatHistory } from '@/api/index.js'; // 使用你提供的接口

export default {
  props: {
    userId: {
      type: Number,
      required: true,
    },
    receiverId: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    // 存储当前聊天记录
    const message = ref('');
    const messages = ref([]);

    // 获取历史聊天记录
    const fetchChatHistory = () => {
      getChatHistory(props.userId, props.receiverId).then((res) => {
        if (res.code === 200) {
          messages.value = res.data; // 将历史消息加载到聊天记录中
        } else {
          uni.showToast({
            title: '获取聊天记录失败',
            icon: 'none',
          });
        }
      }).catch((error) => {
        console.error('获取聊天记录失败', error);
        uni.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    };

    // 初始化 WebSocket
    const initializeWebSocket = () => {
      WebSocketService.init(props.userId); // 使用 WebSocketService 初始化 WebSocket 连接

      // 注册接收到消息时的回调
      WebSocketService.onMessage((msg) => {
        messages.value.push(msg);  // 将接收到的消息加入聊天记录
      });
    };

    const sendMessageHandler = () => {
      if (!message.value.trim()) {
        uni.showToast({
          title: '消息不能为空',
          icon: 'none',
        });
        return;
      }

      const msg = {
        senderId: props.userId,
        senderType: 'company',
        receiverId: props.receiverId,
        receiverType: 'jobseeker',
        content: message.value.trim(),
        createTime: new Date().toLocaleString(),
      };

      // 通过 WebSocket 发送消息，后端会同时处理消息存储
      WebSocketService.sendMessage(msg);  
      messages.value.push(msg); // 新消息立即显示在聊天框
      message.value = ''; // 清空输入框
    };

    const cleanupWebSocket = () => {
      WebSocketService.close(); // 关闭 WebSocket 连接
    };

    onMounted(() => {
      fetchChatHistory();  // 获取历史聊天记录
      initializeWebSocket(); // 初始化 WebSocket 连接
    });

    onBeforeUnmount(() => {
      cleanupWebSocket();  // 清理 WebSocket 连接
    });

    return {
      message,
      messages,
      sendMessage: sendMessageHandler, // 绑定发送消息的方法
    };
  },
};
</script>

<style scoped>
.chat-container {
  padding: 10px;
}

.chat-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
  font-size: 18px;
}

.chat-history {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.chat-message {
  margin-bottom: 15px;
}

.sent {
  text-align: right;
}

.received {
  text-align: left;
}

.message-content {
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 5px;
  display: inline-block;
}

.message-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.chat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.chat-input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.send-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
}
</style>
