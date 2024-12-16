<script setup>
import { ref, onMounted } from 'vue'
import { adminLogin } from '@/api/admin/index.js'
import { useAdminStore } from "@/store/admin/index.js";
const adminStore = useAdminStore();
import { useRouter } from 'vue-router';
import message from "@/utils/message.js";
const router = useRouter();


const formRef = ref(null);

// 定义表单数据
const formData = ref({
  identifier: '',
  password: ''
})

// 定义是否记住密码
const rememberMe = ref(false)

// 表单验证规则
const rules = {
  identifier: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 监听页面加载，检查是否有存储的账号和密码
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  const savedPassword = localStorage.getItem('password')

  if (savedUsername && savedPassword) {
    formData.value.identifier = savedUsername
    formData.value.password = savedPassword
    rememberMe.value = true
  }
})

// 表单提交方法
const handleLogin = () => {
  // 校验表单
  formRef.value.validate(async (valid) => {
    if (valid) {
      console.log('表单验证通过', formData.value)
      // 执行登录请求
      const res = await adminLogin(formData.value)


      if(res.code === 200){
        // 存储 token
        localStorage.setItem('token', res.data)

        // 如果勾选了记住账号和密码，保存用户名和密码
        if (rememberMe.value) {
          localStorage.setItem('username', formData.value.identifier)
          localStorage.setItem('password', formData.value.password)
        } else {
          // 如果未勾选，清除存储的密码
          localStorage.removeItem('password')
        }
        adminStore.setIsLoggedIn(true)
        await adminStore.fetchAdminInfo()
        message.success('登录成功')
        router.push('/home')

      }else {
        message.error(res.message)
      }

      console.log('登录信息：', res)

    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<template>
  <div class="login_container">
    <div class="login_box">

      <!-- 表单容器 -->
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">

        <!-- 用户名输入框 -->
        <el-form-item label="用户名" prop="identifier">
          <el-input
              v-model="formData.identifier"
              prefix-icon="User"
              placeholder="请输入用户名" />
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item label="密码" prop="password">
          <el-input
              prefix-icon="Lock"
              v-model="formData.password"
              type="password"
              :clearable="true"
              :show-password="true"
              maxlength="16"
              minlength="8"
              placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>

        <!-- 记住账号和密码复选框 -->
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住账号密码</el-checkbox>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  background: url("@/assets/imgs/loginBJ.png") no-repeat fixed;
  background-size: cover;
  height: 100vh;
  width: 100%;
}

.login_box {
  position: relative;
  top: 350px;
  left: 905px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 40px;
  width: 400px;

  :deep(.el-input__wrapper) {
    height: 45px;
    border-radius: 30px !important;
  }

  :deep(.el-form-item__label) {
    height: 45px !important;
    line-height: 45px !important;
    font-size: 16px;
  }
}

.el-button {
  width: 100%;
  height: 45px;
}
.el-form-item {
  margin-bottom: 30px;
}
</style>
