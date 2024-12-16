// src/store/admin/index.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAdminInfo } from "@/api/admin/index.js"; // 引入请求方法

export const useAdminStore = defineStore('user', () => {
    // 定义用户信息字段
    const adminId = ref(null);
    const adminUsername = ref('');
    const adminEmail = ref('');
    const adminAvatar = ref(null);
    const lastLoginTime = ref('');
    const isLoggedIn = ref(false);

    // 获取并设置用户信息的方法
    const fetchAdminInfo = async () => {
        try {
            const data = await getAdminInfo();
            setAdminInfo(data.data);  // 使用 setAdminInfo 方法更新仓库中的用户信息
        } catch (error) {
            console.error("获取用户信息失败:", error);
        }
    };

    // 设置字段的函数：单独管理各个字段
    const setAdminId = (id) => { adminId.value = id; };
    const setAdminUsername = (username) => { adminUsername.value = username; };
    const setAdminEmail = (email) => { adminEmail.value = email; };
    const setAdminAvatar = (avatar) => { adminAvatar.value = avatar; };
    const setLastLoginTime = (time) => { lastLoginTime.value = time; };
    const setIsLoggedIn = (status) => { isLoggedIn.value = status; };

    // 设置所有用户信息的函数
    const setAdminInfo = (userInfo) => {
        setAdminId(userInfo.adminId);
        setAdminUsername(userInfo.adminUsername);
        setAdminEmail(userInfo.adminEmail);
        setAdminAvatar(userInfo.adminAvatar);
        setLastLoginTime(userInfo.lastLoginTime);
        setIsLoggedIn(true);
    };

    //清空方法
    const clearAdminInfo = () => {
        setAdminId(null);
        setAdminUsername('');
        setAdminEmail('');
        setAdminAvatar(null);
        setLastLoginTime('');
        setIsLoggedIn(false);
    };

    // 返回需要暴露的数据和方法
    return {
        adminId,
        adminUsername,
        adminEmail,
        adminAvatar,
        lastLoginTime,
        isLoggedIn,
        clearAdminInfo,
        fetchAdminInfo,  // 暴露获取用户信息的方法
        setAdminInfo,    // 设置所有字段的函数
        setAdminId,      // 单独设置字段的函数
        setAdminUsername, // 单独设置字段的函数
        setAdminEmail,    // 单独设置字段的函数
        setAdminAvatar,   // 单独设置字段的函数
        setLastLoginTime, // 单独设置字段的函数
        setIsLoggedIn,    // 单独设置字段的函数
    };
});
