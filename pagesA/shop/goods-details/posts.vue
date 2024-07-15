<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <view class="topic-list">
        <ls-skeleton :loading="topicload" :skeleton="rowPostSkeleton" :animate="true">
          <block name="circle">
            <view class="post-wrap" v-for="(item, index) in posts" :key="index">
              <contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
                <view class="topic-detail-view" slot="content">
                  <block v-if="item.post_type == 'single'">
                    <single-item :single="item" />
                  </block>
                  <block v-else>
                    <view class="topic-panel" :id="'media_' + item.id">
                      <view class="user-info-view">
                        <user-info :user="item.user"
                                   :format_time="item.format_time"
                                   :ip_address="item.ip_address"
                                   :distance="item.distance"
                                   :device="item.device"
                                   :post_top="item.post_top"
                        >
                          <view class="user-rigth" slot="right">
                            <block v-if="item.fields && item.fields.contact_phone">
                              <view @tap.stop.prevent="toSliderUrl(22, item.fields.contact_phone)" class="follow-view">
                                <i class="mini-icon mini-dianhua inline"></i>拨打
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

                      <post-content :words="item" :postIndex="index" :scene="13" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall"
                                    @forceUpdate="forceUpdate" @pSelectVote="selectVote"></post-content>
                      <post-footer @tapShare="tapShare" @taplikes="taplikes" @tapComment="tapComments" @tapCollect="tapCollect" @tapReward="tapReward" @tapGiveCoin="tapGiveCoin"
                                   :words="item" :index="index"></post-footer>

                      <view class="reward-box" v-if="item.exceptional && item.exceptional.length > 0" :data-id="item.id"
                            @tap="onClickReward" :data-ecount="item.exceptional_count">
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
            </view>


            <u-popup :show="rewardPopup" @close="shutReward" >
              <view class="reward-add-box">
                <image class="reward-add-box-image" :src="config_img.reward_select" mode="aspectFill"/>
                <view class="reward-add-input-box">
                  <text class="_text">¥</text>
                  <input class="reward-add-input" @input="rewardPriceChange" :value="rewardPrice" placeholder-class="_input_place_holder" type="digit" placeholder="在这里输入充电金额"/>
                </view>
                <view class="reward-add-box-view">
                  <view @tap="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'" data-price="2">¥2</view>
                  <view @tap="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'" data-price="6">¥6</view>
                  <view @tap="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'" data-price="8">¥8</view>
                  <view @tap="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'" data-price="18">¥18</view>
                </view>
                <view class="reward-add-box-btn" @tap="onOpenExceptionalAccountCheck">确认充电</view>
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
              <view @tap="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
              <view class="dialog_container">
                <view class="dialog_box_title">
                  {{ exceptionalCount }}次充电
                  <i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward"/>
                </view>
                <scroll-view :show-scrollbar="false" :scroll-y="true" class="dialog_comments" enhanced lower-threshold="0">
                  <view class="dialog_conent">
                    <view class="reward-user-box" v-for="(item, index) in exceptionalList" :key="item.rindex">
                      <view class="reward-user-avatar-view" hover-class="none" @tap.stop.prevent="toSliderUrl(4, item.user.id)">
                        <image class="reward-user-avatar-image" compression="avatar" mode="aspectFill" :src="item.user.user_avatar"></image>
                        <view class="reward-user-right">
                          <view class="reward-user-name">{{ item.user.user_name }}</view>
                          <view class="reward-user-date">{{ item.exceptional_date }}
                          </view>
                        </view>
                      </view>

                      <view class="reward-user-price">
                        充电了￥
                        <u-count-to :endVal="item.exceptional_price" :decimals="2" color="#FA5150" fontSize="46"></u-count-to>
                      </view>
                    </view>
                  </view>
                </scroll-view>
              </view>
            </view>

            <view :class="'dialog ' + (bounced ? 'dialog_show' : '')">
              <view @tap="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
              <view class="dialog_container">
                <view class="dialog_conent">
                  <view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除</view>
                  <view @tap="bouncedTap" class="cancel-btn">取消</view>
                </view>
              </view>
            </view>

            <view :class="'dialog ' + (showShare ? 'dialog_show' : '')">
              <view @tap="onClickShare" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
              <view class="dialog_container">
                <view class="dialog_conent">
                  <view class="dialog_box">
                    <button open-type="share" class="dialog_btn">
                      <i class="mini-icon mini-weixin1"></i>微信好友
                    </button>
                    <view @tap.stop.prevent="sharePosterClick" class="dialog_btn">
                      <i class="mini-icon mini-pengyouquan"></i>朋友圈
                    </view>
                  </view>
                  <view @tap="onClickShare" class="cancel-btn">取消</view>
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
                <comment-scroll unicom-id="commentScroll_74_0" ref="commentScroll" :postsId="postsId" @tapComment="tapComment"></comment-scroll>
                <comment-form unicom-id="commentForm_74_0" ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick"
                              @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' "></comment-form>
              </view>
            </view>
          </block>
        </ls-skeleton>
        <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>

        <block v-if="!topicload && posts.length <= 0">
          <u-empty text="空" width="300" height="300" text-size="28"/>
        </block>
      </view>
      <view @tap="refreshEvent" class="refresh">
        <i class="mini-icon mini-xunhuan"></i>
      </view>
      <post-share unicom-id="postShare_74_0" :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast unicom-id="mytotast_74_0" ref="mytoast" :isdistance="true" :toast="mytoast_data" @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
    </view>
  </view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import SingleItem from "@/pages/sticky/components/single-item";
import UserInfo from "@/pages/sticky/components/user-info";
import PostContent from "@/pages/sticky/components/post-content";
import CommentForm from "@/pages/sticky/components/comment-form";
import CommentScroll from "@/pages/sticky/components/comment-scroll";
import PostFooter from "@/pages/sticky/components/post-footer";
import PostShare from "@/pages/sticky/components/post-share";
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const common = require('@/mixins/common');
const forum = require('@/mixins/forum');
const user = require('@/mixins/user');
const shop = require('@/mixins/shop');
var options = {};

common(options);
user(options);
forum(options);
shop(options);

export default {
  mixins: [{ methods: options }],

  components: {
	myToast,navBar,hoverBall,

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
    }
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 74,
      id: 0,
      postsId: 0,
      commentFormShow: 0,
      commentCount: 0,
      exceptionalCount: 0,
      page: 1,
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,

      popupshow: '',

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
      showSharePopup: 0,
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

    that.setData({
      id: options.id
    });
    that.getShopGoodsPostsList();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(74, 0);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      page: 1,
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,
      postsId: 0,
      commentFormShow: 0,
    });
    that.getShopGoodsPostsList();
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page: that.page + 1,
      loadmoreShow: true
    });
    that.getShopGoodsPostsList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from == 'button') {
      let share_title = that.$store.state.config.share.format.app_share_post;
      let share_img = '';

      for (let index = 0; index < that.posts.length; index++) {
        const post = that.posts[index];

        if (post.id == Math.abs(that.postsId)) {
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
      return {
        title: that.$store.state.config.share.format.app_share_right,
        path: '/pages/tags/tags' + '?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
        imageUrl: ''
      };
    }
  },
  onShareTimeline: function (res) {
    let that = this;
    return {
      title: that.$store.state.config.share.format.app_share_right,
      query: 'id=' + that.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
      imageUrl: that.$store.state.config.img.default_share
    };
  },
  methods: {
    //刷新方法
    refreshEvent() {
      // this.onPullDownRefresh();
      uni.startPullDownRefresh()
    },
  }
};
</script>
<style lang="scss">
@import './posts.scss';
</style>
