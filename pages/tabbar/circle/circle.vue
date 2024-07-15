<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__">
		<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
			<view class="circle-page-content">
				<view class="circle_head">
					<navBar :back="isBack" title="发现" :home="isBack && fph" :background="global__theme__ == 'black' ? 'rgba(14, 14, 17, ' + navbarTrans + ')' : 'rgba(246, 246, 246, ' + navbarTrans + ')'" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :scene="19">
						<view slot="left" class="lxy-nav-bar__logo default" v-if="!isBack && config_page_find_header.left">
							<block v-if="config_page_find_header.left && (config_page_find_header.left.icon || config_page_find_header.left.img)">
								<block v-if="config_page_find_header.left.img">
									<image class="_image" :src="config_page_find_header.left.img" mode="" @tap.stop.prevent="toSliderUrl(config_page_find_header.left.type, config_page_find_header.left.target_id)"></image>
								</block>
								<block v-else-if="config_page_find_header.left.icon">
									<i :class="'mini-icon' + ' ' + config_page_find_header.left.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config_page_find_header.left.type, config_page_find_header.left.target_id)"></i>
								</block>
							</block>
						</view>
						<!-- #ifdef APP || H5 -->
						<view slot="right" class="lxy-nav-bar__logo default" v-if="config_page_find_header.right">
							<block v-if="config_page_find_header.right.img">
								<image class="_image" :src="config_page_find_header.right.img" mode="" @tap.stop.prevent="toSliderUrl(config_page_find_header.right.type, config_page_find_header.right.target_id)"></image>
							</block>
							<block v-else-if="config_page_find_header.right.icon">
								<i :class="'mini-icon' + ' ' + config_page_find_header.right.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config_page_find_header.right.type, config_page_find_header.right.target_id)"></i>
							</block>
						</view>
						<!-- #endif -->
					</navBar>
					<view class="circle_head_swiper" v-if="config_page_find_banner && config_page_find_banner.length > 0">
						<u-swiper :list="config_page_find_banner" keyName="poster" height="250rpx" bgColor="transparent" :height="220" @click="clickSwiper"></u-swiper>
					</view>
				</view>
				<u-sticky :offsetTop="0">
					<view class="sticky_wrap">
						<view class="circle_head_search">
							<u-search v-model="formData.keyword" @search="searchClick" placeholder="搜索你想找的圈子" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :placeholderColor="global__theme__ == 'black' ? '#6b6f77' : '#999999'" :showAction="false" :height="60"></u-search>
						</view>
						<view class="circle_head_tabs" v-if="config_page_find_tabs && config_page_find_tabs.length > 0">
							<u-tabs :itemStyle="{ height: '37px' }" @click="tabsClick" :list="config_page_find_tabs" lineHeight="6" :lineColor="primaryColor" :activeStyle="{color: (global__theme__ == 'black' ? '#d8d8d9' : '#313131'), fontSize: '26rpx', transform: 'scale(1.08)'}" :inactiveStyle="{color: (global__theme__ == 'black' ? '#747476' : '#999999'), fontSize: '26rpx'}"></u-tabs>
						</view>
					</view>
				</u-sticky>
				<view class="inner">
					<view class="circle_head_list">
						<block v-if="!isNull">
							<block v-for="(item, index) in circles" :key="index">
								<view class="box" @tap.stop.prevent="toSliderUrl(2, item.id + '&civ=' + item.can_i_visit)">
									<image class="img" :src="item.head_portrait" mode="aspectFill"></image>
									<view class="cont">
										<view class="title flex-row">
											{{ item.circle_name }}
											<view class="dot_wrap flex-column" v-if="item.is_dot">
												<view class="dot"></view>
											</view>
											<text class="num" v-else-if="item.user_circle_count > 0">({{ item.user_circle_count }})</text>
										</view>
										<!-- <view class="label">
											<view class="labelBox">情感交流</view>
											<view class="labelBox">情感交流</view>
										</view> -->
										<view class="tip">{{ item.circle_introduce }}</view>
									</view>
									<view class="btn">进入</view>
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
					<view :class="'to-publish ' + (isBack ? '' : 'tabbar')" @tap.stop.prevent="toSliderUrl(6, '/pagesA/circle/creat/index?type=0')">
						<view class="icon flex-column">
							<i class="mini-icon mini-jia"></i>
						</view>
						<view class="_text">创建圈子</view>
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
		  config_page_find_header: {
		    get() {
		      let that = this;
			  if(that.$store.state.config.page.find){
				return that.$store.state.config.page.find.header;
			  }
		      return [];
		    },
		    set(v) {}
		  },
		  config_page_find_banner:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config.page.find){
		  			return that.$store.state.config.page.find.banner || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		  config_page_find_tabs:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config.page.find){
		  			return that.$store.state.config.page.find.tabs || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 19,
				isBack: false,
				tenant_id: 0,
				navbarTrans: 0,
				color: '0,0,0',
				formData: {
					keyword: '',
					follow: -1,
					tags: "",
					orderBy: 'created_at',
					order: 'desc',
					master: 0
				},
				circles: [],
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
		  
		  that.circleSearch();
		  
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
						
			that.updateScene(19, 0);
		
		  
			
			
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
			if(!that.isLastPage && that.circles.length > 0){
				that.setData({
					loadmoreShow: true,
					isLastPage: false,
					page: that.page + 1
				});
				that.circleSearch();
			}
		},
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				circles: [],
				page: 1,
				isNull: false,
				isLastPage: false,
				loadmoreShow: false,
			});

			that.circleSearch();
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: '圈子 - ' + that.$store.state.config.about.name,
		    path: 'pages/tabbar/circle/circle?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onShareTimeline: function (res) {
		  let that = this;
		  return {
		    title: '圈子 - ' + that.$store.state.config.about.name,
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
		
			// that.scrollTop = e.scrollTop
		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/circle/circle'){
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
				that.circles = [];
				
				that.circleSearch();
			},
			tabsClick(e){
				let that = this;
				if(e){
					that.formData.keyword = '';
					that.formData.follow = e.follow_status;
					that.formData.order = e.order;
					that.formData.orderBy = e.orderBy;
					that.formData.tags = e.tags;
					that.formData.master = e.master;
					
					that.page = 1;
					that.circles = [];
					that.circleSearch();
				}
			},
			clickSwiper(index){
				let that = this;
				if(that.config_page_find_banner){
					uni.wen.toUrl(that.config_page_find_banner[index].slideshow_type, that.config_page_find_banner[index].target_id, that);
				}
			},
			circleSearch() {
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
				tags: that.formData.tags,
				master: that.formData.master,
				isTenant: true,
			    type: 1,
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
							args.circles = data.data;
						}else{
							args.circles = that.circles.concat(data.data);
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
	@import './circle.scss';
</style>