<script setup>
import { reactive, onMounted,ref } from "vue";
import { getCompanyAccount,banCompanyAccount,unbanCompanyAccount,deleteCompanyAccount } from "@/api/company/index.js";
import message from "@/utils/message.js";

// 初始化公司列表
const companyList = reactive([]);

// 页码数据
const pageData = reactive({
  name: '',
  city: '',
  pageSize: 5,
  pageNum: 1,
  total: 0,
});
const loading = ref(false);

// 获取公司列表数据
const getCompanyList = async () => {
  loading.value = true;
  const res = await getCompanyAccount(pageData);
  loading.value = false;
  pageData.total = res.data.total;
  companyList.splice(0, companyList.length, ...res.data.records);
  console.log("获取的数据：", res);
};
// 搜索
const getSearch = () => {
  getCompanyList();
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageData.pageSize = val;
  getCompanyList();
};

// 处理当前页变化
const handleCurrentChange = (val) => {
  pageData.pageNum = val;
  getCompanyList();
};

// 页面加载时获取数据
onMounted(() => {
  getCompanyList();
});





// 定义封禁对话框的控制变量
const banDialogVisible = ref(false);
// 解封对话框
const unbanDialogVisible = ref(false);
const banData = ref({
  id: '',
  banReason: ''
});
const banCompanyName = ref('');
const unbanCompanyName = ref('');


// 打开封禁对话框
const openBanDialog = (row) => {
  console.log('封禁', row);
  banData.value.id = row.companyId;
  banCompanyName.value = row.companyName;
  banDialogVisible.value = true; // 显示对话框
};

// 封禁操作
const banCompany = async () => {

  if (!banData.value.banReason) {
    message.error('请输入封禁原因');
    return;
  }

  console.log('数据提提交之前',banData.value);
  const res = await banCompanyAccount(banData.value);
  console.log(res);
  if(res.code === 200) {
    message.success(res.message);
    getCompanyList(); // 获取列表数据
  }else {
    message.error("封禁失败");
  }

  // 关闭对话框
  banDialogVisible.value = false;
  banData.value.banReason = ''; // 清空封禁原因输入


};

// 打开解封对话框
const openUnbanDialog = (row) => {
  unbanCompanyName.value = row.companyName;
  unbanDialogVisible.value = true; // 显示解封对话框
};

// 解封操作
const unban = async (row) => {
  openUnbanDialog(row);
};

// 确认解封操作
const confirmUnban = async (row) => {
  const res = await unbanCompanyAccount(row.companyId);
  if (res.code === 200) {
    message.success('解封成功');
    row.accountStatus = 1; // 设置为正常
    row.banReason = null; // 清空封禁原因
    console.log(`解封公司: ${row.companyName}`);
  }else {
    message.error(res.message);
  }
  unbanDialogVisible.value = false; // 关闭解封对话框
};


// 删除操作
const deleteDialogVisible = ref(false);
const deleteCompanyId = ref(null);
const deleteCompanyName = ref('');

// 打开删除对话框
const openDeleteDialog = (row) => {
  deleteCompanyId.value = row.companyId;
  deleteCompanyName.value = row.companyName;
  deleteDialogVisible.value = true;
};


// 执行删除操作
const deleteCompany = async () => {
  const res = await deleteCompanyAccount(deleteCompanyId.value);
  if (res.code === 200) {
    message.success('删除成功');
    getCompanyList(); // 刷新列表数据
  } else {
    message.error("删除失败");
  }

  // 关闭删除对话框
  deleteDialogVisible.value = false;
};



// 清空封禁原因输入
const resetBanReason = () => {
  banData.value.banReason = '';
};







</script>

<template>
  <div class="container">

    <!-- 搜索框 -->
    <div class="search">
      <el-input v-model="pageData.name" placeholder="请输入公司名字" />
      <el-input v-model="pageData.city" placeholder="请输入所在城市" />
      <el-button type="primary" @click="getSearch">搜索</el-button>
    </div>

   <div class="table">
     <!-- 表格显示公司列表 -->
     <el-table v-loading="loading" :data="companyList" :header-cell-style="{
            'background-color': '#1989fa',
            'color': '#fff',
            'font-weight': '400'
        }" style="width: 100%" :row-style="{height:60+'px'}" >
       <el-table-column prop="companyName"  label="公司名字" width="200">
         <template #default="{ row }">
      <span>
        {{ row.companyName }}
      </span>
         </template>
       </el-table-column>
       <el-table-column prop="companyUsername" label="公司用户名" width="120" />
       <el-table-column prop="companyAvatar" label="公司头像" width="120">
         <template #default="{ row }">
           <img :src="row.companyAvatar" alt="Avatar" width="60" height="60" />
         </template>
       </el-table-column>
       <el-table-column prop="accountStatus" label="账号状态" width="180">
         <template #default="{ row }">
           <el-tag
               :type="row.accountStatus === 1 ? 'success' : 'danger'"
               :style="{ borderRadius: '50%', padding: '5px 10px', fontSize: '14px' }">
      <span
          :style="{ color: row.accountStatus === 1 ? 'green' : 'red', fontWeight: 'bold' }">
        {{ row.accountStatus === 1 ? '正常' : '封禁' }}
      </span>
           </el-tag>
         </template>
       </el-table-column>

       <el-table-column prop="companyLocation" label="公司地址" width="200" />
       <el-table-column prop="companyEmail" label="公司邮箱" width="200" />
       <el-table-column prop="companyPhone" label="公司电话" width="200" />
       <el-table-column prop="companyLicense" label="公司执照" width="250" />
       <el-table-column fixed="right" label="操作" min-width="220">
         <template #default="{ row }">
           <!-- 封禁按钮 -->
           <el-button plain type="danger" size="small" @click="openBanDialog(row)">
             封禁
           </el-button>
           <!-- 解封按钮 -->
           <el-button plain type="success" size="small" @click="unban(row)">
             解封
           </el-button>
           <el-button  type="danger" size="small" @click="openDeleteDialog(row)">
             删除
           </el-button>
         </template>
       </el-table-column>
     </el-table>





   </div>

    <div class="foot">
      <!-- 分页 -->
      <el-pagination
          v-model:current-page="pageData.pageNum"
          v-model:page-size="pageData.pageSize"
          :page-sizes="[5, 10, 30, 50]"
          layout="prev, pager, next, sizes, total"
          :total="pageData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>


    <!-- 封禁原因输入框的对话框 -->
    <el-dialog
        v-model="banDialogVisible"
        title="请输入封禁原因"
        @close="resetBanReason"
    >
      <div class="title">封禁公司：<span style="color: red">{{banCompanyName}}</span></div>
      <el-input
          v-model="banData.banReason"
          type="textarea"
          placeholder="请输入封禁原因"
          maxlength="100"
          show-word-limit
          class="inputReason"
      ></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button @click="banDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="banCompany">确认封禁</el-button>
    </span>
    </el-dialog>


    <!-- 解封确认对话框 -->
    <el-dialog
        v-model="unbanDialogVisible"
        title="确认解封公司"
        @close="unbanDialogVisible = false">
      <div class="title">解封公司：<span style="color: red">{{unbanCompanyName}}</span></div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="unbanDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUnban(companyList.find(item => item.companyName === unbanCompanyName))">
            确认解封
          </el-button>
        </span>
    </el-dialog>


    <!-- 删除确认对话框 -->
    <el-dialog
        v-model="deleteDialogVisible"
        title="确认删除"
        @close="deleteDialogVisible = false"
    >
      <div class="title">您确定要删除公司：<span style="color: red">{{ deleteCompanyName }}</span> 吗？</div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteCompany">确认删除</el-button>
        </span>
    </el-dialog>


  </div>
</template>

<style scoped lang="scss">
/* 可以根据需求自定义样式 */
.container {
  padding: 20px;
  .table {
    margin: 20px;
    width: 1000px;
  }
  .search {
    width: 400px;
    display: flex;
    gap: 30px;
  }
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .inputReason {
    margin-bottom: 20px;
    height: 100px;
    :deep(.el-textarea__inner) {
      resize: none !important;
    }

  }


}
</style>
