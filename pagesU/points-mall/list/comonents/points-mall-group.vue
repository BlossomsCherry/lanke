<script>
import PointsMallGoodsItem from "@/pagesU/points-mall/comonents/points-mall-goods-item.vue";

export default {
  name: "points-mall-group",
  components: { PointsMallGoodsItem },
  props: {
    group: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    toGroupList() {
      uni.wen.toUrl(6, '/pagesU/points-mall/group-goods-list/index', null);
    },
  }
}
</script>

<template>
  <view class="points-mall-group-wrapper">
    <view class="top-label-wrapper">
      <view class="title">{{ group.title }}</view>
      <view class="more-wrapper" @click.stop="toGroupList">
        <text>{{ group.moreLabel }}</text>
        <i class="mini-icon mini-youjiantou"></i>
      </view>
    </view>
    <view class="goods-grid-wrapper">
      <block v-for="goods in group.goodsList" :key="goods.id">
        <points-mall-goods-item :goods="goods"/>
      </block>
    </view>
  </view>
</template>

<style scoped lang="scss">
.points-mall-group-wrapper {
  margin: 60rpx 20rpx 0 20rpx;

  .top-label-wrapper {
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 40rpx;
      font-weight: 500;
    }

    .more-wrapper {
      display: flex;
      align-items: center;
      gap: 4rpx;
      font-size: $uni-font-size-base;
    }
  }

  .goods-grid-wrapper {
    margin-top: 32rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 20rpx;
    grid-row-gap: 36rpx;
  }
}
</style>
