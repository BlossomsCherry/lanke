<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" title="屏蔽设置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/shield/users?id=7')" class="row">
				<view class="left">
					<view class="title">黑名单</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/shield/users?id=8')" class="row">
				<view class="left">
					<view class="title">不喜欢的用户</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/shield/posts')" class="row">
				<view class="left">
					<view class="title">不喜欢的笔记</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
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
	
	
	
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		computed:{
			config_app_basic_intro_page:{
				get(){
					let that = this;
					return that.$store.state.config.app.basic.intro_page;
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 77,
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
			that.updateScene(77, 0, true, false, 0, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			
		}
	};
</script>
<style lang="scss">
@import '@/pagesA/static/css/setting.scss';
</style>
