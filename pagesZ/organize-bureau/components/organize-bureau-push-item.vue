<script>
export default {
  name: 'organize-bureau-push-item',
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Object }
  },
  computed: {
    labelText() {
      if (this.value && this.value.label) {
        return this.value.label
      } else {
        return this.label
      }
    }
  }
}
</script>

<template>
  <view class="organize-bureau-push-item-wrapper">
    <image class="icon" :src="require(`../../static/push/${icon}`)"/>
    <view class="label">{{ labelText }}</view>
    <view class="right-icon">
      <u-icon name="arrow-right" color="red"/>
    </view>
  </view>
</template>

<style scoped lang="scss">
.organize-bureau-push-item-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon {
    width: 44rpx;
    height: 44rpx;
  }

  .label {
    margin-left: 12rpx;
    font-size: $uni-font-size-medium;
	@include color(color-darkest);
    line-height: 36rpx;
  }

  .right-icon {
    margin-left: auto;
  }
}
</style>
