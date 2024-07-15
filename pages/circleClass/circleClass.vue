<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
		<navBar :back="true" :home="fph" title="广场" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo">
			</view>
			<!-- #endif -->
		</navBar>
      <view class="container" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
        <view class="nav-box">
          <view class="search-box">
            <image class="icon" src="/static/image/search-line.png"></image>
            <input
                :focus="focusShow"
                @confirm="onSearchConfirm"
                @input="onSearchInput"
                class="input"
                confirmType="search"
                name="keyword"
                placeholder="输入名称搜索圈子"
                placeholderClass="placeholder"
                type="text"
                :value="keyword"
            />
          </view>
          <view class="add-box flex-column" @tap.stop.prevent="addNewCircle" v-if="move_post_id == 0">
            <view class="flex-row" style="margin: auto;height: 30px; line-height: 30px;">
				<i class="mini-icon addimage mini-a-1"></i>
				<view>建圈</view>
			</view>
          </view>
        </view>
        <view class="set-heigth">
          <view class="containers" v-if="keyword == ''">
            <view class="nav_left">
              <scroll-view scrollY class="nav_left_box" :scrollWithAnimation="true">
                <view
                    @tap.stop.prevent="switchRightTab"
                    :class="'nav_left_items ' + (curIndex == index ? 'active' : '')"
                    :data-id="item.id"
                    :data-index="index"
                    v-for="(item, index) in cats"
                    :key="index"
                >
                  {{ item.plate_name }}
                </view>
              </scroll-view>
            </view>
            <view class="nav_right">
              <scroll-view scrollY class="right-items" :scrollTop="scrollTop">
                <view class="loading" v-if="subcatsloading">
                  <view class="spinner">
                    <view class="rect rect1"></view>
                    <view class="rect rect2"></view>
                    <view class="rect rect3"></view>
                    <view class="rect rect4"></view>
                    <view class="rect rect5"></view>
                  </view>
                </view>

                <view v-if="curIndex == 0 && move_post_id == 0 && banner.length > 0" :class="swiperload ? 'swiperload' : 'swiper-container'">
                  <ls-skeleton :loading="swiperload" :skeleton="swiperSkeleton" :animate="true">
                    <swiper
                        circular
                        enableFlex
                        :autoplay="true"
                        @change="changeCurrentIdx"
                        class="banners"
                        :duration="500"
                        interval="5000"
                        nextMargin="30rpx"
                        previousMargin="30rpx"
                    >
                      <swiper-item
                          @tap.stop.prevent="navToBannerLink"
                          class="banner__item"
                          :data-type="banner.slideshow_type"
                          :data-id="banner.target_id"
                          v-for="(banner, index) in banner"
                          :key="banner.id"
                      >
                        <image :class="'banner__image ' + (index === currentIdx ? 'banner__image--active' : '')" mode="aspectFill" :src="banner.poster"></image>
                      </swiper-item>
                    </swiper>
                    <view class="indicators">
                      <view :class="'indicator ' + (index === currentIdx ? 'indicator-active' : '')" v-for="(item, index) in banner" :key="item.link"></view>
                    </view>
                  </ls-skeleton>
                </view>

                <view
                    @tap.stop.prevent="toSliderUrl(2, item.id)" class="area-club"
                    v-if="subcats.length > 0 && !subcatsloading"
                    v-for="(item, index) in subcats"
                    :key="index"
                >
                  <view>
                    <image class="image circle_shape" mode="aspectFill" :src="item.head_portrait"></image>
                  </view>

                  <view class="area-club-info">
                    <view class="area-club-name">
                      {{ item.circle_name }}
                      <block v-if="move_post_id != 0">
                        <view class="move_to_circle" @tap.stop.prevent="movePostTo(item.id)">转移至</view>
                      </block>
                    </view>
                    <view class="area-club-creater">
                      <view class="area-club-creater">
                        <text class="_text">{{ item.posts_count }}条笔记</text>
                        <view class="shu"></view>
                        <text class="_text">{{ item.user_circle_count }}人讨论</text>
                      </view>
                    </view>
                    <view class="mt-6">简介：{{ item.circle_introduce }}</view>
                  </view>

                </view>
                <view class="empty-view" v-if="subcats != null && subcats.length == 0 && !subcatsloading">
                  <u-empty text="空" width="300" height="300" text-size="28"/>
                </view>
              </scroll-view>
            </view>
          </view>
          <view v-else>
            <view class="nav_right">
              <scroll-view scrollY class="right-items" :scrollTop="scrollTop">
                <view class="loading" v-if="keywordSubcatsloading">
                  <view class="spinner">
                    <view class="rect rect1"></view>
                    <view class="rect rect2"></view>
                    <view class="rect rect3"></view>
                    <view class="rect rect4"></view>
                    <view class="rect rect5"></view>
                  </view>
                </view>
                <view
                    @tap.stop.prevent="toSliderUrl(2, item.id)" class="area-club"
                    v-if="keywordSubcats.length > 0 && !keywordSubcatsloading"
                    v-for="(item, index) in keywordSubcats"
                    :key="index"
                >
                  <view>
                    <image class="image s-img circle_shape" mode="aspectFill" :src="item.head_portrait"></image>
                  </view>

                  <view class="area-club-info">
                    <view class="area-club-name w-w">
                      {{ item.circle_name }}
                      <block v-if="move_post_id != 0">
                        <view class="move_to_circle" @tap.stop.prevent="movePostTo(item.id)">转移至</view>
                      </block>
                    </view>
                    <view class="area-club-creater w-w">
                      <view class="area-club-creater">
                        <text class="_text">{{ item.posts_count }}条笔记</text>
                        <view class="shu"></view>
                        <text class="_text">{{ item.user_circle_count }}人讨论</text>
                      </view>
                    </view>
                    <view class="mt-6 w-w">简介：{{ item.circle_introduce }}</view>
                  </view>

                </view>
                <view v-if="keywordSubcats != null && keywordSubcats.length == 0 && !keywordSubcatsloading">
                  <u-empty text="空" width="300" height="300" text-size="28"/>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
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

const mixins = require('@/mixins/circle');
const common = require('@/mixins/common');
const user = require('@/mixins/user');

var options = {};
common(options);
mixins(options);
user(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,lsSkeleton
	  
  },
  computed: {
	contentHieght: {
		get() {
		  let that = this;
		  return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
		}
	}
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 50,
      cats: [
        {
          id: -1,
          plate_name: '最火'
        },
		{
		  id: -2,
		  plate_name: '常用'
		},
        {
          id: 0,
          plate_name: '最新'
        }
      ],

      subcats: [],
      keywordSubcats: [],
      curIndex: 0,
      subcatsloading: true,
      keywordSubcatsloading: true,
      keyword: '',
      banner: [],
      swiperload: true,
      configData: {},
      focusShow: false,
      currentIdx: 0,
      scrollTop: 0,
      swiperSkeleton: [],
      move_post_id: 0
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    that.swiperSkeleton = that.$store.state.skeleton.swiper;
    that.setData({
      focusShow: Boolean(options.focusShow) || false,
      keyword: options.keyword == undefined ? '' : options.keyword
    });
    that.getPlateList();
    that.circleByplateid(-1);
    that.getCirclesBannerList();
    if (options.post_id) {
      that.move_post_id = options.post_id;
      uni.setNavigationBarTitle({
        title: '转移圈子'
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(50, 0);

    let d = new Date();
    let str = '';
    str += d.getFullYear() + '-';
    str += d.getMonth() + 2 + '-';
    str += d.getDate();
    that.setData({
      tomorrowTime: str
    });
  },
  onShareAppMessage: function (res) {
    let that = this;

    return {
      title: '热门圈子 - ' + that.$store.state.config.about.name,
      path: 'pages/circleClass/circleClass' + '?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  onShareTimeline: function (res) {
    let that = this;
    return {
      title: '热门圈子 - ' + that.$store.state.config.about.name,
      query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    // 获取首页轮播图数据
    getCirclesBannerList() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circles/banner').then(function (res) {
        let args = {};
        args.banner = res.data || [];
        args.swiperload = false;
        that.setData(args);
      });
    },
    //轮播图切换
    changeCurrentIdx: function (e) {
      let that = this;
      that.setData({
        currentIdx: e.detail.current
      });
    },

    // 轮播图点击事件
    navToBannerLink: function (e) {
      let type = e.currentTarget.dataset.type;
      let id = e.currentTarget.dataset.id;
      this.toSliderUrl(type, id);
    },

    switchRightTab: function (e) {
      var id = e.target.dataset.id;
      var ids = parseInt(e.target.dataset.index);
      this.setData({
        subcatsloading: true,
        curIndex: ids,
        scrollTop: 0
      });
      this.circleByplateid(id);
    },

    addNewCircle: function () {
      let that = this;
      let res = uni.wen.util.loginNow();

      if (res == true) {
        let userInfo = that.$store.state.userInfo;
        uni.wen.toUrl(6, '/pagesA/circle/creat/index?type=0', null);
      }
    },

    onSearchConfirm(e) {
      let that = this;
      that.setData({
        keyword: e.detail.value
      });
      that.circleSearch(e.detail.value);
    },

    onSearchInput(e) {
      let that = this;
      that.setData({
        keyword: e.detail.value
      });
      that.circleSearch(e.detail.value);
    },
    movePostTo(circle_id) {
      let that = this;
      uni.showModal({
        title: '确认转移到该圈？',
        success: function (res) {
          if (res.confirm) {
            uni.wen.util.request(
              uni.wen.api.ApiRootUrl + 'posts/move', {
                  posts_id: that.move_post_id,
                  circle_id: circle_id
                },
                'POST'
            ).then(function (res) {
              if (res.status) {
                uni.showToast({
                  title: '转移成功，请手动刷新',
                  icon: 'none',
                  duration: 1500
                });
                setTimeout(function () {
                  uni.wen.toUrl(-2, 0, null);
                }, 500);
              } else {
                uni.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 1500
                });
              }
              uni.$store.commit('popopChange', false);
            });
          } else if (res.cancel) {

          }
        }
      })
    }
  }
};
</script>
<style lang="scss">
@import './circleClass.scss';
</style>
