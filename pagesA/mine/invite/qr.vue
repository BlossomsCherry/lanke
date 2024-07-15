<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" title="我的二维码" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="invite-qr-content">
			<view class="qr-warpper">
				<image :src="qr" mode="aspectFit" class="_qr"></image>
			</view>
			<view class="user-warpper">
				<image :src="myUserInfo.user_avatar" mode="aspectFill" class="user_avatar"></image>
				<text class="user_name">{{myUserInfo.user_name}}</text>
			</view>
			<view class="describe-warpper">扫一扫上面二维码，和我一起玩</view>
			<view class="save-warpper" @tap.stop.prevent="onCapture">保存二维码</view>
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
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 51001,
			qr: ''
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(51001, 0, true);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.qr = options.qr;
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	onShareAppMessage: function (res) {
	  let that = this;
	  return {
	    title: that.$store.state.config.share.format.app_share_right,
	    path: '/pagesA/mine/invite/qr?qr='+ that.qr +'&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	
	onShareTimeline: function (res) {
	  let that = this;
	  return {
	    title: that.$store.state.config.share.format.app_share_right,
	    query: 'qr='+ that.qr + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	methods: {
		onCapture(){
			let that = this;
			uni.downloadFile({
			    url: that.qr, // 这里替换为真正的图片URL地址
			    success(res) {
			        if (res.statusCode === 200) {
			            const tempFilePath = res.tempFilePath; // 临时文件路径
			            
			            uni.saveImageToPhotosAlbum({
			                filePath: tempFilePath,
			                success() {
								uni.showToast({
									title: '二维码已保存到相册',
									icon: 'none'
								})
			                },
			                fail(err) {
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								})
			                }
			            });
			        } else {
						uni.showToast({
							title: '下载失败',
							icon: 'none'
						})
			        }
			    },
			    fail(err) {
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					})
			    }
			});
		}
	}
}
</script>

<style lang="scss" scoped>

.invite-qr-content{
	.qr-warpper {
			margin: auto;
			margin-top: 100rpx;
			width: 384rpx;
			height: 384rpx;
			border-radius: 20rpx;
			background-color: white;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
		._qr {
			width: 344rpx;
			height: 344rpx;
			margin: auto;
		}
	}
	
	.user-warpper {
		margin: 30rpx 100rpx;
		padding: 30rpx;
		height: 60rpx;
		background-color: white;
		border-radius: 110rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		.user_avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
			margin-right: 54rpx;
		}
	
		.user_name {
			font-weight: 500;
			font-size: $uni-font-size-lg;
			color: #333333;
		}
	}
	
	.describe-warpper {
		margin: auto;
		font-style: normal;
		font-weight: 400;
		font-size: $uni-font-size-base;
		color: #999999;
		text-align: center;
	}
	.save-warpper{
		font-weight: 500;
		font-size: $uni-font-size-medium;
		line-height: 80rpx;
		text-align: center;
		background: $uni-color-follow;
		color: $uni-color-follow-font;
		border-radius: 27px;
		height: 80rpx;
		margin: 300rpx 50rpx 0rpx 50rpx;
	}
}

</style>