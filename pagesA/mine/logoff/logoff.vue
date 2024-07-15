<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="账号注销" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="logoff-page">
			<view class="name">申请注销本平台账号</view>
			<view class="desc">自申请注销起，系统会在60天之后彻底清理账号相关的内容，包括笔记，评论，图片，活跃记录等。</view>
			<view class="item">
				<view class="left">
					<view class="dot"></view>
				</view>
				<view class="right">
					<view class="title">账号处于正常状态</view>
					<view class="sub">仅开放给账号当前状态为正常状态的用户，黑名单用户不允许注销</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<view class="dot"></view>
				</view>
				<view class="right">
					<view class="title">账号余额清零</view>
					<view class="sub">您可以选择将余额提现，若直接注销，系统默认您放弃相关权益并清零且不可恢复</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<view class="dot"></view>
				</view>
				<view class="right">
					<view class="title">账号{{ config_app_coins_name }}清零</view>
					<view class="sub">{{ config_app_coins_name }}为社区的虚拟货币，仅可在站内消费，账号注销会直接清零</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<view class="dot"></view>
				</view>
				<view class="right">
					<view class="title">第三方账号自动解绑</view>
					<view class="sub">若账号被注销，您的微信等其他第三方账号将自动删除，再次登录会创建全新的账号</view>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<view class="dot"></view>
				</view>
				<view class="right">
					<view class="title">60天期间重新登录</view>
					<view class="sub">则系统默认您取消申请注销，若您重新申请注销，则需要重新开始计时</view>
				</view>
			</view>
			<view :class="'btn ' + (myUserInfo.user_state == 0 ? '' :  'notnormal') " @tap.stop.prevent="logoff">立即申请</view>
			<view class="confirm_tip">
				<i class="mini-icon mini-yigouxuan" v-if="checked" @tap.stop.prevent="checkAction(false)"></i>
				<i class="mini-icon mini-weigouxuan" v-else  @tap.stop.prevent="checkAction(true)"></i>
				<view class="tip">我已仔细阅读并同意上方注销须知</view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 30,
			checked: false
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
	},
	onShow: function() {
		let that = this;
		that.updateScene(30, 0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		  checkAction(checked){
			  this.setData({
				  checked: checked
			  });
		  },
		  logoff(){
			  let that = this;
			  if(!that.checked){
				  uni.showToast({
				  	title: '请先勾选"我已仔细注销须知"',
					icon: 'none'
				  })
				  return;
			  }
			  
			  uni.showModal({
			      title: '确认注销账号',
			      content: '您想好了吗',
			      showCancel: true,
			      confirmText: '我想好了',
			      confirmColor: that.primaryColor,
			  
			      success(res) {
			          if (res.confirm){
			  			 uni.loading(true);
			  			 
			  			 uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/logoff', {}, 'POST').then(function(res) {
						    uni.loading(false);
			  			 	if(res.status){
			  			 					uni.removeStorageSync("token");
											uni.$store.commit('updateToken', '');
											
			  			 					uni.removeStorageSync("userInfo");
			  			 					that.$store.commit('updateUserInfo', 
			  			 						{id: '',
			  			 						user_name: '未登录用户',
			  			 						user_avatar: that.$store.state.config.img.default_avatar,
			  			 						user_introduce: that.$store.state.config.user.user_default_introduce,
			  			 						user_background_maps: that.$store.state.config.user.user_background_maps,
			  			 						is_authentication: false,
			  			 						is_member: false,
			  			 						is_official: false,
			  			 						is_played: false,
			  			 						gender: 0},
			  			 						);
											
			  			 					uni.reLaunch({
			  			 						url: '/pages/tabbar/index/index'
			  			 					});
			  			 					
			  			 	}else{
			  			 		uni.showToast({
			  			 			title: res.message,
			  			 			icon: 'none'
			  			 		});
			  			 	}
			  			 });
					  }
			      }
			  });
		  }
	}
}
</script>

<style lang="scss" scoped>
	.admin-page{
		height: 100%;
		@include background_color(page-gray-background-color);
	}
	.logoff-page{
		padding: 30rpx;
		.name {
		    font-size: 50rpx;
		    font-weight: 600;
			@include color(color-darkest);
		}
		.desc {
		    @include color(color-lightest-est-dark);
		    font-size: 25rpx;
			margin: 20rpx 0 60rpx;
		}
		.item {
		    padding: 0 0 40rpx;
		    display: flex;
			.right{
				@include color(color-darkest);
			}
			.dot {
			    width: 20rpx;
			    height: 20rpx;
			    @include background_color(dark-background-color);
			    border-radius: 50%;
			    margin-right: 20rpx;
			    margin-top: 20rpx;
			}
			.sub{
				@include color(color-lighter-dark);
				font-size: 25rpx;
			}
		}
		.btn {
		    margin: 40rpx 0 10rpx;
		    width: 690rpx;
		    height: 70rpx;
		    border-radius: $uni-border-radius-lg-er;
		    font-size: $uni-font-size-sm-base;
		    background-color: $uni-color-follow;
		    color: $uni-color-follow-font;
		    display: flex;
		    align-items: center;
		    justify-content: center;
		}
		.btn.notnormal{
			@include background_color(page-lightest-dark-background-color);
		}
		.confirm_tip {
		    display: flex;
			.mini-icon{
				font-size: 35rpx;
				@include color(color-lightest-est-dark);
			}
			.tip {
			    @include color(color-lightest-est-dark);
			    font-size: 25rpx;
				margin-left: 10rpx
			}
		}
		
	}
	
</style>