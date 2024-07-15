<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
      <view class="section">
        <ls-skeleton :loading="topicload" :skeleton="waterfallSkeleton" :animate="true" :scene="90734">
          <block v-if="posts.length > 0">
            <l-water-flow comName="product" :waterData="postWaterData" :column-gap="8" :scene="39" />
          </block>
          <block v-else>
            <u-empty text="空" width="300" height="300" text-size="28"/>
          </block>
        </ls-skeleton>
        <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast unicom-id="mytotast_80_0" ref="mytoast" :isdistance="true" :toast="mytoast_data" @postfeedback="postFeedback"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


import lWaterFlow from '@/linui/water-flow/index';
import product from '@/components/common/water/product/index';

const common = require('@/mixins/common');
const forum = require('@/mixins/forum');
var options = {};
common(options);
forum(options);
export default {

  mixins: [{ methods: options }],
  components: { 
	  myToast,navBar,hoverBall,
	  lWaterFlow, product
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 80,
      page: 1,
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,
      postWaterData: {
        e: 0,
        data: []
      },
    }
  },
  onShow: function () {
    let that = this;
    that.updateScene(80, 0, true);
  },
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.waterfallSkeleton = that.$store.state.skeleton.waterfall;
    that.getPostsUserBlack();
  },
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1,
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,
      postWaterData: {
        e: 1,
        data: []
      },
    });
    that.getPostsUserBlack();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 200);

  },
  onReachBottom: function () {
    let that = this;
    if (!that.isLastPage) {
      that.setData({
        loadmoreShow: true,
        isLastPage: false,
        page: that.page + 1
      });
      that.getPostsUserBlack();
    }
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    getPostsUserBlack() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/user/black', {
        page: that.page,
      }).then(function (res) {
        if (res.status) {
			
			if(res.data.current_page != that.page){
				return false;
			}

			let data = res.data;
			let args = {};

          if (data.data && data.data.length > 0) {
            args.posts = that.posts.concat(data.data);
            args.page = data.current_page;
            if (data.data.length == 10) {
              args.loadmoreShow = false;
              args.isLastPage = false;
            } else {
              args.loadmoreShow = true;
              args.isLastPage = true;
            }
          } else {
            args.loadmoreShow = true;
            args.isLastPage = true;
          }

          args.topicload = false;
          that.setData(args);

          if (data.data && data.data.length > 0) {
            that.setData({
              postWaterData: {
                e: 0,
                data: data.data
              }
            });
          }
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
