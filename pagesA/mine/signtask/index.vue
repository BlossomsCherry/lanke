<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view class="mini-page-body">
      <navBar :back="true" :home="fph" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
        <view class="" slot="center">
          <tabsSwiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" :active-color="primaryColor"
                      :bgColor="global__theme__ == 'black' ? '#19191e' : '#ffffff'"></tabsSwiper>
        </view>
      </navBar>
      <swiper :current="swiperCurrent" @change="swiperChange" @transition="transition" @animationfinish="animationfinish"
              :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' ">
        <swiper-item class="swiper-item swiper-item-1">
          <scroll-view scroll-y class="sign-task-content" :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' "
                       @scrolltolower="onreachBottom">
            <view class="page-block-gap"></view>
            <block v-if="dataLoading">
              <view class="loading">
                <view class="spinner">
                  <view class="rect rect1"></view>
                  <view class="rect rect2"></view>
                  <view class="rect rect3"></view>
                  <view class="rect rect4"></view>
                  <view class="rect rect5"></view>
                </view>
              </view>
            </block>
            <block v-else>
              <view class="inner">
                <view class="card_box userinfo-card">
                  <view class="box1 flex-row">
                    <view :class="'left' + (myUserInfo.avatar_frame_url ? ' has-frame' :'') " @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/editmine/editmine')">
                      <image class="own-header-img" :lazyLoad="true" mode="aspectFill" :src="myUserInfo.user_avatar"></image>
                      <image class="own-header-img-frame" v-if="myUserInfo.avatar_frame_url" :data-src="myUserInfo.avatar_frame_url" :lazyLoad="true"
                             :src="myUserInfo.avatar_frame_url"></image>
                      <i class="avatar-authentication-icon mini-icon mini-verify" v-if="myUserInfo.is_authentication == 1" data-type="1" @tap.stop.prevent="popupShowTap"></i>
                    </view>
                    <view class="right">
                      <view class="name">
                        <text :user-select="true" class="name-text">{{ myUserInfo.user_name }}</text>
                        <i class="header-labels official-icon mini-icon mini-renzhengguanli1" v-if="myUserInfo.is_official > 0"></i>
                        <block v-if="(config_pays && config_pays.paycode_16 == true)">
                          <i class="header-labels  vip-icon mini-icon mini-vip" v-if="myUserInfo.is_member == 1" data-type="2"
                             @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/members/members')"></i>
                          <i class="header-labels not-vip-icon mini-icon mini-vip" v-if="myUserInfo.is_member != 1"
                             @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/members/members')"></i>
                        </block>
                        <i :class="'header-labels lv-icon mini-icon mini-lv' + myUserInfo.lv" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/lv/lv')"></i>
                      </view>
                      <view class="exp flex-column">
                        <view class="tip-box flex-row">
                          <view class="tip">还差{{ userData.nextLvExpNeed }}经验到{{ userData.nextLv }}级</view>
                          <view class="rate">{{ userData.experience }}/{{ userData.nextLvExp }}
                            <i class="mini-icon mini-bangzhu" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/lv/lv')"></i>
                          </view>
                        </view>
                        <progress :percent="userData.rate" stroke-width="2" :activeColor="primaryColor"/>
                      </view>
                    </view>
                  </view>
                  <view class="box2 flex-row">
                    <view class="item flex-column">
                      <view class="num">{{ userData.experience }}</view>
                      <view class="text">经验值</view>
                    </view>
                    <view class="item flex-column">
                      <view class="num">{{ userData.signedDays }}
                      </view>
                      <view class="text">签到总天数</view>
                    </view>
                    <view class="item flex-column">
                      <view class="num">{{ userData.taskTotal }}</view>
                      <view class="text">任务量</view>
                    </view>
                    <view class="item flex-column">
                      <view class="num">{{ userData.coins }}</view>
                      <view class="text">{{ config_app_coins_name }}</view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="page-block-gap"></view>
              <view class="inner">
                <view class="card_box card_my_integral">
                  <view class="checked-coins-1">签到累计获得{{ config_app_coins_name }}</view>
                  <view class="checked-coins-2">{{ signData.coins_total }}</view>
                  <view class="card_content flex-row sign_content">
                    <!-- 0：过期未签 1：已签到 3：可签到 4: 未达到时间 -->
                    <block v-if="signData.list && signData.list.length > 0">
                      <view v-for="(item,index) in signData.list" :key="index" class="sign_item" @tap.stop.prevent="userSign(item.state)">
                        <text v-if="item.extra>0" class="sign_title">额外+{{ item.extra }}</text>
                        <view :class="item.isSign?'sign_box sign_done':'sign_box sign_box_border' ">
                          <block v-if="item.state == 0">
                            <i class="integral_icon color-light-grey mini-icon mini-duigouxiao"></i>
                            <text class="sign_integral gray">+{{ item.integral }}</text>
                          </block>
                          <block v-else-if="item.state == 1">
                            <i class="integral_icon mini-icon mini-duigouxiao"></i>
                            <text class="sign_integral">+{{ item.integral }}</text>
                          </block>
                          <block v-else-if="item.state == 2">
                            <i class="integral_icon mini-icon mini-Gold_coin_01 gold-color"></i>
                            <text class="sign_integral gold-color">+{{ item.integral }}</text>
                          </block>
                          <block v-else-if="item.state == 3">
                            <i class="integral_icon color-light-grey mini-icon mini-duigouxiao"></i>
                            <text class="sign_integral gold-color">+{{ item.integral }}</text>
                          </block>
                        </view>
                        <text class="sign_day">{{ item.day }}</text>
                      </view>
                    </block>
                  </view>
                  <block v-if="signData.today_signed">
                    <block v-if="userData.continuous_days">
                      <button class="sign-btn gray" :loading="btnLoading" @tap.stop.prevent="userSign(1)">已连续签到
                        <view class="continuous">{{ userData.continuous_days }}</view>
                        天
                      </button>
                    </block>
                    <block v-else>
                      <button class="sign-btn gray" :loading="btnLoading" @tap.stop.prevent="userSign(1)">已签到</button>
                    </block>
                  </block>
                  <block v-else>
                    <button class="sign-btn" :loading="btnLoading" @tap.stop.prevent="userSign(2)">立即签到</button>
                  </block>
                </view>
              </view>
              <view class="page-block-gap"></view>
              <view class="inner">
                <view class="card_box freshuser-task">
                  <view class="flex-row card_head_border">
                    <text class="card_title_left bold">新手任务</text>
                  </view>
                  <view class="card_content">
                    <view v-for="(item,index) in taskList" :key="index" class="work_item flex-row">
                      <view class="word_left flex-column">
                        <view>
							<text class="word_title">{{ item.name }}
								<text class="condition_tip" v-if="item.condition_tip">{{ item.condition_tip }}</text>
							</text>
						</view>
                        <text class="word_des">{{ item.reward_tip }}</text>
                      </view>
                      <view class="word_right">
                        <text class="btn_unfinish" v-if="item.status == 0" @tap="toSliderUrl(item.target_type, item.target_id)">去完成
						</text>
                        <text class="btn_unfinish btn_finish done" v-else-if="item.status == 1">已完成</text>
                        <text class="btn_unfinish btn_finish" v-else-if="item.status == 2" @tap="taskReward(item.id)">领取奖励</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="page-block-gap"></view>
              <view class="inner">
                <view class="card_box surrounding">
                  <view class="flex-row card_head_border">
                    <text class="card_title_left bold">周边兑换</text>
                  </view>
                  <view class="card_content flex-row product_content">
                    <view class="product_item">
                      <view class="product_box">
                        <image class="product_photo" :src="$store.state.userInfo.user_avatar"></image>
                        <image class="user_pendant" src="https://img.mini.minisns.cn/portraitBox/portraitBox.png"></image>
                      </view>
                      <text class="product_name">鲸鱼头像挂件</text>
                      <view class="flex-row product_price_wrap">
                        <text class="product_price">20{{ config_app_coins_name }}</text>
                        <text class="product_unit">/个</text>
                      </view>
                      <text class="btn_exchange">暂未开放</text>
                    </view>
                    <view class="product_item">
                      <view class="product_box">
                        <image class="product_vip_photo" src="https://img.mini.minisns.cn/vip/vip7day.jpg"></image>
                      </view>
                      <text class="product_name">vip7天</text>
                      <view class="flex-row product_price_wrap">
                        <text class="product_price">200{{ config_app_coins_name }}</text>
                        <text class="product_unit">/个</text>
                      </view>
                      <text class="btn_exchange">暂未开放</text>
                    </view>
                    <view class="product_item">
                      <view class="product_box">
                        <image class="product_vip_photo" src="https://img.mini.minisns.cn/vip/vip1month.jpg"></image>
                      </view>
                      <text class="product_name">vip1个月</text>
                      <view class="flex-row product_price_wrap">
                        <text class="product_price">500{{ config_app_coins_name }}</text>
                        <text class="product_unit">/个</text>
                      </view>
                      <text class="btn_exchange">暂未开放</text>
                    </view>
                  </view>
                </view>
                <text class="footer_tip">更多周边正在上架中</text>
                <view style="height: 2vh;"></view>
              </view>
            </block>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiper-item swiper-item-2">
          <scroll-view scroll-y class="sign-task-content" :style=" 'height: ' + swiperHeight + ';min-height: ' + swiperHeight + ';max-height: ' + swiperHeight + ';width: 750rpx;' "
                       @scrolltolower="onreachBottom">
            <view class="page-block-gap"></view>
            <block v-if="page2loading">
              <view class="loading">
                <view class="spinner">
                  <view class="rect rect1"></view>
                  <view class="rect rect2"></view>
                  <view class="rect rect3"></view>
                  <view class="rect rect4"></view>
                  <view class="rect rect5"></view>
                </view>
              </view>
            </block>
            <block v-else>
              <view class="inner">
                <view class="card_box freshuser-task">
                  <view class="card_content">
                    <block v-if="page2_type === 0">
                      <view v-for="(item,index) in page2_day_list" :key="index" class="work_item flex-row">
                        <view class="word_left flex-column">
                          <view>
							  <text class="word_title">{{ item.name }}
									<text class="condition_tip" v-if="item.condition_tip">{{ item.condition_tip }}</text>
							  </text>
						  </view>
                          <text class="word_des">{{ item.reward_tip }}</text>
                        </view>
                        <view class="word_right">
                          <text class="btn_unfinish" v-if="item.status == 0" @tap="toSliderUrl(item.target_type, item.target_id)">去完成
						  </text>
                          <text class="btn_unfinish btn_finish done" v-else-if="item.status == 1">已完成</text>
                          <text class="btn_unfinish btn_finish" v-else-if="item.status == 2" @tap="taskReward(item.id)">领取奖励</text>
                        </view>
                      </view>
                      <u-loadmore v-if="page2_day_loadmore" :status="page2_day_islastpage ? 'nomore' : 'loading'" nomoreText="── THE END ──"
                                  size="28" color="#989898"/>
                    </block>
                    <block v-else>
                      <view v-for="(item,index) in page2_once_list" :key="index" class="work_item flex-row">
                        <view class="word_left flex-column">
                          <view>
							  <text class="word_title">{{ item.name }}
									<text class="condition_tip" v-if="item.condition_tip">{{ item.condition_tip }}</text>
							  </text>
						  </view>
                          <text class="word_des">{{ item.reward_tip }}</text>
                        </view>
                        <view class="word_right">
                          <text class="btn_unfinish" v-if="item.status == 0" @tap="toSliderUrl(item.target_type, item.target_id)">去完成
						  </text>
                          <text class="btn_unfinish btn_finish done" v-else-if="item.status == 1">已完成</text>
                          <text class="btn_unfinish btn_finish" v-else-if="item.status == 2" @tap="taskReward(item.id)">领取奖励</text>
                        </view>
                      </view>
                      <u-loadmore v-if="page2_once_loadmore" :status="page2_once_islastpage ? 'nomore' : 'loading'" nomoreText="── THE END ──"
                                  size="28" color="#989898"/>
                    </block>

                  </view>
                </view>
              </view>
            </block>
          </scroll-view>
        </swiper-item>
      </swiper>

      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
  </view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import tabsSwiper from '@/components/u-tabs-swiper/u-tabs-swiper';
import uniPopup from '@/pagesA/components/uni-popup/uni-popup.vue';

const common = require('@/mixins/common');
var options = {};

//预览图片
common(options);
export default {
  mixins: [{ methods: options }],
  components: { 
	  myToast,navBar,hoverBall,
	  tabsSwiper,
	  uniPopup,
  },
  computed: {
	config_pays:{
		get(){
			let that = this;
			if(that.$store.state.config && that.$store.state.config.pays){
				return that.$store.state.config.pays || {};
			}
			return {};
		},
		set(v){}
	},
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
    swiperHeight: {
      get() {
        let that = this;
        return ' calc( 100vh - ' + that.$store.state.CustomBar + 'px )';
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 33,
      taskList: [],
      signData: {
        list: [],
      },
      userData: {
        experience: 0,
        signedDays: 0,
        taskTotal: 0,
        coins: 0
      },


      list: [{
        name: '签到'
      }, {
        name: '任务'
      }],
      current: 0,
      swiperCurrent: 0,
      dataLoading: true,
      btnLoading: false,

      page2loaded: false,
      page2loading: true,

      page2_type: 1,
      page2_day_list: [],
      page2_day_page: 1,
      page2_day_loadmore: false,
      page2_day_islastpage: false,

      page2_once_list: [],
      page2_once_page: 1,
      page2_once_loadmore: false,
      page2_once_islastpage: false
    }
  },
  onLoad(options) {
    let that = this;
    that.globalOnloadProcess(options);

    that.getSignTaskData();
  },
  onShow() {
    let that = this;
    that.updateScene(33, 0, true);

    that.getSignTaskData();
  },
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: '签到任务中心',
      path: '/pagesA/mine/signtask/index?from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },

  onShareTimeline: function (res) {
    let that = this;
    return {
      title: '签到任务中心',
      query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  onPullDownRefresh: function () {
	  let that = this;
	  that.setData({
		  taskList: [],
		  signData: {
		    list: [],
		  },
		  userData: {
		    experience: 0,
		    signedDays: 0,
		    taskTotal: 0,
		    coins: 0
		  },
		  
		  
		  list: [{
		    name: '签到'
		  }, {
		    name: '任务'
		  }],
		  current: 0,
		  swiperCurrent: 0,
		  dataLoading: true,
		  btnLoading: false,
		  
		  page2loaded: false,
		  page2loading: true,
		  
		  page2_type: 1,
		  page2_day_list: [],
		  page2_day_page: 1,
		  page2_day_loadmore: false,
		  page2_day_islastpage: false,
		  
		  page2_once_list: [],
		  page2_once_page: 1,
		  page2_once_loadmore: false,
		  page2_once_islastpage: false
	  })
	  that.getSignTaskData();
      uni.stopPullDownRefresh();
  },
  onReachBottom: function() {
	return false;
  	let that = this;
	
	if (that.page2_type == 0) {
		
	}else{
		if(!that.page2_once_islastpage){
			return false;
			that.setData({
				page2_once_loadmore: true,
				page2_once_islastpage: false,
				page2_once_page: that.page2_once_page + 1
			});
			that.getTaskHall(false);
		}
	}
  	
  },
  methods: {
    swiperChange(e) {
      let that = this;
      if (e.detail.current == 1) {
        if (that.page2loaded === false) {
          that.getTaskHall(true);
        }
      }
    },
    getTaskHall(init) {
      let that = this;
	  let page = 1;
      if (init) {
        if (that.page2_type == 0) {
          that.setData({
            page2_day_list: [],
            page2_day_page: 1,
            page2_day_loadmore: true,
            page2_day_islastpage: false,
          })
        } else {
          that.setData({
            page2_once_list: [],
            page2_once_page: 1,
            page2_once_loadmore: true,
            page2_once_islastpage: false
          })
        }
      } else {
        if (that.page2_type == 0) {
          that.setData({
            page2_day_loadmore: true,
          });
		  page = that.page2_day_page;
        } else {
          that.setData({
            page2_once_loadmore: true,
          });
		  page = that.page2_once_page;
        }
      }

      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'task/hall', {
        type: that.page2_type,
		page: page
      }).then(function (res) {
        if (res.status) {
			
			if(res.data.current_page != page){
				return false;
			}

          let data = res.data;
          let args = {};

          if (that.page2_type == 0) {
            if (data.data && data.data.length > 0) {
              args.page2_day_list = that.page2_day_list.concat(data.data);
              args.page2_day_page = data.current_page;
              args.page2_day_loadmore = false;
              args.page2_day_islastpage = false;
            } else {
              args.page2_day_islastpage = true;
            }
          } else {
            if (data.data && data.data.length > 0) {
              args.page2_once_list = that.page2_once_list.concat(data.data);
              args.page2_once_page = data.current_page;
              args.page2_once_loadmore = false;
              args.page2_once_islastpage = false;
            } else {
              args.page2_once_islastpage = true;
            }
          }

          args.page2loading = false;

          if (that.page2loaded === false) {
            that.page2loaded = true;
          }

          that.setData(args);

        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      });
    },
    onreachBottom() {
      let that = this;

      if (that.current === 0) {

      } else {
        if (that.page2_type == 0) {
          if (!that.page2_day_islastpage) {
            that.setData({
              page2_day_loadmore: true,
              page2_day_islastpage: false,
              page2_day_page: that.page2_day_page + 1
            });
            that.getTaskHall(false);
          }
        } else {
          if (!that.page2_once_islastpage) {
            that.setData({
              page2_once_loadmore: true,
              page2_once_islastpage: false,
              page2_once_page: that.page2_once_page + 1
            });
            that.getTaskHall(false);
          }
        }
      }
    },
    animationfinish(e) {
      let that = this;
      let current = e.detail.current;
      that.$refs.uTabs.setFinishCurrent(current);
      that.swiperCurrent = current;
      that.current = current;
    },
    tabsChange(index) {
      let that = this;
      that.swiperCurrent = index;
    },
    transition(e) {
      let that = this;
      let dx = e.detail.dx;
      that.$refs.uTabs.setDx(dx);
    },
    getSignTaskData() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'signtask', {}).then(function (res) {
        that.dataLoading = false;
        if (res.status) {
          that.setData({
            signData: res.data.sign,
            taskList: res.data.task,
            userData: res.data.user,
          });
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      });

    },
    userSign(state) {
      let that = this;
      if (state == 0) {
        uni.showToast({
          title: '只可以当天签到',
          icon: 'none'
        });
        return false;
      } else if (state == 1) {
        uni.showToast({
          title: '你已经签过了',
          icon: 'none'
        });
        return false;
      } else if (state == 2) {

      } else if (state == 3) {
        uni.showToast({
          title: '还没到时间呢',
          icon: 'none'
        });
        return false;
      }

      if (that.btnLoading) {
        return false;
      }
      that.btnLoading = true;

      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/sign', {}, 'POST').then(function (res) {
        that.btnLoading = false;
        if (res.status) {
          that.setData({
            signData: res.data.sign,
            taskList: res.data.task,
            userData: res.data.user,
          });

          uni.showToast({
            title: '签到成功',
            icon: 'none'
          });
        } else {

          uni.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      });
    },
    taskReward(task_id) {
      let that = this;

      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/task/complete', {
        task_id: task_id
      }, 'POST').then(function (res) {
        if (res.status) {
          if (that.current === 0) {
            that.setData({
              taskList: res.data.task,
              userData: res.data.user,
            });
            uni.showToast({
              title: '领取成功',
              icon: 'none'
            });
          } else {
            that.getTaskHall(true);
          }
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.color-light-grey{
	color: $uni-text-color-disable !important;
}
.sign-task-content {
  @include background_color(page-body-background-color);
}

.sign-task-content {
  width: 750rpx;

  .inner {
    width: $page-content-body-width;
    margin: auto;

    .card_box {
      width: $page-content-body-width;
      @include background_color(page-box-background-color);
      border-width: 1px;
      border-color: #f9f9f9;
      border-radius: 20rpx;
      padding: 30rpx;
      box-sizing: border-box;

      .card_head_border {
        border-radius: 4rpx;
        margin-bottom: 20rpx;

        .card_title_left {
          font-size: $uni-font-size-medium;
          @include color(color-light-dark);
        }
      }

      .card_content {
        padding: 0px;
      }
    }

    .footer_tip {
      font-size: 12px;
      @include color(color-lightest-dark);
      text-align: center;
      margin: 40rpx 0;
      display: block;
    }

    .card_box.userinfo-card {
      .box1 {
        margin-bottom: 60rpx;

        .left {
          position: relative;
          margin-right: 40rpx;
          height: 120rpx;

          .own-header-img {
            width: 120rpx;
            height: 120rpx;
            border-radius: 120rpx;
            border: 5rpx solid #fff;
          }

          .own-header-img-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 120rpx;
            height: 120rpx;
            transform: scale(1.35);
          }

          .avatar-authentication-icon {
            position: absolute;
            right: -5%;
            bottom: -5%;
            font-size: 40rpx;
            height: 40rpx;
            line-height: 40rpx;
            width: 40rpx;
            color: $uni-color-authentication;
            border-radius: 50%;
            @include background_color(page-box-background-color);
          }

          .avatar-authentication-icon.mini-jiahao- {
            color: $uni-color-primary;
            @include background_color(page-box-background-color);
            border-radius: 50%;
            box-sizing: border-box;
            line-height: 40rpx;
            height: 40rpx;
            width: 40rpx;
            vertical-align: middle;
            align-self: center;
          }
        }

        .left.has-frame {
          .own-header-img {
            border: unset;
          }

          .avatar-authentication-icon {
            right: -12%;
            bottom: -5%;
          }
        }

        .right {
          width: 500rpx;

          .name {
            .name-text {
              max-width: 360rpx;
              text-overflow: ellipsis;
              line-height: 52rpx;
              overflow: hidden;
              display: inline-flex;
              text-overflow: ellipsis;
              white-space: nowrap;
              @include color(color-darkest);
            }

            .header-labels.mini-icon {
              width: 32rpx;
              font-size: $uni-font-size-lg;
              margin-left: 12rpx;
              font-weight: 100;
              display: inline-block;
              line-height: 52rpx;
            }

            .header-labels.not-vip-icon.mini-icon {
              color: gray;
            }

            .header-labels.lv-icon {
              font-size: 40rpx;
              width: 52rpx;
              line-height: 50rpx;
            }
          }

          .exp {
            .tip-box {
              justify-content: space-between;
              margin-top: 16rpx;
              margin-bottom: 8rpx;

              .tip {
                color: $uni-color-primary;
                font-size: $uni-font-size-sm;
              }

              .rate {
                @include color(color-lightest-dark);
                font-size: $uni-font-size-sm-base;

                .mini-icon {
                  display: inline;
                  margin-left: 6rpx;
                }
              }
            }
          }
        }
      }

      .box2 {
        justify-content: space-between;

        .item {
          text-align: center;

          .num {
            position: relative;
            text-align: center;
            @include color(color-light-dark);
            font-size: $uni-font-size-base;
            margin-bottom: 10rpx;
          }

          .text {
            font-size: 22rpx;
            color: #5e5e5e;
          }
        }
      }
    }


    .card_box.card_my_integral {
      .checked-coins-1 {
        font-size: $uni-font-size-sm;
        margin-top: 6rpx;
        text-align: center;
        @include color(color-dark);
      }

      .checked-coins-2 {
        font-size: 40rpx;
        margin-top: 20rpx;
        text-align: center;
        @include color(color-darkest);
      }

      .sign_content {
        justify-content: space-between;

        .sign_item {
          justify-content: center;
          align-items: center;
          margin: 10rpx;
          font-size: $uni-font-size-sm-base;

          .sign_title {
            background-color: #ffebaf;
            color: #F06A3A;
            font-size: 20rpx;
            padding: 2rpx 6rpx;
            border-radius: 4rpx;
            position: absolute;
            top: -10rpx;
            left: -10rpx;
            opacity: .8;
          }

          .integral_icon {
            width: 76rpx;
            height: 76rpx;
            position: absolute;
            font-size: 74rpx;
          }

          .mini-icon.mini-duigouxiao.integral_icon {
            color: #FFA726;
            font-size: 56rpx;
            top: 10rpx;
            left: 6rpx;
          }

          .sign_box {
            width: 70rpx;
            height: 70rpx;
            border-radius: 60rpx;
            justify-content: center;
            align-items: center;
            margin: 8px 0;
            margin-top: 20px;
            opacity: .8;
            position: relative;
          }


          .sign_integral {
            font-size: $uni-font-size-sm-base;
            color: coral;
            font-weight: 700;
            position: absolute;
            top: -46rpx;
            width: 100%;
            text-align: center;
          }

          .sign_integral.gray {
            color: #aaaaaa;
          }

          .sign_day {
            font-size: 20rpx;
            color: #aaaaaa;
            text-align: center;
            display: block;
          }
        }

      }

      .sign-btn {
        margin: auto;
        width: 100%;
        height: 66rpx;
        line-height: 66rpx;
        font-size: $uni-font-size-sm-base;
        text-align: center;
        border-radius: $uni-border-radius-lg-er;
		background-color: $uni-color-follow !important;
		color: $uni-color-follow-font !important;
        margin-top: 20rpx;
      }

      .sign-btn.gray {
        @include background_color(page-box-item-background-color);
        @include color(color-lighter-dark);

        .continuous {
          color: $uni-color-primary !important;
          display: inline;
        }
      }
    }

    .card_box.freshuser-task {
      .work_item {
        padding: 15px 0;
        border-bottom-width: 1px;
        border-bottom-color: #f9f9f9;
        flex: 1;
      }

      .word_left {
        flex: 1;
      }

      .word_title {
        font-size: $uni-font-size-base;
        @include color(color-light-dark);
        margin-bottom: 5px;
		position: relative;
		.condition_tip{
			position: absolute;
			font-size: $uni-font-size-sm;
			@include color(color-lightest-est-dark);
			top: 50%;
			right: -20rpx;
			transform: translate(100%, -50%);
		}
      }

      .word_des {
        font-size: $uni-font-size-sm;
        color: #F06A3A;
      }

      .word_right {
        align-items: center;
        display: flex;
        justify-content: center;
      }

      .btn_unfinish {
        padding: 8rpx 20rpx;
        font-size: 13px;
        border-radius: 20px;
        border: 1px solid $uni-color-primary;
        color: $uni-color-primary;
        @include background_color(page-box-background-color);
		position: relative;
      }

      .btn_finish {
        @include background_color(follow-background-color);
        @include color(color-follow-font);
      }

      .btn_finish.done {
        @include background_color(page-light2-line-background-color);
        @include color(color-lighter-er-dark);
        @include border_color(border-color-lightest-dark);
      }
    }

    .card_box.surrounding {
      .product_content {
        justify-content: space-between;
      }

      .product_item {
        justify-content: center;
        align-items: center;
      }

      .product_box {
        justify-content: center;
        position: relative;
      }

      .product_photo {
        width: 120rpx;
        height: 120rpx;
        border-radius: 100rpx;
        margin: 20rpx;
      }

      .product_vip_photo {
        width: 160rpx;
        height: 140rpx;
        margin: 10rpx;
      }

      .user_pendant {
        position: absolute;
        top: -4rpx;
        left: -4rpx;
        width: 170rpx;
        height: 170rpx;
      }

      .product_name {
        font-size: $uni-font-size-base;
        @include color(color-light-dark);
        text-align: center;
        display: block;
      }

      .product_price {
        color: #FF5500;
        font-size: $uni-font-size-sm;
      }

      .product_unit {
        color: #b5b5b5;
        font-size: 12px;

      }

      .btn_exchange {
        padding: 10rpx 20rpx;
        font-size: $uni-font-size-sm;
        @include color(color-lighter-dark);
        border-radius: 40rpx;
        border: 1px solid;
        @include border_color(border-color-box-item-background-color);
        border-width: 2rpx;
        width: 100rpx;
        display: block;
        margin: 12px auto 0;
      }

      .product_price_wrap {
        display: block;
        text-align: center;
      }
    }
  }
}

</style>
