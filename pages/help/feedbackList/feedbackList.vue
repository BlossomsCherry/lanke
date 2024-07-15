<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body page">

		<view v-for="(item,index) in feedbacks" :key="index" @click="feedbackClick(item)">
			<view class="list-box">
				<view class="text-title">{{item.content}}</view>
				<view v-if="item.state=='0'" class="text-tips">{{item.replay_default}}</view>
				<view v-if="item.state=='1'" class="text-tips">{{item.reply}}</view>
				<view class="text-time">{{item.created_at}}</view>
				<view :class="item.state=='0'?'state-grey':'state-green'  ">{{item.stateName}}</view>
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
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 43,
				feedbacks: [],
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			that.getUserFeedback();
		},
		onShow: function () {
			let that = this;
			that.updateScene(43, 0);
			that.getUserFeedback();
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			//获取用户意见反馈列表
			getUserFeedback() {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'feedback/feedbacked', {}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							feedbacks: res.data
						});
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					
				});
			},
			feedbackClick(item) {
				uni.wen.toUrl(6, '/pages/help/feedbackDetail/feedbackDetail?item=' + encodeURIComponent(JSON.stringify(item)), null);
			},
		}
	}
</script>

<style lang="scss">
	.text-title {
		@include color(color-light-dark);
		font-size: $uni-font-size-medium;
		font-weight: bold;
		margin-right: 100rpx;
	}

	.text-time {
		@include color(color-lightest-dark);
		font-size: $uni-font-size-sm;
		margin-top: 24rpx;
	}

	.text-tips {
		color: #bcbcbc;
		font-size: $uni-font-size-sm;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 22rpx;
	}

	.state-green {
		position: absolute;
		right: 0;
		top: 0;
		color: #07C160;
		font-size: $uni-font-size-base;
		padding: 30rpx;
	}

	.state-grey {
		position: absolute;
		right: 0;
		padding: 30rpx;
		top: 0;
		color: #606266;
		font-size: $uni-font-size-base;
	}

	.list-box {
		position: relative;
		@include background_color(page-box-background-color);
		border-radius: 10rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		padding: 30rpx;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
</style>
