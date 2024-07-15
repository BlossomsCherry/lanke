<script>
export default {
  name: "blacklist-button-place",
  data() {
    return {
      list: [
        { label: '我要举报', icon: 'warning', background: '#ff7a78', target: "/pagesP/pet-adoption/report-push/index", type: "6" },
        { label: '查询', icon: 'search', background: '#6bd5c9', target: "/pagesP/pet-adoption/blacklist-search/index", type: "6" },
        { label: '转发', icon: 'share-square', background: '#6ecffc', target: "/pagesP/pet-adoption/blacklist/index", type: "6" },
        { label: '管理', icon: 'setting', background: '#ff9b39', target: "/pagesP/pet-adoption/blacklist/index", type: "6" }
      ]
    }
  }
}
</script>

<template>
  <view class="button-place-wrapper">
    <view v-for="(item, index) in list" :key="index" class="item-wrapper" :style="{ background: item.background }" @click="toSliderUrl(item.type, item.target)">
      <u-icon :name="item.icon" color="white" size="60"/>
      <view>{{ item.label }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.button-place-wrapper {
  display: flex;
  align-items: center;
  gap: $uni-spacing-row-lg;

  .item-wrapper {
    padding: $uni-spacing-col-base 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $uni-spacing-col-sm;
    border-radius: $uni-border-radius-lg-er;
    color: white;
  }
}
</style>
