<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" title="界面自定义" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-desc">
			<view class="row">首页</view>
		</view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">瀑布流</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.diy_scene_1_post_list_style == 1 ? config2_waterfall.scene_1 : myUserInfo.setting.diy_scene_1_post_list_style == 3 "
						 @change="(e) => _switch('diy_scene_1_post_list_style', e.detail.value ? 3 : 2)"/>
					</view>
				</view>
			</view>
		</view>
		
		<view class="page-block-gap"></view>
		<view class="setting-desc">
			<view class="row">圈子</view>
		</view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">瀑布流</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.diy_scene_6_post_list_style == 1 ? config2_waterfall.scene_6 : myUserInfo.setting.diy_scene_6_post_list_style == 3 " @change="(e) => _switch('diy_scene_6_post_list_style', e.detail.value ? 3 : 2)"/>
					</view>
				</view>
			</view>
		</view>
		<view class="setting-desc">
			<view class="row">提示：有部分圈主强制显示瀑布流或列表式</view>
		</view>
		
		<view class="page-block-gap"></view>
		<view class="setting-desc">
			<view class="row">话题</view>
		</view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">瀑布流</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.diy_scene_7_post_list_style == 1 ? config2_waterfall.scene_7 : myUserInfo.setting.diy_scene_7_post_list_style == 3 " @change="(e) => _switch('diy_scene_7_post_list_style', e.detail.value ? 3 : 2)"/>
					</view>
				</view>
			</view>
		</view>
		
		<view class="page-block-gap"></view>
		<view class="setting-desc">
			<view class="row">用户</view>
		</view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">瀑布流</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.diy_scene_8_post_list_style == 1 ? config2_waterfall.scene_8 : myUserInfo.setting.diy_scene_8_post_list_style == 3 " @change="(e) => _switch('diy_scene_8_post_list_style', e.detail.value ? 3 : 2)"/>
					</view>
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
	
	const mixins = require('@/mixins/user')
	var options = {};
	mixins(options);
	
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
		},
		computed:{
			config2_waterfall:{
				get(){
					let that = this;
					if(that.$store.state.config2.waterfall){
						return that.$store.state.config2.waterfall;
					}
					return {
						scene_1: false,
						scene_6: false,
						scene_7: false,
						scene_8: false,
					};
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 95,
				postListRange: [{ label: '列表式', value: 1 }, { label: '瀑布流', value: 2 }],
				postListTip: {1: '列表式', 2: '瀑布流'},
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
			that.updateScene(95, 0, true, false, 0, 2);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			_switch(key, value){
				let that = this;
				that.userSettingUpdate(key, value).then((res)=>{
					uni.wen.toUrl(-1, null);
				})				
			}
		}
	};
</script>
<style lang="scss">
@import '@/pagesA/static/css/setting.scss';
</style>
