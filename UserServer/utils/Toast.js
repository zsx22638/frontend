import { ref } from 'vue';

export function useToast() {
  // 引用 uToast 组件的实例
  const uToastRef = ref(null);

  // 封装 toast 方法
  const showToast = (options = {}) => {
    const defaultOptions = {
      type: 'default',   // 默认类型
      message: '提示内容', // 默认提示内容
      icon: true,        // 默认显示图标
      duration: 2000,    // 显示时间
      position: 'center' // 显示位置
    };

    // 合并传入的参数和默认参数
    const toastOptions = { ...defaultOptions, ...options };

    // 显示 Toast
    uToastRef.value.show({
      ...toastOptions,
      // complete: () => {
      //   // 如果有 URL，跳转到指定页面
      //   if (toastOptions.url) {
      //     uni.navigateTo({ url: toastOptions.url });
      //   }
      // }
    });
  };

  return {
    uToastRef,
    showToast
  };
}
