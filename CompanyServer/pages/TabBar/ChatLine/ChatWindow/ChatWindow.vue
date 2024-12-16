<template>
	<up-navbar
	:title="obj.userFullName"
	:autoBack="true"
	:placeholder="true"
	>
	</up-navbar>
  <view class="chat-container" style="padding: 0rpx 20rpx">
	  
    <scroll-view class="messages" scroll-y  :scroll-top="scrollTop" style="padding:0rpx;margin-bottom: 150rpx;" :scroll-with-animation="true" enable-flex="true">
      
	  <view class="box-content">
		  <!-- 遍历消息列表 -->
		  <view v-for="(message, index) in historyMessageList" :key="index" :class="['message', message.senderType === 'company' ? 'message-sent' : 'message-received']">
		    
		    <!-- 接收方 -->
		    <view v-show="message.senderType == 'jobseeker'" class="message-wrapper">
		  			
		      <view class="avatar">
		        <image :src="obj.user1Avatar" class="avatar-img" />
		      </view>
		  		  
		      <view class="content">
		        {{ message.content }}
		        <view class="time">{{ message.createTime }}</view>
		      </view>
		  		  
		    </view>
		    
		    <!-- 发送方 -->
		    <view v-show="message.senderType == 'company'" class="message-wrapper" style="justify-content: flex-end;">
		  			
		      <view class="content">
		        {{ message.content }}
		        <view class="time">{{ message.createTime }}</view>
		      </view>
		  		  
		      <view class="avatar">
		        <image :src="obj.user2Avatar" class="avatar-img" />
		      </view>
		    </view>
		  
		  </view>
	  </view>
	 
    </scroll-view>

    <!-- 输入框区域 -->
    <view class="input-container">
      <input v-model="inputMessage" class="input-box" placeholder="请输入消息" />
      <button @click="sendMessage">发送</button>
    </view>
	
	
  </view>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
  import WebSocketUtil from "@/utils/webSocketUtils.js";
  import { getHistoryMessage } from "@/api/index.js";
  import { onLoad,onShow } from '@dcloudio/uni-app';
  import { useChatStore } from '@/stores/chat'; // 假设你有一个chat store
  import dayjs from "dayjs"; 
  
  
  const chatStore = useChatStore(); // 获取聊天仓库
  const obj = ref({});//从聊天主页面点击跳转过来，传递的双方头像和名字
  const inputMessage = ref('');//输入框的消息
  const historyMessageList = ref([]); // 历史消息列表
  
  //页面滚动参数
  const scrollTop = ref(0)  // 距离顶部的距离
  const scrollViewHeight = ref(0) //滚动视图的高度
  const scrollContentHeight = ref(0) //整个内容区的高度
  

  // 初始化发送者和接收者的 ID
  const senderId = ref(null);
  const receiverId = ref(null);
  const createTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
  
  onLoad((e) => {
    obj.value = JSON.parse(decodeURIComponent(e.object));
	senderId.value = obj.value.user2Id;
	receiverId.value = obj.value.user1Id;
    console.log('目标页面拿到数据：', obj.value);
  });
  
  onShow(() => {
	 
	  
  }) 

  // 获取历史消息
// 获取历史消息
const getHistoryMessageList = async () => {
  uni.showLoading({
    title: '加载中...', // 显示加载提示
    mask: true // 遮罩层，防止用户交互
  });
  try {
    const result = await getHistoryMessage(senderId.value, receiverId.value);
    if (result.code === 200) {
      historyMessageList.value = result.data;
    }
  } catch (error) {
    console.error('加载历史消息失败', error);
  } finally {
    uni.hideLoading(); // 加载完成后隐藏加载提示
  }
};


  // 发送消息
  const sendMessage = async () => {
    if (inputMessage.value.trim() !== '') {
      const newMessage = {
        senderId: senderId.value,
		senderType: 'company', // 这里就是固定了是公司（求职者端也固定就是jobseeker）
        receiverId:receiverId.value,
		receiverType: 'jobseeker',
        content: inputMessage.value,
       createTime
        
      };
      // 调用仓库方法发送消息
      await chatStore.sendMessage(newMessage);
      historyMessageList.value.push(newMessage); // 更新消息列表
      inputMessage.value = ''; // 清空输入框
	  console.log('最新的历史聊天记录',historyMessageList.value)
	  
	 
	  scrollToBottom(); // 确保发送消息后自动滚动 
    }
  };
  
  
  // 监听接收到的新消息
  watch(() => chatStore.receivedMessages, (newMessages) => {
	  console.log('收到新信息：',newMessages)
    // 根据发送者 ID 判断消息所属聊天
    if (newMessages.senderId === receiverId.value && newMessages.receiverId === senderId.value) {
      // 将新消息添加到历史消息列表
      historyMessageList.value.push(newMessages);
      console.log('消息添加成功：',historyMessageList.value)
	  
	  //如果是在这个页面监听到了数据就直接进行消除红点
	  console.log('执行了：---------------',receiverId.value)
	  chatStore.markAsRead(receiverId.value)
	  
      scrollToBottom(); // 新消息到来时自动滚动
    }
  }, { immediate: true });
  
  onMounted(() => {
	  // 获取历史消息
	   getHistoryMessageList().then(() => {
	     nextTick(() => {
	       scrollToBottom();
	     });
	   });
	   
  })
  
  
  // 监听消息，自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
	  console.log('开始计算scrolltop距离')
	    const query = uni.createSelectorQuery()
	         query.select('.messages').boundingClientRect()
	         query.select('.box-content').boundingClientRect()
	         query.exec(res => {
	          scrollViewHeight.value = res[0].height
	          scrollContentHeight.value = res[1].height
	           if (scrollContentHeight.value > scrollViewHeight.value) {
	              scrollTop.value = scrollContentHeight.value - scrollViewHeight.value
	           }
	         })
			 
			 console.log('------------',scrollTop.value,scrollContentHeight.value,scrollViewHeight.value)
	       })
  }





  
</script>

<style scoped lang="scss">
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #f9f9f9;
  }

  /* 消息区 */
  .messages {
	height: 1350rpx;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
	// background-color: #F5F5F5;
	background-color: pink;
	margin-top:20rpx;
	 flex-grow: 1; /* 使容器占满剩余空间 */
  }


  /* 单条消息样式 */
  .message-wrapper {
    display: flex;
    align-items: center;
    max-width: 800rpx;
  }

  /* 消息内容区域 */
  .content {
    max-width: 800rpx; /* 设置消息内容区域的最大宽度 */
    padding: 20rpx 30rpx;
    border-radius: 10rpx;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    display: inline-block;
	margin-bottom: 15rpx; /* 增加每条消息之间的间距 */
  }



  /* 接收的消息 */
  .message-sent{
	  .content {
	  	  background-color: #95EC69;
	  	  color: black;
	  	  margin-right: 10px;
	  }  
  }
  
  .message-received {
	   .content {
		   background-color: #FFFFFF;
		   color: black;
		   margin-right: 10px;
	   }
  }

  
  
  /* 头像样式 */
  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  /* 头像圆形样式 */
  .avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  /* 消息时间 */
  .time {
    font-size: 12px;
    color: #999;
    text-align: right;
    margin-top: 5px;
  }

  /* 输入框区域 */
  .input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .input-box {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 10px;
  }

  button {
    padding: 8px 15px;
    background-color: #0078ff;
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
  }
</style>
