<script setup>
import { useAdminStore } from "@/store/admin/index.js";
import { updateAdminInfo,updateAdminPassword } from "@/api/admin/index.js";
import {reactive, ref, onMounted, watch} from "vue";
import message from "@/utils/message.js";
import { useRouter } from "vue-router";

const router = useRouter();
const adminStore = useAdminStore();

const updateInfoData = ref({
  adminId: '',
  adminUsername: '',
  adminEmail: '',
  adminAvatar: ''
});


// 监听 adminStore 数据变化，确保 updateInfoData 被更新
watch(
    () => ({
      adminId: adminStore.adminId,
      adminUsername: adminStore.adminUsername,
      adminEmail: adminStore.adminEmail,
      adminAvatar: adminStore.adminAvatar
    }),
    (newData) => {
      updateInfoData.value = newData;
    },
    { immediate: true } // 立即触发，确保组件初始化时同步数据
);

// 在组件挂载时，如果 adminStore 数据已加载，就将其赋值到 updateInfoData
onMounted(() => {
  updateInfoData.value = {
    adminId: adminStore.adminId,
    adminUsername: adminStore.adminUsername,
    adminEmail: adminStore.adminEmail,
    adminAvatar: adminStore.adminAvatar
  };
});


// 修改信息 修改头像和修改信息是一个接口
const updateInfo = async () => {
  // console.log('提交之前的数据：', updateInfoData.value);
  const res = await updateAdminInfo(updateInfoData.value);
  if(res.code === 200) {
    message.success('修改成功');
  } else {
    message.error('修改失败');
  }
};

// 修改头像上传成功事件
const handleAvatarSuccess = (res) => {
  console.log('上传成功之后：', res);
  updateInfoData.value.adminAvatar = res.data.fileUrl;
  if (res.code === 200) {
    adminStore.setAdminAvatar(res.data.fileUrl);
    updateInfo();
  }
};
// 修改头像上传事件
const handleAvatarUpload = (file) => {
  console.log('上传之前:', file);
};

const token = localStorage.getItem('token');
const headers = {
  Authorization: token
};


// 修改密码
const ruleFormRef = ref();


const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('请输入6位以上的密码'));
  } else {
    callback();
  }
};

const validatePass2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
  } else if (value !== pwdData.newPassword) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const pwdData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = reactive({
  oldPassword: [{ validator: validatePass, trigger: 'blur' }],
  newPassword: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
});
// 修改密码
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('表单校验通过!');

      const res = await updateAdminPassword(pwdData);
      if(res.code === 200) {
       message.success('修改成功')
        //清除token
        localStorage.clear();
       //清除仓库
        adminStore.clearAdminInfo();
        //跳转到登录页面
        router.push({ path: '/login' });
      }else {
       message.error('修改失败')
      }

    } else {
      console.log('表单校验失败!');
    }
  });
};
// 修改密码重置
const resetForm = async (formEl) => {
  if (!formEl) return;
  formEl.resetFields();

};


//更新信息
const infoRef = ref();
// 修改信息
const submitInfo = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      console.log('表单校验通过!');
      updateInfo();
    } else {
      console.log('表单校验失败!');
    }
  });
};
// 修改信息重置
const resetInfo = async (formEl) => {
  if (!formEl) return;
  formEl.resetFields();

};

// 用户名校验函数
const username = (rule, value, callback) => {
  if (!value) {
    callback(new Error('用户名不能为空'));
  } else {
    callback();
  }
};

// 邮箱校验函数
const email = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱格式正则表达式
  if (!value) {
    callback(new Error('邮箱不能为空'));
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱地址'));
  } else {
    callback();
  }
};

const infoRules = reactive({
  adminUsername: [{ validator: username, trigger: 'blur' }],
  adminEmail: [{ validator: email, trigger: 'blur' }]
});



</script>






<template>
  <div class="container">
    <div class="avatar">
      <div>点击修改</div>
      <el-upload
          action="http://localhost:8080/oss/upload/file"
          :multiple="false"
          :on-success="handleAvatarSuccess"
          :on-upload="handleAvatarUpload"
          :headers="headers"
          :show-file-list="false"
      >
        <img
            :src="adminStore.adminAvatar"
            class="avatarImg"
            alt="头像"
        />
      </el-upload>
    </div>










    <div class="pwd">
     <div class="box">
       <el-form
           ref="ruleFormRef"
           style="max-width: 600px"
           :model="pwdData"
           status-icon
           :rules="rules"
           label-width="auto"
           class="demo-ruleForm"
       >
         <el-form-item label="旧密码：" prop="oldPassword">
           <el-input v-model="pwdData.oldPassword" type="password" autocomplete="off" />
         </el-form-item>

         <el-form-item label="新密码：" prop="newPassword">
           <el-input
               v-model="pwdData.newPassword"
               type="password"
               autocomplete="off"
           />
         </el-form-item>

         <el-form-item label="确认密码：" prop="confirmPassword">
           <el-input v-model="pwdData.confirmPassword" type="password" autocomplete="off" />
         </el-form-item>

         <el-form-item>
           <el-button type="primary" @click="submitForm(ruleFormRef)">
             确认修改
           </el-button>
           <el-button @click="resetForm(ruleFormRef)">重置</el-button>
         </el-form-item>
       </el-form>
     </div>
    </div>

    <div class="info">信息更改


      <div class="infoUpdate">
        <el-form
            ref="infoRef"
            style="max-width: 600px"
            :model="updateInfoData"
            status-icon
            :rules="infoRules"
            label-width="auto"
            class="demo-ruleForm"
        >
          <el-form-item label="用户名：" prop="adminUsername">
            <el-input v-model="updateInfoData.adminUsername"  autocomplete="off" />
          </el-form-item>

          <el-form-item label="邮箱：" prop="adminEmail">
            <el-input
                v-model="updateInfoData.adminEmail"
                autocomplete="off"
            />
          </el-form-item>



          <el-form-item>
            <el-button type="primary" @click="submitInfo(infoRef)">
              确认修改
            </el-button>
            <el-button @click="resetInfo(infoRef)">重置</el-button>
          </el-form-item>

        </el-form>
      </div>



    </div>


  </div>
</template>




<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .avatar {
    padding: 20px;
    background-color: #d6f4ff;
    height: 300px;

    .avatarImg {
      height: 200px;
      width: 200px;
    }
  }

  .pwd {
    background-color: #f4d6ff;
    height: 300px;
    padding: 20px;
    .box {
      width: 400px;
    }
  }

  .info {
    background-color: #f4ffd6;
    height: 300px;
    padding: 20px;
    .infoUpdate {
      width: 400px;
    }
    }
  }

</style>
