
<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<navBar :back="false" :iconTheme="iconTheme" title="闲置详情" :home="false"
				:background="global__theme__ == 'black' ? 'rgba(25, 25, 30, ' + navbarTrans + ')' : 'rgba(255, 255, 255, ' + navbarTrans + ')'"
				:color="'rgba(' + color + ', ' + navbarTrans + ')'" :placeholder="false">
				<view slot="left" :class="'back ' + (iconTheme == 'white' ? '' : 'b')">
					<i class="mini-icon mini-zuojiantou" @tap.stop.prevent="toSliderUrl(-2, 0)"
						:style="'color: '+iconTheme+';'"></i>
					<view :class="'line ' + (iconTheme == 'white' ? '' : 'lb')"></view>
					<i class="mini-icon mini-fanhuishouye" @tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/home/index?fph=1')"
						:style="'color: '+iconTheme+';'" /></i>
				</view>
				<!-- #ifndef MP -->
				<view slot="right" class="lxy-nav-bar__logo">
					<i class="mini-icon mini-fenxiang2" @tap.stop.prevent="inviteUserTap" :style="'color: '+iconTheme+';'"></i>
				</view>
				<!-- #endif -->
			</navBar>
			<view class="goods-details">
				<!--banner-->
				<!-- <u-swiper :list="good.image_urls" keyName="url" height="750" indicator-pos="bottomRight" indicator
					indicatorMode="line" circular @click="swiperClick"></u-swiper> -->
					
				<view class="swiper-content">
					<!-- 轮播区 -->
					<view class="swiper-area w-full">
						<swiper class="h-full" :indicator-dots="false" circular="true" duration="400" :current="swiperIdx" :autoplay="(good.video_url && good.video_url.length > 0) ? false : true" @change="swiperChange">
							<swiper-item v-if=" good.video_url && good.video_url.length > 0 " class="dflex-c">
								<!-- #ifdef APP -->
								<view class="wh-full pos-r" @tap.stop.prevent="toVideo">
									<image :src="good.video_cover" class="wh-full" lazy-load mode="aspectFill"></image>
									<i class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
								</view>
								<!-- #endif -->
				
								<!-- #ifndef APP -->
								<view class="wh-full pos-r dflex-c" style="background: #000;" @tap.stop.prevent="toVideo">
									<video id="uVideo" :src="good.video_url" :poster="good.video_cover"
										:poster-for-crawler="good.video_cover" :show-fullscreen-btn="false" :controls="false"
										:show-play-btn="false" :show-center-play-btn="false" :enable-progress-gesture="false"
										@ended="videoPause = false" object-fit="cover" class="h-full" :autoplay="true" :loop="true" :muted="true" style="width: 100%;"></video>
									<i v-if="videoPause" class="mini-icon mini-shipin1 bofang pos-a pos-tl-c"></i>
								</view>
								<!-- #endif -->
							</swiper-item>
							<swiper-item v-for="(item, idx) in good.image_urls" :key="idx" v-if="good.image_urls && good.image_urls.length > 0">
								<view class="wh-full">
									<image :src="item.url" class="wh-full" lazy-load mode="aspectFill" @tap.stop.prevent="swiperClick(idx)"></image>
								</view>
							</swiper-item>
						</swiper>
						<view class="img_tips_count">{{ swiperIdx + 1 }} / {{ good.image_urls.length + ( (good.video_url && good.video_url.length > 0) ? 1 : 0 ) }}</view>
					</view>
				</view>	
				
				<view class="goods-cont">
					<view class="inner">
						<view class="goods-user" @tap.stop.prevent="toSliderUrl(4, good.user.id)" v-if="good.user">
							<image :src="good.user.user_avatar" mode="aspectFill" class="avatar"></image>
							<view>
								<view class="name">{{ good.user.user_name }}</view>
								<view class="time">{{ good.user.online_time }}来过</view>
							</view>
						</view>
						<view class="goods-title">
							<view class="goods-name">
								<view class="box">
									{{ good.title }}
								</view>
							</view>
							<view class="goods-price">
								<text class="price">￥{{ good.price }}</text>

								<text class="oldPirce">￥{{ good.original_price }}</text>
								<text class="tip" v-if="good.tip">{{ good.tip }}</text>
							</view>
						</view>
						<view class="goods-detail">
							{{ good.detail }}
						</view>
						<view class="goods-loc"
							@tap.stop.prevent="toSliderUrl(30, good.longitude + '|' + good.latitude + '|' + good.address_name + '|8')"
							v-if="good.address_name">
							<view class="flex-row">
								<view class="icon flex-column" style="justify-content: center;"><i
										class="mini-icon mini-dizhi3 inline-flex"></i></view>
								<text class="_text u-line-1">{{ good.address_name }}</text>
							</view>
							<view class="label">{{ good.distance }}</view>
						</view>
						<view class="goods-map" v-if="good.id > 0 && good.is_self_pickup == 1 && config2_page_used_detail_map == 1 && good.longitude && good.latitude">
							<!-- #ifdef MP -->
							<map :longitude="good.longitude" :latitude="good.latitude" class="_map" :show-location="true"
								:enable-building="true" :markers="good.markers"></map>
							<!-- #endif -->
							<!-- #ifdef APP -->
							<!-- <map :longitude="good.longitude" :latitude="good.latitude" class="_map" :show-location="true"
								:enable-building="true" :markers="good.markers" v-if="!showOverlay"></map> -->
							<!-- #endif -->
						</view>
					</view>
				</view>
				<view class="gap"></view>
				<view class="commets-cont">
					<view class="inner">
						<view class="title">{{ good.comment_count || 0 }}条留言</view>
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
				<view class="safe_area_height"></view>

				<view class="navigation">
					<view class="left">
						<u-grid :col="2">
							<u-grid-item :customStyle="customStyle" @click="showCommendPopup">
								<i class="mini-icon mini-sixin"></i>
								<block v-if="good.comment_count > 0">
									<view class="grid-text">{{ good.comment_count }}</view>
								</block>
								<block v-else>
									<view class="grid-text">留言</view>
								</block>
							</u-grid-item>
							<!-- <u-grid-item :customStyle="customStyle">
								<u-icon name="star" :size="40"></u-icon>
								<view class="grid-text">收藏</view>
							</u-grid-item> -->
						</u-grid>
					</view>
					<view class="right">
						<block v-if="good.status === 0">
							<view>商品审核中</view>
						</block>
						<block v-else-if="good.status === 1">
							<block v-if="isOfficial > 1">
								<view class="buy btn u-line-1"
									@tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/issue/index?id=' + good.id)">编辑</view>
								<view class="btn u-line-1" @tap.stop.prevent="usedGoodStatus(2)">下线</view>
								<block>
									<view v-if="config2_page_used_detail_buy == 1" class="buy btn u-line-1" @tap.stop.prevent="getShopAddCart">立即购买</view>
									<view v-else-if="good.contact_phone && good.contact_phone.length > 0" class="buy btn u-line-1" @tap.stop.prevent="toSliderUrl(22, good.contact_phone)">打电话</view>
								</block>
								
								<view class="btn u-line-1" @tap.stop.prevent="iNeed">我想要</view>
							</block>
							<block v-else-if="good.user_id == myUserInfo.id">
								<view class="buy btn u-line-1"
									@tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/issue/index?id=' + good.id)">编辑</view>
								<view class="btn u-line-1" @tap.stop.prevent="usedGoodStatus(2)">下线</view>
							</block>
							<block v-else>
								<block>
									<view v-if="config2_page_used_detail_buy == 1" class="buy btn u-line-1" @tap.stop.prevent="getShopAddCart">立即购买</view>
									<view v-else-if="good.contact_phone && good.contact_phone.length > 0" class="buy btn u-line-1" @tap.stop.prevent="toSliderUrl(22, good.contact_phone)">打电话</view>
								</block>
								<view class="btn u-line-1" @tap.stop.prevent="iNeed">我想要</view>
							</block>
						</block>
						<block v-else-if="good.status === 2">
							<block v-if="good.user_id == myUserInfo.id">
								<view class="buy btn u-line-1"
									@tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/issue/index?id=' + good.id)">编辑</view>
								<view class="btn u-line-1" @tap.stop.prevent="usedGoodStatus(0)">重新上架</view>
							</block>
							<block v-else>
								<view>该商品等待作者重新上架</view>
							</block>
						</block>
						<block v-else-if="good.status === 3">
							<view class="btn u-line-1">已卖出</view>
						</block>
						<block v-else-if="good.status === 4">
							<view>商品审核不通过</view>
						</block>
						<block v-else-if="good.status === 5">
							<view class="btn u-line-1" @tap.stop.prevent="toSliderUrl(6, '/pagesS/sellers/sales/sales')"
								v-if="good.user_id == myUserInfo.id">前往发货</view>
							<view class="btn u-line-1" v-else>已卖出</view>
						</block>
						<block v-else-if="good.status === 6">
							<block v-if="good.user_id == myUserInfo.id">
								<view>买家已退款</view>
								<view class="buy btn u-line-1"
									@tap.stop.prevent="toSliderUrl(6, '/pagesU/used-mall/issue/index?id=' + good.id)">编辑</view>
								<view class="btn u-line-1" @tap.stop.prevent="usedGoodStatus(0)">重新上架</view>
							</block>
							<block v-else>
								<view>该商品等待作者重新上架</view>
							</block>
						</block>
						<block v-else-if="good.status === 7">
							<block v-if="good.user_id == myUserInfo.id">
								<view>等待买家付款中，暂无法操作</view>
							</block>
							<block v-else>
								<view>等待买家付款中</view>
							</block>
						</block>
					</view>
				</view>
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



			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
	</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

	// import goodsComment from '../comonents/goods-comment.vue';
	import goodsComment from '../comonents/cu-comment/comment.vue'
	import emoji from '../comonents/cu-emoji/cu-emoji.vue'
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
			myToast,
			navBar,
			hoverBall,
			goodsComment,
			emoji
		},
		computed: {
			config2_page_used_detail_map:{
				get(){
					let that = this;
					if(that.$store.state.config2.page.used && that.$store.state.config2.page.used.detail){
						if(that.$store.state.config2.page.used.detail.map){
							return that.$store.state.config2.page.used.detail.map
						}
					}
					return 1;
				},
				set(v){}
			},
			config2_page_used_detail_buy:{
				get(){
					let that = this;
					if(uni.$store.state.config.app.mode == 'examine'){
						return 0;
					}
					if(that.$store.state.config2.page.used && that.$store.state.config2.page.used.detail){
						return that.$store.state.config2.page.used.detail.buy
					}
					return 1;
				},
				set(v){}
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
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 99,
				id: 0,
				selectAction: 'used',
				navbarTrans: 0,
				color: '0,0,0',
				iconTheme: 'white',
				good: {
					title: '',
					detail: '',
					price: 0,
					original_price: 0,
					is_self_pickup: 1,
					is_express_delivery: 0,
					express_cost: 0,
					image_urls: [],
					longitude: 0,
					latitude: 0,
					address_name: '',
					address_detailed: '',
					status: 0,
					user: {
						user_name: '',
						user_avatar: '',
						online_time: '',
					}
				},
				
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
				
				swiperIdx: 0,
				videoPause: false,
				
			}
		},
		onLoad(options) {
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

			that.getUsedGoodDetail();
			that.getCommentList();
		},
		watch: {
			showOverlay(val) {
				if (!val) {
					this.iconType = ''
					uni.hideKeyboard()
				}
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(99, that.id, false, false, 0, 2);
		},
		onPullDownRefresh: function() {
			let that = this;
			
			that.getUsedGoodDetail();
			that.getCommentList();

			setTimeout(function() {
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			}, 700);
		},
		onPageScroll: function onPageScroll(e) {
			let that = this;

			var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;

			if (trans > 1 && that.navbarTrans > 1) {
				return false
			}

			var frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
			var backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
			var iconTheme = that.iconTheme
			var iconRight = that.iconRight
			if (trans == 0) {
				frontColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
				backgroundColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
				iconTheme = that.$store.state.theme == 'black' ? 'black' : 'white'
			} else if (trans >= 0.4) {
				frontColor = that.$store.state.theme == 'black' ? '#ffffff' : '#000000'
				backgroundColor = that.$store.state.theme == 'black' ? '#000000' : '#ffffff'
				iconTheme = that.$store.state.theme == 'black' ? 'white' : 'black'
			}
			that.setData({
				navbarTrans: trans,
				iconTheme: iconTheme,
				color: that.$store.state.theme == 'black' ? '255,255,255' : '0,0,0',
			})
			uni.setNavigationBarColor({
				frontColor: frontColor,
				backgroundColor: backgroundColor,
				animation: {
					duration: 400,
					timingFunc: 'easeIn',
				},
			}) //发帖按钮
			that.scrollTop = e.scrollTop
		},
		onShareAppMessage: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.detail_title.replace('[good_title]', that.good.title),
				path: '/pagesU/used-mall/detail/index?id=' + that.good.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.good.pic
			};
		},
		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.detail_title.replace('[good_title]', that.good.title),
				query: 'id=' + that.good.id + '&fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: uni.wen.util.removeStyles(that.good.pic) + '?imageMogr2/thumbnail/200x200/crop/200x200/gravity/center/format/jpg/interlace/0/quality/100'
			};
		},
		// onReachBottom() {
		// 	this.getCommentList();
		// },
		methods: {
			toVideo() {
				// #ifdef APP
				uni.wen.toUrl(6, '/pages/common/video?url=' + this.good.video_url, this);
				return false;
				// #endif
				
				// #ifndef APP
				if (!this.uVideo) this.uVideo = uni.createVideoContext('uVideo', this);
				if (this.uVideo.isNotplay) {
					// 未播放
					this.uVideo.isplay = true;
					this.videoPause = false;
					// this.goods.video.loaded = true;
					this.uVideo.play();
					return false;
				}else{
					this.uVideo.pause();
					this.uVideo.isNotplay = true;
					this.videoPause = true;
					uni.wen.toUrl(6, '/pages/common/video?url=' + this.good.video_url, this);
					return false;
				}
				// #endif
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
				for (let i in that.good.image_urls) {
				    imagesArr.push(that.good.image_urls[i].url);
				}
				
				uni.previewImage({
				    current: that.good.image_urls[index].url,
				    urls: imagesArr
				});
				return false;
			},
			inviteUserTap() {
			  let that = this;
			  uni.wen.util.inviteUser('/pagesU/used-mall/detail/index', that.$store.state.config2.used.share.detail_title.replace('[good_title]', that.good.title), 'id=' + that.good.id, that.good.pic);
			},
			iNeed(){
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/need', {
					used_good_id: that.good.id,
					status: 1,
				}, 'POST').then(function(res) {
					uni.loading(false);
					if (res.status) {
						setTimeout(function(){
							uni.wen.toUrl(18, that.good.user_id, that)
						}, 300);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			usedGoodStatus(status) {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/status', {
					id: that.id,
					status: status,
				}, 'POST').then(function(res) {
					uni.loading(false);
					if (res.status) {
						uni.showToast({
							title: '操作成功',
							icon: 'none'
						});
						uni.wen.toUrl(-2, null);
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
					
				});
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
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/comment/list', {
					used_good_id: that.id,
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
					used_good_id: parseInt(that.id), //商品id
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
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/comment/process', parms, 'POST').then(function(res) {
					uni.loading(false);
					if (res.status) {
						uni.showToast({
							title: '评论成功',
							icon: 'none'
						})
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
			getUsedGoodDetail() {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/detail', {
					id: that.id
				}).then(function(res) {
					uni.loading(false);
					uni.stopPullDownRefresh();
					if (res.status) {
						that.good = res.data;
						
						// #ifdef H5
						if(uni.$store.state.h5_browser == 'wxclient'){
							setTimeout(function(){
								let share_title = that.$store.state.config2.used.share.detail_title.replace('[good_title]', that.good.title);
								let share_img = that.good.pic;
								uni.wen.util.setH5WeixinShare(share_img, share_title, that.good.user.user_name);
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
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import './index.scss';
</style>