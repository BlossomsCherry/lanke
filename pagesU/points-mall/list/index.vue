<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import PointsMallSwiper from "@/pagesU/points-mall/list/comonents/points-mall-swiper.vue"
import PointsMallMenuGrid from "@/pagesU/points-mall/list/comonents/points-mall-menu-grid.vue"
import PointsMallGroup from "@/pagesU/points-mall/list/comonents/points-mall-group.vue"

export default {
  components: {
	  myToast,navBar,hoverBall,
	  PointsMallGroup, PointsMallMenuGrid, PointsMallSwiper
  },
  data() {
    return {
      swiperList: [
        { id: 33, img: "https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png", type: 6, target: "/pagesC/video/slide" },
        { id: 34, img: "https://img.mini.minisns.cn/2023/07/20/dd8258eaf55e9623913e0980b410f39e.png", type: 0, target: "1" }
      ],
      menuList: [
        { id: 1, img: "https://img.mini.minisns.cn/2023/07/20/b129b718d9ac2e96c2e5a81fcf92d4f3.svg", name: "功能", target: "/pagesB/menus/menus?id=6", type: "6" },
        { id: 2, img: "https://img.mini.minisns.cn/2023/07/20/d8ef3c3e0d75cac4ae70224e15bd5fbb.svg", name: "素材", target: "56", type: "2" },
        { id: 3, img: "https://img.mini.minisns.cn/2023/07/20/52e75a03c1ad8ab6e9b6b9aa7794dc69.svg", name: "吐槽", target: "55", type: "2" },
        { id: 4, img: "https://img.mini.minisns.cn/2023/07/20/cf43986cd2130e05fbb81ababe249f65.svg", name: "问题", target: "/pages/common/help?type=11", type: "6" },
        { id: 5, img: "https://img.mini.minisns.cn/2023/07/20/d7b1dbd3a69a34b3115685e4fa5c46ca.svg", name: "授权", target: "/pagesB/compare/compare", type: "6" },
        { id: 6, img: "https://img.mini.minisns.cn/2023/08/02/225148b0bf2fbe69aa95c330366e4961.png", name: "好物", target: "/pages/tabbar/shop/shop?back=1", type: "6" },
        { id: 7, img: "https://img.mini.minisns.cn/2023/07/20/19418120f36e11852e0b3aa386094171.svg", name: "建议", target: "46", type: "2" },
        { id: 8, img: "https://img.mini.minisns.cn/2023/07/20/ff9e348ab9d471e3e8096fc1c92d6f3c.svg", name: "测试", target: "45", type: "2" }
      ],

      groupList: [
        {
          id: 1,
          title: '因爱倾心',
          moreLabel: '查看全部商品',
          goodsList: [
            {
              id: 1,
              name: '倾心福袋',
              // 价格，0代表永久
              sellPriceList: [
                { ageing: '7', price: '100', currency: 0 },
                { ageing: '15', price: '200', currency: 1 },
                { ageing: '0', price: '1000', currency: 1 }
              ],
              type: '0', // 商品类型，0 = 头像框，1 = 头衔，2 = 聊天气泡，3 = 会员卡
              tag: '七夕限定',
              img: 'https://oss.kdlf.top/2023/08/17/41eb91b7b6607891d085e19000519a42.png',
              background: '#43CF7C',
              describe: '可在首页、社区、直播间、画猜、说猜、展示，头像挂件不能和头衔挂件同时佩戴，头像挂件不区分性别，男女均可佩戴。'
            },
            {
              id: 2,
              name: '环球宇宙',
              sellPriceList: [
                { ageing: '7', price: '100', currency: 1 }
              ],
              type: '1',
              tag: '精品反厂',
              img: 'https://oss.kdlf.top/2023/08/17/f819c004da727013176514ca4241081b.png',
              background: '#FF8D1A',
              describe: '可在首页、社区、直播间、画猜、说猜、展示，头像挂件不能和头衔挂件同时佩戴，头像挂件不区分性别，男女均可佩戴。'
            },
            {
              id: 3,
              name: '环球宇宙',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              type: '2',
              img: 'https://oss.kdlf.top/2023/08/17/1ff2b99bd180866445d12df7b504f62b.png',
              background: '#7948EA',
              describe: '可在首页、社区、直播间、画猜、说猜、展示，头像挂件不能和头衔挂件同时佩戴，头像挂件不区分性别，男女均可佩戴。'
            }
          ]
        },
        {
          id: 2,
          title: '贵族神秘商店',
          moreLabel: '更多专属商品',
          goodsList: [
            {
              id: 4,
              name: '九尾CP框',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://oss.kdlf.top/2023/08/17/a53b0d6feec9251f7cdc26243518143d.png',
              background: '#FFEB3B'
            },
            {
              id: 5,
              name: '暗夜恶魔',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://oss.kdlf.top/2023/08/17/47a8b84ceac829c95ee71f2fbe754f52.png',
              background: '#43CF7C'
            },
            {
              id: 6,
              name: '极光之夜',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://oss.kdlf.top/2023/08/16/f4c03838894ae00da4ceba394fedd9f7.png',
              background: '#FF8D1A'
            }
          ]
        },
        {
          id: 3,
          title: '会员专区',
          moreLabel: '更多',
          goodsList: [
            {
              id: 7,
              name: '单月会员卡',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
            {
              id: 8,
              name: '且听风吟',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
            {
              id: 9,
              name: '飞天漫雪',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
            {
              id: 7,
              name: '单月会员卡',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
            {
              id: 8,
              name: '且听风吟',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
            {
              id: 9,
              name: '飞天漫雪',
              sellPriceList: [
                { ageing: '14', price: '88', currency: 1 }
              ],
              img: 'https://img.mini.minisns.cn/2023/07/20/0a64d23b5e7d85cd0a201e22191f9944.png',
              background: '#43CF7C'
            },
          ]
        },
      ]
    }
  }
}
</script>

<template>
  <view class="points-mall-list-page">
    <!-- 顶部轮播图 -->
    <points-mall-swiper :list="swiperList"/>

    <!-- 菜单格子 -->
    <points-mall-menu-grid :list="menuList"/>

    <!-- 商品分组列表 -->
    <block v-for="group in groupList" :key="group.id">
      <points-mall-group :group="group"/>
    </block>
  </view>
</template>

<style lang="scss">
@import 'index';
</style>

