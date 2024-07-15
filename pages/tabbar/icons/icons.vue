<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__">
		<view :class="'mini-page-body ' + (isBack ? '' : 'tabbar') ">
			<navBar :back="isBack" :home="fph" title="发现" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#141417' : '#fafafa'">
				<view slot="left" class="lxy-nav-bar__logo default" v-if="!isBack && config2_page_find_icons_header.left">
					<block v-if="config2_page_find_icons_header.left && (config2_page_find_icons_header.left.icon || config2_page_find_icons_header.left.img)">
						<block v-if="config2_page_find_icons_header.left.img">
							<image class="_image" :src="config2_page_find_icons_header.left.img" mode="" @tap.stop.prevent="toSliderUrl(config2_page_find_icons_header.left.type, config2_page_find_icons_header.left.target_id)"></image>
						</block>
						<block v-else-if="config2_page_find_icons_header.left.icon">
							<i :class="'mini-icon' + ' ' + config2_page_find_icons_header.left.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config2_page_find_icons_header.left.type, config2_page_find_icons_header.left.target_id)"></i>
						</block>
					</block>
				</view>
				<!-- #ifdef APP || H5 -->
				<view slot="right" class="lxy-nav-bar__logo default" v-if="config2_page_find_icons_header.right">
					<block v-if="config2_page_find_icons_header.right.img">
						<image class="_image" :src="config2_page_find_icons_header.right.img" mode="" @tap.stop.prevent="toSliderUrl(config2_page_find_icons_header.right.type, config2_page_find_icons_header.right.target_id)"></image>
					</block>
					<block v-else-if="config2_page_find_icons_header.right.icon">
						<i :class="'mini-icon' + ' ' + config2_page_find_icons_header.right.icon" style="color: #333;" @tap.stop.prevent="toSliderUrl(config2_page_find_icons_header.right.type, config2_page_find_icons_header.right.target_id)"></i>
					</block>
				</view>
				<!-- #endif -->
			</navBar>
			<view class="icons-page-content">
				<block v-if="config2_page_find_icons_icons">
					<block v-for="(item,index) in config2_page_find_icons_icons">
						<view class="split-line" v-if="item.type == 2" :style="'height: '+ item.height +'rpx;'"></view>
						<view v-else :class="'icon-item border-type-' + item.border_type" @tap.stop.prevent="toSliderUrl(item.target_type, item.target_id)">
							<view class="inner">
								<view class="left">
									<view class="icon">
										<image class="_image" :src="item.img"></image>
									</view>
								</view>
								
								<view class="right">
									<view class="name">
										{{ item.name }}
									</view>
									<view class="you-icon">
										<i class="mini-icon mini-youjiantou"></i>
									</view>
								</view>
							</view>
						</view>
					</block>
				</block>
				
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
			config2_page_find_icons_header: {
			  get() {
				let that = this;
				if(that.$store.state.config2.page.find && that.$store.state.config2.page.find.icons && that.$store.state.config2.page.find.icons.header){
					return that.$store.state.config2.page.find.icons.header;
				}
				return [];
			  },
			  set(v) {}
			},
			config2_page_find_icons_icons:{
				get(){
					let that = this;
					if(that.$store.state.config2.page.find && that.$store.state.config2.page.find.icons && that.$store.state.config2.page.find.icons.icons){
						return that.$store.state.config2.page.find.icons.icons;
					}
					return [];
				},
				set(v){}
			},
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 142,
				isBack: false,
				tenant_id: 0,
			}
		},
		onLoad: function (options) {
		  let that = this;
		  that.globalOnloadProcess(options);
		
		  if (options.back == 1) {
		    that.isBack = true;
		  }
		  
		  
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
						
			that.updateScene(142, 0, false, false, 0, 2);
		
		  
			
			
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

		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh();
		},
		onShareAppMessage: function (res) {
		  let that = this;
		  return {
		    title: '发现 - ' + that.$store.state.config.about.name,
		    path: 'pages/tabbar/circle/circle?back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onShareTimeline: function (res) {
		  let that = this;
		  return {
		    title: '发现 - ' + that.$store.state.config.about.name,
		    query: '' + 'back=1&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
		    imageUrl: that.$store.state.config.img.default_share
		  };
		},
		onPageScroll: function onPageScroll(e) {

		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/circle/circle'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		methods: {
			
		}
	}
</script>
<style lang="scss" scoped>
	@import './icons.scss';
</style>