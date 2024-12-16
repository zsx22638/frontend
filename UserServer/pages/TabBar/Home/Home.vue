<template>
	<view class="home_container">
		<up-search  shape="round" bgColor="white" @focus="goSearch"></up-search>
	
		<up-swiper
		:list="CarouselsList"
		keyName="imageUrl"
		showTitle
		:autoplay="true"
		circular
		:loading="loading"
		:indicator="true"
		height="200"
		>
		</up-swiper>
		
	<button @click="changePosition" class="change-button">换一换</button>

		
		
		<view class="positonIcon" v-if="showPosition">
			<up-loading-icon text="加载中..." textSize="18"></up-loading-icon>
		</view>
		<view class="positonView">
			<view  class="positionItem"
			 v-for="(item,index) in PositionList" 
			 :key="item.positionId" 
			 @click="goToPositionDetail(item)" 
			 v-if="!showPosition"
			:class="{ active: item.positionSalary > 7000 }"
			 >
				<view class="tag"></view>
				<view class="top">
					<view class="positionName">{{item.positionName}}</view>
					
				</view>
				<view class="companyName">
					{{item.companyName}}
				</view>
	
				<view class="bottom">
					<view class="companyLocation">
						{{item.companyLocation}}
					</view>
					<view class="positionSalary" :class="{ activeColor: item.positionSalary > 7000 }">{{item.positionSalary}}元</view>
				</view>
				
			</view>
			
		</view>
		<view v-for="(item, index) in RandomPositionList" :key="item.positionId" @click="goToPositionDetail(item)">
			<Card  :data="item" ></Card>
		</view>
		
		
		<view class="morePosition" @click="goSearch">
		更多职位
		</view>
			<navigator url="/pages/Test/Test">去测试页面</navigator>
		
	</view>
</template>

<script setup>
	import { getCarousels,getPositionList } from '@/api/index.js'
	import { onShow} from '@dcloudio/uni-app'
	import { ref,onMounted } from 'vue';	
	import { route } from 'uview-plus';
	import _ from 'lodash'
	
	const data = ref({
		"page": 1,
		"pageSize": 50
	})
	
	const loading = ref(true)
	
	const goSearch = () => {
		route('/pages/TabBar/Home/SearchPosition/SearchPosition')
	}
	
	
	
	const CarouselsList = ref([])
	
	const PositionList = ref([])
	
	const showPosition = ref(true)
	
	const RandomPositionList = ref([])
	
	//获取轮播图数据
	const getData = async () => {
		const res = await getCarousels()
		loading.value = false
		console.log('轮播图数据:',res)
		CarouselsList.value = res.data
	}

	
	//获取所以职位随机返回
	const getPosition = async () => {
			showPosition.value = true
			const res = await getPositionList(data.value)
		if(res.code === 200) {
			console.log('获取的轮播图数据：',res.data.records)
			PositionList.value = _.sampleSize( res.data.records,4)
			RandomPositionList.value = _.sampleSize( res.data.records, 6)
			console.log('数据是：',PositionList.value)
			showPosition.value = false
		}
		
	}
	
	const changePosition = () => {
		getPosition()
	}
	
	onShow(() => {
		getData()
		getPosition()
	})
	
	
	
	//去职位详情页面
	const goToPositionDetail = (item) => {
		// console.log(item)
	
		uni.navigateTo({
			url: '/pages/TabBar/Home/PositionDetail/PositionDetail',
	
			events: {
				// 监听 test.vue 页面传递的数据
				acceptDataFromOpenedPage: function(data) {
					console.log('收到来自子页面的数据:', data);
				}
			},
			success: function(res) {
				// 在跳转成功后，通过 eventChannel 向 test.vue 页面发送数据
				const eventChannel = res.eventChannel;
				eventChannel.emit('acceptDataFromOpenerPage', {
					data: item
				});
			}
		});
	
	
	
	}
	
	

	
	
	
	
</script>

<style lang="scss" scoped>
	.home_container {
		padding: 20rpx;
		background-color: #F4F4F5;
		::v-deep .u-swiper__wrapper__item__wrapper {
			margin: 20rpx 0rpx;
		}
	}
	

	
		.positonView {
			margin-top: 20rpx;
			margin-bottom: 150rpx;
			height: 500rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			
		.positionItem {
			height: 300rpx;
			width: calc(50% - 10rpx); /* 减去间隙的一半，避免超出容器宽度 */
			background-color: lightslategray;
			padding: 20rpx;
			box-sizing: border-box;
			padding: 25rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
			
			 &.active {
			    border: 2rpx solid #ff9800; /* 高亮边框 */
			    box-shadow: 4px 4px 10px rgba(255, 152, 0, 0.3); /* 增强阴影效果 */
			    
			  }
			
			.tag {
				width: 50rpx;
				height: 15rpx;
				background: linear-gradient(to right, #007bff, #00c6ff); /* 按钮渐变 */
				margin-bottom: 30rpx;
			}
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.positionName {
				  color: #007bff;
				  font-size: 30rpx;
				  height: 40rpx;
				  line-height: 40rpx;
				  overflow: hidden; /* 超出隐藏 */
				  white-space: nowrap; /* 禁止换行 */
				  text-overflow: ellipsis; /* 显示省略号 */
				  max-width: calc(7 * 30rpx); /* 设置宽度以限制字符数 */
				}

				.positionSalary {
					font-size: 24rpx;
				}
			}
			
			.companyName {
				font-size: 25rpx;
				margin-top: 30rpx;
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 隐藏溢出的文本 */
				text-overflow: ellipsis;
				color: #7D7D7D;
			}
			
			.bottom {
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				font-size: 25rpx;
				justify-content: space-between;
				.positionSalary {
					color: #127CF2;
					font-size: 30rpx;
					font-weight: 800;
					margin-right: 20rpx;
					&.activeColor {
						color: red;
					}
				}
				
				
			}
			
		}
	}
	
	.positonIcon {
		height: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.change-button {
	  width: 200rpx;
	  height: 60rpx;
	  border: none;
	  border-radius: 30rpx; /* 圆角 */
	  background: linear-gradient(to right, #007bff, #00c6ff); /* 渐变背景 */
	  color: #fff;
	  font-size: 28rpx;
	  font-weight: bold;
	  text-align: center;
	  box-shadow: 2px 2px 8px rgba(0, 123, 255, 0.5); /* 阴影 */
	  cursor: pointer;
	  transition: all 0.3s ease;
	  line-height: 60rpx;
	  margin-top:20rpx;
	  &:hover {
	    transform: translateY(-5rpx); /* 悬浮效果 */
	    box-shadow: 4px 4px 12px rgba(0, 123, 255, 0.8); /* 加强阴影 */
	  }
	
	  &:active {
	    transform: scale(0.95); /* 点击时缩小 */
	    background: linear-gradient(to right, #0056b3, #0096c7); /* 点击时颜色变化 */
	  }
	}
	
	.morePosition {
		color: #007bff;
		text-align: center;
		padding:0rpx 20rpx;
	}

</style>
