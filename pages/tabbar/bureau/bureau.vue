<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body tabbar">
		
		<navBar :back="false" :home="false" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#141417' : '#f4f6f9'">
			<view slot="left" class="back">
				<view class="location-wrapper bureau-location-nav-left" @tap.stop.prevent="toSliderUrl(6, '/pages/common/city?cstorageKey=' + cstorageKey)">
				  <u-icon name="map-fill" size="36" :color="primaryColor"/>
				  <view class="city-label">{{ city }}</view>
				  <u-icon name="arrow-down" size="34" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"/>
				</view>
			</view>
		</navBar>
		
		<view class="organize-bureau-home-page">
		  
		  <!-- 轮播 -->
		  <view class="banner-list-wrapper" v-if="config2_page_bureau_index_banner && config2_page_bureau_index_banner.length > 0">
		    <u-swiper :list="config2_page_bureau_index_banner" keyName="poster" height="300" circular radius="16" @click="clickSwiper"/>
		  </view>
		  			
		  <!-- tabs -->
		  <u-sticky>
			  <view class="tabs-wrapper">
				<u-tabs
					:list="config2_bureau_tags"
					:current="tabSwiperIdx"
					lineWidth="20"
					lineHeight="7"
					:lineColor="`url(${lineBg})`"
					:activeStyle="activeStyle"
					:inactiveStyle="inactiveStyle"
					:itemStyle="itemStyle"
					@change="e => setCurrent(e.index)"
				/>
			  </view>
		  </u-sticky>
		  			
		  <!-- 组局活动列表 -->
		  <view class="activity-list-wrapper">
			  
				<view class="inner">
					<block v-if="topicload">
						<view class="xhs-loading-wrap">
							<view class="xhs-loading">
								<view :class="'xhs-loader ' + (topicload ? 'rot5' : '')"></view>
							</view>
						</view>
					</block>
					<block v-else>
						<block v-for="(bitem, bindex) in bureauList" :key="bindex" v-if=" bureauList.length > 0 ">
							<view class="list-item-wrapper" @tap.stop.prevent="toSliderUrl(34, bitem.id)">
								<!-- 活动信息 -->
								<view class="main-info-wrapper">
									<view class="cover-wrapper">
									<image class="cover" :src="bitem.pic" mode="aspectFill"/>
									</view>
								
									<view class="text-info-wrapper">
									<view class="title u-line-2">{{ bitem.title }}</view>
									<view class="other-text-wrapper">
										<u-icon name="clock" size="25" color="A3A3A3"/>
										<view class="_text">{{ bitem.service_date_start + ' ' + bitem.service_time_start }}</view>
									</view>
								
									<view class="other-text-wrapper">
										<u-icon name="map" size="25" color="A3A3A3"/>
										<view class="_text">{{ bitem.distance }} {{ bitem.address_detailed }}</view>
									</view>
								
									<view class="user-info-wrapper" @tap.stop.prevent="toSliderUrl(4, bitem.user.id)">
										<view class="user-wrapper">
										<image class="avatar" :src="bitem.user.user_avatar"/>
										<view class="nickname">{{ bitem.user.user_name }}</view>
										</view>
										<view class="auth-wrapper" v-if="bitem.user.is_authentication == 1">
										<i class="auth-icon mini-icon mini-verify avatar-authentication-icon"></i>
										<view class="label">已认证</view>
										</view>
									</view>
									</view>
								</view>
								
								<!-- 分隔符 -->
								<view class="line"></view>
								
								<!-- 报名区域u -->
								<view class="bottom-wrapper">
									<block v-if="bitem.member_total_all >= bitem.collect_count">
										<view class="join-user-wrapper">
											<view class="avatar-list-wrapper">
											<image class="avatar" v-for="(avatar, aindex) in bitem.avatars" :key="aindex" :src="avatar"/>
											</view>
											<view>{{ bitem.member_total_all }}人参加</view>
										</view>
									</block>
									<block v-else>
										<view class="join-user-wrapper">
											<view class="avatar-list-wrapper">
											<image class="avatar" v-for="(avatar, aindex) in bitem.avatars" :key="aindex" :src="avatar"/>
											</view>
											<view>{{ bitem.collect_count }}人收藏</view>
										</view>
									</block>
								
									<view :class="['join-button-wrapper', bitem.activity_state === 0 ? 'disabled' : '']" @tap.stop.prevent="toBureau(bitem.id, bitem.activity_state)">
									{{ bitem.status_text}}
									</view>
								</view>
							</view>
						</block>
						
						<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
							iconSize="28" fontSize="28" color="#989898" />
						
						<view class="empty-box" v-if="bureauList.length <= 0">
							<u-empty text="一个组局活动也没有" :marginTop="100" :width="250" :height="250" text-size="24" />
						</view>
						
						<view style="height: 80rpx;"></view>
						
					</block>
				</view>
		  </view>
		  
		</view>
		
		<view class="add-box flex-column" @tap.stop.prevent="toSliderUrl(6, '/pagesZ/organize-bureau/push/creat')">
			<i class="mini-icon mini--jia"></i>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		activeStyle:{
			get(){
				return 'color: '+ (this.global__theme__ == 'black' ? '#dadadb' : '#333333') +'; font-size: 30rpx';
			},
			set(v){}
		},
		inactiveStyle:{
			get(){
				return 'color: '+ (this.global__theme__ == 'black' ? '#7c7c7f' : '#a3a3a3') +'; font-size: 30rpx';
			},
			set(v){}
		},
		config2_page_bureau_index_banner:{
			get(){
				return this.$store.state.config2.page?.bureau?.index?.banner ?? [];
			},
			set(v){}
		},
		config2_bureau_tags: {
		  get() {
			let base_tag = [
				{ name: '全部', value: 0 },
			];
			if(this.$store.state.config2?.bureau?.tags){
				base_tag = base_tag.concat(this.$store.state.config2.bureau.tags);
			}
		    return base_tag;
		  },
		}
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 157,
			lineBg: require('@/static/image/tabs-bg.png'),
			itemStyle: 'padding-left: 20rpx; padding-right: 20rpx; height: 34px;',
			tabSwiperIdx: 0, // 当前Tab和Swiper的索引
			swiperHeight: 0, // 当前swiper高度
			// 查询活动列表参数
			activityListParams: { pageNo: 1, pageSize: 10 },
			cstorageKey: '',
			city: '全国',
			
			page: 1,
			topicload: true,
			loadmoreShow: false,
			isLastPage: false,
			bureauList: [],
			
		}
	},
	onShow: function () {
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
		that.tabBarSetData({selected: 1});;;
		// #endif
		//  #ifndef MP
		that.$store.commit('updateTabbarIndex', 1);;
		// #endif
		that.updateScene(157, 0, false, false, 0, 2);
		
		if (that.cstorageKey && that.cstorageKey.length > 0) {
		  let cityobj = uni.getStorageSync(that.cstorageKey);
		  if(cityobj?.name?.length > 0){
			that.city = cityobj.name;
		  }
		} else {
		  that.cstorageKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		    var r = Math.random() * 16 | 0,
		      v = c == 'x' ? r : (r & 0x3 | 0x8);
		    return v.toString(16);
		  });
		}
		
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
	onLoad: function (options) {
		let that = this;

		if(that.$store.state?.lastCity?.length > 0){
			that.city = that.$store.state?.lastCity;
		}
		
		that.getBureauList();
		
	},
	onPullDownRefresh: function () {
		let that = this;
		that.setData({
			page: 1,
			topicload: true,
			loadmoreShow: false,
			isLastPage: false,
			bureauList: [],
		});
		that.getBureauList();
		uni.stopPullDownRefresh();
	},
	onReachBottom: function () {
		let that = this;
		if(that.isLastPage){
			return;
		};
		
		if(that.bureauList.length <= 0){
			return;
		}
		
		that.setData({
			loadmoreShow: true,
			isLastPage: false,
			page: that.page + 1
		});
		
		that.getBureauList();
	},
	onShareAppMessage: function(res) {
		let that = this;
	
		return {
			title: that.$store.state.config2.bureau.share.index_title,
			path: '/pagesZ/organize-bureau/index/index?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config2.bureau.share.index_image
		};
	},
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.$store.state.config2.bureau.share.index_title,
			query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: that.$store.state.config2.bureau.share.index_image
		};
	},
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/bureau/bureau'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
	watch: {
		city: {
			handler: function (newVal, oldVal) {
				uni.startPullDownRefresh({
					
				});
			},
			immediate: false,
		},
	},
	methods: {
		toBureau(id, activity_state){
		  let that = this;
		  if(activity_state == 2){
			uni.wen.toUrl(6, '/pagesZ/organize-bureau/album/album?bureau='+id, that);
		  }else{
			uni.wen.toUrl(34, id, that);
		  }
		},
		clickSwiper(index){
			let that = this;
			if(that.config2_page_bureau_index_banner){
				uni.wen.toUrl(that.config2_page_bureau_index_banner[index].slideshow_type, that.config2_page_bureau_index_banner[index].target_id, that);
			}
		},
		// 切换Tab
		setCurrent(current) {
			let that = this;
		  if (current !== this.tabSwiperIdx) {
		    that.tabSwiperIdx = current;
			that.setData({
				page: 1,
				topicload: true,
				loadmoreShow: false,
				isLastPage: false,
				bureauList: []
			});
			that.getBureauList();
		  }
		},
		
		// reload 执行的方法，查询数据
		getBureauList() {
		  let that = this;
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/list', {
			  page: that.page,
			  city: that.city,
			  tag: that.config2_bureau_tags[that.tabSwiperIdx]?.name ?? '全部'
		  }, 'GET', 147).then(function(res) {
			  uni.stopPullDownRefresh();
			  if (res.status) {

			  	if(res.data.current_page != that.page){
			  		return false;
			  	}
			  	
			  	let data = res.data;
			  	
			  	let args = {};
			  	args.page = data.current_page;
			  	if(data.data && data.data.length > 0){
			  		args.bureauList = that.bureauList.concat(data.data);
			  		if(data.data.length < 10){
			  			args.isLastPage = true;
			  			args.loadmoreShow = true;
			  		}else{
			  			args.isLastPage = false;
			  			args.loadmoreShow = false;
			  		}
			  	}else{
					args.isLastPage = true;
				}
			  	args.topicload = false;
			  	that.setData(args);
			  	
			  }else{
			  	if(res.code == 200003){
			  		that.setData({
			  			topicload: false,
			  			loadmoreShow: false,
			  		});
			  	}else{
			  		that.setData({
			  			topicload: false,
			  			loadmoreShow: false,
			  		});
			  	}
			  }
		  });
		},
	}
}
</script>

<style lang="scss" scoped>
@import './bureau.scss';
</style>