<script>
export default {
  name: 'organize-bureau-list-item',
  props: {
    item: { type: Object, required: true }
  },
  data() {
    return {

    }
  },
  methods: {
	  toBureau(id, activity_state){
		  let that = this;
		  if(activity_state == 2){
			uni.wen.toUrl(6, '/pagesZ/organize-bureau/album/album?bureau='+id, that);
		  }else{
			uni.wen.toUrl(34, id, that);
		  }
	  }
  }
}
</script>

<template>
  <view class="list-item-wrapper" @tap.stop.prevent="toSliderUrl(34, item.id)">
    <!-- 活动信息 -->
    <view class="main-info-wrapper">
      <view class="cover-wrapper">
        <image class="cover" :src="item.pic" mode="aspectFill"/>
      </view>

      <view class="text-info-wrapper">
        <view class="title u-line-2">{{ item.title }}</view>
        <view class="other-text-wrapper">
          <u-icon name="clock" size="25" color="A3A3A3"/>
          <view class="_text">{{ item.service_date_start + ' ' + item.service_time_start }}</view>
        </view>

        <view class="other-text-wrapper">
          <u-icon name="map" size="25" color="A3A3A3"/>
          <view class="_text">{{ item.distance }} {{ item.address_detailed }}</view>
        </view>

        <view class="user-info-wrapper" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
          <view class="user-wrapper">
            <image class="avatar" :src="item.user.user_avatar"/>
            <view class="nickname">{{ item.user.user_name }}</view>
          </view>
          <view class="auth-wrapper" v-if="item.user.is_authentication == 1">
			<i class="auth-icon mini-icon mini-verify avatar-authentication-icon"></i>
            <view class="label">已认证</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分隔符 -->
    <view class="line"/>

    <!-- 报名区域u -->
    <view class="bottom-wrapper">
		<block v-if="item.member_total_all >= item.collect_count">
			<view class="join-user-wrapper">
			  <view class="avatar-list-wrapper">
			    <image class="avatar" v-for="(avatar, aindex) in item.avatars" :key="aindex" :src="avatar"/>
			  </view>
			  <view>{{ item.member_total_all }}人参加</view>
			</view>
		</block>
		<block v-else>
			<view class="join-user-wrapper">
			  <view class="avatar-list-wrapper">
			    <image class="avatar" v-for="(avatar, aindex) in item.avatars" :key="aindex" :src="avatar"/>
			  </view>
			  <view>{{ item.collect_count }}人收藏</view>
			</view>
		</block>

      <view :class="['join-button-wrapper', item.activity_state === 0 ? 'disabled' : '']" @tap.stop.prevent="toBureau(item.id, item.activity_state)">
        {{ item.status_text}}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
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
</style>
