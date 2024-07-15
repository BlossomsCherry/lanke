<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<navBar :back="true" :iconTheme="iconTheme" :home="false"
			:background="global__theme__ == 'black' ? 'rgba(25, 25, 30, ' + navbarTrans + ')' : 'rgba(255, 255, 255, ' + navbarTrans + ')'"
			:color="'rgba(' + color + ', ' + navbarTrans + ')'" :placeholder="false">
			<view slot="center" class="nav_club_center flex-row" :style="'opacity: ' + navbarTrans" @tap.stop.prevent="toSliderUrl(35, detailsInfo.club.id)">
				<image class="nav_avatar" :src="detailsInfo.club.avatar"></image>
				<text class="nav_club_name u-line-1">{{ detailsInfo.club.name }}</text>
				<image class="club-flag" src="../../static/club.png" mode="aspectFill"></image>
			</view>
			<!-- #ifndef MP -->
			<view slot="right" class="lxy-nav-bar__logo">
				<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="inviteUserTap" :style="'color: '+iconTheme+';'"></i>
			</view>
			<!-- #endif -->
		</navBar>
		
		<view class="organize-bureau-details-page">
			<view class="swiper-content">
				<!-- 轮播区 -->
				<view class="swiper-area w-full">
					<swiper class="h-full" :indicator-dots="false" circular="true" duration="400" :current="swiperIdx" :autoplay="(detailsInfo.video_url && detailsInfo.video_url.length > 0) ? false : true" @change="swiperChange">
						<swiper-item v-if=" detailsInfo.video_url && detailsInfo.video_url.length > 0 " class="dflex-c">
							<!-- #ifdef APP -->
							<view class="wh-full pos-r" @tap.stop.prevent="toVideo">
								<image :src="detailsInfo.video_cover" class="wh-full" lazy-load mode="aspectFill"></image>
								<i class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
							</view>
							<!-- #endif -->
			
							<!-- #ifndef APP -->
							<view class="wh-full pos-r dflex-c" style="background: #000;" @tap.stop.prevent="toVideo">
								<video id="uVideo" :src="detailsInfo.video_url" :poster="detailsInfo.video_cover"
									:poster-for-crawler="detailsInfo.video_cover" :show-fullscreen-btn="false" :controls="false"
									:show-play-btn="false" :show-center-play-btn="false" :enable-progress-gesture="false"
									@ended="videoPause = false" object-fit="cover" class="h-full" :autoplay="true" :loop="true" :muted="true" style="width: 100%;"></video>
								<i v-if="videoPause" class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
							</view>
							<!-- #endif -->
						</swiper-item>
						<swiper-item v-for="(item, idx) in detailsInfo.image_urls" :key="idx" v-if="detailsInfo.image_urls && detailsInfo.image_urls.length > 0">
							<view class="wh-full">
								<image :src="item.url" class="wh-full" lazy-load mode="aspectFill" @tap.stop.prevent="swiperClick(idx)"></image>
							</view>
						</swiper-item>
					</swiper>
					<view class="img_tips_count">{{ swiperIdx + 1 }} / {{ detailsInfo.image_urls.length + ( (detailsInfo.video_url && detailsInfo.video_url.length > 0) ? 1 : 0 ) }}</view>
				</view>
			</view>
		
		  <!-- 内容区域 -->
		  <view class="content-wrapper">
			  
			  <view class="price-wrap u-line-1" :style="'background-image: url('+ config2_page_bureau_detail_price +');'">
			  	{{ detailsInfo.least_price_tip }}
			  </view>
			  
			  <view class="inner">
				 <view class="title u-line-2" style="max-width: 580rpx;">{{ detailsInfo.title }}</view>
				 
				 
				 <!-- 俱乐部-->
				 <view class="club-wrapper flex-row" @tap.stop.prevent="toSliderUrl(35, detailsInfo.club.id)" v-if="detailsInfo.club.id > 0">
				   <image :src="detailsInfo.club.avatar" class="club-avatar"></image>
				   <view class="club-name">{{ detailsInfo.club.name }}</view>
				   <image class="club-flag" src="../../static/club.png" mode="aspectFill"></image>
				 </view>
				 
				 <!-- 活动时间 -->
				 <view class="date-wrapper">
				   <u-icon name="clock" size="30"/>
				   <view class="date">{{ detailsInfo.service_time_tip }}</view>
				 </view>
				 
				 <!-- 地址 -->
				 <view class="address-wrapper" @tap.stop.prevent="toSliderUrl(30, detailsInfo.longitude+'|'+detailsInfo.latitude+'|'+detailsInfo.address_detailed+'|8')">
				   <view class="flex-row">
					   <u-icon name="map" size="30"/>
					   <view style="margin-left: 20rpx;">{{ detailsInfo.distance }} {{ detailsInfo.address_detailed }}</view>
				   </view>
				   <image class="map_image" src="../../static/map.png" mode="aspectFill"></image>
				 </view>
				 
				 
				 <!-- 报名卡片 -->
				 <block v-for="(group, gindex) in detailsInfo.groups" :key="gindex" v-if="detailsInfo.groups && detailsInfo.groups.length > 0">
					<view class="enroll-wrapper">
					  <view class="number-wrapper" @tap.stop.prevent="joinUserPopupShow(true)">
					    <view class="left flex-row">
							<view class="group-name">{{ group.name || '第' + (gindex + 1) + '组' }}</view>
							·<view class="group-total">{{ group.member_total }}人已报名</view>
						</view>
					    <view class="right">{{ group.member_rest > 0 ? '剩个'+ group.member_rest +'名额' : '已满坐' }}</view>
					    <u-icon name="arrow-right" :color="primaryColor" size="20"/>
					  </view>
					
					  <!-- 报名用户 -->
					  <view class="user-list-wrapper" v-for="(team, tindex) in group.teams" :key="tindex" v-if="group.teams">
						<block v-for="(member, mindex) in team.member_list" :key="mindex">
							<view :class="['item-wrapper', member.id == detailsInfo.user_id ? 'master' : 'gender-'+member.gender]"  @tap.stop.prevent="toSliderUrl(4, member.id)">
							  <image class="avatar" :src="member.user_avatar"/>
							  <block v-if="member.id == detailsInfo.user_id">
								  <view class="tips">组局人</view>
							  </block>
							  <block v-else>
								<view :class="'gtips flex-column gender-' + member.gender" v-if=" member.gender > 0 ">
									<i class="mini-icon mini-xingbienan" v-if="member.gender == 1"></i>
									<i class="mini-icon mini-xingbienv" v-if="member.gender == 2"></i>
								</view>
							  </block>
							</view>
						</block>
					    
					    <view class="join-wrapper" @tap.stop.prevent="joinTeam(team.id)" v-if="team.members_limit > team.members_num">
					      <u-icon name="plus" size="40" color="#acaeb2"/>
					    </view>
					  </view>
					</view>
				 </block>
				 
				 
			  </view>
		    <!-- 分隔符 -->
		    <view class="gap-wrapper"/>
			<block v-if="detailsInfo.intro">
				<!-- 活动描述 -->
				<view class="desc-wrapper">
					<view class="inner">
						<view class="title">活动描述</view>
						<text class="desc" :selectable="true" :user-select="true">{{ detailsInfo.intro }}</text>
					</view>
				</view>
				<!-- 分隔符 -->
				<view class="gap-wrapper"/>
			</block>
		
			<block v-if="detailsInfo.note">
				<!-- 注意事项 -->
				<view class="note-wrapper">
					<view class="inner">
						<view class="title">注意事项</view>
						<text class="note" :selectable="true" :user-select="true">{{ detailsInfo.note }}</text>
					</view>
				</view>
				<!-- 分隔符 -->
				<view class="gap-wrapper"/>
			</block>
			
			<!-- 注意事项 -->
			<view class="note-wrapper">
				<view class="inner">
					<view class="title">{{ detailsInfo.comment_count || 0 }}条留言
					<view class="comment-add" @tap.stop.prevent="showCommendPopup">写留言</view>
					</view>
					<view class="goods-comment">
						<block v-if="commentList.length">
							<goods-comment v-for="(item, index) in commentList" :key="index" :data="item" @reply="toReply"
								:index="index" ref="comment"></goods-comment>
							<u-loadmore v-if="commentLoadmoreShow" :status="commentIsLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──" :bgClass="''"
								iconSize="28" fontSize="28" color="#989898" />
							<view class="goods-comment_bottom" @tap.stop="loadMoreComment" v-if="!commentLoadmoreShow && !commentIsLastPage">
								查看更多<u-icon name="arrow-right" color="#555555" size="26rpx"></u-icon>
							</view>
						</block>
						<u-empty text="暂无留言" width="300" height="300" text-size="28" v-else />
					</view>
				</view>
			</view>
			<!-- 分隔符 -->
			<view class="gap-wrapper"/>
		
		    <!-- 详情图片 -->
		    <view class="introduce-pic-wrapper">
				<view class="inner">
					<view class="title">详情</view>
				</view>
				<view>
					<mp-html :content="detailsInfo.content" class="bureau-detail-html" :scene="750"></mp-html>
				</view>
		    </view>
		  </view>
		  <view class="bottom-placeholder"/>
		  <!-- 底部导航栏 -->
		  <view class="bottom-wrapper">
		    <view class="left-icon-wrapper">
		      <view class="item-wrapper" @tap.stop.prevent="bureau_chat">
		        <u-icon name="chat" size="44" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"/>
		        <text class="_text" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'">私信</text>
		      </view>
			  <view style="width: 54rpx;"></view>
			  <!-- #ifdef MP -->
			  <button class="u-reset-button item-wrapper" open-type="share">
			    <u-icon name="share" size="44" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"/>
			    <text class="_text" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'">分享</text>
			  </button>
			  <!-- #endif -->
			  <!-- #ifndef MP -->
			  <view class="item-wrapper" @tap.stop.prevent="inviterUser">
			    <u-icon name="share" size="44" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'"/>
			    <text class="_text" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'">分享</text>
			  </view>
			  <!-- #endif -->
		      <view style="width: 54rpx;"></view>
		      <view class="item-wrapper" @tap.stop.prevent="bureauCollect">
		        <u-icon :name="detailsInfo.is_collected ? 'star-fill' : 'star'" size="44" :color="detailsInfo.is_collected ? '#ff3974' : (global__theme__ == 'black' ? '#dadadb' : '#333333')"/>
		        <text class="_text" :color="global__theme__ == 'black' ? '#dadadb' : '#333333'">{{ detailsInfo.collect_count > 0 ? detailsInfo.collect_count : '收藏' }}</text>
		      </view>
		    </view>
			<block v-if="detailsInfo.user_id == myUserInfo.id || isOfficial > 1">
				<view class="admin-tool-wrap flex-row">
					<view :class="{'right-btn-wrapper': true, 'disabled': detailsInfo.activity_state === 0}" @tap.stop.prevent="buythis">
					  {{ detailsInfo.status_text }}
					</view>
					<view class="manage" @tap.stop.prevent="managePop">管理</view>
				</view>
			</block>
			<block v-else>
				<view :class="{'right-btn-wrapper': true, 'disabled': detailsInfo.activity_state === 0}" @tap.stop.prevent="buythis">
				  {{ detailsInfo.status_text }}
				</view>
			</block>
		    
		  </view>
		
		  <!-- 报名用户列表 -->
		  <organize-bureau-details-join-user-popup
		      :show="joinUserListPopupShow"
		      :groups="detailsInfo.groups"
		      @close="joinUserPopupShow(false)"
			  :master="detailsInfo.user_id"
			  v-if="detailsInfo.groups && detailsInfo.groups.length > 0"
			  @joinTeam="joinTeam"
		  />
		</view>
		
		<u-overlay :show="showOverlay" @click="overlayClick" :z-index="999"></u-overlay>
		<view class="detail-popup" :style="detailPopupStyle">
			<view class="inner">
				<view class="detail-popup-header">
					<text class="cancel" @tap="showOverlay = false">取消</text>
					<text class="title">留言</text>
					<text class="confirm" @tap="addCommentOrReply">确定</text>
				</view>
				<!-- <u-line style="transform: scaleY(0.5);"></u-line> -->
				<textarea v-model="message" :adjust-position="false" :focus="focus"class="detail-popup-textarea" ref="detail-popup-textarea" :placeholder="replyc" @blur="blur"
					@focus="focusChange" max-length="240" confirm-type="done" @confirm="addCommentOrReply"></textarea>
				<view class="detail-popup-footer">
					<view class="detail-popup-footer-icon" @tap="iconClick('smile')">
						<i class="mini-icon mini-xiaolian" :style="iconType === 'smile'? 'color: #F7E253;':'color: #323233;'"></i>
					</view>
					<text class="detail-popup-footer-text">{{240-message.length}}</text>
				</view>
				<view class="detail-popup-panel" :style="detailPopupPanelStyle" v-if="panelHeight && iconType === 'smile'">
					<emoji @chooseEmoji="chooseEmoji" :height="keyboardHeight-20">
					</emoji>
				</view>
			</view>
		</view>
		
		
		<u-popup :show="sale_reply_popup" @close="openSaleReplyPopup(false)" :zIndex="99999991009" mode="bottom">
			<view class="sale-reply-wrap">
				<view :class="'inner ' + (keyboardHeight > 0 ? 'keyboard-up' : '') ">
					<view class="title flex-row">
						<view class="left flex-row">
							<view :class="'reply-type pre ' + (preOrAfter == 1 ? 'current' : '')" @tap.stop.prevent="changeReplyType(1)">售前</view>
							<view :class="'reply-type after ' + (preOrAfter == 2 ? 'current' : '')" @tap.stop.prevent="changeReplyType(2)">售后</view>
						</view>
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="openSaleReplyPopup(false)"></i>
					</view>
					<view class="center flex-row">
						<view class="left">
							<textarea class="_textarea" style="width: 500rpx;height:20vh;min-height:20vh;"
							 @focus="focusTextarea" @blur="blurTextarea" :fixed="true" 
							  placeholder="可以填微信, QQ, 手机号码等联系方式..." :show-confirm-bar="false" :focus=" isFocus "
							   maxlength="1000" placeholder-class="_input_place_holder" :adjust-position="false" :auto-blur="true"
								v-model="sale_reply_text">
							</textarea>
						</view>
						<view class="right flex-column">
							<block v-if="sale_reply_img && sale_reply_img.length > 0">
								<view class="img_item">
									<image class="upload_img" :src="sale_reply_img" mode="aspectFill"></image>
									<i class="delete_icon mini-icon mini-shanchu1" @tap.stop.prevent="delete_sale_reply_img"></i>
								</view>
							</block>
							<block v-else>
								<view class="img_item upload" @tap.stop.prevent="uploadReferImg">
									<i class="mini-icon mini-jia upload-icon"></i>
								</view>
							</block>
		
						</view>
					</view>
					<view class="bottom">
						<view class="btn" @tap.stop.prevent="bureau_sale_reply">确定</view>
					</view>
					<view class="keyboard" :style="'height: ' + keyboardHeight + 'px;'"></view>
				</view>
			</view>
		</u-popup>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

import OrganizeBureauDetailsJoinUserPopup from '@/pagesZ/organize-bureau/details/components/organize-bureau-details-join-user-popup.vue';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

import goodsComment from '@/pagesZ/organize-bureau/details/components/cu-comment/comment.vue';
import emoji from '@/pagesZ/organize-bureau/details/components/cu-emoji/cu-emoji.vue';

const common = require('@/mixins/common');
const shop = require('@/mixins/shop');
var options = {};

common(options);
shop(options);

export default {
  mixins: [{
  	methods: options
  }],
  components: {
	  myToast,navBar,hoverBall,
	  OrganizeBureauDetailsJoinUserPopup,
	  mpHtml,
	  goodsComment,
	  emoji
  },
  data() {
    return {
	  pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 148,
      // 报名用户列表弹窗
	  id: 0,
      joinUserListPopupShow: false,
      detailsInfo: {
		user_id: 0,
		image_urls: [],
		status_text: '',
		distance: '',
		address_detailed: '',
		service_time_tip: '',
		least_price_tip: '',
		action_sheets: [],
		club: {
			avatar: '',
			name: ''
		}
	  },
	  swiperIdx: 0,
	  videoPause: false,
	  
	  // 下单需要的参数
	  selectAction: 'bureau',
	  selectTeamId: 0,
	  
	  commentList: [],
	  commentLoadmoreShow: false,
	  reply: null,
	  showOverlay: false,
	  focus: false,
	  message: '',
	  panelHeight: 0,
	  keyboardHeight: 0,
	  popupHeight: uni.upx2px(660),
	  iconType: '',
	  page: 1,
	  commentIsLastPage: false,
	  
	  navbarTrans: 0,
	  color: '0,0,0',
	  iconTheme: 'white',
	  
	  preOrAfter: 1,
	  sale_reply_popup: false,
	  isFocus: false,
	  sale_reply_text: '',
	  sale_reply_img: '',
    }
  },
  computed: {
    joinUserList() {
		return [];
    },
	replyc() {
		if (this.reply && this.reply.userInfo) {
			return `评论${this.reply.userInfo.nickName}`
		}
		if (this.reply && this.reply.fromUserInfo) {
			return `回复${this.reply.fromUserInfo.nickName}`
		}
		return '你想问什么呢？记得有爱评论哦~'
	},
	detailPopupStyle() {
		let style = ''
		if (!this.showOverlay) {
			style = `transform: translateY(100%);`
			// style = `transform: translateY(${this.popupHeight}px);`
		} else {
			if (this.iconType) {
				style = `transform: translateY(0px);`
			} else {
				style = `transform: translateY(-${this.panelHeight}px);`
			}
		}
		return style
	},
	detailPopupPanelStyle() {
		let style = ''
		style = `height: ${this.panelHeight}px;padding-bottom: ${this.statusBar}px;`
		// if (!this.showOverlay) {
		// 	style += `transform: translateY(${this.panelHeight}px);`					
		// } else {
		// 	style += `transform: translateY(100%);`
		// }
	
		return style
	},
	config2_page_bureau_detail_price:{
		get(){
			return this.$store.state.config2?.page?.bureau?.detail?.price ?? '';
		},
		set(v){}
	},
	config2_page_bureau_detail_price_gray:{
		get(){
			return this.$store.state.config2?.page?.bureau?.detail?.price_gray ?? '';
		},
		set(v){}
	},
  },
  watch: {
  	showOverlay(val) {
  		if (!val) {
  			this.iconType = ''
  			uni.hideKeyboard()
  		}
  	}
  },
  onShow: function () {
  	let that = this;
  	that.updateScene(148, that.id, false, false, 0, 2);
  },
  onLoad: function (options) {
  	let that = this;
  	that.globalOnloadProcess(options);
	
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
		that.id = query.id;
		that.fph = true;
	} else {
		that.id = options.id;
	}
	
    that.getBureauDetail();
	that.getCommentList();
  },
  onShareAppMessage: function(res) {
  	let that = this;
  	return {
  		title: that.$store.state.config2?.bureau?.share?.detail_title?.replace('[bureau_title]', that.detailsInfo.title),
  		path: '/pagesZ/organize-bureau/details/index?id=' + that.detailsInfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: that.detailsInfo.pic
  	};
  },
  onShareTimeline: function(res) {
  	let that = this;
  	return {
  		title: that.$store.state.config2?.bureau?.share?.detail_title?.replace('[bureau_title]', that.detailsInfo.title),
  		query: 'id=' + that.detailsInfo.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
  		imageUrl: uni.wen.util.removeStyles(that.detailsInfo.pic) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
  	};
  },
  onPageScroll: function onPageScroll(e) {
  	let that = this;
  
  	var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;
  
  	if (trans > 1 && that.navbarTrans > 1) {
  		return false
  	}
  
  	var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
  	var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
  	var iconTheme = that.iconTheme;
  	if (trans == 0) {
  		frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
  		backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
  		iconTheme = that.$store.state.theme == 'black' ? 'black' : 'white';
  	} else if (trans >= 0.4) {
  		frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
  		backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
  		iconTheme = that.$store.state.theme == 'black' ? 'white' : 'black';
  	}
  	that.setData({
  		navbarTrans: trans,
  		iconTheme: iconTheme,
  		color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
  	});
  	uni.setNavigationBarColor({
  		frontColor: frontColor,
  		backgroundColor: backgroundColor,
  		animation: {
  			duration: 400,
  			timingFunc: 'easeIn',
  		},
  	})

  },
  onPullDownRefresh: function () {
    let that = this;
    
    that.getBureauDetail();
    that.getCommentList();
    
    setTimeout(function() {
    	uni.hideNavigationBarLoading();
    	uni.stopPullDownRefresh();
    }, 700);
  },
  methods: {
	inviteUserTap() {
	  let that = this;
	  uni.wen.util.inviteUser('/pagesZ/organize-bureau/details/index', that.$store.state.config2?.bureau?.share?.detail_title?.replace('[bureau_title]', that.detailsInfo.title), 'id=' + that.detailsInfo.id, that.detailsInfo.pic);
	},
	managePop(){
		let that = this;
		uni.showActionSheet({
			itemList: that.detailsInfo.action_sheets,
			success: function(res) {
				if(that.detailsInfo.action_sheets[res.tapIndex] === '扫码验票'){
					uni.wen.toUrl(9, 0, that);
				}else if(that.detailsInfo.action_sheets[res.tapIndex] === '自动回复'){
					setTimeout(function(){
						that.openSaleReplyPopup(true);
					}, 350);
				}else if(that.detailsInfo.action_sheets[res.tapIndex] === '下载用户信息'){
					uni.wen.toUrl(6, '/pages/common/table?type=34&id=' + that.id, that);
					return false;
				}else if(that.detailsInfo.action_sheets[res.tapIndex] === '重新发布'){
					uni.wen.toUrl(6, '/pagesZ/organize-bureau/push/creat?id=' + that.id + '&repeat=1', that);
					return false;
				}else if(that.detailsInfo.action_sheets[res.tapIndex] === '编辑'){
					uni.wen.toUrl(6, '/pagesZ/organize-bureau/push/creat?id=' + that.id, that);
					return false;
				}else if(that.detailsInfo.action_sheets[res.tapIndex] === '下架'){
					setTimeout(function(){
						uni.showModal({
							title: '确定下架?',
							content: '下架后，会自动退款给所有参与的用户',
							confirmColor: that.primaryColor,
							success: function (res) {
								if (res.confirm) {
									that.bureauStatus(2);
								} else if (res.cancel) {
						
								}
							}
						});
					}, 400);
				}
			},
			fail: function(res) {
				console.log(res.errMsg);
			}
		});
	},
	bureau_chat(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_chat_card',
			bureau_id: that.id,
		}, 'POST').then(res => {
			uni.loading(false);
			uni.wen.toUrl(6, '/pages/message/detail/detail?userid=' + that.detailsInfo?.user_id + '&name=' + that.detailsInfo?.user?.user_name, that);
		});
	},
	bureauStatus(status){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_status',
			bureau_id: that.id,
			status: status
		}, 'POST').then(res => {
			if(res.status){
				that.getBureauDetail();
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
			
		});
	},
	joinUserPopupShow(flag){
		this.joinUserListPopupShow = flag ? true : false;
	},
	getBureauDetail(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/detail', {
			id: that.id
		}, 'GET', 148).then(function(res) {
			uni.loading(false);
			uni.stopPullDownRefresh();
			if (res.status) {
				that.detailsInfo = res.data;
				// #ifdef H5
				if(uni.$store.state.h5_browser == 'wxclient'){
					setTimeout(function(){
						let share_title = that.$store.state.config2.bureau.share.detail_title.replace('[bureau_title]', that.detailsInfo.title);
						let share_img = that.detailsInfo.pic;
						uni.wen.util.setH5WeixinShare(share_img, share_title, that.detailsInfo.user.user_name);
					}, 500);
				}
				// #endif
			} else {
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
	swiperChange(res) {
		if (res.detail && res.detail.current !== 0 && this.uVideo) {
			this.uVideo.pause();
			this.uVideo.isplay = false;
			this.videoPause = true;
		}
		this.swiperIdx = res.detail.current;
	},
	swiperClick(index){
		let that = this;
		let imagesArr = [];
		for (let i in that.detailsInfo.image_urls) {
		    imagesArr.push(that.detailsInfo.image_urls[i].url);
		}
		
		uni.previewImage({
		    current: that.detailsInfo.image_urls[index].url,
		    urls: imagesArr
		});
		return false;
	},
	toVideo() {
		// #ifdef APP
		uni.wen.toUrl(6, '/pages/common/video?url=' + this.detailsInfo.video_url, this);
		return false;
		// #endif
		
		// #ifndef APP
		if (!this.uVideo) this.uVideo = uni.createVideoContext('uVideo', this);
		if (this.uVideo.isNotplay) {
			// 未播放
			this.uVideo.isplay = true;
			this.videoPause = false;
			// this.detailsInfo.video.loaded = true;
			this.uVideo.play();
			return false;
		}else{
			this.uVideo.pause();
			this.uVideo.isNotplay = true;
			this.videoPause = true;
			uni.wen.toUrl(6, '/pages/common/video?url=' + this.detailsInfo.video_url, this);
			return false;
		}
		// #endif
	},
	buythis(){
		let that = this;
		if(that.detailsInfo.activity_state == 1){
			// 先检查是否是 one-group-one-team
			if(that.detailsInfo.groups.length == 1){
				if(that.detailsInfo.groups[0].teams.length == 1){
					let toast_tip = that.canIJoinTeam(0, 0);
					if(toast_tip && toast_tip.length > 0){
						if(toast_tip == '该组需要实名认证'){
							setTimeout(function(){
								uni.showModal({
								    title: '该组需要实名认证',
								    content: '编辑资料页面往下拉，点击实名',
								    showCancel: true,
								    confirmText: '前往认证',
								    confirmColor: that.primaryColor,
								
								    success(res) {
								        if (res.confirm){
											uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', that);
										}
								    }
								});
							}, 500);
						}else{
							uni.showToast({
								title: toast_tip,
								icon: 'none'
							});
						}
					}else{
						that.selectTeamId = that.detailsInfo.groups[0].teams[0].id;
						if(that.selectTeamId > 0){
							that.getShopAddCart();
						}
					}
					return false;
				}else{
					that.joinUserListPopupShow = true;
				}
			}else{
				that.joinUserListPopupShow = true;
			}
		}else if(that.detailsInfo.activity_state == 2){
			uni.wen.toUrl(6, '/pagesZ/organize-bureau/album/album?bureau='+that.detailsInfo, that);
		}else{
			if(that.detailsInfo.is_in_bureau){
				uni.showToast({
					title: '您已经报名过了',
					icon: 'none'
				})
			}else{
				uni.showToast({
					title: '当前时间不可报名',
					icon: 'none'
				})
			}
			
		}
	},
	joinTeam(team_id){
		let that = this;
		if(that.detailsInfo.activity_state == 1){
			if(that.detailsInfo.groups){
				for (let gindex = 0; gindex < that.detailsInfo.groups.length; gindex++) {
					if(that.detailsInfo.groups[gindex].teams){
						for (let tindex = 0; tindex < that.detailsInfo.groups[gindex].teams.length; tindex++) {
						    if(that.detailsInfo.groups[gindex].teams[tindex].id == team_id){
								let toast_tip = that.canIJoinTeam(gindex, tindex);
								if(toast_tip && toast_tip.length > 0){
									if(toast_tip == '该组需要实名认证'){
										setTimeout(function(){
											uni.showModal({
											    title: '该组需要实名认证',
											    content: '编辑资料页面往下拉，点击实名',
											    showCancel: true,
											    confirmText: '前往认证',
											    confirmColor: that.primaryColor,
											
											    success(res) {
											        if (res.confirm){
														uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', that);
													}
											    }
											});
										}, 500);
									}else{
										uni.showToast({
											title: toast_tip,
											icon: 'none'
										});
									}
								}else{
									that.selectTeamId = team_id;
									that.getShopAddCart();
								}
								return false;
							}
						}
					}
				}
			}
			return false;
		}else{
			uni.showToast({
				title: '当前时间不可报名',
				icon: 'none'
			})
		}
	},
	canIJoinTeam(gindex, tindex){
		// 在后端提示可报名的情况下，检查是否符合报名的条件
		let that = this;
		let flag = true;
		let toast_tip = '';
		let group = that.detailsInfo.groups[gindex];
		let team = that.detailsInfo.groups[gindex].teams[tindex];
		
		if(that.detailsInfo.is_in_bureau == 1){
			flag = false;
			toast_tip = '您已经参加了';
		}
		
		// 检验活动人数
		if(flag){
			if(team.members_limit > 0){
				if(team.members_limit - team.member_list.length  < 1){
					flag = false;
					toast_tip = '该组报名人数已满';
				}
			}
		}
		
		if(flag){
			// 检验性别
			if(group.signup_gender > 0){
				if(group.signup_gender == 1){
					if(that.myUserInfo.gender != 1){
						flag = false;
						toast_tip = '该组仅限男性参加';
					}
				}else if(group.signup_gender == 2){
					if(that.myUserInfo.gender != 2){
						flag = false;
						toast_tip = '该组仅限女性参加';
					}
				}else if(group.signup_gender == 3){
					
				}
			}
		}
		
		
		if(flag){
			// 检验实名认证
			if(group.is_real_name == 1){
				if(that.myUserInfo?.real_name?.length > 0){
					
				}else{
					flag = false;
					toast_tip = '该组需要实名认证';
				}
			}
		}
		
		return toast_tip;
	},
	bureauCollect(){
		let that = this;
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_collect',
			bureau_id: that.id
		}, 'POST').then(res => {
			if(res.status){
				if(that.detailsInfo.is_collected){
					that.detailsInfo.is_collected = false;
					that.detailsInfo.collect_count = that.detailsInfo.collect_count - 1;
				}else{
					that.detailsInfo.is_collected = true;
					that.detailsInfo.collect_count = that.detailsInfo.collect_count + 1;
				}
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
			
		});
	},
	inviterUser(){
		let that = this;
		uni.wen.util.inviteUser('/pagesZ/organize-bureau/details/index', that.$store.state.config2?.bureau?.share?.detail_title?.replace('[bureau_title]', that.detailsInfo.title), 'id=' + that.detailsInfo.id, that.detailsInfo.pic);
	},
	loadMoreComment(){
		let that = this;
		that.page += 1;
		that.getCommentList();
	},
	getCommentList() {
		let that = this;
		if(that.page == 1){
			
		}else{
			that.commentLoadmoreShow = true;
		}
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/comment/list', {
			bureau_id: that.id,
			page: that.page,
		}).then(function(res) {
			
			if(res.status){
				if(res.data.current_page != that.page){
					return false;
				}
				
				let {
					data
				} = res;
				let list = JSON.parse(JSON.stringify(that.commentList));
				that.commentList = [];
				if (data.data && data.data.length > 0) {
					if(data.data.length < 10){
						that.commentLoadmoreShow = true;
						that.commentIsLastPage = true;
					}else{
						that.commentLoadmoreShow = false;
						that.commentIsLastPage = false;
					}
					that.page = data.current_page;
					list = list.concat(data.data);
				} else {
					that.commentIsLastPage = true;
				}
				that.commentList = JSON.parse(JSON.stringify(list));
			}
			
		});
	},
	resetCommentList() {
		this.commentList = [];
		this.page = 1;
		this.getCommentList();
	},
	iconClick(type) {
		this.iconType = type
		uni.hideKeyboard()
		this.focus = false;
		this.panelHeight = this.keyboardHeight;
	},
	addCommentOrReply() {
		if (!this.message || !this.message.trim()) {
			uni.showToast({
				title: '请输入评论',
				icon: 'none'
			})
			return
		}
		if (this.reply) {
			this.addComment(1)
		} else {
			this.addComment();
		}
	},
	overlayClick(e) {
		this.showOverlay = false
		this.focus = false
	},
	blur(e) {
		this.cursor = e.detail.cursor;
		if (this.iconType != 'smile') {
			this.panelHeight = 0;
		}
	},
	showCommendPopup() {
		this.reply = null
		this.showOverlay = true
		this.focus = true
	},
	// 选择了emoji表情
	chooseEmoji(val) {
	
		// 返回获取从0到光标位置的字符串
		let str = this.message.substring(0, this.cursor)
		// 将表情插入指定位置
		this.message = this.message.replace(str, str + val)
		// 光标向后移动两位
		this.cursor += 2; //光标加2(表情是占两个位置)
	
	},
	
	// 聚焦键盘
	focusChange(e) {
		console.log(e)
		this.iconType = ''
		this.keyboardHeight = e.detail.height;
		this.panelHeight = e.detail.height;
		this.focus = true
	},
	toReply(data = {}, index = 0) {
		this.reply = data;
		this.reply.index = index
		this.showOverlay = true
		this.focus = true
	},
	// null评论商品 1回复评论
	addComment(type) {
		// this.message
		let that = this;
		let parms = {
			action: 'add', //固定add
			bureau_id: parseInt(that.id), //商品id
			comment_id: 0, //评论主题id
			comment_agent_id: 0, //回复对象id
			comment_content: this.message,
			comment_img_url: ''
		}
		console.log(that.reply)
		if (type) {
			parms.comment_id = that.reply.comment_id ? that.reply.comment_id : that.reply.id;
			parms.comment_agent_id = that.reply.comment_id ? that.reply.user.id : 0;
		}
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/comment/process', parms, 'POST').then(function(res) {
			uni.loading(false);
			if (res.status) {
				uni.showToast({
					title: '评论成功',
					icon: 'none'
				})
				that.detailsInfo.detailsInfo = that.detailsInfo.detailsInfo + 1;
				//关闭评论框
				that.showOverlay = false;
				that.message = '';
				that.resetCommentList();
			} else {
				if (res.code == 200016) {
					uni.showModal({
						title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
						content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿发布违规内容',
						showCancel: false,
						confirmText: '朕知道了',
						confirmColor: that.primaryColor
					});
					return false;
				} else if (res.code == 200041) {
					uni.showModal({
						title: '默认昵称不能发布内容',
						content: '为了您在社区的信誉，请勿以"微信用户","普通用户"'+ (that.$store.state.config.user?.default_user_name.length > 0 ? ',"'+that.$store.state.config.user?.default_user_name+'"' : '') +'开头',
						showCancel: true,
						confirmText: '修改昵称',
						confirmColor: that.primaryColor,
	
						success(res) {
							if (res.confirm) {
								uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', null);
							}
						}
					});
					return false;
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					});
				}
			}
		});
	},
	focusTextarea(e){
		let that = this;
		that.keyboardHeight = e.detail.height;
	},
	blurTextarea(e){
		let that = this;
		that.keyboardHeight = 0;
	},
	delete_sale_reply_img(){
		let that = this;
		that.sale_reply_img = '';
	},
	uploadReferImg(){
		let that = this;
		uni.chooseImage({
			count: 1,
			sourceType: ['album', 'camera'],
			sizeType: ['original'],
	
			success(res) {
				uni.loading(true);
				const tempFilePaths = res.tempFilePaths;
				uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function(res) {
					uni.loading(false);
					if(res.status){
						that.sale_reply_img = res.data;
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
				});
			},
	
			fail(err) {
	
			}
		});
	},
	changeReplyType(flag){
		let that = this;
		if(flag == 1){
			if(that.preOrAfter == 1){
				return false;
			}
			that.preOrAfter = 1;
		}else{
			if(that.preOrAfter == 2){
				return false;
			}
			that.preOrAfter = 2;
		}
		that.sale_reply_text = that.preOrAfter == 1 ? (that.detailsInfo.pre_sale_reply ?? '') : (that.detailsInfo.after_sale_reply ?? '');
		that.sale_reply_img = that.preOrAfter == 1 ?  ( that.detailsInfo.pre_sale_reply_img ?? '' ) : ( that.detailsInfo.after_sale_reply_img ?? '' )
	},
	openSaleReplyPopup(flag){
		let that = this;
	
		that.sale_reply_popup = flag;
		that.sale_reply_text = that.preOrAfter == 1 ? (that.detailsInfo.pre_sale_reply ?? '') : (that.detailsInfo.after_sale_reply ?? '');
		that.sale_reply_img = that.preOrAfter == 1 ?  ( that.detailsInfo.pre_sale_reply_img ?? '' ) : ( that.detailsInfo.after_sale_reply_img ?? '' )
	
		setTimeout(function(){
			that.isFocus = flag;
		}, 200);
	},
	bureau_sale_reply(){
		let that = this;
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'bureau/process', {
			type: 'bureau_sale_reply',
			bureau_id: that.id,
			reply_type: that.preOrAfter,
			sale_reply: that.sale_reply_text,
			sale_reply_img: that.sale_reply_img
		}, 'POST').then(res => {
			if(res.status){
				if(that.preOrAfter == 1){
					that.detailsInfo.pre_sale_reply = that.sale_reply_text;
					that.detailsInfo.pre_sale_reply_img = that.sale_reply_img;
				}else{
					that.detailsInfo.after_sale_reply = that.sale_reply_text;
					that.detailsInfo.after_sale_reply_img = that.sale_reply_img;
				}
				uni.showToast({
					title: '设置成功',
					icon: 'none'
				});
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	},
  }
}
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
