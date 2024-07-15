<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view style="min-height: 100vh;" class="mini-page-body">
		<view class="container">
			<block v-for="(item, index) in list" :key="item.id">
				<view :class="'list ' + (item.isTouchMove ? 'touch-move-active' : '')" @touchstart="touchstart"
					@touchmove="touchmove" :data-index="index">
					<view class="adds-list">
						<view v-if="isChoose" class="choose" @tap="chooseTap(item.id)">
							<image v-if="item.id == id" src="/pagesA/static/image/isradioy.png"></image>
							<image v-else src="/pagesA/static/image/isradio.png"></image>
						</view>
						<view :style="'width: ' + (isChoose ? '600rpx' : '670rpx') + ';'">
							<view class="list-top">
								<view class="list-top-left">
									<view class="txt1">
										<view class="default" v-if="item.is_check">默认</view>
										<text class="_text">{{ item.name }}</text>
									</view>
									<view class="txt2">{{ item.mobile }}</view>
								</view>
								<i @tap.stop.prevent="updateAddress" :data-idx="index" :data-aid="item.id" class="list-top-rigth mini-icon mini-public"></i>

							</view>
							<view class="list-adds">{{ item.province }} {{ item.city }} {{ item.county }}
								{{ item.adds }}</view>
						</view>
					</view>
					<view class="slide-right" :data-idx="index" :data-aid="item.id" @tap.stop.prevent="deleteAdds">删除
					</view>
				</view>
			</block>
			<view style="margin-top: 30px" v-if="list.length <= 0">
				<u-empty text="空" width="300" height="300" text-size="28" />
			</view>
			
			
			<view class="bottom">
				<!-- #ifdef MP-WEIXIN -->
				<view @tap="addWxAddress" class="button wechat">
					<i class="mini-icon mini-weixin"></i>
					微信导入
				</view>
				<!-- #endif -->
				<view @tap="addAddress" class="button add">
					<i class="mini-icon mini-jia"></i>
					新建地址
				</view>
			</view>
			
		</view>

		<u-popup :show="addsPopup" @close="addsTap">
			<view class="adds-popup">
				<view class="adds-popup-title">{{ popupTitle }}</view>
				<view class="adds-popup-box">
					<view class="label">收货人</view>
					<input :value="name" placeholder="请填写" @input="onSearchInput" data-var="name" />
				</view>
				<view class="adds-popup-box">
					<view class="label">手机号</view>
					<input :value="mobile" placeholder="请填写" @input="onSearchInput" data-var="mobile" />
				</view>
				<view class="adds-popup-box">
					<view class="label">收货地区</view>
					<region-picker @change="bindRegionChange" :value="address">
						<view class="picker" v-if="address.length > 0">{{ address[0] }} {{ address[1] }}
							{{ address[2] }}</view>

						<view class="picker-null" v-else>
							点击选择
							<view class="arrow-d"></view>
						</view>
					</region-picker>
				</view>
				<view class="adds-popup-box">
					<view class="label">详细地址</view>
					<input :value="adds" placeholder="请填写" @input="onSearchInput" data-var="adds" />
				</view>
				<view class="adds-popup-default">
					<view class="left">
						<view class="tit1">设置为默认地址</view>
						<view class="tit2">每次下单时自动使用该地址</view>
					</view>
					<switch :color="primaryColor" style="transform: scale(0.8)" :checked="is_check" @change="defaultChange" />
				</view>
				<view class="adds-popup-btn" @tap="saveFun">保存</view>
			</view>
		</u-popup>
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
	import myToast from '@/contrib/components/common/toast/toast';
	import navBar from '@/components/common/navbar/navbar';
	import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
	
	import regionPicker from '@/pagesA/components/region-picker/region-picker.vue';
	
	const shop = require('@/mixins/shop');
	var options = {};
	shop(options);
	export default {
		mixins: [{ methods: options }],
		components: {
			myToast,navBar,hoverBall,
			
			regionPicker
		},
		computed:{

		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 29,
				isChoose: false,
				id: 0,
				aid: -1,
				list: [],
				addsPopup: false,
				name: '',
				mobile: '',
				address: [],
				adds: '',
				is_check: false,
				popupTitle: '新增收货地址',
				isTouchMove: false,
				startX: 0,
				startY: 0,
				
				// 待修改地址的订单id
				order_id: 0 
			};
		},
		onLoad: function(options) {
			let that = this;
			that.globalOnloadProcess(options);
			
			if (options.id && options.id > 0) {
				that.setData({
					id: options.id,
					isChoose: true
				});
			}
			
			if( options.isChoose && !that.isChoose ){
				that.setData({
					isChoose: true
				});
			}
			
			if( options.order && options.order > 0 ){
				that.setData({
					order_id: options.order
				});
			}
			
		},
		onShow: function() {
			let that = this;
			that.updateScene(29, 0);

			that.getShopGetAddsList();

		},
		onPullDownRefresh: function () {
		    uni.stopPullDownRefresh();
		},
		methods: {
			// 微信导入地址
			addWxAddress() {
				let that = this;
			    // #ifdef MP-WEIXIN
			    uni.authorize({
			        scope: 'scope.address',
			        success: function(res) {
			            uni.chooseAddress({
			                success: function(res) {
								that.setData({
									addsPopup: true,
									aid: -1,
									name: res.userName,
									mobile: res.telNumber,
									address: [res.provinceName, res.cityName, res.countyName],
									adds: res.detailInfo,
									is_check: false,
									popupTitle: '新增收货地址'
								});
			                },
			                fail: function(res) {
			                    if (res.errMsg == 'chooseAddress:cancel'){
									uni.showToast({
										title: '取消',
										icon: 'none'
									})
								}else{
									uni.showToast({
										title: res.errMsg,
										icon: 'none'
									})
								}
			                }
			            });
			        },
			        fail: function(res) {
			            uni.showModal({
			                title: '您已拒绝导入微信地址权限',
			                content: '是否进入权限管理，调整授权？',
			                success(res) {
			                    if (res.confirm) {
			                        uni.openSetting({
			                            success: function(res) {}
			                        });
			                    } else if (res.cancel) {
			                        
			                    }
			                }
			
			            });
			        }
			    });
			    // #endif
			},
			defaultChange(e) {
				this.setData({
					is_check: e.detail.value
				});
			},

			bindRegionChange: function(e) {
				this.setData({
					address: e.detail.value
				});
			},

			chooseTap(aid) {
				let that = this;
				that.setData({
					id: aid
				});
				
				if(that.$store.state.pre_scene == 45){
					// 确认订单页
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2];
					// #ifdef APP || H5 || MP
					prevPage = prevPage.$vm
					// #endif
					// console.log(prevPage.$vm.getAdds)
					prevPage.getAdds(aid);
					uni.wen.toUrl(-2, 0, null);
				}else if(that.$store.state.pre_scene == 54){
					// 我的订单页
					if(that.order_id > 0 && aid > 0){
						var pages = getCurrentPages();
						var prevPage = pages[pages.length - 2];
						// #ifdef APP || H5 || MP
						prevPage = prevPage.$vm
						// #endif
						prevPage.shopOrderAddress(that.order_id, aid)
						setTimeout(function(){
							uni.wen.toUrl(-2, 0, null);
						}, 300);
					}
				}
				
			},

			saveFun() {
				let that = this;
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;

				if (!that.name) {
					uni.showToast({
						title: '请填写收货人',
						icon: 'none'
					});
					return;
				} else if (!that.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					});
					return;
				} else if (that.mobile.length != 11 && !myreg.test(that.mobile)) {
					uni.showToast({
						title: '手机号格式错误',
						icon: 'none'
					});
					return;
				} else if (that.address.length <= 0) {
					uni.showToast({
						title: '请选择收货地区',
						icon: 'none'
					});
					return;
				} else if (!that.adds) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					});
					return;
				}

				that.getShopSaveAdds();
			},

			onSearchInput(e) {
				let v = e.currentTarget.dataset.var;
				let value = e.detail.value;
				this[e.currentTarget.dataset.var] = value;
			},

			updateAddress(e) {
				let that = this;
				let idx = e.currentTarget.dataset.idx;
				let aid = e.currentTarget.dataset.aid;
				let addsinfo = that.list[idx];
				that.setData({
					addsPopup: true,
					aid: aid,
					name: addsinfo.name,
					mobile: addsinfo.mobile,
					address: [addsinfo.province, addsinfo.city, addsinfo.county],
					adds: addsinfo.adds,
					is_check: addsinfo.is_check || addsinfo.is_check == 1 ? true : false,
					popupTitle: '编辑收货地址'
				});
			},

			addAddress() {
				this.setData({
					addsPopup: true,
					aid: -1,
					name: '',
					mobile: '',
					address: [],
					adds: '',
					is_check: false,
					popupTitle: '新增收货地址'
				});
			},

			deleteAdds(e) {
				let that = this;
				let idx = e.currentTarget.dataset.idx;
				let aid = e.currentTarget.dataset.aid;
				uni.showModal({
					title: '提示',
					content: '确定要删除该收货地址吗？',

					success(res) {
						if (res.confirm) {
							let list = that.list;
							list.splice(idx, 1);
							that.setData({
								aid: aid,
								list: list
							});
							that.getShopDelAdds();
						}
					}
				});
			},

			touchstart: function(e) {
				//开始触摸时 重置所有删除
				this.list.forEach(function(v, i) {
					if (v.isTouchMove) {
						//只操作为true的
						v.isTouchMove = false;
					}
				});
				this.setData({
					startX: e.changedTouches[0].clientX,
					startY: e.changedTouches[0].clientY,
					list: this.list
				});
			},

			//滑动事件处理
			touchmove: function(e) {
				var that = this;
				var index = e.currentTarget.dataset.index;
				var //当前索引
					startX = that.startX;
				var //开始X坐标
					startY = that.startY;
				var //开始Y坐标
					touchMoveX = e.changedTouches[0].clientX;
				var //滑动变化坐标
					touchMoveY = e.changedTouches[0].clientY;
				var //滑动变化坐标
					//获取滑动角度
					angle = that.angle({
						X: startX,
						Y: startY
					}, {
						X: touchMoveX,
						Y: touchMoveY
					});
				that.list.forEach(function(v, i) {
					v.isTouchMove = false; //滑动超过30度角 return

					if (Math.abs(angle) > 30) {
						return;
					}

					if (i == index) {
						if (touchMoveX > startX) {
							//右滑
							v.isTouchMove = false;
						} else {
							//左滑
							v.isTouchMove = true;
						}
					}
				}); //更新数据

				that.setData({
					list: that.list
				});
			},

			/**
			 * 计算滑动角度
			 * @param {Object} start 起点坐标
			 * @param {Object} end 终点坐标
			 */
			angle: function(start, end) {
				var _X = end.X - start.X;

				var _Y = end.Y - start.Y; //返回角度 /Math.atan()返回数字的反正切值

				return (360 * Math.atan(_Y / _X)) / (2 * Math.PI);
			},
			addsTap() {
				let that = this;
				that.addsPopup = !that.addsPopup;
			}

		}
	};
</script>
<style lang="scss">
	@import './address.scss';
</style>
