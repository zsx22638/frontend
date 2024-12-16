// stores/useInfoStore.js
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const userInfoStore = defineStore('userInfo', () => {
  // 初始化 userInfo，确保所有字段都有初始值
  const userInfo = reactive({
    userAvatar: '',
    userCity: '',
    userEmail: '',
    userFullName: '',
    userId: null,
    userName: '',
    userPhone: '',
    userSex: ''
  });

  // 设置用户信息
  const setInfo = (data) => {
    Object.assign(userInfo, data);

  };

  // 单独设置头像
  const setAvatar = (avatarUrl) => {
    userInfo.userAvatar = avatarUrl;
  };

  // 获取用户信息
  const getInfo = () => {
    return userInfo;
  };

  // 清空用户信息
  const clearInfo = () => {
    Object.keys(userInfo).forEach(key => {
      userInfo[key] = '';
    });
  };

  return { userInfo, setInfo, setAvatar, getInfo, clearInfo };
});
