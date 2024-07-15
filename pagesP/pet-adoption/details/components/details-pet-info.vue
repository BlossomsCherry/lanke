<script>
export default {
  name: "details-pet-info",
  props: {
    info: { type: Object, default: () => {} },
  }
}
</script>

<template>
  <!-- 宠物信息 -->
  <view class="pet-info-wrapper">
    <!-- 基本信息 -->
    <view class="base-info-wrapper">
      <view class="name">{{ info.name }}</view>
      <view class="gender-wrapper" v-if="info.pet_gender > 0">
        <i :class="['mini-icon-p', info.pet_gender === 1 ? 'mini-nan' : 'mini-nv']"/>
      </view>
      <i class="mini-icon-p mini-fengefu"/>
      <view class="age">{{ info.petAge + info.pet_breed }}</view>
      <view :class="['adopt-status', info.adopt_status === 0 ? 'no' : 'yes']">{{ info.adopt_status === 0 ? '待领养' : '已领养' }}</view>

      <view class="cost-wrapper">
        <!-- <view class="cost" v-if="info.is_free !== 0 && info.cost">{{ info.is_free == 2 ? '押金' : '' }}￥{{ info.cost }}</view> -->
      </view>
    </view>

    <!-- 展示信息 -->
    <view class="post-data-wrapper">
	  <view class="id-text">编号{{ info.id }}</view>
      <view class="item-wrapper">
        {{ info.format_time }}
      </view>
	  
      <view class="item-wrapper">
        <u-icon name="star" size="34"/>
        <view>{{ info.collect_count }}人收藏</view>
      </view>
	  
      <!-- <view class="item-wrapper right" @click="toSliderUrl(6, '/pagesP/pet-adoption/report-push/index')">
        <u-icon name="warning" size="42"/>
        <view>举报</view>
      </view> -->
    </view>
	<view class="post-data-wrapper">
		<view class="item-wrapper">
		  <u-icon name="map" size="34"/>
		  <view>{{ info.province+ '-' + info.city + '-' + info.district }}</view>
		</view>
	</view>

    <!-- 介绍 -->
    <view class="pet-introduce-wrapper">
      <view class="flex-row"><i class="mini-icon mini-baojiaquotation2"/></view>
      <view>{{ info.pet_introduce }}</view>
    </view>

    <!-- 宠物状态 -->
    <view class="pet-status-wrapper">
      <view :class="['item-wrapper', info.is_vaccine ? 'mianyi' : 'disabled']">
        <i class="mini-icon-p mini-mianyi"></i>
        <view>{{ info.is_vaccine ? '已免疫' : '未免疫' }}</view>
      </view>

      <view :class="['item-wrapper', info.is_sterilization ? 'jueyu' : 'disabled']">
        <i class="mini-icon-p mini-jueyu"></i>
        <view>{{ info.is_sterilization ? '已绝育' : '未绝育' }}</view>
      </view>

      <view :class="['item-wrapper', info.is_repellent ? 'quchong' : 'disabled']">
        <i class="mini-icon-p mini-quchong"></i>
        <view>{{ info.is_repellent ? '已驱虫' : '未驱虫' }}</view>
      </view>

      <view class="item-wrapper shoufei">
        <i class="mini-icon-p mini-shoufei"></i>
        <view>{{ info.cost_tip }}</view>
      </view>
    </view>

    <!-- 领养条件 -->
    <view class="pet-condition-wrapper">
      <view class="item-wrapper" v-for="(item, index) in info.condition_tip" :key="index">
        <u-icon name="checkbox-mark"/>
        <view>{{ item }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/pagesP/app.scss';

.pet-info-wrapper {
  padding: $uni-spacing-col-lg $page-row-spacing;

  .base-info-wrapper {
    display: flex;
    align-items: center;
    font-size: $uni-font-size-lg;

    .name {
	  max-width: 300rpx;
      font-size: 42rpx;
      font-weight: bold;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  @include color(color-darkest);
    }
	
	.age{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		@include color(color-darkest);
	}

    .gender-wrapper {
      margin-left: $uni-spacing-row-sm;

      .mini-nan {
        color: #75b9eb;
      }

      .mini-nv {
        color: #ff7a78;
      }
    }

    .adopt-status {
      margin-left: $uni-spacing-row-sm;
      padding: 2rpx $uni-spacing-row-sm;
      border-radius: $uni-border-radius-base;
      font-size: $uni-font-size-sm;
      color: white;
	  white-space: nowrap;
      &.yes {
		@include background_color(page-lightest-dark-background-color);
      }

      &.no {
        background: #0ac9aa;
      }
    }

    .cost-wrapper {
      margin-left: auto;
      font-size: $uni-font-size-lg;
      color: $uni-color-primary;
    }
  }

  .post-data-wrapper {
    margin-top: $uni-spacing-col-lg;
    display: flex;
    align-items: center;
    gap: $uni-spacing-row-base;
    font-size: $uni-font-size-base;
	
	.id-text{
		@include color(color-dark);
	}

    .item-wrapper {
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-sm;
	  @include color(color-lightest-dark);

      &.right {
        margin-left: auto;
      }
    }
  }

  .pet-introduce-wrapper {
    margin-top: $uni-spacing-col-lg;
    font-size: $uni-font-size-lg;
    @include color(color-lightest-dark);
  }

  .pet-status-wrapper {
    margin-top: $uni-spacing-col-lg;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $uni-spacing-row-lg;

    .item-wrapper {
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-sm;
      font-size: $uni-font-size-medium;
      font-weight: bold;

      &.disabled {
        @include color(color-lightest-dark);
      }

      &.mianyi {
        color: #6ecffc;
      }

      &.jueyu {
        color: #ff7a78;
      }

      &.quchong {
        color: #ffbd66;
      }

      &.shoufei {
        color: #bf78fb;
      }
    }
  }

  .pet-condition-wrapper {
    margin-top: 32rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-row-gap: $uni-spacing-row-base;

    .item-wrapper {
      display: flex;
      align-items: center;
      gap: $uni-spacing-row-sm;
      font-size: $uni-font-size-base;
      @include color(color-lightest-dark);
    }
  }
}
</style>
