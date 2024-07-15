
 //添加话题
const getAddTagList = function (tags_name) {
    let that = this;
    uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'tags/add',
        {
            tags_name: tags_name
        },
        'POST'
    ).then(function (res) {
        let userSelectedTags = uni.getStorageSync('userSelectedTags');
        let readsave = true; // 过滤重复值

        if (userSelectedTags.length > 0) {
            for (let i = 0; i < userSelectedTags.length; i++) {
                if (userSelectedTags[i].id == res.data.id) {
                    readsave = false;
                    uni.showToast({
                        title: '您已经添加过该话题了',
                        icon: 'none'
                    });
                    break;
                }
            }
        }

        if (readsave) {
            let args = {};
            args.id = res.data.id;
            args.tags_name = res.data.tags_name;
            userSelectedTags.unshift(args);
            uni.setStorageSync('userSelectedTags', userSelectedTags);
            that.searchInput = '';
			that.userSelectedTags = userSelectedTags;
        }
    });
}; //获取推荐话题

const getTagList = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'tags/recommend', {search: that.searchStr}).then(function (res) {
		that.tags = [];
		that.isNull = true;

        if (res.data.length <= 0) {
            that.isNull = false;
        }
        that.tags = res.data;
    });
}; //发帖

const creatForums = function () {
    let that = this;
	
	if(that.isUploading){
		uni.showToast({
			title: '还在上传中，请稍后',
			icon: 'none'
		});
		return false;
	}
	
	if(that.imagetext_save){
		that.imagetext_save();
	}

	if(that.editer != 'simple' && that.editer != 'imagetext' && that.editer != 'refer'){
		uni.showToast({
			title: '程序运行错误，请反馈一下给管理员',
			icon: 'none'
		});
		return false;
	}


	if (uni.$store.state.token) {

	} else {
		if(that.saveDraft){
			that.saveDraft();
		}
		setTimeout(function(){
			if(that.$store.state.scene == 14){
				return;
			}
			uni.wen.toUrl(-4, null, null);
		}, 200);
		return false;
	}

	let editer = that.editer;
	let imagetext_content = '';
	if(that.editer == 'imagetext'){
		imagetext_content = that.imagetext_content;
	}

    let textinput = that.textinput; //笔记内容

    let circle_id = that.circle ? that.circle.id : 0; //圈子id

    let tags = that.tags; //话题数组

    let goods = that.goods; //商品数组

    let location = that.location; // 地址信息

    let image_urls = that.image_urls; // 图片地址数组

    let video_url = that.video_url; // 视频地址

    let video_thumb_url = that.video_thumb_url; // 视频封面

    let video_height = that.video_height; // 视频高度

    let video_width = that.video_width; // 视频宽度

	let vote_list = that.isVoteContent ? that.voteInputList : []; // 投票数组

	let file_list = that.upload_files ? that.upload_files : []; // 附件列表

	let sounds_list = that.sounds_files ? that.sounds_files : []; // 附件列表

	let pay_obj = that.pay_content_obj;

	let refer_id = that.refer_id;

	let contact_phone = that.contact_phone;

	let sph_video_feed_token = that.sph_video_feed_token;
	
	let sph_image_urls = that.sph_image_urls;
	
	let posts_title = that.posts_title;
	
	let selectUseds = '';
	if(that.selectUseds && that.selectUseds.length > 0){
		for (let i =0; i < that.selectUseds.length; i ++) {
			if(selectUseds){
				selectUseds += (','+that.selectUseds[i].id);
			}else{
				selectUseds += that.selectUseds[i].id;
			}
		}
	}
	
	let selectBureaus = '';
	if(that.selectBureaus && that.selectBureaus.length > 0){
		for (let i =0; i < that.selectBureaus.length; i ++) {
			if(selectBureaus){
				selectBureaus += (','+that.selectBureaus[i].id);
			}else{
				selectBureaus += that.selectBureaus[i].id;
			}
		}
	}
	
	// 付费内容
	if(that.pay_content_obj && that.pay_content_obj.price > 0){
		if( that.pay_content_obj.words_percent == 100 && that.pay_content_obj.is_file == 0 && that.pay_content_obj.is_img == 0 && that.pay_content_obj.is_video == 0 && (that.pay_content_obj.hidden == '' || that.pay_content_obj.hidden == undefined ) ){
			uni.showToast({
			    title: '请合理配置付费内容',
			    icon: 'none'
			});
			return;
		}
		if( that.pay_content_obj.credit_type == 0 ){
			if( that.pay_content_obj.price > that.$store.state.config.page.create.max_coins ){
				uni.showToast({
				    title: '最大支持' + that.$store.state.config.page.create.max_coins + uni.$store.state.config.app.coins.name,
				    icon: 'none'
				});
				return;
			}
		}else if(that.pay_content_obj.credit_type == 1){
			if( that.pay_content_obj.price > that.$store.state.config.page.create.max_blance ){
				uni.showToast({
				    title: '最大支持' + that.$store.state.config.page.create.max_blance + '余额',
				    icon: 'none'
				});
				return;
			}
		}
		if(that.pay_content_obj.is_file == 1 && file_list.length <= 0){
			uni.showToast({
			    title: '还没有上传附件，不可以为付费状态',
			    icon: 'none'
			});
			return;
		}
		if(that.pay_content_obj.is_img == 1 && image_urls.length <= 0){
			uni.showToast({
			    title: '还没有上传图片，不可以为付费状态',
			    icon: 'none'
			});
			return;
		}
		if(that.pay_content_obj.is_video == 1 && !video_url){
			uni.showToast({
			    title: '还没有上传视频，不可以设置付费状态',
			    icon: 'none'
			});
			return;
		}
	}

    if (textinput == '' && imagetext_content == '') {
        uni.showToast({
            title: '还没有说点什么呢',
            icon: 'none'
        });
        return;
    }

	if(refer_id && refer_id > 0){

	}else{
		if(that.$store.state.config.page.create.circle_require == 1){
			if (circle_id == '' || circle_id == undefined) {
			    uni.showToast({
			        title: '请选择一个圈子再发布吧',
			        icon: 'none'
			    });
			    return;
			}
		}
	}
	uni.wen.util.doVibrateShort();
	
    uni.loading(true);
    uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'post/add',
        {
			editer: editer,
			imagetext_content: imagetext_content,
            posts_content: textinput,
			posts_title: posts_title,
            circle_id: circle_id,
            tags: tags,
            goods: goods,
            address: location,
            image_urls: image_urls,
            video_url: video_url,
            video_thumb_url: video_thumb_url,
            video_height: video_height,
            video_width: video_width,
			vote_list: vote_list,
			file_list: file_list,
			sounds_list: sounds_list,
			pay_obj: pay_obj,
			refer_id: refer_id,
			contact_phone: contact_phone,
			sph_video_feed_token: sph_video_feed_token,
			sph_image_urls: sph_image_urls,
			useds: selectUseds,
			bureaus: selectBureaus
        },
        'POST'
    ).then(function (res) {
        uni.loading(false);
        if (res.code == 200) {
			
			that.$store.commit('Ipushlished', true);
			
			if(refer_id && refer_id > 0){
				that.openReferPopup(false);
				uni.showToast({
					title: '转发成功',
					icon: 'none'
				});
				return false;
			}else{
				uni.removeStorage({
					key: 'releaseDraft'
				});
				that.draftShow = false;
				
				uni.removeStorage({
					key: 'userSelectedTags'
				})
				uni.removeStorage({
					key: 'postsGoods'
				})
				uni.removeStorage({
					key: 'userSelectedCircle'
				})


				//  模板消息
				// #ifdef MP-WEIXIN
				if(res.data.tmplIds && res.data.tmplIds.length > 0){
					wx.requestSubscribeMessage({
						tmplIds: res.data.tmplIds,
						success (res) {
							uni.wen.util.log(res);
							setTimeout(function(){
								uni.wen.toUrl(-2, 0, that);
							}, 300);
						},
						fail(err) {
							uni.showToast({
								title: '已拒绝接受订阅消息',
								icon: 'none'
							});
							uni.wen.util.log(err);
							setTimeout(function(){
								uni.wen.toUrl(-2, 0, that);
							}, 300);
						}
					});
					return false;
				}
				// #endif
				uni.showModal({
				    title: '发布成功',
				    content: res.data.tip,
				    showCancel: false,
				    confirmText: '朕知道了',
				    confirmColor: that.primaryColor,
				    success(res) {
						uni.wen.toUrl(-2, 0, that);
				    }
				});
			}
        } else if(res.code == 200016) {
            uni.showModal({
                title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
                content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿发布违规内容',
                showCancel: false,
                confirmText: '朕知道了',
                confirmColor: that.primaryColor
            });
			return false;
        }else if( res.code == 200041 ){
			uni.showModal({
			    title: '默认昵称不能发布内容',
			    content: '为了您在社区的信誉，请勿以"微信用户","普通用户"'+ (that.$store.state.config.user?.default_user_name.length > 0 ? ',"'+that.$store.state.config.user?.default_user_name+'"' : '') +'开头',
			    showCancel: true,
			    confirmText: '修改昵称',
			    confirmColor: that.primaryColor,

			    success(res) {
			        if (res.confirm){
						that.draftShow = false;
						that.saveDraft();
						uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', that);
					}
			    }
			});
			return false;
		}else if(res.code == 200011){
				// #ifdef H5
				uni.showToast({
					title: uni.$store.state.config.app.coins.name + '不足！',
					icon: 'none'
				});
				return;
				// #endif
				if(that.$store.state.config.pays.paycode_14){
					let every_coin = 0;
					if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.reward){
						// #ifdef MP
						every_coin = that.$store.state.config.app.coins.reward.mp.every;
						// #endif
						// #ifndef MP
						every_coin = that.$store.state.config.app.coins.reward.uni.every;
						// #endif
					}
					if(every_coin && every_coin > 0){
						uni.showModal({
							title:  uni.$store.state.config.app.coins.name + '不足！',
							content: '观看激励视频可获得' + every_coin + uni.$store.state.config.app.coins.name + '/次，是否观看？',
							confirmText: "获取",
							cancelText: "算了",
							success: function(res) {
								if (res.confirm) {
									uni.wen.toUrl(6, '/pagesA/mine/earnings/inspire', that);
								} else if (res.cancel) {

								}
							}
						});
					}else{
						uni.showToast({
							title: uni.$store.state.config.app.coins.name + '不足！',
							icon: 'none'
						});
					}
				}else{
					uni.showToast({
						title: uni.$store.state.config.app.coins.name + '不足！',
						icon: 'none'
					});
				}
			}else if(res.code == 200012){
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 1500
				});
				that.draftShow = false;
				that.saveDraft();
				setTimeout(function(){
					uni.wen.toUrl(6, "/pagesA/mine/earnings/recharge", that);
				}, 1000);

			}else {
				if(res.message && res.message.length > 0){
					uni.showModal({
						title: '发布失败',
						content: res.message,
						showCancel: false,
						confirmText: '朕知道了',
						confirmColor: that.primaryColor
					});
				}
        }
    });
};


// 分享笔记方法
const tapShare = function(obj) {
	let that = this;
	that.postsIndex = obj.index;
	that.showSharePopup = Date.now();
	that.postsId = obj.post_id;
	return false;
};

const tapCollect = function(obj){
	let that = this;
	uni.wen.util.doVibrateShort();
	
	let posts = that.posts;
	
	for ( let i = 0; i < posts.length; i ++ ) {
		if(posts[i].id == obj.post_id ){
	
			if (posts[i].is_collect) {
				posts[i].collected_count -= 1;
			} else {
				posts[i].collected_count += 1;
			}
			posts[i].is_collect = !posts[i].is_collect;
			
			break;
		}
	}
	
	that.posts = posts;
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/collect', {
			posts_id: obj.post_id
		},
		'POST'
	).then(function(res) {
		uni.loading(false);
		if (res.status) {
			
		}else{
			let posts = that.posts;
			
			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == obj.post_id ){
			
					if (posts[i].is_collect) {
						posts[i].collected_count += 1;
					} else {
						posts[i].collected_count -= 1;
					}
					posts[i].is_collect = !posts[i].is_collect;
					
					break;
				}
			}
			
			that.posts = posts;
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};


// 笔记喜欢接口
const taplikes = function(obj) {
	let that = this;
	uni.wen.util.doVibrateShort();
	
	let posts = that.posts;
	
	for (let index = 0; index < posts.length; index ++) {
	    if (posts[index].id == obj.post_id) {
			if (posts[index].is_like) {
				posts[index].like_count -= 1;
			} else {
				posts[index].like_count += 1;
			}
			
			posts[index].is_like = !posts[index].is_like;
			break;
	    }
	}

	that.posts = posts;
	
	
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/like', {
			posts_id: obj.post_id
		},
		'POST'
	).then(function(res) {
		uni.loading(false);
		if (res.status) {

		}else{
			
			let posts = that.posts;
			
			for (let index = 0; index < posts.length; index ++) {
			    if (posts[index].id == obj.post_id) {
					if (posts[index].is_like) {
						posts[index].like_count += 1;
					} else {
						posts[index].like_count -= 1;
					}
					
					posts[index].is_like = !posts[index].is_like;
					break;
			    }
			}
			
			that.posts = posts;
			
		}
	});
};

// 展开更多
const unfoldTap = function (postIndex) {
  let that = this;
  let posts = that.posts;
  posts[postIndex].is_content_beyond = false;

  that.posts = posts;
}

const soundsPlayCall = function(post_id){
	let that = this;
	let needFresh = false;
	for (let index = 0; index < that.posts.length; index ++) {
	    if (that.posts[index].id != post_id) {
			if( that.posts[index].sounds && that.posts[index].sounds.length > 0 ){
				for( let s_index = 0; s_index < that.posts[index].sounds.length; s_index++ ){
					if (that.posts[index].sounds[s_index]['innerAudioContext']) {
					  that.posts[index].sounds[s_index]['isPlay'] = false;
					  that.posts[index].sounds[s_index]['innerAudioContext'].pause();
					  needFresh = true;
					}
				}
			}
	    }
	}

	if(needFresh){
		that.$forceUpdate();
	}
}

const payPost = function(){
	let that = this;
	let posts = that.posts;
	if(posts[that.postsIndex].pay_obj.pay_type == 1){
		let paywaylist = [0];
		if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.pay == true){
			paywaylist.push(3)
		}
		that.shutPayContent();
		let price = posts[that.postsIndex].pay_obj.price;
		if(that.$store.state.config.app.vip.discount > 0 && that.$store.state.userInfo.is_member){
			price = (price * ((100 - that.$store.state.config.app.vip.discount) / 100)).toFixed(2);
		}
		that.myToast({
			type:'payway',
			content: '购买付费',
			price: price,
			isVipPrice: that.$store.state.userInfo.is_member,
			timeout: 2000,
			isClick:true,
			paywaylist: paywaylist,
			order: {
				type: 4,
				post_id: that.postsId,
				scene: that.$store.state.scene,
				postsIndex: that.postsIndex
			}
		});
	}else{
		uni.loading(true);
		uni.wen.util.request(
			uni.wen.api.ApiRootUrl + 'posts/pay', {
				post_id: that.postsId,
				scene: that.$store.state.scene
			},
			'POST'
		).then(function(res) {
			uni.loading(false);
			uni.$store.commit('popopChange', false);
			that.payContentPopup = false;
			if (res.code == 200) {
				let posts = that.posts;
				posts[that.postsIndex] = res.data[0];
				that.posts = posts;
				
				if(that.$store.state.scene == 9){
					that.imgItem.is_pay = 0;
				}
				
				setTimeout(function(){
					uni.showToast({
						title: '购买成功',
						icon: 'none',
						duration: 1500
					});
				}, 500);

			}else if(res.code == 200011){
				// #ifdef H5
				uni.showToast({
					title: uni.$store.state.config.app.coins.name + '不足！',
					icon: 'none'
				});
				return;
				// #endif
				if(that.$store.state.config.pays.paycode_14){
					let every_coin = 0;
					if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.reward){
						// #ifdef MP
						every_coin = that.$store.state.config.app.coins.reward.mp.every;
						// #endif
						// #ifndef MP
						every_coin = that.$store.state.config.app.coins.reward.uni.every;
						// #endif
					}
					if(every_coin && every_coin > 0){
						uni.showModal({
							title:  uni.$store.state.config.app.coins.name + '不足！',
							content: '观看激励视频可获得' + every_coin + uni.$store.state.config.app.coins.name + '/次，是否观看？',
							confirmText: "获取",
							cancelText: "算了",
							success: function(res) {
								if (res.confirm) {
									uni.wen.toUrl(6, '/pagesA/mine/earnings/inspire', null);
								} else if (res.cancel) {

								}
							}
						});
					}else{
						uni.showToast({
							title: uni.$store.state.config.app.coins.name + '不足！',
							icon: 'none'
						});
					}
				}else{
					uni.showToast({
						title: uni.$store.state.config.app.coins.name + '不足！',
						icon: 'none'
					});
				}
			}else if(res.code == 200012){
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 1500
				});
				setTimeout(function(){
					uni.wen.toUrl(6, "/pagesA/mine/earnings/recharge", null);
				}, 1000);

			}else {
				uni.showToast({
					title: res.message,
					icon: 'none',
					duration: 1500
				});
			}

		});
	}
}

const showPayContent = function(postIndex){
	let that = this;
	let vip_price = -1;
	let price =  that.posts[postIndex].pay_obj.price;
	if(that.$store.state.config.app.vip.discount > 0 && that.$store.state.userInfo.is_member){
		if(that.posts[postIndex].pay_obj.pay_type == 1){
			vip_price = (price * ((100 - that.$store.state.config.app.vip.discount) / 100)).toFixed(2);
		}else{
			vip_price = Math.floor(price * ((100 - that.$store.state.config.app.vip.discount) / 100));
		}
	}
	let payContentObj = {
		"price": that.posts[postIndex].pay_obj.price,
		"pay_type": that.posts[postIndex].pay_obj.pay_type,
		"credit": that.posts[postIndex].pay_obj.credit,
		"rest": (100 - that.posts[postIndex].pay_obj.words_percent),
		"has_hidden": that.posts[postIndex].pay_obj.has_hidden,
		"has_file": that.posts[postIndex].pay_obj.has_file,
		"has_img": that.posts[postIndex].pay_obj.has_img,
		"has_video": that.posts[postIndex].pay_obj.has_video,
		"vip_price": vip_price
	}

	that.payContentPopup = !that.payContentPopup,
	that.postsId = that.posts[postIndex].id,
	that.postsUserId = that.posts[postIndex].user_id,
	that.postsIndex = postIndex,
	that.payContentObj = payContentObj
	
	uni.$store.commit('popopChange', true);

	if(payContentObj.pay_type == 0){
		let flag = false;
		if(that.$store.state.userInfo.coins){
			if(that.$store.state.userInfo.is_member){
				if(that.$store.state.userInfo.coins < payContentObj.vip_price){
					flag = true;
				}
			}else{
				if(that.$store.state.userInfo.coins < payContentObj.price){
					flag = true;
				}
			}

		}
		if(flag){
			// #ifdef H5
			return;
			// #endif
			if(that.$store.state.config.pays.paycode_14){
				let every_coin = 0;
				if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.reward){
					// #ifdef MP
					every_coin = that.$store.state.config.app.coins.reward.mp.every;
					// #endif
					// #ifndef MP
					every_coin = that.$store.state.config.app.coins.reward.uni.every;
					// #endif
				}
				if(every_coin && every_coin > 0){
					uni.showModal({
						title: uni.$store.state.config.app.coins.name + '不足！',
						content: '观看激励视频可获得' + every_coin + uni.$store.state.config.app.coins.name + '/次，是否观看？',
						confirmText: "获取",
						cancelText: "算了",
						success: function(res) {
							if (res.confirm) {
								uni.wen.toUrl(6, '/pagesA/mine/earnings/inspire', null);
							} else if (res.cancel) {

							}
						}
					});
				}
			}
		}

	}
};

//打开评论菜单
const tapComments = function(obj) {
	uni.$store.commit('popopChange', true);
	let that = this;
	let postsId = obj.post_id;
	let commentCount = obj.comment_count;
	
	that.showComments = !that.showComments,
	that.commentCount = commentCount,
	that.postsId = postsId,
	that.commentId = '',
	that.replyUserId = '',
	that.replyName = '说点什么...'
};

// 打开评论输入框
const tapComment = function(obj) {
	let that = this;
	let commentId = obj.commentId;
	let replyUserId = obj.replyUserId;
	let replyName = obj.replyName;

	if(commentId){
		if (typeof replyName != 'undefined' && commentId != 'undefined' && replyUserId != 'undefined') {
			replyName = '回复 ' + replyName + '：';
		}else{
			replyName = '说点什么...';
		}
	} else {
		replyName = '说点什么...';
		commentId = '';
		replyUserId = '';
	}
	that.commentId = commentId,
	that.replyUserId = replyUserId,
	that.replyName = replyName,
	that.commentFormShow = Date.now(),
	that.showComments = Date.now()
};

const tapReward = function(obj) {
	let that = this;
	
	that.rewardPopup = !that.rewardPopup,
	that.postsId = obj.post_id,
	that.postsUserId = obj.userid,
	that.postsIndex = obj.index,
	that.rewardPrice = '';
	
	uni.$store.commit('popopChange', true);
};

//充电弹窗
const tapGiveCoin = function(obj) {
	let that = this;
	
	that.postsId = obj.post_id;
	that.postsIndex = obj.index;
	
	let child = this.$unicom("#mytotast_" + that.$store.state.scene + '_' + that.$store.state.scene_id);
	if(child){
		child.open({
			type:'givecoin',
			content: '投币',
			timeout: 2000,
			isClick:true,
			mask: 9,
		});
		return false;
	}
};

//关闭充电弹窗
const shutReward = function() {
	let that = this;
	that.rewardPopup = !that.rewardPopup
	uni.$store.commit('popopChange', false);
};

const shutPayContent = function() {
	let that = this;
	that.payContentPopup = !that.payContentPopup;
	uni.$store.commit('popopChange', false);
};

const commentFormMaskClick = function(){
	let that = this;
	that.commentFormShow = 0;
}

const selectVote = function(obj){
	let that = this;
	let postIndex = obj.postIndex;
	let vote_id = obj.vote_id;
	let position = obj.position;
	uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/vote', {
		vote_id: vote_id, position: position
	}, 'POST').then(function(res) {
		if (res.status) {
			that.posts[postIndex].vote  = res.data;
			uni.showToast({
				title: '投票成功',
				icon: 'none',
				duration: 1500
			});
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

const onOpenExceptionalAccountCheck = function(){
	let that = this;

	var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
	let rewardPrice = that.rewardPrice;
	let postsId = that.postsId;
	let postsUserId = that.postsUserId;

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
	uni.$store.commit('popopChange', false);
	that.rewardPopup = false;

	let paywaylist = [0];
	if(that.$store.state.platform == 'ios' && that.$store.state.device == 'app'){
		paywaylist.push(1);
		paywaylist.push(2);
	}else{
		paywaylist.push(1);
		paywaylist.push(2);
	}

	if(that.$store.state.config.app.coins && that.$store.state.config.app.coins.pay == true){
		paywaylist.push(3)
	}
	that.myToast({
		type:'payway',
		content: '充电',
		price: rewardPrice,
		timeout: 2000,
		isClick:true,
		paywaylist: paywaylist,
		order: {
			type: 2,
			rewardPrice: rewardPrice,
			postsId: postsId,
			postsUserId: postsUserId
		}
	});
};

//关闭评论菜单
const toShutComments = function() {
	let that = this;
	that.showComments = !this.showComments;
	that.postsId = 0;
	that.commentFormShow = 0;
	that.commentId = '';
	that.replyUserId = '';
	that.replyName = '说点什么...';
	
	uni.$store.commit('popopChange', false);
};


//评论Input监听/发送评论
const onInputComment = function(data) {
	let that = this;
	uni.wen.util.doVibrateShort();

	uni.loading(true);

	var value = data.content;
	let imageValue = data.img;
	let giveCoin = data.giveCoin;
	let postsId = Math.abs(that.postsId);
	let commentId = that.commentId;
	let replyUserId = that.replyUserId;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'comment/add', {
			posts_id: postsId,
			comment_content: value,
			comment_img_url: imageValue,
			comment_id: commentId,
			reply_user_id: replyUserId,
			giveCoin: giveCoin
		},
		'POST'
	).then(function(res) {
		uni.loading(false);
		if (res.status) {

			let posts = that.posts;
			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == postsId ){
					if (posts[i].comment_count) {
						posts[i].comment_count += 1;
					} else {
						posts[i].comment_count = 1;
					}
					break;
				}
			}

			that.commentId = '';
			that.replyUserId = '';
			that.replyName = '说点什么...';
			that.commentFormShow = 0;
			that.postsId = (that.postsId * -1);
			that.posts = posts;
			that.commentCount = that.commentCount + 1;
			
			//  模板消息
			// #ifdef MP-WEIXIN
			if(res.data.tmplIds && res.data.tmplIds.length > 0){
				wx.requestSubscribeMessage({
					tmplIds: res.data.tmplIds,
					success (res1) {
						uni.showToast({
							title: res.data.tip,
							icon: 'none',
							duration: 1500,
						});
					},
					fail(err) {
						uni.showToast({
							title: '已拒绝接受订阅消息',
							icon: 'none'
						});
					}
				});
				return false;
			}
			// #endif
			
			uni.showToast({
				title: res.data.tip,
				icon: 'none',
				duration: 1500,
			});
			
		}else if(res.code == 200016) {
			uni.showModal({
					title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
					content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿发布违规内容',
					showCancel: false,
					confirmText: '朕知道了',
					confirmColor: that.primaryColor
				});
        }else if( res.code == 200041 ){
			uni.showModal({
			    title: '默认昵称不能发布内容',
			    content: '为了您在社区的信誉，请勿以"微信用户","普通用户"'+ (that.$store.state.config.user?.default_user_name.length > 0 ? ',"'+that.$store.state.config.user?.default_user_name+'"' : '') +'开头',
			    showCancel: true,
			    confirmText: '修改昵称',
			    confirmColor: that.primaryColor,
			    success(res) {
			        if (res.confirm){
						uni.wen.toUrl(6, '/pagesA/mine/editmine/editmine', null);
					}
			    }
			});
			return false;
		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
	});
};

 //充电列表弹窗
const onClickReward = function(e) {
	let that = this;
	let postsId = e.currentTarget.dataset.id;
	let exceptionalCount = e.currentTarget.dataset.ecount;

	if (typeof postsId != 'undefined' && exceptionalCount != 'undefined') {
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/getExceptionalList', {
			posts_id: postsId
		}).then(function(res) {
			that.exceptionalList = res.data;
			that.exceptionalCount = exceptionalCount;
		});
	}

	that.rewardDialog = !that.rewardDialog;
	uni.$store.commit('popopChange', false);
};

//充电选择金额
const addRewardPrice = function(e) {
	let that = this;
	that.rewardPrice = e.currentTarget.dataset.price;
};

//充电输入金额
const rewardPriceChange = function(e) {
	let that = this;
	if(that.global__platform__ == 'ios'){
		uni.showToast({
			title: '抱歉，根据IOS平台相关规范，充电功能不允许自定义金额！',
			icon: 'none'
		})
	}else{
		that.rewardPrice = e.detail.value;
	}
};

const editOrBlurTap = function(postsId){
	let that = this;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/blur', {
			posts_id: postsId
		},
		'POST'
	).then(function(res) {
		if (res.status) {

			let posts = that.posts;

			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == postsId ){
					posts[i].is_blur = !posts[i].is_blur;
					break;
				}
			}

			that.posts = posts;
			that.showDialog = !that.showDialog;


			if (that.isBlur) {
				uni.showToast({
					title: '已取消图片不适',
					icon: 'none',
					duration: 1500
				});
			}else{
				uni.showToast({
					title: '已设置为图片不适',
					icon: 'none',
					duration: 1500
				});
			}

		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
		uni.$store.commit('popopChange', false);
	});
}

const postFeedback = function(obj) {
	let that = this;
	if(obj.action == 'sticky'){
		that.editOrStickyTap(obj.posts_id, obj.scene);
	}else if(obj.action == 'move'){
		uni.wen.toUrl(6, '/pages/circleClass/circleClass?post_id=' + obj.posts_id, null);
	}else if(obj.action == 'examine'){
		that.editOrExamineTap(obj.posts_id);
	}else if(obj.action == 'blur'){
		that.editOrBlurTap(obj.posts_id);
	}else if(obj.action == 'delete'){
		that.editOrDeleteTap(obj.posts_id);
	}else if(obj.action == 'report-0'){
		uni.loading(true);
		uni.wen.util.request(
			uni.wen.api.ApiRootUrl + 'user/report', {
				type: 0,
				object_id: obj.posts_id,
				report_type: obj.report_type,
				report_content: '',
				image_urls: [],
				contact: ''
			},
			'POST'
		).then(function(res) {
			uni.loading(false);
			if(res.status){
				uni.showToast({
					title: '举报成功！感谢您的监督',
					icon: 'none'
				});
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
			}
		});
	}else if(obj.action == 'feedback-notlike-1' || obj.action == 'feedback-notlike-2'){
		let type = 1;
		if(obj.action == 'feedback-notlike-2'){
			type = 2;
		}
		uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/feedback', {
			posts_id: obj.posts_id,
			type: type
		}, 'POST').then(function(res) {
			uni.loading(false);
			if(res.status){
				uni.showToast({
					title: res.message,
					icon: 'none'
				});
				// 不喜欢该笔记
				if(type == 1){
					if(res.code == 200010){
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}else{
						if(that.posts){
							for ( let i = 0; i < that.posts.length; i ++ ) {
								if(that.posts[i].id == obj.posts_id ){
									that.posts.splice(i, 1);
									break;
								}
							}
							
							if(that.$refs && that.$refs.productwater && that.$refs.productwater.delete){
								that.$refs.productwater.delete(obj.posts_id);
							}
							
						}
					}
				}else if(type == 2){
					if(res.code == 200010){
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}else{
						// 不喜欢该用户
						if(that.posts){
							let indexesToRemove = [];
							for ( let i = 0; i < that.posts.length; i ++ ) {
								if(that.posts[i].user_id == res.data.post_user_id ){
									indexesToRemove.push(i);
								}
							}
							let newPosts = that.posts.filter((element, index) => {
							  return !indexesToRemove.includes(index);
							});
							that.posts = newPosts;
							
							if(that.$refs && that.$refs.productwater && that.$refs.productwater.delete_from_auth){
								that.$refs.productwater.delete_from_auth(res.data.post_user_id);
							}
							
						}
					}
				}
				if(that.$store.state.scene == 9 && that.posts[0].id == obj.posts_id){
					uni.wen.toUrl(-2, '');
				}
			}else{
				uni.showToast({
					title: res.message,
					icon: 'none'
				})
			}

		});
	}

}

const editOrExamineTap = function(postsId){
	let that = this;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/examine', {
			posts_id: postsId
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			let posts = that.posts;

			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == postsId ){
					if(posts[i].is_examine == 1){
						posts[i].is_examine = 2;
					}else{
						posts[i].is_examine = 1;
					}
					break;
				}
			}

			that.posts = posts;
			that.showDialog = !that.showDialog;


			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});

		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
		uni.$store.commit('popopChange', false);
	});
}

//显示删除菜单
const editOrDeleteTap = function(postsId) {
	let that = this;
	that.showDialog = !that.showDialog;
	that.bounced = !that.bounced;
	that.postsId = postsId;
	uni.$store.commit('popopChange', true);
};

//取消删除
const bouncedTap = function() {
	let that = this;
	that.bounced = !that.bounced;
	uni.$store.commit('popopChange', false);
};

const editOrStickyTap = function(postsId, scene){
	let that = this;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/sticky', {
			scene: scene,
			posts_id: postsId
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			let posts = that.posts;

			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == postsId ){
					posts[i].is_sticky = !posts[i].is_sticky;
					break;
				}
			}

			that.posts = posts;
			that.showDialog = !that.showDialog;
			
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});

		}else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
		uni.$store.commit('popopChange', false);
	});
};

// 删除笔记接口
const bouncedDeleteTap = function() {
	let that = this;
	uni.wen.util.request(
		uni.wen.api.ApiRootUrl + 'posts/delete', {
			posts_id: that.postsId
		},
		'POST'
	).then(function(res) {
		if (res.status) {
			
			let posts = that.posts;
			let postsIndex = 0;

			for ( let i = 0; i < posts.length; i ++ ) {
				if(posts[i].id == that.postsId ){
					postsIndex = i;
					break;
				}
			}
			posts.splice([postsIndex], 1);

			that.posts = posts;
			that.bounced = !that.bounced;
			
			if(that.$refs && that.$refs.productwater && that.$refs.productwater.delete){
				that.$refs.productwater.delete(that.postsId);
			}

			uni.showToast({
				title: res.message,
				icon: 'none'
			})

			setTimeout(function(){
				if(that.$store.state.scene == 9){
					uni.wen.toUrl(-2, 0, null);
				}
			}, 300);

		}else{
			uni.showToast({
				title: res.message,
				icon: 'none'
			})
		}
		uni.$store.commit('popopChange', false);
	});
};




module.exports = function (obj) {
    obj.getTagList = getTagList;
    obj.getAddTagList = getAddTagList;
    obj.creatForums = creatForums;
	obj.tapShare = tapShare;
	obj.tapCollect = tapCollect;
	obj.taplikes = taplikes;
	obj.unfoldTap = unfoldTap;
	obj.soundsPlayCall = soundsPlayCall;
	obj.payPost = payPost;
	obj.showPayContent = showPayContent;
	obj.tapComments = tapComments;
	obj.tapComment = tapComment;
	obj.tapReward = tapReward;
	obj.tapGiveCoin = tapGiveCoin;
	obj.shutReward = shutReward;
	obj.shutPayContent = shutPayContent;
	obj.commentFormMaskClick = commentFormMaskClick;
	obj.selectVote = selectVote;
	obj.onOpenExceptionalAccountCheck = onOpenExceptionalAccountCheck;
	obj.toShutComments = toShutComments;
	obj.onInputComment = onInputComment;
	obj.onClickReward = onClickReward;
	obj.rewardPriceChange = rewardPriceChange;
	obj.addRewardPrice = addRewardPrice;
	obj.postFeedback = postFeedback;
	obj.editOrBlurTap = editOrBlurTap;
	obj.editOrStickyTap = editOrStickyTap;
	obj.editOrExamineTap = editOrExamineTap;
	obj.editOrDeleteTap = editOrDeleteTap;
	obj.bouncedTap = bouncedTap;
	obj.bouncedDeleteTap = bouncedDeleteTap;
};
