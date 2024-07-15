<script>

export default {
  name: 'join-bottom-tools',
  components: {
	  
  },
  props: {
    info: { type: Object, required: true },
    totalPrice: { type: [Number, String], required: true },
  }
}
</script>

<template>
  <view class="join-bottom-tools" @click="$emit('click')">
    <view :class="'btn-wrapper ' + (totalPrice >= 0 ? '' : 'disable')">确认支付 ￥{{ totalPrice }}</view>
  </view>
</template>

<style scoped lang="scss">
.join-bottom-tools {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  @include background_color(page-box-background-color);
  box-shadow: 0rpx 4rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
  padding: 20rpx 20rpx calc(env(safe-area-inset-bottom) + 20rpx) 20rpx;

  .btn-wrapper {
    width: 100%;
    height: 88rpx;
    background: $uni-color-follow;
    color: $uni-color-follow-font;
    border-radius: 317rpx;
    font-size: $uni-font-size-medium;
    font-weight: 400;
    text-align: center;
    line-height: 88rpx;
  }
  .btn-wrapper.disable{
	opacity: 0.7;
  }
}
</style>
