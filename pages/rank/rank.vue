<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'" :searchBar="true" @search="toSliderUrl(6, '/pages/common/search')">
		
		</navBar>
		<view class="rank-content">
			<tabsSwiper :height="80" ref="uTabs" :list="tabs" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :active-color="primaryColor" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'"></tabsSwiper>
			<swiper :current="swiperCurrent" @change="swiperChange" @transition="transition" @animationfinish="animationfinish" :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' ">
				<block v-for="(item, index) in tabs" :key="index">
					<swiper-item :class="'swiper-item swiper-item-' + index">
						<scroll-view scroll-y class="rank-swiper-wrap"  :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' " @scrolltolower="onreachBottom" @scrolltoupper="onpullDownRefresh">
							<view class="rank-swiper-content">
								<view style="height: 30rpx;"></view>
								<view class="inner">
									<view class="user-list" v-if="item.userList && item.userList.length > 0">
									  <block v-for="(user, user_index) in item.userList" :key="user_index" v-if="item.userList.length > 0">
									    <view @tap.stop.prevent="toSliderUrl(4, user.id)" class="user-item flex-row" :data-uid="user.id">
									      <view class="left flex-column">
											<view :class="'num index_' + (user_index + 1)">{{ user_index + 1 }}</view>
										  </view>
										  <view class="right flex-row">
											  <user-info :user="user">
												  <view slot="desc" class="desc">
														{{ user.desc_tip }}
												  </view>
											  </user-info>
										  </view>
									    </view>
									  </block>
									  <u-loadmore bg-class="page-box-background-color" v-if="item.loadmore" :status="item.isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
										<view style="height: 60rpx;"></view>
									</view>
									<view class="empty-view" v-else>
									  <u-empty text="空" width="300" height="300" text-size="28"/>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import UserInfo from '@/pages/sticky/components/user-info';

import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		tabsSwiper,
		UserInfo
	},
	computed:{
		swiperHeight:{
			get(){
				let that = this;
				return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px - 80rpx )';
			},
			set(v){}
		},
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 111,
			current: 0,
			swiperCurrent: 0,
			tabs: [
			{
				name: '邀请榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 10
			},
			{
				name: '粉丝榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 11
			},
			{
				name: '激励榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 9
			}, {
				name: '余额榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 4
			}, {
				name: '金币榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 5,
			},{
				name: '笔记榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 6,
			},
			{
				name: '经验榜',
				isLoaded: false,
				userList: [],
				page: 1,
				loadmore: false,
				isLastPage: false,
				type: 12,
			}
			],
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(111, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		that.getUserList();
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
		onpullDownRefresh(){
			let that = this;
			
			// that.tabs[that.swiperCurrent].userList = [];
			that.tabs[that.swiperCurrent].page = 1;
			that.tabs[that.swiperCurrent].isLastPage = false;
			that.tabs[that.swiperCurrent].loadmore = false;
			
			that.getUserList();
			uni.stopPullDownRefresh();
		},
		onreachBottom() {
			let that = this;
			if(!that.tabs[that.swiperCurrent].isLastPage && that.tabs[that.swiperCurrent].userList.length > 0){
				that.tabs[that.swiperCurrent].page = that.tabs[that.swiperCurrent].page + 1;
				that.tabs[that.swiperCurrent].loadmore = true;
				that.getUserList();
			}
		},
		swiperChange(e){
			let that = this;
			that.swiperCurrent = e.detail.current;
			if(!that.tabs[that.swiperCurrent].isLoaded){
				that.getUserList();
			}
		},
		
		// 获取用户
		getUserList() {
		  let that = this;
		  if(that.tabs[that.swiperCurrent].page == 1){
			uni.loading(true);
		  }
		  
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/users', {
		    type: that.tabs[that.swiperCurrent].type,
			limit: 20,
		    page: that.tabs[that.swiperCurrent].page
		  }).then(function (res) {
			if(that.tabs[that.swiperCurrent].page == 1){
				uni.loading(false);
			}
			
			if(res.status){
				if(res.data.current_page != that.tabs[that.swiperCurrent].page){
					return false;
				}
				let data = res.data;
				
				if (data.data && data.data.length > 0) {
				  that.tabs[that.swiperCurrent].loadmore = false;
				  
				  if(data.current_page == 1){
					  that.tabs[that.swiperCurrent].userList = data.data;
				  }else{
					  that.tabs[that.swiperCurrent].userList = that.tabs[that.swiperCurrent].userList.concat(data.data);
				  }
				  that.tabs[that.swiperCurrent].page = data.current_page;
				  
				  that.tabs[that.swiperCurrent].isLastPage = false;
				} else {
				  that.tabs[that.swiperCurrent].isLastPage = true;
				}
				
				that.tabs[that.swiperCurrent].isLoaded = true;
			}
			
		  });
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
.rank-swiper-wrap{
	@include background_color(page-box-background-color);
	.inner{
		width: $page-content-body-width;
		margin: auto;
		.user-list{
			.user-item{
				margin-bottom: 40rpx;
				.left{
					margin-right: 20rpx;
					justify-content: center;
					.num{
						@include color(color-dark);
						font-size: $uni-font-size-lg;
					}
					.num.index_1{
						@include color(color-error);
						transform: scale(1.2);
					}
					.num.index_2{
						@include color(color-warning);
						transform: scale(1.2);
					}
					.num.index_3{
						@include color(color-navigater);
						transform: scale(1.2);
					}
				}
				.right{
					.desc{
						@include color(color-lightest-dark);
						font-size: $uni-font-size-sm;
					}
					// .avatars{
					// 	width: $user-avatar-size;
					// 	height: $user-avatar-size;
					// 	border-radius: 50%;
					// }
					// .infos{
					// 	height: $user-avatar-size;
					// 	margin-left: 30rpx;
					// 	justify-content: center;
					// 	.nickname{
					// 		@include color(color-dark);
					// 		font-size: $uni-font-size-base;
					// 		margin-bottom: 10rpx;
					// 	}
					// 	.desc{
					// 		@include color(color-lightest-dark);
					// 		font-size: $uni-font-size-sm;
					// 	}
					// }
				}
			}
		}
	}
	
}
</style>