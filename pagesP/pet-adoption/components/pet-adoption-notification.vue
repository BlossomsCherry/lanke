<script>
export default {
  name: "pet-adoption-notification",
  props: {
    title: { type: String, default: "官方提醒", },
    content: { type: String, required: true },
    icon: { type: String, default: "volume-fill" },
  }
}
</script>

<template>
  <view class="blacklist-notification-wrapper">
    <view class="title-wrapper">
      <view class="title">{{ title }}</view>
      <u-icon name="volume-fill" color="#ff9b39"/>
    </view>

    <view class="content-wrapper">{{ content }}</view>
  </view>
</template>

<style scoped lang="scss">
.blacklist-notification-wrapper {
  margin-top: $uni-spacing-row-lg;
  padding: $uni-spacing-row-base;
  background: #fff4e9;
  border-radius: $uni-border-radius-lg-er;
  color: #ff9b39;

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-base;
    font-weight: bold;
  }

  .content-wrapper {
    margin-top: $uni-spacing-col-sm;
    font-size: $uni-font-size-sm;
  }
}
</style>
