<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="pageTitle" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
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
		      <block v-for="(item, index) in userList" :key="item.id" v-if="userList.length > 0">
		        <view @tap="toSliderUrl(4, item.user.id)" class="user-item">
		          <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user.user_avatar"></image>
		          <view class="infos">
		            <view class="nickname">{{ item.user.user_name }}</view>
		          </view>
		          <block v-if="isUser">
		            <button
		                v-if="type == 0 && item.is_together_follow"
		                @tap.stop.prevent="userActionFollow"
		                :data-userid="item.user.id"
		                :data-index="index"
		                class="follow-btn follow"
		            >
		              互相关注
		            </button>
		            <button
		                v-if="type == 1"
		                @tap.stop.prevent="userActionFollow"
		                :data-userid="item.user.id"
		                :data-index="index"
		                :class="'follow-btn ' + (item.is_together_follow ? 'follow' : '')"
		            >
		              {{ item.is_together_follow ? '互相关注' : '关注' }}
		            </button>
		          </block>
		        </view>
		      </block>
		      <u-loadmore v-if="loading" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
		    </view>
		    <view class="empty-view" v-if="userList.length <= 0">
		      <u-empty text="快去关注你喜欢的TA吧" width="300" height="300" textSize="28"/>
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
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
	  pageTitle: '',
      userList: [],
      page: 1,
      isLastPage: false,
      loading: false,
      isUser: true,
      loadmore: true,
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

    if (options.id == 0) {
      if (options.userid != '' && options.userid != undefined) {
        that.setData({
          userid: options.userid,
          isUser: false
        });
		that.pageTitle = 'TA关注的';
      } else {
		that.pageTitle = '我关注的';
      }
    } else {
      if (options.userid != '' && options.userid != undefined) {
        that.setData({
          userid: options.userid,
          isUser: false
        });
        that.pageTitle = '关注TA的';
      } else {
        that.pageTitle = '关注我的';
      }
    }

    that.followUserList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      userList: [],
      page: 1,
      isLastPage: false,
      loading: false,
      isUser: true,
      loadmore: true
    });
    this.followUserList();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.page + 1,
      loading: true
    });
    this.followUserList();
  },
  methods: {}
};
</script>
<style lang="scss">
@import './follow.scss';
</style>
