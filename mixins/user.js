const loginByWeixin = function() {
	let that = this;
	return new Promise(function(resolve, reject) {
		uni.wen.util.login().then((login_res) => {
			if(login_res.errMsg == 'login:ok' && login_res.code){
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'login', {
						code: login_res.code
					},
					'POST'
				).then((res) => {
					if (res.code === 200) {
						//存储用户token
						uni.setStorageSync('token', res.data.token);
						uni.$store.commit('updateToken', res.data.token);

						uni.setStorageSync('userInfo', res.data.user);
						that.$store.commit('updateUserInfo', res.data.user);
						that.$store.commit('userUpdateTimes', 1);
						wx.setBackgroundFetchToken({
						  token: res.data.token
						});
						let device = '';
						// #ifdef APP
						device = 'app';
						// #endif
						// #ifdef MP
						device = 'mp';
						// #endif
						// #ifdef H5
						device = 'h5';
						// #endif
						
						if(uni.$store.state.websocket){
							uni.$store.state.websocket.restart();
						}
						
						uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
						    uni.$store.dispatch('userAddPlateAction', res2.data);
						});
						
						resolve(res.data);
					} else {
						uni.wen.util.log(JSON.stringify(res))
						reject(res);
					}
				});
			}else{
				uni.wen.util.log(JSON.stringify(res))
				reject(res);
			}
		});
	});
};

/**
 * app 使用微信登录
 */
const appLoginByWeixin = function() {
	let that = this;
	let userInfo = null;
	let code = null;
	return new Promise(function(resolve, reject) {
		uni.login({
			provider: 'weixin',
			"onlyAuthorize": true, // 微信登录仅请求授权认证
			success: function(t) {
				if (t.errMsg === 'login:ok') {
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'app/login/code', t,
						'POST').then(res => {
						console.log("登录成功:", res)

						if (res.code === 200) {
							//存储用户token
							uni.setStorageSync('token', res.data.token);
							uni.$store.commit('updateToken', res.data.token);

							uni.setStorageSync('userInfo', res.data.user);
							that.$store.commit('updateUserInfo', res.data.user);
							that.$store.commit('userUpdateTimes', 1);
							let device = '';
							// #ifdef APP
							device = 'app';
							// #endif
							// #ifdef MP
							device = 'mp';
							// #endif
							// #ifdef H5
							device = 'h5';
							// #endif
							
							if(uni.$store.state.websocket){
								uni.$store.state.websocket.restart();
							}
							
							uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
							    uni.$store.dispatch('userAddPlateAction', res2.data);
							});
							
							resolve(res.data.user);
						} else {
							reject(res);
						}
					}).catch(err => {
						uni.wen.util.log(err);
						reject(err);
					})
				}else{
					uni.wen.util.log(res);
					uni.showToast({
						title: t.errMsg,
						icon: 'none'
					})
				}
			},
			fail(res) {
				uni.wen.util.log(res);
				uni.showToast({
					title: '登录失败',
					icon: 'none'
				})
				reject(res)
			}
		});
	});
};
// 修改用户信息
const updateInfo = function(data) {
	let that = this;
	let datas = {
		user_id: that.setUserId > 0 ? that.setUserId: 0, // 0代表本人，大于0代表管理员
		user_avatar: that.avatar,
		user_name: that.nickName,
		user_introduce: that.signature,
		wechat_account: that.wechatAccount,
		user_birthday: that.birth,
		gender: that.gender,
		user_background_maps: that.imagesubject,
		user_labels: that.tagList,
	};
	if(data){
		if(data.avatar){
			datas.user_avatar = data.avatar;
		}
		if(data.nickName){
			datas.user_name = data.nickName;
		}
		if(data.signature){
			datas.user_introduce = data.signature;
		}
		if(data.wechatAccount){
			datas.wechat_account = data.wechatAccount;
		}
		if(data.birth){
			datas.user_birthday = data.birth;
		}
		if(data.gender){
			datas.gender = data.gender;
		}
		if(data.imagesubject){
			datas.user_background_maps = data.imagesubject;
		}
		if(data.user_id > 0){
			datas.user_id = data.user_id;
		}
		if(data.tagList){
			if(data.tagList.length == 0){
				datas.user_labels = -1;
			}else{
				datas.user_labels = data.tagList;
			}
		}

		if(data.privacy_message_me && data.privacy_message_me > 0){
			datas.privacy_message_me = data.privacy_message_me;
			datas.is_user_setting = true;
		}
		if(data.privacy_collected_post_show && data.privacy_collected_post_show > 0){
			datas.privacy_collected_post_show = data.privacy_collected_post_show;
			datas.is_user_setting = true;
		}
		if(data.privacy_my_follow_show && data.privacy_my_follow_show > 0){
			datas.privacy_my_follow_show = data.privacy_my_follow_show;
			datas.is_user_setting = true;
		}
		if(data.privacy_follow_me_show && data.privacy_follow_me_show > 0){
			datas.privacy_follow_me_show = data.privacy_follow_me_show;
			datas.is_user_setting = true;
		}
		if(data.privacy_personal_recommend_user && data.privacy_personal_recommend_user > 0){
			datas.privacy_personal_recommend_user = data.privacy_personal_recommend_user;
			datas.is_user_setting = true;
		}
		if(data.privacy_personal_recommend && data.privacy_personal_recommend > 0){
			datas.privacy_personal_recommend = data.privacy_personal_recommend;
			datas.is_user_setting = true;
		}
		if(data.privacy_personal_ad && data.privacy_personal_ad > 0){
			datas.privacy_personal_ad = data.privacy_personal_ad;
			datas.is_user_setting = true;
		}
		if(data.privacy_personal_geo_title && data.privacy_personal_geo_title > 0){
			datas.privacy_personal_geo_title = data.privacy_personal_geo_title;
			datas.is_user_setting = true;
		}
		if(data.diy_scene_1_post_list_style && data.diy_scene_1_post_list_style > 0){
			datas.diy_scene_1_post_list_style = data.diy_scene_1_post_list_style;
			datas.is_user_setting = true;
		}
		if(data.diy_scene_6_post_list_style && data.diy_scene_6_post_list_style > 0){
			datas.diy_scene_6_post_list_style = data.diy_scene_6_post_list_style;
			datas.is_user_setting = true;
		}
		if(data.diy_scene_7_post_list_style && data.diy_scene_7_post_list_style > 0){
			datas.diy_scene_7_post_list_style = data.diy_scene_7_post_list_style;
			datas.is_user_setting = true;
		}
		if(data.diy_scene_8_post_list_style && data.diy_scene_8_post_list_style > 0){
			datas.diy_scene_8_post_list_style = data.diy_scene_8_post_list_style;
			datas.is_user_setting = true;
		}
	}
	return new Promise(function(resolve, reject) {
		uni.loading(true);
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/update/info', datas, 'POST').then(function(res) {
			uni.loading(false);
			if (res.code == 200) {
				if(res.data.code == 1){
					uni.setStorageSync('userInfo', res.data.user);
					that.$store.commit('updateUserInfo', res.data.user);
					that.$store.commit('userUpdateTimes', 1);
					uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res2) {
					    uni.$store.dispatch('userAddPlateAction', res2.data);
					});
				}else{
					uni.showToast({
						title: '保存成功！审核中...',
						icon: 'none'
					});
					reject(res);
				}
				resolve(res)
			} else if(res.code == 200016) {
		        uni.showModal({
		            title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
		            content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿设置违规内容',
		            showCancel: false,
		            confirmText: '朕知道了',
		            confirmColor: that.primaryColor
		        });
		    } else {

		        uni.showModal({
		            title: '保存失败',
		            content: res.message,
		            showCancel: false,
		            confirmText: '朕知道了',
		            confirmColor: that.primaryColor
		        });
		    }
			reject(res)
		});
	});

};

const userSettingUpdate = function(key, value){
	let that = this;
	let data = [];
	data[key] = value;
	return that.updateInfo(data);
}


//我的笔记/收藏/喜欢
const userPosts = function(currentItem, page, uid = 0) {
	let that = this;
	if(page == 1){
		if(currentItem == 'shop'){
			that.setData({
				topicload: true,
				goodsWaterData: {
					e: 1,
					data: []
				}
			});
		}else{
			that.setData({
				topicload: true,
				posts: [],
				postWaterData: {
					e: 1,
					data: []
				}
			});
		}
	}
	
	let para = {
		type: currentItem,
		page: page,
		user_id: uid,
	};
	
	if(currentItem == 'shop'){
		para.shop_id = that.goodparas.shop_id;
		para.orderBy = that.goodparas.orderBy;
		para.order = that.goodparas.order;
	}
	
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/posts', para).then((res) => {
		uni.stopPullDownRefresh();
		if (res.status) {
			
			if(res.data.current_page != page){
				return false;
			}
			
			let data = res.data;
			let args = {};

			if (data.data.length <= 0 && page == 1) {
				args.isNul = true;
			}

			if (data.data.length == 0) {
				args.isLastPage = true;
			}

			if (currentItem == 'post') {
				args.myPostsList = that.myPostsList.concat(data.data);
				args.myPostsPage = data.current_page;
			} else if (currentItem == 'collected') {
				args.myCollectionList = that.myCollectionList.concat(data.data);
				args.myCollectionPage = data.current_page;
			} else if (currentItem == 'liked') {
				args.myLikePostsList = that.myLikePostsList.concat(data.data);
				args.myLikePostsPage = data.current_page;
			} else if (currentItem == 'exceptionaled') {
				args.myExceptionalList = that.myExceptionalList.concat(data.data);
				args.myExceptionalPage = data.current_page;
			} else if (currentItem == 'shop') {
				args.myShopGoodsList = that.myShopGoodsList.concat(data.data);
				args.myShopGoodsPage = data.current_page;
			}

			if(currentItem == 'shop'){
				if(data.data && data.data.length > 0){
					args.goodsWaterData = {
						e: page == 1 ? 1 : 0,
						data: data.data
					}
				}
			}else{
				if(data.data.length > 0){
					args.posts = that.posts.concat(data.data);
				}
				if(that.$store.state.scene == 5 || that.$store.state.scene == 8){
					if(that.user_list_waterfall){
						if(data.data && data.data.length > 0){
							args.postWaterData = {
								e: page == 1 ? 1 : 0,
								data: data.data
							}
						}
					}
				}
			}
			
			args.topicload = false;
			that.setData(args);

		}else{
			if(that.$store.state.scene == 5 && res.code == 200003){
				that.setData({
					topicload: false,
					isNul: true,
					loadmoreShow: false,
				});
			}else{
				that.setData({
					topicload: false,
					loadmoreShow: false,
				});
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}
			
		}
	});
};

/**
 * 用户认证状态
 */

const userAuthentication = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/authentication').then(function(res) {
		let args = {};

		if (res.data == null || res.data == '') {
			args.isA = false;
		} else {
			args.isA = true;
		}

		args.alist = res.data;
		args.swiperload = false;
		that.setData(args);
	});
};
/**
 * 用户认证
 */

const addAuthentication = function() {
	let that = this;
	let name = that.name;
	let phone = that.phone;
	let desc = that.desc;
	let imagesubject = that.imagesubject;

	if (name == '' || name == null) {
		uni.showToast({
			title: '请填写名称',
			icon: 'none'
		});
		return;
	}

	if (phone == '' || phone == null) {
		uni.showToast({
			title: '请填写联系方式',
			icon: 'none'
		});
		return;
	}

	if (desc == '' || desc == null) {
		uni.showToast({
			title: '请填写介绍',
			icon: 'none'
		});
		return;
	}


	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'user/authentication', {
			name: name,
			contact_information: phone,
			introduce: desc,
			identity_picture: imagesubject
		},
		'POST'
	).then(function(res) {
		uni.loading(false);
		if(res.status){

			that.setData({
				isA: true,
				alist: {
					authentication_state: 0
				},
				swiperload: false
			});

			//  模板消息
			// #ifdef MP-WEIXIN
			if(res.data.tmplIds && res.data.tmplIds.length > 0){
				wx.requestSubscribeMessage({
					tmplIds: res.data.tmplIds,
					success (res) {
						uni.wen.util.log(res);
						setTimeout(function(){
							uni.showToast({
								title: '提交成功！',
								icon: 'none'
							});
						}, 500);
					},
				});
				return false;
			}
			// #endif
			uni.showToast({
				title: '提交成功！',
				icon: 'none'
			});

		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
}; //用户创建的圈子列表

const userCricle = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/cricle').then(function(res) {
		let args = {};
		args.subcats = res.data;
		args.subcatsloading = false;
		that.setData(args);
	});
}; //用户相关笔记count

const userTotalPost = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/totalPost').then(function(res) {
		let args = {};
		let data = that.taga;
		data[0].ums = res.data.myTotal;
		data[1].ums = res.data.collecTotal;
		data[2].ums = res.data.likeTotal;
		data[3].ums = res.data.exceptionalTotal;
		args.taga = data;
		that.setData(args);
	});
}; //关注列表

const followUserList = function() {
	let that = this;
	let apiUsl = uni.wen.api.ApiRootUrl + 'user/followUser';

	if (that.type == 1) {
		apiUsl = uni.wen.api.ApiRootUrl + 'user/fansUser';
	}else if (that.type == 2) {
		apiUsl = uni.wen.api.onlineUserUrl;
	}

	uni.wen.util.request(apiUsl, {
		user_id: that.userid,
		page: that.page
	}).then(function(res) {
		
		if(res.data.current_page != that.page){
			return false;
		}
		
		let data = res.data;
		let args = {};

		if (data.data.length <= 0) {
			args.isLastPage = true;
		}

		args.userList = that.userList.concat(data.data);
		args.loadmore = false;
		args.page = data.current_page;
		that.setData(args);
	});
};
//通过用户id获取用户公开信息
const getUserinfoById = function(userId) {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/info/byUserId', {
		user_id: userId
	}).then(function(res) {
		let args = {};
		args.userInfo = res.data;
		that.setData(args);
		
		// #ifdef H5
		if(uni.$store.state.h5_browser == 'wxclient'){
			setTimeout(function(){
				let share_title = that.$store.state.config.share.format.app_share_author;
				share_title = share_title.replace('[author_name]', res.data.user_name).replace('[author_introduce]', res.data.user_introduce);
				let share_img = res.data.user_avatar;
				uni.wen.util.setH5WeixinShare(share_img, share_title, res.data.user_introduce);
			}, 500);
		}
		// #endif
		
	});
};

//获取会员价格
const getMembersPrice = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'getMembersPrice').then(function(res) {
		let args = {};

		if (res.status) {
			args.order_price = res.data;
		} else {
			args.order_price = 999;
		}

		that.setData(args);
	});
};

//用户订单
const myOrder = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myOrder', {
		page: that.page,
		type: that.type
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			
			if(res.data.current_page != that.page){
				return false;
			}
			
			let data = res.data;
			let args = {};

			if (data.data.length < 10) {
				args.isLastPage = true;
			}

			args.loading = false;
			args.orderList = that.orderList.concat(data.data);
			args.page = data.current_page;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
}; //用户余额

const myFinancial = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myFinancial', {
		setUserid: that.setUserId
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			let data = res.data.financial;
			let args = {};
			let withdrawal = that.withdrawal;
			if(data){
				args.restBalance = data.balance;
				args.bankName = data.bank_name;
				args.bankId = data.bank_card;
				withdrawal[0].i = data.earnings_yesterday;
				withdrawal[1].i = data.balance;
				withdrawal[2].i = data.withdrawal_price;
				args.withdrawal = withdrawal;
				args.withdrawalBalance = data.balance;
			}

			args.totalCoins = res.data.coins.total;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}

		that.animate();
	});
}; //用户提现列表

const myUserWithdrawal = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myUserWithdrawal', {
		setUserid: that.setUserId
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			let args = {};

			if (res.data.length <= 0) {
				args.isWithdrawal = false;
			}

			args.withdrawalList = res.data;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

//用户余额列表
const myUserExceptional = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/myUserExceptional', {
		setUserid: that.setUserId
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			let args = {};

			if (res.data.length <= 0) {
				args.isExceptional = false;
			}

			args.exceptionalList = res.data;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

// 余额记录
const myUserFinancialRecord = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/financialRecord', {
		setUserid: that.setUserId
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			let args = {};

			if (res.data.length <= 0) {
				args.isFinancialRecord = false;
			}

			args.financialRecordList = res.data;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};
// 金币记录
const myUserCoinsRecord = function() {
	let that = this;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/coinsRecord',{
		setUserid: that.setUserId
	}).then(function(res) {
		uni.loading(false);
		if (res.status) {
			let args = {};

			if (res.data.length <= 0) {
				args.isCoinsRecord = false;
			}

			args.coinsRecordList = res.data;
			that.setData(args);
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};
//用户提现
const withdrawalPay = function() {
	let that = this;
	let price = that.price;
	let bankName = that.bankName;
	let bankId = that.bankId;
	
	let real_name = that.real_name;
	let wechat_phone = that.wechat_phone;
	let aliay_phone = that.aliay_phone;

	if (price == '' || price == null) {
		uni.showToast({
			title: '请选择提现金额！',
			icon: 'none'
		});
		return;
	}
	if (real_name == '' || real_name == null) {
		uni.showToast({
			title: '请输入真实姓名！',
			icon: 'none'
		});
		return;
	}
	
	if(that.$store.state.config2.app.withdrawal.type == 1){
		if (wechat_phone == '' || wechat_phone == null || !uni.wen.util.validatePhoneNumber(wechat_phone)) {
			uni.showToast({
				title: '微信手机号不合法！',
				icon: 'none'
			});
			return;
		}
	}else if(that.$store.state.config2.app.withdrawal.type == 2){
		if (aliay_phone == '' || aliay_phone == null || !uni.wen.util.validatePhoneNumber(aliay_phone)) {
			uni.showToast({
				title: '支付宝手机号不合法！',
				icon: 'none'
			});
			return;
		}
	}else{
		if (bankName == '' || bankName == null) {
			uni.showToast({
				title: '请输入支行名称！',
				icon: 'none'
			});
			return;
		}
		
		if (bankId == '' || bankId == null) {
			uni.showToast({
				title: '请输入银行卡号！',
				icon: 'none'
			});
			return;
		}
	}

	

	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'user/initiateWithdrawal', {
			price: price,
			bank_name: bankName,
			bank_card: bankId,
			real_name: real_name,
			wechat_phone: wechat_phone,
			aliay_phone: aliay_phone
		},
		'POST'
	).then(function(res) {
		if (res.status) {

			that.setData({
				withdrawalPopup: !that.withdrawalPopup
			});
			that.myFinancial();
			that.myUserWithdrawal();

			//  模板消息
			// #ifdef MP-WEIXIN
			if(res.data.tmplIds && res.data.tmplIds.length > 0){
				wx.requestSubscribeMessage({
					tmplIds: res.data.tmplIds,
					success (res) {
						uni.wen.util.log(res);
						setTimeout(function(){
							uni.showModal({
								title: '发起提现成功',
								content: '我们会在1至3个工作日内您受理，请您耐心等待！',
								showCancel: false,
								confirmText: '朕知道了',
								confirmColor: '#333333',

								success(res) {

								}
							});
						}, 500);
					},
				});
				return false;
			}
			// #endif

			uni.showModal({
				title: '发起提现成功',
				content: '我们会在1至3个工作日内您受理，请您耐心等待！',
				showCancel: false,
				confirmText: '朕知道了',
				confirmColor: '#333333',

				success(res) {

				}
			});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
	});
}; //PC登录信息

const pcLogin = function() {
	let that = this;
	uni.wen.util.getNewToken().then(() => {
		uni.wen.util.request(uni.wen.api.WebRootUrl + 'wx_login', {
			token: uni.getStorageSync('token'),
			scene: that.scan_scene
		}).then(function(res) {
			that.setData({
				btnState: false
			});
			uni.reLaunch({
				url: '/pages/tabbar/index/index'
			});
		});
	});
};

module.exports = function(obj) {
	obj.pcLogin = pcLogin;
	obj.myUserFinancialRecord = myUserFinancialRecord;
	obj.myUserCoinsRecord = myUserCoinsRecord;
	obj.myUserExceptional = myUserExceptional;
	obj.myUserWithdrawal = myUserWithdrawal;
	obj.myFinancial = myFinancial;
	obj.myOrder = myOrder;
	obj.withdrawalPay = withdrawalPay;
	obj.loginByWeixin = loginByWeixin;
	obj.appLoginByWeixin = appLoginByWeixin;
	obj.updateInfo = updateInfo;
	obj.userSettingUpdate = userSettingUpdate;
	obj.userPosts = userPosts;
	obj.userTotalPost = userTotalPost;
	obj.addAuthentication = addAuthentication;
	obj.userAuthentication = userAuthentication;
	obj.userCricle = userCricle;
	obj.followUserList = followUserList;
	obj.getUserinfoById = getUserinfoById;
	obj.getMembersPrice = getMembersPrice;
};
