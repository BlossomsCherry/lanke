<script>
export default {
  name: "pet-adoption-list-item",
  props: {
    pet: { type: Object, required: true }
  },
  methods: {

  }
}
</script>

<template>
  <view class="pet-adoption-list-item-wrapper" @tap.stop.prevent="toSliderUrl(6, '/pagesP/pet-adoption/details/index?id='+pet.id)">
    <image class="pet-image" :src="pet.image" mode="aspectFill"/>

    <view class="pet-info-wrapper">
      <view class="base-info-wrapper">
        <view class="name u-line-1">{{ pet.name }}</view>
        <view class="gender-wrapper" v-if="pet.pet_gender > 0">
          <i :class="['mini-icon-p', pet.pet_gender === 1 ? 'mini-nan' : 'mini-nv']"/>
        </view>
        <i class="mini-icon-p mini-fengefu"/>
        <view class="age">{{ pet.petAge }}</view>
        <view :class="'auth-name ' + (pet.user.is_authentication ? 'yes' : 'no') ">
          <i class="mini-icon-p mini-yishiming"/>
          <view class="label">{{ pet.user.is_authentication ? '已认证' : '未认证' }}</view>
        </view>
      </view>
	  <view class="list-id-text">编号 {{ pet.id }}</view>
      <view class="content-wrapper u-line-2">{{ pet.pet_introduce }}</view>

      <view class="tags-wrapper">
        <view class="item" v-for="item in pet.tags" :key="item.label" :style="{ background: item.isCheck ? item.background : '#999' }">
          {{ item.isCheck ? '已' : '未' }}{{ item.label }}
        </view>

        <view :class="['item', pet.adopt_status === 0 ? 'no' : 'yes']">
          {{ pet.adopt_status === 0 ? '待领养' : '已领养' }}
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import '@/pagesP/app.scss';

.pet-adoption-list-item-wrapper {
  margin: 24rpx $page-row-spacing;
  height: 220rpx;
  display: flex;
  align-items: center;

  .pet-image {
    width: 220rpx;
    height: 220rpx;
    border-radius: $uni-border-radius-lg-er;
  }

  .pet-info-wrapper {
    flex: 1;
    min-width: 0;
    margin-left: $uni-spacing-row-lg;
    height: 100%;
    display: flex;
    flex-direction: column;

    .base-info-wrapper {
      display: flex;
      align-items: center;
      font-size: $uni-font-size-lg;

      .name {
        max-width: 160rpx;
        font-weight: bold;
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
	  
	  .mini-fengefu{
		  @include color(color-light-dark);
	  }
	  
	  .age{
		  @include color(color-darkest);
	  }

      .auth-name {
        display: flex;
        align-items: center;
        gap: $uni-spacing-row-sm;
        margin-left: auto;
        color: #bf78fb;

        .label {
          font-size: $uni-font-size-sm;
        }
      }
	  
	  .auth-name.no{
		  @include color(color-dark-gray);
		  .mini-icon-p{
			  display: none!important;
		  }
	  }
	  
    }
	
	.list-id-text{
		font-size: $uni-font-size-base;
		@include color(color-light-dark);
	}

    .content-wrapper {
      margin-top: 10rpx;
      font-size: $uni-font-size-base;
      @include color(color-light-dark);
    }

    .tags-wrapper {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $uni-spacing-row-base;

      .item {
        padding: 4rpx $uni-spacing-row-sm;
        color: white;
        font-size: $uni-font-size-sm;
        border-radius: $uni-border-radius-sm;

        &.yes {
          background: $uni-text-color-grey;
        }

        &.no {
          background: #0ac9aa;
        }
      }
    }
  }
}
</style>
