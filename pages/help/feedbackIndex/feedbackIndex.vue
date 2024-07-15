<!-- 帮助反馈页面 -->
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="text-top">热门问题</view>
		<view class="bg-list">
			<block v-if="problemList && problemList.length > 0">
				<view v-for="(item,index) in problemList" :key="index" :title="index" class="list-title">
					<view class="text-title">{{item.name}}</view>
					<block v-if="item.list && item.list.length > 0">
						<view v-for="(problemItem,problemIndex) in item.list" :key="problemIndex" class="list-question"
							hover-class="hover" @click="onClick(problemItem)">
							<view class="text-item">{{problemItem.title}}</view>
							<view class="line" v-if="problemIndex!=item.list.length-1"></view>
						</view>
					</block>
					<block v-else>
						<u-empty text="我很干净" width="300" height="300" textSize="28" />
					</block>
				</view>
			</block>
			<block v-else>
				<u-empty text="还没有帮助问题哦" width="300" height="300" textSize="28" />
			</block>
		</view>
		<view class="bg-box">
			<view class="bg-white-box">
				<image src="@/pages/help/static/help/icon-letter.png" class="image"></image>
				<view class="text-feedback" hover-class="hover" @click="toFeedbackList">我的反馈</view>

				<view class="vertical-line"></view>

				<image src="@/pages/help/static/help/icon-edit.png" class="image"></image>
				<view class="text-feedback" hover-class="hover" @click="toFeedback">我要反馈</view>
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
	export default {
		components: {
			myToast,navBar,hoverBall,
		},
		computed:{

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 42,
				problemList: [

				],
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			that.getQaList();
		},
		onShow: function () {
			let that = this;
			that.updateScene(42, 0);
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			getQaList(){
				let that = this;
				let typeList = that.$store.state.config.page.qa.type;
				if(!typeList || typeList.length <= 0){
					uni.showToast({
						title: '请至[移动端-我的-帮助与反馈]进行配置',
						icon:'error'
					});
					return false;
				}
				uni.loading(true);

				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'help/questions', {
					types: JSON.stringify(typeList)
				}).then(function(res) {
					uni.loading(false);
					if(res.status){

						that.setData({
							problemList: res.data
						});

					}else{

						uni.showToast({
							title: res.message,
							icon:'error'
						});
					}
				});
			},
			onClick(item) {
				uni.wen.toUrl(8, '&item=' + encodeURIComponent(JSON.stringify(item)), null);
			},
			toFeedbackList() {
				uni.wen.toUrl(6, '/pages/help/feedbackList/feedbackList', null);
			},
			toFeedback() {
				uni.wen.toUrl(6, '/pages/help/feedback/feedback', null);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F8F8F8;
		height: 100%;
	}

	.bg-box {
		@include background_color(page-gray-background-color);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bg-list {
		margin-bottom: 100rpx;
		@include background_color(page-box-background-color);
		padding: 30rpx
	}

	.bg-white-box {
		@include background_color(page-box-background-color);
		margin: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 10rpx;
		border-radius: 20rpx;
		@include color(color-light-dark);
		font-size: $uni-font-size-lg;
	}

	.vertical-line {
		height: 20rpx;
		background-color: #cecece;
		width: 2rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.line {
		width: 100%;
		height: 1rpx;
		background-color: #F5F5F5;
	}

	.text-title {
		@include color(color-light-dark);
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}

	.text-item {
		@include color(color-lightest-dark);
		font-size: $uni-font-size-base;
		padding: 24rpx;
	}

	.list-title {
		margin-bottom: 30rpx;
	}

	.list-question {
		color: #606266;
		font-size: $uni-font-size-base;
	}

	.hover {
		background-color: #eee;
		opacity: 0.6;
	}

	.image {
		width: 40rpx;
		height: 40rpx;
		margin-left: 20rpx;
	}

	.text-feedback {
		padding: 20rpx;
	}

	.text-top {
		padding-top: 30rpx;
		margin: 0 30rpx 30rpx;
		@include color(color-lighter-dark);
		font-size: $uni-font-size-base;
	}
</style>
