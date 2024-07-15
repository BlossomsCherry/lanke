import { Iap, IapTransactionState} from "@/mixins/iap.js";


const coinPay = function(order){
	let that = this;
	uni.loading(true);
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'coin_pay', {order: order}, 'POST').then(function(res) {
		uni.loading(false);
		if(res.status){
			uni.wen.util.updateUserInfo();
			if(order.type == 1){
				setTimeout(function(){
					uni.wen.toUrl(6, '/pagesA/shop/order/order');
				}, 300);
			}
		}else{
			that.password = [];
			uni.showToast({
				title: res.message,
				icon:'none',
				duration: 2000
			});
			// todo: 金币不足
		}
	});
};

/**
 * 微信支付相关服务
 */
const payOrder = function(payParam, provider = "") {
	var that = this;
	return new Promise(function(resolve, reject) {

		// #ifdef MP
		uni.requestPayment({
			timeStamp: payParam.timeStamp,
			nonceStr: payParam.nonceStr,
			package: payParam.package,
			signType: payParam.signType,
			paySign: payParam.paySign,
			success: function(res) {
				resolve({status: 1, msg: '支付成功', res: res});
			},
			fail: function(res) {
				reject({status: 0, msg: '支付失败', res: res});
			},
			complete: function(res) {
				reject({status: 0, msg: '支付失败', res: res});
			}
		});
		// #endif

		// #ifndef MP
		console.log("支付参数：", payParam)

		that.appPay(payParam, provider, function(res) {
			resolve(res)
		}, function(reason) {
			reject(reason)
		}, {'test': 1})

		// #endif
	});
};

const appPay = function(payParam, provider, callback, failCallback, others) {
	var that = this;
	
	// #ifdef H5
	if(uni.$store.state.h5_browser == 'wxclient' && provider == 'wxpay'){
		uni.wen.util.mpPay(payParam.timeStamp, payParam.nonceStr, payParam.paySign, payParam.package, callback, failCallback);
		return false;
	}
	// #endif
	
	// #ifdef H5
	var app_wechat_type = "h5";
	var app_ali_type = "h5";
	var orderInfo = payParam.direct;
	var isH5 = true;
	// #endif
	
	// #ifndef H5
	var isH5 = false;
	var orderInfo = {};
	var app_wechat_type = that.$store.state.config.pay.wechat || "app";
	var app_ali_type = that.$store.state.config.pay.alipay || "app";
	
	if (provider === 'wxpay') {
		if (app_wechat_type === "app") {
			orderInfo = {
				appid: payParam.appid,
				noncestr: payParam.noncestr,
				package: payParam.package,
				partnerid: payParam.partnerid,
				prepayid: payParam.prepayid,
				timestamp: payParam.timestamp,
				sign: payParam.sign
			};
		} else {
			orderInfo = payParam.direct
			isH5 = true
		}
	} else if (provider === 'alipay') {
		if (app_ali_type === "app") {
			orderInfo = payParam.replace('¬ify_url', '&notify_url').replace('2×tamp', '2&timestamp');
		} else {
			orderInfo = payParam.direct
			isH5 = true
		}
	}
	
	// #endif
	
	
	if (isH5) {
		that.$store.commit('updateQueryStateNo', payParam.query_state_no);
		// #ifdef H5
		window.open(orderInfo, '_blank');
		// #endif
		// #ifndef H5
		plus.runtime.openURL(orderInfo);
		// #endif
		callback && callback({status: -1, msg: '未知', others: others})
	}else{
		uni.requestPayment({
			provider: provider,
			orderInfo: orderInfo,
			_debug: 1,
			success: function(res) {
				callback && callback({status: 1, msg: '支付成功', res: res, others: others})
			},
			fail: function(res) {
				failCallback && failCallback({status: 0, msg: '支付失败', res: res, others: others})
			},
			complete: function(res) {
		
			}
		});
	}
}

//开通会员
const openMembershipAccount = function(params, callback) {
	let that = this;
	
	// #ifdef H5
	params.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	// #ifdef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'order', params,
		'POST'
	).then(function(res) {
		if (res.status) {
			that.payOrder(res.data, "")
				.then(function(res) {
					// callback && callback({status: 1, msg: '支付成功', res: res})
					if(res.status == 1){
						uni.showToast({
							title: '开通成功！',
							icon: 'none',
							duration: 1500
						}); //更新用户信息
						if(res.status){
							uni.wen.util.updateUserInfo();
						}
					}else if(res.status == -1){
						// h5支付未知
					}
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
				});
		} else {
			
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif

	// #ifndef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'app/order', params,
		'POST'
	).then(function(res) {
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.payOrder(payData, params.provider).then(function(res) {
					// callback && callback({status: 1, msg: '支付成功', res: res})
					if(res.status == 1){
						console.log("payOrder", res)
						uni.showToast({
							title: '开通成功！',
							icon: 'success',
							duration: 1500
						});
			
						//更新用户信息
						uni.wen.util.updateUserInfo();
						callback && callback(res)
					}else if(res.status == -1){
						// h5支付未知
						callback && callback(res)
					}
				}).catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif
};


//统一封装下单  7：付费圈子
const normalOrder = function(params, callback) {
	let that = this;
	
	// #ifdef H5
	params.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	// #ifdef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'order', params,
		'POST'
	).then(function(res) {
		if (res.status) {
			that.payOrder(res.data, "")
				.then(function(res) {
					callback && callback(res)
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
				});
		}else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif

	// #ifndef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'app/order', params,
		'POST'
	).then(function(res) {
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.payOrder(payData, params.provider).then(function(res) {
					// callback && callback({status: 1, msg: '支付成功', res: res})
					callback && callback(res)
				}).catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif
};


const onRechargeGuarantee = function(rechargeNum, provider = "wxpay", pay_type = "app"){
	let that = this;
	let parame = {};
	parame.recharge = rechargeNum;
	
	
	// #ifdef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'order', {
			type: 8,
			parame: parame,
			h5_browser: uni.$store.state.h5_browser
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			that.payOrder(res.data, "")
				.then(function(res) {
					if(res.status == 1){
						uni.wen.util.updateUserInfo();
						uni.showToast({
							title: '充值成功',
							icon: 'none',
							duration: 1500
						});
						if(uni.$store.state.scene == 108){
							uni.startPullDownRefresh({});
						}
					}else if(res.status == -1){
						// 未知
					}
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 15000
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		}else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif
	
	// #ifndef MP
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/order', {
			type: 8,
			provider: provider,
			pay_type: pay_type,
			h5_browser: uni.$store.state.h5_browser,
			parame: parame
		},'POST').then(function(res) {
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.payOrder(payData, provider)
				.then(function(res) {
					if(res.status == 1){
						uni.showToast({
							title: '充值成功！',
							icon: 'none',
							duration: 1500
						});
						if(uni.$store.state.scene == 108){
							uni.startPullDownRefresh({});
						}
					}else if(res.status == -1){
						
					}
					
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
	// #endif
	
}

// 余额充值
const onRechargeEarningsInWeixin = function (rewardPrice){
	let that = this;
	let parame = {};
	parame.recharge = rewardPrice;
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'order', {
			type: 3,
			parame: parame,
			h5_browser: uni.$store.state.h5_browser
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			that.payOrder(res.data, "")
				.then(function(res) {
					if(res.status == 1){
						uni.showToast({
							title: '充值成功',
							icon: 'none',
							duration: 1500
						});
						if(uni.$store.state.scene == 26){
							uni.startPullDownRefresh({});
						}
						const scene_history = uni.$store.state.scene_history;
						if(uni.$store.state.pre_scene == 3){
							setTimeout(function(){
								uni.wen.toUrl(-2, 0, null);
							}, 200);
						}
					}else if(res.status == -1){
						// 未知
					}
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 15000
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		}else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});	
	
}

const onRechargeEarningsInApp = function(params, callback){
	let that = this;
	
	// #ifdef H5
	params.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'app/order', params,
		'POST'
	).then(function(res) {
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.payOrder(payData, params.provider)
				.then(function(res) {
					
					if(res.status == 1){
						uni.showToast({
							title: '充值成功！',
							icon: 'none',
							duration: 1500
						});
						uni.wen.toUrl(-2, 0, null);
						callback && callback(res)
					}else if(res.status == -1){
						// h5 未知
						callback && callback(res)
					}
					
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
}
//充电--weixin
const openExceptionalAccountWeixin = function(order) {
	let that = this;
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'order', {
			type: 2,
			h5_browser: uni.$store.state.h5_browser,
			parame: order
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			that.payOrder(res.data, "")
				.then(function(res) {
					if(res.status == 1){
						uni.showToast({
							title: '充电成功！',
							icon: 'none',
							duration: 1500
						});
						that.setData({
							rewardPopup: !that.rewardPopup
						});
						
						if(that.$store.state.scene == 9){
							that.posts[0].exceptional_count += 1;
						}
						
					}else if(res.status == -1){
						// 未知
					}
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		}else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};
//充电--app
const openExceptionalAccountApp = function(params, callback) {
	var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
	let that = this;
	let rewardPrice = params.parame.rewardPrice;
	let postsId = params.parame.postsId;
	let postsUserId = params.parame.postsUserId;

	console.log("openExceptionalAccountApp", params)

	if (!reg.test(rewardPrice)) {
		uni.showToast({
			title: '请输入一个正确的充电金额',
			icon: 'none'
		});
		return
	} else if (rewardPrice < 1 || rewardPrice > 1000) {
		uni.showToast({
			title: '充电金额必须在1-1000',
			icon: 'none'
		});
		return
	}
	
	// #ifdef H5
	params.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	// let parame = {};
	// parame.rewardPrice = rewardPrice;
	// parame.postsId = postsId;
	// parame.postsUserId = postsUserId;

	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'app/order', params,
		'POST'
	).then(function(res) {
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.payOrder(payData, params.provider)
				.then(function(res) {
					
					if(res.status == 1){
						uni.showToast({
							title: '充电成功！',
							icon: 'none',
							duration: 1500
						});
						that.$store.commit('forceUpdatePage', true);
						uni.wen.toUrl(-2, 0, null);
						callback && callback(res)
					}else if(res.status == -1){
						// h5 未知
						callback && callback(res)
					}
					
				})
				.catch((err) => {
					uni.showToast({
						title: '取消支付',
						icon: 'none',
						duration: 1500
					});
					uni.wen.util.log(JSON.stringify(err.res));
				});
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

//购物车结算--weixin
const shopPliceOrder = function(order) {
	let that = this;
	order.random_str_ = Math.floor(Math.random() * 90000) + 10000;
	
	// #ifdef H5
	order.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/order', order,
		'POST'
	).then(function(res) {
		uni.loading(false);

		if (res.code == 200) {
			let payParam = res.data;
			uni.requestPayment({
				timeStamp: payParam.timeStamp,
				nonceStr: payParam.nonceStr,
				package: payParam.package,
				signType: payParam.signType,
				paySign: payParam.paySign,
				success: function(res) {
					setTimeout(function(){
						uni.redirectTo({
							url: '/pagesA/shop/order/order'
						})
					}, 300);
				},
				fail: function(res) {
					if(order && order.is_used_order){
						uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/cancelOrder', {
							random_str_: order.random_str_
						});
					}else{
						setTimeout(function(){
							uni.redirectTo({
								url: '/pagesA/shop/order/order'
							})
						}, 300);
					}
				}
			});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
	});
};
//购物车结算--app
const appShopPliceOrder = function(params, provider, callback) {
	let that = this;
	
	// #ifdef H5
	params.h5_browser = uni.$store.state.h5_browser;
	// #endif
	
	params.random_str_ = Math.random();
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'app/shop/order', params,
		'POST'
	).then(function(res) {
		uni.loading(false);
		
		let payData = null;
		if(typeof(res) == 'string'){
			payData = res;
		}else{
			payData = res.data;
		}
		if(payData){
			that.appPay(payData, provider, function(res) {
				if(res.status == 1){
					
					uni.showToast({
						title: '支付成功！',
						icon: 'none',
						duration: 1500
					});
					
					// 测试发现下面回调不起作用
					uni.$store.commit('forceUpdatePage', true);
					uni.redirectTo({
						url: '/pagesA/shop/order/order'
					})
					
					callback && callback(res)
				}else if(res.status == -1){
					// h5 未知
					callback && callback(res)
				}

			}, function(reason) {
				if(reason.others && reason.others.is_used_order && reason.others.random_str_){
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/cancelOrder', {
						random_str_: reason.others.random_str_
					});
				}
				uni.showToast({
					title: reason.msg,
					icon: 'none',
					duration: 1500
				});
			}, params);
			
			// that.setData({
			// 	payPopup: true,
			// 	payTitle: '支付成功'
			// });
			
			// that.setData({
			// 	payPopup: true,
			// 	payTitle: '支付失败'
			// });
		}else{
			console.log(res);
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

const _apple_init = function(product_ids){
	let that = this;
	return new Promise((resolve, reject) => {
		if(that._iap === undefined || that._iap === null){
			that._iap = new Iap({
				products: product_ids // 苹果开发者中心创建
			});
			that._iap.init().catch(err => {
				uni.showToast({
					title: JSON.stringify(err),
					icon: 'none'
				});
				reject(false);
			}).then(res => {
				that._iap.getProduct().then(res => {

				}).catch(err => {
					uni.showToast({
						title: JSON.stringify(err),
						icon: 'none'
					})
					reject(false);
				})
			})
		}
		resolve(true);
	});
}

const apple_restore = function(product_ids) {
	// 检查上次用户已支付且未关闭的订单，可能出现原因：首次绑卡，网络中断等异常
	let that = this;
	// 在此处检查用户是否登陆
	if (uni.$store.state.token) {
		that._apple_init(product_ids).then((flag) => {
			// 从苹果服务器检查未关闭的订单，可选根据 username 过滤，和调用支付时透传的值一致
			that._iap.restoreCompletedTransactions({
				username: that.$store.state.userInfo.id,
			}).then((transaction) => {
				if (!transaction.length) {
					return;
				}
				switch (transaction.transactionState) {
					case IapTransactionState.purchased:
						uni.wen.util.request(
							uni.wen.api.ApiRootUrl + 'app/apple/notify/app', {
							restore: 1,
							username: that.$store.state.userInfo.id,
							transaction: transaction
						}).then(function(res_) {
							if (res_.status) {
								that._iap.finishTransaction(transaction);
							} else {
								uni.wen.util.log(res_);
								uni.showToast({
									title: res_.message,
									icon: 'none',
									duration: 1500
								});
							}
						});
						break;
					case IapTransactionState.failed:
						// 关闭未支付的订单
						that._iap.finishTransaction(transaction);
						break;
					default:
					   break;
				}
			});
		});
	}
};


const apple_payment = function(productId, product_ids) {
	let that = this;
	if (uni.$store.state.token) {
		uni.loading(true);
		that._apple_init(product_ids).then((flag)=>{
			uni.wen.util.request(
				uni.wen.api.ApiRootUrl + 'app/order', {
					"provider": "apple",
					"pay_type": "app",
					"h5_browser": uni.$store.state.h5_browser,
					"parame": {
						"productId": productId
					}
				},
				'POST'
			).then(function(res) {
				if (res.status) {
					try{
						let orderId = res.data.orderId;
						// 请求苹果支付
						that._iap.requestPayment({
							 productid: productId,
							 manualFinishTransaction: true,
							 username: uni.$store.state.userInfo.id
						}).then((transaction) => {
							uni.wen.util.log( '99999999999999' + JSON.stringify(transactions));
							if(transaction){
								uni.wen.util.request(
									uni.wen.api.ApiRootUrl + 'app/apple/notify/app', {
									orderId: orderId,
									productid: productId,
									username: uni.$store.state.userInfo.id,
									transaction: transaction,
									restore: 0,
								}).then(function(res_) {
									if (res_.status) {
										that._iap.finishTransaction(transaction);
										uni.loading(false);
									} else {
										uni.loading(false);
										uni.wen.util.log( '77777777777' + JSON.stringify(res_) );
										uni.showToast({
											title: res_.message,
											icon: 'none',
											duration: 1500
										});
									}
								});
							  }else{
								  uni.loading(false);
								  uni.showToast({
									title: '支付失败',
									icon: 'none',
									duration: 1500
								  });
							  }
						}).catch((err) => {
							setTimeout(function(){
								uni.loading(false);
							}, 3000);
							uni.wen.util.log('requestPayment fail: ' + productId + ':' + orderId + ':' + JSON.stringify(product_ids) + ':' +JSON.stringify(err));
						});
					} catch (e) {
						uni.loading(false);
						uni.wen.util.log('555: '+JSON.stringify(e));
					    uni.showModal({
						title: "init",
						content: e.message,
						showCancel: false
					  });
					}
				}else {
					uni.showToast({
						title: res.message,
						icon: 'none',
						duration: 1500
					});
				}
			});
		});
	}
};

module.exports = function(obj) {
	obj.payOrder = payOrder;
	obj.onRechargeEarningsInWeixin = onRechargeEarningsInWeixin;
	obj.onRechargeEarningsInApp = onRechargeEarningsInApp;
	obj.openMembershipAccount = openMembershipAccount;
	obj.openExceptionalAccountWeixin = openExceptionalAccountWeixin;
	obj.openExceptionalAccountApp = openExceptionalAccountApp;
	obj.appPay = appPay;
	obj.appShopPliceOrder = appShopPliceOrder;
	obj.shopPliceOrder = shopPliceOrder;
	obj._apple_init = _apple_init;
	obj.apple_restore = apple_restore;
	obj.apple_payment = apple_payment;
	obj.coinPay = coinPay;
	obj.onRechargeGuarantee = onRechargeGuarantee;
	obj.normalOrder = normalOrder;
};
