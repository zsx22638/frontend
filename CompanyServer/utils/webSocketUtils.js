// utils/wsUtil.js
export default class WebSocketUtil {
  constructor(token) {
    this.url = `ws://localhost:8080/myWs?token=${token}`;
    this.socket = null;
    this.isConnected = false; // 连接状态
    this.messageHandlers = []; // 消息处理器
    this.reconnectInterval = 5000; // 重连间隔
  }

  // 初始化 WebSocket
  init() {
    if (this.isConnected) return;

    this.socket = uni.connectSocket({
      url: this.url,
      success: () => console.log("WebSocket 初始化成功"),
    });

    // 监听打开连接
    this.socket.onOpen(() => {
      console.log("WebSocket 已连接");
      this.isConnected = true;
    });

    // 监听消息
    this.socket.onMessage((res) => {
      // 这里的 res.data 是 String 类型
      this.messageHandlers.forEach((handler) => handler(res.data));
    });

    // 监听错误
    this.socket.onError((err) => {
      console.error("WebSocket 连接错误：", err);
      this.isConnected = false;
      this.reconnect(); // 自动重连
    });

    // 监听关闭
    this.socket.onClose(() => {
      console.log("WebSocket 已关闭");
      this.isConnected = false;
      this.reconnect(); // 自动重连
    });
  }

  // 发送消息
  sendMessage(message) {
    if (!this.isConnected) {
      console.error("WebSocket 未连接，消息发送失败");
      return;
    }

    // 将消息对象转为 JSON 格式
    const messageJson = JSON.stringify(message);

    this.socket.send({
      data: messageJson,
      success: () => console.log("消息发送成功"),
      fail: (err) => console.error("消息发送失败", err),
    });
  }

 // 注册消息处理器
 addMessageHandler(handler) {
   this.messageHandlers.push((message) => {
     try {
       // 尝试将收到的消息解析为 JSON
       const jsonMessage = JSON.parse(message);
       
       // 调用传入的 handler，处理解析后的 JSON 数据
       handler(jsonMessage);
     } catch (error) {
       console.error("消息解析失败:", error);
     }
   });
 }


  // 取消注册消息处理器
  removeMessageHandler(handler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  // 重连机制
  reconnect() {
    if (this.isConnected) return;

    console.log("尝试重新连接...");
    setTimeout(() => {
      this.init();
    }, this.reconnectInterval);
  }

  // 关闭 WebSocket
  close() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }
}
