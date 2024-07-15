<script>
export default {
  name: 'join-pick-insure-popup',
  props: {
    show: { type: Boolean, default: false },
    recipient: { type: Object, required: true }
  },
  data() {
    return {
      equityList: [
        { icon: 'lock', label: '意外伤害身故、残疾', price: '10万' },
        { icon: 'question-circle', label: '意外伤害医疗', price: '1万' },
        { icon: 'rmb-circle', label: '意外伤害住院津贴', price: '100/天' }
      ]
    }
  },
  computed: {
    // 是否有了领取人
    isRecipient() {
      return this.recipient.name
    }
  }
}
</script>

<template>
  <u-popup :show="show" mode="center" :closeOnClickOverlay="false">
    <view class="content-wrapper">
      <view class="img-wrapper">
        <image class="img" :src="require('../../../static/insure.png')"/>
      </view>
      <view class="title">已经为你赠送「尊享保障」</view>
      <view class="sub-title">请确认您的信息</view>

      <!-- 保险权益 + 新增领取人 -->
      <view class="equity-wrapper">
        <view class="item-wrapper" v-for="(item, idx) in equityList" :key="idx">
          <u-icon :name="item.icon" size="32"/>
          <view class="label">{{ item.label }}</view>
          <view class="price">¥{{ item.price }}</view>
        </view>

        <view class="tips">*每次住院绝对免赔3天单次最高90天累计不超过180天</view>
        <view class="divider"/>

        <view class="insure-recipient-wrapper" @click="$emit('popup', { type: 'pick-insure-popup', fn: 'openAddRecipientPopup' })">
          <view class="recipient-info-wrapper" v-if="isRecipient">
            <view class="name">信息：{{ recipient.name }}</view>
            <view class="edit-text">修改信息</view>
          </view>

          <view class="add-btn-wrapper" v-else>
            <u-icon name="plus" size="32" color="#FFF"/>
            <view>新增领取人</view>
          </view>
        </view>
      </view>

      <view class="divider"/>

      <!-- 领取保险按钮 -->
      <view :class="['pick-insure-btn-wrapper', isRecipient ? '' : 'disabled']" @click="$emit('popup', { type: 'pick-insure-popup', fn: 'submitBtn' })">
        领取保障
      </view>
    </view>

    <view class="close-icon-wrapper" @click="$emit('popup', { type: 'pick-insure-popup', fn: 'close' })">
      <u-icon name="close-circle" size="66" color="#FFF"/>
    </view>
  </u-popup>
</template>

<style scoped lang="scss">
.content-wrapper {
  width: 600rpx;
  padding: 40rpx 30rpx 30rpx 30rpx;
  background: white;
  border-radius: 40rpx;

  .img-wrapper {
    position: absolute;
    top: 14rpx;
    right: 27rpx;

    .img {
      width: 146rpx;
      height: 170rpx;
    }
  }

  .title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    @include color(color-darkest);
  }

  .sub-title {
    font-size: $uni-font-size-sm;
    @include color(color-lightest-est-er-dark);
  }

  .equity-wrapper {
    margin-top: 30rpx;
    padding: 32rpx 20rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    @include background_color(page-body2-background-color);
    border-radius: 20rpx;

    .item-wrapper {
      display: flex;
      align-items: center;
      font-size: $uni-font-size-sm-base;
      @include color(color-darkest);

      .label {
        margin-left: 10rpx;
      }

      .price {
        margin-left: auto;
      }
    }

    .tips {
      font-size: 20rpx;
      color: $uni-color-primary;
    }

    .divider {
      margin: 20rpx 0 30rpx 0;
      width: 100%;
      height: 1rpx;
      background: #E9E9E9;
    }

    .insure-recipient-wrapper {
      .add-btn-wrapper {
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10rpx;
        width: 240rpx;
        height: 70rpx;
        background: $uni-color-follow;
        color: $uni-color-follow-font;
        border-radius: 139rpx;
        text-align: center;
        font-size: $uni-font-size-medium;
        line-height: 70rpx;
      }

      .recipient-info-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: $uni-font-size-sm-base;
        line-height: 32rpx;

        .name {
          @include color(color-darkest);
        }

        .edit-text {
          color: $uni-color-primary;
        }
      }
    }
  }

  .divider {
    margin: 30rpx 0;
    width: 100%;
    height: 1rpx;
    background: #E9E9E9;
  }

  .pick-insure-btn-wrapper {
    width: 100%;
    height: 88rpx;
    border-radius: 317rpx;
    background: $uni-color-follow;
    color: $uni-color-follow-font;
    text-align: center;
    font-size: $uni-font-size-medium;
    line-height: 88rpx;

    &.disabled {
      background: #DADADA;
    }
  }
}

.close-icon-wrapper {
  margin: 40rpx auto;
}
</style>
