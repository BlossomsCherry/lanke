<template>
    <view :class="'shop-box scene_' + scene" @tap.stop.prevent="toDetail">
		<block v-if="data.ad">
			<!-- #ifdef MP -->
			<view class="water-ad-wrap" v-if="data.ad">
				<block  v-if="data.ad.type && data.ad.type == '1' ">
					<i class="mini-icon mini-adtip" @tap.stop.prevent="toSliderUrl(data.ad.target_type, data.ad.target_id)"></i>
					<image class="_image" :src="data.ad.img" @tap.stop.prevent="toSliderUrl(data.ad.target_type, data.ad.target_id)" mode="widthFix"></image>
				</block>
				<block v-else>
					<view class="ad-content"><ad-custom :unit-id="data.ad.unit" ></ad-custom></view>
				</block>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="water-ad-wrap" v-if="data.ad">
				<block v-if="data.ad.type && data.ad.type == '1' ">
					<i class="mini-icon mini-adtip" @tap.stop.prevent="toSliderUrl(data.ad.target_type, data.ad.target_id)"></i>
					<image class="_image" :src="data.ad.img" @tap.stop.prevent="toSliderUrl(data.ad.target_type, data.ad.target_id)" mode="widthFix"></image>
				</block>
				<block v-else>
					<view class="ad-content"><ad :adpid="data.ad.unit"></ad></view>
				</block>
			</view>
			<!-- #endif -->
		</block>
		<block v-if="data.img_count == 0 && data.random_bg && data.random_bg.length > 0">
			<contextualPopup subject="posts" :popList="data.longtaps" :para="{ style: 'water' }" :scene="scene">
				<view slot="content">
					<view class="random-bg-wrap" :style="'background-image: url(' + data.random_bg + ');'">
						<view class="inner">
							<i class="mini-icon quotation-icon mini-baojiaquotation2"></i>
							<view class="title-wrap2">
								<block v-if="data.is_only_text == 1">
									<text class="post-title">
									<text :class="'icon-text ' + only_text_icon " v-if="only_text_icon"></text>
									{{ data.posts_title ? data.posts_title : data.posts_content_raw }}</text>
								</block>
								<block v-else>
									<mp-html :content="data.posts_title ? data.posts_title : data.posts_content_raw" class="post-title" :pay_type=" (data.pay_obj.price > 0 ? data.pay_obj.pay_type : -1)" :isSticky="data.is_sticky" :scene="scene" :isAdminDelete="data.posts_state == 2" :isInReview="data.is_examine" />
								</block>
							</view>
						</view>
						<block v-if="data.circle && data.circle.can_i_visit == 2">
							<view class="civ2-icon-wrap">
								<view class="flex-row" style="margin: auto;">
									<i class="civ2-icon mini-icon2 mini-zhifumima"></i>
									<view class="text">无权限</view>
								</view>
							</view>
						</block>
					</view>
					<view class="df-box">
					    <view class="df-box-comt" @tap.stop.prevent="toSliderUrl(4, data.user.id)" :data-id="data.user.id">
							<view class="head-portrait-wrap">
								<image class="head-portrait" mode="aspectFill" :src="data.user.user_avatar" />
								<i class="avatar-authentication-icon mini-icon mini-verify" v-if="data.user.is_authentication == 1"></i>
							</view>
					        <text class="shop-box-name">{{ data.user.user_name }}</text>
							<i class="watar-header-label official-icon mini-icon mini-renzhengguanli1" v-if="data.user.is_official == 1"></i>
							<!-- <i class="watar-header-label vip-icon mini-icon mini-vip" v-if="data.user.is_member == 1"></i> -->
					    </view>
						<block v-if="scene == 5 && config_app_mode != 'examine' && config_pays && config_pays.paycode_5">
							<view class="df-box-comt jc water-mine-promotion" @tap.stop.prevent="toSliderUrl(6, '/pagesC/promotion/post?id=' + data.id)">
								<text class="_text">推广</text>
							</view>
						</block>
						<block v-else>
							<view class="df-box-comt jc">
								<text class="_text">{{ data.like_count > 999 ? filters.toFix(data.like_count) : data.like_count }}</text>
								<i class="mini-icon mini-xihuan-shixin icon" v-if="data.is_like" @tap.stop.prevent="taplikes"></i>
								<i class="mini-icon mini-xihuan-kongxin icon" v-else @tap.stop.prevent="taplikes"></i>
							</view>
						</block>
					</view>
				</view>
			</contextualPopup>
		</block>
		<block v-else>
			<contextualPopup subject="posts" :popList="data.longtaps" :para="{ style: 'water' }" :scene="scene">
				<view slot="content">
					<view class="img-wrap">
						<image :class="'shop-box-cover' + (data.is_blur ? ' img-blur' : '')" mode="widthFix" :src="data.img" />
						<i class="mini-icon mini-shipin1" v-if="data.post_type == 'video' || data.wechat_sph"></i>
						<view class="blur-tips" v-if="data.is_blur">图片疑似引人不适</view>
						<block v-if="data.circle && data.circle.can_i_visit == 2">
							<view class="civ2-icon-wrap">
								<i class="civ2-icon mini-icon2 mini-zhifumima"></i>
							</view>
						</block>
					</view>
					<view class="title-wrap">
						<block v-if="data.is_only_text == 1">
							<text class="shop-box-title">
							<text :class="'icon-text ' + only_text_icon " v-if="only_text_icon"></text>
							{{ data.posts_title ? data.posts_title : data.posts_content_raw }}</text>
						</block>
						<block v-else>
							<mp-html :content="data.posts_title ? data.posts_title : data.posts_content_raw" class="shop-box-title" :pay_type="post_pay_type" :isSticky="data.is_sticky" :scene="scene" :isAdminDelete="data.posts_state == 2" :isInReview="data.is_examine" />
						</block>
					</view>
					<view class="df-box">
						<view class="df-box-comt" @tap.stop.prevent="toSliderUrl(4, data.user.id)" :data-id="data.user.id">
							<view class="head-portrait-wrap">
								<image class="head-portrait" mode="aspectFill" :src="data.user.user_avatar" />
								<i class="avatar-authentication-icon mini-icon mini-verify" v-if="data.user.is_authentication == 1"></i>
							</view>
							<text class="shop-box-name">{{ data.user.user_name }}</text>
							<i class="watar-header-label official-icon mini-icon mini-renzhengguanli1" v-if="data.user.is_official == 1"></i>
							<!-- <i class="watar-header-label vip-icon mini-icon mini-vip" v-if="data.user.is_member == 1"></i> -->
						</view>
						<block v-if="scene == 5 && config_app_mode != 'examine' && config_pays && config_pays.paycode_5">
							<view class="df-box-comt jc water-mine-promotion" @tap.stop.prevent="toSliderUrl(6, '/pagesC/promotion/post?id=' + data.id)">
								<text class="_text">推广</text>
							</view>
						</block>
						<block v-else>
							<view class="df-box-comt jc">
								<text class="_text">{{ data.like_count > 999 ? filters.toFix(data.like_count) : data.like_count }}</text>
								<i class="mini-icon mini-xihuan-shixin icon" v-if="data.is_like" @tap.stop.prevent="taplikes"></i>
								<i class="mini-icon mini-xihuan-kongxin icon" v-else @tap.stop.prevent="taplikes"></i>
							</view>
						</block>
						
					</view>
				</view>
			</contextualPopup>
		</block>
    </view>
	
</template>
<script module="filters" lang="wxs" src="@/utils/fixed.wxs"></script>
<script>
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';
import contextualPopup from '@/components/common/contextual-popup/contextual-popup';
export default {
    components: {
		contextualPopup,
		mpHtml
	},
    data() {
        return {};
    },
    /**
     * 组件的属性列表
     */
    props: {
        data: Object,
		lindex: {
			type: Number,
			default: -1
		},
		rindex: {
			type: Number,
			default: -1
		},
		scene: {
			type: Number,
			default: 0
		}
    },
	computed:{
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
		config_app_mode:{
			get(){
				let that = this;
				if(that.$store.state.config.app && that.$store.state.config.app.mode){
					return that.$store.state.config.app.mode;
				}
				return ' ';
			},
			set(v){}
		},
		post_pay_type:{
			get(){
				return this.data?.pay_obj?.pay_type ?? -1;
			},
			set(v){}
		},
		only_text_icon: {
			get(){
				let icon = '';
				if(this.data.posts_state == 2){
					icon = 'isAdminDelete-icon';
				}else if(this.data.is_examine === 0){
					icon = 'isInReview-icon';
				}else if(this.data.is_examine == 2){
					icon = 'reviewBack-icon';
				}
				
				if(this.data.is_sticky){
					icon += ' isSticky-icon'
				}
				
				if(this.post_pay_type == 0){
					icon += ' pay-coins-icon';
				}else if(this.post_pay_type == 1){
					icon += ' pay-balance-icon';
				}
				return icon;
			},
			set(v){}
		}
	},
    /**
     * 组件的方法列表
     */
    methods: {
		taplikes(){
			let that = this;
			that.$emit('taplikes', {id: that.data.id, lindex: that.lindex, rindex: that.rindex});
		},
		toDetail(){
			let that = this;
			let post_id = that.data.id;
			let post_type = that.data.post_type;
			let civ = (that.data.circle && that.data.circle.can_i_visit) ? that.data.circle.can_i_visit : 0;
			if(civ == 2){
				if(that.scene == 60001){
					uni.showToast({
						title: '请先加入圈子',
						icon: 'none'
					});
				}else{
					uni.wen.toUrl(2, that.data.circle.id + '&civ=' + civ);
				}
				return false;
			}
			
			if(post_type == 'video'){
				if(that.$store.state.config.app.mode != 'examine' && that.$store.state.config.page.sticky.video_slide){
					if(that.scene == 6){
						uni.wen.toUrl(6, '/pagesC/video/slide?id='+post_id + '&is_circle=1', that);
					}else{
						uni.wen.toUrl(6, '/pagesC/video/slide?id='+post_id, that);
					}
					return false;
				}
			}
			
			if(that.data.presets){
				that.toSliderUrl(1, post_id + '&presets=' + that.data.presets);
				return false;
			}
			
			uni.wen.toUrl(1, post_id, that);
		}
    }
};
</script>
<style lang="scss">
@import './index.scss';
</style>
