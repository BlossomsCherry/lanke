<script>
import PetAdoptionListItem from "@/pagesP/pet-adoption/components/pet-adoption-list-item.vue";

export default {
  name: "details-recommend-list",
  components: { PetAdoptionListItem },
  props: {
    list: { type: Array, default: () => [] }
  }
}
</script>

<template>
  <view class="details-recommend-wrapper">
    <view class="title-wrapper">同城推荐</view>
    <view v-for="item in list" :key="item.id">
      <pet-adoption-list-item :pet="item"/>
    </view>
  </view>
</template>

<style scoped lang="scss">
.details-recommend-wrapper {
  margin-top: $uni-spacing-col-lg;

  .title-wrapper {
    padding: 0 $page-row-spacing;
    font-size: 42rpx;
    font-weight: bold;
	@include color(color-darkest);
  }
}
</style>
