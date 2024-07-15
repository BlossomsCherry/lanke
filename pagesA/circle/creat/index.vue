<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<view class="container">
			<!-- <view>
				<u-notice-bar :text="tisi" mode="closable" v-if="notice"></u-notice-bar>
			</view> -->
			<view class="content-container" style="padding-bottom: 100px">
				<view class="img-box">
					<view class="logo-container w200" @tap.stop.prevent="clipperImage" data-type="imageAvatarClipper">
						<block v-if="imageAvatar == null">
							<image class="logo-add"
								src="/static/image/new_construction_circle_cover_upload_picture.png"></image>
							<view class="img-text">圈子头像</view>
						</block>
						<block v-else>
							<image class="logo-image w200" mode="aspectFill" :src="imageAvatar"></image>
							<i class="mini-icon mini-chacha logo-camera" @tap.stop.prevent="delimage" data-name="imageAvatar"></i>
						</block>
					</view>
					<view class="logo-container w460" @tap.stop.prevent="clipperImage" data-type="imagesubjectClipper">
						<block v-if="imageSubject == null">
							<image class="logo-add"
								src="/static/image/new_construction_circle_cover_upload_picture.png"></image>
							<view class="img-text">圈子背景图</view>
						</block>
						<block v-else>
							<image class="logo-image w460" mode="aspectFill" :src="imageSubject"></image>
							<i class="logo-camera mini-icon mini-chacha" @tap.stop.prevent="delimage" data-name="imageSubject"></i>
						</block>
					</view>
				</view>
				<view class="item">
					<text class="item-title">圈子名称</text>
					<input @input="onInputChangeCircle" class="item-input" data-type="1" :maxlength="nameMaxLength"
						placeholder="请输入圈子名称" :value="circleName" />
					<text class="item-tip">{{ nameLength }}/{{ nameMaxLength }}</text>
				</view>
				<view class="item">
					<text class="item-title">圈子简介</text>
					<textarea @input="onInputChangeCircle" class="item-area" data-type="2" :maxlength="descMaxLength"
						placeholder="请输入圈子简介" :value="circleDesc"></textarea>
					<text class="item-tip">{{ descLength }}/{{ descMaxLength }}</text>
				</view>
				<view class="item-h">
					<text class="item-title">选择圈子所属分区</text>
					<picker @change="bindPickerChange" :value="index" :range="cats" range-key="plate_name">
						<view class="picker">
							{{ cats[index] && cats[index].plate_name }}
							<view class="arrow"></view>
						</view>
					</picker>
				</view>
				<text class="bottom-tip-text">
					请认真仔细阅读《圈主协议》，若所见圈子内涉及时政，色情，暴力，无资质荐股，推币等违法内容传播，官方将立即永久封停圈子和账号，请各用户自觉遵守国家法律和平台规则。
				</text>
			</view>
			<view class="bottom-box">
				<view class="bottom">
					<i @tap.stop.prevent="onProtocolChange" class="bottom-radio mini-icon mini-duigouxiao color-primary" v-if="protocolChecked"></i>
					<i @tap.stop.prevent="onProtocolChange" class="bottom-radio mini-icon mini-quan" v-else></i>
					<text class="bottom-radio-text" :style="protocolChecked ? 'color: #333' : ''">我已阅读并同意</text>
					<text @tap.stop.prevent="onProtocolClick" class="bottom-radio-text" style="color: #333">《圈主协议》</text>
					<text @tap.stop.prevent="creatCircle" class="bottom-button">{{ id > 0 ? '更新' : '申请' }}</text>
				</view>
			</view>
		</view>

		<l-clipper v-if="imageAvatarClipper" :image-url="pic"
			@success="addimage($event, { name: 'imageAvatar', type: 'imageAvatarClipper' })"
			@cancel="imageAvatarClipper = false" />

		<!-- <block v-if="imageAvatarClipper">
            <l-image-clipper
                :width="550"
                :height="550"
                :show="true"
                :image-url="pic"
                data-name="imageAvatar"
                data-type="imageAvatarClipper"
                @linclip="addimage($event, { name: 'imageAvatar', type: 'imageAvatarClipper' })"
				link="image-clipper"
            >
                <l-image-clipper-tools link="image-clipper-tools"/>
            </l-image-clipper>
        </block> -->

		<l-clipper v-if="imagesubjectClipper" :image-url="pic"
			@success="addimage($event, { name: 'imageSubject', type: 'imagesubjectClipper' })"
			@cancel="imagesubjectClipper = false" :width="810" :height="607"/>

		<!--       <block v-if="imagesubjectClipper">
            <l-image-clipper
                :width="750"
                :height="350"
                :show="true"
                :image-url="pic"
                data-name="imageSubject"
                data-type="imagesubjectClipper"
                @linclip="addimage($event, { name: 'imageSubject', type: 'imagesubjectClipper' })"
				link="image-clipper"
            >
                <l-image-clipper-tools  link="image-clipper-tools"/>
            </l-image-clipper>
        </block> -->
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	import LClipper from '@/pagesA/components/lime-clipper/components/l-clipper/l-clipper';
	const mixins = require('@/mixins/circle');
	const common = require('@/mixins/common');

	var options = {};
	common(options);
	mixins(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
			LClipper
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 17,
				notice: true,
				descMaxLength: 200,
				nameMaxLength: 50,
				descLength: 0,
				nameLength: 0,
				index: 1,
				cats: [],
				circleName: '',
				circleDesc: '',
				imageSubject: null,
				imageAvatar: null,
				type: '',
				protocolChecked: false,
				// tisi: '创建圈子前建议先联系官方获取更多圈子规范和建议，可大大提升通过率。',
				imageAvatarClipper: false,
				imagesubjectClipper: false,
				pic: '',
				id: 0,
				parent: ''
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			that.geToptionsList();
			let title = '创建圈子';
			let id = '';
			let tisi = this.tisi;

			if (options.type == 1) {
				title = '编辑';
				tisi = '编辑圈子请保证信息符合相关规定及条款，如有违规信息一经发现圈子可能会面临注销的风险。';
				id = options.id;
				that.editorCircleInfo(options.id);
			}

			that.setData({
				id: id,
				tisi: tisi,
				type: options.type
			});
			uni.setNavigationBarTitle({
				title: title
			});
		},
		onShow: function () {
			let that = this;
			that.updateScene(17, 0, true);
		},
		methods: {
			geToptionsList() {
			    let that = this;
			    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/plate/options').then(function (res) {
			        let args = {};
			        args.cats = res.data;
			        args.hotload = false;
			        that.setData(args);
			    });
			},
			clipperImage: function(e) {
				this.imageClipper(e.currentTarget.dataset.type);
			},

			addimage: function(e, _dataset) {
				/* ---处理dataset begin--- */
				this.datasetHandle(e, _dataset);
				/* ---处理dataset end--- */
				this.uploadPicturesPic(e.url, e.currentTarget.dataset.name, e.currentTarget.dataset.type, 17);
			},

			delimage: function(e) {
				let name = e.currentTarget.dataset.name;
				this[e.currentTarget.dataset.name] = null;
			},

			onInputChangeCircle: function(e) {
				var type = e.currentTarget.dataset.type;
				var value = e.detail.value;
				if (type == 1)
					this.setData({
						circleName: value,
						nameLength: value.length
					});
				else if (type == 2) {
					this.setData({
						circleDesc: value,
						descLength: value.length
					});
				}
			},

			bindPickerChange: function(e) {
				this.setData({
					index: e.detail.value,
					parent: this.cats[e.detail.value].id
				});
			},

			onProtocolChange: function() {
				this.setData({
					protocolChecked: !this.protocolChecked
				});
			},

			onProtocolClick: function() {
				uni.wen.toUrl(6, '/pages/common/clause?type=20', null);
			},

		}
	};
</script>
<style lang="scss">
	@import './index.scss';
</style>
