<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="忘记支付密码" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="paycode-forget-page">
			<view class="phoneTv">{{myUserInfo.phone}}</view>
			<view class="inputV marginTop40">
				<input v-model="phoneCode" maxlength="4" placeholder="请输入手机验证码" type="number" :focus="true" class="_input"/>
				<view class="codeTv" @tap.stop.prevent="userPhoneSend">{{tip}}</view>
			</view>
			<view class="inputV marginTop40">
				<input v-model="psw" maxlength="6" placeholder="输入支付密码（6位数字）" type="number"class="_input" :password="true"/>
			</view>
			
			<view class="inputV marginTop40">
				<input v-model="pswTo" maxlength="6" placeholder="确认支付密码（6位数字）" type="number"class="_input" :password="true"/>
			</view>
			
			<view class="finishTv" @tap.stop.prevent="paycodeSet">
				完成
			</view>
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"  @captcha="captchaHanlder"></my-toast>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 48001,
			phoneCode: '',
			psw: "",
			pswTo: "",
			seconds: 60,
			tip: '获取验证码',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(48001, 0, true);
		
		if(that.myUserInfo.phone && that.myUserInfo.phone.length > 0){
			
		}else{
			uni.showModal({
				title: '您还没有绑定手机号',
				content: '前往绑定？',
				cancelText: '返回',
				confirmText: '前往绑定',
				success: function (res) {
					if (res.confirm) {
						uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine');
					} else if (res.cancel) {
						uni.wen.toUrl(-2, null);
					}
				}
			})
		}
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		captchaHanlder(res){
			let that = this;
			if(res.status == 'ok'){
				if(res.next == 'paycodeSet'){
					that.paycodeSet();
				}
			}
		},
		paycodeSet(){
			let that = this;
			if(that.pswTo != that.psw){
				uni.showToast({
					title: '两次支付密码不一致',
					icon: 'none',
					duration: 1500
				});
				return false;
			}
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/paycode', {
				type: 3,
				phoneCode: that.phoneCode,
				password: that.pswTo
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					uni.wen.util.updateUserInfo();
					uni.showModal({
						title: '修改成功',
						content: '您的支付密码已修改完毕!',
						showCancel: false,
						confirmText: '确定',
						success: function (res) {
							uni.wen.toUrl(-2, null);
						}
					})
				}else{
					if(res.code == 200045){
						that.myToast({
							type: 'captcha',
							timeout: 2000,
							isClick: true,
							mask: 3,
							uuid: 'captcha-xxxx',
							next: 'paycodeSet',
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
				}
			});
		},
		captchaHanlder(res){
			let that = this;
			if(res.status == 'ok'){
				if(res.next == 'userPhoneSend'){
					that.userPhoneSend();
				}
			}
		},
		userPhoneSend() {
			let that = this;
			if (that.seconds == 60) {
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/phone/send',{}, 'POST').then(function (res) {
					uni.loading(false);
					if (res.status) {
					  uni.showToast({
						title: '发送成功',
						icon: 'none'
					  });
					  that.countdown()
					}else{
						if(res.code == 200045){
							that.myToast({
								type: 'captcha',
								timeout: 2000,
								isClick: true,
								mask: 3,
								uuid: 'captcha-xxxx',
								next: 'userPhoneSend',
							});
						}else{
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 1500
							});
						}
					}
				});
			}
		},
		countdown() {
			let timer = setInterval(() => {
				this.seconds--;
				if (this.seconds < 1) {
					clearInterval(timer)
					this.seconds = 60
					this.tip = "重新获取"
				} else {
					this.tip = this.seconds + "s"
				}
			}, 1000)
		},
	}
}
</script>

<style lang="scss" scoped>
.paycode-forget-page{
	.phoneTv {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: $uni-font-size-lg;
		@include color(color-light-dark);
		margin-top: 100rpx;
		margin-left: 40rpx;
	}

	.inputV {
		height: 88rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		border-bottom: 2rpx solid;
		@include border_color(border-color-lightest-est-est-dark);
		display: flex;
		align-items: center;
		justify-content: space-between;
		._input{
			@include color(color-lightest-dark);
			fontSize:28rpx;
			marginLeft: 8rpx;
		}
	}

	.codeTv {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: $uni-font-size-base;
		width: 200rpx;
		@include color(color-light-dark);
	}

	.showIv {
		width: 48rpx;
		height: 48rpx;
	}

	.marginTop100 {
		margin-top: 200rpx;
	}

	.marginTop40 {
		margin-top: 40rpx;
	}

	.finishTv {
		height: 80rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
		@include background_color(follow-background-color);
		@include color(color-follow-font);
		border-radius: 44rpx;
		font-style: normal;
		font-weight: 500;
		font-size: $uni-font-size-lg;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 80rpx;
	}
}

</style>