<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
      <view class="container">
		  <view class="user-list" v-if="userList && userList.length > 0">
		    <block v-for="(item, index) in userList" :key="index" v-if="userList.length > 0">
		      <view @tap.stop.prevent="toSliderUrl(4, item.id)" class="user-item" :data-uid="item.id">
		        <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user_avatar"></image>
		        <view class="infos">
		          <view class="nickname">{{ item.user_name }}</view>
		          <view class="online_time">在线时间：{{ item.online_time }}</view>
		        </view>
		        <view class="unlock" @tap.stop.prevent="unlockUser(item.id, index, 'notlike')">解除</view>
		  			
		      </view>
		    </block>
		    <u-loadmore v-if="loading" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
		  		<view class="page-block-gap" v-if="!isNul" style="height: 150rpx;"></view>
		  </view>
		  <view class="empty-view" v-else>
		    <u-empty text="空" width="300" height="300" text-size="28"/>
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
  computed: {
    config_app_coins_name: {
      get() {
        let that = this;
        if (that.$store.state.config.app.coins) {
          return that.$store.state.config.app.coins.name;
        }
        return '硬币';
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 78,
      userList: [],
      page: 1,
      isLastPage: false,
      loading: false,
      isUser: true,
      type: '',
      userid: ''
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.setData({
      type: options.id
    });
    let title = '用户列表';

    if (options.id == 7) {
      title = '我拉黑的用户';
    } else if (options.id == 8) {
      title = '不喜欢的用户';
    }

    uni.setNavigationBarTitle({
      title: title
    });
    that.getUserList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (that.type == 7) {
      that.updateScene(78, 0, true, false);
    } else if (that.type == 8) {
      that.updateScene(79, 0, true, false);
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      userList: [],
      page: 1,
      isLastPage: false,
      loading: false,
      isUser: true,
    });
    that.getUserList();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page: that.page + 1,
      loading: true
    });
    that.getUserList();
  },

  methods: {
    unlockUser(object_id, index, action) {
      let that = this;
      uni.loading(true);
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/black', {
        object_id: object_id,
        action: action
      }, 'POST').then(function (res) {
        uni.loading(false);
        if (res.status) {
          that.userList.splice(index, 1);
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    // 获取用户
    getUserList() {
      let that = this;
      uni.loading(true);
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/users', {
        type: that.type,
        page: that.page
      }).then(function (res) {
        uni.loading(false);
        let data = res.data;
        let args = {};

        if (data.data && data.data.length > 0) {
          args.loadmore = false;
          args.page = data.current_page;
          args.userList = that.userList.concat(data.data);
          args.isLastPage = false;
        } else {
          args.isLastPage = true;
        }
        that.setData(args);
      });
    }
  }
};
</script>
<style lang="scss">
@import '@/pagesA/mine/follow/follow.scss';

.online_time {
  font-size: 13px;
  @include color(color-lighter-dark);
}

.user-list {
  .user-item {
    .unlock {
      background-color: #f5f5f5;
      color: #8f8f8f;
      border-radius: 50rpx;
      padding: 10rpx 30rpx;
      font-size: 18rpx;
    }
  }
}
</style>
