
 //预览图片

const onPreviewPics = function(e) {
	var src = e.currentTarget.dataset.src;
	var list = e.currentTarget.dataset.list;
	uni.previewImage({
		current: src,
		urls: list
	});
}; //获取推荐话题

const getShopClassify = function(shop_id = 0) {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/classify', {shop_id: shop_id}).then(function(res) {
		let args = {};
		args.cats = that.cats.concat(res.data);
		that.setData(args);
		
		if(that.$store.state.scene == 86 && that.cats && that.cats.length > 0){
			if(that.paras.classify.id > 0 && (that.paras.classify.name == '~')){
				for(let i = 0; i < that.cats.length ; i ++){
					if(that.cats[i].id == that.paras.classify.id){
						that.paras.classify.name = that.cats[i].name;
					}
				}
			}
		}
		
	});
};

const getShopIndexRecommend = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/indexRecommend', {
		page: that.page
	}).then(function(res) {
		
		if(res.data.current_page != that.page){
			return false;
		}
		
		let data = res.data;
		let args = {};

		if (data.data.length > 0) {
			args.recommendList = data.data;
		} else if (data.data == '') {
			args.isLastPage = true;
		}

		args.page = data.current_page;
		args.topload = false;
		that.setData(args);

		if (data.data.length > 0) {
			if (that.page == 1) {
				that.setData({
					goodsWaterData: {
						e: 1,
						data: that.recommendList
					}
				});
			} else {
				that.setData({
					goodsWaterData: {
						e: 0,
						data: that.recommendList
					}
				});
			}
		}
	});
};

const getShopGoodsDetails = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsDetails', {
		id: that.id,
		dtk_id: that.dtk_id,
		tk_goodsid: that.tk_goodsid,
		tk_platform: that.tk_platform
	}).then(function(res) {
		if(res.status){
			let serviceTxt = '';
			
			for (var v of res.data.service) {
				serviceTxt += v.name + '、';
			}
			
			serviceTxt = serviceTxt.slice(0, serviceTxt.length - 1);
			let args = {};
			args.serviceTxt = serviceTxt;
			args.goodsinfo = res.data;
			args.param = res.data.param_data;
			
			if (res.data.url) {
				if (res.data.tk_platform_id.indexOf('jd__') !== -1) {
					args.goodsinfo.platform_icon = 'mini-jingdong2';
				} else if (res.data.tk_platform_id.indexOf('tb__') !== -1 || res.data.tk_platform_id.indexOf('tm__') !== -1) {
					args.goodsinfo.platform_icon = 'mini-shejiaotubiao-44';
				} else if (res.data.tk_platform_id.indexOf('pdd__') !== -1) {
					args.goodsinfo.platform_icon = 'mini-pinduoduo';
				} else if (res.data.tk_platform_id.indexOf('dy__') !== -1) {
					args.goodsinfo.platform_icon = 'mini-douyin';
				} else {
					args.goodsinfo.platform_icon = '';
				}
			}
			
			if(res.data.force_update_id){
				args.id = res.data.id;
			}
			
			that.setData(args);
			
			// #ifdef H5
			if(uni.$store.state.h5_browser == 'wxclient'){
				setTimeout(function(){
					
					let share_title = that.$store.state.config.share.format.app_share_good;
					share_title = share_title.replace('[good_name]', that.goodsinfo.name);
					let share_img = that.goodsinfo.pic[0] || that.$store.state.config.img.default_share;
					
					uni.wen.util.setH5WeixinShare(share_img, share_title, that.goodsinfo.intro || '商品');
				}, 500);
			}
			// #endif
			
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none'
			});
			return false;
		}
	});
};

const getShopInspiration = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/inspiration').then(function(res) {
		let args = {};
		args.swiperList = res.data;
		that.setData(args);
		that.towerSwiper('swiperList');
	});
};

const getShopHotList = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/hotList').then(function(res) {
		let args = {};
		args.hotList = res.data;
		that.setData(args);
	});
};

const getShopClassifyGoodsList = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/classifyGoodsList', {
		cid: that.curIdx,
		page: that.page
	}).then(function(res) {
		
		if(res.data.current_page != that.page){
			return false;
		}
		
		let data = res.data;
		let args = {};
		args.loading = false;

		if (data.data.length > 0) {
			args.goodsList = that.goodsList.concat(data.data);
		} else if (data.data == '') {
			args.isLastPage = true;

			if (data.current_page == 1) {
				args.isEmpty = true;
			}
		}

		args.page = data.current_page;
		that.setData(args);
	});
};

const getShopGoodsSearch = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsSearch', {
		keyword: that.keyword,
		page: that.page
	}).then(function(res) {
		
		if(res.data.current_page != that.page){
			return false;
		}
		
		let data = res.data;
		let args = {};
		args.loading = false;

		if (data.data.length > 0) {
			args.goodsList = that.goodsList.concat(data.data);
		} else{
			args.isLastPage = true;

			if (data.current_page == 1) {
				args.isEmpty = true;
			}
		}

		args.page = data.current_page;
		that.setData(args);
	});
};

const getShopGoodsPosts = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsPosts', {
		gid: that.id,
		dtk_id: that.dtk_id,
		tk_goodsid: that.tk_goodsid,
		tk_platform: that.tk_platform
	}).then(function(res) {
		let args = {};
		args.goodsComment = res.data;
		that.setData(args);
	});
};

const getShopAddCart = function() {
	let that = this;
	let formData = {};
	if(that.selectAction == 'used'){
		formData = {
			gid: that.id,
			action: that.selectAction,
		};
	}else if(that.selectAction == 'bureau'){
		formData = {
			gid: that.id,
			pid: that.selectTeamId,
			action: that.selectAction
		};
	}else{
		let paraminfo = that.paraminfo;
		formData = {
			gid: that.id,
			action: that.selectAction,
			pid: paraminfo.id,
			pname: that.goodsinfo.name,
			pvalue: paraminfo.value,
			pic: paraminfo.pic,
			price: paraminfo.price,
			vip_price: paraminfo.vip_price,
			stock: paraminfo.stock,
			num: that.num,
		};
	}
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/addCart', formData,'POST').then(function(res) {
		if (res.code == 200) {
			if(that.selectAction == 'cart'){
				that.setData({
					detailsShow: false
				});
				uni.showToast({
					title: that.num + ' 件商品已加入购物袋！',
					icon: 'none',
					duration: 2000
				});
				that.userCartCount();
			}else if(that.selectAction == 'buy'){
				if(res.data.cart_id){
					// 直接购买
					uni.wen.toUrl(6, '/pagesA/shop/place-order/place-order?cart_id='+res.data.cart_id, null);
				}else{
					uni.showToast({
						title: '返回出错，未返回cart_id',
						icon: 'none'
					})
				}
			}else if(that.selectAction == 'gold'){
				if(res.data.cart_id){
					// 直接购买
					uni.wen.toUrl(6, '/pagesA/shop/place-order/place-order?cart_id='+res.data.cart_id, null);
				}else{
					uni.showToast({
						title: '返回出错，未返回cart_id',
						icon: 'none'
					})
				}
			}else if(that.selectAction == 'used'){
				if(res.data.cart_id){
					// 直接购买
					uni.wen.toUrl(6, '/pagesA/shop/place-order/place-order?cart_id='+res.data.cart_id, null);
				}else{
					uni.showToast({
						title: '返回出错，未返回cart_id',
						icon: 'none'
					})
				}
			}else if(that.selectAction == 'bureau'){
				if(res.data.cart_id){
					// 直接购买
					uni.wen.toUrl(6, '/pagesZ/organize-bureau/join/index?cart_id='+res.data.cart_id + '&bureau=' + that.id + '&team=' + that.selectTeamId, null);
				}else{
					uni.showToast({
						title: '返回出错，未返回cart_id',
						icon: 'none'
					})
				}
			}
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	}).catch((err) => {
		console.log("getShopAddCart err", err)
	});
};

const getShopUserCartList = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/userCartList').then(function(res) {
		let args = {};
		if (res.data.length > 0) {
			res.data.map(item=>item.isTouchMove = false)
			args.cartGoods = res.data
		} else {
			args.isEmpty = true;
		}

		that.setData(args);
		that.calculateFun();
	});
};

const getShopSaveCartNum = function(pid, num, idx, value) {
	let that = this;
	if(!num){
		return false;
	}
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/saveCartNum', {
		pid: pid,
		num: num
	}).then(function(res) {
		if (res.code == 200) {
			let cartGoods = that.cartGoods;
			cartGoods[idx].num = num;
			let args = {};
			args.cartGoods = cartGoods;
			args.numindx = value;
			that.setData(args);
			that.calculateFun();
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	});
};

const getShopCheckCartGoods = function(pid, check) {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/checkCartGoods', {
		pid: pid,
		check: check
	}).then(function(res) {
		that.calculateFun();
	});
};

const getShopAllCheckCartGoods = function(is_check) {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/allCheckCartGoods', {
		is_check: is_check
	}).then(function(res) {
		that.getShopUserCartList();
	});
};

const getShopDelCartGoods = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/delCartGoods', {
		cid: that.cid
	}).then(function(res) {
		if (that.cartGoods.length > 0) {
			that.calculateFun();
		} else {
			that.setData({
				isEmpty: true
			});
		}
	});
};

const getShopGetAddsList = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/getAddsList').then(function(res) {
		let args = {};
		args.list = res.data;
		that.setData(args);
	});
};

const getShopSaveAdds = function() {
	let that = this;
	let is_check = 0;

	if (that.is_check) {
		is_check = 1;
	}

	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/saveAdds', {
			aid: that.aid,
			name: that.name,
			mobile: that.mobile,
			province: that.address[0],
			city: that.address[1],
			county: that.address[2],
			adds: that.adds,
			is_check: is_check
		},
		'POST'
	).then(function(res) {
		uni.showToast({
			title: '保存成功',
			icon: 'none'
		});
		that.setData({
			addsPopup: false
		});
		that.getShopGetAddsList();
	});
};

const getShopDelAdds = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/delAdds', {
		aid: that.aid
	}).then(function(res) {});
};

const getShopGetCheckAdds = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/getCheckAdds', {
		aid: that.aid
	}).then(function(res) {
		let args = {};
		args.aid = res.data ? res.data.id : 0;
		args.addsinfo = res.data || {};
		that.setData(args);
	});
};

const getShopPliceOrderGoods = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/pliceOrderGoods', {
		cart_id: that.cart_id
	}).then(function(res) {
		let args = {};
		args.goodslist = res.data;
		that.setData(args);
		that.calculateFun();
	});
};


const getShopOrderList = function( is_seller = 0 ) {
	let that = this;
	uni.loading(true);
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/getOrderList', {
		seller: is_seller,
		page: that.page,
		type: that.baridx
	}).then(function(res) {
		uni.loading(false);
		
		if(res.data.current_page != that.page){
			return false;
		}
		
		let data = res.data;
		let args = {};
		args.loading = false;

		if (data.data.length > 0) {
			args.list = that.list.concat(data.data);
		} else if (data.data == '') {
			args.isLastPage = true;

			if (data.current_page == 1) {
				args.isEmpty = true;
			}
		}

		args.page = data.current_page;
		that.setData(args);
	});
};

const getShopDelOrder = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/delOrder', {
		oid: that.oid
	}).then(function(res) {});
};

const getShopCancelOrder = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/cancelOrder', {
		oid: that.oid
	}).then(function(res) {});
};

const shopPayment = function(e) {
	let that = this;
	uni.loading(true);
	let orderSn = e.currentTarget.dataset.on;
	let order_amount = e.currentTarget.dataset.amount;
	
	// todo:
	// let paywaylist = [0];
	// if(that.$store.state.platform == 'ios' && that.$store.state.device == 'app'){
	// 	paywaylist.push(1);
	// 	paywaylist.push(2);
	// }else{
	// 	paywaylist.push(1);
	// 	paywaylist.push(2);
	// }
	
	// if(that.$store.state.config.app.coins.pay == true){
	// 	paywaylist.push(3);
	// }
	
	// that.myToast({
	// 	type:'payway',
	// 	content: 'SHOP购物',
	// 	price: order_amount,
	// 	timeout: 2000,
	// 	isClick:true,
	// 	paywaylist: paywaylist,
	// 	order: {
	// 		type: 5,
	// 		aid: that.aid,
	// 		user_remark: that.user_remark,
	// 		goods_amount: that.amount,
	// 		discounts_amount: (that.$store.state.userInfo.is_member ? that.discountsAmount : 0),
	// 		order_amount: (that.$store.state.userInfo.is_member ? that.vipAmount : that.amount),
	// 		order_goods: that.goodslist
	// 	}
	// });
	
	
	// #ifdef MP
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/payment', {
			orderSn: orderSn,
			order_amount: order_amount
		},
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
					uni.showToast({
						title: '支付成功',
						icon: 'success',
						success: function(res) {
							that.setData({
								baridx: 2,
								list: [],
								page: 1,
								loading: false,
								loadmoreShow: false,
								isLastPage: false,
								isEmpty: false,
								particulars: false
							});
							that.getShopOrderList();
						}
					});
				},
				fail: function(res) {
					uni.showToast({
						title: '取消支付',
						icon: 'error'
					});
				}
			});
		} else {
			uni.showToast({
				title: '唤起支付失败',
				icon: 'error'
			});
		}
	});
	// #endif
	
	// #ifndef MP
	uni.loading(false);
	var obj = {
		"provider": "wxpay",
		"pay_type": "app",
		"orderSn": orderSn,
		"order_amount": order_amount
	}
	var params = JSON.stringify(obj)
	uni.wen.toUrl(6, `/pages/pay/pay-order?params=` + params, null);
	// #endif
};

const getShopPushDelivery = function() {
	let that = this;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/pushDelivery', {
			on: that.on,
			title: '催发货',
			message: '订单：' + that.on + '用户在催发货了。'
		},
		'POST'
	).then(function(res) {
		if (res.code == 200) {
			uni.showToast({
				title: '订单催发货通知成功，我们会尽快为您处理。',
				icon: 'none',
				duration: 2000
			});
		} else {
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	});
};

const getShopOrderRefund = function() {
	let that = this;
	let refundGoods = that.refundGoods;
	let message =
		'订单：' +
		that.on +
		'；' +
		refundGoods.quantity +
		'件 ' +
		refundGoods.name +
		'【' +
		refundGoods.product +
		'】' +
		'会员价为：【' +
		refundGoods.vip_price +
		'】普通价为：' +
		refundGoods.price +
		' 申请退款。';
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/orderRefund', {
			action: 'add',
			opid: refundGoods.product_id,
			oid: refundGoods.order_id,
			on: that.on,
			title: '退款申请',
			message: message
		},
		'POST'
	).then(function(res) {
		if(res.status){
			if(res.code == 200){
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 2000
				});
			}else if(res.code = 201){
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 600
				});
				setTimeout(function(){
					uni.startPullDownRefresh({});
				}, 600);
			}
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	});
};

const getShopConfirmReceipt = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/confirmReceipt', {
		oid: that.oid
	}).then(function(res) {
		that.setData({
			baridx: 4,
			list: [],
			page: 1,
			loading: false,
			loadmoreShow: false,
			isLastPage: false,
			isEmpty: false,
			particulars: false
		});
		that.getShopOrderList();
	});
};

const getShopOrderCount = function(is_seller = 0) {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/getOrderCount', {
		seller: is_seller
	}).then(function(res) {
		let tapbar = that.tapbar;
		tapbar[1].badge.value = res.data.payCount;
		tapbar[2].badge.value = res.data.deliverCount;
		tapbar[3].badge.value = res.data.closedCount;
		if(res.data.refundCount && res.data.refundCount > 0){
			tapbar[4].badge.value = res.data.refundCount;
		}
		that.setData({
			tapbar: tapbar
		});
	});
};

const getShopRefundGoods = function() {
	let that = this;
	let refundGoods = that.refundGoods;
	let message =
		'订单：' +
		that.on +
		'；' +
		refundGoods.quantity +
		'件 ' +
		refundGoods.name +
		'【' +
		refundGoods.product +
		'】' +
		'会员价为：【' +
		refundGoods.vip_price +
		'】普通价为：' +
		refundGoods.price +
		' 申请退货退款。';
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'shop/refundGoods', {
			opid: refundGoods.product_id,
			oid: refundGoods.order_id,
			on: that.on,
			title: '退货退款申请',
			message: message
		},
		'POST'
	).then(function(res) {
		if(res.status){
			uni.setClipboardData({
				data: that.on
			});
			that.setData({
				serviceShow: true
			});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	});
};

const userCartCount = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/userCartCount').then(function(res) {
		that.setData({
			cartCount: res.data
		});
	});
};

const shopOrderAddress = function(shop_order_id, address_id){
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/orderAddress', {
		order_id: shop_order_id,
		aid: address_id
	}, 'POST').then(function(res) {
		if(res.status){
			if(that.$store.state.scene == 54 || that.$store.state.pre_scene == 54){
				if(that.list && that.list.length > 0){
					let list = that.list;
					for (let index = 0; index < list.length; index ++) {
					    if (list[index].id == shop_order_id) {
							list[index].adds_id = res.data.adds_id;
							list[index].adds_name = res.data.adds_name;
							list[index].adds_mobile = res.data.adds_mobile;
							list[index].address = res.data.address;
							break;
					    }
					}
					that.list = list;
				}
			}
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 2000
			});
		}
	});
}

//商品获取晒单列表
const getShopGoodsPostsList = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/goodsPostsList', {
        gid: that.id,
        page: that.page
    }).then(function (res) {
		
		if(res.data.current_page != that.page){
			return false;
		}

        if (res.data.data.length == 0) {
            that.isLastPage = true;
        }

        that.posts = that.posts.concat(res.data.data);
        that.topicload = false;
        that.page = res.data.current_page;

    });
}; 

module.exports = function(obj) {
	obj.userCartCount = userCartCount;
	obj.getShopRefundGoods = getShopRefundGoods;
	obj.getShopOrderCount = getShopOrderCount;
	obj.getShopConfirmReceipt = getShopConfirmReceipt;
	obj.getShopOrderRefund = getShopOrderRefund;
	obj.getShopPushDelivery = getShopPushDelivery;
	obj.shopPayment = shopPayment;
	obj.getShopCancelOrder = getShopCancelOrder;
	obj.getShopDelOrder = getShopDelOrder;
	obj.getShopOrderList = getShopOrderList;
	obj.getShopPliceOrderGoods = getShopPliceOrderGoods;
	obj.getShopDelAdds = getShopDelAdds;
	obj.getShopSaveAdds = getShopSaveAdds;
	obj.getShopGetAddsList = getShopGetAddsList;
	obj.getShopGetCheckAdds = getShopGetCheckAdds;
	obj.getShopDelCartGoods = getShopDelCartGoods;
	obj.getShopAllCheckCartGoods = getShopAllCheckCartGoods;
	obj.getShopCheckCartGoods = getShopCheckCartGoods;
	obj.getShopSaveCartNum = getShopSaveCartNum;
	obj.getShopUserCartList = getShopUserCartList;
	obj.getShopAddCart = getShopAddCart;
	obj.getShopGoodsPosts = getShopGoodsPosts;
	obj.onPreviewPics = onPreviewPics;
	obj.getShopClassify = getShopClassify;
	obj.getShopIndexRecommend = getShopIndexRecommend;
	obj.getShopGoodsDetails = getShopGoodsDetails;
	obj.getShopInspiration = getShopInspiration;
	obj.getShopHotList = getShopHotList;
	obj.getShopClassifyGoodsList = getShopClassifyGoodsList;
	obj.getShopGoodsSearch = getShopGoodsSearch;
	obj.shopOrderAddress = shopOrderAddress;
	obj.getShopGoodsPostsList = getShopGoodsPostsList;
};
