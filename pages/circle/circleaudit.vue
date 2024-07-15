<template>
  <view
      :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
      :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
      <ls-skeleton :loading="topicload" :skeleton="postsSkeleton">
        <block v-if="posts.length > 0">
          <view class="post-wrap" v-for="(item, index) in posts" :key="index">
            <view class="topic-detail-view">
              <block v-if="item.post_type == 'single'">
                <single-item :single="item"></single-item>
              </block>
              <block v-else>
                <view class="topic-panel" :id="'media_' + item.id">
                  <view class="user-info-view">
                    <user-info :user="item.user" :format_time="item.format_time" :ip_address="item.ip_address" :distance="item.distance" :device="item.device"
                               :post_top="item.post_top">
                      <view class="user-rigth" slot="right">
                        <block v-if="!item.is_my_posts">
                          <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id" :data-index="index" class="follow-view" v-if="!item.is_follow_user">
                            关注
                          </view>
                          <view @tap.stop.prevent="postsActionFollow" :data-userid="item.user.id"
                                :data-index="index" class="follow-view folled" v-else-if="item.is_follow_user">
                            已关注
                          </view>
                        </block>
                        <i @tap.stop.prevent="editTap"
                           :data-ismyposts="item.is_my_posts"
                           :data-iscollect="item.is_collect" :data-isexamine="item.is_examine" :data-isblur="item.is_blur" :data-isSticky="item.is_sticky"
                           :data-index="index"
                           class="mini-icon mini-diandiandain follow-image"
                           :data-id="item.id"></i>
                      </view>
                    </user-info>

                  </view>

                  <block v-if="!item.is_delete">
                    <post-content :words="item" :postIndex="index" :scene="11" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall"
                                  @pSelectVote="selectVote" @forceUpdate="forceUpdate"></post-content>
                  </block>
                </view>
              </block>
            </view>
            <view class="post-list-gap" v-if="index != (posts.length - 1)"></view>
          </view>
        </block>
        <block v-else>
          <u-empty text="空" width="300" height="300" text-size="28"/>
        </block>
      </ls-skeleton>

      <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" iconSize="28" fontSize="28" color="#989898"/>

      <view :class="'dialog ' + (showDialog ? 'dialog_show' : '')">
        <view @tap.stop.prevent="onClickCancle" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
        <view class="dialog_container">
          <view class="dialog_conent">
            <view @tap.stop.prevent="passTap" data-isposts="0" class="select-item">通过</view>
            <view @tap.stop.prevent="rejectedTap" data-isposts="1" class="delete-btn">驳回</view>
            <view @tap.stop.prevent="onClickCancle" class="cancel-btn">取消</view>
          </view>
        </view>
      </view>

      <view :class="'dialog ' + (isRejected ? 'dialog_show' : '')">
        <view @tap.stop.prevent="onRejected" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
        <view class="dialog_container">
          <view class="dialog_conent">
            <view class="item">
              <text class="item-title">驳回原因</text>
              <textarea @input="onInputChange" class="item-area" :data-type="2" :maxlength="descMaxLength" placeholder="请填写驳回原因" :value="reject_msg"></textarea>
              <text class="item-tip">{{ descLength }}/{{ descMaxLength }}</text>
            </view>
            <view @tap.stop.prevent="yesRejected" class="delete-btn" id="delete">确认驳回</view>
            <view @tap.stop.prevent="onRejected" class="cancel-btn">取消</view>
          </view>
        </view>
      </view>
      <hover-ball v-if="isOfficial > 1"/>
      <my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data" @postfeedback="postFeedback"></my-toast>
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

import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const mixins = require('@/mixins/circle');
const common = require('@/mixins/common');
const forum = require('@/mixins/forum');

var options = {};
mixins(options);
common(options);
forum(options);
export default {
  mixins: [{ methods: options }],
  components: {
	myToast,navBar,hoverBall,lsSkeleton,
	
	
    UserInfo,
    PostContent,
    SingleItem,
    contextualPopup
  },
  computed: {
    postsSkeleton: {
      get() {
        let that = this;
        return that.$store.state.skeleton.rowPost;
      },
      set(v) {}
    },
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 20,
      postsId: 0,
      commentFormShow: 0,
      commentCount: 0,
      exceptionalCount: 0,
      notice: true,
      type: 999,
      page: 1,
      auditPostsList: [],
      posts: [],
      topicload: true,
      loadmoreShow: false,
      isLastPage: false,
      isRejected: false,
      descMaxLength: 300,
      descLength: 0,
      reject_msg: '',
      id: '',
      isPosts: '',
      showDialog: false,

      popupshow: '',
      vutad: '',

      tag: {
        tags_name: '',
        id: ''
      },
      showSharePopup: 0,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.globalOnloadProcess(options);
    that.setData({
      id: options.id
    });
    that.postsByCircleId(options.id, that.type, that.page, false);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.updateScene(20, 0);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      postsId: 0,
      commentFormShow: 0,
      auditPostsList: [],
      posts: [],
      topicload: true,
      loadmoreShow: false
    });
    that.postsByCircleId(that.id, that.type, 1, false);
    uni.hideNavigationBarLoading();
    uni.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      loadmoreShow: true,
      isLastPage: false
    });
    that.postsByCircleId(that.id, that.type, that.page + 1, false);
  },
  methods: {
    onClickCancle() {
      this.setData({
        showDialog: !this.showDialog
      });
      uni.$store.commit('popopChange', false);
    },
    editTap(e) {
      let that = this;
      that.setData({
        postsIndex: e.currentTarget.dataset.index,
        showDialog: !that.showDialog,
        postsId: e.currentTarget.dataset.id,
        isSticky: e.currentTarget.dataset.issticky,
        isMyPosts: e.currentTarget.dataset.ismyposts,
        isCollect: e.currentTarget.dataset.iscollect,
        isExamine: e.currentTarget.dataset.isexamine,
        isBlur: e.currentTarget.dataset.isblur
      });
      uni.$store.commit('popopChange', true);
    },
    onInputChange: function (t) {
      var o = t.detail.value;
      this.setData({
        reject_msg: o,
        descLength: o.length
      });
    },

    passTap(e) {
      let that = this;
      that.setData({
        isPosts: e.currentTarget.dataset.isposts
      });
      that.userAuditPosts();
    },

    rejectedTap(e) {
      let that = this;
      that.setData({
        isPosts: e.currentTarget.dataset.isposts,
        showDialog: false,
        isRejected: true
      });
    },

    yesRejected() {
      let that = this;

      if (that.descLength == 0) {
        uni.showToast({
          title: '请填写驳回原因！',
          icon: 'none'
        });
      } else {
        that.userAuditPosts();
      }
    },

    onRejected() {
      this.setData({
        isRejected: false
      });
    },


  }
};
</script>
<style lang="scss">
@import './circleaudit.scss';
</style>
