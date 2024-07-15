<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" title="隐私设置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-desc">
			<view class="row">互动</view>
		</view>
		<view class="setting-box">
			<view class="row">
				<view class="left">
					<view class="title">谁可以私信我</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<picker class="_picker" :range="messageMeRange" range-key="label" @change="(e) => userSettingUpdate('privacy_message_me', parseInt(e.detail.value) + 1)" mode="selector" :value="myUserInfo.setting.privacy_message_me - 1">
						  <view class="_picker_tip">{{ messageTip[myUserInfo.setting.privacy_message_me] }}</view>
						</picker>
						<i class="mini-icon mini-youjiantou"></i>
					</view>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/collect')" class="row">
				<view class="left">
					<view class="title">我的收藏</view>
				</view>
				<view class="right">
					<view class="flex-row">
						<view class="tip">{{ myUserInfo.setting.privacy_collected_post_show == 1 ? '已公开' : '已关闭' }}</view>
						<i class="mini-icon mini-youjiantou"></i>
					</view>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		<view class="setting-desc">
			<view class="row">关系</view>
		</view>
		
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/follow')" class="row">
				<view class="left">
					<view class="title">关注与粉丝列表</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/recomuser')" class="row">
				<view class="left">
					<view class="title">推荐可能认识的人</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
		</view>
		
		<view class="page-block-gap"></view>
		<view class="setting-desc">
			<view class="row">更多</view>
		</view>
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/personal')" class="row">
				<view class="left">
					<view class="title">个性化选项</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/ad')" class="row">
				<view class="left">
					<view class="title">程序化广告设置</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view class="row">
				<view class="left">
					<view class="title">允许地理标题推荐</view>
				</view>
				<view class="right">
					<switch class="_switch" :color=" primaryColor " :checked=" myUserInfo.setting.privacy_personal_geo_title == 1 "  @change="(e) => userSettingUpdate('privacy_personal_geo_title', e.detail.value ? 1 : 2)"/>
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
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 89,
				messageMeRange: [{ label: '关注我的人', value: 1 }, { label: '我关注的人', value: 2 }, { label: '互相关注的人', value: 3 }, { label: '禁止私信', value: 4 }],
				messageTip: {1: '关注我的人', 2: '我关注的人', 3: '互相关注的人', 4: '禁止私信'},
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
			that.updateScene(89, 0, true, false, 0, 0);
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
