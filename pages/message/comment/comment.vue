<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body container">
		<navBar :back="true" :home="fph" title="评论和充电" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
      <block v-if="messageList && messageList.length > 0">
        <view class="item-container" v-for="(item, index) in messageList" :key="index">
          <view class="item">
            <image class="item-avatar" mode="aspectFill" :src="item.icon"></image>
            <view class="item-middle">
              <text class="item-middle-name">{{ item.title }}</text>
              <mp-html :content="item.content" class="item-middle-content"/>
              <view class="see-posts" @tap.stop.prevent="toSliderUrl(1, item.posts_id, null)" v-if="item.posts_id && item.posts_id > 0">
                <i class="mini-icon mini-yuzhouxingqiu-01"></i>
                查看笔记
              </view>
              <text class="item-middle-time">{{ item.created_at }}</text>
            </view>
            <view v-if="item.is_read == 0" class="dian"></view>
          </view>
        </view>
        <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
      </block>
      <block v-else>
        <u-empty class="empty-view" text="空" width="300" height="300" text-size="28" />
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
const common = require('@/mixins/common');

var options = {};
mixins(options);
common(options);
export default {
  components: {
  	myToast,navBar,hoverBall,mpHtml
  },
  mixins: [{ methods: options }],
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 68,
      messageList: [],
      page: 1,
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
    that.getDetailsMessages(2);
  },
  onShow: function () {
    let that = this;
    that.updateScene(68, 0);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.readMessages(2);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      messageList: [],
      page: 1,
      isNull: false,
      loadmoreShow: false,
      isLastPage: false
    })
    that.getDetailsMessages(2);
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
    that.getDetailsMessages(2);
  },
  methods: {}
};
</script>
<style lang="scss">
@import './comment.scss';
</style>
