<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view style="min-height: 100vh;" class="mini-page-body">
		
		<navBar :back="true" :home="fph" title="我的认证" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		
		</navBar>
		
        <view class="loading" v-if="swiperload">
        	<view class="spinner">
        		<view class="rect rect1"></view>
        		<view class="rect rect2"></view>
        		<view class="rect rect3"></view>
        		<view class="rect rect4"></view>
        		<view class="rect rect5"></view>
        	</view>
        </view>
        <block v-else>
            <block v-if="isA">
                <view class="box">
                    <block v-if="alist.authentication_state == 0">
                        <image src="@/pagesA/static/image/mine/certification/eaxm.png"></image>
                        <text class="_text">认证审核中...</text>
                    </block>
                    <block v-else>
                        <image :src="alist.authentication_state == 1 ? '@/pagesA/static/image/mine/certification/confirmed.png' : '@/pagesA/static/image/mine/certification/notconfirmed.png'"
                        ></image>
                        <text class="_text">{{ alist.authentication_state == 1 ? '已认证成功!' : '认证被驳回了!' }}</text>
                        <text class="_text">{{ alist.authentication_state == 1 ? '认证主体：' + alist.name : '驳回原因：' + alist.overrule_content }}</text>
                        <view @tap.stop.prevent="upAuthentication">{{ alist.authentication_state == 1 ? '更换认证主体' : '重新提交认证' }}</view>
                    </block>
                </view>
            </block>
            <block v-else>
                <view class="container" style="padding-bottom: 50px">
                    <view class="content-container" style="padding-bottom: 30px">
                        <view class="item">
                            <text class="item-title">名称</text>
                            <input type="text" @input="onInputChange" class="item-input" :data-type="1" :maxlength="nameMaxLength" placeholder="期待显示的认证名称" :value="name" />
                            <text class="item-tip">{{ nameLength }}/{{ nameMaxLength }}</text>
                        </view>
                        <view class="item" v-if="config_app_mode != 'examine'">
                            <text class="item-title">联系方式</text>
                            <input type="text" @input="onInputChange" class="item-input" :data-type="2" :maxlength="nameMaxLength" placeholder="电话号码/微信号" :value="phone" />
                            <text class="item-tip">{{ phoneLength }}/{{ phoneMaxLength }}</text>
                        </view>
                        <view class="item">
                            <text class="item-title">简介</text>
                            <textarea @input="onInputChange" class="item-area" :data-type="3" :maxlength="descMaxLength" placeholder="简单的介绍一下" :value="desc"></textarea>
                            <text class="item-tip">{{ descLength }}/{{ descMaxLength }}</text>
                        </view>
                        <view class="item">
                            <view class="item-title">
                                证明图片
								<block v-if="config2_page_certification_img_tip">
									<view style="height: 10rpx;"></view>
									<text class="item-h-tip" v-for="(text, index) in config2_page_certification_img_tip" :key="index">{{ text }}</text>
								</block>
                            </view>
                            <view class="img-box">
                                <view @tap.stop.prevent="addimage" data-name="imagesubject" class="logo-container">
                                    <block v-if="imagesubject == null">
                                        <image class="logo-add" src="/static/image/new_construction_circle_cover_upload_picture.png"></image>
                                        <view class="img-text">点击上传</view>
                                    </block>
                                    <block v-else>
                                        <image class="logo-image" mode="aspectFill" :src="imagesubject"></image>
                                        <i class="logo-camera mini-icon mini-chacha" @tap.stop.prevent="delImage"></i>
                                    </block>
                                </view>
                            </view>
                        </view>
                        <text class="bottom-tip-text">身份信息证明图片官方承诺仅用于认证审核不做其他用途。</text>
                    </view>
                    <view @tap.stop.prevent="addAuthentication" class="bottom-button">提交审核</view>
                </view>
            </block>
        </block>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


const mixins = require('@/mixins/user');
const common = require('@/mixins/common');
var options = {};

mixins(options);
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
    },
	computed:{
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
		config2_page_certification_img_tip:{
			get(){
				let that = this;
				if(that.$store.state.config2.page.certification && that.$store.state.config2.page.certification.img_tip){
					return that.$store.state.config2.page.certification.img_tip;
				}
				return [];
			},
			set(v){}
		},
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 122,
            notice: true,
            nameMaxLength: 30,
            phoneMaxLength: 30,
            descMaxLength: 300,
            nameLength: 0,
            phoneLength: 0,
            descLength: 0,
            name: '',
            phone: '',
            desc: '',
            imagesubject: null,
            type: 'forum',
            alist: [],
            swiperload: true,
            isA: false
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
        that.userAuthentication();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(122, 0, false, false, 0, 2);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
    methods: {
        addimage: function (e) {
            this.uploadPictures(1, e.currentTarget.dataset.name);
        },

        delImage() {
            this.setData({
                imagesubject: null
            });
        },

        onInputChange: function (e) {
            var type = e.currentTarget.dataset.type;
            var varue = e.detail.value;
            if (1 == type)
                this.setData({
                    name: varue,
                    nameLength: varue.length
                });
            else if (2 == type)
                this.setData({
                    phone: varue,
                    phoneLength: varue.length
                });
            else if (3 == type) {
                this.setData({
                    desc: varue,
                    descLength: varue.length
                });
            }
        },

        upAuthentication() {
            this.setData({
                isA: false
            });
        },

     
    }
};
</script>
<style lang="scss">
@import './certification.scss';
</style>
