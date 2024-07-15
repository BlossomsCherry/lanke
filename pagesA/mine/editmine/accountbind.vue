<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="第三方账号" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="accountbind-wrapper">
			<view class="page-block-gap"></view>
			<view class="inner">
				<view class="item-wrapper">
				  <view class="label other-info-title">微信账号</view>
				  <view class="right"> 
				  </view>
				</view>
				<view class="info-list-wrapper">

					<view class="split"></view>
					<view class="item-wrapper">
					  <view class="label">小程序端</view>
					  <view class="right flex-row">
					  <!-- #ifdef MP-WEIXIN -->
					  <block>
						<view class="placeholder" v-if="userAccount.weixin_openid && userAccount.weixin_openid.length > 0">已绑定</view>
						<view class="placeholder able" v-else @tap.stop.prevent="weixinlogin">点击绑定</view>
					  </block>
					  <!-- #endif -->
					  <!-- #ifndef MP-WEIXIN -->
					  <view class="placeholder">{{ (userAccount.weixin_openid && userAccount.weixin_openid.length > 0) ? '已绑定' : '' }}</view>
					  <!-- #endif -->
					  </view>
					</view>
					
					<view class="split"></view>
					<view class="item-wrapper">
					  <view class="label">App端</view>
					  <view class="right flex-row"> 
					  <!-- #ifdef APP -->
					  <block>
							<view class="placeholder" v-if="userAccount.weixin_app_openid && userAccount.weixin_app_openid.length > 0">已绑定</view>
							<view class="placeholder able" v-else @tap.stop.prevent="weixinlogin">点击绑定</view>
					  </block>
					  <!-- #endif -->
					  <!-- #ifndef APP -->
					  <view class="placeholder">{{ (userAccount.weixin_app_openid && userAccount.weixin_app_openid.length > 0) ? '已绑定' : '' }}</view>
					  <!-- #endif -->
					  </view>
					</view>
					
					<view class="split"></view>
					<view class="item-wrapper">
					  <view class="label">公众号端</view>
					  <view class="right flex-row"> 
					  <!-- #ifdef H5 -->
					  <block>
							<view class="placeholder" v-if="userAccount.weixin_mp_openid && userAccount.weixin_mp_openid.length > 0">已绑定</view>
							<view class="placeholder able" v-else></view>
					  </block>
					  <!-- #endif -->
					  <!-- #ifndef H5 -->
					  <view class="placeholder">{{ (userAccount.weixin_mp_openid && userAccount.weixin_mp_openid.length > 0) ? '已绑定' : '' }}</view>
					  <!-- #endif -->
					  </view>
					</view>

				</view>
			</view>
			<view class="page-block-gap"></view>
			<view class="inner">
				<view class="item-wrapper">
				  <view class="label other-info-title">QQ账号</view>
				  <view class="right"> 
				  </view>
				</view>
				<view class="info-list-wrapper">
					
					<view class="split"></view>
					<view class="item-wrapper">
					  <view class="label">App端</view>
					  <view class="right flex-row"> 
					  <!-- #ifdef APP -->
					  <block>
							<view class="placeholder" v-if="userAccount.qq_app_openid && userAccount.qq_app_openid.length > 0">已绑定</view>
							<view class="placeholder able" v-else @tap.stop.prevent="qqLogin">点击绑定</view>
					  </block>
					  <!-- #endif -->
					  <!-- #ifndef APP -->
					  <view class="placeholder">{{ (userAccount.qq_app_openid && userAccount.qq_app_openid.length > 0) ? '已绑定' : '' }}</view>
					  <!-- #endif -->
					  </view>
					</view>
					
					<view class="split"></view>
					<view class="item-wrapper">
					  <view class="label">网页端</view>
					  <view class="right flex-row"> 
					  <!-- #ifdef H5 -->
					  <block>
							<view class="placeholder" v-if="userAccount.qq_web_openid && userAccount.qq_web_openid.length > 0">已绑定</view>
							<view class="placeholder able" v-else></view>
					  </block>
					  <!-- #endif -->
					  <!-- #ifndef H5 -->
					  <view class="placeholder">{{ (userAccount.qq_web_openid && userAccount.qq_web_openid.length > 0) ? '已绑定' : '' }}</view>
					  <!-- #endif -->
					  </view>
					</view>
					
				</view>
			</view>
			<view class="page-block-gap"></view>
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
const mixins = require('@/mixins/user')

var options = {};
common(options);
mixins(options);

export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			userAccount: {
			  id: 0,
			  weixin_openid: '',
			  weixin_unionid: '',
			  weixin_app_openid: '',
			  weixin_mp_openid: '',
			  weixin_web_openid: '',
			  weixin_shop_openid: '',
			  qq_unionid: '',
			  qq_app_openid: '',
			  qq_web_openid: ''
			}
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(143, 0, true);
		that.getUserInfo();
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		getUserInfo(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/info', {
				account: 1
			}).then(function (res) {
				uni.loading(false);
				if (res.status) {
					that.userAccount = res.data;
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		qqLogin(){
			let that = this;
			uni.loading(true);
			uni.login({
			  provider: 'qq',
			  success: function (loginRes) {
			    // 登录成功
			    uni.getUserInfo({
			      provider: 'qq',
			      success: function (info) {
			        // 获取用户信息成功, info.authResult中保存登录认证数据
			        if (info && info.errMsg === 'getUserInfo:ok' && info.userInfo) {
			          uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/login/qq', info.userInfo, 'POST').then(function (res) {
			            uni.loading(false);
			            if (res.code == 200) {
			              that.getUserInfo();
			            } else {
			              uni.showModal({
			                title: '绑定失败',
			                content: res.message,
			                showCancel: false,
			                confirmText: '朕知道了',
			                confirmColor: that.primaryColor
			              });
			            }
			          });
			        } else {
			          uni.wen.util.log(info);
			        }
			      }
			    })
			  },
			  fail: function (err) {
			    uni.showToast({
			      title: '错误码' + err.code,
			      icon: 'none'
			    })
			    uni.wen.util.log(err);
			  }
			});
		},
		weixinlogin: function (e) {
		  let that = this;
		  // #ifdef MP-WEIXIN
		  that.loginByWeixin().then((res) => {
		    that.getUserInfo();
		  }).catch((err) => {
			uni.wen.util.log(err);
			uni.showToast({
				title: err.message,
				icon:'none'
			});
		  });
		  // #endif
		
		  // #ifdef APP
		  that.appLoginByWeixin().then((res) => {
		    that.getUserInfo();
		  }).catch((err) => {
			uni.wen.util.log(err);
		    uni.showToast({
		    	title: err.message,
				icon:'none'
		    });
		  });
		  // #endif
		
		}
	}
}
</script>

<style lang="scss" scoped>
@import './accountbind.scss';
</style>