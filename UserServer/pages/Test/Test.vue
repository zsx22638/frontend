<!-- <template>
	<view>
		<view class="box" @click="Movehandler">
			{{count}}
		</view>
		<up-button @click="limitedHandler">测试lodash</up-button>
	</view>
</template>

<script setup>
	import _ from 'lodash';
import { ref } from 'vue';

	const handler = () => {
		let i = 1;
		i++;
		console.log(i)
	};

	// 使用 _.before 创建一个限制调用次数的处理程序
	const limitedHandler = _.before(4, handler);
	
	const count = ref(1)
	function change() {
		console.log('执行了')
		count.value = count.value + 1
	}
	//防抖就是  防止函数多次执行  单位时间内频繁触发，只执行最后一次
	// const Movehandler = _.debounce(change,500)
	//只要开了，就算你频繁触发，只能执行一次 不会被打断
	const Movehandler = _.throttle(change,5000)
	
</script>

<style>
	.box {
		width: 100%;
		background-color: antiquewhite;
		text-align: center;
		height: 200rpx;
		line-height: 200rpx;
	}
</style> -->


<template>
	<view class="dateTime">
		<text>面试时间：</text>
        <up-datetime-picker
		class="picker"
		hasInput 
            :show="show"
            v-model="interViewTime"
            mode="datetime"
			@confirm="confirmDate"
			placeholder = "请选择日期"
			@cancel="cancelDate"
        ></up-datetime-picker>
		
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onReady } from '@dcloudio/uni-app'
const show = ref(false);
const interViewTime = ref(new Date());


const confirmDate  = (value) => {
	console.log(value)
	show.value = false
}

const cancelDate = () => {
	show.value = false
}


</script>
<style lang="scss" scoped>
	.dateTime {
		padding: 20rpx;
		width: 600rpx;
		display: flex;
		align-items: center;
		text {
			color: $uni-color-primary;
		}
		.picker {
			
			flex:2;
		}
	}

</style>