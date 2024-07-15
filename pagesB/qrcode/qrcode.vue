<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="">
			<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" background="rgba(255, 255, 255, 0);" :placeholder="false">
			
			</navBar>
			<image :src="pageConfig.banner" mode="aspectFill" style="width: 750rpx;height: 200px;"></image>
		</view>
		<tabsSwiper ref="uTabs" :list="pageConfig.tabs" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :active-color="primaryColor" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'"></tabsSwiper>
		<swiper   :current="swiperCurrent" @change="swiperChange" @transition="transition" @animationfinish="animationfinish" :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' ">
			<block v-for="(item, index) in pageConfig.tabs" :key="index">
				<swiper-item class="swiper-item swiper-item-1">
					<scroll-view scroll-y class="qrcode-content"  :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' " @scrolltolower="onreachBottom">
						<view class="qrcode-wrap flex-column">
							<view class="code-wrap">
								<image class="_image" :src="item.code" @tap.stop.prevent="previewImage(item.code)"></image>
							</view>
							<view class="desc flex-row" style="justify-content: center;">{{ item.desc }}</view>
						</view>
					</scroll-view>
				</swiper-item>
			</block>
		</swiper>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		tabsSwiper
	},
	computed:{
		swiperHeight:{
			get(){
				let that = this;
				return ' calc( 100vh - 200px - 80rpx )';
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 38,
			pageId: 0,
			pageConfig: {
				banner: '',
				tabs: []
			},
			current: 0,
			swiperCurrent: 0,
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(38, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.pageId = options.id;
		that.init();
	},
	onShareAppMessage: function(res) {
		return {
			title: that.$store.state.config.share.format.app_share_right,
			path: '/pagesB/qrcode/qrcode?pageId='+ that.pageId +'&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
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
		previewImage(url){
			uni.previewImage({
				urls: [url]
			});
		},
		init(){
			let that = this;
			uni.loading(true);
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'page/qrcodes', {
				id: that.pageId
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					that.setData({
						pageConfig: res.data.config,
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
		onreachBottom() {
			let that = this;
			
		},
		swiperChange(e){
			let that = this;
	    },
		animationfinish(e) {
			let that = this;
			let current = e.detail.current;
			that.$refs.uTabs.setFinishCurrent(current);
			that.swiperCurrent = current;
			that.current = current;
		},
		tabsChange(index) {
			let that = this;
			that.swiperCurrent = index;
		},
		transition(e) {
			let that = this;
			let dx = e.detail.dx;
			that.$refs.uTabs.setDx(dx);
		},
	}
}
</script>

<style lang="scss" scoped>
.qrcode-wrap{
	justify-content: center;
	width: 750rpx;
	.code-wrap{
		margin: 40rpx auto 20rpx;
		width: 400rpx;
		height: 400rpx;
		@include background_color(page-box-background-color);
		._image{
			width: 400rpx;
			height: 400rpx;
		}
	}
	.desc{
		@include color(color-lightest-dark);
		text-align: center;
		padding: 20rpx 100rpx;
		box-sizing: border-box;
	}
}
</style>