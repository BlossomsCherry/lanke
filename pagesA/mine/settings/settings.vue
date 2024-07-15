<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body box" style="height: 100%;">
		<navBar :back="true" :home="fph" title="设置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="transparent">

		</navBar>
		<view style="height: 30rpx;"></view>
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/shield/shield')" class="row">
				<view class="left">
					<view class="title">屏蔽设置</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/privacy/privacy')" class="row">
				<view class="left">
					<view class="title">隐私设置</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		
		<view class="setting-box">
			<block v-if="config_pays && config_pays.paycode_22">
				<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/theme/theme')" class="row">
					<view class="left">
						<view class="title">深色模式</view>
					</view>
					<view class="right">
						<i class="mini-icon mini-youjiantou"></i>
					</view>
				</view>
				<view class="line"></view>
			</block>
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/diy/diy')" class="row">
				<view class="left">
					<view class="title">界面调整</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/about/about')" class="row">
				<view class="left">
					<view class="title">关于我们</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view @tap.stop.prevent="toSliderUrl(6, '/pages/web-view/index?url=' + config_app_basic_intro_page)" class="row">
				<view class="left">
					<view class="title">下载App</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<!-- #endif -->
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/admin/index')" class="row" v-if="isOfficial > 1">
				<view class="left">
					<view class="title">管理页面</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		<view class="setting-box">
			<view @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/logoff/logoff')" class="row">
				<view class="left">
					<view class="title">注销账号</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
			<view class="line"></view>
			<view class="row" @tap.stop.prevent="handlerClearCache">
				<view class="left">
					<view class="title">清除缓存</view>
				</view>
				<view class="right">
					<i class="mini-icon mini-youjiantou"></i>
				</view>
			</view>
		</view>
		<view class="page-block-gap"></view>
		
		<view class="setting-box shutLogin">
			<view class="row" @tap.stop.prevent="shutLogin">
				<view class="left">
					<view class="title">退出登录</view>
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
			config_pays:{
				get(){
					let that = this;
					if(that.$store.state.config && that.$store.state.config.pays){
						return that.$store.state.config.pays || {};
					}
					return {};
				},
				set(v){}
			}
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 46,
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
			that.updateScene(46, 0, true, false, 0, 2);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			handlerClearCache: function(e) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '清除缓存 需要重新登录',

					success(res) {
						if (res.confirm) {
							uni.clearStorageSync();
							that.$store.dispatch('initConfig');
							
							that.$store.commit('updateUserInfo', {
		id: 0,
		user_name: '未登录用户',
		user_avatar: '',
		avatar_frame_url: '',
		user_introduce: '这个人很懒，还没有简介',
		user_background_maps: '',
		user_background_color: '63,47,45',
		phone: '',
		country_code: '86',
		real_name: '',
		wechat_account: '',
		university: '',
		paycode: '',
		coins: 0,
		lv: 1,
		is_authentication: false,
		is_member: false,
		is_official: false,
		is_played: false,
		gender: 0,
		age: '',
		user_labels: [],
		constellation: '',
		club_id: null,
		follow_count: 0,
		follow_user_count: 0,
		like_count: 0,
		longitude: 0,
		latitude: 0,
		setting: {
			privacy_message_me: 1,
			privacy_collected_post_show: 1,
			privacy_my_follow_show: 1,
			privacy_follow_me_show: 1,
			privacy_personal_recommend: 1,
			privacy_personal_ad: 1,
			privacy_personal_geo_title: 1,
			diy_scene_1_post_list_style: 1,
			diy_scene_6_post_list_style: 1,
			diy_scene_7_post_list_style: 1,
			diy_scene_8_post_list_style: 1,
		},
		leftPanel: [
			{
				icon: "mini-icon2 mini-wodeqianbao",
				target_id: "/pagesA/mine/earnings/earnings",
				target_type: 6,
				text: "我的钱包",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-zhifumima",
				target_id: "/pagesA/mine/paycode/paycode?direct=0",
				target_type: 6,
				text: "支付密码",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-xiaofeijilu",
				target_id: "/pagesA/mine/order/order",
				target_type: 6,
				text: "消费记录",
				type: 1,
			},
			{
				type: 0,
			},
			{
				icon: "mini-icon2 mini-wodedingdan",
				target_id: "/pagesA/shop/order/order",
				target_type: 6,
				text: "我的买入",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-wodegouwudai",
				target_id: "/pagesA/shop/cart/cart",
				target_type: 6,
				text: "我的购物袋",
				type: 1,
			},
			{
				icon: "mini-icon2 mini-shouhuodizhi",
				target_id: "/pagesA/mine/address/address?id=0",
				target_type: 6,
				text: "收货地址",
				type: 1,
			},
			{
				type: 0,
			},
			{
				icon: "mini-icon2 mini-woderenzheng",
				target_id: "/pagesA/mine/certification/certification",
				target_type: 6,
				text: "我的认证",
				type: 1
			},
			{
				icon: "mini-icon2 mini-wodequanzi",
				target_id: "/pagesA/mine/circleaudit/circleaudit",
				target_type: 6,
				text: "我的圈子",
				type: 1,
			}
		],
		publish: [],
		timeStamp: 0
	});
							uni.$store.commit('updateToken', '');
							
							if(uni.$store.state.websocket){
								uni.$store.state.websocket.close();
							}
							
							uni.showToast({
								title: '清除完毕'
							});
							
							setTimeout(function(){
								if(that.$store.state.scene == 14){
									return;
								}
								that.myToast({
									closeAll: 1
								});
								uni.wen.toUrl(-4, null, null);
							}, 500);
							
						}
					}
				});
			},

			shutLogin: function(e) {
				let that = this;
				uni.removeStorageSync("token");
				uni.$store.commit('updateToken', '');
				
				uni.removeStorageSync("userInfo");
				that.$store.commit('updateUserInfo', 
				{
					id: 0,
					user_name: '未登录用户',
					user_avatar: '',
					avatar_frame_url: '',
					user_introduce: '这个人很懒，还没有简介',
					user_background_maps: '',
					user_background_color: '63,47,45',
					phone: '',
					country_code: '86',
					real_name: '',
					wechat_account: '',
					university: '',
					paycode: '',
					coins: 0,
					lv: 1,
					is_authentication: false,
					is_member: false,
					is_official: false,
					is_played: false,
					gender: 0,
					age: '',
					user_labels: [],
					constellation: '',
					club_id: null,
					follow_count: 0,
					follow_user_count: 0,
					like_count: 0,
					longitude: 0,
					latitude: 0,
					setting: {
						privacy_message_me: 1,
						privacy_collected_post_show: 1,
						privacy_my_follow_show: 1,
						privacy_follow_me_show: 1,
						privacy_personal_recommend: 1,
						privacy_personal_ad: 1,
						privacy_personal_geo_title: 1,
						diy_scene_1_post_list_style: 1,
						diy_scene_6_post_list_style: 1,
						diy_scene_7_post_list_style: 1,
						diy_scene_8_post_list_style: 1,
					},
					leftPanel: [
						{
							icon: "mini-icon2 mini-wodeqianbao",
							target_id: "/pagesA/mine/earnings/earnings",
							target_type: 6,
							text: "我的钱包",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-zhifumima",
							target_id: "/pagesA/mine/paycode/paycode?direct=0",
							target_type: 6,
							text: "支付密码",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-xiaofeijilu",
							target_id: "/pagesA/mine/order/order",
							target_type: 6,
							text: "消费记录",
							type: 1,
						},
						{
							type: 0,
						},
						{
							icon: "mini-icon2 mini-wodedingdan",
							target_id: "/pagesA/shop/order/order",
							target_type: 6,
							text: "我的买入",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-wodegouwudai",
							target_id: "/pagesA/shop/cart/cart",
							target_type: 6,
							text: "我的购物袋",
							type: 1,
						},
						{
							icon: "mini-icon2 mini-shouhuodizhi",
							target_id: "/pagesA/mine/address/address?id=0",
							target_type: 6,
							text: "收货地址",
							type: 1,
						},
						{
							type: 0,
						},
						{
							icon: "mini-icon2 mini-woderenzheng",
							target_id: "/pagesA/mine/certification/certification",
							target_type: 6,
							text: "我的认证",
							type: 1
						},
						{
							icon: "mini-icon2 mini-wodequanzi",
							target_id: "/pagesA/mine/circleaudit/circleaudit",
							target_type: 6,
							text: "我的圈子",
							type: 1,
						}
					],
					publish: [],
					timeStamp: 0
				},
				);
				
				if(uni.$store.state.websocket){
					uni.$store.state.websocket.close();
				}
				
				uni.reLaunch({
					url: '/pages/tabbar/index/index'
				});
			}
		}
	};
</script>
<style lang="scss">
@import '@/pagesA/static/css/setting.scss';
</style>
