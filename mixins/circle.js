

/**
 * 创建/修改圈子
 */

const creatCircle = function () {
    let that = this;

    if (that.imageAvatar == null) {
        uni.showToast({
            title: '请上传圈子头像',
            icon: 'none'
        });
        return;
    }

    if (that.imageSubject == null) {
        uni.showToast({
            title: '请上传圈子封面',
            icon: 'none'
        });
        return;
    }

    if (that.circleName == '') {
        uni.showToast({
            title: '请输入圈子名称',
            icon: 'none'
        });
        return;
    }

    if (that.circleDesc == '') {
        uni.showToast({
            title: '请输入圈子简介',
            icon: 'none'
        });
        return;
    }

    if (!that.protocolChecked) {
        uni.showToast({
            title: '请阅读并同意圈主协议',
            icon: 'none'
        });
        return;
    }

    uni.loading(true);
    let datas = {
        id: that.id,
        circle_name: that.circleName,
        circle_introduce: that.circleDesc,
        head_portrait: that.imageAvatar,
        background_maps: that.imageSubject,
        plate_id: that.parent
    };
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/add/circle', datas, 'POST').then(function (res) {
		uni.loading(false);
		if(res.code == 200) {
			uni.showModal({
			    title: '提交成功',
			    content: '审帖员会在24小时内为您处理，请您耐心等待！',
			    showCancel: false,
			    confirmText: '朕知道了',
			    confirmColor: '#333333',
			
			    success(res) {
			        uni.wen.toUrl(-2, 0, null);
			    }
			});
		}else if(res.code == 200016) {
			uni.showModal({
				title: res.data.tip[0] ? res.data.tip[0] : '存在违禁词',
				content: res.data.hit_word ? res.data.hit_word.join(' ') : '请勿设置违规内容',
				showCancel: false,
				confirmText: '朕知道了',
				confirmColor: that.primaryColor
			});			
		} else {
			uni.showModal({
				title: '提交失败',
				content: res.message,
				showCancel: false,
				confirmText: '朕知道了',
				confirmColor: that.primaryColor
			});
		}
    });
};
/**
 * 获取分区列表
 */

const getPlateList = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/plate/list').then(function (res) {
        let args = {};
        args.cats = that.cats.concat(res.data);
        that.setData(args);
    });
};
/**
 * 通过分区ID获取圈子列表
 */

const circleByplateid = function (id) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/circle/byplateid', {
        plate_id: id
    }).then(function (res) {
        let args = {};
        args.subcats = res.data;
        args.subcatsloading = false;
        that.setData(args);
    });
};
/**
 * 搜索圈子
 */

const circleSearch = function (keyword) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/circle/search', {
        keyword: keyword
    }).then(function (res) {
        let args = {};
        args.keywordSubcats = res.data.data;
        args.keywordSubcatsloading = false;
        that.setData(args);
    });
};
/**
 * 推荐圈子4
 */

const circleRecommend = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/recommend').then(function (res) {
        let args = {};
        args.toplist = res.data;
        args.topload = false;
        that.setData(args);
    });
};
/**
 * 最新圈子
 */

const circleNot = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/hot').then(function (res) {
        let args = {};
        args.notlist = res.data;
        args.hotload = false;
        that.setData(args);
    });
};
/**
 * 全部圈子
 */

const circleCircleAndPosts = function (page) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/circleAndPosts', {
        page: page
    }).then(function (res) {
        let data = res.data.data;
        let args = {};
		
		if(res.data.current_page != page){
			return false;
		}

        if (data.length == 0) {
            args.isLastPage = true;
        } else {
            args.subcats = that.subcats.concat(data);
            args.page = res.data.current_page;
            args.subcatsloading = false;
            args.loadmoreShow = false;
        }

        that.setData(args);
    });
};
/**
 * 用户关注圈子
 */

const userFollowCircleList = function (page) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/follow/CircleList', {
        page: page
    }).then(function (res) {
        let data = res.data.data;
        let args = {};
		
		if(res.data.current_page != page){
			return false;
		}

        if (data.length == 0) {
            args.isLastPage = true;

            if (page == 1) {
                args.subcatsloading = false;
            }
        } else {
            if (data.length < 10) {
                args.isMore = true;
            }

            args.uSubcats = that.uSubcats.concat(data);
            args.uPage = res.data.current_page;
            args.subcatsloading = false;
            args.loadmoreShow = false;
        }

        that.setData(args);
    });
};

/**
 * 取消关注/关注圈子
 */

const quitCircle = function (e) {
    let that = this;
	
	uni.wen.util.doVibrateShort();
	let cid = e.currentTarget.dataset.id;
	let way = e.currentTarget.dataset.way;
	
    uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'user/follow/circle',
        {
            circle_id: cid,
			way: way,
        },
        'POST'
    ).then(function (res) {
		uni.loading(false);
        if (res.status) {
			if(way == 'follow-pay'){
				let circleInfo = that.circleInfo;
				circleInfo.is_follow_circle = true;
				that.setData({
				    circleInfo: circleInfo,
					visitUnlockPopup: false
				});
				uni.showToast({
				    title: '恭喜，圈子加入成功',
				    icon: 'none',
				    duration: 1500
				});
			}else{
				let circleInfo = that.circleInfo;
				circleInfo.is_follow_circle = !circleInfo.is_follow_circle;
				that.setData({
				    circleInfo: circleInfo
				});
				
				if (circleInfo.is_follow_circle) {
				    uni.showToast({
				        title: '圈子加入成功',
				        icon: 'none',
				        duration: 1500
				    });
				} else {
				    uni.showToast({
				        title: '已退出该圈',
				        icon: 'none',
				        duration: 1500
				    });
				}
			}
            
        }else{
			uni.showToast({
				title: res.message,
				icon: 'none',
				duration: 1500
			});
		}
    });
};
/**
 * 圈子笔记
 */

const postsByCircleId = function (id, type, page, waterClean) {
    let that = this;
	if(waterClean){
		that.setData({
			topicload: true,
		});
		that.setData({
			postWaterData: {
				e: 1,
				data: []
			}
		})
	}
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/byCircleId', {
        circle_id: id,
        type: type,
        page: page,
		sort: that.sort,
		tags: that.selected_tag > 0 ? '['+ that.selected_tag +']' : null
    }).then(function (res) {
        if (res.code === 200) {
            let data = res.data;
            let args = {};
			
			if(res.data.current_page != page){
				return false;
			}

            if (data.data.length <= 0 && page == 1) {
                args.isNul = true;
            }

            if (data.data.length == 0) {
                args.isLastPage = true;
            } else if (type == 0) {
                args.comPostsList = that.comPostsList.concat(data.data);
                args.comPostsPage = data.current_page;
            } else if (type == 1) {
                args.postsList = that.postsList.concat(data.data);
                args.postsPage = data.current_page;
            } else if (type == 2) {
                args.newPostsList = that.newPostsList.concat(data.data);
                args.newPostsPage = data.current_page;
            } else if (type == 3) {
                args.auditPostsList = that.auditPostsList.concat(data.data);
                args.auditPostsPage = data.current_page;
            }

            args.posts = that.posts.concat(data.data);

            args.topicload = false;
            that.setData(args);
			
			if(that.$store.state.scene == 6){
				if(that.visitUnlockPopup){
					that.setData({
						postWaterData: {
							e: 1,
							data: data.data
						}
					});
				}else{
					if(data.data && data.data.length > 0 && that.circle_list_waterfall){
						that.setData({
							postWaterData: {
								e: waterClean ? 1 : 0,
								data: data.data
							}
						});
					}
				}
			}
        }
    });
};
/**
 * 审核笔记
 */

const userAuditPosts = function () {
    let that = this;
    let isPosts = that.isPosts;
    let postsId = that.postsId;
    let postsIndex = that.postsIndex;
    let reject_msg = that.reject_msg;
    uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'user/auditPosts',
        {
            id: postsId,
            type: isPosts,
            reject_msg: reject_msg
        },
        'POST'
    ).then(function (res) {
		uni.loading(false);
        if (res.status) {
            let args = {};
            let posts = that.posts;
            posts.splice([postsIndex], 1);
            args.posts = posts;
            args.showDialog = false;
            args.isRejected = false;
            that.setData(args);
            uni.showToast({
                title: '操作成功！',
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
};
/**
 * 圈子详情(修改用)
 */

const editorCircleInfo = function (id) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/info', {
        circle_id: id
    }).then(function (res) {
        let cats = that.cats;
        let args = {};
        args.id = res.data.id;
        args.imageAvatar = res.data.head_portrait;
        args.imageSubject = res.data.background_maps;
        args.circleName = res.data.circle_name;
        args.circleDesc = res.data.circle_introduce;
        args.nameLength = res.data.circle_name.length;
        args.descLength = res.data.circle_introduce.length;
        args.parent = res.data.plate_id;

        for (let v in cats) {
            if (cats[v].id == res.data.plate_id) {
                args.index = v;
            }
        }

        that.setData(args);
    });
};
/**
 * 获取分区列表建圈用
 */

const getCircleUserList = function (cid) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'circle/getCircleUserList', {
        circle_id: cid
    }).then(function (res) {
		uni.loading(false);
        if (res.status) {
            let args = {};
            args.circleUser = res.data;
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

module.exports = function (obj) {
    obj.getCircleUserList = getCircleUserList;
    obj.creatCircle = creatCircle;
    obj.getPlateList = getPlateList;
    obj.circleByplateid = circleByplateid;
    obj.circleSearch = circleSearch;
    obj.circleRecommend = circleRecommend;
    obj.circleNot = circleNot;
    obj.circleCircleAndPosts = circleCircleAndPosts;
    obj.userFollowCircleList = userFollowCircleList;
    obj.quitCircle = quitCircle;
    obj.postsByCircleId = postsByCircleId;
    obj.userAuditPosts = userAuditPosts;
    obj.editorCircleInfo = editorCircleInfo;
};
