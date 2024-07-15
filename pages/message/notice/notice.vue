<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body container">
		<navBar :back="true" :home="fph" title="收到的通知" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
      <block v-if="messageList && messageList.length > 0">
        <view class="item-container" v-for="(item, index) in messageList" :key="index">
          <view @tap.stop.prevent="onItemClick" :data-type="item.notice_type" class="item">
            <image class="item-avatar" :src="item.icon" mode="widthFix"></image>
            <view class="item-middle">
              <text class="item-middle-name">{{ item.title }}</text>
              <mp-html :content="item.content" class="item-middle-content"/>
              <text class="item-middle-time">{{ item.created_at }}</text>
            </view>
            <view v-if="item.is_read == 0" class="dian"></view>
          </view>
        </view>
        <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
      </block>
      <block v-else>
        <u-empty text="空" width="300" height="300" text-size="28" />
      </block>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

const mixins = require('@/mixins/message');
var options = {};
mixins(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,mpHtml
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 66,
      page: 1,
      messageList: [],
      loadmoreShow: false,
      isLastPage: false
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.getDetailsMessages(0);
  },
  onShow: function () {
    let that = this;
    that.updateScene(66, 0);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.readMessages(0);
  },
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      messageList: [],
      page: 1,
      isNull: false,
      loadmoreShow: false,
      isLastPage: false
    })
    that.getDetailsMessages(0);
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 500);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmoreShow: true,
      page: that.page + 1
    });
    that.getDetailsMessages(0);
  },
  methods: {
    onItemClick(e) {
      let type = e.currentTarget.dataset.type;

      if (type == 8) {
        uni.wen.toUrl(6, '/pagesA/shop/order/order?type=3', null);
      }
    }
  }
};
</script>
<style lang="scss">
@import './notice.scss';
</style>
