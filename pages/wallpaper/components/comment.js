export const commentItem = {
	data() {
		return {
			commentList: [],
			reply: null,
			showOverlay: false,
			focus: false,
			message: '',
			panelHeight: 0,
			keyboardHeight: 0,
			popupHeight: uni.upx2px(660),
			iconType: '',
			page: 1,
			commentIsLastPage: false,
			commentLoadmoreShow: false,
		};
	},
	computed: {
		replyc() {
			if (this.reply && this.reply.userInfo) {
				return `评论${this.reply.userInfo.nickName}`
			}
			if (this.reply && this.reply.fromUserInfo) {
				return `回复${this.reply.fromUserInfo.nickName}`
			}
			return '你想问什么呢？记得有爱评论哦~'
		},
		detailPopupStyle() {
			let style = ''
			if (!this.showOverlay) {
				style = `transform: translateY(100%);`
				// style = `transform: translateY(${this.popupHeight}px);`
			} else {
				if (this.iconType) {
					style = `transform: translateY(0px);`
				} else {
					style = `transform: translateY(-${this.panelHeight}px);`
				}
			}
			return style
		},
		detailPopupPanelStyle() {
			let style = ''
			style = `height: ${this.panelHeight}px;padding-bottom: ${this.statusBar}px;`
			// if (!this.showOverlay) {
			// 	style += `transform: translateY(${this.panelHeight}px);`					
			// } else {
			// 	style += `transform: translateY(100%);`
			// }

			return style
		},
	},
	watch: {
		showOverlay(val) {
			if (!val) {
				this.iconType = ''
				uni.hideKeyboard()
			}
		}
	},
	methods: {
		loadMoreComment() {
			let that = this;
			that.page += 1;
			that.getCommentList();
		},
		getCommentList() {
			let that = this;
			if (that.page == 1) {

			} else {
				that.commentLoadmoreShow = true;
			}
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/comment/list', {
				wallpaper_id: that.id,
				page: that.page,
			}).then(function(res) {
				
				if(res.status){
					if(res.data.current_page != that.page){
						return false;
					}
					let {
						data
					} = res;
					console.log(data)
					let list = JSON.parse(JSON.stringify(that.commentList));
					that.commentList = [];
					if (data.data && data.data.length > 0) {
						if(data.data.length < 10){
							that.commentLoadmoreShow = true;
							that.commentIsLastPage = true;
						}else{
							that.commentLoadmoreShow = false;
							that.commentIsLastPage = false;
						}
						that.page = data.current_page;
						list = list.concat(data.data);
					} else {
						that.commentIsLastPage = true;
					}
					that.commentList = JSON.parse(JSON.stringify(list));
				}
				
				
			});
		},
		iconClick(type) {
			this.iconType = type
			uni.hideKeyboard()
			this.focus = false;
			this.panelHeight = this.keyboardHeight;
		},
		addCommentOrReply() {
			if (!this.message || !this.message.trim()) {
				uni.showToast({
					title: '请输入评论',
					icon: 'none'
				})
				return
			}
			if (this.reply) {
				this.addComment(1)
			} else {
				this.addComment();
			}
		},
		overlayClick(e) {
			this.showOverlay = false
			this.focus = false
		},
		blur(e) {
			this.cursor = e.detail.cursor;
			if (this.iconType != 'smile') {
				this.panelHeight = 0;
			}
		},
		showCommendPopup() {
			this.reply = null
			this.showOverlay = true
			this.focus = true;
			this.keyboardHeight = 0;
			this.panelHeight = 0;
		},
		// 选择了emoji表情
		chooseEmoji(val) {

			// 返回获取从0到光标位置的字符串
			let str = this.message.substring(0, this.cursor)
			// 将表情插入指定位置
			this.message = this.message.replace(str, str + val)
			// 光标向后移动两位
			this.cursor += 2; //光标加2(表情是占两个位置)

		},

		// 聚焦键盘
		focusChange(e) {
			console.log(e);
			this.iconType = ''
			this.keyboardHeight = e.detail.height;
			this.panelHeight = e.detail.height;
			this.focus = true
		},
		toReply(data = {}, index = 0) {
			this.reply = data;
			this.reply.index = index
			this.showOverlay = true
			this.focus = true
		},
		// null评论商品 1回复评论
		addComment(type) {
			// this.message
			let that = this;
			let parms = {
				action: 'add', //固定add
				wallpaper_id: parseInt(that.id), //商品id 
				comment_id: 0, //评论主题id
				comment_agent_id: 0, //回复对象id
				comment_content: this.message,
				comment_img_url: ''
			}
			if (type) {
				parms.comment_id = that.reply.comment_id ? that.reply.comment_id : that.reply.id;
				parms.comment_agent_id = that.reply.comment_id ? that.reply.user.id : 0;
			}
			console.log('1111111111111111111');
			uni.loading(true);
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'wallpaper/comment/process', parms, 'POST').then(function(res) {
				uni.loading(false);
				if (res.status) {
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					})
					//关闭评论框
					that.showOverlay = false;
					that.message = '';
					that.resetCommentList();
					that.getWallpaperDetail();
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
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				}
			});
		},
		resetCommentList() {
			this.commentList = [];
			this.page = 1;
			this.getCommentList();
		},
	}
};