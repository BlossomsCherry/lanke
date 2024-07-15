<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
		
		<navBar :back="true" :home="fph" title="消费记录" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
      <ls-skeleton :loading="loading" :skeleton="orderListSkeleton" :animate="true">
        <view v-if="orderList.length > 0" class="container">
          <view class="box" v-for="(item, index) in orderList" :key="item.id">
            <view class="user-box" v-if="isOfficial > 0 && type == 'all' " @tap.stop.prevent="toSliderUrl(4, item.user_id)">
              <image class="avatar" :src="item.user.user_avatar"></image>
              <view class="name">{{ item.user.user_name }}</view>
            </view>
            <view class="box-top">
              单号：{{ item.order_number }}
              <view class="copy" @tap="copyTap" :data-no="item.order_number">复制</view>
            </view>

            <view class="box-center">
              <view class="box-center-left">
                <view class="title">{{ item.type_content.title }}</view>
                <view class="details">{{ item.type_content.details }}</view>
                <view class="date">{{ item.created_at }}</view>
              </view>
              <view class="box-center-right">
                ￥
                <u-count-to :endVal="item.order_pay_price" :decimals="2"
                    :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"
                    fontSize="48"
                ></u-count-to>
                <view class="price-text">实际支付</view>
              </view>
            </view>

            <view class="box-bottom" v-if=" item.order_type != 1 && item.order_type != 3 ">
              <view class="see-posts" @tap.stop.prevent="toSliderUrl(1, item.posts_id)">
                <i class="mini-icon mini-yuzhouxingqiu-01"></i>
                查看笔记
              </view>
            </view>
          </view>
          <u-loadmore v-if="loadmore" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
        </view>
        <view v-else class="empty-view">
          <u-empty text="空" width="300" height="300" text-size="28"/>
        </view>
      </ls-skeleton>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
var options = {};

common(options);
mixins(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,lsSkeleton
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 32,
      loading: true,
      loadmore: false,
      isLastPage: false,
      type: 'mine',
      page: 1,
      orderList: [],
      orderListSkeleton: []
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    if (that.$store.state.userInfo.is_official) {
      if (options.type == 'all') {
        that.type = 'all';
        uni.setNavigationBarTitle({
          title: "全站订单记录"
        });
      }
    }
    that.orderListSkeleton = that.$store.state.skeleton.orderList;

    that.myOrder();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(32, 0);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      loading: true,
      loadmore: false,
      isLastPage: false,
      page: 1,
      orderList: []
    });
    that.myOrder();
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmore: true,
      isLastPage: false,
      page: that.page + 1
    });
    that.myOrder();
  },
  methods: {
    copyTap(e) {
      uni.setClipboardData({
        data: e.currentTarget.dataset.no
      });
    },

  }
};
</script>
<style lang="scss">
@import './order.scss';
</style>
