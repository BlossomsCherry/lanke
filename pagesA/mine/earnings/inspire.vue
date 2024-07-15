<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view slot="left" class="title-warp">
				<text class="_text">{{ '支持' + config_about_name }}</text>
			</view>
			<!-- #ifndef MP -->
			<view slot="right" class="lxy-nav-bar__logo">
				<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="inviteUserTap" :style="'color: '+global__theme__ == 'black' ? '#ffffff' : '#000000;'"></i>
			</view>
			<!-- #endif -->
		</navBar>
		
		<view class="inpire-content" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
			<view class="wrap flex-column">
				<view class="img flex-column">
					<image class="_image" :src="config2_page_reward_inspire_img"></image>
				</view>
				<view class="times flex-row">
					<view class="num">{{ total_times }}<view class="unit">次</view></view>
					
				</view>
				<view class="total flex-row">
					<view class="_text">已获得 {{ total_coins + config_app_coins_name }}</view>
				</view>
				<view class="btns flex-column">
					<!-- #ifdef MP -->
					<view :class="'btn watch ' + (today_times >= config_app_coins_reward_times ? 'disable' : '')" @tap.stop.prevent="show_reward_video">观看激励广告（{{ today_times }}/{{ config_app_coins_reward_times }}）</view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<ad-rewarded-video :adpid="config_app_coins_reward_uni_reward_unit" v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
					   <view :class="'btn watch ' + (today_times >= config_app_coins_reward_times ? 'disable' : '')">观看激励广告（{{ today_times }}/{{ config_app_coins_reward_times }}）</view>
					   <view v-if="error">{{error}}</view>
					</ad-rewarded-video>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="tip">请至App或小程序进行支持</view>
					<!-- #endif -->
					<view class="btn rank" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/earnings/inspire-rank')">用户排行榜</view>
				</view>
			</view>
			<view class="fixed-tip">每日观看广告获得{{ config_app_coins_name }}奖励次数上限为{{ config_app_coins_reward_times  }}次</view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

let rewardVideoAd = null;
let rewardTmpCode = '';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		config_about_name:{
			get(){
				let that = this;
				return that.$store.state.config.about.name;
			},
			set(v){}
		},
		contentHieght: {
			get() {
			  let that = this;
			  return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
			}
		},
		config_app_coins_reward_times: {
			get(){
				let that = this;
				if(that.every_day_max > 0){
					return that.every_day_max;
				}
				// #ifdef MP
				if(that.$store.state.config.app.coins.reward.mp){
					return that.$store.state.config.app.coins.reward.mp.times || 0;
				}
				return 10;
				// #endif
				// #ifndef MP
				if(that.$store.state.config.app.coins.reward.uni){
					return that.$store.state.config.app.coins.reward.uni.times || 0;
				}
				return 10;
				// #endif
				
			},
			set(v){}
		},
		
		config_app_coins_name: {
			get() {
				let that = this
				if (that.$store.state.config.app.coins) {
					return that.$store.state.config.app.coins.name
				}
				return '硬币'
			},
			set(v) {},
		},
		config_app_coins_reward_uni_reward_unit: {
			get() {
				let that = this
				if (that.$store.state.config.app.coins.reward.uni) {
					return that.$store.state.config.app.coins.reward.uni.reward_unit
				}
				return ''
			},
			set(v) {},
		},
		config2_page_reward_inspire_img: {
			get() {
				let that = this
				if (that.$store.state.config2.page.reward && that.$store.state.config2.page.reward.inspire) {
					return that.$store.state.config2.page.reward.inspire.img
				}
				return 'https://img.mini.minisns.cn/images/inspire-face.png'
			},
			set(v) {},
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 109,
			total_times: 0,
			today_times: 0,
			total_coins: 0,
			every_day_max: 0
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(109, 0, true, false, 14, 2);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		// #ifdef MP
		that.prepare_reward_ad();
		// #endif
		
		that.get_inspire_config();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onShareAppMessage: function (res) {
	  let that = this;
	  return {
	    title: '每日观看广告获得' + that.config_app_coins_name + '奖励',
	    path: '/pagesA/mine/earnings/inspire?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	
	onShareTimeline: function (res) {
	  let that = this;
	  return {
	    title: '每日观看广告获得' + that.config_app_coins_name + '奖励',
	    query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	methods: {
		onadload(e) {
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/reward_gift', {
				action: 'code'
			}).then(function(res) {
				if(res.status){
					rewardTmpCode = res.data;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		onadclose(e) {
			let that = this;
			const detail = e.detail
			// 用户点击了【关闭广告】按钮
			if (detail && detail.isEnded) {
				// 正常播放结束，可以下发游戏奖励
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/reward_gift', {
					action: 'reward',
					code: rewardTmpCode
				}).then(function(res) {
					if(res.status){
						that.get_inspire_config();
						uni.wen.util.updateUserInfo();
					}
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				});
			} else {
				// 播放中途退出，不下发游戏奖励
				uni.showToast({
					title: '中途退出，未取得奖励',
					icon: 'none'
				});
			}
		},
		onaderror(e) {
			uni.showToast({
				title: e.detail,
				icon: 'none'
			});
		},
		get_inspire_config(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'aggregate/config', {
				type: 'inspire',
			}).then(function(res) {
				uni.loading(false);
				if (res.status) {
					that.total_times = res.data.total_times;
					that.today_times = res.data.today_times;
					that.total_coins = res.data.total_coins;
					that.every_day_max = res.data.every_day_max;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			});
		},
		prepare_reward_ad(){
			let that = this;
			// #ifdef MP-WEIXIN
			// 在页面onLoad回调事件中创建激励视频广告实例
		
			if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.reward && that.$store.state.config.app.coins.reward.mp.reward_unit){
				if (wx.createRewardedVideoAd) {
				  rewardVideoAd = wx.createRewardedVideoAd({
				    adUnitId: that.$store.state.config.app.coins.reward.mp.reward_unit
				  });
				  if(rewardVideoAd){
					rewardVideoAd.onLoad(() => {
					  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/reward_gift', {
						action: 'code'
					  }).then(function(res) {
						if(res.status){
							rewardTmpCode = res.data;
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					  });
					})
					rewardVideoAd.onError((err) => {
					  uni.showToast({
						title: err.errMsg,
						icon: 'none'
					  });
					})
					rewardVideoAd.onClose((res) => {
					  // 用户点击了【关闭广告】按钮
					  if (res && res.isEnded) {
						// 正常播放结束，可以下发游戏奖励
						uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/reward_gift', {
							action: 'reward',
							code: rewardTmpCode
						}).then(function(res) {
							if(res.status){
								that.get_inspire_config();
								uni.wen.util.updateUserInfo();
							}
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						});
					  } else {
						// 播放中途退出，不下发游戏奖励
						uni.showToast({
							title: '中途退出，未取得奖励',
							icon: 'none'
						});
					  }
					})
				  }
				}
			}
		
			// #endif
		},
		show_reward_video(){
			let that = this;
			if(that.today_times >= that.config_app_coins_reward_times){
				uni.showTotast({
					 title: '已达到观看激励视频次数上限，明天再看吧',
					 icon: 'none'
				});
				return false;
			}
			// #ifdef MP-WEIXIN
				// 用户触发广告后，显示激励视频广告
				if (rewardVideoAd) {
				  rewardVideoAd.show().catch(() => {
					// 失败重试
					rewardVideoAd.load()
					  .then(() => rewardVideoAd.show())
					  .catch(err => {
						console.log('激励视频 广告显示失败')
						uni.showTotast({
							 title: '激励视频加载失败，改天再看吧',
							 icon: 'none'
						});
					  })
				  })
				}
			// #endif
			// #ifdef H5
			uni.showTotast({
				 title: '抱歉，H5不支持激励视频奖励',
				 icon: 'none'
			});
			// #endif
			// #ifndef MP
			uni.showTotast({
				 title: '抱歉，该平台还没开发完',
				 icon: 'none'
			});
			// #endif
		},
		inviteUserTap() {
		  let that = this;
		  uni.wen.util.inviteUser('/pagesA/mine/earnings/inspire', '每日观看广告获得' + that.config_app_coins_name + '奖励', '', '');
		}
	}
}
</script>

<style lang="scss" scoped>
$times-font-size: 80rpx;
.title-warp{
	._text{
		@include color(color-darkest);
		white-space: nowrap;
	}
}
.inpire-content{
	@include background_color(page-box-background-color);
	.wrap{
		.img{
			margin-top: 90rpx;
			height: 250rpx;
			justify-content: center;
			._image{
				width: 250rpx;
				height: 250rpx;
				margin: auto;
			}
		}
		.times{
			margin-top: 120rpx;
			justify-content: center;
			height: $times-font-size;
			align-items: flex-end;
			.num{
				font-size: $times-font-size;
				line-height: $times-font-size;
				position: relative;
				@include color(color-darkest);
				.unit{
					font-size: $uni-font-size-sm-base;
					position: absolute;
					bottom: -20rpx;
					right: -32rpx;
					@include color(color-ligh-dark);
				}
			}
			
			
		}
		.total{
			justify-content: center;
			margin-top: 30rpx;
			._text{
				font-size: $uni-font-size-sm-base;
				padding: 10rpx 20rpx;
				@include color(color-lighter-dark);
				@include background_color(page-box-item4-background-color);
				border-radius: 300rpx;
			}
		}
		.btns{
			justify-content: center;
			margin-top: 150rpx;
			.btn{
				width: 380rpx;
				border-radius: 300rpx;
				@include background_color(page-box-item2-background-color);
				@include color(color-dark);
				text-align: center;
				font-size: $uni-font-size-base;
				line-height: $uni-font-size-base;
				padding: 30rpx 0;
				margin: auto;
			}
			.tip{
				width: 380rpx;
				@include color(color-dark);
				text-align: center;
				font-size: $uni-font-size-base;
				line-height: $uni-font-size-base;
				padding: 30rpx 0;
				margin: auto;
			}
			.btn.watch{
				@include background_color(follow-background-color);
				@include color(color-follow-font);
			}
			.btn.watch.disable{
				opacity: 0.8;
			}
			.btn.rank{
				margin-top: 40rpx;
			}
		}
	}
	.fixed-tip{
		position: fixed;
		width: 100%;
		text-align: center;
		@include color(color-lighter-er-dark);
		font-size: $uni-font-size-sm;
		bottom: calc( 40rpx + env(safe-area-inset-bottom));
		white-space: nowrap;
		
	}
}
</style>