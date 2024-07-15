<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
    <view class="mini-page-body">
        <web-view :src="tourl"  @message="handleMessage"></web-view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
    </view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';

export default {
	components: {
		myToast,navBar,hoverBall,
	},
    data() {
        return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 37,
			title: '',
            tourl: '',
        };
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
        that.setData({
            tourl: decodeURIComponent(options.url),
        });
		console.log(that.tourl);
		// let parse = util.parseUrlQuery(that.url);
    },
	onBackPress(e) {
	},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		let that = this;
		that.updateScene(37, 0);
	},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
		
	},
    methods: {
		handleMessage(evt){
			let that = this;
			console.log('+++++++++++++++++++++++++++evt.detail.data+++++++++++++++++++++++++++');
			console.log(evt.detail.data);
			let data = evt.detail.data[0];
			let action = data.action;
			if(action == 'toShopGoods'){
				let tk_goodsid = data.goodsid;
				let tk_platform = data.platform;
				let dtk_id = data.id;
				uni.wen.toUrl(3, '&dtk_id=' + dtk_id + '&tk_goodsid=' + tk_goodsid + '&tk_platform=' + tk_platform, null);
			}
		}
		
	}
};
</script>
<style lang="scss">
@import './index.scss';
</style>
