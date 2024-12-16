<script setup>
import { ref, onMounted } from "vue";
import { getWebsiteInfo, updateWebsiteInfo } from "@/api/other/index.js";
import { Plus } from "@element-plus/icons-vue";

// 网站信息
const websiteInfo = ref({
  logoUrl: "",
  welcomeMessage: ""
});


// 获取网站信息
const fetchWebsiteInfo = async () => {
  const res = await getWebsiteInfo();
  if (res.code === 200) {
    websiteInfo.value.logoUrl = res.data.logoUrl || "";
    websiteInfo.value.welcomeMessage = res.data.welcomeMessage || "";
  }
};

// 更新网站信息
const handleSave = async () => {
  if (!websiteInfo.value.logoUrl || !websiteInfo.value.welcomeMessage) {
    alert("请填写完整信息！");
    return;
  }
  const data = {
    logoUrl: websiteInfo.value.logoUrl,
    welcomeMessage: websiteInfo.value.welcomeMessage
  };

  const res = await updateWebsiteInfo(data);
  if (res.code === 200) {
    // 提示成功
    alert("操作成功！");
  } else {
    // 提示失败
    alert("操作失败！");
  }
};



//文件上传模块
const token = localStorage.getItem('token');
const headers = {
  Authorization: token
};


// 上传成功处理
const handleAvatarSuccess = (response, file) => {
  console.log('文件上传逻辑',response);
  // 假设上传返回的图片路径为 response.data.logoUrl
  websiteInfo.value.logoUrl = response.data.fileUrl;
};

// 上传文件处理
const handleAvatarUpload = (file) => {
  // 上传前可以进行处理，例如文件格式验证等
  return true;
};

// 页面加载时获取网站信息
onMounted(() => {
  fetchWebsiteInfo();
});
</script>

<template>
  <div class="container">
    <h2>网站logo和欢迎语</h2>

    <div>
      <el-upload
          action="http://localhost:8080/oss/upload/file"
          :multiple="false"
          :on-success="handleAvatarSuccess"
          :on-upload="handleAvatarUpload"
          :headers="headers"
          :show-file-list="false"
          class="avatar-uploader"
      >
        <div v-if="websiteInfo.logoUrl">
          <img :src="websiteInfo.logoUrl" class="carousel-image" alt="轮播图预览" />
        </div>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </div>

    <div style="margin-top: 20px;">
      <el-input
          v-model="websiteInfo.welcomeMessage"
          placeholder="请输入网站欢迎语"
      ></el-input>
    </div>

    <div style="margin-top: 20px;">
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  h2 {
    margin-bottom: 20px;
    font-size: 18px;
  }
  width: 300px;
  .carousel-image {
    width: 200px;
  }
}
</style>


