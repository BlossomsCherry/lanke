<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import PetAdoptionNotification from "@/pagesP/pet-adoption/components/pet-adoption-notification.vue";

export default {
  components: {
	  myToast,navBar,hoverBall,
	  PetAdoptionNotification
  },
  data() {
    return {
      notificationContent: '以下信息均已确认的黑名单人员信息，正在审核中的或审核不通过的，不在其中。',
      searchValue: 0,
      searchRange: ['按真实姓名搜索', '按微信昵称搜索', '按身份证号搜索', '按微信号搜索', '按手机号搜索'],
      keyword: ''
    };
  }
}
</script>

<template>
  <view class="black-search-page">
    <!-- 通知 -->
    <pet-adoption-notification :content="notificationContent"/>

    <!-- 搜索表单 -->
    <view class="search-form-wrapper">

      <picker :value="searchValue" :range="searchRange" @change="e => searchValue = e.detail.value">
        <view class="picker-wrapper">
          <view>{{ searchRange[searchValue] }}</view>
          <u-icon name="arrow-down" size="30" color="#000"/>
        </view>
      </picker>

      <view class="input-wrapper">
        <u--input v-model="keyword" :customStyle="{ height: '80rpx', boxSizing: 'border-box' }" placeholder="请输入内容..." border="surround"/>
      </view>
    </view>

    <view class="bottom-wrapper">
      <u-button shape="circle" color="#fc3a72" text="搜索" :custom-style="{ height: '80rpx' }"/>
    </view>
  </view>
</template>


<style lang="scss" scoped>
.black-search-page {
  margin: $uni-spacing-col-lg $page-row-spacing;

  .search-form-wrapper {
    margin-top: 42rpx;

    .picker-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 $uni-spacing-row-lg;
      height: 80rpx;
      border-radius: $uni-border-radius-lg;
      border: 1rpx solid $uni-border-color;
    }

    .input-wrapper {
      margin-top: $uni-spacing-col-lg;
    }
  }

  .bottom-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24rpx 24rpx env(safe-area-inset-bottom) 24rpx;
    background: white;
    box-shadow: 0rpx -8rpx 52rpx 0rpx rgba(0, 0, 0, 0.11);
  }
}
</style>
