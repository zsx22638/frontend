<template>
	<view class="home_container">
		
		<up-search v-model="data.keyword" shape="round" bgColor="white" @search="goSearch"></up-search>

		<view>
			<up-dropdown>


				<up-dropdown-item v-model="city" :title="selectedCity" :options="options1"
					@change="changeLocation(city)" class="dropdown-scrollable">
				</up-dropdown-item>


				<up-dropdown-item v-model="salary" :title="selectedSalary" :options="options2"
					@change="changeSalary(salary)">
				</up-dropdown-item>


				<!-- 新增筛选项：工资排序 -->
				<up-dropdown-item v-model="sortBySalary" :title="selectedSortSalary" :options="salarySortOptions"
					@change="changeSalarySort(sortBySalary)">
				</up-dropdown-item>

				<!-- 新增筛选项：按最新排序 -->
				<up-dropdown-item v-model="sortByDate" :title="selectedSortByDate" :options="dateSortOptions"
					@change="changeSortByDate(sortByDate)">
				</up-dropdown-item>

			</up-dropdown>
		</view>

		<view v-if="positions?true:false">
			<view v-for="(item, index) in positions" :key="index" @click="goToPositionDetail(item)">
				<Card  :data="item" ></Card>
			</view>
			
		</view>
		<view v-else>
			暂无相应职位
		</view>

		<up-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
			:nomore-text="nomoreText" color="#007aff" lineColor="#007aff" dashed line />
		<!-- 返回顶部按钮 -->
		<button v-if="showBackToTop" class="back-to-top" @click="scrollToTop"><up-icon
				name="arrow-up"></up-icon></button>
	</view>
</template>

<script setup>
	import {
		onShow,
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		getPositionList
	} from '@/api/index.js';
	import {
		reactive,
		ref,
		computed,
		onUnmounted,
		onMounted,
		onBeforeUnmount
	} from 'vue';

	// 创建响应式数据  
	const status = ref('loadmore');
	const loadmoreText = ref('上拉加载更多');
	const loadingText = ref('努力加载中');
	const nomoreText = ref('实在没有了');


	// 响应式数据
	const data = reactive({
		keyword: "",
		page: 1,
		pageSize: 10,
		minSalary: null,
		maxSalary: null,
		sortBySalary: '',
		sortByDate: '',
		city: ''
	});

	// 响应式数组，用来存储职位列表数据
	const positions = ref([]);

	const hasMore = ref(true); // 是否还有更多数据

	// 获取数据
	const getData = async () => {
		try {
			status.value = 'loading'
			const res = await getPositionList(data); // 调用API获取职位数据

			if (res.code === 200) {
				if (res.data.records.length < data.pageSize) {
					status.value = 'nomore'
					hasMore.value = false; // 设置 hasMore 为 false
				}
				if (data.page == 1) {
					// 将当前页的职位数据添加到 positions 中
					positions.value = res.data.records;
				} else if (data.page > 1) {
					positions.value = [...positions.value, ...res.data.records];
				}

				console.log(res)
			}
		} catch (error) {
			console.error("获取职位数据失败", error);
		}
	};
	
	//去职位详情页面
	const goToPositionDetail = (item) => {
		// console.log(item)
		console.log('执行了！')
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
	
	
	

	const loadMore = () => {
		if (!hasMore.value) return; // 如果没有更多数据，直接返回
		data.page += 1; // 翻页，增加当前页码
		getData(); // 获取下一页数据
	};

	onReachBottom(() => {
		loadMore(); // 调用加载更多数据的方法
	});


	// 搜索函数
	const goSearch = (keyWord) => {
		console.log('去搜索', keyWord);
		data.keyword = keyWord; // 更新搜索关键字
		data.page = 1; // 搜索时重置到第一页
		positions.value = []; // 清空之前的职位数据
		getData(); // 调用获取数据的函数
	};




	// 页面显示时获取数据
	onShow(() => {
		if (positions.value.length === 0) {
			getData(); // 只有在 positions 为空时才加载数据
		}
	});





	const city = ref(null) // 默认不选中任何城市
	const salary = ref(null) // 默认不选中任何薪资范围
	
	//这2个条件冲突
	const sortBySalary = ref(false)//默认就是不按照工资分类
	const sortByDate = ref(false)//默认不按照最新分类


	const options1 = [{
			label: '清除筛选',
			value: ''
		},
		{
			label: '北京',
			value: '北京'
		},
		{
			label: '上海',
			value: '上海'
		},
		{
			label: '深圳',
			value: '深圳'
		},
		{
			label: '广州',
			value: '广州'
		},
		{
			label: '杭州',
			value: '杭州'
		},
		{
			label: '成都',
			value: '成都'
		},
		{
			label: '重庆',
			value: '重庆'
		},
		{
			label: '武汉',
			value: '武汉'
		},
		{
			label: '南京',
			value: '南京'
		},
		{
			label: '西安',
			value: '西安'
		},
		{
			label: '苏州',
			value: '苏州'
		},
		{
			label: '天津',
			value: '天津'
		},
		{
			label: '长沙',
			value: '长沙'
		},
		{
			label: '郑州',
			value: '郑州'
		},
		{
			label: '青岛',
			value: '青岛'
		},
		{
			label: '合肥',
			value: '合肥'
		},
		{
			label: '佛山',
			value: '佛山'
		},
		{
			label: '东莞',
			value: '东莞'
		},
		{
			label: '宁波',
			value: '宁波'
		},
		{
			label: '厦门',
			value: '厦门'
		},
		{
			label: '福州',
			value: '福州'
		},
		{
			label: '济南',
			value: '济南'
		},
		{
			label: '大连',
			value: '大连'
		},
		{
			label: '珠海',
			value: '珠海'
		},
		{
			label: '无锡',
			value: '无锡'
		},
		{
			label: '昆明',
			value: '昆明'
		}
	];

	const options2 = [{
			label: '清除筛选',
			value: ''
		},
		{
			label: '0-4000',
			value: '0-4000'
		},
		{
			label: '4000-8000',
			value: '4000-8000'
		},
		{
			label: '8000以上',
			value: '8000-50000'
		},
	]

	const salarySortOptions = [{
			label: '清除筛选',
			value: ''
		},
		{
			label: '高到低',
			value: 'true'
		},
		{
			label: '低到高',
			value: 'false'
		},
	];

	const dateSortOptions = [{
			label: '清除筛选',
			value: ''
		},
		{
			label: '最新',
			value: 'true'
		},
		{
			label: '最旧',
			value: 'false'
		},
	];





	// 计算属性，根据 city 获取对应的城市名称
	const selectedCity = computed(() => {
		if (city.value === null) return '城市' // 如果没有选择，显示默认文字
		const selectedOption = options1.find(option => option.value === city.value)
		return selectedOption ? selectedOption.label : '请选择城市'
	})


	// 计算属性，根据 salary 获取对应的薪资范围
const selectedSalary = computed(() => {
  if (salary.value === null) return '薪资'; // 默认显示文字
  const selectedOption = options2.find(option => option.value === salary.value);
  console.log('调试打印', selectedOption);
  return selectedOption ? selectedOption.label : '请选择薪资';
});

	//薪资是否要排序
	const selectedSortSalary = computed(() => {
		if (sortBySalary.value === null) return '薪资排序';
		const selectedOption = salarySortOptions.find(option => option.value === sortBySalary.value);
		console.log('----------',selectedOption)
		return selectedOption ? selectedOption.label : '薪资排序';
	});

	const selectedSortByDate = computed(() => {
		if (sortByDate.value === null) return '发布时间';
		const selectedOption = dateSortOptions.find(option => option.value === sortByDate.value);
		return selectedOption ? selectedOption.label : '是否最新';
	});


	//城市条件
	const changeLocation = (NewValue) => {
		if (NewValue == '') {
			city.value = null
		}
		data.city = NewValue
		getData()
	}
	
	
	//薪资条件
const changeSalary = (NewValue) => {
  if (NewValue === '') {
    salary.value = null; // 置为 null，用于清除筛选
  } else {
    salary.value = NewValue; // 直接保存字符串形式
    const [minSalary, maxSalary] = NewValue.split('-').map(Number);
    data.minSalary = minSalary;
    data.maxSalary = maxSalary || 50000; // 如果没有上限，设置为 50000
  }
  getData(); // 调用数据刷新函数
};

	  
	const changeSalarySort = (NewValue) => {
		if (NewValue === '') {
			data.sortBySalary = ''; // 清除工资排序
		} else {
			data.sortBySalary = NewValue;
		}
		getData();
	};

	const changeSortByDate = (NewValue) => {
		if (NewValue === '') {
			data.sortByDate = ''; // 清除日期排序
		} else {
			data.sortByDate = NewValue;
		}
		getData();
	};






	//返回顶部的写法
	const showBackToTop = ref(false); // 是否显示返回顶部按钮
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth' // 平滑滚动
		});
	};

	// 监听页面滚动事件
	const handleScroll = () => {
		if (window.scrollY > 200) {
			showBackToTop.value = true;
		} else {
			showBackToTop.value = false;
		}
	};

	// 生命周期钩子：页面挂载时添加事件监听
	onMounted(() => {
		window.addEventListener('scroll', handleScroll);
	});

	// 生命周期钩子：页面卸载时移除事件监听
	onBeforeUnmount(() => {
		window.removeEventListener('scroll', handleScroll);
	});
</script>

<style lang="scss" scoped>
	::v-deep .u-cell-group__wrapper {
		max-height: 200px;
		/* 设置最大高度，适当调整 */
		overflow-y: auto;
		/* 添加垂直滚动条 */
	}



	.home_container {
		padding: 20rpx;
		background-color: #F4F4F5;
	}


	.back-to-top {
		position: fixed;
		bottom: 50px;
		right: 50px;
		color: black;
		border: none;
		width: 60px;
		height: 60px;
		background: none;
		/* 去掉背景 */
		font-size: 30px;
		cursor: pointer;
		z-index: 100;
	}

	/* 去除伪元素可能带来的边框 */
	.back-to-top::before,
	.back-to-top::after {
		border: none;
		/* 去掉伪元素的边框 */
		content: none;
		/* 如果伪元素存在内容，移除 */
	}
</style>