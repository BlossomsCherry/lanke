<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
		
		<navBar :back="isBack" :scene="2" @search="toSliderUrl(6, '/pagesA/shop/list/list')" :searchBar="true" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			
			<!-- #ifdef MP -->
			<view slot="left" class="lxy-nav-bar__logo default" v-if="!isBack">
				<i class="mini-icon mini-diandiandain" @tap.stop.prevent="shutShowMorePopup"></i>
			</view>
			<!-- #endif -->
			
			
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo default">
				<i class="mini-icon mini-diandiandain" @tap.stop.prevent="shutShowMorePopup"></i>
			</view>
			<!-- #endif -->
		</navBar>
		

		<view class="shop-page-content">
			
			<block v-if="banners && banners.length > 0">
				<view style="height: 20rpx;"></view>
				<view class="swiper-wrap">
					<view class="swiper-box">
						<u-swiper :list="banners" keyName="poster" height="250rpx" bgColor="transparent" :height="220" @click="swiperClick"></u-swiper>
					</view>
				</view>
			</block>

			
			<block v-if="notice && notice.length > 0">
				<view class="notice-box">
					<swiper :autoplay="true" :circular="true" :vertical="true" interval="4000" class="notice">
						<swiper-item class="notice-item" :data-id="item.id" @tap.stop.prevent="toNtice" v-for="(item, index) in notice" :key="index">
							<i class="mini-icon mini-laba _image"></i>
							<text class="_text">{{ item.title }}</text>
						</swiper-item>
					</swiper>
				</view>
			</block>
			
			
			<block v-if="navs && navs.length > 0">
				<view class="navs-wrap">
					<view style="height: 30rpx;"></view>
					<u-scroll-list :indicatorActiveColor="primaryColor" indicatorStyle="transform: scale(0.6);margin-top: 3px;">
						<view class="navs-wrap flex-row">
							<view v-for="(item, index) in navs" :key="index" class="nav-item flex-column">
								<view class="img flex-column">
									
									<block v-if="item.img">
										<image class="_image" :src="item.img" mode="" @tap.stop.prevent="toSliderUrl(item.type, item.target_id)"></image>
									</block>
									<block v-else-if="item.icon">
										<i :class="'mini-icon mini-icon2 ' + item.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(item.type, item.target_id)"></i>
									</block>
								</view>
								<text class="_text">{{ item.name }}</text>
							</view>
						</view>
					</u-scroll-list>
				</view>
			</block>
			<block v-else>
				<view style="height: 30rpx;"></view>
			</block>
			
			
			<block v-if="config_page_shop_accordion">
				<view class="tower-swiper" @touchstart="towerStartFun" @touchmove="towerMove" @touchend="towerEnd" >
					<view :class="'tower-item ' + (item.zIndex == 1 ? 'none' : '')" :style="'--index:' + item.zIndex + ';--left:' + item.mLeft" v-for="(item, index) in swiperList" :key="item.id">
						<view class="swiper-item">
							<image :src="item.pic[0]" mode="aspectFill"></image>
							<view class="swiper-info">
								<view class="info-tage">
									<text class="_text" v-for="(it, index1) in item.tag" :key="index1">{{ it }}</text>
								</view>
								<view class="info-title">{{ item.name }}</view>
								<view class="info-duce">{{ item.intro }}</view>
								<view class="info-bur">
									<view class="price">
										<text class="_text">¥</text>
										{{ item.vip_price }}
									</view>
									<view class="info-img" @tap.stop.prevent="toSliderUrl(3, item.id)">
										<i class="mini-icon mini-shangpin1 _image"></i>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 20rpx;"></view>
				<view style="height: 20rpx;"></view>
			</block>
			
			

			<block v-if="config_page_shop_hot">
				<view class="hot">
					<view class="hot-box" v-for="(item, index) in hotList" :key="item.id">
						<view class="hot-box-top bg-cover" :style="'background-image: url(' + item.bg_img + ');'">
							<view class="title">热销榜</view>
							<view class="name-box" @tap.stop.prevent="toSliderUrl(7, item.id)" data-focus="0" >
								<view class="name">{{ item.name }}</view>
								<view class="arrow-w"></view>
							</view>
						</view>
				
						<view class="hot-box-bottom">
							<view class="hot-box-goods" @tap.stop.prevent="toSliderUrl(3, it.id)" v-for="(it, idx) in item.goods" :key="idx">
								<view v-if="idx == 0" class="ranking b1">1</view>
				
								<view v-if="idx == 1" class="ranking b2">2</view>
				
								<view v-if="idx == 2" class="ranking b3">3</view>
				
								<image class="img" :src="it.pic[0]" mode="aspectFill"></image>
				
								<view class="name">{{ it.name }}</view>
							</view>
						</view>
					</view>
					<view style="width: 15px; flex-shrink: 0"></view>
				</view>
				<view style="height: 20rpx;"></view>
			</block>
			
			<view class="goods-container">
				<ls-skeleton :loading="topload" :skeleton="skeleton" :animate="true" :scene="90730">
					<l-water-flow comName="goods" :waterData="goodsWaterData" :column-gap="8"  :scene="2" :wrapWidth="730"/>
					<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" />
				</ls-skeleton>
			</view>

			<view class="shop-bags" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/cart/cart')">
				<view class="bags-badge" v-if="cartCount > 0">{{ cartCount > 99 ? '99+' : cartCount }}</view>
				<i class="mini-icon mini-shangpin1 _image"></i>
			</view>
		</view>
		
		
		<u-popup :show="showMorePopup" @close="shutShowMorePopup" :zIndex="99999991009" mode="bottom" :safeAreaInsetBottom="false">
			<view class="more-warap">
				<view class="inner">
					<view class="title">
						更多功能
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutShowMorePopup"></i>
					</view>
					<view class="more-content">
						
						<view class="more-item"  @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/cart/cart')">
							<view class="icon">
								<i class="mini-icon2 mini-wodegouwudai"></i>
							</view>
							<view class="text">购物袋</view>
						</view>
						
						
						<view class="more-item" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/order/order')">
							<view class="icon">
								<i class="mini-icon2 mini-wodedingdan"></i>
							</view>
							<view class="text">订单</view>
						</view>
						
						
						<!-- #ifdef MP -->
						<button class="u-reset-button more-item" open-type="contact">
							<view class="icon">
								<i class="mini-icon mini-kefufenxiermaikefu"></i>
							</view>
							<view class="text">客服</view>
						</button>
						<!-- #endif -->
						
						<!-- #ifndef MP -->
						<view class="more-item"  @tap.stop.prevent="toSliderUrl(config_page_shop_servicer.servicer_target_type, config_page_shop_servicer.servicer_target_id)">
							<view class="icon">
								<i class="mini-icon mini-kefufenxiermaikefu"></i>
							</view>
							<view class="text">客服</view>
						</view>
						<!-- #endif -->
						
						
						<view class="more-item" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/address/address')">
							<view class="icon">
								<i class="mini-icon2 mini-shouhuodizhi"></i>
							</view>
							<view class="text">地址管理</view>
						</view>
						
					</view>
					
				</view>
			</view>
		</u-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

import lWaterFlow from '@/linui/water-flow/index';
import goods from '@/components/common/water/goods-item/index';
import ScrollNav from '@/contrib/components/common/scroll-nav/scroll-nav';

const common = require('@/mixins/common');
const user = require('@/mixins/user');
const shop = require('@/mixins/shop');
var options = {};

shop(options);
common(options);
user(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		lWaterFlow,
		goods,
		ScrollNav,
		lsSkeleton
	},
	computed:{
		config_page_index_header:{
			get(){
				let that = this;
				if(that.$store.state.config.page.index){
					return that.$store.state.config.page.index.header;
				}
				return [];
			},
			set(v){}
		},
		config_page_shop_banner:{
			get(){
				let that = this;
				let banner = that.$store.state.config.page.shop.banner;
				if(banner){
					return banner;
				}else{
					return [];
				}
			},
			set(v){}
		},
		config_page_shop_nav:{
			get(){
				let that = this;
				let nav = that.$store.state.config.page.shop.nav;
				if(nav){
					return nav;
				}else{
					return [];
				}
			},
			set(v){}
		},
		config_page_shop_accordion:{
			get(){
				let that = this;
				return that.$store.state.config.page.shop.accordion;
			},
			set(v){}
		},
		config_page_shop_hot:{
			get(){
				let that = this;
				return that.$store.state.config.page.shop.hot;
			},
			set(v){}
		},
		config_page_shop_servicer:{
			get(){
				let that = this;
				if(that.$store.state.config.page.shop && that.$store.state.config.page.shop.servicer){
					return that.$store.state.config.page.shop.servicer;
				}
				return {
					"servicer_target_type": 0,
					"servicer_target_id": ""
				}
			},
			set(v){}
		},
		skeleton: {
			get(){
				let that = this;
				return that.$store.state.skeleton.waterfall;
			},
			set(v){}
		},
	},
	data() {
		return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 2,
			notice: [],
			// plateList: [],
			topload: true,
			swiperList: [],
			hotList: [],
			recommendList: [],
			page: 1,
			loadmoreShow: false,
			isLastPage: false,
			cartCount: 0,
			selected: 0,
			sysMessageCount: '',
			towerStart: '',
			direction: '',

			it: {
				idx: '',
				id: '',
				pic: '',
				name: ''
			},
			isBack: false,
			banners: [],
			navs: [],
			goodsWaterData: {
				e: 0,
				data: []
			},
			showMorePopup: false
		};
	},
	onPageScroll: function onPageScroll(e) {

	},
	onLoad: function(options) {
		let that = this;
		that.globalOnloadProcess(options);
		
		that.getShopBannerAndNav();
		
		if(options.back == 1){
			that.isBack = true;
		}
		// that.getShopPlate();
		
		if(that.$store.state.config.page.shop.accordion){
			that.getShopInspiration();
		}
		
		if(that.$store.state.config.page.shop.hot){
			that.getShopHotList();
		}
		
		that.getShopIndexRecommend();
	},
	onShow: function() {
		let that = this;
		// #ifdef MP-WEIXIN
		getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
		// #endif

		//  #ifdef MP
		// if ('function' == typeof this.getTabBar && this.getTabBar()) {
		//     this.getTabBar().setData({
		//         selected: 3
		//     });
		// }
		that.tabBarSetData({selected: 1});
		// #endif
		//  #ifndef MP
		that.$store.commit('updateTabbarIndex', 1)
		// #endif
		that.updateScene(2, 0);
		
		
		that.getSysMessageCount().then(function(res) {
			//  #ifdef MP
			that.tabBarSetData({
				sysMessageCount: res
			});
			// #endif
			
			if(res > 0){
				that.$store.commit('updateSysMessageCount', res);
			}else{
				that.$store.commit('updateSysMessageCount', 0);
			}
		});
	},
	onPullDownRefresh: function() {
		let that = this;
		that.setData({
			topload: true,
			loadmoreShow: false,
			isLastPage: false,
			page: 1
		});
		that.getShopBannerAndNav();
		// that.getShopPlate();
		
		if(that.config_page_shop_accordion){
			that.getShopInspiration();
		}

		if(that.config_page_shop_hot){
			that.getShopHotList();
		}
		
		that.getShopIndexRecommend();

	},
	onReachBottom: function() {
		let that = this;
		that.setData({
			loadmoreShow: true,
			page: that.page + 1
		});
		that.getShopIndexRecommend();
	},
	onShareAppMessage: function(res) {
		let that = this;

		return {
			title: '好物  - ' + that.$store.state.config.about.name,
			path: '/pages/' + (that.isBack ? 'tabbar_clone' : 'tabbar') + '/shop/shop?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: '好物  - ' + that.$store.state.config.about.name,
			query: '' + 'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config.img.default_share
		};
	},
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/shop/shop'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
	methods: {
		swiperClick(index){
			let that = this;
			uni.wen.toUrl(that.banners[index].slideshow_type, that.banners[index].target_id, that);
		},
		shutShowMorePopup(){
			let that = this;
			that.showMorePopup = !that.showMorePopup;
		},
		getShopBannerAndNav() {
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/bannerAndNav').then(function(res) {
				uni.stopPullDownRefresh();
				let args = {};
				args.banners = res.data.banners;
				args.notice = res.data.notice;
				args.navs = res.data.navs;
				args.swiperload = false;
				that.setData(args);
			});
		},

		toNtice(e) {
			uni.wen.toUrl(6, '/pages/common/clause?id=' + e.currentTarget.dataset.id + '&type=-1', null);
		},

		// 初始化towerSwiper
		towerSwiper(name) {
			let list = this[name];

			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
				list[i].mLeft = i - parseInt(list.length / 2);
			}

			this.setData({
				swiperList: list
			});
		},

		// towerSwiper触摸开始
		towerStartFun(e) {
			console.log("towerStartFun")
			this.setData({
				towerStart: e.touches[0].pageX
			});
		},

		// towerSwiper计算方向
		towerMove(e) {
			// console.log("towerMove")
			this.setData({
				direction: e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			});
		},

		// towerSwiper计算滚动
		towerEnd() {
			console.log("towerEnd",this.direction)
			let direction = this.direction;
			let list = this.swiperList;

			if (direction == 'right') {
				let mLeft = list[0].mLeft;
				let zIndex = list[0].zIndex;

				for (let i = 1; i < list.length; i++) {
					list[i - 1].mLeft = list[i].mLeft;
					list[i - 1].zIndex = list[i].zIndex;
				}

				list[list.length - 1].mLeft = mLeft;
				list[list.length - 1].zIndex = zIndex;
				this.setData({
					swiperList: list
				});
			} else {
				let mLeft = list[list.length - 1].mLeft;
				let zIndex = list[list.length - 1].zIndex;

				for (let i = list.length - 1; i > 0; i--) {
					list[i].mLeft = list[i - 1].mLeft;
					list[i].zIndex = list[i - 1].zIndex;
				}

				list[0].mLeft = mLeft;
				list[0].zIndex = zIndex;
				this.setData({
					swiperList: list
				});
			}
		},
	}
};
</script>
<style lang="scss">
@import './shop.scss';
</style>
