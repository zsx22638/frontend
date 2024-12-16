<template>
  <view>
    <!-- 顶部分类栏 -->
    <up-sticky bgColor="#fff">
      <up-tabs :list="list1" lineWidth="30" @click="changeView" current="1"></up-tabs>
    </up-sticky>

    <!-- 显示按状态分组的内容 -->
    <view v-if="show === 0" class="InterViewCard" v-for="(item, index) in categorizedInterviews.pending" :key="item.interviewId">
      <!-- 这里显示待审核的内容 -->
      <view class="top">
        <view class="ellipsis">{{ item.positionName }}</view>
        <view>面试状态：
          <text :style="getStatusStyle(item.interviewStatus)">
            {{ getStatusText(item.interviewStatus) }}
          </text>
        </view>
      </view>
      <view class="buttom">
        <u-avatar :src="item.companyAvatar" size="50rpx"></u-avatar>
        <view class="end">{{ item.companyName }}</view>
        <up-button text="面试详情" plain size="small" type="primary" :style="customStyle" @click="goToDetail(item)"></up-button>
      </view>
    </view>

    <view v-if="show === 1" class="InterViewCard" v-for="(item, index) in categorizedInterviews.approved" :key="item.interviewId">
      <!-- 这里显示已通过的内容 -->
      <view class="top">
        <view class="ellipsis">{{ item.positionName }}</view>
        <view>面试状态：
          <text :style="getStatusStyle(item.interviewStatus)">
            {{ getStatusText(item.interviewStatus) }}
          </text>
        </view>
      </view>
      <view class="buttom">
        <u-avatar :src="item.companyAvatar" size="50rpx"></u-avatar>
        <view class="end">{{ item.companyName }}</view>
        <up-button text="面试详情" plain size="small" type="primary" :style="customStyle" @click="goToDetail(item)"></up-button>
      </view>
    </view>

    <view v-if="show === 2" class="InterViewCard" v-for="(item, index) in categorizedInterviews.rejected" :key="item.interviewId">
      <!-- 这里显示已拒绝的内容 -->
      <view class="top">
        <view class="ellipsis">{{ item.positionName }}</view>
        <view>面试状态：
          <text :style="getStatusStyle(item.interviewStatus)">
            {{ getStatusText(item.interviewStatus) }}
          </text>
        </view>
      </view>
      <view class="buttom">
        <u-avatar :src="item.companyAvatar" size="50rpx"></u-avatar>
        <view class="end">{{ item.companyName }}</view>
        <up-button text="面试详情" plain size="small" type="primary" :style="customStyle" @click="goToDetail(item)"></up-button>
      </view>
    </view>
  </view>
</template>


<script setup>
  import { ref, reactive, watch } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { userInfoStore } from '@/stores/useInfoStore.js';
  import { getUserInterViewList } from '@/api/index.js';
  import { route } from 'uview-plus';
  import _ from 'lodash'; // 引入 lodash

  const { userInfo } = userInfoStore();
  const interViewInfo = reactive([]); // 初始为空数组，动态更新为数据
  
  // 用来存储分组后的结果
  const categorizedInterviews = reactive({
    pending: [],
    approved: [],
    rejected: []
  });

  onShow(async () => {
    const res = await getUserInterViewList();
    interViewInfo.length = 0;  // 清空现有数据
    interViewInfo.push(...res.data); // 更新数据

    // 使用 lodash 的 groupBy 来分组数据
    const grouped = _.groupBy(interViewInfo, 'interviewStatus');

    // 更新分类后的数据
    categorizedInterviews.pending = grouped[0] || [];
    categorizedInterviews.approved = grouped[1] || [];
    categorizedInterviews.rejected = grouped[2] || [];
  });

  // 状态颜色变化
  const getStatusStyle = (status) => {
    switch (status) {
      case 0: return { color: 'gray' };  // 待审核：灰色
      case 1: return { color: 'green' }; // 已通过：绿色
      case 2: return { color: 'red' };   // 已拒绝：红色
      case 3: return { color: 'blue' };  // 预约成功：蓝色
      case 4: return { color: 'orange' }; // 预约失败：橙色
      default: return { color: 'black' }; // 默认颜色
    }
  };

  // 状态文本
  const getStatusText = (status) => {
    switch (status) {
      case 0: return '待处理';
      case 1: return '已通过';
      case 2: return '未通过';
      default: return '未知状态';
    }
  };

  // 默认显示已通过
  const show = ref(1);
  
  // 创建响应式数据
  const list1 = reactive([{
  		name: '待审核',
  		
  	},
  	{
  		name: '已通过',
  		
  	},
  	{
  		name: '未通过',
  	}
  
  ]);

  const changeView = (item, index) => {
    console.log('回调item', index);
    show.value = index;
  };

  // 按钮样式
  const customStyle = reactive({
    width: '150rpx'
  });

  // 去详情页函数
  const goToDetail = (item) => {
    console.log(item);
    const itemStr = JSON.stringify(item);
    route({
      url: 'pages/TabBar/InterView/InterViewDetail/InterViewDetail',
      params: { item: itemStr }
    });
  };
</script>



<style lang="scss" scoped>
	:deep(.u-tabs__wrapper__nav) {
		margin-left: 200rpx;
	
	}

	.InterViewCard {
		background-color: #d4e6ff;
		width: 85%;
		margin: auto;
		margin-top: 20rpx;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 25rpx;

		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
		.top {
			justify-content: space-between;
			font-size: 30rpx;
			display: flex;
			.ellipsis {
				font-size: 28rpx;
			  display: inline-block;       /* 保证省略号生效 */
			  max-width: 12em;             /* 限制最大宽度为 10 个字符宽 */
			  white-space: nowrap;         /* 防止换行 */
			  overflow: hidden;            /* 超出部分隐藏 */
			  text-overflow: ellipsis;     /* 超出部分显示省略号 */
			}
		}

		.mid {
			margin-top: 10rpx;
			display: flex;
			justify-content: space-between;

			view:nth-child(2) {
				font-size: 25rpx;
				color: orange;
			}
		}

		.buttom {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			
			.end {
			  flex-grow: 1; /* 中间部分的文本部分会占用剩余的空间 */
			  text-align: center; /* 可选，居中文本 */
			  margin-left: 20px; /* 左边距，增加间距 */
			  margin-right: 20px; /* 右边距，增加间距 */
			}
		}
	}
</style>