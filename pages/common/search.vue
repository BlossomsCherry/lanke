<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <navBar :back="true" :scene="10" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
        <view class="search-form-inner" slot="center">
          <view class="search-box">
            <image src="/static/image/search-line.png" class="search-icon"></image>
            <input
                :focus="true"
                @confirm="onSearchConfirm"
                @input="onSearchInput"
                class="input"
                confirmType="search"
                :maxlength="maxLen"
                name="keyword"
                :placeholder="preKeyword  || '点击输入搜索词'"
                placeholderClass="placeholder"
                type="text"
                :value="keyword"
            />
            <button @tap.stop.prevent="onClearBtnClick" class="clear-btn icon-btn" v-if="keyword">
              <i class="mini-icon icon mini-chacha"></i>
            </button>
          </view>
        </view>
        <!-- #ifndef MP -->
        <view class="right" slot="right">
          <button class="search-btn" @tap.stop.prevent="onSearchConfirm" v-if="keyword">搜索</button>
          <button @tap.stop.prevent="onCancelBtnClick" class="search-btn" v-else>取消</button>
        </view>
        <!-- #endif -->
      </navBar>
      <view class="tabs" v-if="!searchViewVisible">
        <view @tap.stop.prevent="checkCurrent" :class="' tab ' + (currentData == item.tabIndex ? 'tabnew' : '')" :data-index="item.tabIndex" v-for="(item, index) in tabs" :key="index">{{ item.title }}<p style="margin-left: 6rpx" class="tab-search-count">{{ item.cont }}</p>
          <view :class="currentData == item.tabIndex ? 'line-search' : ''"></view>
        </view>
      </view>

      <view class="hit_search" v-if="searchViewVisible && myhots && myhots.length > 0">
        <view class="stitle-box">
          <view class="stitle">搜索记录</view>
          <view class="flex-row">
			  <view v-if="delSearchS" class="stitle-delbox">
			    <text class="_text" @tap.stop.prevent="myDelAllSearch">全部删除</text>
			    <view class="shu"></view>
			    <text class="_text" @tap.stop.prevent="delSearch">完成</text>
			  </view>
			  <i class="mini-icon mini-shanchu3 stitle-img" @tap.stop.prevent="delSearch"></i>
		  </view>
        </view>
        <scroll-view scroll-y class="hit_words">
          <block v-if="myhotsSat">
            <view class="keywords" v-for="(item, index) in myhots" :key="item.id">
              <text @tap.stop.prevent="searchStat" :data-name="item.search_content">{{ item.search_content }}</text>
			  <i v-if="delSearchS" @tap.stop.prevent="myDelSearch" :data-index="index" :data-id="item.id" class="audio-img mini-icon mini-chacha" ></i>
            </view>
          </block>
          <block v-else>
            <u-empty class="empty-view" :icon="config_img.empty" text="空" width="300" height="300" textSize="28" />
          </block>
        </scroll-view>
      </view>

      <view class="split-line" v-if="searchViewVisible && myhots && myhots.length > 0" />

      <view class="hit_search2" v-if="searchViewVisible">
        <view>
          <text class="stitle">热门搜索</text>
        </view>
        <view class="hit_words">
          <view @tap.stop.prevent="searchStat" :data-name="item.search_content" v-for="(item, index) in hots" :key="item.id" class="keywords">
            {{ item.search_content }}
          </view>
        </view>
      </view>
      <view class="split-line" v-if="searchViewVisible && real_time_posts_show"></view>
      <view class="top_ten_posts" v-if="searchViewVisible && real_time_posts_show">
        <view class="stitle">
          <view class="left">
            <view class="logo">
              <image :src="config_about_logo"></image>
            </view>
            <view class="title">{{ config_about_name }}热帖榜</view>
            <view class="ago">{{ real_time_posts_time }}更新</view>
          </view>
          <view class="right"></view>
        </view>
        <view class="content">
          <view class="item" v-for="(real_item ,index) in real_time_posts" :key="index" @tap.stop.prevent="toSliderUrl(1, real_item.id)">
            <view :class="'order order_' + (index + 1)">{{ index + 1 }}</view>
            <view class="post">{{ real_item.posts_content }}</view>
            <block>
              <view class="icon new" v-if="real_item.is_new">新</view>
              <view class="icon hot" v-if="real_item.is_hot">热</view>
            </block>
          </view>
        </view>
      </view>
      <view class="resultList" v-if="!searchViewVisible">
        <view class="post-list-gap"></view>
		<block v-if="hits && hits.text && hits.text.length > 0">
			<view class="hit-word-box" @tap.stop.prevent="toSliderUrl(hits.type, hits.target)">
				<view class="inner flex-row">
					<view class="left flex-column">
						<image class="_image" :src="hits.img"></image>
					</view>
					<view class="right flex-row">
						<view class="title-area flex-column">
							<view class="title u-line-1">{{ hits.title }}</view>
							<view class="desc u-line-1">{{ hits.desc }}</view>
						</view>
						<view class="icon flex-column">
							<i class="mini-icon mini-youjiantou"></i>
						</view>
					</view>
				</view>
			</view>
			<view class="post-list-gap"></view>
		</block>
        <view class="topic-list" v-if="currentData == 0">
          <view>
            <ls-skeleton :loading="topicload" :skeleton="rowPostSkeleton" :animate="true">
              <block name="circle">
                <view class="post-wrap" v-for="(item, index) in posts" :key="index">
                  <contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
                    <view class="topic-detail-view" slot="content">
                      <block v-if="item.post_type == 'single'">
                        <single-item :single="item"></single-item>
                      </block>
                      <block v-else>
                        <view class="topic-panel" :id="'media_' + item.id">
                          <view class="user-info-view">
                            <user-info :user="item.user" :format_time="item.format_time" :ip_address="item.ip_address" :distance="item.distance" :device="item.device"
                                       :post_top="item.post_top">
                              <view class="user-rigth" slot="right">
                                <block v-if="item.fields && item.fields.contact_phone">
                                  <view @tap.stop.prevent="toSliderUrl(22, item.fields.contact_phone)" class="follow-view">
                                    <i class="mini-icon mini-dianhua inline"></i>
                                    拨打
                                  </view>
                                </block>
                                <block v-else>
                                  <block v-if="!item.is_my_posts">
                                    <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
                                          :data-index="index" class="follow-view" v-if="!item.is_follow_user">
                                      关注
                                    </view>
                                    <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
                                          :data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
                                      已关注
                                    </view>
                                  </block>
                                </block>
                              </view>
                            </user-info>
                          </view>

                          <post-content :words="item" :postIndex="index" :scene="10" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall"
                                        @forceUpdate="forceUpdate" @pSelectVote="selectVote"></post-content>
                          <post-footer @tapShare="tapShare" @taplikes="taplikes" @tapComment="tapComments" @tapCollect="tapCollect" @tapReward="tapReward"
                                       @tapGiveCoin="tapGiveCoin" :words="item" :index="index"></post-footer>

                          <view class="reward-box" v-if="item.exceptional && item.exceptional.length > 0" :data-id="item.id"
                                @tap.stop.prevent="onClickReward" :data-ecount="item.exceptional_count">
                            <view class="inner">
                              <view class="cu-avatar-group">
                                <view v-if="item.exceptional_count > 6" class="cu-avatar round dian">•••
                                </view>
                                <view class="cu-avatar round"
                                      :style="'background-image:url(' + exceptional.user_avatar + ');'"
                                      v-for="(exceptional, index1) in item.exceptional"
                                      :key="exceptional.rid"></view>
                              </view>
                              <view class="cu-avatar-text">{{ item.exceptional_count }}次充电</view>
                            </view>
                          </view>

                        </view>
                      </block>
                    </view>
                  </contextualPopup>
                  <view class="post-list-gap" v-if="index != (posts.length - 1)"></view>
                  <block v-if="posts.length > 5 && item.ad">
                    <!-- #ifdef MP -->
                    <view class="flow-ad-wrap" v-if="item.ad">
                      <block v-if="item.ad.type && item.ad.type == '1' ">
                        <i class="mini-icon mini-adtip"></i>
                        <image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
                      </block>
                      <block v-else>
                        <view class="ad-content">
                          <ad-custom :unit-id="item.ad.unit"></ad-custom>
                        </view>
                      </block>
                    </view>
                    <view class="post-list-gap" v-if="item.ad"></view>
                    <!-- #endif -->
                    <!-- #ifndef MP -->
                    <view class="flow-ad-wrap" v-if="item.ad">
                      <block v-if="item.ad.type && item.ad.type == '1' ">
                        <i class="mini-icon mini-adtip"></i>
                        <image class="_image" :src="item.ad.img" @tap.stop.prevent="toSliderUrl(item.ad.target_type, item.ad.target_id)" mode="widthFix"></image>
                      </block>
                      <block v-else>
                        <view class="ad-content">
                          <ad :adpid="item.ad.unit"></ad>
                        </view>
                      </block>
                    </view>
                    <view class="post-list-gap" v-if="item.ad"></view>
                    <!-- #endif -->
                  </block>
                </view>

                <u-popup :show="rewardPopup" @close="shutReward" :zIndex="99999991009">
                  <view class="reward-add-box">
                    <image class="reward-add-box-image"
                           :src="config_img.reward_select" mode="aspectFill"/>
                    <view class="reward-add-input-box">
                      <text class="_text">¥</text>
                      <input class="reward-add-input" @input="rewardPriceChange" :value="rewardPrice"
                             placeholder-class="_input_place_holder" type="digit"
                             placeholder="在这里输入充电金额"/>
                    </view>
                    <view class="reward-add-box-view">
                      <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'"
                            data-price="2">¥2
                      </view>
                      <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'"
                            data-price="6">¥6
                      </view>
                      <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'"
                            data-price="8">¥8
                      </view>
                      <view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'"
                            data-price="18">¥18
                      </view>
                    </view>
                    <view class="reward-add-box-btn" @tap.stop.prevent="onOpenExceptionalAccountCheck">确认充电</view>
                  </view>
                </u-popup>

                <u-popup :show="payContentPopup" @close="shutPayContent" :zIndex="99999991009">
                  <block v-if="payContentObj && payContentObj.price > 0">
                    <view class="pay_content_box">
                      <view class="title">
                        <view :class="'mini-icon ' + (payContentObj.pay_type == 1 ? 'mini-xueyuan-fufeikecheng' : 'mini-jinbi2') "></view>
                        付费内容
                      </view>
                      <view class="pay_for_item price">
                        <text class="_text">价格：</text>
                        <block v-if="payContentObj.vip_price >= 0">
                          <view class="pay_for_item_num vip_price">{{ payContentObj.vip_price + payContentObj.credit }}
                            <view class="vip_price_tip">会员价</view>
                          </view>
                        </block>
                        <block v-else>
                          <view class="pay_for_item_num">{{ payContentObj.price + payContentObj.credit }}</view>
                        </block>
                      </view>
                      <view class="pay_for_item rest">
                        <text class="_text">剩余篇幅：</text>
                        <view class="pay_for_item_num">{{ payContentObj.rest }}%</view>
                      </view>
                      <view class="pay_for_item has_hidden">
                        <text class="_text">隐藏内容：</text>
                        <view class="pay_for_item_num">{{ payContentObj.has_hidden }}字符</view>
                      </view>
                      <view class="pay_for_item has_file">
                      	<text class="_text">隐藏图片：</text>
                      	<view class="pay_for_item_num">{{ payContentObj.has_img }}</view>
                      </view>
                      <view class="pay_for_item has_file">
                      	<text class="_text">隐藏视频：</text>
                      	<view class="pay_for_item_num">{{ payContentObj.has_video }}</view>
                      </view>
                      <view class="pay_for_item has_file">
                      	<text class="_text">隐藏附件：</text>
                      	<view class="pay_for_item_num">{{ payContentObj.has_file }}</view>
                      </view>
                      <view class="buy_button" @tap.stop.prevent="payPost">立即购买</view>
                      <view class="tips">虚拟物品存在可复制性，请谨慎购买，不可退货，若不慎被骗，请立即举报并说明原因</view>
                    </view>
                  </block>
                </u-popup>

                <view :class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
                  <view @tap.stop.prevent="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
                  <view class="dialog_container">
                    <view class="dialog_box_title">
                      {{ exceptionalCount }}次充电
                      <i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward"/>
                    </view>
                    <scroll-view :scroll-y="true" class="dialog_comments" enhanced
                                 :show-scrollbar="false" lower-threshold="0">
                      <view class="dialog_conent">
                        <view class="reward-user-box" v-for="(item, index) in exceptionalList"
                              :key="item.rindex">
                          <view class="reward-user-avatar-view" hover-class="none" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
                            <image class="reward-user-avatar-image" compression="avatar"
                                   mode="aspectFill" :src="item.user.user_avatar"></image>
                            <view class="reward-user-right">
                              <view class="reward-user-name">{{ item.user.user_name }}</view>
                              <view class="reward-user-date">{{ item.exceptional_date }}
                              </view>
                            </view>
                          </view>

                          <view class="reward-user-price">
                            充电了￥
                            <u-count-to :endVal="item.exceptional_price" color="#FA5150" fontSize="46"></u-count-to>
                          </view>
                        </view>
                      </view>
                    </scroll-view>
                  </view>
                </view>

                <view :class="'dialog ' + (bounced ? 'dialog_show' : '')">
                  <view @tap.stop.prevent="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
                  <view class="dialog_container">
                    <view class="dialog_conent">
                      <view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除
                      </view>
                      <view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消</view>
                    </view>
                  </view>
                </view>

                <view :class="'dialog ' + (showShare ? 'dialog_show' : '')">
                  <view @tap.stop.prevent="onClickShare" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
                  <view class="dialog_container">
                    <view class="dialog_conent">
                      <view class="dialog_box">
                        <button open-type="share" class="dialog_btn">
                          <i class="mini-icon mini-weixin1"></i>
                          微信好友
                        </button>
                        <view @tap.stop.prevent="sharePosterClick" class="dialog_btn">
                          <i class="mini-icon mini-haibao"></i>
                          海报
                        </view>
                      </view>
                      <view @tap.stop.prevent="onClickShare" class="cancel-btn">取消</view>
                    </view>
                  </view>
                </view>

                <view :class="showComments ? 'dialog_show' : ''">
                  <view @tap.stop.prevent="toShutComments" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
                  <view class="dialog_container">
                    <view class="dialog_box_title">
                      评论 {{ commentCount > 999 ? filters.toFix(commentCount) : commentCount }}
                      <i class="mini-icon mini-shanchu2" @tap.stop.prevent="toShutComments"/>
                    </view>
                    <comment-scroll unicom-id="commentScroll_10_0" ref="commentScroll" :postsId="postsId" @tapComment="tapComment"></comment-scroll>
                    <comment-form unicom-id="commentForm_10_0" ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick"
                                  @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' "></comment-form>
                  </view>
                </view>
              </block>
            </ls-skeleton>
            <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
          </view>
        </view>
        <block v-if="currentData == 1">
          <ls-skeleton :loading="topicload">
            <view @tap.stop.prevent="toSliderUrl(2, item.id)" class="area-club" :data-id="item.id" v-for="(item, index) in cats" :key="index">
              <view>
                <image class="image circle_shape" mode="aspectFill" :src="item.head_portrait"></image>
              </view>

              <view class="area-club-info">
                <view class="area-club-name">
                  {{ item.circle_name }}
                </view>
                <view class="area-club-creater">
                  <text class="_text">{{ item.posts_count }}条笔记</text>
                  <view class="shu"></view>
                  <text class="_text">{{ item.user_circle_count }}人讨论</text>
                </view>
                <view class="mt-6">
                  <text class="_text">简介：</text>
                  {{ item.circle_introduce }}
                </view>
              </view>
            </view>
          </ls-skeleton>
          <u-loadmore l-class="l-loadmore-two" :show="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
        </block>
        <block v-if="currentData == 2">
          <ls-skeleton :loading="topicload" :rows="1" :avatar="true" avatar-size="80rpx" avatar-shape="circle" l-class="topic-skeleton">
            <block v-for="(item, index) in userList" :key="index">
              <view @tap.stop.prevent="toSliderUrl(4, item.id)" class="user-item" :data-uid="item.id">
                <image class="avatars" :lazyLoad="true" mode="aspectFill" :src="item.user_avatar"></image>
                <view class="infos">
                  <view class="titles">
                    <view class="nickname">
                      <text class="_text">{{ item.user_name }}</text>
                    </view>
                  </view>
                  <view class="intro">{{ item.user_introduce || '这个人太懒什么也没说..' }}</view>
                </view>
              </view>
            </block>
          </ls-skeleton>
          <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>
        </block>
        <u-empty class="empty-view" width="300" height="300" textSize="28" text="空" v-if="isNull" />
        <view style="height: 5vh;"></view>
      </view>
      <post-share unicom-id="postShare_10_0" :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast unicom-id="mytotast_10_0" ref="mytoast" :isdistance="true" :toast="mytoast_data" @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
    </view>
  </view>
</template>

<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

import SingleItem from "@/pages/sticky/components/single-item";
import UserInfo from "@/pages/sticky/components/user-info";
import PostContent from "@/pages/sticky/components/post-content";
import CommentForm from "@/pages/sticky/components/comment-form";
import CommentScroll from "@/pages/sticky/components/comment-scroll";
import PostFooter from "@/pages/sticky/components/post-footer";
import PostShare from "@/pages/sticky/components/post-share";
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const common = require('@/mixins/common');
const circle = require('@/mixins/circle');
const user = require('@/mixins/user');
const forum = require('@/mixins/forum');

var options = {};

common(options);
user(options);
circle(options);
forum(options);

export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,lsSkeleton,
	
	
    SingleItem,
    UserInfo,
    PostContent,
    CommentForm,
    CommentScroll,
    PostFooter,
    PostShare,
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
    config_about_name: {
      get() {
        let that = this;
        return that.$store.state.config.about.name;
      },
      set(v) {}
    },
    config_about_logo: {
      get() {
        let that = this;
        return that.$store.state.config.about.logo;
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 10,
      postsId: 0,
      commentFormShow: 0,
      commentCount: 0,
      exceptionalCount: 0,
      maxLen: 200,
      searchViewVisible: true,

      tabs: [
        {
          title: '内容',
          tabIndex: 0,
          cont: 0
        },
        {
          title: '圈子',
          tabIndex: 1,
          cont: 0
        },
        {
          title: '用户',
          tabIndex: 2,
          cont: 0
        }
      ],

      currentData: 0,
      topicload: true,
      posts: [],
      loadmoreShow: false,
      isLastPage: false,
      postsPage: 1,
      cats: [],
      catsPage: 1,
      userList: [],
      userPage: 1,
      page: 1,
      hots: [],
      isNull: false,

      delSearchS: false,
      myhots: [],
      myhotsSat: true,
      keyword: '',
      popupshow: false,
      preKeyword: '',

      rewardPopup: false,
      payContentPopup: false,
      payContentObj: null,
      rewardPrice: '',
      rewardDialog: false,
      exceptionalList: [],
      bounced: false,
      showShare: false,
      showComments: false,
      replyName: '',
      rowPostSkeleton: [],
      real_time_posts_show: false,
      real_time_posts: [],
      real_time_posts_time: '',
      showSharePopup: 0,
	  
	  hits: {
		text: '',
		img: '',
		title: '',
		desc: '',
		type: '',
		target: ''
	  }
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    // skeleton
    that.rowPostSkeleton = that.$store.state.skeleton.rowPost;

    that.searchHotList();
    that.mySearchList();
    that.realtimePosts();

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
      query.keyword = unescape(query.keyword.replace('/u', '%u'));
      that.fph = true;
      that.setData({
        keyword: query.keyword
      });
      that.onSearchConfirm();
    } else {
      if (options && options.keyword !== undefined) {
        that.setData({
          keyword: options.keyword
        });
        that.onSearchConfirm();
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(10, 0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (!that.searchViewVisible) {
      let type = that.currentData;
      let page = 1;

      if (type == 0) {
        page = that.postsPage + 1;
      } else if (type == 1) {
        page = that.catsPage + 1;
      } else if (type == 2) {
        page = that.userPage + 1;
      }

      that.setData({
        loadmoreShow: true,
        isLastPage: false,
        page: page
      });
      that.indexSearch();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from == 'button') {
      let share_title = that.$store.state.config.share.format.app_share_post;
      let share_img = '';

      for (let index = 0; index < this.posts.length; index++) {
        const post = this.posts[index];

        if (post.id == Math.abs(this.postsId)) {
          share_title = share_title.replace('[post_content]', post.posts_content_raw).replace('[author_name]', post.user.user_name);

          share_img = post.share_img;

          break;
        }
      }

      share_title = share_title.replace(/<[^>]*?>/g, '');
      return {
        title: share_title,
        path: '/pages/sticky/sticky?id=' + Math.abs(that.postsId) + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
        imageUrl: share_img
      };
    } else {
      let share_title = that.$store.state.config.share.format.app_share_search;
      share_title = share_title.replace('[search_content]', this.keyword);
      return {
        title: share_title,
        path: '/pages/common/search?keyword=' + this.keyword + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
        imageUrl: ''
      };
    }
  },
  onShareTimeline: function (res) {
    let that = this;
    let share_title = that.$store.state.config.share.format.app_share_search;
    share_title = share_title.replace('[search_content]', this.keyword);
    return {
      title: share_title,
      query: 'keyword=' + this.keyword + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  onPullDownRefresh: function () {
      uni.stopPullDownRefresh();
  },
  methods: {
    realtimePosts() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'realtime/top/posts').then(function (res) {
        if (res.status) {
          that.setData({
            real_time_posts: res.data.posts,
            real_time_posts_show: true,
            real_time_posts_time: res.data.format_time
          });
        }
      });
    },
    myDelSearch(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myDelSearch', {
        id: e.currentTarget.dataset.id
      }).then(function (res) {
        if (res.status) {
          let myhots = that.myhots;
          let args = {};
          myhots.splice([index], 1);
          args.myhots = myhots;
          that.setData(args);
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    searchHotList() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'search/hot/list').then(function (res) {
        let args = {};
        args.hots = res.data;
        args.hotSearchLoad = false;
        that.setData(args);
      });
    },
    //用户搜索列表
    mySearchList() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'search/my/list').then(function (res) {
        if (res.status) {
          let args = {};

          if (res.data.length <= 0) {
            args.myhotsSat = false;
          }

          args.myhots = res.data;
          that.setData(args);
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },
    //用户删除全部搜索记录
    myDelAllSearch() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myDelAllSearch').then(function (res) {
        if (res.status) {
          uni.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 1500
          });
          that.mySearchList();
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      });
    },

    //储存用户输入的搜索词
    onSearchInput: function (e) {
      this.setData({
        keyword: e.detail.value
      });
    },

    //清空搜索词
    onClearBtnClick() {
      this.setData({
        keyword: '',
        searchViewVisible: true
      });
      this.mySearchList();
    },

    //切换搜索
    checkCurrent: function (e) {
      let that = this;
      let type = e.currentTarget.dataset.index;
      that.setData({
        currentData: type,
        isNull: false
      });
      let page = 0;

      if (type == 0 && that.posts.length <= 0) {
        page = that.postsPage;
      } else if (type == 1 && that.cats.length <= 0) {
        page = that.catsPage;
      } else if (type == 2 && that.userList.length <= 0) {
        page = that.userPage;
      }

      if (page != 0) {
        that.setData({
          topicload: true,
          page: page,
          loadmoreShow: false
        });
        that.indexSearch();
      }
    },

    //搜索
    onSearchConfirm: function () {
      let that = this;
      that.setData({
        page: 1,
        posts: [],
        postsPage: 1,
        cats: [],
        catsPage: 1,
        userList: [],
        userPage: 1,
        isNull: false,
        loadmoreShow: false
      });
      that.indexSearch();
      that.searchCount();
    },

    //取消返回页面
    onCancelBtnClick: function () {
      uni.wen.toUrl(-2, 0, null);
    },

    //热门搜索点击事件
    searchStat: function (e) {
      let keyword = e.currentTarget.dataset.name;
      this.setData({
        keyword: keyword,
        posts: [],
        postsPage: 1,
        cats: [],
        catsPage: 1,
        userList: [],
        userPage: 1,
        popupshow: false,
        isNull: false
      });
      this.indexSearch();
      this.searchCount();
    },

    delSearch() {
      this.setData({
        delSearchS: !this.delSearchS
      });
    },
    // 搜索接口

    indexSearch() {
      let that = this;
      let type = that.currentData;
	  uni.loading(true);
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'index/search', {
        keyword: that.keyword,
        type: type,
        page: that.page
      }).then(function (res) {
		uni.loading(false);
		
		if(res.status){
			if(res.data.current_page != that.page){
				return false;
			}
			let data = res.data;
			let args = {};
			
			if (data.data.length <= 0 && that.page == 1) {
			  args.isNull = true;
			}
			
			if (data.data.length == 0) {
			  args.isLastPage = true;
			} else if (type == 0) {
			  args.posts = that.posts.concat(data.data);
			  args.postsPage = data.current_page;
			} else if (type == 1) {
			  args.cats = that.cats.concat(data.data);
			  args.catsPage = data.current_page;
			} else if (type == 2) {
			  args.userList = that.userList.concat(data.data);
			  args.userPage = data.current_page;
			}
			
			args.topicload = false;
			args.searchViewVisible = false;
			that.setData(args);
		}
		
      });
    },

    searchCount() {
      let that = this;
      uni.wen.util.request(uni.wen.api.ApiRootUrl + 'search/count', {
        keyword: that.keyword
      }).then(function (res) {
		if(res.status){
			let tabs = that.tabs;
			(tabs[0].cont = res.data.posts_count), (tabs[1].cont = res.data.circle_count), (tabs[2].cont = res.data.user_count);
			let args = {};
			args.tabs = tabs;
			args.hits = res.data.hits;
			
			that.setData(args);
		}else{
			
		}
      });
    },


    //跳转搜索
    toSearchKeyword(keyword) {
      uni.wen.toUrl(6, '/pages/common/search?keyword=' + keyword, null);
    }

  }
};
</script>
<style lang="scss">
@import '@/pages/template/circle.scss';

.statusBarHeigth {
  top: 0;
  width: 100%;
  @include background_color(page-box-background-color);
  z-index: 999;
}

.search-form {
  display: block;
  width: 100%;
  height: 100%;
}

.search-form-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  @include background_color(page-box-background-color);
  z-index: 11;
}

.search-box {
  flex: 1;
  height: 60rpx;
  padding: 0 14rpx 0 18rpx;
  border-radius: $uni-border-radius-base;
  display: flex;
  align-items: center;
  @include background_color(page-box-item-background-color);
}

.search-btn {
  border: none;
  background: none;
  font-size: $uni-font-size-lg;
  @include color(color-light-dark);
}

.search-box .search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 14rpx;
}

.search-box .input {
  flex: 1;
  font-size: $uni-font-size-base;
  @include color(color-light-dark);
}

.search-box .placeholder {
  font-size: $uni-font-size-base;
  @include color(color-lightest-dark);
}

button::after {
  border-radius: 0;
  border: none;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: none;
  border: none;
  padding: 0;
  width: 64rpx;
  height: 64rpx;
}

.icon-btn .icon {
  display: block;
  width: 32rpx;
  height: 32rpx;
}

.tabs {
  position: fixed;
  z-index: 99;
  overflow: hidden;
  @include background_color(page-box-background-color);
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.tab,
.tabs {
  height: 70rpx;
  line-height: 70rpx;
}

.tab-search-count {
  display: inline-block;
}

.tab {
  width: 50%;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  font-family: PingFangSC-Regular;
  font-size: $uni-font-size-sm-base;
  @include color(color-lightest-dark);
  font-weight: 450;
  letter-spacing: 1.12px;
}

.tabnew {
  font-family: PingFangSC-Medium;
  font-size: $uni-font-size-medium;
  @include color(color-lighter-dark);
  font-weight: bold;
  letter-spacing: 1.29px;
}

.line-search {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 6rpx;
  background: $uni-color-primary;
  border-radius: 6rpx;
}

.resultList {
  padding-top: 70rpx;
}

.area-club {
  width: 100%;
  height: 200rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.area-club:last-child {
  margin-bottom: 20rpx;
}

.l-loadmore-two {
  margin-bottom: 100rpx;
}

.area-club .image {
  width: 96rpx;
  height: 96rpx;
  // border-radius: 50%;
  margin-left: 30rpx;
  margin-right: 16rpx;
}

.area-club-name {
  font-size: $uni-font-size-base;
  @include color(color-light-dark);
  width: 420rpx;
  white-space: nowrap;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

.area-club-name .mini-icon {
  color: $uni-color-primary;
  font-size: $uni-font-size-medium;
  margin-right: 10rpx;
}

.area-club-image {
  width: 38rpx;
  height: 38rpx;
  margin-right: 8rpx;
}

.area-club-creater {
  display: flex;
  align-items: center;
  font-size: $uni-font-size-sm;
  ._text{
  	@include color(color-light-dark);
  }
}

.shu {
  width: 3rpx;
  height: 18rpx;
  background: $uni-color-primary;
  margin: 0 10rpx;
}

.mt-6 {
  font-size: $uni-font-size-sm;
  @include color(color-lightest-dark);
  margin: 6rpx 0;
  width: 520rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button {
  margin: 0;
  padding: 0;
  line-height: normal;
  background-color: transparent;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  height: 140rpx;
}

.user-item .avatars {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  @include background_color(page-box-item-background-color);
}

.user-item .infos {
  flex: 1;
  margin: 0 30rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-item .titles {
  display: flex;
  align-items: center;
}

.user-item .nickname {
  flex: 1;
  line-height: 50rpx;
  height: 50rpx;
  font-size: $uni-font-size-medium;
  width: 100%;
  @include color(color-light-dark);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.user-item .nickname text {
  line-height: 50rpx;
  height: 50rpx;
}

.user-item .intro {
  height: 44rpx;
  line-height: 44rpx;
  width: 100%;
  font-size: $uni-font-size-sm;
  @include color(color-lightest-dark);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.hit_search {
  padding: 20rpx 40rpx 0;
}

.hit_search2 {
  padding: 40rpx 40rpx 0;
}

.split-line {
  margin-top: 40rpx;
  border-bottom: 1px solid;
  @include border_color(border-color-box-item-background-color);
}

.top_ten_posts {
  margin: 20rpx 20rpx 0;
  @include background_image(background-image-primary);
  padding: 20rpx;
  border-radius: 20rpx;

  .stitle {
    display: flex;
    justify-content: space-between;
    height: 40rpx;
    line-height: 40rpx;

    .left {
      display: flex;

      .logo {
        image {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
        }

        margin-right: 10rpx;
      }

      .ago {
		transform: scale(0.8) translateX(-20%);
        @include color(color-lightest-est-er-dark);
        margin-left: 22rpx;
        font-size: 22rpx;
        border: 0.5rpx solid;
		@include border_color(color-lightest-est-er-dark);
        padding: 0 10rpx;
        border-radius: 6rpx;
        font-weight: normal;
      }
    }
  }

  .item {
    display: flex;
    height: 80rpx;
    line-height: 80rpx;

    .order {
      font-size: $uni-font-size-medium;
      margin-right: 20rpx;
      color: #d1d1d1;
      font-weight: 600;
      width: 30rpx;
      min-width: 30rpx;
      text-align: right;
    }

    .order.order_1 {
      color: #fb5835;
    }

    .order.order_2 {
      color: #fe6434;
    }

    .order.order_3 {
      color: #ffaa02;
    }

    .post {
      font-size: $uni-font-size-sm-base;
      margin-right: 10rpx;
      max-width: 540rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
	  @include color(color-darkest);
    }

    .icon {
      width: 30rpx;
      height: 30rpx;
      min-width: 30rpx;
      min-height: 30rpx;
      max-width: 30rpx;
      max-height: 30rpx;
      line-height: 30rpx;
      border-radius: 6rpx;
      color: #fff;
      font-size: 21rpx;
      margin-top: 22.5rpx;
      text-align: center;
    }

    .icon.new {
      background-color: #ff9e3d;
    }

    .icon.hot {
      background-color: #fd6e46;
    }
  }
}

.stitle {
  font-size: $uni-font-size-base;
  @include color(color-dark);
  letter-spacing: 1.2rpx;
  margin-bottom: 20rpx;
  font-weight: 600;
}

.keywords {
  position: relative;
  @include color(color-lightest-dark);
  display: inline-block;
  @include background_color(page-box-item-background-color);
  border-radius: $uni-border-radius-lg-est;
  padding: 14rpx 33rpx;
  margin: 20rpx 20rpx 0 0;
  max-width: 260rpx;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22rpx;
  animation: fadeIn 0.6s ease;
}

.hit_words {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-height: 450rpx;
}

.stitle-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stitle-box .stitle-img {
  display: inline;
  width: 38rpx;
  height: 38rpx;
  font-size: 38rpx;
  align-self: center;
  @include color(color-light-dark);
}

.stitle-delbox {
  font-size: $uni-font-size-sm;
  @include color(color-lightest-dark);
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.stitle-delbox .shu {
  height: 20rpx;
  width: 3rpx;
  background: $uni-text-color-grey;
  margin: 20rpx;
}

.audio-img {
  position: absolute;
  z-index: 99;
  width: 30rpx;
  height: 30rpx;
  top: -10rpx;
  right: -10rpx;
  display: inline;
  font-size: $uni-font-size-medium;
  color: $uni-color-error;
}


.hit-word-box{
	height: 120rpx;
	@include background_color(page-box-background-color);
	padding: 20rpx 0;
	.inner{
		width: $page-content-body-width;
		margin: auto;
		justify-content: space-between;
		.left{
			justify-content: center;
			._image{
				width: 120rpx;
				height: 120rpx;
				transform: scale(0.6);
			}
		}
		.right{
			width: 580rpx;
			justify-content: space-between;
			.title-area{
				justify-content: center;
				.title{
					font-size: $uni-font-size-base;
					@include color(color-light-dark);
					margin-bottom: 10rpx;
				}
				.desc{
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);
				}
			}
			
			.icon{
				justify-content: center;
				.mini-icon{
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);
				}
			}
		}
	}
}

</style>
