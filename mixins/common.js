const forceUpdate = function () {
    this.$forceUpdate();
}

/**
 * 查询用户是否有未读信息
 */
const getSysMessageCount = function () {
    return new Promise(function (resolve, reject) {
        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/getSysMessageCount').then(function (res) {
			// #ifdef APP
			plus.runtime.setBadgeNumber(res.data);
			// #endif
            resolve(res.data);
        });
    });
}; // 选择图片去剪裁

const imageClipper = function (type) {
    let that = this;
	
	let _imageClipper = function(type, sourceType){
		uni.chooseImage({
		    count: 1,
		    sourceType: [sourceType],
		    sizeType: ['original'],
		
		    success(res) {
		        const tempFilePaths = res.tempFilePaths;
		        that[type] = true;
		        that.pic = tempFilePaths[0];
		    }
		});
	}
	
	uni.showActionSheet({
		itemList: ['拍摄', '从相册选择'],
		success: function (res) {
			
			// #ifdef MP
			_imageClipper(type, res.tapIndex === 1 ? 'album' : 'camera')
			// #endif
			
			// #ifdef APP
			uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于您的资料完善，申请圈子等场景' : '[摄像头权限]获取您此刻所拍的照片，用于您的资料完善，申请圈子等场景', () => {
				_imageClipper(type,  res.tapIndex === 1 ? 'album' : 'camera')
			}, that);
			// #endif
			
			// #ifdef H5
			_imageClipper(type,  res.tapIndex === 1 ? 'album' : 'camera')
			// #endif

		},
		fail: function (res) {
			console.log(res.errMsg);
		}
	});
	
}; // 上传图片（剪裁后的）

const uploadPicturesPic = function (url, name, type, scene) {
    let that = this;
    return new Promise(function (resolve, reject) {
        uni.loading(true);
        uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', url, scene).then(function (res) {
            uni.loading(false);
            if (res.status) {
                var list = {
                    [name]: res.data,
                    [type]: false,
                    imagesubjectClipper: false
                };
                that[name] = res.data
                that[type] = false
                that.imagesubjectClipper = false;
                resolve(res)
            } else {
                uni.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 1500
                });
            }
            reject(res)
        });
    });

}; // 上传文件

const uploadPictures = function (type, name, count = 1) {
    let that = this;
	
	let uploadPictures_ = function(sourceType, type, name, count = 1){
		if (type === 1) {
		    uni.chooseImage({
		        count: count,
		        sourceType: [sourceType],
		        sizeType: ['original'],
		
		        success(res) {
		            uni.loading(true);
		            const tempFilePaths = res.tempFilePaths;
		            uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 3).then(function (res) {
		                uni.loading(false);
		                if (res.status) {
		                    that[name] = res.data
		                } else {
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
		} else if (type === 2) {
		    uni.chooseImage({
		        count: count, //name
		        sourceType: [sourceType],
		        sizeType: ['original'],
		        success(res) {
		            uni.loading(true);
		            const tempFilePaths = res.tempFilePaths;
		
		
		            for (let i in tempFilePaths) {
		                uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[i], 3).then(function (res) {
		                    uni.loading(false);
		                    if (res.status) {
		                        var image_urls = that.image_urls;
		                        var images = {};
		                        images.url = res.data;
		                        image_urls.push(images);
		                        that.image_urls = image_urls;
		                    } else {
		                        uni.showToast({
		                            title: res.message,
		                            icon: 'none',
		                            duration: 1500
		                        });
		                    }
		                });
		            }
		        },
		
		        fail(err) {
		
		        }
		    });
		} else if (type === 3) {
		
		    // #ifdef MP
		
		    uni.chooseMedia({
		        mediaType: ['video'],
		        sourceType: [sourceType],
		        maxDuration: 60,
		        camera: 'back',
		
		        success(res) {
		            uni.loading(true);
		            let tempFiles = res.tempFiles[0];
		
		            that.video_height = tempFiles.height,
		                that.video_width = tempFiles.width
		
		            let thumbTempFilePath = tempFiles.thumbTempFilePath;
		            uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFiles.tempFilePath, 3).then(function (res) {
		                uni.loading(false);
		                if (res.status) {
		                    var list = {
		                        [name]: res.data,
		                    };
		                    that[name] = res.data
		
		                    uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', thumbTempFilePath, 3).then(function (data) {
		                        that.video_thumb_url = data.data;
		                    });
		
		                } else {
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
		    // #endif
		
		    // #ifndef MP
		    uni.chooseVideo({
		        mediaType: ['video'],
		        sourceType: [sourceType],
		        maxDuration: 60,
		        compressed: that.$store.state.config.page.create.video_press == 1,
		        camera: 'back',
		        success: function (res) {
		            // self.src = res.tempFilePath;
		            uni.loading(true);
		            let tempFilePath = res.tempFilePath;
		            that.video_height = res.height;
		            that.video_width = res.width;
		            // let thumbTempFilePath = tempFiles.thumbTempFilePath;
		            uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePath, 3).then(function (res) {
		                uni.loading(false);
		                if (res.status) {
		                    var list = {
		                        [name]: res.data,
		                    };
		                    that[name] = res.data
		
		                } else {
		                    uni.showToast({
		                        title: res.message,
		                        icon: 'none',
		                        duration: 1500
		                    });
		
		                }
		
		            });
		        }
		    });
		    // #endif
		}
		
	}
	
	uni.showActionSheet({
		itemList: ['拍摄', '从相册选择'],
		success: function (res) {
			
			// #ifdef MP
			uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			// #endif
			
			// #ifdef APP
			uni.wen.util.checkAppPermission(res.tapIndex === 1 ? 'photoLibrary-write' : 'camera', res.tapIndex === 1 ? '[相册读写权限]获取您的相册图片，用于提交反馈，举报图片，扫一扫等场景' : '[摄像头权限]获取您此刻所拍的照片，用于提交反馈，举报图片，扫一扫等场景', () => {
				uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			}, that);
			// #endif
			
			// #ifdef H5
			uploadPictures_((res.tapIndex === 1 ? 'album' : 'camera'), type, name, count);
			// #endif
	
		},
		fail: function (res) {
			console.log(res.errMsg);
		}
	});
	
}; //获取地址

// 关注接口
const actionFollow = function (userId) {
    return new Promise(function (resolve, reject) {
        uni.wen.util.doVibrateShort();
        uni.wen.util.request(
            uni.wen.api.ApiRootUrl + 'user/follow', {
                posts_user_id: userId
            },
            'POST'
        ).then(function (res) {
            if (res) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
};

// 用户界面关注接口
const userInfoActionFollow = function (userId) {
    let that = this;
    actionFollow(userId).then((res) => {
        uni.loading(false);
        if (res.status) {
            let userInfo = that.userInfo;
            userInfo.isFollow = !userInfo.isFollow;
            that.userInfo = userInfo;
            uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
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

// 用户关注接口
const userActionFollow = function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userid;
    let index = e.currentTarget.dataset.index;
    actionFollow(userId).then((res) => {
        uni.loading(false);
        if (res.status) {

            let userList = that.userList;
            userList[index].is_together_follow = !userList[index].is_together_follow;
            that.userList = userList;

            uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
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

// 话题获取笔记列表（瀑布流）
const postsTage = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'posts/tags', {
        tag_id: that.tagid,
        page: that.page
    }).then(function (res) {
        if (res.status) {
			
			if(res.data.current_page != that.page){
				return false;
			}

            let data = res.data;

            if (data.data.length > 0) {
                that.posts = data.data;
                that.loadingShow = false;
                that.page = data.current_page;
                that.isLastPage = false;
            } else if (data.data == '') {
                that.loadingShow = true;
                that.isLastPage = true;
            }
            that.topicload = false;


            if (data.data.length > 0) {
                that.postWaterData = {
                    e: that.empty ? 1 : 0,
                    data: data.data
                };
            }

        } else {
            uni.showToast({
                title: res.message,
                icon: 'none'
            })
        }
    });
};
// 用户分区列表
const userPlate = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/plate').then(function (res) {
        that.$store.dispatch('userAddPlateAction', res.data);
        if (that.$store.state.scene == 53) {
            setTimeout(function () {
                that.cleanCats();
            }, 1500);

        }
    });
};


// 文章组件事件
//笔记点击关注用户

const postsActionFollow = function (e) {
    let that = this;
    let userId = e.currentTarget.dataset.userid;
    actionFollow(userId).then((res) => {
        if (res.status) {

            let posts = that.posts;

            for (var v in posts) {
                if (posts[v].user.id == userId) {
                    posts[v].is_follow_user = !posts[v].is_follow_user;
                }
            }

            that.posts = posts;

            uni.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
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


const showImgFun = function (imgs, index) {
    let that = this;
    let url = imgs[index];
    let styleNames = that.$store.state.config.img.styleNames || new Array();
    if (url && styleNames) {
        for (var i = 0; i < styleNames.length; i++) {
            if (styleNames[i].charAt(0) == '/') {
                url = url.replace(styleNames[i], '');
            }
        }
    }
    uni.previewImage({
        current: url,
        urls: [url]
    });
    return false;

    uni.navigateTo({
        url: '/pages/common/img?imgs=' + JSON.stringify(imgs) + '&current=' + index
    });

}

const onClickShare = function () {
    let that = this;
    that.showShare = !that.showShare;
    uni.$store.commit('popopChange', false);
};


//全屏预览图片（发帖用）
const onPreviewPicture = function (e) {
    let current = e.currentTarget.dataset.src;
    let piclist = e.currentTarget.dataset.pic;
    var picArr = [];

    for (let i in piclist) {
        picArr.push(piclist[i].url);
    }

    uni.previewImage({
        current: current,
        urls: picArr
    });
}; //全屏预览图片（单张）

const onPreviewImage = function (e) {
    let current = e.currentTarget.dataset.src;
    let picArr = [];
    picArr.push(current);
    uni.previewImage({
        current: current,
        urls: picArr
    });
};

const onAppShare = function (author, id, type, url, title, content, img, minipath, video) {
    let that = this;
    let shareData = {
        shareUrl: that.$store.state.config.h5.home + '/#' + minipath,
        shareTitle: title,
        shareContent: uni.wen.util.textRaw(content),
        shareImg: img,
        appPath: minipath || '/pages/tabbar/index/index',
        appWebUrl: that.$store.state.config.h5.home + '/#' + minipath,
        id: id,
        type: type,
        author: author,
        meta_appid: that.$store.state.config.app.wechat.mini.meta_appid
    };
    if (video) {
        shareData.mediaUrl = video;
    }
    // 调用
    let shareObj = appShare(that, shareData, res => {
        // 分享成功后关闭弹窗
        // 第一种关闭弹窗的方式
        closeShare();
    });
}




const getIntervalMplogin = function (unique) {
    let that = this;

    return new Promise(function (resolve, reject) {
        if (!unique) {
            uni.showToast({
                title: '初始化失败',
                icon: 'error'
            });
            return false;
        }

        uni.wen.util.request(uni.wen.api.ApiRootUrl + 'interval/mplogin', {
            unique: unique
        }).then(function (res) {
            if (res.status) {
                that.intervalTimes = 0;
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
				
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
};



const toReport = function (type, object_id = 0) {
    let that = this;
    if (type === 0) {
        object_id = Math.abs(object_id);
    }
    uni.wen.toUrl(6, '/pages/common/report?type=' + type + '&object_id=' + object_id, null);
}

module.exports = function (obj) {
    obj.forceUpdate = forceUpdate;
    obj.onPreviewImage = onPreviewImage;
    obj.onPreviewPicture = onPreviewPicture;
    obj.imageClipper = imageClipper;
    obj.uploadPicturesPic = uploadPicturesPic;
    obj.getSysMessageCount = getSysMessageCount;
    obj.userInfoActionFollow = userInfoActionFollow;
    obj.userPlate = userPlate;
    obj.postsTage = postsTage;
    obj.uploadPictures = uploadPictures;
    obj.actionFollow = actionFollow;
    obj.postsActionFollow = postsActionFollow;
    obj.userActionFollow = userActionFollow;
    obj.onClickShare = onClickShare;
    obj.onAppShare = onAppShare;
    obj.showImgFun = showImgFun;
    obj.getIntervalMplogin = getIntervalMplogin;
    obj.toReport = toReport;
};
