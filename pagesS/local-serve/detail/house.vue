<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<navBar :back="true" :home="fph" title="租房详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
				:background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			</navBar>
			<u-swiper :list="swiperList" height="750rpx" @change="e => current = e.current">
				<view slot="indicator" class="indicator-num">
					<text class="indicator-num__text">图片 {{ currentNum + 1 }}/{{ swiperList.length }}</text>
				</view>
			</u-swiper>
			<view class="house_cont">
				<view class="house_cont--title">整租|中学附近 自住标准装修 全屋品牌定制柜子 无甲醛担忧</view>
				<view class="house_cont--pirce">
					4300<text>元/月</text><text class="type">年付</text>
				</view>
				<view class="house_cont--tip">
					<view class="box">
						<view class="value">3室8厅2卫</view>
						<view class="title">房型</view>
					</view>
					<view class="box">
						<view class="value">100㎡</view>
						<view class="title">面积</view>
					</view>
					<view class="box">
						<view class="value">中/15层</view>
						<view class="title">楼层</view>
					</view>
					<view class="box">
						<view class="value">南</view>
						<view class="title">朝向</view>
					</view>
				</view>
				<view class="house_cont--tags">
					<view class="box">
						配套齐全
					</view>
					<view class="box">
						精装修
					</view>
					<view class="box">
						有电梯
					</view>
					<view class="box">
						普通住宅
					</view>
				</view>
				<view class="house_cont--time">1天前更新房源信息</view>
				<view class="house_cont--line"></view>
				<view class="house_cont--title" style="padding: 30rpx 0;">万达花园（金华）</view>
				<view class="house_cont--map">
					<map class="map"></map>
				</view>
				<view class="house_cont--line"></view>
				<view class="house_cont--title" style="padding: 30rpx 0;">房屋介绍</view>
				<view class="house_cont--jieshao">
					1.家电家具齐全，可直接拎包入住。<br />
					2.房间干净整洁，居住环境舒适。<br />
					3.专业管家和维修团队，保障您的生活不会因为居住时出现的任何问题而烦恼。<br />
					4.单间，一房一厅，标间，公寓房源，需要可联系，豪华装修，家私家电齐全，接拎包入住，有专门管家24小时服务，周边配套设施齐全，安全安静、如有需要看房，可随时直接联系本人！
				</view>
				<view class="house_cont--jieshaoTag">
					<view class="box" v-for="(item,index) in detailTag" :style="{'color':item.show?'#333333':'#cccccc'}">
						<u-icon :name="item.show?'checkbox-mark':'close'" :color="item.show?'#333333':'#cccccc'" size="26"></u-icon>
						{{item.value}}
					</view>
				</view>
				<view class="house_cont--line"></view>
				<view class="house_cont--agent">
					<view class="head">
						<image
							src="https://spic1.ajkimg.com/q0YcULfClRabAfrmn7g-z7aDei0xyMAcyhYHfUzjK7zCU4_dtYfCgV4GbbVDEpGkNRfTvcoNkVOCSHqI4NPud9GLQz11lnCxCLaB26_MUoOKkZ5eFynCu7lsP26__DJYXytNsgNXqmtAjD80agO6VA6-1iA0y-DemLPRGkqWLhX5690XFprg_kHObPuq6JYu"
							mode="aspectFill"></image>
						<view class="cont">
							<view class="name">陈小芳</view>
							<view class="company">金华乐租房地产经纪有限公司</view>
							<view class="license">营业执照</view>
						</view>
					</view>
					<view class="comment">
						<view class="left">
							<view class="value">4.5</view>
							<view class="rage">
								<u-rate :count="5" v-model="4.5" size="20rpx" gutter="2"></u-rate>
							</view>
						</view>
						<view class="right">
							<view class="box">
								<text>微聊回复</text>极快
							</view>
							<view class="box">
								<text>房源质量</text>较好
							</view>
							<view class="box">
								<text>服务水平</text>极佳
							</view>
							<view class="box">
								<text>预约响应</text>暂无
							</view>
						</view>
					</view>
				</view>
				<view class="house_cont--title" style="padding: 30rpx 0;">附近房源</view>
				<view class="house_cont--list">
					<rent-list></rent-list>
				</view>
				<view class="bottom">
					<button class="bottom_btn flex">
						打电话
					</button>
					<view class="app_bottom"></view>
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
	import rentList from '@/pagesS/components/rent-list/rent-list.vue';


	const common = require('@/mixins/common');
	var options = {};
	common(options);
	export default {
		mixins: [{
			methods: options
		}],
		components: {
			myToast,
			navBar,
			hoverBall,
			rentList
		},
		computed: {

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',
				fph: false,
				mytoast_data: {},
				pageTheme: 'default',
				page__scene__: 38,
				swiperList: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				currentNum: 0,
				detailTag: [{
						show: true,
						value: '冰箱'
					},
					{
						show: true,
						value: '洗衣机'
					},
					{
						show: true,
						value: '热水器'
					},
					{
						show: false,
						value: '宽带'
					},
					{
						show: true,
						value: '沙发'
					},
					{
						show: true,
						value: '油烟机'
					},
					{
						show: true,
						value: '燃气灶'
					},
					{
						show: true,
						value: '可做饭'
					},
					{
						show: true,
						value: '电视'
					},
					{
						show: true,
						value: '空调'
					},
					{
						show: true,
						value: '衣柜'
					},
					{
						show: true,
						value: '床'
					}
				]
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(38, 0);
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh();
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import './house.scss';

	.mini-page-body {
		background: #fff !important;
	}
</style>