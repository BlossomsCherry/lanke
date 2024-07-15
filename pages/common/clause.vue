<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body">
        <view class="container">
			<mp-html :content="htmlSnip" class="clause-content" />
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import mpHtml from '@/contrib/components/common/mp-html/components/mp-html/mp-html';

export default {
    components: {
		myToast,navBar,hoverBall,mpHtml
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 52,
            htmlSnip: ''
        };
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
		that.globalOnloadProcess(options);
        if (options.id == -1 || options.type == -1) {
            uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/noticeDetail', {
                id: options.id || options.type
            }).then(function (res) {
                that.setData({
                    htmlSnip: res.data.content
                });
            });
        } else {
            uni.wen.util.request(uni.wen.api.ApiRootUrl + 'common/getClauseDetail', {
                id: options.id || options.type
            }).then(function (res) {
                that.setData({
                    htmlSnip: res.data.content
                });
				uni.setNavigationBarTitle({
				    title: res.data.title
				});
            });
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(52, 0);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
    methods: {}
};
</script>
<style lang="scss">
.container {
    margin: 0 auto;
    width: calc(100% - 60rpx);
    padding-bottom: 100rpx;
	.clause-content{
		@include color(color-light-dark);
		@include background_color(page-box-background-color);
		min-height: 100vh;
		p,span, h1,h2,h3,h4,h6{
			@include color(color-light-dark);
			@include background_color(page-box-background-color);
		}
	}
}

</style>
