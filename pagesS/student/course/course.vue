<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="课程详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="course-detail-content">
			<view class="inner">
				<block v-if="course">
					<view class="line">
						<view class="left">课程名称</view>
						<view class="right">{{ course.name }}</view>
					</view>
					<view class="line">
						<view class="left">老师</view>
						<view class="right">{{ course.teacher }}</view>
					</view>
					<view class="line">
						<view class="left">地址</view>
						<view class="right">{{ course.address }}</view>
					</view>
					<view class="line">
						<view class="left">上课</view>
						<view class="right">{{ course.rawWeeks }}</view>
					</view>
				</block>
			</view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 138,
			course: null
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(138, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		let course = JSON.parse(decodeURIComponent(options.course))
		if(course.name){
			console.log(course);
			that.course = course;
		}
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
	  
	}
}
</script>

<style lang="scss" scoped>
@import './course.scss';
</style>