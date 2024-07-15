<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="box mini-page-body">
		<navBar :back="true" :home="fph" title="关于我们" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			<!-- #ifdef APP || H5 -->
			<view slot="right" class="lxy-nav-bar__logo default">

			</view>
			<!-- #endif -->
		</navBar>
		<view class="page-body">
			<view class="logo-wrap">
				<image :src="config_about_logo" class="img"></image>
			</view>
			<!-- #ifdef APP -->
			<view class="version">Version {{ version }}</view>
			<!-- #endif -->
			<view class="box-content">{{ config_about_name }}</view>
			<view class="account">
				<view>
					<!-- #ifdef MP-WEIXIN -->
					<!-- [miniprogram-to-uniapp] 公众号关注组件 仅微信小程序支持 -->
					<official-account style="width: 300px; height: 84px"></official-account>
					<!-- #endif -->
					<view class="desc">{{ config_about_desc }}</view>
				</view>
			</view>
			<!-- #ifndef APP -->
			<view class="intro_page_url u-line-1" @tap="copy_intro_page_url(config_app_basic_intro_page)" v-if="config_app_basic_intro_page">App下载：{{ config_app_basic_intro_page }}</view>
			<!-- #endif -->
			<view style="height: 30rpx;"></view>
			<view class="setting-box">
				
				<block v-if="config2_page_mine_about_list">
					<block v-for="(item, index) in config2_page_mine_about_list" :key="index">
						<view @tap.stop.prevent="toSliderUrl(item.type, item.target)" class="row">
							<view class="left">
								<view class="title">{{ item.name }}</view>
							</view>
							<view class="right">
								<i class="mini-icon mini-youjiantou"></i>
							</view>
						</view>
						<view class="line"></view>
					</block>
				</block>
				
			</view>
			<view class="copyright-information">{{ config_about_copyright }}</view>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const mixins = require('@/mixins/user');
var options = {};
mixins(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
	},
	computed:{
		config_about_logo:{
			get(){
				let that = this;
				return that.$store.state.config.about.logo;
			},
			set(v){}
		},
		config_about_name:{
			get(){
				let that = this;
				return that.$store.state.config.about.name;
			},
			set(v){}
		},
		config_about_copyright:{
			get(){
				let that = this;
				return that.$store.state.config.about.copyright;
			},
			set(v){}
		},
		config_about_desc:{
			get(){
				let that = this;
				return that.$store.state.config.about.desc;
			},
			set(v){}
		},
		config_app_basic_intro_page:{
			get(){
				let that = this;
				return that.$store.state.config.app.basic.intro_page;
			},
			set(v){}
		},
		config2_page_mine_about_list:{
			get(){
				let that = this;
				if(that.$store.state.config2.page.mine && that.$store.state.config2.page.mine.about){
					return that.$store.state.config2.page.mine.about.list;
				}
				return [];
			},
			set(v){}
		},
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 28,
			version: 'v1.0.0',
        };
    },
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		// #ifdef APP
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			 that.version = inf.version;
		});
		// #endif
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(28, 0, false, false, 0, 2);
	},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        uni.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {},
    methods: {
		copy_intro_page_url(url){
			uni.setClipboardData({
			    data: url,
			    success: function () {
			        return uni.showToast({
			            title: '链接已复制'
			        });
			    }
			});
		}
	}
};
</script>
<style lang="scss">
@import './about.scss';

</style>
