<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="fph ? false : true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :searchBar="true" @search="toSliderUrl(6, '/pagesU/used-mall/search/search')">
			
		</navBar>
		<!-- 轮播图 -->
		<view class="used-mall-page">
			<view class="index">
				<block v-if="config2_page_used_index_banner && config2_page_used_index_banner.length > 0">
					<view class="page-block-gap"></view>
					<view class="index-swiper">
						<swiper class="swiper" circular :autoplay="true" :current="current" @change="e => {current = e.detail.current}">
							<swiper-item v-for="(item, index) in config2_page_used_index_banner" :key="index" @tap.stop.prevent="toSliderUrl(item.slideshow_type, item.target_id)">
								<image class="swiper-image" :src="item.poster"></image>
							</swiper-item>
						</swiper>
						<view class="index-swiper-indicator">
							<view class="dot" :class="[{'active': current === index}]" v-for="(item, index) in config2_page_used_index_banner" :key="index"></view>
						</view>
					</view>
				</block>
				<!-- 本季热卖 -->
				<!-- <view class="index-king">
					<view class="index-title">本季热卖</view>
					<u-grid :border="false" col="4">
						<u-grid-item v-for="(item,index) in grid" :key="index">
							<view>
								<image :src="item.img"></image>
							</view>
							<view class="grid-text">{{item.title}}</view>
						</u-grid-item>
					</u-grid>
				</view> -->
				<!-- 热门品牌 -->
				<!-- <view class="index-brand">
					<view class="index-title">热门品牌</view>
					<view class="index-brand-box">
						<view v-for="(item,index) in brandList" :key="index">
							<view>
								<image :src="item.img"></image>
							</view>
							<view class="grid-text">{{item.title}}</view>
						</view>
					</view>
				</view> -->
				<!-- 附近推荐 -->
				<view class="index-list">
					<u-sticky>
						<view class="index-list-tabs">
							<scroll-view class="_scroll_view" scrollX enableFlex="enable-flex" enhanced="enhanced"
								scrollWithAnimation="scroll-with-animation" :showScrollbar="false">
								<view class="nav-center">
									<view :class="'nav-item ' + ( (classify_id == 0 && channelIndex == 0) ? 'cur' : '' ) " @tap.stop.prevent="changeChanel(0, 0)">最新</view>
									<view class="space"></view>
									<view :class="'nav-item ' + ( (classify_id == 0 && channelIndex == 1) ? 'cur' : '' ) " @tap.stop.prevent="changeChanel(1, 0)">附近</view>
									<view class="space"></view>
									<view :class="'nav-item ' + ( (classify_id == 0 && channelIndex == 2) ? 'cur' : '' ) " @tap.stop.prevent="changeChanel(2, 0)">已成交</view>
									<block v-for="(item, index) in classify_list" :key="index">
										<view class="space"></view>
										<view :class="'nav-item ' + ( classify_id == item.id ? 'cur' : '' ) " @tap.stop.prevent="changeChanel(-1, item.id)">{{ item.name }}</view>
									</block>
								</view>
							</scroll-view>
						</view>
					</u-sticky>
					<view class="index-list-box">
						<ls-skeleton :loading="goodsLoad" :skeleton="skeleton" :animate="true" :scene="90730">
							<block v-if="goodsWaterData.data && goodsWaterData.data.length > 0">
								<l-water-flow comName="used" :waterData="goodsWaterData" ref="goodswater" :column-gap="15" :scene="100" :wrapWidth="730" />
								<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
									iconSize="28" fontSize="28" color="#989898" />
							</block>
							<block v-else>
								<view style="height: 140rpx;"></view>
								<u-empty text="一个也没有" width="300" height="300" text-size="28" />
							</block>
							<view style="height: 140rpx;"></view>
							<view class="safe_area_height"></view>
						</ls-skeleton>
					</view>
				</view>
				<view class="to-publish" @tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/issue/index')">
					<view class="_text">发布闲置</view>
					<view class="icon flex-column">
						<i class="mini-icon mini-zhanneizhuanfa"></i>
					</view>
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
	import lWaterFlow from '@/linui/water-flow/index';
	import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
	
	const common = require('@/mixins/common');
	var options = {};
	common(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
			lWaterFlow,
			lsSkeleton
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 100,
				goodsWaterData: {
					e: 0,
					data: []
				},
				page: 1,
				isLastPage: false,
				loadmoreShow: false,
				goodsLoad: true,
				orderBy: 'id',
				order: 'desc',
				classify_id: 0,
				classify_list: [],
				
				
				current: 0,
				channelIndex: 0,
				status: '1,3,5,6,7,8,9,10',
			}
		},
		computed:{
			skeleton: {
				get(){
					let that = this;
					return that.$store.state.skeleton.waterfall;
				},
				set(v){}
			},
			config2_page_used_index_banner:{
				get(){
					let that = this;
					if(that.$store.state.config2.page.used && that.$store.state.config2.page.used.index){
						return that.$store.state.config2.page.used.index.banner || []
					}
					return [];
				},
				set(v){}
			},
		},
		onLoad(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			
			that.getUsedGoodList();
			that.getUsedclassifyList();
		},
		onShow: function () {
			let that = this;
			that.updateScene(100, 0, false, false, 0, 2);
		},
		onReachBottom() {
			let that = this;
			if(that.isLastPage){
				return false;
			}
			if(that.goodsWaterData.data.length <= 0){
				return false;
			}
			that.setData({
				page: that.page + 1,
				loadmoreShow: true
			});
			that.getUsedGoodList();
		},
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				goodsWaterData: {
					e: 1,
					data: []
				},
				page: 1,
				isLastPage: false,
				loadmoreShow: false,
				goodsLoad: true,
			});
			
			that.getUsedGoodList();
		},
		onShareAppMessage: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.index_title,
				path: '/pagesU/used-mall/home/index?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config2.used.share.index_image
			};
		},
		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.index_title,
				query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config2.used.share.index_image
			};
		},
		methods: {
			// tabs点击切换
			changeChanel(index, classify_id) {
				let that = this;
				if(that.goodsLoad){
					uni.showToast({
						title: '还在加载中',
						icon: 'none'
					})
					return false;
				}
				if(classify_id > 0){
					if(that.classify_id == classify_id){
						uni.startPullDownRefresh();
						return false;
					}else{
						that.setData({
							classify_id: classify_id,
							channelIndex: -1,
							status: '1,3,5,6,7,8,9,10',
							page: 1,
							orderBy: index == 1 ? 'distance' : 'id',
							isLastPage: false,
							loadmoreShow: false,
							goodsLoad: true,
							goodsWaterData: {
								e: 1,
								data: []
							},
						});
						that.getUsedGoodList();
						return false;
					}
				}
				
				
				if(that.channelIndex == index){
					that.classify_id = 0;
					uni.startPullDownRefresh();
					return false;
				}else{
					that.setData({
						channelIndex: index,
						page: 1,
						isLastPage: false,
						loadmoreShow: false,
						goodsLoad: true,
						orderBy: index == 1 ? 'distance' : 'id',
						classify_id: 0,
						status: index == 2 ? '3' : '1,3,5,6,7,8,9,10',
						goodsWaterData: {
							e: 1,
							data: []
						},
					})
				}
				if(index == 1){
					if(that.$store.state.token){
						if(that.myUserInfo.longitude && that.myUserInfo.latitude){
							
						}else{
							uni.wen.util.getLocation(that).then(res => {
							    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/tenants', { longitude: res.longitude, latitude: res.latitude }, 'POST').then(res => {
							        if (res.status) {
										uni.wen.util.updateUserInfo();
							        } else {
							            uni.showToast({title: res.message, icon: 'none', duration: 1500});
										return false;
							        }
							    });
							})
						}
					}else{
						uni.wen.toUrl(-4, null);
						return false;
					}
				}
				that.getUsedGoodList();
			},
			//消息方法
			toNotice() {

			},
			getUsedclassifyList() {
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/classify/list').then(function(res) {
					if (res.status) {
						that.classify_list = res.data;
					}
				});
			},
			getUsedGoodList(){
				let that = this;
				if(that.page == 1){
					that.setData({
						isLastPage: false,
						loadmoreShow: false,
						goodsLoad: true,
						goodsWaterData: {
							e: 1,
							data: []
						}
					})
				}
				
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/list', {
					page: that.page,
					orderBy: that.orderBy,
					order: that.order,
					classify_id: that.classify_id,
					status: that.status
				}, 'POST').then(function (res) {
					if(that.page == 1){
						uni.stopPullDownRefresh();
					}
					if(res.status){
						
						if(res.data.current_page != that.page){
							return false;
						}
						
						let data = res.data;
						let args = {};
					
						if(data.data && data.data.length > 0){
							args.goodsWaterData = {
								e: 0,
								data: data.data
							}
							args.page = data.current_page;
							args.loadmoreShow = false;
							args.isLastPage = false;
						}else{
							args.isLastPage = true;
						}
						args.goodsLoad = false;
						that.setData(args);
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>


<style lang="scss" scoped>
	.used-mall-page{
		.index{
			&-swiper {
				margin-bottom: 20rpx;
				display: flex;
				justify-content: center;
				position: relative;
				.swiper {
					height: 312rpx;
					width: 730rpx;
					border-radius: 8rpx;
			
					.swiper-image {
						width: 100%;
						height: 100%;
						border-radius: 8rpx;
					}
				}
			
				&-indicator {
					position: absolute;
					right: 48rpx;
					bottom: 24rpx;
					display: flex;
					align-items: center;
			
					.dot {
						margin: 0 3px;
						width: 6px;
						height: 6px;
						background-color: rgba(255, 255, 255, 0.5);
						border-radius: 6px;
						transition: 200ms all;
			
						&.active {
							background-color: #F7E253;
						}
					}
				}
			}
			
			&-king {
				padding-top: 32rpx;
				background-color: #fff;
			
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					overflow: hidden;
				}
			
				.grid-text {
					font-size: $uni-font-size-sm-base;
					color: #666666;
					padding-bottom: 30rpx;
				}
			}
			
			&-brand {
				padding-top: 32rpx;
				background-color: #fff;
				position: relative;
			
				&-box {
					display: flex;
					flex-wrap: wrap;
					padding: 0 24rpx;
					justify-content: space-between;
			
					>view {
						margin-bottom: 24rpx;
						position: relative;
					}
				}
			
				image {
					width: 220rpx;
					height: 220rpx;
					border-radius: 12rpx;
					overflow: hidden;
				}
			
				.grid-text {
					position: absolute;
					left: 0;
					top: 0;
					font-size: $uni-font-size-sm-base;
					width: 220rpx;
					height: 220rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: rgba(0, 0, 0, 0.5);
					color: #fff;
					border-radius: 12rpx;
				}
			}
			
			&-title {
				font-size: $uni-font-size-lg;
				font-weight: bold;
				padding-left: 24rpx;
				padding-bottom: 30rpx;
			}
			
			&-list {
				@include background_color(page-box-background-color);
				min-height: 80vh;
				&-title {
					padding-bottom: 0 !important;
				}
			
				&-tabs {
					padding: 12rpx 24rpx 12rpx;
					@include background_color(page-box-background-color);
					.nav-center {
						display: flex;
			
						.nav-item {
							@include color(color-lighter-dark);
							position: relative;
							white-space: nowrap;
							font-size: $uni-font-size-sm-base;
							padding: 10rpx 20rpx;
							border-radius: 100rpx;
							@include background_color(page-body-background-color);
							margin-right: 16rpx;
						}
			
						.space {
							width: 20rpx;
						}
			
						.nav-item.cur {
							@include background_color(uni-color-used-mall);
							font-weight: bold;
							@include color(color-always-black);
						}
					}
				}
			}
			.to-publish{
				@include background_color(uni-color-used-mall);
				color: #000000;
				position: fixed;
				bottom: calc( 40rpx + env(safe-area-inset-bottom) );
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				border-radius: 200rpx;
				padding: 20rpx 32rpx;
				._text{
					margin-right: 10rpx;
				}
				.icon{
					justify-content: center;
				}
			}
		}
	}
</style>