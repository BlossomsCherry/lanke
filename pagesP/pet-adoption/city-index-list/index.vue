<script>
import city from './city'

export default {
  data() {
    return {
      indexList: ["A", "B", "C", 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
      itemArr: city.list()
    }
  },

  methods: {
    cellClickHandle(cell) {
      uni.$emit('searchPetAdoptionHomeList', { type: 'selectCity', cityName: cell })
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>

<template>
  <view class="city-index-list-page">
    <u-index-list :index-list="indexList">
      <view v-for="(item, index) in itemArr" :key="index">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]"/>
        <!-- #endif -->
        <u-index-item>
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"/>
          <!-- #endif -->
          <view class="list-cell" v-for="(cell, index1) in item" :key="index1" @click="cellClickHandle(cell)">
            {{ cell }}
          </view>
        </u-index-item>
      </view>
    </u-index-list>
  </view>
</template>

<style lang="scss" scoped>
.city-index-list-page {
  padding-bottom: env(safe-area-inset-bottom);

  .list-cell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 24rpx;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
  }
}
</style>
