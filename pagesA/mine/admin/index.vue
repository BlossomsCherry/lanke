<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="admin-page mini-page-body">
		<navBar :back="true" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view slot="left" class="lxy-nav-bar__logo default">
				<image class="_image" :src="userInfo.user_avatar"/>
				<text class="_text" style="color: #000;">{{ userInfo.user_name }}</text>
			</view>
			<!-- #ifdef APP || H5 -->
			<!-- #endif -->
		</navBar>
		<view class="page-content">
			<view class="brand-wrap">
				<image :src="brand_logo" class="systen-brand"></image>
			</view>
			<view class="pay_code_0" v-if="!is_auth">您的《运营功能套餐包》未解锁* <i class="mini-icon mini-bangzhu" @tap.stop.prevent="toSliderUrl(6, '/pagesB/compare/compare')" style="display: inline-block; margin-left: 10px; opacity: 0.6;"></i></view>
			<view class="static-borad">
				<view class="first-tip">管理员, 您好, 您已进入移动端仪表盘</view>
				<view class="grid-wrap">
					<view class="left" @tap="toSliderUrl(6, '/pagesA/mine/users/users?id=2')">
						<view class="num" style="color: #0197fe;">{{ user_online }}</view>
						<view class="text">在线用户</view>
					</view>
					<view class="line-s"></view>
					<view class="mid" @tap="toSliderUrl(6, '/pagesA/mine/users/users?id=1')">
						<view class="num" style="color: #e8445c;">{{ user_total }}</view>
						<view class="text">总用户</view>
					</view>
					<view class="line-s"></view>
					<view class="mid" @tap="toSliderUrl(6, '/pagesA/mine/users/users?id=3')">
						<view class="num" style="color: #79a5cb;">{{ today_user_register }}</view>
						<view class="text">今日注册</view>
					</view>
				</view>
				<view class="grid-wrap">
					<view class="left" @tap="toSliderUrl(6, '/pagesA/mine/users/users?id=4')">
						<view class="num balance-color">{{ blance_total }}</view>
						<view class="text">总余额</view>
					</view>
					<view class="line-s"></view>
					<view class="mid" @tap="toSliderUrl(6, '/pagesA/mine/users/users?id=5')">
						<view class="num gold-color">{{ coins_total }}</view>
						<view class="text">总{{ config_app_coins_name }}</view>
					</view>
					<view class="line-s"></view>
					<view class="right" @tap=" toSliderUrl(6, '/pagesA/mine/order/order?type=all') ">
						<view class="num" style="color: #64c366;">{{ totay_payment }}</view>
						<view class="text">今日收款</view>
					</view>
				</view>
				<view class="line-h"></view>
				<view class="row-tiem">
					<view class="title">当前MINI版本（后端）<view class="version" style="color: #4e9876;">v{{ mini_version }}</view></view>
				</view>
				<view class="row-tiem" style="margin-top: 20rpx;">
					<view class="monitor-item">
						任务调度 <i :class="'mini-icon mini-dian ' + (monitor.schedule == 1 ? 'active' : '')"></i>
					</view>
					<view class="monitor-item">
						队列 <i :class="'mini-icon mini-dian ' + (monitor.queue == 1 ? 'active' : '')"></i>
					</view>
					<view class="monitor-item">
						websocket <i :class="'mini-icon mini-dian ' + (monitor.websocket == 1 ? 'active' : '')"></i>
					</view>
				</view>
				<view class="line-h"></view>
				<view class="row-tiem">
					<view class="title" style="margin-bottom: 10px; font-weight: 600;">待办总数</view>
					<view class="more total_todo_count_num">{{ total_todo }}</view>
				</view>
				<!-- <view class="line-h"></view> -->
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">内容审核</view>
					<view class="more" style="color: #4e9876;">{{ post_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">评论审核</view>
					<view class="more" style="color: #4e9876;">{{ comment_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">圈子审核</view>
					<view class="more" style="color: #4e9876;">{{ circle_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">提现处理</view>
					<view class="more" style="color: #4e9876;">{{ withdrawl_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">资料审核</view>
					<view class="more" style="color: #4e9876;">{{ temp_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
				<view class="row-tiem sub" @tap.stop.prevent="show_tips">
					<view class="title">反馈处理</view>
					<view class="more" style="color: #4e9876;">{{ feedback_todo }} <i class="mini-icon mini-youjiantou"></i></view>
				</view>
			</view>
			<scroll-nav :platformList="config_admin_nav" @toSliderUrl="toSliderUrl" v-if="config_admin_nav && config_admin_nav.length > 0" :scene="27"></scroll-nav>
			<view class="drag-tools-view">
				<view class="item">
					<view class="left"><i class="mini-icon mini-shenhe"></i></view>
					<view class="right">
						<view class="title">上线审核模式</view>
						<switch :color="primaryColor" style="transform:scale(0.7)" @change="is_examine_mode_f" :checked="is_examine_mode == true" />
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

import ScrollNav from '@/contrib/components/common/scroll-nav/scroll-nav';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		
		ScrollNav,
	},
	computed:{
		userInfo:{
			get(){
				let that = this;
				return that.$store.state.userInfo;
			},
			set(v){}
		},
		config_admin_nav:{
			get(){
				let that = this;
				return that.$store.state.config.admin.nav;
			},
			set(v){}
		},
		brand_logo: {
			get(){
				return uni.wen.api.homeUrl + '/statics/minisns.svg';
			},
			set(v){}
		},
		config_app_coins_name:{
			get(){
				let that = this;
				if(that.$store.state.config.app.coins){
					return that.$store.state.config.app.coins.name;
				}
				return '硬币';
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 27,
			is_auth: false,
			user_online: 0,
			user_total: 0,
			today_user_register: 0,
			coins_total: 0,
			blance_total: 0,
			totay_payment: 0,
			mini_version: '1.0.0',
			total_todo: 0,
			post_todo: 0,
			comment_todo: 0,
			circle_todo: 0,
			withdrawl_todo: 0,
			temp_todo: 0,
			feedback_todo: 0,
			is_examine_mode: false,
			monitor: {
				schedule: 0,
				queue: 0,
				websocket: 0
			},
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.getAdminDashboardData();
	},
	onShow: function() {
		let that = this;
		that.updateScene(27, 0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		show_tips(){
			uni.showToast({
				title: '小哥哥在拼命开发中...',
				icon: 'none'
			})
		},
		is_examine_mode_f(e){
			let that = this;
			if(e.detail.value){
				that.updateAdminSetting('is_examine_mode', true);
				that.setData({
					'is_examine_mode': true
				});
			}else{
				that.updateAdminSetting('is_examine_mode', false);
				that.setData({
					'is_examine_mode': false
				});
			}
		},
		updateAdminSetting(key, value){
			let that = this;
			if(!that.$store.state.userInfo.is_official){
				uni.showToast({
					title: '权限不足',
					icon:'error'
				});
				return false;
			}
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'admin/setting', {key: key, value: value}, 'POST').then(function(res) {
				
			});
		},
	    getAdminDashboardData(){
			let that = this;
			if(!that.$store.state.userInfo.is_official){
				uni.showToast({
					title: '权限不足',
					icon:'error'
				});
				return false;
			}
			uni.loading(true);
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'admin/dashboard').then(function(res) {
				uni.loading(false);
				if(res.status){
					that.setData({
						is_auth: res.data.is_auth,
						user_online: res.data.user_online,
						user_total: res.data.user_total,
						today_user_register: res.data.today_user_register,
						coins_total: res.data.coins_total,
						blance_total: res.data.blance_total,
						totay_payment: res.data.totay_payment,
						mini_version: res.data.mini_version,
						total_todo: res.data.total_todo,
						post_todo: res.data.post_todo,
						comment_todo: res.data.comment_todo,
						circle_todo: res.data.circle_todo,
						withdrawl_todo: res.data.withdrawl_todo,
						temp_todo: res.data.temp_todo,
						feedback_todo: res.data.feedback_todo,
						is_examine_mode: res.data.is_examine_mode == 1 ? true : false,
						monitor:  res.data.monitor
					});
					if(res.data.monitor.websocket == 0){
						if(uni.$store.state.websocket){
							uni.$store.state.websocket.restart();
							setTimeout(function(){
								uni.wen.util.request(uni.wen.api.ApiRootUrl + 'admin/dashboard').then(function(res) {
									if(res.status){
										that.setData({
											monitor:  res.data.monitor
										});
									}
								});
							}, 1000);
						}
					}
				}else{
					uni.showToast({
						title: res.message,
						icon:'error'
					});
				}
			});
		}
	}
}
</script>

<style lang="scss">
	.admin-page{
		height: 100%;
		@include background_color(page-body-background-color);
	}
	.page-content{
		padding: 0 30rpx;
		box-sizing: border-box;
		padding-bottom: 20rpx;
		min-height: 100vh;
		.systen-brand{
			width: 200rpx;
			height: 50rpx;
			max-width: 200rpx;
			margin: 40rpx 0;
		}
		.static-borad{
			padding: 30rpx;
			@include background_color(page-box-background-color);
			border-radius: 32upx;
			margin-bottom: 20rpx;
			.first-tip{
				font-size: 25rpx;
				@include color(color-darkest);
			}
			.grid-wrap {
			    display: flex;
			    justify-content: space-between;
			    padding: 20px 30px;
				.line-s {
				    background-color: #f2f1f6;
				    width: 1px;
				}
				.num {
				    text-align: center;
				    font-size: 18px;
				    font-weight: 600;
				}
				.text {
				    font-size: 14px;
				    margin-top: 8px;
					@include color(color-darkest);
				}
			}
			.line-h {
			    @include background_color(page-lighter-line-background-color);
			    height: 1px;
			    margin: 10px 0;
			}
			.row-tiem {
			    display: flex;
			    justify-content: space-between;
				height: 30px;
				line-height: 30px;
				.monitor-item{
					@include color(color-lightest-dark);
					font-size: $uni-font-size-sm;
					.mini-icon{
						color: #d9534f;
						margin-left: 10rpx;
						font-size: 20rpx;
						opacity: 0.7;
						display: inline-block;
					}
					.mini-icon.active{
						color: #20a53a;
					}
				}
				.title {
				    display: flex;
					font-size: 14px;
					@include color(color-darkest);
					.version {
					    margin-left: 10px;
					    font-size: 13px;
					}
				}
				.more {
				    font-size: 14px;
				    @include color(color-lighter-dark);
					.mini-icon{
						display: inline;
						font-size: 14px;
						@include color(color-lighter-dark);
						line-height: 30px;
					}
				}
				.total_todo_count_num{
					@include color(color-always-white);
					background-color: crimson;
					border-radius: 50%;
					width: 19px;
					height: 19px;
					line-height: 19px;
					font-size: 12px;
					text-align: center;
					margin-top: 5px;
					margin-right: 12px;
				}
			}
			.row-tiem.sub{
				.title{
					@include color(color-lighter-er-dark);
				}
			}
		}
		.drag-tools-view{
			margin: 20rpx 0;
			border-radius: 32upx;
			overflow: hidden;
			@include background_color(page-box-background-color);
			padding: 30rpx;
			.item{
				display: flex;
				.left{
					height: 50rpx;
					width: 50rpx;
					text-align: center;
					line-height: 50rpx;
					background-color: #4294f4;
					color: #fff;
					border-radius: 11rpx;
					margin-top: 30rpx;
				}
				.right{
					line-height: 80rpx;
					width: 600rpx;
					display: flex;
					justify-content: space-between;
					margin-left: 20rpx;
					padding: 15rpx 0;
					border-bottom: 1px solid;
					@include border_color(page-lighter-line-background-color);
					.title{
						@include color(color-darkest);
					}
				}
			}
		}
	}
	
	
.pay_code_0 {
    color: red;
    margin-bottom: 20px;
	font-size: $uni-font-size-sm;
}
.paycode-0-rule-wrap {
    @include background_color(page-box-background-color);
    width: 600rpx;
    height: 860rpx;
	border-radius: $uni-border-radius-lg-er;
	.title {
	    text-align: center;
		width: 600rpx;
		padding: 30rpx 0 40rpx;
		font-weight: 600;
	}
	.tip-content{
		position: relative;
		width: 600rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		height: 100%;
		.line{
			margin-bottom: 20rpx; font-size: $uni-font-size-base; color: #444;
		}
		.line.s{
			@include color(color-lightest-dark);
			margin-top: 30rpx;
		}
	}
}
</style>