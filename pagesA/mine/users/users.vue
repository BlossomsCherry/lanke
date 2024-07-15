<template>
  <view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
		<navBar :back="true" :home="fph" :title="pageTitle" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
      <view class="container">
		  <view class="user-list" v-if="userList && userList.length > 0">
		    <block v-for="(item, index) in userList" :key="index" v-if="userList.length > 0">
		      <view @tap.stop.prevent="toSliderUrl(4, item.id)" class="user-item" :data-uid="item.id">
		        <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user_avatar"></image>
		        <view class="infos">
		          <view class="nickname">{{ item.user_name }}</view>
		          <block v-if="type == 1 || type == 2 || type == 3">
		            <view class="online_time">{{ item.online_time + '  ' + (item.device ? item.device : '') }}在线</view>
		          </block>
		          <block v-if="type == 4">
		            <view class="online_time">余额：{{ item.balance }}</view>
		          </block>
		          <block v-if="type == 5">
		            <view class="online_time">{{ config_app_coins_name + '：' + item.coins }}</view>
		          </block>
				  <block v-else>
					  <view class="online_time" v-if="item.desc_tip" @tap.stop.prevent="toSliderUrl(34, item.collect_object_id)">{{ item.desc_tip }}</view>
				  </block>
		        </view>
		      </view>
		    </block>
		    <u-loadmore v-if="loadmore" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" :line="false" color="#989898"/>
		  </view>
		  <view class="empty-view" v-else>
		    <u-empty text="空" width="300" height="300" text-size="28"/>
		  </view>
	  </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data" />
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
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 55,
	  pageTitle: '用户列表',
      userList: [],
      page: 1,
      isLastPage: false,
      loadmore: false,
      isUser: true,
      type: '',
      userid: '',
	  object_id: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
	
    that.setData({
      type: options.id,
	  object_id: options.object_id > 0 ? options.object_id : 0
    });

    if (options.id == 1) {
      that.setData({
        isUser: false,
		pageTitle: '最近注册'
      });
    } else if (options.id == 2) {
      that.setData({
        isUser: false,
		pageTitle: '最近在线'
      });
    } else if (options.id == 3) {
      that.setData({
        isUser: false,
		pageTitle: '今日注册'
      });
    } else if (options.id == 4) {
      that.setData({
        isUser: false,
		pageTitle: '余额排行'
      });
    } else if (options.id == 5) {
      that.setData({
        isUser: false,
		pageTitle: that.$store.state.config.app.coins.name + '排行'
      });
    } else if (options.id == 6) {

    } else if (options.id == 7) {

    } else if (options.id == 8) {

    } else if (options.id == 9) {

    } else if (options.id == 10) {

    } else if (options.id == 11) {

    } else if (options.id == 13) {
		that.setData({
		  isUser: false,
		  pageTitle: '俱乐部粉丝'
		});
	} else if (options.id == 14) {
		that.setData({
		  isUser: false,
		  pageTitle: '圈子粉丝'
		});
	} else if (options.id == 15) {
		that.setData({
		  isUser: false,
		  pageTitle: '收藏过俱乐部活动'
		});
	} else if (options.id == 16) {
		that.setData({
		  isUser: false,
		  pageTitle: '参加过俱乐部活动'
		});
	}

    that.getUserList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(55, 0, true, false);
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
      loadmore: false,
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
	if(!that.isLastPage && that.userList.length > 0){
		that.setData({
		  page: that.page + 1,
		  loadmore: true
		});
		that.getUserList();
	}
    
  },

  methods: {
    // 获取用户
    getUserList() {
      let that = this;
	  if(that.page == 1){
		uni.loading(true);
	  }
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/users', {
        type: that.type,
        page: that.page,
		object_id: that.object_id
      }).then(function (res) {
		  
		if(that.page == 1){
			uni.loading(false);
		}
		
		if(res.data.current_page != that.page){
			return false;
		}
		
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
  font-size: $uni-font-size-sm;
  @include color(color-lighter-dark);
}
</style>
