import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCompanyInfo } from '@/api/index.js';

export const useCompanyStore = defineStore('company', () => {
    // 定义公司信息字段
    const companyId = ref(null);
    const companyName = ref('');
    const companyUsername = ref('');
    const companyEmail = ref('');
    const companyPhone = ref('');
    const companyLicense = ref('');
    const companyAvatar = ref('');
    const companyLocation = ref('');
    const companyScale = ref('');
    const companyDescription = ref('');

    // 获取并设置公司信息的方法
    const fetchCompanyInfo = async () => {
        try {
            const res = await getCompanyInfo();
			console.log('获取公司信息：',res)
            setCompanyInfo(res.data); // 使用 setCompanyInfo 方法更新仓库中的公司信息
        } catch (error) {
            console.log('获取公司信息失败:', error);
        }
    };

    // 设置字段的函数：单独管理各个字段
    const setCompanyId = (id) => { companyId.value = id; };
    const setCompanyName = (name) => { companyName.value = name; };
    const setCompanyUsername = (username) => { companyUsername.value = username; };
    const setCompanyEmail = (email) => { companyEmail.value = email; };
    const setCompanyPhone = (phone) => { companyPhone.value = phone; };
    const setCompanyLicense = (license) => { companyLicense.value = license; };
    const setCompanyAvatar = (avatar) => { companyAvatar.value = avatar; };
    const setCompanyLocation = (location) => { companyLocation.value = location; };
    const setCompanyScale = (scale) => { companyScale.value = scale; };
    const setCompanyDescription = (description) => { companyDescription.value = description; };
    const setAccountStatus = (status) => { accountStatus.value = status; };

    // 设置所有公司信息的函数
    const setCompanyInfo = (companyInfo) => {
        setCompanyId(companyInfo.companyId);
        setCompanyName(companyInfo.companyName);
        setCompanyUsername(companyInfo.companyUsername);
        setCompanyEmail(companyInfo.companyEmail);
        setCompanyPhone(companyInfo.companyPhone);
        setCompanyLicense(companyInfo.companyLicense);
        setCompanyAvatar(companyInfo.companyAvatar);
        setCompanyLocation(companyInfo.companyLocation);
        setCompanyScale(companyInfo.companyScale);
        setCompanyDescription(companyInfo.companyDescription);
    };

    // 清空公司信息的方法
    const clearCompanyInfo = () => {
        setCompanyId(null);
        setCompanyName('');
        setCompanyUsername('');
        setCompanyEmail('');
        setCompanyPhone('');
        setCompanyLicense('');
        setCompanyAvatar('');
        setCompanyLocation('');
        setCompanyScale('');
        setCompanyDescription('');
    };

    // 返回需要暴露的数据和方法
    return {
        companyId,
        companyName,
        companyUsername,
        companyEmail,
        companyPhone,
        companyLicense,
        companyAvatar,
        companyLocation,
        companyScale,
        companyDescription,
        fetchCompanyInfo,  // 获取公司信息的方法
        setCompanyInfo,    // 设置所有字段的函数
        clearCompanyInfo,  // 清空所有字段的函数
        setCompanyId,      // 单独设置字段的函数
        setCompanyName,    // 单独设置字段的函数
        setCompanyUsername,// 单独设置字段的函数
        setCompanyEmail,   // 单独设置字段的函数
        setCompanyPhone,   // 单独设置字段的函数
        setCompanyLicense, // 单独设置字段的函数
        setCompanyAvatar,  // 单独设置字段的函数
        setCompanyLocation,// 单独设置字段的函数
        setCompanyScale,   // 单独设置字段的函数
        setCompanyDescription, // 单独设置字段的函数
    };
});
