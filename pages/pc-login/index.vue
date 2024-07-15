<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body contain">
        <view class="logo-box">
            <image :src="config_about_logo" class="img" />
            <view class="logosub">PC端登录确认</view>
        </view>
        <view class="login_bg">
            <button :loading="btnState" class="btn" @tap.stop.prevent="toPcLogin">登录</button>
            <view @tap.stop.prevent="back" class="btn2">取消</view>
        </view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
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
		},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 71,
            scan_scene: '',
            btnState: false
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		
        that.setData({
            scan_scene: options.scene
        });
    },
	onShow: function () {
		let that = this;
		that.updateScene(71, 0, true);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
    methods: {
        toPcLogin() {
            let that = this;
            that.setData({
                btnState: true
            });
            let res = uni.wen.util.loginNow();

            if (res == true) {
                that.pcLogin();
            }
        },

        /**
         * 返回登陆
         */
        back: function () {
            uni.reLaunch({
                url: '/pages/tabbar/index/index'
            });
        }
    }
};
</script>
<style lang="scss">
@import './index.scss';
</style>
