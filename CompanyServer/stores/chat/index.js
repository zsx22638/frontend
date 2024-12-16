import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';
import WebSocketUtil from '@/utils/webSocketUtils';

export const useChatStore = defineStore('chat', () => {

	const ws = ref(null); // WebSocket 实例
	const unreadMessages = ref({}); // 每个会话的未读消息数，格式：{ sessionId: count }
	const receivedMessages = ref({}); // 新增字段，存储收到的消息
	const messageHandlers = ref([]); // 自定义消息处理器
	
	
	
	
	/**
	 * 初始化 WebSocket
	 * @param {string} token - 用户鉴权 Token
	 */
	const initWebSocket = (token) => {
		if (ws.value) {
			console.warn('WebSocket 已经初始化，无需重复连接');
			return;
		}

		ws.value = new WebSocketUtil(token);
		ws.value.init();

		// 处理接收的消息
		ws.value.addMessageHandler(async (data) => {
		  console.log('收到新消息:', data);
		  const { senderId } = data; 
		
		  // 将接收到的消息添加到 receivedMessages 中
		  receivedMessages.value = data;
		
		  console.log('更新本次收到的信息：', receivedMessages.value);
		
		  // 更新未读消息状态
		  if (!unreadMessages.value[senderId]) {
		    unreadMessages.value[senderId] = 0; // 初始化为 0
		  }
		
		  unreadMessages.value[senderId]++; // 增加未读消息计数
		  console.log('打印全局未读对象', unreadMessages.value);
		
		  
		
		  // 触发自定义消息处理器
		  messageHandlers.value.forEach((handler) => handler(data));
		});

		
	};

	/**
	 * 发送消息
	 * @param {string} content - 消息内容
	 */
	const sendMessage = (message) => {
		
		if (!ws.value) {
			console.error('WebSocket 未连接');
			return;
		}
		// 发送消息
		ws.value.sendMessage(message);	
	};

	/**
	 * 添加自定义消息处理器
	 * @param {Function} handler - 自定义处理器
	 */
	const addMessageHandler = (handler) => {
		messageHandlers.value.push(handler);
	};

	/**
	 * 移除指定的消息处理器
	 * @param {Function} handler - 需要移除的处理器
	 */
	const removeMessageHandler = (handler) => {
		messageHandlers.value = messageHandlers.value.filter(
			(h) => h !== handler
		);
	};

	/**
	 * 标记某个会话的消息为已读
	 * senderId  表示是谁发来的消息
	 */
	const markAsRead = (senderId) => {
		console.log('开始已读：',senderId)
		unreadMessages.value[senderId] = 0;
	};

 // 清理状态和关闭WebSocket
  const clear = () => {
    receivedMessages.value = [];
    // 清空未读消息
    unreadMessages.value = {};
    // 清空消息处理器
    messageHandlers.value = [];
    //关闭连接
   if (ws.value) {
     ws.value.close(); // 关闭 WebSocket 连接
     ws.value = null;  // 重置 WebSocket 对象
   }
  };
  
  
	return {
		ws,
		receivedMessages, // 新增的字段
		unreadMessages,
		initWebSocket,
		sendMessage,
		addMessageHandler,
		removeMessageHandler,
		markAsRead,
		clear,
	};
});