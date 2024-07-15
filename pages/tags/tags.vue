<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body">
		<view class="content">
			<navBar :back="true" :iconTheme="iconTheme" :title="tag_info.tags_name" :home="fph" :background="global__theme__ == 'black' ? 'rgba(25, 25, 30, ' + navbarTrans + ')' : 'rgba(255, 255, 255, ' + navbarTrans + ')'" :color="'rgba(' + color + ', ' + navbarTrans + ')'">
				<!-- #ifdef APP -->
				<view @tap.stop.prevent="toShareTag" slot="right" class="lxy-nav-bar__logo default">
					<image class="_image" :src="iconRight" />
				</view>
				<!-- #endif -->
			</navBar>
			<view class="topic-head">
				<!-- 模糊背景 -->
				<view class="topic-bg">
					<image :src="tag_info.background_maps" mode="aspectFill"></image>
				</view>
				<!-- 话题信息 -->
				<view class="topic-info">
					<view class="topic-info-top">
						<image class="topic-info-image" :src="tag_info.head_portrait" mode="aspectFill"></image>
						<view class="topic-info-title">#{{tag_info.tags_name}}</view>
					</view>
					<view class="topic-info-num">
						<view class="num totalNum">热度 {{tag_info.tags_number}}</view>
						<!-- <view class="num todayNum">今日 {{tag_info.todayNum}}</view> -->
					</view>
					<view class="topic-info-desc">{{tag_info.tag_introduce}}</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="topic-head-height"></view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="topic-head-height"></view>
			<!-- #endif -->

			<view class="topic-list">
			
            <ls-skeleton :loading="topicload" :skeleton="commonSkeleton" :animate="true" :scene="topic_list_waterfall ? 90734 : 7">
                <block name="circle">
					<block v-if="topic_list_waterfall">
						<view class="post-list-gap" style="@include background_color(page-box-background-color);"></view>
						<l-water-flow comName="product" :waterData="postWaterData" ref="productwater" :column-gap="8"/>
					</block>
					<block v-else>
						<view class="post-list-gap"></view>
						<view class="post-wrap" v-for="(item, index) in posts" :key="index">
							<contextualPopup subject="posts" :popList="item.longtaps" :para="{ index: index, style: 'list' }">
							<view class="topic-detail-view" slot="content">
								<block v-if="item.post_type == 'single'">
									<single-item :single="item"></single-item>
								</block>
								<block v-else>
									<view class="topic-panel" :id="'media_' + item.id">
										<view class="user-info-view">
											<user-info :user="item.user" :format_time="item.format_time" :ip_address="item.ip_address" :distance="item.distance" :device="item.device" :post_top="item.post_top">
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
										
										<post-content :words="item" :postIndex="index" :scene="7" @unfoldTap="unfoldTap" @showPayContent="showPayContent" @soundPlayCall="soundsPlayCall" @forceUpdate="forceUpdate" @pSelectVote="selectVote"></post-content>
										<post-footer @tapShare="tapShare" @taplikes="taplikes" @tapComment="tapComments" @tapCollect="tapCollect" @tapReward="tapReward" @tapGiveCoin="tapGiveCoin" :words="item" :index="index"></post-footer>
								
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
										<view class="ad-content"><ad-custom :unit-id="item.ad.unit" ></ad-custom></view>
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
										<view class="ad-content"><ad :adpid="item.ad.unit"></ad></view>
									</block>
								</view>
								<view class="post-list-gap" v-if="item.ad"></view>
								<!-- #endif -->
							</block>
						</view>

						<u-popup :show="rewardPopup" @close="shutReward" >
							<view class="reward-add-box">
								<image class="reward-add-box-image"
									:src="config_img.reward_select" mode="aspectFill" />
								<view class="reward-add-input-box">
									<text>¥</text>
									<input class="reward-add-input" @input="rewardPriceChange" :value="rewardPrice"
										placeholder-class="_input_place_holder" type="digit"
										placeholder="在这里输入充电金额" />
								</view>
								<view class="reward-add-box-view">
									<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 2 ? 'bd _view' : '_view'"
										data-price="2">¥2</view>
									<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 6 ? 'bd _view' : '_view'"
										data-price="6">¥6</view>
									<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 8 ? 'bd _view' : '_view'"
										data-price="8">¥8</view>
									<view @tap.stop.prevent="addRewardPrice" :class="rewardPrice == 18 ? 'bd _view' : '_view'"
										data-price="18">¥18</view>
								</view>
								<view class="reward-add-box-btn" @tap.stop.prevent="onOpenExceptionalAccountCheck">确认充电</view>
							</view>
						</u-popup>
						
						<u-popup :show="payContentPopup" @close="shutPayContent" :zIndex="99999991009">
							<block v-if="payContentObj && payContentObj.price > 0">
								<view class="pay_content_box">
									<view class="title"><view :class="'mini-icon ' + (payContentObj.pay_type == 1 ? 'mini-xueyuan-fufeikecheng' : 'mini-jinbi2') "></view>付费内容</view>
									<view class="pay_for_item price">
										<text>价格：</text>
										<block v-if="payContentObj.vip_price >= 0">
											<view class="pay_for_item_num vip_price">{{ payContentObj.vip_price + payContentObj.credit }} <view class="vip_price_tip">会员价</view> </view>
										</block>
										<block v-else>
											<view class="pay_for_item_num">{{ payContentObj.price + payContentObj.credit }}</view>
										</block>
									</view>
									<view class="pay_for_item rest">
										<text>剩余篇幅：</text>
										<view class="pay_for_item_num">{{ payContentObj.rest }}%</view>
									</view>
									<view class="pay_for_item has_hidden">
										<text>隐藏内容：</text>
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

						<view 
							:class="'dialog ' + (rewardDialog ? 'dialog_show' : '')">
							<view @tap.stop.prevent="onClickReward" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
							<view class="dialog_container">
								<view class="dialog_box_title">
									{{ exceptionalCount }}次充电
									<i class="mini-icon mini-shanchu2" @tap.stop.prevent="onClickReward" />
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
												<u-count-to :endVal="item.exceptional_price" :decimals="2" color="#FA5150" fontSize="46"></u-count-to>
											</view>
										</view>
									</view>
								</scroll-view>
							</view>
						</view>

						<view 
							:class="'dialog ' + (bounced ? 'dialog_show' : '')">
							<view @tap.stop.prevent="bouncedTap" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
							<view class="dialog_container">
								<view class="dialog_conent">
									<view @tap.stop.prevent="bouncedDeleteTap" class="delete-btn" id="delete">确认删除
									</view>
									<view @tap.stop.prevent="bouncedTap" class="cancel-btn">取消</view>
								</view>
							</view>
						</view>

						<view 
							:class="'dialog ' + (showShare ? 'dialog_show' : '')">
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

						<view  :class="showComments ? 'dialog_show' : ''">
						<view @tap.stop.prevent="toShutComments" class="dialog_mask" @touchmove.stop.prevent="miniMoveHandle"></view>
						<view class="dialog_container">
							<view class="dialog_box_title">
								评论 {{ commentCount > 999 ? filters.toFix(commentCount) : commentCount }}
								<i class="mini-icon mini-shanchu2" @tap.stop.prevent="toShutComments" />
							</view>
							<comment-scroll :unicom-id=" 'commentScroll_7_' + id " ref="commentScroll" :postsId="postsId" @tapComment="tapComment"></comment-scroll>
							<comment-form :unicom-id=" 'commentForm_7_' + id " ref="commentForm" :postsId="postsId" :commentFormShow="commentFormShow" @maskClick="commentFormMaskClick" @sendComment="onInputComment" @tapComment="tapComment" :placeholder="replyName || '此时此刻想说~' "></comment-form>
						</view>
					</view>
					</block>
				</block>
			</ls-skeleton>
            <u-loadmore v-if="loadmoreShow" :status="isLastPage ? 'nomore' : 'loading'" nomoreText="── THE END ──"  iconSize="28" fontSize="28" color="#989898" />
        </view>
        <view @tap.stop.prevent="refreshEvent" class="refresh">
            <i class="mini-icon mini-xunhuan"></i>
        </view>
		<!-- 参与话题 -->
		<view class="giveTalkFixedWrap" @tap.stop.prevent="attachTagToCreate">
			<view class="giveTalkButton">
				<image :src="myUserInfo.user_avatar||config_img.default_avatar"></image>
				<view class="giveTalk-text">参与话题</view>
			</view>
		</view>
		<post-share :unicom-id=" 'postShare_7_' + id " :postsId="postsId" :show="showSharePopup" @postfeedback="postFeedback"></post-share>
		<hover-ball v-if="isOfficial > 1" /><my-toast :unicom-id="'mytotast_7_' + id" ref="mytoast" :isdistance="true" :toast="mytoast_data"  @giveCoin="onInputComment" @postfeedback="postFeedback"></my-toast>
		</view>
	</view>
</view>
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import lsSkeleton from '@/components/common/ls-skeleton/ls-skeleton';

import lWaterFlow from '@/linui/water-flow/index';


import SingleItem from "@/pages/sticky/components/single-item";
import UserInfo from "@/pages/sticky/components/user-info";
import PostContent from "@/pages/sticky/components/post-content";
import CommentForm from "@/pages/sticky/components/comment-form";
import CommentScroll from "@/pages/sticky/components/comment-scroll";
import product from '@/components/common/water/product/index';
import PostFooter from "@/pages/sticky/components/post-footer";
import PostShare from "@/pages/sticky/components/post-share";
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';

const common = require('@/mixins/common');
const user = require('@/mixins/user');
const forum = require('@/mixins/forum');

var options = {};
common(options);
user(options);
forum(options);
export default {
	mixins: [{methods: options}],
    components: {
		myToast,navBar,hoverBall,lsSkeleton,
		lWaterFlow,
        
        
		SingleItem,
		UserInfo,
		PostContent,
		CommentForm,
		CommentScroll,
		product,
		PostFooter,
		PostShare,
		contextualPopup
    },
	computed:{
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
		config_audit_is_reward:{
			get(){
				let that = this;
				return !that.$store.state.config.audit.is_reward && that.$store.state.config.app.mode != 'examine';
			},
			set(v){}
		},
		topic_list_waterfall:{
			get(){
				let that = this;
				
				if(that.myUserInfo.setting && that.myUserInfo.setting.diy_scene_7_post_list_style != 1){
					if(that.myUserInfo.setting.diy_scene_7_post_list_style == 3){
						return true;
					}else{
						return false;
					}
				}
				return that.$store.state.config.page.topic.style == 1;
			},
			set(v){}
		},
		commonSkeleton: {
			get(){
				let that = this;
				if(that.topic_list_waterfall){
					return that.$store.state.skeleton.waterfall;
				}else{
					return that.$store.state.skeleton.rowPost;
				}
			},
			set(v){}
		},
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 7,
            id: 0,
			postsId: 0,
			commentFormShow: 0,
			commentCount: 0,
			exceptionalCount: 0,
			tag_info: {
				
			},
			user:{
				avatar: ''
			},
            page: 1,
            posts: [],
            topicload: true,
            loadmoreShow: false,
            isLastPage: false,
			iconRight: '/static/image/slim_share_w.png',

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
			navbarTrans: 0,
			color: '0,0,0',
			iconTheme: 'white',
			postWaterData: {
				e: 0,
				data: []
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
		
		
        // uni.setNavigationBarTitle({
        //     title: '#' + options.name
        // });
		// 处理小程序码的分享场景
		var scene = decodeURIComponent(options.scene);
		if (scene && scene != 'undefined') {
			let query = {};
			if(scene.indexOf('&') !== -1){
				let scene_arr = scene.split('&');
				scene_arr.map((item)=> {
				    let queryData = item.split('=')
				    query[queryData[0]] = queryData[1]
				})
			}else{
				let queryData = scene.split('=')
				query[queryData[0]] = queryData[1]
			}
			if(query.from_user && query.from_user.length > 0){
				uni.setStorageSync('form_user', query.from_user);
				uni.$store.commit('updateFormUser', query.from_user);
			}
			that.setData({
				id: query.id,
				fph: true,
			});
		} else {
			that.setData({
			    id: options.id
			});
		}
		
		that.getTagInfo();
        that.tagePostsList();
		
    },
	onReady(){
		let that = this;
		let userInfo = that.$store.state.userInfo;
		
		if (userInfo != '') {
			this.user.avatar = userInfo.user_avatar;
		}else{
			this.user.avatar = that.$store.state.config.img.default_avatar
		}
	},
	onPageScroll: function onPageScroll(e) {
		let that = this;
		var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;
		
		if(trans >= 1 && that.navbarTrans >= 1){
			return false;
		}
		
		var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
		var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
		var iconTheme = that.iconTheme;
		// var iconLeft = that.iconLeft;
		var iconRight = that.iconRight;
	
		if (trans <= 0) {
			frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
			backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
			iconTheme = that.$store.state.theme == 'black' ? 'black' : 'white';
			// iconLeft = '/static/image/notification.png';
			iconRight = that.$store.state.theme == 'black' ? '/static/image/slim_share.png' : '/static/image/slim_share_w.png';
		} else if (trans >= 0.4) {
			frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000';
			backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff';
			iconTheme = that.$store.state.theme == 'black' ? 'white' : 'black';
			// iconLeft = '/static/image/notification-line.png';
			iconRight = that.$store.state.theme == 'black' ? '/static/image/slim_share_w.png' : '/static/image/slim_share.png';
		}
	
		that.setData({
			navbarTrans: trans,
			iconTheme: iconTheme,
			// iconLeft: iconLeft,
			iconRight: iconRight,
			color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
		});
		uni.setNavigationBarColor({
			frontColor: frontColor,
			backgroundColor: frontColor,
			animation: {
				duration: 400,
				timingFunc: 'easeIn',
			}
		});
	},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(7, that.id);
	},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
			postsId: 0,
			commentFormShow: 0,
            page: 1,
            posts: [],
			postWaterData: {
				e: 1,
				data: []
			},
            topicload: true,
            loadmoreShow: false,
            isLastPage: false
        });
        that.tagePostsList();
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
        that.tagePostsList();
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
                path: '/pages/sticky/sticky?id=' + Math.abs(that.postsId)  + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
                imageUrl: share_img
            };
        } else {
            let share_title = that.$store.state.config.share.format.app_share_tag;
            share_title = share_title.replace('[tag_name]', '分享了' + that.tag_info.tags_name);
            return {
                title: share_title,
                path: 'pages/tags/tags?id=' + that.id + '&name=' + that.tag_info.tags_name  + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
                imageUrl: that.tag_info.head_portrait || that.$store.state.config.img.topic_avatar
            };
        }
    },
    onShareTimeline: function (res) {
		let that = this;
        let share_title = that.$store.state.config.share.format.app_share_tag;
        share_title = share_title.replace('[tag_name]', that.tag_info.tags_name);
        return {
            title: share_title,
            query: 'id=' + that.id + '&name=' + that.tag_info.tags_name + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
            imageUrl: uni.wen.util.removeStyles(that.tag_info.head_portrait || that.$store.state.config.img.default_share) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
        };
    },
	onBackPress(e) {
		if(this.showComments) {
			this.showComments = false;
			
			// #ifdef APP || H5
			setTimeout(function(){
				uni.showTabBar();
			}, 250)
			// #endif
			
			return true;  
		}else if(this.rewardDialog){
				this.rewardDialog = false;
				// #ifdef APP || H5
				setTimeout(function(){
					uni.showTabBar();
				}, 250)
				// #endif
				return true;
		}else if(this.fph) {
				uni.reLaunch({
					url: '/pages/tabbar/index/index'
				});
				return true;
		}
	},
    methods: {
		//话题获取笔记列表
		tagePostsList() {
			let that = this;
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/tagsv2', {
				tag_id: that.id,
				page: that.page
			}).then(function(res) {
				if(res.status){
					
					if(res.data.current_page != that.page){
						return false;
					}
					
					let args = {};
					if(res.data.data && res.data.data.length > 0){
						args.page = res.data.current_page;
						args.posts = that.posts.concat(res.data.data);
						args.isLastPage = false;
						args.loadmoreShow = false;
					}else{
						args.isLastPage = true;
					}
					args.topicload = false;
					
					that.setData(args);
					
					if(res.data.data && res.data.data.length > 0 && that.topic_list_waterfall){
						that.setData({
							postWaterData: {
								e: 0,
								data: res.data.data
							}
						});
					}
					
				}else{
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			});
		},
		getTagInfo(){
			let that = this;
			if(!that.id){
				uni.showToast({
					title: '初始化失败',
					icon:'error'
				});
				return false;
			}
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'tags/info', {
				id: that.id
			}).then(function(res) {
				if(res.status){
					that.setData({
						tag_info: res.data
					});
					
					
					// #ifdef H5
					if(uni.$store.state.h5_browser == 'wxclient'){
						setTimeout(function(){
							
							let share_title = that.$store.state.config.share.format.app_share_tag;
							share_title = share_title.replace('[tag_name]', that.tag_info.tags_name);
							let share_img = that.tag_info.head_portrait || that.$store.state.config.img.default_share;
							
							uni.wen.util.setH5WeixinShare(share_img, share_title, '话题');
						}, 500);
					}
					// #endif
					
				}else{
					uni.showToast({
						title: res.message,
						icon:'error'
					});
				}
			});
		},
        //刷新方法
        refreshEvent() {
            // this.onPullDownRefresh();
			uni.startPullDownRefresh()
        },
		attachTagToCreate() {
			
		    let that = this;
			
			let res = uni.wen.util.loginNow();
			
			if (res == false) {
				return false;
			}
			
		    let userSelectedTags = uni.getStorageSync('userSelectedTags') || [];
		    let id = that.id;
		    let name = that.tag_info.tags_name;
		    let readsave = false; // 过滤重复值
		
		    if (userSelectedTags.length > 0) {
		        for (let i = 0; i < userSelectedTags.length; i++) {
		            if (userSelectedTags[i].id == id) {
		                readsave = true;
		                break;
		            }
		        }
		    }
		
		    if (!readsave) {
		        let args = {};
		        args.id = id;
		        args.tags_name = name;
		        userSelectedTags.unshift(args);
		        uni.setStorageSync('userSelectedTags', userSelectedTags);
		    }
			uni.wen.toUrl(6, '/pages/creat/index/creat', null);
		},
		toShareTag(){
			let that = this;
			uni.wen.util.inviteUser('/pages/tags/tags',  '分享了' + that.tag_info.tags_name, 'id=' + that.id, that.tag_info.head_portrait);
		}
       
       
    }
};
</script>
<style lang="scss">
@import '@/pages/template/circle.scss';
.topic-head{
	position: absolute;
	top: 0;
	left: 0;
	width: 750rpx;
	.topic-bg {
				width: 100%;
				height: 300rpx;
				position: relative;
				overflow: hidden;
				image {
					width: 100%;
					position: absolute;
					filter: blur(20rpx);
				}
	}
	
	.topic-info {
		position: relative;
		padding: 0 30rpx 30rpx;
		@include background_color(page-box-background-color);
		height: 220rpx;
		.topic-info-image {
			width: 150rpx;
			height: 150rpx;
			position: absolute;
			top: -75rpx;
			border-radius: 30rpx 30rpx;
		}
		.num{
			margin-right: 20rpx;
			color: #6B7280;
			font-size: $uni-font-size-sm;
		}
		.topic-info-title {
			font-size: 40rpx;
			font-weight: 600;
			margin-left: 180rpx;
			@include color(color-darkest);
		}
		.topic-info-num{
			padding-top: 52rpx;
			align-items: center;
			display: flex;
			color: #6B7280;
		}
		
		.topic-info-desc{
			font-size: $uni-font-size-sm;
			margin-top: 20rpx;
			color: #6B7280 !important;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}
}
.topic-head-height{
	/* #ifdef H5 */
	height: 440rpx;
	/* #endif */
	/* #ifndef H5 */
	height: 360rpx;
	/* #endif */
}
.giveTalkFixedWrap{
	position: fixed;
	width: 100%;
	text-align: center;
	bottom: 30px;
	.giveTalkButton{
		display: flex;
		margin: auto;
		width: 145px;
		height: 49px;
		line-height: 49px;
		border-radius: 1.5rem;
		box-sizing: border-box;
		background-color: $uni-color-follow;
		color: $uni-color-follow-font;
		image{
			width: 25px;
			height: 25px;
			border-radius: 50%;
			border: 2px solid;
			@include border_color(border-color-box-item-background-color);
			margin-top: 10px;
			margin-left: 15px;
		}
		.giveTalk-text{
			margin-left: 10px;
		}
	}
}
</style>
