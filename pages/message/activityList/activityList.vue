<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body page-wrap">
		<navBar :back="true" :home="fph" title="活动" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view class="notice-item" v-for="(item, index) in activityList" :key="item.id" @tap.stop.prevent="toSliderUrl(item.target_type, item.target_id)">
			<text class="time">{{item.created_at}}</text>
			<view class="content">
				<text class="title">{{item.title}}</text>
				<view class="img-wrapper">
					<image class="pic" :src="item.pic" mode="aspectFill"></image>
					<view class="cover" v-if="item.status == 1">
						活动结束 
					</view>
				</view>
				<text class="introduce">
					{{item.intro}}
				</text>
				<view class="bot b-t">
					<text class="_text">查看详情</text>
					<text class="more-icon yticon icon-you"></text>
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

	 //预览图片
	const common = require('@/mixins/common');
	
	var options = {};
	common(options);
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		mixins: [{ methods: options }],
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 65,
				activityList: []
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.getActivityList();
		},
		onShow: function () {
			let that = this;
			that.updateScene(65, 0);
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: that.$store.state.config.share.format.app_share_right,
		    path: '/pages/message/activityList/activityList?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		
		onShareTimeline: function (res) {
		  let that = this;
		  return {
		    title: that.$store.state.config.share.format.app_share_right,
		    query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getActivityList(){
				let that = this;
				uni.loading(true);
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/activity', {}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							activityList: res.data
						});
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

<style scoped lang="scss">
	.page-wrap{
		@include background_color(page-gray-background-color);
		padding-bottom: 30rpx;
	}
	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		padding-top: 10rpx;
		font-size: $uni-font-size-sm-base;
		color: #7d7d7d;
	}

	.content {
		width: 660rpx;
		padding: 0 24rpx;
		@include background_color(page-box-background-color);
		border-radius: 4rpx;
	}

	.title {
		display: flex;
		align-items: center;
		font-size: $uni-font-size-lg;
		padding: 20rpx 0;
		@include color(color-light-dark);
	}

	.img-wrapper {
		width: 100%;
		height: 260rpx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36rpx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16rpx 0;
		font-size: $uni-font-size-base;
		@include color(color-lighter-er-dark);
		line-height: 38rpx;
		word-break: break-word;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		font-size: $uni-font-size-sm;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: $uni-font-size-lg;
	}
</style>
