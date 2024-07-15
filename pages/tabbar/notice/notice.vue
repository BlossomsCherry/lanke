<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body tabbar notice">
		<navBar :home="fph" title="消息" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<view slot="left" class="lxy-nav-bar__logo"></view>
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo"></view>
			<!-- #endif -->
		</navBar>
		<block>
			<block v-if="myUserInfo && myUserInfo.id > 0">
				<custom-official-account class="cont" msg="关注微信公众号，消息通知更方便！" :isFollow="isFollowMp" :max="5" v-if="config_page_notice_mp_follow == 1 && !isFollowMp"></custom-official-account>
			</block>
			<block v-else>
				<view class="login-tip" @tap.stop.prevent="toLogin">
					<view class="inner">
						<i class="mini-icon mini-xunhuan"></i>
						当前未登录，无法实时获取消息
					</view>
				</view>
			</block>
		</block>
		
		<block v-if="config_page_notice_style == 0">
			<view class="dialog-top">
				<view class="item" @tap.stop.prevent="onMenuItem" v-for="(item, index) in messageQHList" :key="index" :data-url="item.url" hoverClass="hover">
					<view class="img-wrap">
						<image class="_image" :lazyLoad="true" mode="aspectFill" :src="config_page_notice_icons[item.img] || ''"></image>
						<view class="red-dot" v-if="item.count > 0">{{ item.count }}</view>
					</view>
					<view class="name">{{ item.title }}</view>
				</view>
			</view>
		</block>
		<block v-else>
			<button @tap.stop.prevent="onMenuItem" class="dialog-item" :data-url="item.url" hoverClass="hover" v-for="(item, index) in messageQHList" :key="index">
				<view class="item-head">
					<image class="icon" :lazyLoad="true" mode="aspectFill" :src="config_page_notice_icons[item.img] || ''"></image>
				</view>
			
				<view class="item-body">
					<view class="info">
						<view class="name">{{ item.title }}</view>
						<view class="time" v-if="item.date != '53年前'">{{ item.date }}</view>
					</view>
					<view class="content">
						<mp-html :content="item.content" class="desc" />
						<view class="red-dot" v-if="item.count > 0">{{ item.count }}</view>
					</view>
				</view>
			</button>
		</block>

		<!-- #ifdef MP-WEIXIN -->
		<button open-type="contact" class="dialog-item notice-official-service">
			<view class="item-head">
				<image class="icon iw2" :lazyLoad="true" mode="aspectFill" :src="config_page_notice_icons['servicer'] || ''"></image>
			</view>
			<view class="item-body">
				<view class="info">
					<view class="name">官方客服</view>
				</view>
				<view class="content">
					<view class="desc">7*24h实时在线为您服务（有问题请及时联系我们）</view>
				</view>
			</view>
		</button>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="dialog-item notice-official-service" @tap.stop.prevent="toSliderUrl(config_page_notice_icons.servicer_target_type, config_page_notice_icons.servicer_target_id)">
			<view class="item-head">
				<image class="icon iw2" :lazyLoad="true" mode="aspectFill" :src="config_page_notice_icons['servicer'] || ''"></image>
			</view>
			<view class="item-body">
				<view class="info">
					<view class="name">官方客服</view>
				</view>
				<view class="content">
					<view class="desc">7*24h实时在线为您服务（有问题请及时联系我们）</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		

		<view class="dialog-list">
			<block v-for="(item, index) in messageList" :key="index">
				<block v-if="item && item.user && item.user.id">
					<l-slide-view :height="130" :width="750" :slide-width="140" :close="close">
						<view slot="left" @tap.stop.prevent="toSliderUrl(18, item.user.id + '&name=' + item.user.user_name)" hoverClass="hover" class="dialog-item">
							<view class="item-head">
								<image class="icon iw2" :lazyLoad="true" mode="aspectFill" :src="item.user.user_avatar"></image>
							</view>
							<view class="item-body">
								<view class="info">
									<view class="name">{{ item.user.user_name }}</view>
									<view class="time">{{ item.datetime }}</view>
								</view>
								<view class="content">
									<mp-html v-if="item.read == '' || item.read == null" :content="item.chat_content || '[图片]'" class="desc" />
									<mp-html v-else :content="item.read.chat_content || '[图片]'" class="desc" />
									<view class="red-dot" v-if="item.read_count > 0 && item.user.id != myUserInfo.id">{{ item.read_count }}</view>
								</view>
							</view>
						</view>
						<view slot="right" class="right" :data-uid="item.user.id" @tap.stop.prevent="delMessage">
							<text class="_text">删除</text>
						</view>
					</l-slide-view>
				</block>
			</block>
		</view>
	
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

import lSlideView from '@/linui/slide-view/index';
const mixins = require('@/mixins/message');
const common = require('@/mixins/common');
var options = {};

common(options);
mixins(options);
export default {
	mixins: [{ methods: options }],
    components: {
		myToast,navBar,hoverBall,mpHtml,
        lSlideView
    },
	computed:{
		config_page_notice_mp_follow:{
			get(){
				let that = this;
				return that.$store.state.config.page.notice.mp_follow;
			},
			set(v){}
		},
		config_page_notice_style:{
			get(){
				let that = this;
				if(that.$store.state.config.page.notice && that.$store.state.config.page.notice.style){
					return that.$store.state.config.page.notice.style;
				}
				return 0;
			},
			set(v){}
		},
		config_page_notice_icons:{
			get(){
				let that = this;
				return that.$store.state.config.page.notice.icons;
			},
			set(v){}
		},
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 4,
            page: 1,
            messageQHList: [
                {
                    img: 'system',
                    title: '系统通知',
                    content: '',
                    date: '',
                    count: 0,
                    url: '/pages/message/notice/notice'
                },
                {
                    img: 'like',
                    title: '赞和收藏',
                    content: '',
                    date: '',
                    count: 0,
                    url: '/pages/message/likeAndfav/likeAndfav'
                },
                {
                    img: 'comment',
                    title: '评论和@',
                    content: '',
                    date: '',
                    count: 0,
                    url: '/pages/message/comment/comment'
                }
            ],
            messageList: [],
            close: false,
			isFollowMp: true,
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
	},
	onPullDownRefresh: function() {
		let that = this;
		that.setData({
			page: 1,
			messageQHList: [
			    {
			        img: 'system',
			        title: '系统通知',
			        content: '',
			        date: '',
			        count: 0,
			        url: '/pages/message/notice/notice'
			    },
			    {
			        img: 'like',
			        title: '赞和收藏',
			        content: '',
			        date: '',
			        count: 0,
			        url: '/pages/message/likeAndfav/likeAndfav'
			    },
			    {
			        img: 'comment',
			        title: '评论和@',
			        content: '',
			        date: '',
			        count: 0,
			        url: '/pages/message/comment/comment'
			    }
			],
			messageList: [],
			close: false,
			isFollowMp: false,
		});
		if (uni.$store.state.token) {
			that.getMessages();
			that.getUserChatList();
		}
	},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
		// #ifdef MP-WEIXIN
		getApp().globalData.$mpTabbar = this.$mp.page.getTabBar();
		// #endif
		
		//  #ifdef MP
		that.tabBarSetData({selected: 3});;
		that.tabBarSetData({
			sysMessageCount: 0
		});
		// #endif
		//  #ifndef MP
		that.$store.commit('updateTabbarIndex', 3);;
		// #endif
		
		that.updateScene(4, 0);

		that.$store.commit('updateSysMessageCount', 0);

		
		if (uni.$store.state.token) {
			that.getMessages();
			that.getUserChatList();
		}
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getMessages();
        this.getUserChatList();
        uni.stopPullDownRefresh();
    },
	onTabItemTap : function(e) {
		// #ifndef MP-WEIXIN
		if(e.pagePath == 'pages/tabbar/notice/notice'){
			uni.wen.util.doVibrateShort();
		}
		// #endif
	},
    methods: {
		toLogin(){
			let that = this;
			if(that.$store.state.scene == 14){
				return;
			}
			uni.wen.toUrl(-4, null, null);
		},
        onMenuItem: function (e) {
            var url = e.currentTarget.dataset.url;
			uni.wen.toUrl(6, url, null);
        },

    }
};
</script>
<style lang="scss">
@import './notice.scss';
.mini-page-body.notice{
	@include background_color(page-box-background-color);
}
</style>
