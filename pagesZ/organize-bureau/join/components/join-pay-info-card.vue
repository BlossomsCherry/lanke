<script>
export default {
  name: 'join-pay-info-card',
  props: {
    number: { type: Number, required: true },
    totalPrice: { type: [Number, String], required: true },
	time: { type: String, required: true }
  }
}
</script>

<template>
  <view class="pay-info-card">
    <view class="number-wrapper">
      <view class="label-wrapper">
        <text class="label">购买数量</text>
      </view>
	  <view class="num">1</view>
      <!-- <view class="number-box">
        <u-number-box v-model="number" @change="e => $emit('change', e.value)">
          <view slot="minus" class="minus">
            <u-icon name="minus" size="36"/>
          </view>
          <text slot="input" class="input">{{ number }}</text>
          <view slot="plus" class="plus">
            <u-icon name="plus" size="36"/>
          </view>
        </u-number-box>
      </view> -->
    </view>
	
	<view style="height: 38rpx;"></view>

    <!-- 支付金额 -->
    <view class="price-wrapper">
      <view class="label u-line-1">支付金额</view>
      <view class="price u-line-1">¥{{ totalPrice }}</view>
    </view>
	
	<view style="height: 38rpx;"></view>

    <!-- 支付方式 -->
    <!-- <view class="pay-method-wrapper">
      <view class="label">支付方式</view>
      <view class="icon-wrapper">
        <u-icon name="weixin-fill" size="36" color="#00c550"/>
        <view style="margin-left: 10rpx;">微信</view>
      </view>
    </view> -->
	
	<view class="time-wrapper">
	  <view class="label u-line-1">活动时间</view>
	  <view class="time u-line-1">{{ time }}</view>
	</view>
	
  </view>
</template>

<style scoped lang="scss">
.pay-info-card {
  margin-top: 20rpx;
  padding: 30rpx 20rpx;
  @include background_color(page-box-background-color);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;

  .number-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label-wrapper {
      .label {
        font-size: $uni-font-size-medium;
        @include color(color-darkest);
        line-height: 32rpx;
      }

      .tips {
        font-size: $uni-font-size-sm-base;
        color: #8C8C8C;
      }
    }
	
	.num{
		font-size: $uni-font-size-medium;
		@include color(color-darkest);
	}

    .number-box {
      border: 1rpx solid;
	  @include border_color(border-color-light-line-background-color);
      border-radius: 6rpx;

      .minus {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 54rpx;
        height: 54rpx;
      }

      .input {
        width: 54rpx;
        height: 54rpx;
        border-left: 1rpx solid;
        border-right: 1rpx solid;
		@include border_color(border-color-light-line-background-color);
        text-align: center;
        font-size: $uni-font-size-medium;
        @include color(color-darkest);
        line-height: 54rpx;
      }

      .plus {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 54rpx;
        height: 54rpx;
      }
    }
  }

  .price-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: $uni-font-size-medium;
      @include color(color-darkest);
      line-height: 32rpx;
    }

    .price {
      font-size: $uni-font-size-medium;
      color: #FF1B1B;
      line-height: 32rpx;
    }
  }
  
  .time-wrapper{
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  
	  .label {
	    font-size: $uni-font-size-medium;
	    @include color(color-darkest);
	    line-height: 32rpx;
	  }
	  
	  .time {
	    font-size: $uni-font-size-medium;
	    @include color(color-darkest);
	    line-height: 32rpx;
	  }
  }

  .pay-method-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: $uni-font-size-medium;
      @include color(color-darkest);
      line-height: 32rpx;
    }

    .icon-wrapper {
      display: flex;
      align-items: center;
      font-size: $uni-font-size-medium;
      @include color(color-darkest);
      line-height: 32rpx;
    }
  }
}
</style>
