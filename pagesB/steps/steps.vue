<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body">
		<view class="banner">
			<navBar :back="true" :home="fph" title="" :iconTheme="iconTheme" :background="'rgba(255, 255, 255, ' + navbarTrans + ')'"
				:color="'rgba(' + color + ', ' + navbarTrans + ')'"  title="代理人计划">
			</navBar>
			<view class="colorful-make"></view>
			<view class="text-center">
				<view class="title">推荐赚钱，自购省钱</view>
				<view class="sub-title">官方的代理人计划，简单仅需一步，永久绑定</view>
			</view>
		</view>
		<rxlTimeline>
		    <rxlTimelineItem timestamp="第一步: 他人微信好友申请" title="他人加我好友并备注你的推广简称" desc="假设你的推广简称为: 邵闻" :size="15" color="#4e9876">
				<template #body>
				    <view style="color:#555555">
						<image src="https://img.mini.minisns.cn/images/page/addfriends.png" mode="aspectFit"></image>
					</view>
				</template>
		    </rxlTimelineItem>
		    <rxlTimelineItem timestamp="第二步: 你向我说明你的推广简称" :size="15" :showTail="true" color="#4e9876">
		        <template #body>
		            <view style="color:#555555">这个仅需在第一次邀请后，需要向我说明，后面除非有变动，无需再次声明
					<image src="https://img.mini.minisns.cn/images/page/invite2.png" mode="aspectFit"></image>
					</view>
		        </template>
		    </rxlTimelineItem>
			<rxlTimelineItem timestamp="其他说明" :size="15" :showTail="false" color="#4e9876">
				<template #body>
				    <view style="color:#555555">
						问题一：是不是永久的还是说只返一次？
						答：是永久的。
						<image src="https://img.mini.minisns.cn/images/page/minewecaht.png" mode="aspectFit"></image>
					</view>
				</template>
			</rxlTimelineItem>
		</rxlTimeline>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';



import rxlTimeline from '@/pagesB/components/rxl-timeline/rxl-timeline';
import rxlTimelineItem from '@/pagesB/components/rxl-timeline-item/rxl-timeline-item';
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		rxlTimeline,
		rxlTimelineItem
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 9999,
			navbarTrans: 0,
			color: '0,0,0',
			iconTheme: 'white',
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(9999, 0);
	},
	onPageScroll: function onPageScroll(e) {
		let that = this;
		var trans = (e.scrollTop > 55 ? 55 : e.scrollTop) / 55;
		
		if(trans > 1 && that.navbarTrans > 1){
			return false;
		}
		
		var frontColor = '#ffffff';
		var backgroundColor = '#000000';
		var iconTheme = 'white';
	
		if (trans == 0) {
			frontColor = '#ffffff';
			backgroundColor = '#000000';
			iconTheme = 'white';
		} else if (trans >= 0.4) {
			frontColor = '#000000';
			backgroundColor = '#ffffff';
			iconTheme = 'black';
		}
	
		that.setData({
			navbarTrans: trans,
			iconTheme: iconTheme,
		});
		uni.setNavigationBarColor({
			frontColor: frontColor,
			backgroundColor: frontColor,
			animation: {
				duration: 400,
				timingFunc: 'easeIn'
			}
		}); //发帖按钮
		//判断浏览器滚动条上下滚动
	
		if (e.scrollTop > that.scrollTop) {
			//向下滚动
			if (!that.showmenu) {
				that.setData({
					showmenu: true
				});
			}
		} else {
			//向上滚动
			if (that.showmenu) {
				that.setData({
					showmenu: false
				});
			}
		}
	
		that.scrollTop = e.scrollTop;
	},
	onShareAppMessage: function(res) {
		return {
			title: that.$store.state.config.share.format.app_share_right,
			path: '/pagesB/steps/steps?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	
	onShareTimeline: function(res) {
		let that = this;
		return {
			title: that.$store.state.config.share.format.app_share_right,
			query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
			imageUrl: ''
		};
	},
	onShow: function () {
		let that = this;
		// that.updateScene(30001);
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
	},
	onPullDownRefresh: function () {
	    uni.stopPullDownRefresh();
	},
	methods: {
	  
	}
}
</script>

<style lang="scss" scoped>
.banner {
    padding: 60px 20px;
    align-items: center;
    justify-content: center;
	display: flex;
	overflow: hidden;
	position: relative;
	color: #2997f7;
	background: rgba(41, 151, 247, .1);
	.colorful-make,.colorful-make:before, .colorful-make:after{
		position: absolute;
		color: #2997f7;
		background: rgba(41, 151, 247, .1);
		border-radius: 100%;
		content: ' ';
	}
	.colorful-make{
		bottom: 0;
		height: 290px;
		width: 323px;
		top: 60%;
		opacity: .6;
	}
	.colorful-make::before{
		right: -558px;
		bottom: 0;
		height: 300px;
		width: 677px;
		top: -325px;
		transform: rotate(341deg);
		opacity: .4;
	}
	.colorful-make::after {
	    left: -262px;
	    bottom: 0;
	    height: 214px;
	    width: 402px;
	    top: -170px;
	    transform: rotate(326deg);
	    opacity: .3;
	}
	.title {
	    @include color(color-darkest);
	    font-size: 20px;
	    margin: 20px auto;
	}
	.sub-title{
		color: rgb(78, 152, 118);
	}
}
</style>