<script setup>
import { ref, computed } from "vue";
import chinaJson from "@/assets/china.json";
import * as echarts from "echarts";
import "echarts-gl"; // 引入 echarts-gl 以支持 3D 地图

// 注册地图数据
echarts.registerMap("china", chinaJson);

// 模拟数据：value 字段对应 Y 轴，name 字段对应 X 轴
const data = ref([
  { name: "北京", value: 199 },
  { name: "天津", value: 42 },
  { name: "河北", value: 102 },
  { name: "山西", value: 81 },
  { name: "内蒙古", value: 47 },
  { name: "辽宁", value: 67 },
  { name: "吉林", value: 82 },
  { name: "黑龙江", value: 123 },
  { name: "上海", value: 24 },
  { name: "江苏", value: 92 },
  { name: "浙江", value: 114 },
  { name: "安徽", value: 109 },
  { name: "福建", value: 116 },
  { name: "江西", value: 91 },
  { name: "山东", value: 119 },
  { name: "河南", value: 137 },
  { name: "湖北", value: 116 },
  { name: "湖南", value: 114 },
  { name: "重庆", value: 91 },
  { name: "四川", value: 125 },
  { name: "贵州", value: 62 },
  { name: "云南", value: 83 },
  { name: "西藏", value: 9 },
  { name: "陕西", value: 80 },
  { name: "甘肃", value: 56 },
  { name: "青海", value: 10 },
  { name: "宁夏", value: 18 },
  { name: "新疆", value: 10 },
  { name: "广东", value: 123 },
  { name: "广西", value: 59 },
  { name: "海南", value: 14 },
  { name: "香港", value: 11 },
  { name: "澳门", value: 35 },
  { name: "台湾", value: 22 },
]);
const option = computed(() => ({
  title: {
    text: "大数据检测平台 - 招聘人员地区分布情况",
    left: "center",
    top: 10,
    textStyle: {
      color: "#00FFFF", // 科技感蓝色字体
      fontSize: 18,
      fontWeight: "bold",
    },
  },
  backgroundColor: "rgba(9, 24, 48, 1)", // 深蓝色背景
  visualMap: {
    type: "piecewise",
    pieces: [
      { max: 30, label: "安全", color: "#1E90FF" }, // 浅蓝
      { min: 30, max: 60, label: "警告", color: "#4169E1" }, // 中蓝
      { min: 60, label: "危险", color: "#0000FF" }, // 深蓝
    ],
    textStyle: { color: "#00FFFF" },
    show: true,
  },
  geo: {
    map: "china",
    roam: false,
    layoutCenter: ["50%", "50%"],
    layoutSize: "100%",
    itemStyle: {
      normal: {
        borderColor: "rgba(0, 204, 255, 1)", // 浅蓝色边界线
        borderWidth: 1,
        areaColor: {
          type: "radial",
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            { offset: 0, color: "#0D2A54" }, // 深蓝渐变起始色
            { offset: 1, color: "#1E90FF" }, // 浅蓝渐变结束色
          ],
        },
        shadowColor: "rgba(0, 204, 255, 0.8)", // 蓝色光影效果
        shadowBlur: 10,
      },
      emphasis: {
        areaColor: "rgba(0, 191, 255, 1)", // 高亮区域颜色
        shadowColor: "rgba(0, 191, 255, 1)", // 高亮光影效果
        shadowBlur: 15,
      },
    },
  },
  series: [
    {
      type: "map",
      map: "china",
      data: data.value,
      label: {
        show: true,
        color: "#00FFFF", // 标签文字蓝色
        fontSize: 12,
        fontWeight: "bold",
      },
      itemStyle: {
        normal: {
          borderColor: "rgba(0, 204, 255, 1)",
          borderWidth: 0.5,
          areaColor: "rgba(13, 42, 84, 1)", // 蓝色区域
        },
        emphasis: {
          areaColor: "#4682B4", // 高亮蓝
          shadowBlur: 20,
          shadowColor: "rgba(0, 204, 255, 1)",
        },
      },
    },
  ],
}));

</script>

<template>
  <e-charts style="width: 100%; height: 800px;" :option="option" />
</template>
