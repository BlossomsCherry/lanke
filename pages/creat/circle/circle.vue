<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="container mini-page-body">
      <view class="nav-box">
        <view class="search-box">
          <image class="icon" src="/static/image/search-line.png"></image>
          <input
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
        <view class="add-box" @tap="onSearchConfirm">搜索</view>
      </view>
      <view class="set-heigth">
        <view class="containers" v-if="keyword == ''">
          <view class="nav_left">
            <scroll-view :show-scrollbar="false" scrollY class="nav_left_box" :scrollWithAnimation="true">
              <view
                  @tap="switchRightTab"
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
            <scroll-view :show-scrollbar="false" scrollY class="right-items" :scrollTop="scrollTop">
              <view class="loading" v-if="subcatsloading">
                <view class="spinner">
                  <view class="rect rect1"></view>
                  <view class="rect rect2"></view>
                  <view class="rect rect3"></view>
                  <view class="rect rect4"></view>
                  <view class="rect rect5"></view>
                </view>
              </view>
              <view
                  @tap.stop.prevent="toSliderUrl(2, item.id + '&civ=' + item.can_i_visit)" class="area-club"
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
				
				<block v-if="item.can_i_visit == 2">
					<view class="choice-box" @tap.stop.prevent="toSliderUrl(2, item.id + '&civ=' + item.can_i_visit)">无权限</view>
				</block>
				<block v-else>
					<view class="choice-box" @tap.stop.prevent="choiceTap(
					{id: item.id,
					circle_name: item.circle_name,
					is_publish_follow: item.is_publish_follow,
					is_publish_vip: item.is_publish_vip,
					is_publish_authentication: item.is_publish_authentication,
					is_publish_admin: item.is_publish_admin,
					is_publish_pay: item.is_publish_pay,
					publish_pay_num: item.publish_pay_num,
					publish_pay_credit: item.publish_pay_credit}
					)">选择</view>
				</block>
                
              </view>
              <view class="empty-view" v-if="subcats != null && subcats.length == 0 && !subcatsloading">
                <u-empty text="空" width="300" height="300" text-size="28"/>
              </view>
            </scroll-view>
          </view>
        </view>
        <view v-else>
          <view class="nav_right">
            <scroll-view :show-scrollbar="false" scrollY class="right-items" :scrollTop="scrollTop">
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

                <view class="choice-box" @tap.stop.prevent="choiceTap({id: item.id,
				circle_name: item.circle_name,
				is_publish_follow: item.is_publish_follow,
				is_publish_vip: item.is_publish_vip,
				is_publish_authentication: item.is_publish_authentication,
				is_publish_admin: item.is_publish_admin,
				is_publish_pay: item.is_publish_pay,
				publish_pay_num: item.publish_pay_num,
				publish_pay_credit: item.publish_pay_credit})">选择</view>
              </view>
              <view v-if="keywordSubcats != null && keywordSubcats.length == 0 && !keywordSubcatsloading">
                <u-empty text="空" width="300" height="300" text-size="28"/>
              </view>
            </scroll-view>
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

const mixins = require('@/mixins/circle');
var options = {};
mixins(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 22,
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
      scrollTop: 0
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
	
    that.globalOnloadProcess(options);
    that.getPlateList();
    that.circleByplateid(-1);
	
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(22, 0);
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
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

    choiceTap(item){
		  uni.setStorageSync('userSelectedCircle', item);
		  uni.wen.toUrl(-2, 0, null);
    },


  }
};
</script>
<style lang="scss">
@import './circle.scss';
</style>
