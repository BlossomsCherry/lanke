<script>
import PointsMallGoodsItem from "@/pagesU/points-mall/comonents/points-mall-goods-item.vue";

export default {
  name: 'group-goods-swiper-item',
  components: {PointsMallGoodsItem},
  props: {
    tabIndex: { type: Number, default: () => 0 },
    currentIndex: { type: Number, default: () => 0 },
  },
  data() {
    return {
      // 不要自己赋值，而是由api赋值
      goodsList: [],
      // 是否初始化过数据
      firstLoaded: false
    };
  },
  methods: {
    // 获取tab下商品数据
    fetchGoodsList(pageNo, pageSize) {
      // 组件加载时触发此方法、默认会加载, pageNo和pageSize是自动计算好的
      const params = {pageNo, pageSize}
      // TODO 请求接口
      const list = [
        {
          id: 7,
          name: '单月会员卡',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 8,
          name: '且听风吟',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 9,
          name: '飞天漫雪',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 7,
          name: '单月会员卡',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 8,
          name: '且听风吟',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 9,
          name: '飞天漫雪',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 10,
          name: '单月会员卡',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 11,
          name: '且听风吟',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 12,
          name: '飞天漫雪',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 13,
          name: '单月会员卡',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 14,
          name: '且听风吟',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
        {
          id: 15,
          name: '飞天漫雪',
          sellPriceList: [
            {ageing: '14', price: '88', currency: 1}
          ],
          img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
          background: '#43CF7C'
        },
      ]
      // 将请求的结果赋值给z-paging
      this.$refs.paging.complete(list)
      // 修改当前swiper数据为已初始化过
      this.firstLoaded = true
    }
  },
  watch: {
    currentIndex: {
      handler(newVal) {
        // 懒加载，当滑动到当前的tab时，才会去加载数据
        if (newVal === this.tabIndex) {
          // 如果数据未第一次初始化过，则进行第一次加载
          if (!this.firstLoaded) {
            setTimeout(() => {
              this.$refs.paging.reload()
            }, 5)
          }
        }
      },
      immediate: true
    }
  },
}
</script>

<template>
  <!-- z-paging 绑定model, 渲染的数据 -->
  <z-paging ref="paging" v-model="goodsList" @query="fetchGoodsList" :auto="false">
    <view class="goods-grid-wrapper">
      <block v-for="goods in goodsList" :key="goods.id">
        <points-mall-goods-item :goods="goods"/>
      </block>
    </view>
  </z-paging>
</template>

<style lang="scss">
.goods-grid-wrapper {
  margin: 20rpx 40rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20rpx;
  grid-row-gap: 36rpx;
}
</style>
