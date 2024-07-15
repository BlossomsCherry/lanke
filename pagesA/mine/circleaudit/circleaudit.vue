<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body">
        <view class="container">
			<scroll-view :show-scrollbar="false" scrollY class="right-items" :scrollTop="scrollTop">
				<view class="loading" v-if="subcatsloading">
					<view class="spinner">
						<view class="rect rect1"></view>
						<view class="rect rect2"></view>
						<view class="rect rect3"></view>
						<view class="rect rect4"></view>
						<view class="rect rect5"></view>
					</view>
				</view>
			    <view class="area-club" v-if="subcats.length > 0 && !subcatsloading" v-for="(item, index) in subcats" :key="index">
			        <image class="image circle_shape" mode="aspectFill" :src="item.head_portrait"></image>

			        <view class="area-club-info">
			            <view class="area-club-name">{{ item.circle_name }}</view>
			            <view class="area-club-creater">
			                <view class="area-club-creater">
			                    <text class="_text">{{ item.post_count }}条笔记</text>
			                    <view class="shu"></view>
			                    <text class="_text">{{ item.user_circle_count }}人讨论</text>
			                </view>
			            </view>
			            <view class="mt-6">简介：{{ item.circle_introduce }}</view>
			        </view>

			        <view class="editor-box">
			            <view class="btn k" @tap.stop.prevent="toEditor(item.id)">编辑</view>
			            <view class="btn s" @tap.stop.prevent="toStick(item.id)">审贴</view>
			        </view>
			    </view>
			    <view class="empty-view" v-if="subcats != null && subcats.length == 0 && !subcatsloading">
			        <u-empty text="还没有创建圈子呢" width="300" height="300" text-size="28" />
			    </view>
			</scroll-view>
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

	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 25,
            subcats: [],
            subcatsloading: true,
            scrollTop: 0
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
        that.userCricle();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(25, 0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
    methods: {
        toEditor: function (id) {
			uni.wen.toUrl(6, '/pagesA/circle/creat/index?type=1&id=' + id, null);
        },
        toStick: function (id) {
			uni.wen.toUrl(6, '/pages/circle/circleaudit?id=' + id, null);
        }
    }
};
</script>
<style lang="scss">
@import './circleaudit.scss';
</style>
