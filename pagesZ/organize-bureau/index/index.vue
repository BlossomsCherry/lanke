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
  computed: {
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
	  set(v) {}
	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 147,
	  lineBg: require('@/static/image/tabs-bg.png'),
	  itemStyle: 'padding-left: 20rpx; padding-right: 20rpx; height: 34px;',
	  tabSwiperIdx: 0, // 当前Tab和Swiper的索引
	  cstorageKey: '',
	  city: '全国',
	  
	  page: 1,
	  topicload: true,
	  loadmoreShow: false,
	  isLastPage: false,
	  bureauList: [],
	  
    }
  },
  onLoad: function (options) {
  	let that = this;
  	that.globalOnloadProcess(options);
	
	if(that.$store.state?.lastCity?.length > 0){
		that.city = that.$store.state?.lastCity;
	}
    // 主动拉取数据
    that.getBureauList();
  },
  onShow: function () {
  	let that = this;
  	that.updateScene(147, 0, false, false, 0, 2);
	
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
  watch: {
	city: {
		handler: function (newVal, oldVal) {
			this.refresh();
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
<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		
		<navBar :back="false" :home="false" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#141417' : '#f4f6f9'">
			<view slot="left" class="back">
				<i class="mini-icon mini-zuojiantou" @tap.stop.prevent="toSliderUrl(-2, 0)"></i>
				<view class="line"></view>
				<view class="location-wrapper bureau-location-nav-left" @tap.stop.prevent="toSliderUrl(6, '/pages/common/city?cstorageKey=' + cstorageKey)">
				  <u-icon name="map-fill" size="36" :color="primaryColor" style="margin-right: 10rpx;"/>
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


<style lang="scss" scoped>
.mini-page-body{
	@include background_color(page-body2-background-color);
}
.back{
	display: flex;
	.mini-zuojiantou{
		@include color(color-darkest);
	}
	.location-wrapper {
	  padding: 20rpx;
	  display: flex;
	  align-items: center;
	
	  .city-label {
	    font-size: $uni-font-size-medium;
	    @include color(color-darkest);
		white-space: nowrap;
		margin-right: 4rpx;
	  }
	}
}
.add-box{
	width: 70rpx;
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 50%;
	background-color: $uni-color-follow;
	justify-content: center;
	position: fixed;
	right: 20rpx;
	bottom: calc( 60rpx + env(safe-area-inset-bottom) );
	.mini-icon{
		color: $uni-color-follow-font;
		font-size: $uni-font-size-base;
	}
}


.organize-bureau-home-page {
	.tabs-wrapper {
		@include background_color(page-body2-background-color);
	}
    .banner-list-wrapper {
      margin: 0 20rpx;
    }
  
    .swiper {
      height: 1000px;
  
      .swiper-item {
  
        .content {
          height: 100%;
        }
      }
    }
  
    .activity-list-wrapper {
		padding-top: 20rpx;
	  .inner{
		  width: $page-content-body-width;
		  margin: auto;
	  }
	  .list-item-wrapper {
	    margin-bottom: 20rpx;
	    padding: 20rpx;
	    width: 100%;
	    box-sizing: border-box;
	    @include background_color(page-box-background-color);
	    border-radius: 20rpx;
	    display: flex;
	    flex-direction: column;
	    justify-content: space-between;
	  
	    .main-info-wrapper {
	      display: flex;
	      min-width: 0;
	  
	      .cover-wrapper {
	        position: relative;
	  	  margin-right: 20rpx;
	  
	        .cover {
	          width: 200rpx;
	          height: 240rpx;
	          border-radius: 20rpx;
	        }
	      }
	  
	      .text-info-wrapper {
	        flex: 1;
	        display: flex;
	        flex-direction: column;
	        justify-content: space-between;
	  
	        .title {
	          font-size: $uni-font-size-base;
	          @include color(color-darkest);
	          line-height: 42rpx;
	        }
	  
	        .other-text-wrapper {
	          display: flex;
	          align-items: center;
	          font-size: $uni-font-size-sm;
	          @include color(color-lightest-est-er-dark);
	          line-height: 26rpx;
	  		._text{
	  			margin-left: 12rpx;
	  		}
	        }
	  
	        .user-info-wrapper {
	          display: flex;
	          align-items: center;
	  
	          .user-wrapper {
	            display: flex;
	            align-items: center;
	  		  margin-right: 20rpx;
	  
	            .avatar {
	              width: 36rpx;
	              height: 36rpx;
	              border-radius: 50%;
	            }
	  
	            .nickname {
	              font-size: $uni-font-size-sm;
	              @include color(color-lightest-est-er-dark);
	              line-height: 32rpx;
	  			margin-left: 10rpx;
	            }
	          }
	  
	          .auth-wrapper {
	            display: flex;
	            align-items: center;
	  
	            .auth-icon {
	              width: 30rpx;
	              height: 30rpx;
	  			font-size: 30rpx;
	            }
	  
	            .label {
	              font-size: $uni-font-size-sm;
	  			@include color(color-lightest-est-er-dark);
	              line-height: 32rpx;
	  			margin-left: 10rpx;
	            }
	          }
	        }
	      }
	    }
	  
	    .line {
	      margin: 20rpx 0 30rpx 0;
	      width: 100%;
	      height: 1rpx;
	  	@include background_color(page-box-item-background-color);
	    }
	  
	    .bottom-wrapper {
	      display: flex;
	      justify-content: space-between;
	      align-items: center;
	  
	      .join-user-wrapper {
	        display: flex;
	        align-items: center;
	        font-size: $uni-font-size-sm;
	        @include color(color-lightest-est-er-dark);
	        line-height: 32rpx;
	  
	        .avatar-list-wrapper {
	  		  margin-right: 10rpx;
	          .avatar {
	            width: 46rpx;
	            height: 46rpx;
	            border-radius: 100%;
	            box-shadow: 0 0 5rpx 2rpx rgba(0, 0, 0, 0.1);
	  
	            &:not(:first-child) {
	              margin-left: -23rpx;
	            }
	          }
	        }
	      }
	  
	      .join-button-wrapper {
	        padding: 14rpx 20rpx;
	        border-radius: 139rpx;
	        font-size: $uni-font-size-medium;
	        line-height: 32rpx;
	  	  
	  	  @include background_color(follow-background-color);
	  	  @include color(color-follow-font);
	  
	        &.disabled {
	  		@include background_color(page-gray-er-background-color);
	  		@include color(color-lightest-est-est-dark);
	        }
	      }
	    }
	  }
	  
    }
  }


.xhs-loading-wrap{
	position: relative;
	width: $page-content-body-width;
	height: 200rpx;
	.xhs-loading {
		position: absolute;
		left: 50%;
		transform: translateX(-50%) scale(1.2);
		bottom: 10rpx;
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin: auto;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: transparent;
		padding: 10rpx 0;
		box-sizing: border-box;
		.xhs-loader {
		  width: 40rpx;
		  height: 40rpx;
		  display: block;
		  margin: auto;
		  border: 4rpx solid transparent;
		  border-top-color: transparent;
		  border-bottom-color: transparent;
		  border-right-color: $uni-color-primary;
		  border-left-color: $uni-color-primary;
		  border-radius: 50%;
		}
		.xhs-loader.rot5{
			animation: rot5 1s infinite;
		}
	
		@keyframes rot5 {
		  0% {
			transform: rotate(0);
		  }
	
		  50% {
			transform: rotate(180deg);
		  }
	
		  100% {
			transform: rotate(360deg);
		  }
		}
	}
}

</style>
