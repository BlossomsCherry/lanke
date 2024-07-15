<script>
export default {
  name: 'join-pay-explain-card',
  props: {
    info: { type: Object, required: true },
  },
  data() {
    return {

    }
  }
}
</script>

<template>
  <view class="join-pay-explain-card">
    <view class="title">支付说明</view>
    <view class="explain-list-wrapper" v-for="(item, idx) in info.explain_list" :key="idx" v-if="info.explain_list">
      <view class="label">{{ item.label }}</view>
      <view class="item-wrapper" v-for="(item1, idx1) in item.explain" :key="idx1">
        <view>·</view>
        <view class="_text">{{ item1 }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.join-pay-explain-card {
  margin-top: 20rpx;
  padding: 40rpx 20rpx;
  @include background_color(page-box-background-color);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;

  .title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    @include color(color-darkest);
    line-height: 32rpx;
	margin-bottom: 26rpx;
  }

  .explain-list-wrapper {
    display: flex;
    flex-direction: column;
	margin-bottom: 26rpx;

    .label {
      font-size: $uni-font-size-sm-base;
      font-weight: bold;
      @include color(color-darkest);
	  margin-bottom: 20rpx;
    }

    .item-wrapper {
      display: flex;
      font-size: $uni-font-size-sm-base;
      @include color(color-lightest-est-er-dark);
	  ._text{
		  margin-left: 20rpx;
	  }
    }
  }
  
  .explain-list-wrapper:last-child{
	  margin-bottom: 0;
  }
}
</style>
