<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
		<navBar :back="true" :home="fph" title="我的马甲" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
      <view class="container">
		  <view class="loading" v-if="loadmore">
		    <view class="spinner">
		      <view class="rect rect1"></view>
		      <view class="rect rect2"></view>
		      <view class="rect rect3"></view>
		      <view class="rect rect4"></view>
		      <view class="rect rect5"></view>
		    </view>
		  </view>
		  <block v-else>
		    <view class="user-list">
		      <block v-for="(item, index) in userList" :key="item.id">
		        <view class="user-item" :data-uid="item.id">
		          <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user_avatar"></image>
		          <view class="infos">
		            <view class="nickname">{{ item.user_name }}</view>
		          </view>
		          <block>
		            <button
		                @tap.stop.prevent="adminPlay(item.id)" :class="'follow-btn' + ' ' + (item.id == myUserInfo.id ? 'current' : '')">
		              {{ item.id == myUserInfo.id ? '去掉身份' : '穿戴身份' }}
		            </button>
		          </block>
		        </view>
		      </block>
		      <u-loadmore v-if="loading" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
		    </view>
		    <view class="empty-view" v-if="userList.length <= 0">
		      <u-empty text="空" width="300" height="300" text-size="28"/>
		    </view>
		  </block>
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

//预览图片
const mixins = require('@/mixins/user');
const common = require('@/mixins/common');

var options = {};

mixins(options);
common(options);
export default {
  mixins: [{ methods: options }],
  components: {
	  myToast,navBar,hoverBall,
  },
  computed: {},
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 56,
      userList: [],
      page: 1,
      isLastPage: false,
      loading: false,
      loadmore: true,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.init();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(56, 0, true, true);
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    init() {
      let that = this;
      let args = {};

      args.isLastPage = true;
      args.userList = that.$store.state.config.admin.played;
      args.loadmore = false;
      that.setData(args);
    },
    adminPlay(id) {
      let that = this;
      if (!id) {
        return false;
      }
      if (that.$store.state.userInfo.id == id) {
        uni.removeStorageSync('played');
        uni.$store.commit('updatePlayed', null);

        uni.wen.util.updateUserInfo();

        uni.showToast({
          title: '已经去掉身份'
        })

        if (that.$store.state.scene_history && that.$store.state.scene_history[that.$store.state.scene_history.length - 1] == 27) {
          setTimeout(function () {
            uni.reLaunch({
              url: '/pages/tabbar/index/index'
            })
          }, 500);
        } else {
          setTimeout(function () {
            uni.wen.toUrl(-2, 0, null);
          }, 500);
        }
        return false;
      } else {
        uni.setStorageSync('played', id); //存储用户信息
        uni.$store.commit('updatePlayed', id);

        uni.wen.util.updateUserInfo();
        let device = '';
        // #ifdef APP
        device = 'app';
        // #endif
        // #ifdef MP
        device = 'mp';
        // #endif
        // #ifdef H5
        device = 'h5';
        // #endif
        uni.sendSocketMessage({
          data: '{"mode":"bind","token":"' + uni.$store.state.token + '", "played": "' + uni.$store.state.played + '", "device": "' + device + '"}'
        });
        uni.showToast({
          title: '穿戴身份成功',
          icon: 'none'
        })

        if (that.$store.state.scene_history && that.$store.state.scene_history[that.$store.state.scene_history.length - 1] == 27) {
          setTimeout(function () {
            uni.reLaunch({
              url: '/pages/tabbar/index/index'
            })
          }, 500);
        } else {
          setTimeout(function () {
            uni.wen.toUrl(-2, 0, null);
          }, 500);
        }
      }


    }
  }
};
</script>
<style lang="scss">
@import '@/pagesA/mine/follow/follow.scss';

.user-item .follow-btn.current {
  color: #333;
  border-color: #333;
}
</style>
