<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import PointsMallGoodsItem from "@/pagesU/points-mall/comonents/points-mall-goods-item.vue";
import GroupGoodsSwiperItem from "@/pagesU/points-mall/group-goods-list/comonents/group-goods-swiper-item.vue";

export default {
  components: {
	  myToast,navBar,hoverBall,
	  GroupGoodsSwiperItem, PointsMallGoodsItem
  },
  data() {
    return {
      tabCurrent: 0, // 当前tab索引
      swiperCurrent: 0, // 当前swiper索引

      groupTabList: []
    };
  },
  methods: {
    // swiper切换时事件
    swiperChangeHandle(e) {
      this.tabCurrent = e.detail.current
    },
    // tab标签切换时事件
    tabChangeHandle(e) {
      this.swiperCurrent = e.index
    },
    // 获取tab标签列表
    fetchGroupTabList() {
      this.groupTabList = [
        {id: 1, name: '新品道具'},
        {id: 2, name: '头像框'},
        {id: 3, name: 'MOYO秀'},
        {id: 4, name: '游戏热卖'},
        {id: 5, name: '礼物'},
      ]
    }
  },
  created() {
    // 获取tab标签列表
    this.fetchGroupTabList()
  },
}
</script>

<template>
  <z-paging-swiper>
    <view slot="top">
      <u-tabs :list="groupTabList" :current="tabCurrent" @change="tabChangeHandle"/>
    </view>

    <swiper class="swiper" :current="swiperCurrent" @change="swiperChangeHandle">
      <swiper-item class="swiper-item" v-for="item in groupTabList" :key="item.id">
        <group-goods-swiper-item :tabindex="tabCurrent" :currentIndex="swiperCurrent"/>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>

<style lang="scss" scoped>
.swiper {
  height: 100%;
}
</style>
