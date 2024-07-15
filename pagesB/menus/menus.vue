<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body content">
		<navBar :back="true" :home="fph" :title="page_title" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		<view style="height: 50rpx;"></view>
		<view class="menus-type-1">
			<view class="menu-item" v-for="(item, index) in menus" :key="index" @tap.stop.prevent="toSliderUrl(item.type, item.target_id)">
				<view class="img-wrap">
					<image :src="item.img" mode=""></image>
				</view>
				<view class="name">{{ item.name }}</view>
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
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 64,
				pageId: 0,
				menus: [],
				page_title: '',
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
			that.updateScene(64, 0);
		},
		onShareAppMessage: function(res) {
			return {
				title: that.$store.state.config.share.format.app_share_right,
				path: '/pagesB/menus/menus?pageId='+ that.pageId +'&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
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
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'page/menus', {
					id: that.pageId
				}).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.setData({
							menus: res.data.config.menus,
							page_title: res.data.header.center
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
	width: 750rpx;
	.menus-type-1 {
	    display: flex;
	    flex-wrap: wrap;
		width: $page-content-body-width;
		margin: 0 auto;
		.menu-item {
			width: 25%;
			min-width: 25%;
			max-width: 25%;
			margin-bottom: 100rpx;
			.img-wrap{
				text-align: center;
				image{
					width: 60rpx;
					height: 60rpx;
				}
			}
			.name{
				text-align: center;
				font-size: $uni-font-size-sm-base;
				@include color(color-light-dark);
				margin-top: 20rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}

</style>
