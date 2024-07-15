<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view slot="left" class="title-warp">
				<text class="_text">激励排行榜</text>
			</view>
			<!-- #ifndef MP -->
			<view slot="right" class="lxy-nav-bar__logo">
				<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="inviteUserTap" :style="'color: '+global__theme__ == 'black' ? '#ffffff' : '#000000;'"></i>
			</view>
			<!-- #endif -->
		</navBar>
		<view class="inspire-rank-content">
			<view class="inner">
				<view style="height: 30rpx;"></view>
				<view class="user-list" v-if="userList && userList.length > 0">
				  <block v-for="(item, index) in userList" :key="index" v-if="userList.length > 0">
				    <view @tap.stop.prevent="toSliderUrl(4, item.id)" class="user-item flex-row" :data-uid="item.id">
				      <view class="left flex-column">
						<view :class="'num index_' + (index + 1)">{{ index + 1 }}</view>
					  </view>
					  <view class="right flex-row">
						  <user-info :user="item">
							  <view slot="desc" class="desc">
									支持了{{ item.coin_add_count }}次
							  </view>
						  </user-info>
					  </view>
				    </view>
				  </block>
				  <u-loadmore bg-class="page-box-background-color" v-if="loadmore" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
					<view style="height: 60rpx;"></view>
				</view>
				<view class="empty-view" v-else>
				  <u-empty text="空" width="300" height="300" text-size="28"/>
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
import UserInfo from '@/pages/sticky/components/user-info';

const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		UserInfo
	},
	computed:{
		
	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 110,
			userList: [],
			page: 1,
			loadmore: false,
			isLastPage: false,
			
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(110, 0);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);

		that.getUserList();
	},
	onPullDownRefresh: function () {
	    let that = this;
	    that.setData({
	      userList: [],
	      page: 1,
	      isLastPage: false,
	      loadmore: false,
	    });
	    that.getUserList();
	    uni.stopPullDownRefresh();
	},
	onReachBottom: function () {
	  let that = this;
	  if(!that.isLastPage && that.userList.length > 0){
		that.setData({
		  page: that.page + 1,
		  loadmore: true
		});
		that.getUserList();
	  }
	},
	onShareAppMessage: function (res) {
	  let that = this;
	  return {
	    title: '激励排行榜',
	    path: '/pagesA/mine/earnings/inspire-rank?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	
	onShareTimeline: function (res) {
	  let that = this;
	  return {
	    title: '激励排行榜',
	    query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
	    imageUrl: that.$store.state.config.img.default_share
	  };
	},
	methods: {
		// 获取用户
		getUserList() {
		  let that = this;
		  if(that.page == 1){
			uni.loading(true);
		  }
		  
		  uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/users', {
		    type: 9,
			limit: 20,
		    page: that.page
		  }).then(function (res) {
			if(that.page == 1){
				uni.loading(false);
			}
			
			if(res.data.current_page != that.page){
				return false;
			}
			
		    let data = res.data;
		    let args = {};
		
		    if (data.data && data.data.length > 0) {
		      args.loadmore = false;
		      args.page = data.current_page;
		      args.userList = that.userList.concat(data.data);
		      args.isLastPage = false;
		    } else {
		      args.isLastPage = true;
		    }
		    that.setData(args);
		  });
		},
		inviteUserTap() {
		  uni.wen.util.inviteUser('/pagesA/mine/earnings/inspire-rank', '激励排行榜', '', '');
		}
	}
}
</script>

<style lang="scss" scoped>
$user-avatar-size: 100rpx;
	
	
.title-warp{
	._text{
		@include color(color-darkest);
		white-space: nowrap;
	}
}

.inspire-rank-content{
	min-height: 100vh;
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