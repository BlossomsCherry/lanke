<script>
export default {
  name: 'join-add-recipient-popup',
  props: {
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      recipientForm: { name: '', idCard: '' },
      btnDisabled: true
    }
  },
  methods: {
    inputChange(e, type) {
      // 1. 校验格式是否正确
      if (type === 'name') {
      } else if (type === 'idCard') {
      }
      // 2. 校验是否都有值
      this.btnDisabled = !(this.recipientForm.name && this.recipientForm.idCard)
    }
  }
}
</script>

<template>
  <u-popup :show="show" mode="bottom" :closeOnClickOverlay="false">
    <view class="join-add-recipient-popup-wrapper">
      <view class="close-icon-wrapper" @click="$emit('popup', { type: 'add-recipient-popup', fn: 'close' })">
        <u-icon name="close" size="30" color="#acaeb2"/>
      </view>
      <view class="top-title-wrapper">领取人身份信息</view>

      <!-- 完善身份信息 -->
      <view class="perfect-identity-wrapper">
        <view class="item-wrapper">
          <view class="label">证件类型</view>
          <view>身份证</view>
        </view>

        <view class="item-wrapper">
          <view class="label">姓名</view>
          <u--input v-model="recipientForm.name" placeholder="请填写真实姓名" border="none" inputAlign="right" @change="e => inputChange(e, 'name')"/>
        </view>

        <view class="item-wrapper">
          <view class="label">身份证号</view>
          <u--input v-model="recipientForm.idCard" placeholder="请填写身份证号" border="none" inputAlign="right" @change="e => inputChange(e, 'idCard')"/>
        </view>
      </view>

      <!-- 协议 -->
      <view class="agreement-tips-wrapper">
        你的个人信息我们将严格保密，详情可查看
        <text class="agreement">《用户协议》</text>
        和
        <text class="agreement">《隐私政策》</text>
      </view>

      <view
          :class="['bottom-btn-wrapper', btnDisabled ? 'disabled' : '']"
          @click="$emit('popup', { type: 'add-recipient-popup', fn: 'submitBtn', data: recipientForm })"
      >
        领取保障
      </view>
    </view>
  </u-popup>
</template>

<style scoped lang="scss">
.join-add-recipient-popup-wrapper {
  position: relative;
  padding: 30rpx 20rpx calc(env(safe-area-inset-bottom) + 30rpx) 20rpx;
  border-radius: 40rpx 40rpx 0 0;
  background: white;

  .close-icon-wrapper {
    position: absolute;
    top: 30rpx;
    right: 20rpx;
  }

  .top-title-wrapper {
    text-align: center;
    font-size: $uni-font-size-medium;
    font-weight: bold;
    @include color(color-darkest);
    line-height: 32rpx;
  }

  .perfect-identity-wrapper {
    margin-top: 67rpx;
    display: flex;
    flex-direction: column;

    .item-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
	  margin-bottom: 60rpx;
    }
	.item-wrapper:last-child{
		margin-bottom: 0;
	}
  }

  .agreement-tips-wrapper {
    margin-top: 254rpx;
    font-size: $uni-font-size-sm;
    @include color(color-lightest-est-er-dark);
    line-height: 32rpx;

    .agreement {
      color: $uni-color-primary;
    }
  }

  .bottom-btn-wrapper {
    margin-top: 40rpx;
    width: 100%;
    height: 88rpx;
    background: $uni-color-follow;
    color: $uni-color-follow-font;
    border-radius: 317rpx;
    text-align: center;
    font-size: $uni-font-size-medium;
    line-height: 88rpx;

    &.disabled {
      background: #DADADA;
    }
  }
}
</style>
