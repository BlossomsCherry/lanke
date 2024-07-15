<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body content">
		<aloys-tab :tabs="tabs" @change="onTabChange">
		  <view :slot="'content' + index" v-for="(content, index) in contents" :key="index">
			  <view :class="'content-wrap' + ' style-' + style ">
				  <view class="tab-item" v-for="(item, index2) in content" :key="index2" @tap="toSliderUrl(item.type, item.target_id)">
					  <view class="left">
						  <image :src="item.img" mode="aspectFill"></image>
					  </view>
					  <view class="right">
						  <view class="title">{{item.name}}</view>
						  <view class="desc">{{item.desc}}</view>
					  </view>
				  </view>
			  </view>
		  </view>
		</aloys-tab>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	
	
	import aloysTab from "@/pagesB/components/aloys-tab/aloys-tab.vue"
	const common = require('@/mixins/common');
  var options = {};
  
   //预览图片
  common(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
			aloysTab
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 30001,
				tabs: [],
				pageId: 0,
				title: "",
				contents: [],
				style: 0
			}
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.pageId = options.id;
			that.init();
		},
		onShow: function () {
			let that = this;
			that.updateScene(30001, 0);
		},
		onShareAppMessage: function(res) {
			return {
				title: that.$store.state.config.share.format.app_share_right,
				path: '/pages/tabbar/index/index?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config.img.default_share
			};
		},
		
		onShareTimeline: function(res) {
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
			init(){
				let that = this;
				uni.loading(true);
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'page/tabs', {
					id: that.pageId
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							style: res.data.style,
							tabs: res.data.config.tabs,
							title: res.data.header.center,
							contents: res.data.config.tab_pages
						});
						uni.setNavigationBarTitle({
							title: res.data.header.center
						});
						
					}else{

						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
				
			},
		  onTabChange(index) {
			// uni.showToast({
			//   title: '切换至tab：' + index
			// })
		  }
		}
	}
</script>

<style lang="scss" scoped>
.content{
  position: absolute;
  height: 100%;
  @include background_color(page-box-background-color);
}
.content-wrap.style-0{
	padding: 0 30rpx;
	.tab-item {
	    display: flex;
		width: 100%;
		padding: 20rpx 0;
		border-bottom: 1rpx solid;
		@include border_color(border-color-light-line-background-color);
		box-sizing: border-box;
		.left{
			margin-right: 20rpx;
			image{
				width: 100rpx;
				height: 100rpx;
				border-radius: 8rpx;
			}
		}
		.right{
			.title{
				font-weight: bold;
				font-size: $uni-font-size-base;
				height: 60rpx;
				line-height: 60rpx;
				@include color(color-light-dark);
			}
			.desc{
				@include color(color-lighter-er-dark);
				font-size: $uni-font-size-sm-base;
				height: 40rpx;
				line-height: 40rpx;
			}
		}
	}
}
.content-wrap.style-1{
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.tab-item {
		width: 48%;
		min-width: 48%;
		max-width: 48%;
		box-sizing: border-box;
		display: inline-block;
		margin-bottom: 40rpx;
		box-shadow: 4rpx 10rpx 15rpx 4rpx #ddd;
		border-radius: 10rpx;
		.left{
			width: 100%;
			image{
				border-radius: 10rpx 10rpx 0 0;
				width: 100%;
				height: 200rpx;
			}
		}
		.right{
			padding: 10rpx 20rpx 20rpx;
			
			.title{
				font-weight: bold;
				font-size: $uni-font-size-base;
				line-height: 60rpx;
				@include color(color-light-dark);
			}
			.desc{
				@include color(color-lighter-er-dark);
				font-size: $uni-font-size-sm-base;
				line-height: 40rpx;
				text-overflow: -o-ellipsis-lastline;  
				overflow: hidden;  
				text-overflow: ellipsis;  
				display: -webkit-box;  
				-webkit-line-clamp: 2;  
				-webkit-box-orient: vertical; 
			}
		}
	}
}
</style>
