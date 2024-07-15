<script>
export default {
  name: "points-mall-goods-details-popup",
  components: { 
	  
  },
  data() {
    return {
      config: {
        goldIcon: 'https://oss.kdlf.top/2023/08/17/93384ea3ee44eedcc6329eb4f1a5a008.png',
        balance: 'https://oss.kdlf.top/2023/08/16/64968aaf53c216c1dab0fde0333ed338.png'
      },
      // 兑换商品提交表单
      exchangeForm: {
        id: null, // 商品ID
        sellPrice: null, // 商品有效期和价格
        num: 1 // 兑换数量
      }
    }
  },
  props: {
    show: { type: Boolean, default: false },
    goods: { type: Object, default: () => ({}) }
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
      return (item) => {
        return item.ageing === '0' ? '永久' : `${item.ageing}天`
      }
    },
    // 商品类型文本
    goodsTypeToText() {
      const res = { '0': '头像框', '1': '头衔', '2': '聊天气泡', '3': '会员卡', }
      return res[this.goods.type] || '未知'
    }
  },
  methods: {
    // 有效期选择事件
    ageingChangeHandle(evt) {
      this.exchangeForm.sellPrice = this.goods.sellPriceList[evt.detail.value]
    },
    numChangeHandle(evt) {
      this.exchangeForm.num = evt.detail.value
    },
    changeShow(e) {
      this.$emit('changeShow', e)
    }
  },
  mounted() {
    this.exchangeForm.sellPrice = this.goods.sellPriceList[0]
  },
}
</script>

<template>
  <u-popup :show="show" :locked="true">
    <view class="details-popup-wrapper">
      <!-- 顶部商品图片标签信息 -->
      <view class="top-info-wrapper" :style="{ background: `${goods.background}66` }">
        <image class="goods-img" :src="goods.img"/>

        <view class="top-tag-wrapper" v-if="goods.tag">{{ goods.tag }}</view>

        <view class="bottom-tag-wrapper" v-if="priceSku && goods.type">
          <view class="ageing" v-if="priceSku">{{ ageingToText(priceSku) }}</view>
          <view class="type" v-if="goods.type">{{ goodsTypeToText }}</view>
        </view>
      </view>

      <!-- 商品名称详情 -->
      <view class="goods-desc-wrapper">
        <view class="name">{{ goods.name }}</view>
        <view class="describe">{{ goods.describe }}</view>
      </view>

      <!-- 兑换表单 -->
      <view class="exchange-form-wrapper">
        <!-- 有效期选择 -->
        <view v-if="goods.sellPriceList && goods.sellPriceList.length > 0" class="form-item-row-wrapper">
          <view class="title">有效期</view>
          <radio-group name="ageingRadio" class="radio-wrapper" @change="ageingChangeHandle">
            <label class="item-wrapper" v-for="(item, index) in goods.sellPriceList" :key="index">
              <radio class="radio" :checked="index === 0" :value="index" color="#fc3a72"/>
              <text class="label">{{ ageingToText(item) }}</text>
            </label>
          </radio-group>
        </view>

        <!-- 兑换数量 -->
        <view class="form-item-row-wrapper">
          <view class="title">兑换数量</view>
          <slider class="slider" @changing="numChangeHandle" :value="exchangeForm.num" min="1" max="20" show-value
                  activeColor="#fc3a72" block-size="20" block-color="#fc3a72"/>
        </view>

        <!-- 购买按钮 -->
        <view class="buy-button-wrapper">
          <button class="button" type="default" :hover-stop-propagation="true">
            <image class="currency-icon" :src="currencyTypeIcon" />
            <view>{{ exchangeForm.sellPrice.price * exchangeForm.num }}</view>
          </button>
        </view>
      </view>
    </view>

    <view class="close-icon-wrapper" @tap.stop="changeShow(false)">
      <i class="mini-icon mini-chacha"></i>
    </view>
  </u-popup>
</template>

<style scoped lang="scss">
.details-popup-wrapper {
  width: 640rpx;
  background: white;
  border-radius: 30rpx;

  .top-info-wrapper {
    position: relative;
    width: 100%;
    height: 290rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    .goods-img {
      width: 240rpx;
      height: 240rpx;
    }

    .top-tag-wrapper {
      position: absolute;
      top: 16rpx;
      left: 28rpx;
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
      bottom: 16rpx;
      left: 28rpx;
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

  .goods-desc-wrapper {
    margin: 0 40rpx;
    padding: 30rpx 0;
    border-bottom: #A6A6A6 dashed 4rpx;

    .name {
      font-size: 36rpx;
      font-weight: 500;
    }

    .describe {
      margin-top: 10rpx;
      font-size: $uni-font-size-base;
      color: #A6A6A6;
    }
  }

  .exchange-form-wrapper {
    padding: 30rpx 40rpx;

    .form-item-row-wrapper {
      padding: 20rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: $uni-font-size-medium;
      }

      .radio-wrapper {

        .item-wrapper {
          margin-left: 40rpx;
        }
      }

      .slider {
        flex: 1;
      }
    }

    .buy-button-wrapper {
      margin-top: 46rpx;

      .button {
        display: flex;
        align-items: center;
        justify-content: center;

        .currency-icon {
          margin-right: 20rpx;
          width: 40rpx;
          height: 40rpx;
        }

        background: $uni-color-follow;
        color: $uni-color-follow-font;
        border-radius: 50rpx;
      }
    }
  }
}

.close-icon-wrapper {
  margin-top: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .mini-chacha {
    color: white;
    font-size: 60rpx;
  }
}
</style>
