<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <navBar :back="true" :home="fph" :background="'rgba(255, 255, 255, ' + navbarTrans + ')'" :color="'rgb(' + color + ')'" title="SHOP分类" />
      <view class="search-box">
        <image class="icon" src="/static/image/search-line.png"></image>
        <input
            :focus="focusShow"
            @confirm="onSearchConfirm"
            @input="onSearchConfirm"
            class="input"
            confirmType="search"
            name="keyword"
            placeholder="Search"
            placeholderClass="placeholder"
            type="text"
            :value="keyword"
        />
		<i  v-if="keyword" class="del mini-icon mini-chacha" @tap="delKeyword"></i>
      </view>

      <view class="container">
        <u-sticky :offsetTop="0">
          <view class="nav">
            <view @tap="switchRightTab" :class="'nav_items ' + (curIdx == item.id ? 'active' : '')" :data-id="item.id" v-for="(item, index) in cats" :key="index">
              {{ item.name }}
            </view>
            <view style="width: 15px; flex-shrink: 0; height: 1px"></view>
          </view>
        </u-sticky>

        <view class="body">
          <ls-skeleton
              :loading="loading"
              :rows="4"
              :paragraph="true"
              :title="false"
              :rows-width="['670rpx', '670rpx', '670rpx']"
              :rows-height="['400rpx', '400rpx', '400rpx']"
          >
            <view style="padding-bottom: 30px">
              <view class="shop-box" @tap.stop.prevent="toSliderUrl(3, item.id)" v-for="(item, index) in goodsList" :key="item.id">
                <swiper :autoplay="true" :circular="true" interval="3000" :indicator-dots="true" easing-function="easeOutCubic" class="swiper">
                  <swiper-item v-for="(img, index1) in item.pic" :key="img.id">
                    <image class="shop-box-cover" mode="aspectFill" :src="img"/>
                  </swiper-item>
                </swiper>

                <view class="shop-info">
                  <view class="shop-info-tag">
                    <text class="tag" v-for="(it, index1) in item.tag" :key="it.id">{{ it }}</text>
                  </view>
                  <view class="shop-info-title">{{ item.name }}</view>
                  <view class="shop-info-duce">{{ item.intro }}</view>
                  <view class="info-bur">
					  
					<block v-if="item.credit_type == 1">
						<view class="shop-info-price-box">
							<view class="price">
								<view>
									￥<u-count-to
										:endVal="item.vip_price"
										:decimals="2"
										:bold="true"
										:color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
										fontSize="32"
									></u-count-to>
								</view>
								<view class="price-text">会员价</view>
							</view>
							<view class="original-price">¥{{ item.price }}</view>
						</view>
					</block>
					<block v-else>
						<view class="shop-info-price-box gold">
							<view class="price">
								<view class="flex-row">
									<view class="icon flex-column" style="justify-content: center;">
										<i class="gold-color mini-icon mini-Gold_coin_01"></i>
									</view>
									<text class="_text">{{ item.vip_price }}</text>
								</view>
								<view class="price-text">会员价</view>
							</view>
							<view class="original-price flex-row">
								<view class="icon flex-column" style="justify-content: center;">
									<i class="mini-icon mini-Gold_coin_01"></i>
								</view>
								<text class="_text">{{ item.price }}</text>
							</view>
						</view>
					</block>  

                    <view class="info-img">
					  <i class="mini-icon mini-shangpin1 _image"></i>
                    </view>
                  </view>
                </view>
              </view>
              <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
            </view>
            <view v-if="isEmpty">
              <u-empty text="空" width="300" height="300" text-size="28"/>
            </view>
          </ls-skeleton>
        </view>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data" />
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

const shop = require('@/mixins/shop');
const common = require('@/mixins/common');
var options = {};

shop(options);
common(options);
export default {
  mixins: [{ methods: options }],

  components: {
	  myToast,navBar,hoverBall,lsSkeleton
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 35,
      focusShow: false,
      keyword: '',

      navbarTrans: 0,
      color: '0,0,0',
      iconTheme: 'white',

      cats: [
        {
          id: -1,
          name: '上新'
        },
        {
          id: 0,
          name: '热销榜单'
        }
      ],

      curIdx: -1,
      goodsList: [],
      page: 1,
      loading: true,
      loadmoreShow: false,
      isLastPage: false,
      isEmpty: false,
      scrollTop: 0,

      img: {
        id: ''
      },

      it: {
        id: ''
      }
    };
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    that.focusShow = options.focusShow || false;
    that.curIdx = options.id;

    that.getShopClassify();
    that.getShopClassifyGoodsList();
  },
  onShow: function () {
    let that = this;
    that.updateScene(35, 0);
  },
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      loading: true,
      loadmoreShow: false,
      isLastPage: false,
      isEmpty: false,
      page: 1,
      goodsList: []
    });
    that.getShopClassifyGoodsList();
    uni.stopPullDownRefresh();
  },
  onPageScroll: function onPageScroll(e) {
    let that = this;
    var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

    if (trans > 1 && that.navbarTrans > 1) {
      return false;
    }

    var frontColor = '#ffffff';
    var backgroundColor = '#000000';
    var iconTheme = that.iconTheme;


    if (trans <= 0) {
      frontColor = '#ffffff';
      backgroundColor = '#000000';
      iconTheme = 'white';
    } else if (trans >= 0.4) {
      frontColor = '#000000';
      backgroundColor = '#ffffff';
      iconTheme = 'black';
    }

    that.setData({
      navbarTrans: trans,
      iconTheme: iconTheme,
    });

    uni.setNavigationBarColor({
      frontColor: frontColor,
      backgroundColor: frontColor,
      animation: {
        duration: 400,
        timingFunc: 'easeIn',
      }
    });
    that.scrollTop = e.scrollTop;
  },
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmoreShow: true,
      page: that.page + 1
    });

    if (that.keyword) {
      that.getShopGoodsSearch();
    } else {
      that.getShopClassifyGoodsList();
    }
  },
  onShareAppMessage: function (res) {},
  methods: {
    delKeyword() {
      let that = this;
      that.setData({
        keyword: '',
        loading: true,
        loadmoreShow: false,
        isLastPage: false,
        isEmpty: false,
        page: 1,
        goodsList: []
      });
      that.getShopClassifyGoodsList();
    },

    onSearchConfirm(e) {
      let that = this;
      that.setData({
        keyword: e.detail.value,
        loading: true,
        loadmoreShow: false,
        isLastPage: false,
        isEmpty: false,
        page: 1,
        goodsList: []
      });
      that.getShopGoodsSearch();
    },

    switchRightTab: function (e) {
      let that = this;
      that.setData({
        curIdx: e.target.dataset.id,
        loading: true,
        loadmoreShow: false,
        isLastPage: false,
        isEmpty: false,
        page: 1,
        goodsList: []
      });
      that.getShopClassifyGoodsList();
    },
  }
};
</script>
<style lang="scss">
@import './goods-classify.scss';
</style>
