<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { getCompanyCarousels, updateCarousel, deleteCarousel,addCarousel } from '@/api/other/index.js';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'

onMounted(() => {
  getCarousels();
});
// 轮播图数据
const carousels = ref([]);
const dialogVisible = ref(false);


// 用于编辑的轮播图表单
const carouselForm = reactive({
  id: null,
  title: '',
  description: '',
  imageUrl: '',
  targetType: 0  //公司端就是0
});


const visible = reactive({});


// 控制删除弹出框显示/关闭
const showPopover = (id) => {
  visible[id] = true;
};
const closePopover = (id) => {
  visible[id] = false;
};


// 获取公司端轮播图
const getCarousels = async () => {
  const res = await getCompanyCarousels();
  if (res.code === 200) {
    console.log('轮播图数据：',res.data);
    carousels.value = res.data;
    console.log('轮播图数据：',carousels.value);
    // 初始化每行的弹出框状态
    res.data.forEach((row) => {
      visible[row.id] = false;
    });
  }
};



// 修改轮播图（显示表单）
const handleEdit = (carousel) => {
  carouselForm.id = carousel.id;
  carouselForm.title = carousel.title;
  carouselForm.description = carousel.description;
  carouselForm.imageUrl = carousel.imageUrl; // 显示当前的图片 URL
  dialogVisible.value = true; // 打开对话框
};



// 保存修改后的轮播图
const saveCarousel = async () => {
  if (!carouselForm.title || !carouselForm.description || !carouselForm.imageUrl) {
    ElMessage.error('请填写标题、描述和上传图片');
    return;
  }
  const carouselData = {
    id: carouselForm.id,
    imageUrl: carouselForm.imageUrl,
    title: carouselForm.title,
    description: carouselForm.description,
    targetType: 0 // 可以根据需要设置目标类型
  };

  // 更新已有的轮播图
  const res = await updateCarousel(carouselData);
  if (res.code === 200) {
    ElMessage.success('轮播图更新成功');
    getCarousels(); // 刷新轮播图列表
    dialogVisible.value = false; // 关闭弹出框
    carouselForm.title = ''; // 清空表单
    carouselForm.description = '';
    carouselForm.imageUrl = '';
  } else {
    ElMessage.error('轮播图更新失败');
  }
};

// 删除轮播图
const handleRemove = async (carouselId) => {
  const res = await deleteCarousel(carouselId);
  if (res.code === 200) {
    ElMessage.success('轮播图删除成功');
    getCarousels(); // 刷新轮播图列表
  } else {
    ElMessage.error('轮播图删除失败');
  }
};


//上传新的轮播图
const uploadNewCarousel = () => {
  carouselForm.title = ''; // 清空表单
  carouselForm.description = '';
  carouselForm.imageUrl = '';
  dialogVisible.value = true; // 打开弹出框
}

const commitNewCarousel = async () => {
  if (!carouselForm.title || !carouselForm.description) {
    ElMessage.error('请填写标题和描述');
    return;
  }

  const carouselData = {
    imageUrl: carouselForm.imageUrl,
    title: carouselForm.title,
    description: carouselForm.description,
    targetType: 0
  };

  // 新增轮播图
  const res = await addCarousel(carouselData);
  console.log('新增轮播图：', res);
  if (res.code === 200) {
    ElMessage.success('新轮播图添加成功');
    getCarousels(); // 刷新轮播图列表
  }else {
    ElMessage.error('新轮播图添加失败');
  }
  dialogVisible.value = false; // 关闭弹出框
}


//文件上传模块
const token = localStorage.getItem('token');
const headers = {
  Authorization: token
};

// 上传成功后的处理
const handleAvatarSuccess = (response, file) => {
  console.log('上传成功:', response);
  // 上传成功后获取 OSS 返回的 URL
  carouselForm.imageUrl = response.data.fileUrl; // 假设返回的 URL 在 response.data.url 中
};

// 文件上传事件
const handleAvatarUpload = (file) => {
  console.log('上传之前:', file);
};




</script>

<template>



    <el-button @click="uploadNewCarousel">上传新的轮播图</el-button>





  <!-- 轮播图展示 -->
  <el-row :gutter="20" class="carousel-container">
    <el-col :span="6" v-for="(carousel, index) in carousels" :key="carousel.id">
      <el-card :body-style="{ padding: '10px' }">
        <img :src="carousel.imageUrl" class="carousel-image" alt="轮播图" />
        <div class="carousel-info">
          <h3>{{ carousel.title }}</h3>
          <p>{{ carousel.description }}</p>
        </div>
        <el-button type="primary" @click="handleEdit(carousel)">修改</el-button>


        <!-- 删除 -->
        <el-popover :visible="visible[carousel.id]" placement="top" trigger="click">
          <template #default>
            <p>确认删除该简历？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="closePopover(carousel.id)">取消</el-button>
              <el-button size="small" type="primary"   @click.stop="handleRemove(carousel.id)">
                确认
              </el-button>
            </div>
          </template>
          <template #reference>
            <el-button
                type="danger"
                @click.stop="showPopover(carousel.id)"
            >
              删除
            </el-button>
          </template>
        </el-popover>

      </el-card>


    </el-col>
  </el-row>

  <!-- 弹出框，用户修改标题、描述和图片 -->
  <el-dialog title="修改轮播图" v-model="dialogVisible">

    <div class="upload_form">
      <el-form :model="carouselForm" ref="form">

        <el-form-item label="标题" prop="title">
          <el-input v-model="carouselForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="carouselForm.description" placeholder="请输入描述"></el-input>
        </el-form-item>

        <el-form-item label="图片" prop="imageUrl" class="addImage">
          <el-upload
              action="http://localhost:8080/oss/upload/file"
              :multiple="false"
              :on-success="handleAvatarSuccess"
              :on-upload="handleAvatarUpload"
              :headers="headers"
              :show-file-list="false"
              class="avatar-uploader"
          >
            <div v-if="carouselForm.imageUrl">
              <img :src="carouselForm.imageUrl" class="carousel-image" alt="轮播图预览" />
            </div>
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>

        </el-form-item>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button v-if="carouselForm.id" type="primary" @click="saveCarousel">保存</el-button>
      <el-button v-else type="primary" @click="commitNewCarousel">提交</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.upload_form {
  padding: 20px;
  width: 400px;

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }

  .carousel-image {
    width: 100%;
    height: auto;
  }

}


.carousel-container {
  margin-top: 20px;
}

.carousel-image {
  width: 100%;
  height: auto;
}

.carousel-info {
  margin-top: 10px;
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>

<style>

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
