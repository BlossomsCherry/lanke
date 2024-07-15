<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__">
		<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
			<view class="voter-page-content">
				<view class="voter_head">
					<navBar :back="isBack" :title="page_title" :home="isBack && fph" :background="global__theme__ == 'black' ? 'rgba(14, 14, 17, ' + navbarTrans + ')' : 'rgba(246, 246, 246, ' + navbarTrans + ')'" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :scene="19">
						<view slot="left" class="lxy-nav-bar__logo default" v-if="!isBack && config2_page_voter_header.left">
							<block v-if="config2_page_voter_header.left && (config2_page_voter_header.left.icon || config2_page_voter_header.left.img)">
								<block v-if="config2_page_voter_header.left.img">
									<image class="_image" :src="config2_page_voter_header.left.img" mode="" @tap.stop.prevent="toSliderUrl(config2_page_voter_header.left.type, config2_page_voter_header.left.target_id)"></image>
								</block>
								<block v-else-if="config2_page_voter_header.left.icon">
									<i :class="'mini-icon' + ' ' + config2_page_voter_header.left.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config2_page_voter_header.left.type, config2_page_voter_header.left.target_id)"></i>
								</block>
							</block>
						</view>
						<!-- #ifdef APP || H5 -->
						<view slot="right" class="lxy-nav-bar__logo default" v-if="config2_page_voter_header.right">
							<block v-if="config2_page_voter_header.right.img">
								<image class="_image" :src="config2_page_voter_header.right.img" mode="" @tap.stop.prevent="toSliderUrl(config2_page_voter_header.right.type, config2_page_voter_header.right.target_id)"></image>
							</block>
							<block v-else-if="config2_page_voter_header.right.icon">
								<i :class="'mini-icon' + ' ' + config2_page_voter_header.right.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config2_page_voter_header.right.type, config2_page_voter_header.right.target_id)"></i>
							</block>
						</view>
						<!-- #endif -->
					</navBar>
					<view class="voter_head_swiper" v-if="config2_page_voter_banner && config2_page_voter_banner.length > 0">
						<u-swiper :list="config2_page_voter_banner" keyName="poster" height="250rpx" bgColor="transparent" :height="220" @click="clickSwiper"></u-swiper>
					</view>
				</view>
				<u-sticky :offsetTop="0">
					<view class="sticky_wrap">
						<view class="voter_head_search">
							<u-search v-model="formData.keyword" @search="searchClick" placeholder="搜索选票标题" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :placeholderColor="global__theme__ == 'black' ? '#6b6f77' : '#999999'" :showAction="false" :height="60"></u-search>
						</view>
						<view class="voter_head_tabs" v-if="config2_page_voter_tabs && config2_page_voter_tabs.length > 0">
							<u-tabs :itemStyle="{ height: '37px' }" @click="tabsClick" :list="config2_page_voter_tabs" lineHeight="6" :lineColor="primaryColor" :activeStyle="{color: (global__theme__ == 'black' ? '#d8d8d9' : '#313131'), fontSize: '26rpx', transform: 'scale(1.08)'}" :inactiveStyle="{color: (global__theme__ == 'black' ? '#747476' : '#999999'), fontSize: '26rpx'}"></u-tabs>
						</view>
					</view>
				</u-sticky>
				<view class="inner">
					<view class="voter_head_list">
						<block v-if="!isNull">
							<block v-for="(item, index) in voterList" :key="index">
								<view class="box" @tap.stop.prevent="toSliderUrl(33, item.id)">
									<view class="bg-img" :style="'background-image: url('+ item.banners[0] +');'" v-if="item.banners"></view>
									<view class="info">
										<view class="title u-line-2">
										<i class="mini-icon mini-zhiding1" v-if="item.is_sticky == 1"></i>
										{{ item.title }}</view>
										<view class="count">
											<i class="mini-icon mini-shoucang-shixin1"></i>
											<view class="text">{{ item.player_count }}位选手</view>
											<i class="mini-icon mini-shuxian"></i>
											<i class="mini-icon2 mini-dianzan"></i>
											<view class="text">{{ item.user_count }}人投票</view>
										</view>
										<view class="time">
											<i class="mini-icon2 mini-shizhongfill"></i>
											<view class="text">{{ item.end_time }} 结束</view>
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
							<u-empty text="一个选票也没有" width="300" height="300" text-size="28" />
						</block>
					</view>
					<view :class="'to-publish ' + (isBack ? '' : 'tabbar')" @tap.stop.prevent="toSliderUrl(6, '/pagesV/voter/template/list/list')">
						<view class="icon flex-column">
							<i class="mini-icon mini-jia"></i>
						</view>
						<view class="_text">创建选票</view>
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
		  config2_page_voter_header: {
		    get() {
		      let that = this;
			  if(that.$store.state.config2.page.voter){
				return that.$store.state.config2.page.voter.header;
			  }
		      return [];
		    },
		    set(v) {}
		  },
		  config2_page_voter_banner:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config2.page.voter){
		  			return that.$store.state.config2.page.voter.banner || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		  config2_page_voter_tabs:{
		  	get(){
		  		let that = this;
		  		if(that.$store.state.config2.page.voter){
		  			return that.$store.state.config2.page.voter.tabs || []
		  		}
		  		return [];
		  	},
		  	set(v){}
		  },
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 130,
				isBack: false,
				page_title: '',
				user_id: 0,
				tenant_id: 0,
				navbarTrans: 0,
				color: '0,0,0',
				formData: {
					keyword: '',
					template: [],
					orderBy: 'created_at',
					order: 'desc',
					master: -1,
					player: 0,
					voted: 0
				},
				voterList: [],
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
		  
		  if(options.uid && options.uid > 0){
		  	that.user_id = options.uid;
			if(that.user_id == that.myUserInfo.id){
				that.page_title = '我的选票';
			}else{
				that.page_title = 'Ta的选票';
			}
		  }else{
			  that.page_title = '选票';
		  }
		  
		  that.getvoterList();
		  
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
						
			that.updateScene(130, 0, false, false, 0, 2);
		
		  
			
			
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
			if(!that.isLastPage && that.voterList.length > 0){
				that.setData({
					loadmoreShow: true,
					isLastPage: false,
					page: that.page + 1
				});
				that.getvoterList();
			}
		},
		onPullDownRefresh: function() {
			let that = this;
			that.setData({
				voterList: [],
				page: 1,
				isNull: false,
				isLastPage: false,
				loadmoreShow: false,
			});

			that.getvoterList();
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: '圈子 - ' + that.$store.state.config.about.name,
		    path: 'pages/tabbar/voter/voter?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
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
			if(e.pagePath == 'pages/tabbar/voter/voter'){
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
				that.voterList = [];
				
				that.getvoterList();
			},
			tabsClick(e){
				let that = this;
				if(e){
					that.formData.keyword = '';
					that.formData.template = e.template;
					that.formData.order = e.order;
					that.formData.orderBy = e.orderBy;
					that.formData.master = e.master;
					that.formData.player = e.player;
					that.formData.voted = e.voted;
					
					that.page = 1;
					that.voterList = [];
					that.getvoterList();
				}
			},
			clickSwiper(index){
				let that = this;
				if(that.config2_page_voter_banner){
					uni.wen.toUrl(that.config2_page_voter_banner[index].slideshow_type, that.config2_page_voter_banner[index].target_id, that);
				}
			},
			getvoterList() {
			  let that = this;
			  if(that.page == 1){
				 uni.loading(true);
				 that.setData({
					isLastPage: false,
					loadmoreShow: false,
					isNull: false
				 });
			  }
			  
			  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'voter/list', {
			    keyword: that.formData.keyword,
				template: (Array.isArray(that.formData.template) && that.formData.template.length > 0) ? that.formData.template.join(',') : '',
				orderBy: that.formData.orderBy,
				order: that.formData.order,
				master: that.formData.master,
				player: that.formData.player,
				voted: that.formData.voted,
				isTenant: true,
			    page: that.page,
				user_id: that.user_id
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
							args.voterList = data.data;
						}else{
							args.voterList = that.voterList.concat(data.data);
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
	@import './voter.scss';
</style>