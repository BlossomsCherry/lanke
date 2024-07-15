<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="通过学校邮箱验证" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="email-page-content">
			<!-- 表单 -->
			<view class="inner">
				<view class="titleBox">
					<view class="titletext">请填写你在本校的邮箱地址并接收验证码</view>
					<view class="titletip">相关资料仅用于校园身份认证，并受隐私保护协议与相关法律保护，将严格保密。</view>
				</view>
				<view class="typeBox">
					<view class="typeName">
						<view class="typeIcon"><view class="dot"></view></view>
						<view class="typeTitle"><input v-model="email" class="_input" type="text" placeholder="请输入学校邮箱账号"></view>
						<view class="selectBox" @click="show = true">
							{{ school.email_suffix }}
						</view>
					</view>
				</view>
				
				
				<view class="typeBox">
					<view class="typeName">
						<view class="typeIcon"><view class="dot"></view></view>
						<view class="typeTitle"><input v-model="code" class="_input" type="text" placeholder="请输入验证码"></view>
						<block v-if="ttl > 0">
							<view class="getemailcode">
								{{ ttl }}s
							</view>
						</block>
						<block v-else>
							<view class="getemailcode" @tap.stop.prevent="sendEmailCode">
								获取验证码
							</view>
						</block>
						
					</view>
				</view>
				
			</view>
			
			<!-- 下一步 -->
			<view class="nextBut" @tap.stop.prevent="submitStudentCertify">
				提交
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

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 136,
			sid: '',
			role: '',
			term: 0,
			email: '',
			school: {
				sid: null,
				email_suffix: '',
			},
			ttl: 0,
			code: '',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(136, 0, true);
		
		if(that.myUserInfo.id > 0){
			if(that.myUserInfo.university && that.myUserInfo.university.length > 0){
				uni.showToast({
					title: '您已完成学生认证，无需再次认证',
					icon: 'none'
				});
				setTimeout(function(){
					uni.wen.toUrl(-2, null, that);
				}, 700);
				return false;
			}
		}
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.sid = options.sid;
		that.role = options.role;
		that.term = options.term;
		
		if(!that.sid){
			uni.showToast({
				title: '参数错误',
				icon: 'none'
			})
			setTimeout(function(){
				uni.wen.toUrl(-2, null, that);
			}, 300);
			return false;
		}
		that.getschool();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		submitStudentCertify(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/student/certify', {
				way: 'email',
				sid: that.sid,
				role: that.role,
				term: that.term,
				email: that.email + that.school.email_suffix,
				code: that.code,
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
					setTimeout(function(){
						uni.wen.toUrl(-1, null, that);
					}, 500);
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		sendEmailCode(){
			let that = this;
			let timer = null;
			if(!that.email){
				uni.showToast({
					title: '请输入邮箱',
					icon: 'none'
				});
				return false;
			}
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/email/send', {
				template: 'text',
				action: 'code',
				email: (that.email + that.school.email_suffix),
			}, 'POST').then(res => {
			    if (res.status) {
					that.ttl = 60;
					timer = setInterval(function(){
						if(that.ttl > 0){
							that.ttl -= 1;
						}else{
							clearInterval(timer);
							return false;
						}
					}, 1000);
					uni.showToast({
						title: '发送成功',
						icon: 'none'
					});
			    } else {
			        uni.showToast({title: res.message, icon: 'none', duration: 1500})
			    }
			});
		},
		getschool(){
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/university', {scene: 'certify', page: 1, longitude: 0, latitude: 0, sid: that.sid }).then(res => {
			    if (res.status) {
					if(res.data.data && res.data.data.length > 0){
						that.school = res.data.data[0];
					}else{
						uni.showToast({
							title: '未查询到选择的学校',
							icon: 'none'
						})
					}
			    } else {
			        uni.showToast({title: res.message, icon: 'none', duration: 1500})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.email-page-content{
	width: 750rpx;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.titleBox{
			margin-top: 40rpx;
			.titletext{
				@include color(color-light-dark);
				font-size: $uni-font-size-medium;
				margin-bottom: 30rpx;
			}
			.titletip{
				 @include color(color-lighter-er-dark);
				 font-size:26rpx;
				 margin-bottom: 20rpx;
			}
		}
		
		.typeBox{
			@include background_color(page-box-background-color);
			padding:38rpx 36rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
			.typeName{
				display: flex;
				.typeIcon{
					display: flex;
					flex-direction: column;
					justify-content: center;
					.dot{
						width: 20rpx;
						height: 20rpx;
						border-radius: 100%;
						background: $uni-color-primary;
						transform: scale(0.5);
					}
				}
				.typeTitle{
					font-weight: bold;
					line-height: 50rpx;
					padding-left: 15rpx;
					._input{
						height: 50rpx;
						line-height: 50rpx;
						font-size: $uni-font-size-medium;
						font-weight: normal;
						@include color(color-light-dark);
					}
				}
				.selectBox{
					line-height: 50rpx;
					font-size: $uni-font-size-medium;
					@include color(color-light-dark);
				}
				
				.getemailcode{
					color: #576B94;
					font-size: $uni-font-size-medium;
				}
			}
		}
	}
	.nextBut{
		background: $uni-color-follow;
		color: $uni-color-follow-font;
		width: 688rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: $uni-font-size-base;
		font-weight: bold;
		border-radius: 80rpx;
		margin: 50rpx auto 0;
	}
}
</style>
