<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" :class="'mini-page-body ' + global__platform__">
		<view :class="'panel-overlay ' + ( showRightPanel ? 'active' : '')" @tap.stop.prevent="rightPanelOpen(false)" @touchmove.stop.prevent="miniMoveHandle"></view>
		<view :class="'sidebar flex-column ' + ( showRightPanel ? 'active' : '')"  @touchmove.stop.prevent="miniMoveHandle">
		    <scroll-view class="_scroll-view" :scroll-y="true" >
				<view class="list flex-column">

				</view>
			</scroll-view>
			<view class="icons flex-row">
				<view class="item flex-column" @tap.stop.prevent="leftUrlTap(9, 0)">
					<view class="icon">
						<i class="mini-icon mini-saoyisao"></i>
					</view>
					<view class="_text">扫一扫</view>
				</view>
			</view>
		</view>
		
		<view class="content">
			<navBar
			    :back="true"
			    :iconTheme="iconTheme"
			    :background="'rgba(' + clubInfo.club_background_color + ', ' + navbarTrans + ')'"
			    :color="'rgba(' + color + ', ' + navbarTrans + ')'"
			    :home="fph"
					  :placeholder="false"
			>
			  <view class="img-title-center" slot="center">
			    <view class="lxy-nav-bar__logo">
			      <image class="_image" :src="clubInfo.avatar" :style="'opacity: ' + navbarTrans + ';border-radius: 50%;'"/>
			      <!-- <text class="_text" :style="'rgba(' + color + ', ' + navbarTrans + ')'">{{ userInfo.user_name }}</text> -->
			    </view>
			  </view>
			  <!-- #ifdef APP || H5 -->
			 <view slot="right" class="lxy-nav-bar__logo">
			    <i @tap.stop.prevent="inviter" class="mini-icon mini-fenxiang4" :style="'color:'+iconTheme"></i>
			  </view>
			  <!-- #endif -->
			</navBar>
			<view :style="'position: fixed;top: ' + CustomBar + 'px;height: 16rpx;width: 750rpx;background-color: rgba(' + clubInfo.club_background_color + ', ' + navbarTrans + ');z-index: 9;'" v-if="navbarTrans >= 0.99"></view>
			<view class="user-background scene_8">
			  <image class="banner" compression="content" mode="aspectFill" :src="clubInfo.club_background_maps"></image>
			  <view class="gradient" :style="'background-image: linear-gradient(180deg,rgba(14,14,14, 0.5),rgba(' + clubInfo.club_background_color + ',.75) 20%,rgba(' + clubInfo.club_background_color + ',.95) 55%,rgba(' + clubInfo.club_background_color + ', 1))'"></view>
			  <view class="own-header">
			    <view class="inner">
			      <view class="header-top">
			        <view :class="'own-header-img-div ' + (clubInfo.avatar_frame_url ? 'has-frame' :'') ">
			          <image class="own-header-img" @tap.stop.prevent="onPreviewImage" :data-src="clubInfo.avatar" :lazyLoad="true" :src="clubInfo.avatar"></image>
			          <image class="own-header-img-frame" v-if="clubInfo.avatar_frame_url" :data-src="clubInfo.avatar_frame_url" :lazyLoad="true"
			                 :src="clubInfo.avatar_frame_url"></image>
			          <i class="avatar-authentication-icon mini-icon mini-verify" v-if="clubInfo.is_authentication == 1" @tap.stop.prevent="popupShowTap(1)"></i>
			        </view>
			
			        <view class="header-middle">
			          <view class="user-name-box">
								<view class="name-wrap flex-row">
									<contextualPopup subject="users" :popList="clubInfo.longtaps" :para="{}">
										<text class="name-text" slot="content">{{ clubInfo.name }}</text>
									</contextualPopup>
									<image class="club-flag" src="../../static/club.png" mode="aspectFill"></image>
								</view>
			            <i class="header-labels official-icon mini-icon mini-renzhengguanli1" v-if="clubInfo.is_official == 1" @tap.stop.prevent="popupShowTap(0)"></i>
			          </view>
			          <view class="user-name-sub-box">
			            <view class="user-account-box">
			              <block v-if="clubInfo.authentication && clubInfo.authentication.id > 0">
			                <view class="auth-name">认证：{{ clubInfo.authentication.name }}</view>
			                <i class="mini-icon mini-shuxian"></i>
								  <view class="uid" @tap.stop.prevent="copyUserID(clubInfo.id)">
								  	俱乐部ID：{{ clubInfo.id }}
								  </view>
			              </block>
			              <block v-else>
			                <view class="uid" @tap.stop.prevent="copyUserID(clubInfo.id)">
			                	俱乐部ID：{{ clubInfo.id }}
			                </view>
			              </block>
			            </view>
			            <view class="flex-row">
								  <view class="ip_address" v-if="clubInfo.ip_address">IP属地：{{ clubInfo.ip_address || '未知' }}</view>
							  </view>
			          </view>
			        </view>
			      </view>
			      <view class="user_state_not_zero_tip" v-if="clubInfo.user_id == myUserInfo.id && clubInfo.status != undefined && clubInfo.status != 1">
			        <i class="mini-icon mini-jinggao"></i>注意：{{ clubInfo.status_tip }}
			      </view>
			      <view class="header-abstract" v-if="clubInfo.intro != null && clubInfo.intro != ''">
			        {{ clubInfo.intro }}
			      </view>
			
			      <view class="header-bottom">
			        <view class="header-zuo">
			          <view class="header-bottom-li" hover-class="none">
			            <view class="own-header-num">
			              {{ clubInfo.part_count > 999 ? filters.toFix(clubInfo.part_count) : clubInfo.part_count }}
			            </view>
			            <view class="own-header-text">参加活动</view>
			          </view>
			          <view class="header-bottom-li" hover-class="none" @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/users/users?id=13&object_id=' + clubInfo.id)">
			            <view class="own-header-num">
			              {{ clubInfo.follow_count > 999 ? filters.toFix(clubInfo.follow_count) : clubInfo.follow_count }}
			            </view>
			            <view class="own-header-text">粉丝</view>
			          </view>
			          <view class="header-bottom-li"  @tap.stop.prevent="toSliderUrl(6, '/pagesA/mine/users/users?id=15&object_id=' + clubInfo.id)">
			            <view class="own-header-num">
			              {{ clubInfo.collect_count > 999 ? filters.toFix(clubInfo.collect_count) : clubInfo.collect_count }}
			            </view>
			            <view class="own-header-text">被收藏</view>
			          </view>
			        </view>
						  <block v-if="clubInfo.user_id == myUserInfo.id">
							<view class="header-right-box">
							  <view @tap.stop.prevent="toSliderUrl(6, '/pagesZ/organize-bureau/club/setting?id=' + clubInfo.id)" class="follow-box">管&nbsp;理</view>
							</view>
						  </block>
						  <block v-else>
							<block v-if="!clubInfo.is_follow">
							  <view class="header-right-box">
							    <view @tap.stop.prevent="clubFollow(true)" class="follow-box">关&nbsp;注</view>
								  <view class="server-box flex-column" @tap.stop.prevent="toSliderUrl(18, clubInfo.user_id)">
									  <i class="mini-icon mini-kefufenxiermaikefu"></i>
								  </view>
							  </view>
							</block>
							<block v-else>
							  <view class="header-right-box">
							    <view @tap.stop.prevent="clubFollow(true)" class="follow-box followed">已关注</view>
								  <view class="server-box flex-column" @tap.stop.prevent="toSliderUrl(18, clubInfo.user_id)">
									  <i class="mini-icon mini-kefufenxiermaikefu"></i>
								  </view>
							  </view>
							</block>
						  </block>
			      </view>
						<block v-if="clubInfo && clubInfo.id > 0 && clubInfo.managers && clubInfo.managers.length > 0">
							<view class="my-grid-box">
								<scroll-view :scroll-x="true" class="_scroll-view">
									<view class="grid-box-inner">
										<view class="grid-item" v-for="(item, index) in clubInfo.managers" :key="index" @tap.stop.prevent="toSliderUrl(4, item.id)">
											<view class="grid-item-inner">
												<view class="title flex-column">
													<view class="avatar" :style="'background-color: rgba('+ clubInfo.club_background_color +',1);'">
														<image class="_image" :src="item.user_avatar"></image>
														<view class="_identity">主理人</view>
													</view>
													<view class="name u-line-1">{{ item.user_name }}</view>
												</view>
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</block>
			    </view>
			  </view>
			</view>
			<view class="mine-tools">
					<u-sticky :offsetTop="0">
						<view class="nav">
							<view class="nav-inner">
								<block v-for="(item, index) in taga" :key="index">
									<view @tap.stop.prevent="select(item.type)" :class="'tag-box type_' + item.name">
										<view :class="'taga-item ' + (bureau_type == item.type ? ' active' : '')">
											{{ item.text }}
										</view>
									</view>
								</block>
					
							</view>
						</view>
						<view class="sub-head">
							<view class="inner">
								<view class="item" :class="{ current: bureauParas.time_end_position === 'all' }" @tap="bureauStatusTap('all')">
									<view class="_text">
										全部
									</view>
								</view>
								<view class="item" :class="{ current: bureauParas.time_end_position === 'before' }" @tap="bureauStatusTap('before')">
									<view class="_text">
										进行中
									</view>
								</view>
								<view class="item" :class="{ current: bureauParas.time_end_position == 'after' }" @tap="bureauStatusTap('after')">
									<view class="_text">
										已结束
									</view>
								</view>
							</view>
						</view>
					</u-sticky>
			  <view class="body-box">
					  <view style="height: 20rpx;background-color: transparent;"></view>
					  <view class="inner">
					  	<organize-bureau-list-item v-for="(bureau, bindex) in bureauList" :key="bindex" :item="bureau" v-if=" bureauList.length > 0 "/>
					  	<u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
					  		iconSize="28" fontSize="28" color="#989898" />
					  	<view class="empty-box" v-if="bureauList.length <= 0">
					  		<u-empty :text="bureau_type == 1 ? '一个组局活动也没有' : (bureau_type == 2 ? '没有创建过个人赛' : '没有创建过战队赛')" :marginTop="100" :width="250" :height="250" text-size="24" />
					  	</view>
					  	<view style="height: 60rpx;"></view>
					  	<view class="safe_area_height"></view>
					  </view>
			  </view>
			</view>
		</view>

      <hover-ball v-if="isOfficial > 1"/>
      <my-toast :unicom-id=" 'mytotast_8_' + id " ref="mytoast" :isdistance="true" :toast="mytoast_data" @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';
import OrganizeBureauListItem from '@/pagesZ/organize-bureau/components/organize-bureau-list-item.vue';
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';


const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
const user = require('@/mixins/user');
const forum = require('@/mixins/forum');
var options = {};

mixins(options);
common(options);
user(options);
forum(options);

export default {
	mixins: [{ methods: options }],
    components: {
	myToast,navBar,hoverBall,lsSkeleton,
	OrganizeBureauListItem,
    contextualPopup
  },
  computed: {
	config_img:{
		get(){
			let that = this;
			if(that.$store.state.config && that.$store.state.config.img){
				return that.$store.state.config.img || {};
			}
			return {
				empty: "",
				default: "",
				default_avatar: ""
			};
		},
		set(v){}
	},
    config_audit_is_reward: {
      get() {
        let that = this;
        return !that.$store.state.config.audit.is_reward && that.$store.state.config.app.mode != 'examine';
      },
      set(v) {}
    },
    config_user_official_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.official_popup;
      },
      set(v) {}
    },
    config_user_authentication_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.authentication_popup;
      },
      set(v) {}
    },
    config_user_members_popup: {
      get() {
        let that = this;
        return that.$store.state.config.user.members_popup;
      },
      set(v) {}
    },
    is_user_can_open_chat: {
      get() {
        let that = this;
        if (that.$store.state.config.app.lv && that.$store.state.config.app.lv.permission) {
          if (that.$store.state.userInfo.lv >= that.$store.state.config.app.lv.permission.open_chat) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      set(v) {}
    },
	CustomBar:{
		get(){
			let that = this;
			return that.$store.state.CustomBar;
		},
		set(v){}
	},
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 154,

      navbarTrans: 0,
      color: '255,255,255',
      iconTheme: 'white',
      id: 0,
	  clubInfo: {
		user_id: 0,
		user: {
			user_name: '',
			user_avatar: '',
		},
		name: '',
		intro: '',
		avatar: '',
		club_background_maps: '',
		club_background_color: '14, 14, 14',
		part_count: 0,
		follow_count: 0,
		collect_count: 0,
	  },
	  page: 1,
	  topicload: true,
	  loadmoreShow: false,
	  isLastPage: false,
	  bureauList: [],
	  
	  showRightPanel: false,

	  bureauParas: {
	  	search: '',
	  	orderBy: 'created_at',
	  	order: 'desc',
		time_end_position: 'all', // all, after, before
	  },
	  bureau_type: 1,
	  taga: [
		{
	  		text: '活动',
	  		name: 'bureau_type_1',
	  		ums: '',
			type: 1,
	  	},
	  	{
	  		text: '个人赛',
	  		name: 'bureau_type_2',
	  		ums: '',
			type: 2,
	  	},
		{
			text: '战队赛',
			name: 'bureau_type_3',
			ums: '',
			type: 3,
		},
	  ],
    };
  },
  onPageScroll: function onPageScroll(e) {
    let that = this;
    var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

    if (trans > 1 && that.navbarTrans > 1) {
      return false;
    }

    that.navbarTrans = trans;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);

    // 处理小程序码的分享场景
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      let query = {};
      if (scene.indexOf('&') !== -1) {
        let scene_arr = scene.split('&');
        scene_arr.map((item) => {
          let queryData = item.split('=')
          query[queryData[0]] = queryData[1]
        })
      } else {
        let queryData = scene.split('=')
        query[queryData[0]] = queryData[1]
      }
      if (query.from_user && query.from_user.length > 0) {
        uni.setStorageSync('form_user', query.from_user);
        uni.$store.commit('updateFormUser', query.from_user);
      }
      that.setData({
        id: query.id,
		page__scene__id__: query.id,
        fph: true
      });
    } else {
      that.setData({
        id: options.id,
		page__scene__id__: options.id,
      });
    }


    that.getClubInfo(that.id);
    that.clubBureau();
  },
  onReady: function() {
  	uni.setNavigationBarColor({
  	  frontColor: '#ffffff',
  	});
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(154, that.id);
	
	if(that.$store.state.pre_scene == 158 ){
		that.getClubInfo(that.id);
	}
	
  },
  onBackPress(e) {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
	let that = this;
	that.setData({
		page: 1,
		topicload: true,
		loadmoreShow: false,
		isLastPage: false,
		bureauList: [],
	});
	that.getClubInfo(that.id);
	that.clubBureau();
	uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	let that = this;
	if(that.isLastPage){
		return;
	};
	
	if(that.bureauList.length <= 0){
		return;
	}
	
	that.setData({
		loadmoreShow: true,
		isLastPage: false,
		page: that.page + 1
	});
	
	that.clubBureau();
  },
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: that.clubInfo.name + '- 俱乐部',
      path: 'pagesZ/organize-bureau/club/club?id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: ''
    };
  },
  onShareTimeline: function (res) {
    let that = this;
    let my_avater_img = that.clubInfo.avatar ? that.clubInfo.avatar : '';
    return {
      title: that.clubInfo.name + '- 俱乐部',
      query: 'id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: uni.wen.util.removeStyles(my_avater_img || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
    };
  },
  methods: {
	leftUrlTap(type, id){
		let that = this;
		that.rightPanelOpen(false);
		setTimeout(function() {
			uni.wen.toUrl(type, id, that);
		}, 300);
	},
	rightPanelOpen(flag){
		let that = this;
		if(flag){
			uni.wen.util.doVibrateShort();
			that.showRightPanel = true;
		}else{
			that.showRightPanel = false;
		}
	},
	inviter(){
		let that = this;
		uni.wen.util.inviteUser('/pagesZ/organize-bureau/club/club',  that.clubInfo.name + '- 俱乐部', 'id=' + that.id, that.clubInfo.avatar);
	},
	clubFollow(flag){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'club_follow',
			club_id: that.id,
			status: flag ? 1 : 0
		}, 'POST').then(res => {
			if(res.status){
				if(that.clubInfo.is_follow){
					that.clubInfo.is_follow = false;
					that.clubInfo.follow_count = that.clubInfo.follow_count - 1;
					uni.showToast({
						title: '取消关注',
						icon: 'none'
					});
				}else{
					that.clubInfo.is_follow = true;
					that.clubInfo.follow_count = that.clubInfo.follow_count + 1;
					uni.showToast({
						title: '关注成功',
						icon: 'none'
					});
				}
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
			
		});
	},
	getClubInfo(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'club/info', {
			id: that.id
		}, 'GET', 154).then(function(res) {
			uni.loading(false);
			if(res.status){
				that.clubInfo = res.data;
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
	select(type) {
		var that = this;
		
		that.setData({
			bureau_type: type,
			page: 1,
			topicload: true,
			loadmoreShow: false,
			isLastPage: false,
			bureauList: []
		});

		that.clubBureau();
	},
	bureauStatusTap(index){
		let that = this;
		that.bureauParas.time_end_position = index;
		that.setData({
			page: 1,
			topicload: true,
			loadmoreShow: false,
			isLastPage: false,
			bureauList: []
		});
		that.clubBureau();
	},
	clubBureau() {
		let that = this;
		
		let para = {
			bureau_type: that.bureau_type,
			page: that.page,
			club_id: that.id,
			time_end_position: that.bureauParas.time_end_position,
			keyword: that.bureauParas.search,
			orderBy: that.bureauParas.orderBy,
			order: that.bureauParas.order
		};

		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/list', para).then((res) => {
			uni.stopPullDownRefresh();
			if (res.status) {
				
				if(res.data.current_page != that.page){
					return false;
				}
				
				let data = res.data;
				
				let args = {};
				args.page = data.current_page;
				if(data.data && data.data.length > 0){
					args.bureauList = that.bureauList.concat(data.data);
					if(data.data.length < 10){
						args.isLastPage = true;
						args.loadmoreShow = true;
					}else{
						args.isLastPage = false;
						args.loadmoreShow = false;
					}
				}else{
					args.isLastPage = true;
				}
				args.topicload = false;
				that.setData(args);
	
			}else{
				if(res.code == 200003){
					that.setData({
						topicload: false,
						loadmoreShow: false,
					});
				}else{
					that.setData({
						topicload: false,
						loadmoreShow: false,
					});
				}
			}
		});
	},
	copyUserID(id){
		uni.wen.util.setClipboardData(id, '俱乐部ID已复制');
	}
  }
};
</script>
<style lang="scss">
@import './club.scss';
</style>
