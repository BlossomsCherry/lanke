<script>
import PointsMallGoodsDetailsPopup from "@/pagesU/points-mall/comonents/points-mall-goods-details-popup.vue";

export default {
  name: "points-mall-goods-item",
  components: { PointsMallGoodsDetailsPopup },
  props: {
    goods: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      showDetailsPopup: false,
      config: {
        goldIcon: 'https://oss.kdlf.top/2023/08/17/93384ea3ee44eedcc6329eb4f1a5a008.png',
        balance: 'https://oss.kdlf.top/2023/08/16/64968aaf53c216c1dab0fde0333ed338.png'
      }
    }
  },
  computed: {
    priceSku() {
      return this.goods.sellPriceList[0]
    },
    currencyTypeIcon() {
      if (this.priceSku.currency === 0) {
        return this.config.goldIcon
      } else if (this.priceSku.currency === 1) {
        return this.config.balance
      } else {
        return ''
      }
    },
    // 有效期转文本
    ageingToText() {
      return this.priceSku.ageing === '0' ? '永久' : `${this.priceSku.ageing}天`
    },
    // 商品类型文本
    goodsTypeToText() {
      const res = { '0': '头像框', '1': '头衔', '2': '聊天气泡', '3': '会员卡', }
      return res[this.goods.type] || '未知'
    }
  }
}
</script>

<template>
  <view>
    <view class="points-mall-goods-item-wrapper" @tap.stop="showDetailsPopup = true">
      <view class="info-wrapper" :style="{ background: `${goods.background}66` }">
        <image class="goods-img" :src="goods.img"/>

        <view class="top-tag-wrapper" v-if="goods.tag">{{ goods.tag }}</view>

        <view class="bottom-tag-wrapper" v-if="priceSku && goods.type">
          <view class="ageing" v-if="priceSku.ageing">{{ ageingToText }}</view>
          <view class="type" v-if="goods.type">{{ goodsTypeToText }}</view>
        </view>
      </view>
      <view class="name">{{ goods.name }}</view>
      <view class="price-wrapper">
        <image :src="currencyTypeIcon" class="icon"/>
        <view class="price">{{ priceSku.price }}</view>
      </view>
    </view>

    <!-- 商品详情弹窗 -->
    <points-mall-goods-details-popup :show="showDetailsPopup" :goods="goods" @changeShow="(e) => showDetailsPopup = e"/>
  </view>
</template>

<style scoped lang="scss">
.points-mall-goods-item-wrapper {
  display: flex;
  flex-direction: column;

  .info-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 260rpx;
    border-radius: 20rpx;

    .goods-img {
      width: 160rpx;
      height: 160rpx;
    }

    .top-tag-wrapper {
      position: absolute;
      left: 14rpx;
      top: 10rpx;
      height: 40rpx;
      background: #FF5733;
      border-radius: 30rpx;
      font-size: 22rpx;
      line-height: 40rpx;
      padding: 0 10rpx;
      color: white;
    }

    .bottom-tag-wrapper {
      position: absolute;
      left: 14rpx;
      bottom: 10rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      font-size: 22rpx;
      font-weight: 500;
      line-height: 40rpx;
      background: white;
      border-radius: 30rpx;

      .ageing {
        padding: 0 10rpx;
        background: #FFEB3B;
        border-radius: 30rpx;
      }

      .type {
        padding: 0 10rpx;
      }
    }
  }

  .name {
    margin-top: 20rpx;
    font-size: $uni-font-size-lg;
    font-weight: 600;
  }

  .price-wrapper {
    margin-top: 8rpx;
    display: flex;
    align-items: center;
    gap: 4rpx;

    .icon {
      width: 30rpx;
      height: 30rpx;
    }

    .price {
      font-size: $uni-font-size-medium;
      font-weight: 600;
    }
  }
}
</style>
