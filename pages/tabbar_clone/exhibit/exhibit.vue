<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__">
		<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
			<view class="goods-page-content">
				<view class="goods_head">
					<navBar :back="isBack" title="发现" :home="isBack && fph" :background="global__theme__ == 'black' ? 'rgba(14, 14, 17, ' + navbarTrans + ')' : 'rgba(246, 246, 246, ' + navbarTrans + ')'" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :scene="19">
						<view slot="left" class="lxy-nav-bar__logo default" v-if="!isBack && config_page_find2_header.left">
							<block v-if="config_page_find2_header.left && (config_page_find2_header.left.icon || config_page_find2_header.left.img)">
								<block v-if="config_page_find2_header.left.img">
									<image class="_image" :src="config_page_find2_header.left.img" mode="" @tap.stop.prevent="toSliderUrl(config_page_find2_header.left.type, config_page_find2_header.left.target_id)"></image>
								</block>
								<block v-else-if="config_page_find2_header.left.icon">
									<i :class="'mini-icon' + ' ' + config_page_find2_header.left.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config_page_find2_header.left.type, config_page_find2_header.left.target_id)"></i>
								</block>
							</block>
						</view>
						<!-- #ifdef APP || H5 -->
						<view slot="right" class="lxy-nav-bar__logo default" v-if="config_page_find2_header.right">
							<block v-if="config_page_find2_header.right.img">
								<image class="_image" :src="config_page_find2_header.right.img" mode="" @tap.stop.prevent="toSliderUrl(config_page_find2_header.right.type, config_page_find2_header.right.target_id)"></image>
							</block>
							<block v-else-if="config_page_find2_header.right.icon">
								<i :class="'mini-icon' + ' ' + config_page_find2_header.right.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config_page_find2_header.right.type, config_page_find2_header.right.target_id)"></i>
							</block>
						</view>
						<!-- #endif -->
					</navBar>
					<view class="goods_head_swiper" v-if="config_page_find2_banner && config_page_find2_banner.length > 0">
						<u-swiper :list="config_page_find2_banner" keyName="poster" height="250rpx" bgColor="transparent" :height="220" @click="clickSwiper"></u-swiper>
					</view>
				</view>
				<u-sticky :offsetTop="0">
					<view class="sticky_wrap">
						<view class="goods_head_search" @tap.stop.prevent="toSliderUrl(6, '/pagesA/shop/list/list')">
							<u-search :disabled="false" placeholder="搜索你想找的商品" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :placeholderColor="global__theme__ == 'black' ? '#6b6f77' : '#999999'" :showAction="false" :height="60"></u-search>
						</view>
						<view class="goods_head_tabs" v-if="config_page_find2_tabs && config_page_find2_tabs.length > 0">
							<u-tabs :itemStyle="{ height: '37px' }" @click="tabsClick" :list="config_page_find2_tabs" lineHeight="6" :lineColor="primaryColor" :activeStyle="{color: (global__theme__ == 'black' ? '#d8d8d9' : '#313131'), fontSize: '26rpx', transform: 'scale(1.08)'}" :inactiveStyle="{color: (global__theme__ == 'black' ? '#747476' : '#999999'), fontSize: '26rpx'}"></u-tabs>
						</view>
					</view>
				</u-sticky>
				<view class="inner">
					<view class="goods_head_list">
						<block v-if="!isNull">
							<block v-for="(item, index) in shopGoods" :key="index">
								<view class="box" @tap.stop.prevent="toSliderUrl(3, item.id)">
									<view class="img-wrap">
										<image class="img" :src="item.pic[0]" mode="aspectFill"></image>
										<view class="distance" v-if="item.distance && item.distance.length > 0">
											<i class="mini-icon mini-dizhi3"></i>
											<view class="_text">{{ item.distance }}</view>
										</view>
									</view>
									
									<view class="cont flex-column">
										<view>
											<view class="title">{{ item.name }}</view>
											<!-- <view class="desc" v-if="item.intro">{{ item.intro }}</view> -->
											<view class="time" v-if="item.service_time_tip">{{ item.service_time_tip }}</view>
											<block v-if="item.contact && item.contact.address_name">
												<view class="address">{{ item.contact.address_name }}</view>
											</block>
											<block>
												<view class="buy-tip flex-row">
													<view class="notbuy canbuy" v-if="item.type == 5">{{ '可购票' }}</view>
													<view class="notbuy" v-else-if="item.type == 1">{{ '第三方购票' }}</view>
												</view>
											</block>
										</view>
										<view>
											<view class="price-wrap">
												<block v-if="item.credit_type == 1">
													<view>
														<view class="price">
															<view class="icon">￥</view>
															<view class="_text">{{ item.price }}</view>
														</view>
													</view>
													<view>
														<view class="buys" v-if="item.buys > 0">{{ item.buys }}人购买</view>
													</view>
												</block>
												<block v-else-if="item.credit_type == 0">
													<view>
														<view class="price">
															<view class="gold-icon flex-column"><i class="mini-icon mini-Gold_coin_01"></i></view>
															<view class="_text gold">{{ item.price }}</view>
														</view>
													</view>
													<view>
														<view class="buys" v-if="item.buys > 0">{{ item.buys }}人兑换</view>
													</view>
												</block>
												
											</view>
										</view>
									</view>
								</view>
							</block>
							<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" bgClass="page-box-item4-background-color"
								iconSize="28" fontSize="28" color="#989898" />
							<view v-if="!isBack" style="height: 200rpx;"></view>
							<view class="safe_area_height"></view>
						</block>
						<block v-if="isNull">
							<u-empty text="一个圈子也没有" width="300" height="300" text-size="28" />
						</block>
					</view>
				</view>
			</view>
			<hover-ball v-if="isOfficial > 1"/>
			<my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
	</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	const common = require('@/mixins/common');
	var options = {};
	common(options);
	export default {
		mixins: [{
			methods: options
		}],
		components: {
			myToast,navBar,hoverBall
		},
		computed: {
		  config_page_find2_header: {
		    get() {
		      let that = this;
			  if(that.$store.state.config.page.find2){
				return that.$store.state.config.page.find2.header;
			  }
		      return [];
		    },
		    set(v) {}
		  },
		  config_page_find2_banner:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config.page.find2){
		  			return that.$store.state.config.page.find2.banner || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		  config_page_find2_tabs:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config.page.find2){
		  			return that.$store.state.config.page.find2.tabs || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 139,
				isBack: false,
				tenant_id: 0,
				navbarTrans: 0,
				color: '0,0,0',
				formData: {
					keyword: '',
					follow: -1,
					ids: "",
					types: "",
					orderBy: 'created_at',
					order: 'desc',
					master: 0
				},
				shopGoods: [],
				page: 1,
				isNull: false,
				isLastPage: false,
				loadmoreShow: false,
			}
		},
		onLoad: function (options) {
		  let that = this;
		  that.globalOnloadProcess(options);
		
		  if (options.back == 1) {
		    that.isBack = true;
		  }
		  
		  that.shopGoodsSearch();
		  
		},
		onShow: function () {
		  let that = this;
			// #ifdef MP-WEIXIN
			getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
			// #endif
			
			//  #ifdef MP
			that.tabBarSetData({selected: 1});
			// #endif
			//  #ifndef MP
			that.$store.commit('updateTabbarIndex', 1)
			// #endif
						
			that.updateScene(139, 0);
		
		  
			
			
		  that.getSysMessageCount().then(function (res) {
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
		  
		  
		  if(that.tenant_id != that.$store.state.tenant.tenant_id){
			uni.startPullDownRefresh();
		  }
		  
		},
		onReachBottom: function() {
			let that = this;
			if(!that.isLastPage && that.shopGoods.length > 0){
				that.setData({
					loadmoreShow: true,
					isLastPage: false,
					page: that.page + 1
				});
				that.shopGoodsSearch();
			}
		},
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				shopGoods: [],
				page: 1,
				isNull: false,
				isLastPage: false,
				loadmoreShow: false,
			});

			that.shopGoodsSearch();
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: '漫展 - ' + that.$store.state.config.about.name,
		    path: 'pages/tabbar/exhibit/exhibit?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onShareTimeline: function (res) {
		  let that = this;
		  return {
		    title: '漫展 - ' + that.$store.state.config.about.name,
		    query: '' + 'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onPageScroll: function onPageScroll(e) {
			let that = this;
			var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55
		
			if (trans >= 1 && that.navbarTrans >= 1) {
				return false
			}
		
			var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
			var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
			if (trans == 0) {
				frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
				backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
			} else if (trans >= 0.4) {
				frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
				backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
			}
			
			that.setData({
				navbarTrans: trans,
				color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
			})
			
			uni.setNavigationBarColor({
				frontColor: frontColor,
				backgroundColor: backgroundColor,
				animation: {
					duration: 400,
					timingFunc: 'easeIn',
				},
			})
		
			that.scrollTop = e.scrollTop
		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/exhibit/exhibit'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		methods: {
			searchClick(keyword){
				let that = this;
				that.formData.keyword = keyword;
				that.page = 1;
				that.loadmoreShow = false;
				that.shopGoods = [];
				
				that.shopGoodsSearch();
			},
			tabsClick(e){
				let that = this;
				if(e){
					that.formData.keyword = '';
					that.formData.follow = e.follow_status;
					that.formData.order = e.order;
					that.formData.orderBy = e.orderBy;
					that.formData.ids = e.ids;
					that.formData.types = e.types;
					that.formData.master = e.master;
					
					that.page = 1;
					that.shopGoods = [];
					that.shopGoodsSearch();
				}
			},
			clickSwiper(index){
				let that = this;
				if(that.config_page_find2_banner){
					uni.wen.toUrl(that.config_page_find2_banner[index].slideshow_type, that.config_page_find2_banner[index].target_id, that);
				}
			},
			shopGoodsSearch() {
			  let that = this;
			  if(that.page == 1){
				 uni.loading(true);
				 that.setData({
					isLastPage: false,
					loadmoreShow: false,
					isNull: false
				 });
			  }
			  
			  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'index/search', {
			    keyword: that.formData.keyword,
				follow: that.formData.follow,
				orderBy: that.formData.orderBy,
				order: that.formData.order,
				ids: that.formData.ids,
				types: that.formData.types,
				master: that.formData.master,
				isTenant: true,
			    type: 3,
			    page: that.page
			  }).then(function (res) {
				uni.stopPullDownRefresh();
				if(that.page == 1){
					uni.loading(false);
				}
				
				if(res.status){

					if(res.data.current_page != that.page){
						return false;
					}
					let data = res.data;
					let args = {};
					
					args.tenant_id = that.$store.state.tenant.tenant_id;
								
					if (data.data.length <= 0 && that.page == 1) {
					  args.isNull = true;
					}
								
					if (data.data.length < 10) {
					  args.isLastPage = true;
					  args.loadmoreShow = true;
					}else{
						args.isLastPage = false;
						args.loadmoreShow = false;
					}
					
					
					if(data.data && data.data.length > 0){
						if(that.page == 1){
							args.shopGoods = data.data;
						}else{
							args.shopGoods = that.shopGoods.concat(data.data);
						}
						args.page = data.current_page;
					}
					
					that.setData(args);
				}

			    
			  });
			},
		}
	}
</script>
<style lang="scss" scoped>
	@import './exhibit.scss';
</style>