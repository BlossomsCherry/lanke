<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<navBar :back="true" :home="fph" title="工作详情" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
				:background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
			</navBar>
			<view class="house_cont">
				<view class="house_cont--title">整租|中学附近 自住标准装修 全屋品牌定制柜子 无甲醛担忧</view>
				<view class="house_cont--pirce">
					4000-8000<text>元/月</text>
				</view>
				<view class="house_cont--pirceTag">
					<view class="box">
						经验不限
					</view>
					<view class="box">
						学历不限
					</view>
				</view>
				<view class="house_cont--title" style="padding: 30rpx 0;">职位详情</view>
				<view class="house_cont--jieshaoTag">
					<view class="box">高薪招聘</view>
				</view>
				<view class="house_cont--jieshao">
					1、男女不限，学历不是你的硬指标(我们只看付出)<br />
					3、做事认真，(无身高、体重、外貌等要求)<br />
					4、无经验者可带，福利待遇:<br />
					1、工作时间:9:0017:00(午休1小时)<br />
					2、做六休一，法定节假日休息，带薪年假<br />
					3、提供住宿(2-4人间宿舍，热水器，空调齐全，宿舍离公司3分钟路程)<br />
					4、购买社保、为保障员工人身安全，为每个员工购买平安意外保险，提供五险一金<br />
					5、每年12次公费出游，聚餐等<br />
					6、有台球，乒乓球，跑步机等娱乐健身设施<br />
					7、工作区域转正之后全所有区域都有安排，就近安排<br />
					8、不定时组织各种比赛、电子竞技等(可获丰厚奖励)<br />
					9、五险一金+包吃包住+年终奖
				</view>
				<view class="boss">
					<view class="header">
						<image
							src="https://pic4.58cdn.com.cn/anjuke_58/573acb4258ce8760cdefccc092f41e20?w=240&h=180&ss=1&crop=1&cpos=middle&w=240&h=180&crop=1&t=1&srotate=1"
							mode="aspectFill"></image>
					</view>
					<view class="bInfo">
						<text class="bossName">刘亦菲·人事经理</text>
						<text class="companyName">四川志多邦人力资源服务有限公司</text>
					</view>
					<view class="apply">
						<u-button type="primary" icon="share" color="#ec613e" iconColor="#ec613e" :plain="true" shape="circle"
							:customStyle="buttonStyle" throttleTime="1000" text="去申请"></u-button>
					</view>
				</view>
				<view class="house_cont--title" style="padding: 30rpx 0;">公司信息</view>
				<view class="house_cont--name">杭州奈思婚纱摄影有限公司</view>
				<view class="house_cont--num">1-49人</view>
				<view class="house_cont--map">
					<map class="map"></map>
				</view>

				<view class="house_cont--title" style="padding: 30rpx 0;">热门岗位</view>
				<view class="house_cont--list">
					<find-job-list></find-job-list>
				</view>
				<view class="bottom">
					<button class="bottom_btn flex">
						申请职位
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
	import findJobList from '@/pagesS/components/find-job-list/find-job-list.vue';


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
			findJobList
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
	@import './job.scss';

	.mini-page-body {
		background: #fafafc !important;
	}
</style>