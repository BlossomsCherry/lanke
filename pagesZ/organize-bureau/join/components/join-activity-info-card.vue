<script>
export default {
  name: 'join-activity-info-card',
  props: {
    info: { type: Object, required: true }
  }
}
</script>

<template>
  <view class="activity-info-card">
    <view class="info-wrapper">
      <image class="cover" :src="info.pic" mode="aspectFill"/>
      <view class="right-wrapper">
        <view class="title">{{ info.title }}</view>
        <view class="address-wrapper">
          <u-icon name="map" size="30"/>
          <view class="_text">{{ info.distance }} {{ info.address_detailed }}</view>
        </view>
      </view>
    </view>

    <view class="divider"/>

    <view class="tips-wrapper">
      <u-icon :color="primaryColor" name="info-circle-fill" size="36"/>
      <view class="_text">{{ info.refund_policy_tip }}~</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.activity-info-card {
  padding: 20rpx;
  @include background_color(page-box-background-color);
  border-radius: 20rpx;

  .info-wrapper {
    min-width: 0;
    display: flex;
    align-items: center;

    .cover {
      width: 160rpx;
      height: 160rpx;
      border-radius: 20rpx;
	  margin-right: 20rpx;
    }

    .right-wrapper {
      flex: 1;

      .title {
        font-size: $uni-font-size-medium;
        font-weight: bold;
        @include color(color-darkest);
        line-height: 42rpx;
      }

      .address-wrapper {
        margin-top: 32rpx;
        display: flex;
        align-items: center;
        font-size: $uni-font-size-sm-base;
        @include color(color-darkest);
        line-height: 26rpx;
		._text{
			margin-left: 17rpx;
		}
      }
    }
  }


  .divider {
    margin: 20rpx 0;
    height: 1rpx;
    background-color: #F5F5F5;
  }

  .tips-wrapper {
    padding: 16rpx 20rpx;
    display: flex;
    align-items: center;
    background: rgba(252, 58, 114, 0.05);
    border-radius: 16rpx;
    font-size: $uni-font-size-sm-base;
    color: $uni-color-primary;
    line-height: 32rpx;
	._text{
		margin-left: 10rpx;
	}
  }
}
</style>
