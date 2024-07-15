<template>
	<!-- 发布闲置 -->
	<view
		:class="'mini-page-wrap globau-theme-' + global__theme__  + ' globau-platform-' + global__platform__ + ' globau-device-' + global__device__ + ' globau-tenant-' + global__tenant__.tenant_id"
		:data-theme="global__theme__  ">
		<view class="mini-page-body">
			<navBar :back="true" :home="fph" title="发布闲置" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'"
				background="transparent">

			</navBar>
			<view class="issue-unused-page">
				<view class="inner">
					<view class="title-area">
						<textarea class="title" auto-height placeholder="标题~" v-model="formData.title" maxlength="60" />
					</view>
					<view style="padding-left: 32rpx;padding-right: 32rpx;margin: 24rpx 0;">
						<u-line></u-line>
					</view>
					<view class="subTitle-area">
						<textarea class="subTitle" v-model="formData.detail" placeholder="快来转手给需要的人吧~" maxlength="1000" :auto-height="true" style="min-height: 400rpx;"></textarea>
						<!-- <editor ref="editor" id="editor" class="subTitle" @input="onEditorInput" placeholder="买家都关心品牌型号、入手渠道、转手原因...">
					</editor> -->
					</view>
					
					<view class="video-wrap" v-if=" formData.video_url && formData.video_url.length > 0 ">
						<view class="uploade-video-box">
							<view class="media-video">
								<!-- #ifdef APP || H5 -->
								<view @tap.stop.prevent="create_video_play">
								  <dom-video style="width: 400rpx;height: 300rpx;" ref="domVideo" :src="formData.video_url"/>
								</view>
								<!-- #endif -->
								<!-- #ifdef MP -->
								<video class="video-source" :controls="true" :src="formData.video_url"></video>
								<!-- #endif -->
								<i @tap.stop.prevent="onVideoDelete" class="picture-delete mini-icon mini-chacha"></i>
							</view>
						</view>
					</view>
					
					<view class="images">
						<mini-upload-img ref="miniUploader" style="width: 690rpx;" @uploading=" isUploading = true " :number="20"
							@change="miniUploadImgChange" :showAdd="true" :scene="98" :canVideo="true" @vkey="setVkey"></mini-upload-img>
					</view>
					<view class="position">
						<block v-if="!locationState">
							<view class="position-item" @tap.stop.prevent="delAddsTap">
								<i class="mini-icon mini-dizhi3"></i>
								<text class="text">{{ formData.location.address_name }}</text>
							</view>
						</block>
						<block v-else>
							<view class="position-item" @tap.stop.prevent="startChooseLocation">
								<i class="mini-icon mini-dizhi3"></i>
								<text class="text">选择地址</text>
							</view>
						</block>
					</view>
					
					<block v-if="classify_list && classify_list.length > 0">
						<view class="classify-list-wrap">
							<view class="left">分类 <i style="color: red;display: inline-block;" v-if="config2_page_used_push_force_classify">*</i></view>
							<view class="right">
								<view :class="'classify-item ' + (formData.classify_id == item.id ? 'active' : '')" v-for="(item, index) in classify_list" :key="index" @tap.stop.prevent="selectClassify(item.id)">
									{{ item.name }}
								</view>
							</view>
						</view>
					</block>
					
					<view style="padding-left: 32rpx;padding-right: 32rpx;">
						<u-line></u-line>
					</view>
					<view class="footer" @tap.stop.prevent="showPricePopup">
						<view class="footer-left">
							<u-icon name="red-packet"></u-icon>
							<text class="text">价格</text>
						</view>
						<view class="footer-right">
							<text class="text">￥{{ formData.price || '0.00' }}</text>
							<!-- <u-icon name="arrow-right-bold" size="42rpx" bold="600" color="#BCBCBC"></u-icon> -->
						</view>
					</view>
					<view v-if="labelContent" class="labelContent">{{ labelContent || '' }}</view>
				</view>
				<view style="height: 500rpx;"></view>
				<view class="bottom">
					<view class="sync-to-post" v-if="id === 0">
						<view class="inner_ flex-row">
							<block>
								<i class="mini-icon mini-yigouxuan" v-if="formData.add_post == 1" @tap.stop.prevent="checkAddPost"></i>
								<i class="mini-icon mini-weigouxuan" v-else @tap.stop.prevent="checkAddPost"></i>
							</block>
							<view class="_text" @tap.stop.prevent="shutSyncPostPopup(true)">
								同时发布笔记，增加曝光，点击可编辑文案
							</view>
						</view>
					</view>
					<view class="btn" @tap.stop.prevent="toAdd">确认发布</view>
				</view>
			</view>
			<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
		</view>
		<!-- /价格弹框/ -->
		<u-keyboard mode="number" :show="show" :tooltip="false" :showCancel="false" :showTips="false" safeAreaInsetBottom
			@change="onInput" @backspace="deleteNumber" :closeOnClickOverlay="true" @close="keyboardConfirm">
			<view class="keyboard">
				<view class="keyboard_title">
					设置价格
					<i class="mini-icon mini-shanchu2" @tap.stop.prevent="keyboardConfirm"></i>
				</view>
				<view class="rows">
					<view class="row" @tap="onTap('price_line')">
						<text class="text">价格</text>
						<view class="price">
							<text class="price-text" v-if="formData.price">{{ formData.price }}</text>
							<view class="price-placeholder">
								<text class="price-placeholder-text" v-if="!formData.price">￥0.00</text>
							</view>
							<view class="price-line" ref="price_line" id="price_line"
								:style="[{'width': ref_el === 'price_line' ? '4rpx':'0rpx'}]"></view>
						</view>
					</view>
					<u-line></u-line>
					<view class="row" @tap="onTap('originPrice_line')">
						<text class="text">原价</text>
						<view class="originPrice">
							<text class="originPrice-text" v-if="formData.original_price">{{formData.original_price}}</text>
							<view class="originPrice-placeholder">
								<text class="originPrice-placeholder-text" v-if="!formData.original_price">￥0.00</text>
							</view>

							<view class="originPrice-line" ref="originPrice_line" id="originPrice_line"
								:style="[{'width': ref_el === 'originPrice_line' ? '4rpx':'0rpx'}]"></view>
						</view>
					</view>
					<u-line></u-line>
					<view class="row">
						<text class="text">提货方式</text>
						<view class="price">
							<view style="width: 32rpx;"></view>
							<u-checkbox-group @change="checkChange">
								<u-checkbox :name="0" label='自提' active-color="#F7E253" size="28rpx" labelSize="30rpx"
									:checked="formData.is_self_pickup == 1">
								</u-checkbox>
								<view style="width: 20rpx;"></view>
								<u-checkbox :name="1" label='邮寄' active-color="#F7E253" size="28rpx" style="margin-left: 18rpx"
									labelSize="30rpx" :checked="formData.is_express_delivery == 1"></u-checkbox>
							</u-checkbox-group>

						</view>
					</view>
					<u-line></u-line>
					<view class="row" @tap="onTap('postage_line')" v-if="formData.is_express_delivery">
						<text class="text">邮费</text>
						<view class="originPrice">
							<block v-if="postageType == 1">
								<text class="originPrice-text" v-if="formData.express_cost > 0">{{ formData.express_cost }}</text>
								<view class="originPrice-placeholder">
									<text class="originPrice-placeholder-text" v-if="!formData.express_cost">￥0.00</text>
								</view>
								<view class="originPrice-line" ref="originPrice_line" id="originPrice_line"
									:style="[{'width': ref_el === 'postage_line' ? '4rpx':'0rpx'}]">
								</view>
							</block>
							<block v-else>
								<text class="originPrice-text">免邮</text>
							</block>

							<view style="display: flex;align-items: center;margin-left: auto;">
								<u-radio-group v-model="postageType" @change="checkboxChange">
									<u-radio :name="0" label='免邮' activeColor="#F7E253" size="30rpx" labelSize="30rpx">
									</u-radio>
									<view style="margin-right: 30rpx;"></view>
									<u-radio :name="1" label='自定义' activeColor="#F7E253" size="30rpx" labelSize="30rpx"></u-radio>
								</u-radio-group>
							</view>
						</view>
					</view>
				</view>

			</view>
			<template v-slot:bottom>
				<view class="popup_bottom">
					<view class="btn" @tap.stop.prevent="keyboardConfirm">确定</view>
				</view>
			</template>
		</u-keyboard>
		
		<u-popup :show="syncPostPopup" @close="shutSyncPostPopup(false)" :zIndex="99999991009" mode="bottom">
			<view class="sync-post-wrap">
				<view :class="'inner ' + (keyboardHeight > 0 ? 'keyboard-up' : '') ">
					<view class="title flex-row">
						<view class="left flex-row">
							笔记文案编辑
						</view>
						<i class="mini-icon mini-shanchu2" @tap.stop.prevent="shutSyncPostPopup(false)"></i>
					</view>
					<view class="center flex-row">
						<view class="left">
							<textarea class="_textarea" style="width: 500rpx;height:20vh;min-height:20vh;"
							 @focus="focusSyncPostTextarea" @blur="blurSyncPostTextarea" :fixed="true" 
							  placeholder="我发布了一个闲置~" :show-confirm-bar="false" :focus=" isFocus "
							   maxlength="1000" placeholder-class="_input_place_holder" :adjust-position="false" :auto-blur="true"
								v-model="formData.post_content">
							</textarea>
						</view>
						<view class="right flex-column">
							<block v-if="formData.post_img && formData.post_img.length > 0">
								<view class="img_item">
									<image class="upload_img" :src="formData.post_img" mode="aspectFill"></image>
									<i class="delete_icon mini-icon mini-shanchu1" @tap.stop.prevent="deleteSyncPostimg"></i>
								</view>
							</block>
							<block v-else>
								<view class="img_item upload" @tap.stop.prevent="uploadSyncImg">
									<i class="mini-icon mini-jia upload-icon"></i>
								</view>
							</block>
		
						</view>
					</view>
					<view class="bottom_sync">
						<view class="btn_sync" @tap.stop.prevent="syncPostConfirm">确定</view>
					</view>
					<view class="keyboard" :style="'height: ' + keyboardHeight + 'px;'"></view>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';


	import miniUploadImg from '@/contrib/components/common/mini-upload-img/mini-upload-img';
	import domVideo from '@/contrib/components/common/ls-dom-video/ls-dom-video';
	let vStorageKey = '';

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
			miniUploadImg,
			domVideo
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 98,
				id: 0,
				formData: {
					classify_id: 0,
					title: '',
					detail: '',
					image_urls: [],
					location: {
						latitude: null,
						longitude: null,
						address_name: null,
						address_detailed: null
					},
					price: '',
					original_price: '',
					// 自提
					is_self_pickup: 1,
					// 快递
					is_express_delivery: 0,
					// 运费
					express_cost: '',
					isTake: [],
					video_url: '',
					video_cover: '',
					add_post: 1,
					post_content: '我发布了一个闲置~',
					post_img: '',
				},
				isUploading: false,
				show: false,
				ref_el: 'price_line',
				classify_list: [],

				postageType: 0, // 0: 免邮 1：自定义
				
				keyboardHeight: 0,
				isFocus: false,
				syncPostPopup: false
			}
		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);

			if (options.id && options.id > 0) {
				that.id = options.id;
				that.getUsedGoodDetail();
			}
			
			that.getUsedclassifyList();
			
		},
		onShow: function() {
			let that = this;
			that.updateScene(98, 0, true, false, 0, 2);
			
			if(vStorageKey && vStorageKey.length > 0){
				if(that.formData.video_url && that.formData.video_url.length > 0){
					
				}else{
					let videoObj = uni.getStorageSync(vStorageKey);
					if(videoObj && videoObj.video_url && videoObj.video_url.length > 0){
						that.formData.video_url = videoObj.video_url;
						that.formData.video_cover = videoObj.video_cover;
						// uni.removeStorageSync(vStorageKey);
					}
				}
			}
		},
		computed: {
			labelContent: {
				get() {
					let that = this;
					let str = (that.formData.original_price > 0 ? ('原价：￥' + that.formData.original_price + '') : '');
					if (str.length > 0 && that.formData.is_express_delivery == 1) {
						str += '，';
					}
					str += (that.formData.is_express_delivery == 1 ? (that.formData.express_cost > 0 ? ('邮费：￥' + that.formData
						.express_cost) : '邮费：免邮') : '');
					return str;
				},
				set(v) {}
			},
			locationState: {
				get() {
					let that = this;
					if (that.formData.location && that.formData.location.address_name) {
						return false;
					}
					return true;
				},
				set(v) {}
			},
			config2_page_used_push_force_classify: {
				get() {
					let that = this;
					if (that.$store.state.config2.page.used && that.$store.state.config2.page.used.push) {
						return that.$store.state.config2.page.used.push.force_classify;
					}
					return 0;
				},
				set(v) {}
			},
		},
		onShareAppMessage: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.index_title,
				path: '/pagesU/used-mall/home/index?fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config2.used.share.index_image
			};
		},
		onShareTimeline: function(res) {
			let that = this;
			return {
				title: that.$store.state.config2.used.share.index_title,
				query: '' + 'fph=1&from_user=' + that.$store.state.userInfo.id + '&tenant=' + that.global__tenant__.tenant_id,
				imageUrl: that.$store.state.config2.used.share.index_image
			};
		},
		methods: {
			syncPostConfirm(){
				let that = this;
				that.formData.add_post = 1;
				that.syncPostPopup = false;
			},
			shutSyncPostPopup(flag){
				let that = this;
				if(flag){
					that.syncPostPopup = true;
				}else{
					that.syncPostPopup = false;
				}
			},
			focusSyncPostTextarea(e){
				let that = this;
				that.keyboardHeight = e.detail.height;
			},
			blurSyncPostTextarea(e){
				let that = this;
				that.keyboardHeight = 0;
			},
			deleteSyncPostimg(){
				let that = this;
				that.formData.post_img = '';
			},
			uploadSyncImg(){
				let that = this;
				uni.chooseImage({
					count: 1,
					sourceType: ['album', 'camera'],
					sizeType: ['original'],
			
					success(res) {
						uni.loading(true);
						const tempFilePaths = res.tempFilePaths;
						uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function(res) {
							uni.loading(false);
							if(res.status){
								that.formData.post_img = res.data;
							}else{
								uni.showToast({
									title: res.message,
									icon: 'none',
									duration: 1500
								});
							}
						});
					},
			
					fail(err) {
			
					}
				});
			},
			checkAddPost(){
				let that = this;
				that.formData.add_post = that.formData.add_post == 1 ? 0 : 1;
			},
			onVideoDelete(){
				this.formData.video_url = '';
				this.formData.video_cover = '';
				
				uni.removeStorage({
					key: vStorageKey,
					success: function (res) {
						console.log(vStorageKey+ '删除成功');
						vStorageKey = '';
					}
				});
			},
			create_video_play() {
			  let domVideo = this.$refs.domVideo;
			  domVideo.play();
			},
			setVkey(value){
				vStorageKey = value;
			},
			selectClassify(id){
				let that = this;
				that.formData.classify_id = id;
			},
			getUsedclassifyList() {
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/classify/list').then(function(res) {
					if (res.status) {
						that.classify_list = res.data;
					}
				});
			},
			getUsedGoodDetail() {
				let that = this;
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/detail', {
					id: that.id
				}).then(function(res) {
					uni.loading(false);
					if (res.status) {
						that.formData = res.data;

						if (that.formData.image_urls && that.formData.image_urls.length > 0) {
							that.$refs.miniUploader.setInitValue(that.formData.image_urls);
						}

						if (that.formData.is_express_delivery == 1) {
							if (that.formData.express_cost > 0) {
								that.postageType = 1;
							} else {
								that.postageType = 0;
							}
						}

					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				});
			},
			keyboardConfirm(e) {
				this.show = false
			},
			checkChange(e) {
				this.formData.isTake = e;
				this.formData.is_self_pickup = e.includes(0) ? 1 : 0;
				this.formData.is_express_delivery = e.includes(1) ? 1 : 0;
			},
			deleteNumber() {
				if (this.ref_el === 'price_line') {
					if (this.formData.price) {
						let price = this.formData.price + '';
						price = price.slice(0, price.length - 1);
						if (price > 0) {
							this.formData.price = parseFloat(price);
						} else {
							this.formData.price = price;
						}
					} else {
						this.formData.price = '';
						return false;
					}

				} else if (this.ref_el === 'originPrice_line') {
					if (this.formData.original_price) {
						let original_price = this.formData.original_price + '';
						this.formData.original_price = parseFloat(original_price.slice(0, original_price.length - 1));
					} else {
						this.formData.original_price = '';
						return false;
					}
				} else if (this.ref_el === 'postage_line') {
					if (this.formData.express_cost) {
						let express_cost = this.formData.express_cost + '';
						this.formData.express_cost = parseFloat(express_cost.slice(0, express_cost.length - 1))
					} else {
						this.formData.express_cost = '';
						return false;
					}
				}
			},
			checkboxChange() {
				let that = this;
				if (that.postageType === 1) {
					that.ref_el === 'postage_line'
				} else {
					that.formData.express_cost = 0;
				}
			},
			onInput(e) {
				if (this.ref_el === 'price_line') {
					let price = this.formData.price > 0 ? (this.formData.price + '') : this.formData.price;
					if(typeof price == 'string'){
						
					}else{
						if(price === null || price === undefined){
							price = '';
						}else{
							price = price.toString();
						}
					}
					let index = price.indexOf('.')
					let arr = price.split('.')
					if (e === '.' && index !== -1) {
						return
					}
					if (index !== -1 && arr[1].length === 2) {
						return
					}
					price += e;
					if (e === '.' || e === '0' || e === 0) {
						console.log('11111')
						this.formData.price = price
					} else {
						console.log('2222')
						this.formData.price = parseFloat(price)
					}

				} else if (this.ref_el === 'originPrice_line') {
					let original_price = this.formData.original_price > 0 ? (this.formData.original_price + '') : this.formData
						.original_price;
					
					if(typeof original_price == 'string'){
						
					}else{
						if(original_price === null || original_price === undefined){
							original_price = '';
						}else{
							original_price = original_price.toString();
						}
					}
						
					
					let index = original_price.indexOf('.')
					let arr = original_price.split('.')
					if (e === '.' && index !== -1) {
						return
					}
					if (index !== -1 && arr[1].length === 2) {
						return
					}
					original_price += e;
					if (e === '.' || e === '0' || e === 0) {
						this.formData.original_price = original_price;
					} else {
						this.formData.original_price = parseFloat(original_price);
					}

				} else if (this.ref_el === 'postage_line' && this.postageType === 1) {
					uni.showToast({
						title: '平台暂时不支持设置邮费',
						icon: 'none'
					});
					return false;

					let express_cost = this.formData.express_cost > 0 ? (this.formData.express_cost + '') : this.formData
						.express_cost;
						
					if(typeof express_cost == 'string'){
						
					}else{
						if(express_cost === null || express_cost === undefined){
							express_cost = '';
						}else{
							express_cost = express_cost.toString();
						}
					}
						
					let index = express_cost.indexOf('.')
					let arr = express_cost.split('.')
					if (e === '.' && index !== -1) {
						return
					}
					if (index !== -1 && arr[1].length === 2) {
						return
					}
					express_cost += e;
					if (e === '.' || e === '0' || e === 0) {
						this.formData.express_cost = express_cost;
					} else {
						this.formData.express_cost = parseFloat(express_cost);
					}

				}
			},
			onTap(_ref) {
				if (_ref !== this.ref_el) {
					this.ref_el = _ref
				}
			},
			showPricePopup() {
				this.show = true;
				// uni.showToast({ 
				// 	title: '价格设置没写好，不用设置',
				// 	icon: 'none'
				// })
			},
			toAdd() {
				let that = this;
				if (that.isUploading) {
					uni.showToast({
						title: '图片正在上传中...',
						icon: 'none'
					});
					return false;
				}
				
				if(that.config2_page_used_push_force_classify == 1){
					if(that.formData.classify_id > 0){
						
					}else{
						uni.showToast({
							title: '请先选择分类',
							icon: 'none'
						});
						return false;
					}
				}
				
				uni.loading(true);
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'used/good/add', that.formData, 'POST').then(function(res) {
					uni.loading(false);
					if (res.status) {
						uni.showToast({
							title: '发布成功',
							icon: 'none'
						});
						setTimeout(function() {
							uni.wen.toUrl(-6, '/pagesU/used-mall/detail/index?id=' + res.data.used_good_id);
						}, 300);
					} else {
						if (res.code == 200016) {
							uni.showModal({
								title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
								content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿发布违规内容',
								showCancel: false,
								confirmText: '朕知道了',
								confirmColor: that.primaryColor
							});
							return false;
						} else if (res.code == 200041) {
							uni.showModal({
								title: '默认昵称不能发布内容',
								content: '为了您在社区的信誉，请勿以"微信用户","普通用户"'+ (that.$store.state.config.user?.default_user_name.length > 0 ? ',"'+that.$store.state.config.user?.default_user_name+'"' : '') +'开头',
								showCancel: true,
								confirmText: '修改昵称',
								confirmColor: that.primaryColor,

								success(res) {
									if (res.confirm) {
										uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', null);
									}
								}
							});
							return false;
						}else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							});
						}
					}
				});
			},
			// 选择位置
			startChooseLocation: function() {
				var that = this;
				
				let startChooseLocation_ = function(that){
					uni.chooseLocation({
						success: function(a) {
							let location = {};
							let formData = that.formData;
							location.latitude = a.latitude;
							location.longitude = a.longitude;
							location.address_name = a.address;
							location.address_detailed = a.name;
					
							formData.location = location;
							that.setData({
								formData: formData,
							})
							console.log(a);
						},
						fail: function(err) {
							console.log(err);
						}
					});
				};
				
				// #ifdef MP
				uni.wen.util.checkMpPermission('scope.userLocation', '请到设置页面授权“位置信息”权限', () => {
					startChooseLocation_(that)
				});
				// #endif
				
				// #ifdef APP
				uni.wen.util.checkAppPermission('location', '[位置权限]获取您的位置等信息，用于标记闲置的位置', () => {
					startChooseLocation_(that)
				}, that);
				// #endif
				
				// #ifdef H5
				startChooseLocation_(that)
				// #endif
			},

			// 清空位置
			delAddsTap() {
				let that = this;
				that.formData.location = {};
			},
			miniUploadImgChange(data) {
				let that = this;
				let image_urls = [];
				for (var i = 0; i < data.urls.length; i++) {
					image_urls.push({
						url: data.urls[i]
					})
				}
				that.formData.image_urls = image_urls;
				that.isUploading = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>