<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="校园身份认证" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
		<view class="byschool-page-conetnt">
			<view class="inner">
				<view class="titleBox">
					<view class="titletext">请上传录取通知书/学生证/校园卡/学位证/毕业证照片</view>
					<view class="titletip">相关资料仅用于校园身份认证，并受隐私保护协议与相关法律保护，将严格保密。</view>
				</view>
				
				<view class="item-title">补充说明</view>
				
				<view class="picture">
					<block v-if="picture">
						<image class="_image" :src="picture"  mode="aspectFill"></image>
					</block>
					<block v-else>
						<view class="_image" @tap.stop.prevent="uploadPictures(1, 'picture', 1)">
							<view class="flex-column">
								<i class="mini-icon mini-jia"></i>
								<view class="_text">证明图片一</view>
							</view>
						</view>
					</block>
					
				</view>
				
				<view class="picture picture2">
					<block v-if="picture2">
						<image class="_image" :src="picture2" mode="aspectFill"></image>
					</block>
					<block v-else>
						<view class="_image"  @tap.stop.prevent="uploadPictures(1, 'picture2', 1)">
							<view class="flex-column">
								<i class="mini-icon mini-jia"></i>
								<view class="_text">证明图片二</view>
							</view>
						</view>
					</block>
					
				</view>
				
				<view class="item-title">补充说明</view>
				
				<view class="textarea-wrap">
					<u-textarea class="_textarea" maxlength="300" v-model="introduce" height="300"
						placeholder="请输入内容" count border="none"></u-textarea>
				</view>
				
				
				<view class="btn" @tap.stop.prevent="submitStudentCertify">
					立即提交
				</view>
				<view style="height: 160rpx;"></view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 137,
			
			sid: '',
			role: '',
			term: 0,
			
			picture: '',
			picture2: '',
			introduce: ''
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(137, 0, true);
		
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
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		submitStudentCertify(){
			let that = this;
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/student/certify', {
				way: 'school-card',
				sid: that.sid,
				role: that.role,
				term: that.term,
				picture: that.picture,
				picture2: that.picture2,
				introduce: that.introduce
			}, 'POST').then(function(res) {
				uni.loading(false);
				if(res.status){
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
	}
}
</script>

<style lang="scss" scoped>
.byschool-page-conetnt{
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
		
		.item-title{
			border-left: 8rpx solid $uni-color-primary;
			height: 50rpx;
			line-height: 50rpx;
			text-indent: 30rpx;
			@include color(color-ligh-dark);
			font-size: $uni-font-size-medium;
			margin-bottom: 20rpx;
			margin-top: 40rpx;
		}
		
		.picture{
			margin-bottom: 30rpx;
			._image{
				width: $page-content-body-width;
				height: 300rpx;
				@include background_color(page-box-background-color);
				display: flex;
				flex-direction: column;
				justify-content: center;
				border-radius: 10rpx;
				.flex-column{
					.mini-icon{
						@include color(color-lighter-er-dark);
					}
					._text{
						margin-top: 10rpx;
						@include color(color-lighter-er-dark);
						font-size: $uni-font-size-base;
						text-align: center;
					}
				}
				
			}
		}
		.btn{
			margin-top: 40rpx;
			width: $page-content-body-width;
			height: 76rpx;
			line-height: 76rpx;
			background-color: $uni-color-follow;
			color: $uni-color-follow-font;
			text-align: center;
			border-radius: 10rpx;
			font-size: $uni-font-size-base;
		}
	}
}
</style>