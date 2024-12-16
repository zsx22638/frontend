<template>
	<view>

		<t-button size="large" theme="primary">填充按钮</t-button>
		<t-button size="large" theme="light">填充按钮</t-button>
		<t-button size="large">填充按钮</t-button>
		<view class="box" @click="Movehandler">
			{{count}}
		</view>
		<up-button @click="limitedHandler">测试lodash</up-button>
	</view>
</template>

<script setup>
	import _ from 'lodash';
	import {
		ref
	} from 'vue';

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
	const Movehandler = _.throttle(change, 5000)
</script>

<style>
	.box {
		width: 100%;
		background-color: antiquewhite;
		text-align: center;
		height: 200rpx;
		line-height: 200rpx;
	}
</style>