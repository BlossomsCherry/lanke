

/**
 * 获取消息页数据提示
 */

const getMessages = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/info').then(function (res) {
        let mQH = that.messageQHList;
        mQH[0].content = res.data.list[0].noticeSystemText;
        mQH[0].date = res.data.list[0].noticeSystemDate;
        mQH[0].count = res.data.list[0].noticeSystemCount;
        mQH[1].content = res.data.list[1].noticeLikeCollectText;
        mQH[1].date = res.data.list[1].noticeLikeCollectDate;
        mQH[1].count = res.data.list[1].noticeLikeCollectCount;
        mQH[2].content = res.data.list[2].noticeCommentText;
        mQH[2].date = res.data.list[2].noticeCommentDate;
        mQH[2].count = res.data.list[2].noticeCommentCount;
        let args = {};
        args.messageQHList = mQH;
		args.isFollowMp = res.data.common.isFollow;
        that.setData(args);
		
		if(res.data.common.client_id == null || res.data.common.client_id == undefined){
			if(uni.$store.state.websocket){
				uni.$store.state.websocket.restart();
			}
		}
		
    });
};
/**
 * 系统通知页数据
 */

const getDetailsMessages = function (type) {
    let that = this;
	if(that.page == 1){
		uni.loading(true);
	}
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/getDetailsMessages', {
        type: type,
        page: that.page
    }).then(function (res) {
		uni.loading(false);
		
		if(res.data.current_page != that.page){
			return false;
		}
		
        let data = res.data;
        let args = {};
        args.loadmore = false;
        if (data.data && data.data.length > 0) {
            args.messageList = that.messageList.concat(data.data);
			args.isLastPage = false;
			args.page = data.current_page;
			args.loadmoreShow = false;
        }else{
			args.isLastPage = true;
			args.loadmoreShow = true;
		}
        that.setData(args);
    });
};
/**
 * 清除用户全部未读系统通知
 */

const readMessages = function (type) {
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/readMessages', {
        type: type
    }).then(function (res) {});
};

const toAddChat = function () {
    let that = this;
	that.hideDrawer();
    let chat_content = that.chat_content;

    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };

    if ( (typeof chat_content == 'undefined' || chat_content == null || chat_content.trim() == '') &&  (that.chat_image == '' || that.chat_image === undefined) && ( that.chat_audio_url == '' || that.chat_audio_length == 0 ) ) {
        uni.showToast({
            title: '你还没有讲话昵',
            icon: 'none'
        });
        return;
    }
	
	uni.wen.util.doVibrateShort();
		
    uni.wen.util.request(
        uni.wen.api.ApiRootUrl + 'massages/addChat',
        {
            oid: that.oid,
            chat_content: chat_content,
			chat_audio_url: that.chat_audio_url,
			chat_audio_length: that.chat_audio_length,
            chat_image: that.chat_image
        },
        'POST'
    ).then(function (res) {
		console.log('=====2343333---------------');
        if (res.status) {
			let messages = that.messages;
			messages.push(res.data);
            that.setData({
                chat_content: '',
                chat_image: '',
				chat_audio_url: '',
				chat_audio_length: 0,
				messages: messages
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

//发送图片
const toAddChatImage = function (type) {
    let that = this;
	that.hideDrawer();
	
	let _toAddChatImage = (type) => {
		uni.chooseImage({
		    count: 1,
		    sourceType: [type],
			sizeType: ['original'],
		
		    success(res) {
		        const tempFilePaths = res.tempFilePaths;
		        uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', tempFilePaths[0], 15).then(function (res) {
					uni.loading(false);
					if(res.status){
						that.setData({
						    chat_image: res.data
						});
						that.toAddChat();
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
		        });
		    }
		});
	}
	
	// #ifdef MP
	_toAddChatImage(type)
	// #endif
	
	// #ifdef APP
	uni.wen.util.checkAppPermission(type == 'camera' ? 'camera' : 'photoLibrary-write', type == 'camera' ? '[摄像头权限]获取您此刻所拍的照片，用于发送图片私信' : '[相册读写权限]获取您的相册图片，用于发送图片私信', () => {
		_toAddChatImage(type)
	}, that);
	// #endif
	
	// #ifdef H5
	_toAddChatImage(type)
	// #endif
	
};

// 发送语音
const toAddChatAudio = function (msg) {
    let that = this;
	
	uni.wen.util.uploadFile(uni.wen.api.ApiRootUrl + 'files/uploads', msg.url, 15).then(function(res) {
		if(res.status){
			that.setData({
				chat_audio_url: res.data,
				chat_audio_length: msg.length
			});
			that.toAddChat();
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
 * 查询用户聊天记录
 */

const getUserChat = function (type) {
    let that = this;
	if(that.isLastPage){
		// uni.showToast({
		// 	title: '没有更多的消息了',
		// 	icon: 'none'
		// })
		return false;
	}
	let Viewid = null;
	if(type == 1){
		that.setData({
		    page: 1,
		    messages: []
		});
	}else{
		if (that.isHistoryLoading) {
			return;
		}
		that.setData({
			page: that.page + 1,
			isHistoryLoading: true,
			scrollAnimation: false,
		});
		if(that.messages[0] && that.messages[0].id){
			Viewid = that.messages[0].id;
		}
	}
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/getUserChat', {
        oid: that.oid,
        page: that.page
    }).then(function (res) {
        if (res.status) {
			
			if(res.data.current_page != that.page){
				return false;
			}
			
			let data = res.data;
			let args = {};
			
            if(data.data && data.data.length > 0){
				data.data.reverse();
				args.messages = data.data.concat(that.messages);
				args.page = data.current_page;
				args.isLastPage = false;
			}else{
				args.isLastPage = true;
			}
			args.isHistoryLoading = false;

			that.setData(args);
			
			if (type == 1) {
				if(that.messages){
					Viewid = that.messages[that.messages.length - 1].id;
				}
			    setTimeout(function(){
					that.$nextTick(function() {
						//进入页面滚动到底部
						that.scrollTop = 9999;
						that.scrollToView = 'msg' + Viewid;
						that.$nextTick(function() {
							that.scrollAnimation = true;
						});
					});
				}, 600);
			}else{
				//这段代码很重要，不然每次加载历史数据都会跳到顶部
				that.$nextTick(function() {
					that.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
					that.$nextTick(function() {
						that.scrollAnimation = true; //恢复滚动动画
					});
				
				});
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
 * 查询用户聊天记录列表
 */

const getUserChatList = function () {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/getUserChatList').then(function (res) {
		uni.loading(false);
        if (res.status) {
            let args = {};
            args.messageList = res.data;
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

/**
 * 已读对应用户信息
 */

const readUserChat = function () {
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/readUserChat', {
        oid: this.oid
    }).then(function (res) {});
}; //删除聊天记录

const delMessage = function (e) {
    let that = this;
    uni.wen.util.request(uni.wen.api.ApiRootUrl + 'massages/userDelMessage', {
        userid: e.currentTarget.dataset.uid
    }).then(function (res) {
        that.setData({
            close: true
        });
        that.getUserChatList();
    });
};

module.exports = function (obj) {
    obj.delMessage = delMessage;
    obj.getMessages = getMessages;
    obj.getDetailsMessages = getDetailsMessages;
    obj.readMessages = readMessages;
    obj.toAddChat = toAddChat;
    obj.toAddChatImage = toAddChatImage;
    obj.getUserChat = getUserChat;
    obj.getUserChatList = getUserChatList;
    obj.readUserChat = readUserChat;
	obj.toAddChatAudio = toAddChatAudio;
};
