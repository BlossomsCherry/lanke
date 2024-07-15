<script>
import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';

export default {
  name: 'organize-bureau-details-join-user-popup',
  components: {
	tabsSwiper
  },
  data() {
	return {
		current: 0,
		swiperCurrent: 0,
	}
  },
  props: {
    show: { type: Boolean, default: false },
    groups: { type: Array, required: true },
	master: {type: Number, default: 0}
  },
  computed:{
	firstNav:{
		get(){
			let that = this;
			if(that.groups && that.groups.length > 0){
				let navs = [];
				for(let i = 0; i < that.groups.length; i++){
					navs.push({
						name: '第'+ (i + 1) +'组'
					});
				}
				return navs;
			}
			return [];
		},
		set(v){}
	},
  },
  methods: {
	joinTeam(team_id){
		this.$emit('joinTeam', team_id);
	},
	onreachBottom() {
		let that = this;
	},
	swiperChange(e){
		let that = this;
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
	}
  }
}
</script>

<template>
  <u-popup :show="show" mode="bottom" @close="$emit('close')">
    <view class="details-join-user-popup-wrapper">
		<view class="inner">
			<view class="title">
				选择位置
				<i class="mini-icon mini-shanchu2" @click="$emit('close')"></i>
			</view>
			<view class="join-user-list-wrapper">
				<tabsSwiper ref="uTabs" :list="firstNav" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :active-color="primaryColor" :bar-height="0" :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'"></tabsSwiper>
				<swiper :current="swiperCurrent" @change="swiperChange" @transition="transition" @animationfinish="animationfinish" :style=" 'height: 800rpx;min-height: 800rpx;max-height: 800rpx;width: 750rpx;' ">
					<block v-for="(group, index) in groups" :key="index">
						<swiper-item :class="'swiper-item swiper-item-'+index">
							<scroll-view scroll-y class="qrcode-content"  :style=" 'height: 800rpx;min-height: 800rpx;max-height: 800rpx;width: 750rpx;' " @scrolltolower="onreachBottom">
								<view class="team" v-for="(team, tindex) in group.teams" :key="tindex">
									<view class="team-title">{{ '第'+ ( tindex + 1) +'队' }}</view>
									<view class="team-members">
										
										<block v-for="(member, mindex) in team.member_list" :key="mindex">
											<view class="item-wrapper">
											  <view :class="['avatar-wrapper', member.id == master ? 'master' : '']">
												<image class="avatar" :src="member.user_avatar"/>
												<view class="tips" v-if="member.id == master">组局人</view>
											  </view>
											  <view class="info-wrapper">
												<view class="top-wrapper">
												  <view class="name">{{ member.user_name }}</view>
												  <u-icon :name="member.gender === 1 ? 'man' : 'woman'" :color="member.gender === 1 ? '#6ab9e8' : '#ff3cc7'"/>
												</view>
												<view class="slogan u-line-1">{{ member.user_introduce }}</view>
											  </view>
											</view>
											<view class="split-line"></view>
										</block>
										
										<view class="item-wrapper" @tap.stop.prevent="joinTeam(team.id)" v-if="team.members_limit > team.members_num">
											<view class="avatar-wrapper add">
												<i class="avatar mini-icon mini-jia"></i>
											</view>
											<view class="info-wrapper">
												<view class="top-wrapper">
												  <view class="name">加入该队</view>
												</view>
												<view class="slogan u-line-1">
													还差{{ team.members_limit - team.members_num }}位
												</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
    </view>
  </u-popup>
</template>

<style scoped lang="scss">
.details-join-user-popup-wrapper {
  width: 750rpx;
  @include background_color(page-box-background-color);
  border-top-right-radius: $uni-border-radius-lg-er;
  border-top-left-radius: $uni-border-radius-lg-er;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  padding: 20rpx 0 40rpx;
  .inner{
  	width: $page-content-body-width;
  	/* #ifndef APP-NVUE */
  	padding-bottom: env(safe-area-inset-bottom);
  	margin: auto;
  	/* #endif */
  	/* #ifdef APP-NVUE */
  	margin-left: 20rpx;
  	margin-right: 20rpx;
  	/* #endif */
  
  	.title{
  		width: 100%;
  		@include color(color-lighter-er-dark);
  		position: relative;
  		text-align: center;
  		margin-bottom: 20rpx;
  		.mini-icon{
  			position: absolute;
  			right: 0;
  			top: 0;
  		}
  	}
	.team-title{
		@include color(color-lighter-er-dark);
		font-size: $uni-font-size-base;
		margin: 20rpx 0;
	}
	.join-user-list-wrapper {
		width: $page-content-body-width;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	  .item-wrapper {
	    min-width: 0;
	    display: flex;
		  margin-top: 20rpx;
	    .avatar-wrapper {
	      position: relative;
	      width: 80rpx;
	      height: 80rpx;
	      border-radius: 50%;
		  margin-right: 30rpx;
	
	      &.master {
	        padding: 5rpx;
	        border: 2rpx solid $uni-color-primary;
	      }
	
	      .avatar {
	        width: 100%;
	        height: 100%;
	        border-radius: 50%;
	      }
	
	      .tips {
	        position: absolute;
	        bottom: -16rpx;
	        left: 50%;
	        transform: translateX(-50%);
	        width: 64rpx;
	        height: 28rpx;
	        background: $uni-color-follow;
	        color: $uni-color-follow-font;
	        border-radius: 6rpx;
	        border: 1rpx solid;
			@include border_color(border-color-box-background-color);
	        text-align: center;
	        font-size: 20rpx;
	        line-height: 28rpx;
			z-index: 999;
	      }
	    }
		  
		  .avatar-wrapper.add{
			@include background_color(page-box-item2-background-color);
		  }
	
	    .info-wrapper {
	      flex: 1;
	      display: flex;
	      flex-direction: column;
	      justify-content: space-between;
	      height: 80rpx;
	
	      .top-wrapper {
	        display: flex;
	        align-items: center;
	
	        .name {
	          font-size: $uni-font-size-medium;
	          @include color(color-darkest);
	          line-height: 32rpx;
			  margin-right: 10rpx;
	        }
	      }
	
	      .slogan {
	        font-size: $uni-font-size-sm-base;
	        font-weight: 400;
	        @include color(color-lightest-est-er-dark);
	        line-height: 32rpx;
	      }
	    }
	  }
		
		.split-line{
			width: 100%;
			height: 2rpx;
			margin-top: 20rpx;
			@include background_color(page-lighter-line-background-color);
		}
		
	}
}
}
</style>
