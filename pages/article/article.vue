<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view style="height:100%" class="mini-page-body">
	<u-sticky offset-top="0" :customNavHeight="0">
		<view class="collapse-box">
		  <scroll-view :show-scrollbar="false" enable-flex="true" scrollX enableFlex="enable-flex"
		               enhanced="enhanced" scrollWithAnimation="scroll-with-animation">
					<view class="tags-wrapper">
					  <text @tap.stop.prevent="changeTab"
					        :class="'tag-item ' + (index === activeTagId ? 'tag-item-active' : '')" :data-index="index"
					        :id="tag.id" v-for="(tag, index) in categoryMap" :key="index">
					    #{{ tag.tags_name }}
					  </text>
					</view>
		  </scroll-view>
		</view>
	</u-sticky>


      <view class="section">
        <ls-skeleton :loading="topicload" :skeleton="waterfallSkeleton" :animate="true" :scene="90734">
          <block v-if="posts.length > 0">
            <l-water-flow comName="product" :waterData="postWaterData" :column-gap="8" :scene="39"/>
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </ls-skeleton>
        <u-loadmore v-if="loadmoreShow" :status="loadingShow ? 'nomore' : 'loading'" nomoreText="── THE END ──"
                    size="28" color="#989898"/>
      </view>
      <view @tap.stop.prevent="refreshEvent" class="refresh">
        <i class="mini-icon mini-xunhuan"></i>
      </view>
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


import lWaterFlow from '@/linui/water-flow/index';
import product from '@/components/common/water/product/index';

const mixins = require('@/mixins/common');

var options = {}
mixins(options);
export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,lsSkeleton,
	
    lWaterFlow,
    product,
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 39,
      categoryMap: [{
        tags_name: '热门',
        id: 0
      }],

      tagid: 0,
      activeTagId: 0,
      page: 1,
      posts: [],
      collapse: false,
      loadmoreShow: false,
      loadingShow: false,
      topicload: true,
      empty: false,

      tag: {
        id: '',
        tags_name: ''
      },
      waterfallSkeleton: [],
      postWaterData: {
        e: 0,
        data: []
      }
    };
  },
  computed: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.waterfallSkeleton = that.$store.state.skeleton.waterfall;
    that.tagsHot();
    that.postsTage();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(39, 0);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      loadmoreShow: false,
      loadingShow: false,
      topicload: true,
      empty: true,
      page: 1,
      posts: [],
      postWaterData: {
        e: 1,
        data: []
      },
    });
    that.postsTage();
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmoreShow: true,
      page: that.page + 1,
      empty: false
    });
    that.postsTage();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {},
  methods: {
    // 热门话题接口
    tagsHot() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'tags/hot').then(function (res) {
        let args = {};
        args.categoryMap = that.categoryMap.concat(res.data);
        that.setData(args);
      });
    },

    //菜单切换
    changeTab: function (e) {
      console.log("changeTab", e.currentTarget)
      let that = this;
      let index = e.currentTarget.dataset.index;
      let tagid = e.currentTarget.id;
      that.setData({
        activeTagId: index,
        tagid: tagid,
        posts: [],
        page: 1,
        loadmoreShow: false,
        loadingShow: false,
        topicload: true,
        empty: true
      });
      that.postsTage();
    },

    //刷新方法
    refreshEvent() {
      // this.onPullDownRefresh();
      uni.startPullDownRefresh()
    }
  }
};
</script>
<style lang="scss" scoped>
.l-title-class {
  padding: 0 !important;
  height: 108rpx !important;
}

.collapse-title {
  width: 90rpx;
  height: 108rpx;
  font-weight: 900 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags-wrapper {
  display: flex;
  height: 108rpx;
  overflow: auto;
  flex-wrap: nowrap;
  padding: 14rpx 0 24rpx;
}

.collapse_words {
  max-height: 300rpx;
}

.collapse-boby-box {
  display: flex;
  flex: row;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 24rpx;
  max-height: 300rpx;
}

.tag-item-box {
  flex-shrink: 0;
  height: 70rpx;
  align-items: center;
  justify-content: center;
  @include color(color-light-dark);
  font-size: $uni-font-size-sm;
  font-weight: bold;
  padding: 0 32rpx;
  border-radius: 500rpx;
  margin-right: 24rpx;
  margin-bottom: 24rpx;
  @include background_color(page-box-item-background-color);
}

.tag-item-box,
.tag-item,
.tags-wrapper {
  display: flex;
  box-sizing: border-box;
}

.tag-item {
  flex-shrink: 0;
  height: 70rpx;
  align-items: center;
  justify-content: center;
  @include color(color-light-dark);
  font-size: $uni-font-size-sm;
  font-weight: bold;
  padding: 0 32rpx;
  border-radius: $uni-border-radius-lg-est;
  margin-right: 24rpx;
  @include background_color(page-box-item-background-color);
}

.tag-item:first-of-type {
  margin-left: 15rpx;
}

.tag-item-active {
	@include background_color(follow-background-color);
	@include color(color-follow-font);
}

.section {
  margin: 0 auto;
}
</style>
