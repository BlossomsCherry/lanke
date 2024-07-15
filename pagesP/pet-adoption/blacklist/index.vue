<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import BlacklistButtonPlace from "@/pagesP/pet-adoption/blacklist/components/blacklist-button-place.vue";
import PetAdoptionNotification from "@/pagesP/pet-adoption/components/pet-adoption-notification.vue";

export default {
  components: {
	myToast,navBar,hoverBall,
	PetAdoptionNotification, BlacklistButtonPlace
  },
  data() {
    return {
      notificationContent: '以下信息由网友在个平台收集发布，资料不仅来自领养人和送养人，也包括媒体曝光。请大家诚信交流，共建最优领养中心。',
      blacklist: [
        { id: 1, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 2, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 3, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 4, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 5, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 6, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 7, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 8, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' },
        { id: 9, name: '小啊领取a啊啥的啊啥的', reason: '领养人领养狗后说狗狗拉屎去厨房、不想养了、而且已经打了疫苗' }
      ]
    };
  }
}
</script>

<template>
  <view class="blacklist-page">

    <view class="top-card-wrapper">
      <!-- 金刚位 -->
      <blacklist-button-place/>

      <!-- 提醒通知 -->
      <pet-adoption-notification :content="notificationContent"/>
    </view>

    <!-- 黑名单列表 -->
    <view class="blacklist-card-wrapper">
      <view class="title-wrapper">
        <view>失信人名单</view>
      </view>

      <view class="table-wrapper">
        <view class="t-wrapper">
          <view class="both">昵称</view>
          <view class="middle text-center">举报原因</view>
          <view class="both">详情</view>
        </view>

        <view v-for="(item, index) in blacklist" :key="item.id" :class="['t-wrapper', {'none-border' : index === blacklist.length - 1 } ]">
          <view class="both left u-line-1">{{ item.name }}</view>
          <view class="middle u-line-2">{{ item.reason }}</view>
          <view class="both right" @click="toSliderUrl(6, '/pagesP/pet-adoption/report-details/index')">
            <view>查看</view>
            <u-icon name="arrow-right" size="30" color="#fc3a72"/>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.blacklist-page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 42rpx);
  background: $uni-bg-color-grey;

  .top-card-wrapper {
    padding: $uni-spacing-col-lg $page-row-spacing;
    background: white;
  }

  .blacklist-card-wrapper {
    margin: $uni-spacing-col-lg $page-row-spacing 0 $page-row-spacing;
    padding: $uni-spacing-col-lg $uni-spacing-row-base;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: $uni-border-radius-lg-est;

    .title-wrapper {
      font-size: $uni-font-size-lg;
      font-weight: bold;
    }

    .table-wrapper {
      margin-top: $uni-spacing-col-lg;
      display: flex;
      flex-direction: column;
      font-size: $uni-font-size-base;
      color: $uni-text-color-placeholder;
      border: 2rpx solid $uni-border-color;
      border-radius: $uni-border-radius-lg-er;

      .t-wrapper {
        height: 120rpx;
        display: flex;
        align-items: center;
        border-bottom: 2rpx solid $uni-border-color;

        &.none-border {
          border-bottom: none;
        }

        .both {
          width: 160rpx;
          height: 100%;
          padding: 0 $uni-spacing-row-sm;
          line-height: 120rpx;
          box-sizing: border-box;
          text-align: center;

          &.left {
            border-right: 2rpx solid $uni-border-color;
          }

          &.right {
            display: flex;
            justify-content: center;
            align-items: center;
            color: $uni-color-primary;
            border-left: 2rpx solid $uni-border-color;
          }
        }

        .middle {
          flex: 1;
          padding: 0 $uni-spacing-row-sm;
          box-sizing: border-box;

          &.text-center {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
