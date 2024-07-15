<script>
export default {
  name: "details-user-info",
  props: {
    info: { type: Object, default: () => {} },
  }
}
</script>

<template>
  <view class="user-info-wrapper">
    <view class="title-wrapper">
      <view class="title">送养人信息</view>
    </view>

    <view class="info-wrapper" v-if="info.user">
		
      <view class="flex-row">
		  <image class="avatar" style="margin-right: 20rpx;" :src="info.user.user_avatar" @tap.stop.prevent="toSliderUrl(4, info.user.id)"/>
		  <view class="user-wrapper" @tap.stop.prevent="toSliderUrl(4, info.user.id)">
		  		<view :class="'auth-name ' + (info.user.is_authentication ? 'yes' : 'no') ">
		  		  <view class="name">{{ info.user.user_name }}</view>
		  		  <i class="mini-icon-p mini-yishiming auth-color"/>
		  		  <view class="label auth-color">{{ info.user.is_authentication ? '已认证' : '未认证' }}</view>
		  		</view>
		    <view class="before-online-wrapper">{{ info.user.online_time + ' '+ info.user.device }}在线</view>
		  </view>
	  </view>
	  
	  <block v-if="info.adopt_status == 0">
		  <view class="contact-wrapper">
		    <view class="item-wrapper weixin" v-if="info.adopter_wechatId" @tap.stop.prevent="toSliderUrl(17, info.adopter_wechatId)">
		      <i class="mini-icon-p mini-weixin"/>
		      <view>微信</view>
		    </view>
		    <view class="item-wrapper dianhua" v-if="info.adopter_mobile" @tap.stop.prevent="toSliderUrl(22, info.adopter_mobile)">
		      <i class="mini-icon-p mini-dianhua"/>
		      <view>电话</view>
		    </view>
		  </view>
	  </block>
	  
      <block v-else>
		  <view class="contact-wrapper gray">
		    <view class="item-wrapper weixin" v-if="info.adopter_wechatId">
		      <i class="mini-icon-p mini-weixin"/>
		      <view>微信</view>
		    </view>
		    <view class="item-wrapper dianhua" v-if="info.adopter_mobile">
		      <i class="mini-icon-p mini-dianhua"/>
		      <view>电话</view>
		    </view>
		  </view>
	  </block>

    </view>

    <!-- 统计数据 -->
    <view class="stat-wrapper" v-if="info.user">
      <view class="item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesP/pet-adoption/pet-common-list/index?user_id='+ info.user.id +'&type=5')">
        <view>{{ info.user.adoption.count.status_0 }}</view>
        <view>待送养</view>
      </view>

      <view class="item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesP/pet-adoption/pet-common-list/index?user_id='+ info.user.id +'&type=4')">
        <view>{{ info.user.adoption.count.status_1 }}</view>
        <view>已送养</view>
      </view>

      <view class="item-wrapper" @tap.stop.prevent="toSliderUrl(18, info.user.id)">
        <view>{{ info.user.message_replay_rate }}</view>
        <view>私信回复率</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/pagesP/app.scss';

.user-info-wrapper {
  margin-top: $uni-spacing-col-lg;
  padding: 0 $page-row-spacing;

  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 42rpx;
    font-weight: bold;
	.title{
		@include color(color-darkest)
	}
  }

  .info-wrapper {
    margin-top: $uni-spacing-row-base;
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-base;
	justify-content: space-between;

    .avatar {
      width: 110rpx;
      height: 110rpx;
      border-radius: $uni-border-radius-circle;
    }

    .user-wrapper {
      flex: 1;
      height: 110rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .auth-name {
        display: flex;
        align-items: center;
        gap: $uni-spacing-row-sm;
        font-size: $uni-font-size-medium;

        .name {
          font-weight: bold;
		  @include color(color-darkest);
        }

        .auth-color {
          color: #bf78fb;
        }
      }
	  
	  .auth-name.no{
		  .auth-color{
			  @include color(color-dark-gray);
		  }
		  .mini-icon-p{
			  display: none!important;
		  }
	  }

      .before-online-wrapper {
        font-size: $uni-font-size-sm;
        color: $uni-text-color-grey;
      }
    }

    .contact-wrapper {
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-lg;

      .item-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: $uni-font-size-medium;

        &.weixin {
          color: #00d971;
        }

        &.dianhua {
          color: #ffbd66;
        }
      }
    }
	
	.contact-wrapper.gray{
		.item-wrapper{
			&.weixin {
			  color: $uni-text-color-grey;
			}
			
			&.dianhua {
			  color: $uni-text-color-grey;
			}
		}
	}
	
  }

  .stat-wrapper {
    margin-top: $uni-spacing-row-base;
    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
    display: flex;
    justify-content: space-around;
    align-items: center;
    @include background_color(page-gray-background-color);
    border-radius: $uni-border-radius-lg-er;
    box-shadow: 0rpx 0 24rpx 0rpx rgba(0, 0, 0, 0.11);

    .item-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $uni-spacing-row-base;
      font-size: $uni-font-size-medium;
	  @include color(color-darkest);
    }
  }
}
</style>
