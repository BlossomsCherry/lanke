<script>
export default {
  name: "pet-adoption-bottom-btn",
  props: {
    leftText: { type: String, default: "左侧" },
    leftBtnDisabled: { type: Boolean, default: false },
    leftCondition: { type: Boolean, default: false },
    rightText: { type: String, default: "右侧" },
    rightBtnDisabled: { type: Boolean, default: false },
    rightCondition: { type: Boolean, default: false }
  },
  computed: {
    leftCustomStyle() {
      const step1 = { backgroundColor: 'transparent', border: '1rpx solid '+this.primaryColor, height: '80rpx', color: this.primaryColor }
      return this.stepPage === 0 ? { height: '80rpx' } : step1
    }
  }
}
</script>

<template>
  <view class="submit-btn">
    <view :class="['left-wrapper', leftCondition ? 'scale' : '']" v-if="leftCondition">
      <u-button
          shape="circle"
          :color="primaryColor"
          throttleTime="100"
          :disabled="leftBtnDisabled"
          :custom-style="leftCustomStyle"
          :text="leftText"
          @click="$emit('leftBtnHandle')"
      />
    </view>

    <view class="right-wrapper">
      <u-button
          shape="circle"
          :color="primaryColor"
          throttleTime="100"
          :disabled="rightBtnDisabled"
          :custom-style="{ height: '80rpx' }"
          :text="rightText" @click="$emit('rightBtnHandle')"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  padding: 24rpx 24rpx calc(env(safe-area-inset-bottom) + 24rpx) 24rpx;
  display: flex;
  align-items: center;
  gap: $uni-spacing-row-lg;
  background: white;
  box-shadow: 0rpx -8rpx 52rpx 0rpx rgba(0, 0, 0, 0.11);

  .left-wrapper {
    width: 100%;

    &.scale {
      width: 220rpx;
    }
  }

  .right-wrapper {
    flex: 1;
  }
}
</style>
