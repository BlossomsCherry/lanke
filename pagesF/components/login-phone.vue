<script setup></script>

<template>
  <view class="login-phone">
    <view
      ><input
        class="input"
        type="number"
        v-model="phoneNumber"
        placeholder="请输入手机号"
    /></view>
    <view class="input-wrapper">
      <input
        class="code"
        type="number"
        v-model="code"
        placeholder="请输入验证码"
      />
      <button class="btn" @click="getCode">发送验证码</button>
    </view>
    <button
      class="login"
      @tap.stop.prevent="toSliderUrl(6, '/pagesF/personImage/index')"
    >
      立即登录/注册
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .login-phone {
    width: 700rpx;
    box-sizing: border-box;
    padding-left: 48rpx;
    padding-right: 46rpx;
    margin-bottom: 80rpx;

    .input {
      box-sizing: border-box;
      width: 656rpx;
      height: 80rpx;
      background: #ffffff;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 400;
      font-size: 28rpx;
      color: #c8c8c8;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      padding-left: 88rpx;
    }
    .input-wrapper {
      position: relative;
      width: 100%;
      .code {
        box-sizing: border-box;
        margin-top: 40rpx;
        width: 656rpx;
        height: 80rpx;
        background: #ffffff;
        border-radius: 40rpx 40rpx 40rpx 40rpx;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 28rpx;
        color: #c8c8c8;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        padding-left: 88rpx;
      }

      .btn {
        font-family: Source Han Sans, Source Han Sans;
        position: absolute;
        right: 10rpx;
        top: 50%;
        transform: translateY(-50%);
        color: #000000;
        font-weight: 400;
        font-size: 28rpx;
        background-color: transparent;
      }
      .btn::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 2rpx;
        height: 40rpx;
        background-color: #d8d8d8;
      }
    }
  }
</style>
