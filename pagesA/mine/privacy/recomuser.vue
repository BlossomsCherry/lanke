<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" title="收藏隐私设置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-desc"></view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">不给我推荐可能认识的人</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.privacy_personal_recommend_user == 2 " @change="(e) => userSettingUpdate('privacy_personal_recommend_user', e.detail.value ? 2 : 1)"/>
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
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 94,
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
			that.updateScene(94, 0, true, false, 0, 0);
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
