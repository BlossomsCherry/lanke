<template>
	<view
		:class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<navBar :back="true" :home="fph" title="我发布的" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
			:background="'#fee610'">
		</navBar>
		<view class="publish">
			<view class="publish_head">
				<view class="publish_head_num" @tap.stop="openNumTip">
					<view class="title">今日曝光</view>
					<view class="value">
						80
					</view>
				</view>
				<view class="publish_head_list" @tap.stop="openRecord">
					<view class="title">
						近期优化记录
						<i class="mini-xiaofeijilu mini-icon2"></i>
					</view>
					<view class="cont">
						<view class="flex">
							<u-icon name="checkbox-mark" size="28" color="#413400" bold></u-icon>
							<text class="text">近期擦亮1次</text>
							<view class="tip">曝光收集中</view>
						</view>
					</view>
					<view class="emity">
						好久没来了，宝贝都落灰了快点擦亮一下吧~
					</view>
				</view>
			</view>
			<view class="publish_Kong">
				<view class="publish_Kong_flex">
					<view class="publish_Kong_btn width33">
						<view class="value" v-if="false">一键擦亮</view>
						<view class="hideValue" v-if="true"><u-icon name="checkbox-mark" size="30" color="999999" bold></u-icon>已擦亮
						</view>
					</view>
					<view class="publish_Kong_box width33" @tap.stop="openAdd">
						<view class="title">加曝光<u-icon name="play-right-fill" size="18"></u-icon></view>
						<view class="value">闲鱼币推广</view>
					</view>
					<view class="publish_Kong_box width33">
						<view class="title">暂未确定<u-icon name="play-right-fill" size="18"></u-icon></view>
						<view class="value">上同城首页</view>
					</view>
				</view>
			</view>
			<view class="publish_tabs">
				<u-tabs :list="list1" @click="click" lineColor="#f1ed18" :activeStyle="{'color':'#333333','font-weight':'bold'}"
					lineWidth="40" :scrollable="false"></u-tabs>
				<view class="search">
					<i class="mini-icon mini-sousuo1"></i>
				</view>
			</view>
			<list></list>
		</view>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		<pop-num ref="num"></pop-num>
		<pop-record ref="record"></pop-record>
		<pop-add ref="add"></pop-add>
	</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	import list from '@/pagesU/used-mall/mine/published/common/published_list.vue';
	import popNum from '@/pagesU/used-mall/mine/published/common/popup_num.vue';
	import popRecord from '@/pagesU/used-mall/mine/published/common/popup_record.vue';
	import popAdd from '@/pagesU/used-mall/mine/published/common/popup_add.vue';
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
			list,
			popNum,
			popRecord,
			popAdd
		},
		computed: {

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 105,
				list1: [{
					name: '在卖',
				}, {
					name: '草稿',
				}, {
					name: '下架'
				}]
			}
		},
		onShow: function() {
			let that = this;
			that.updateScene(105, 0);
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh();
		},
		methods: {
			//打开加曝光弹框
			openAdd() {
				this.$refs.add.show = true;
			},
			//打开优化记录弹框
			openRecord() {
				this.$refs.record.show = true;
			},
			openNumTip() {
				this.$refs.num.show = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './published.scss';

	.publish_tabs {
		/deep/ .u-tabs__wrapper__nav__line {
			transform: translate(70%) !important;
		}
	}

	.popup_tabs {
		/deep/ .u-tabs__wrapper__nav__line {
			transform: translate(100%) !important;
		}
	}


	/deep/.u-slide-up-enter-active {
		background: #fff !important;
	}

	/deep/.u-action-sheet__item-wrap__item__name {
		color: #333 !important;
	}

	/deep/.u-action-sheet__header {
		display: none;
	}
</style>