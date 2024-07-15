// #ifdef APP || H5
const plusPopup = function(popup, other, callback) {
	let user_created_at = other.user_created_at
	let close_icon_url = other.close_icon_url
	let popup_tip = popup.tip.nologin;
	let bgcolor = other.bgcolor;
	let itemBgcolor = other.itemBgcolor;
	let fontColor = other.fontColor;
	
	if( user_created_at && user_created_at.length > 0 ){
		var now = new Date();
		var targetDate = new Date(user_created_at);
		var timeDiff = now.getTime() - targetDate.getTime();
		var daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
		popup_tip = popup.tip.login.replace('[in_days]', daysDiff);
	}
	
	// 弹窗遮罩层
	let maskLayer = new plus.nativeObj.View("maskLayer", { //先创建遮罩层
		id: "test",
		top: '0px',
		left: '0px',
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(0,0,0,0.7)'
	});
	
	// 以下为计算菜单的nview绘制布局
	const screenWidth = plus.screen.resolutionWidth;
	const screenHeight = plus.screen.resolutionHeight;
	//弹窗容器宽度
	const popupViewWidth = screenWidth;
	// 弹窗容器内按钮部分高度
	let viewBtnsHeight = 250;
	// 弹窗容器内按钮部分高度
	let viewListHeight = 270;
	// 弹窗容器的Padding
	const viewContentPadding = 10;
	// 弹窗容器的宽度
	const viewContentWidth = parseInt(popupViewWidth - (viewContentPadding * 2));
	// 弹窗容器的高度
	const viewContentHeight = parseInt(viewBtnsHeight + viewListHeight - (viewContentPadding * 2));
	const viewThreeButtonWidth = parseInt((screenWidth - 60) / 3);
	
	// 头部文案
	const topText = {
		tag: "font",
		id: "title",
		text: popup_tip,
		textStyles: {
			size: "15px",
			color: fontColor
		},
		position: {
			top: "20px",
			left: viewContentPadding + "px",
			width: viewContentWidth + "px",
			height: "30px",
			textAlign: "center"
		}
	}
	// 发图文/视频
	let uploadBtn = [];
	if(popup.button.first.text1){
		uploadBtn = [
			{
				tag: 'rect',
				rectStyles: {
					radius: "20px",
					color: '#ff2442',
				},
				position: {
					top: "70px",
					left: viewContentPadding + "px",
					width: viewContentWidth + "px",
					height: "60px",
				}
			},
			{
				tag: 'font',
				text: popup.button.first.text1,
				textStyles: {
					size: '16px',
					color: "#fff",
					weight: "bold",
					textAlign: "center"
				},
				position: {
					top: "80px",
					left: viewContentPadding + "px",
					width: viewContentWidth + "px",
					height: "20px",
				}
			},
			{
				tag: 'font',
				text: popup.button.first.text2,
				textStyles: {
					size: '12px',
					color: "#fff",
					textAlign: "center"
				},
				position: {
					top: "105px",
					left: viewContentPadding + "px",
					width: viewContentWidth + "px",
					height: "20px",
				}
			}
		]
	}
	 
	
	// 三个链接按钮
	let linksBtn1 = [];
	if(popup.button.second.icon){
		linksBtn1 = [
			{
				tag: 'rect',
				rectStyles: {
					radius: "15px",
					color: itemBgcolor,
				},
				position: {
					top: "140px",
					left: viewContentPadding + "px",
					width: viewThreeButtonWidth + "px",
					height: "60px",
				}
			},
			{
				src: popup.button.second.icon,
				tag: "img",
				position: {
					top: "150px",
					left: viewContentPadding + 5 + "px",
					width: "40px",
					height: "40px",
				}
			},
			{
				tag: 'font',
				text: popup.button.second.text,
				textStyles: {
					size: "13px",
					color: fontColor,
					weight: "bold"
				},
				position: {
					top: "158px",
					left: viewContentPadding + 40 + "px",
					width: (viewThreeButtonWidth - 50)  + "px",
					height: "20px",
				}
			}
		]
	}
	
	
	let linksBtn2 = [];
	if(popup.button.third.text){
		linksBtn2 = [
			{
				tag: 'rect',
				rectStyles: {
					radius: "15px",
					color: itemBgcolor,
				},
				position: {
					top: "140px",
					left: (viewThreeButtonWidth + 20 + viewContentPadding) + "px",
					width: viewThreeButtonWidth + "px",
					height: "60px",
				}
			},
			{
				src: popup.button.third.icon,
				tag: "img",
				position: {
					top: "150px",
					left: (viewThreeButtonWidth + 20 + viewContentPadding + 5) + "px",
					width: "40px",
					height: "40px",
				}
			},
			{
				tag: 'font',
				text: popup.button.third.text,
				textStyles: {
					size: "13px",
					color: fontColor,
					weight: "bold"
				},
				position: {
					top: "158px",
					left: (viewThreeButtonWidth + 20 + viewContentPadding + 40) + "px",
					width: (viewThreeButtonWidth - 50)  + "px",
					height: "20px",
				}
			}
		]
	}
	 
	let linksBtn3 = [];
	if(popup.button.fourth.text){
		linksBtn3 = [
			{
				tag: 'rect',
				rectStyles: {
					radius: "15px",
					color: itemBgcolor,
				},
				position: {
					top: "140px",
					left: (viewThreeButtonWidth * 2 + 40 + viewContentPadding) + "px",
					width: viewThreeButtonWidth + "px",
					height: "60px",
				}
			},
			{
				src: popup.button.fourth.icon,
				tag: "img",
				position: {
					top: "150px",
					left: (viewThreeButtonWidth * 2 + 40 + viewContentPadding + 5) + "px",
					width: "40px",
					height: "40px",
				}
			},
			{
				tag: 'font',
				text: popup.button.fourth.text,
				textStyles: {
					size: "13px",
					color: fontColor,
					weight: "bold"
				},
				position: {
					top: "158px",
					left: (viewThreeButtonWidth * 2 + 40 + viewContentPadding + 40) + "px",
					width: (viewThreeButtonWidth - 50)  + "px",
					height: "20px",
				}
			}
		]
	}
	 
	
	// 底部文案标题
	const textTop = [
		{
			tag: 'font',
			text: popup.hot.title,
			textStyles: {
				size: '18px',
				color: fontColor,
			},
			position: {
				top: viewBtnsHeight - 30 + "px",
				left: 0,
				width: "120px",
				height: "20px",
			}
		},
		{
			tag: 'font',
			text: popup.hot.desc,
			textStyles: {
				size: '12px',
				color: fontColor,
			},
			position: {
				top: viewBtnsHeight - 30 + 20 + "px",
				left: 0,
				width: "230px",
				height: "20px",
			}
		}
	]
	
	// NO.1 2 3
	let numberText = []
	let ranktop = viewBtnsHeight - 30 + 20 + 20;
	popup.hot.list.forEach((item, index)=>{
		let num = index + 1;
		let topBg = ranktop + 45 * index + 10 * num + 10 + "px"
		let top = ranktop + 45 * index + 10 * num + 23 + "px"
		let itemText = [
			{
				tag: 'rect',
				rectStyles: {
					radius: "15px",
					color: itemBgcolor
				},
				position: {
					left: viewContentPadding + "px",
					top: topBg,
					width: viewContentWidth + "px",
					height: "45px",
				}
			},
			{
				tag: 'font',
				text: 'No'+ num + ' ' + item.tags_name,
				textStyles: {
					size: '14px',
					color: fontColor,
					textAlign: 'left'
				},
				position: {
					left: viewContentPadding + 15 + "px",
					top: top,
					width: getTextWidth('No'+ num + ' ' + item.tags_name) + "px",
					height: "20px",
				}
			},
			{
				tag: 'font',
				text: '',
				textStyles: {
					size: '14px',
					color: fontColor,
					textAlign: 'right'
				},
				position: {
					right: viewContentPadding + 15 + "px",
					top: top,
					width: "0px",
					height: "20px",
				}
			}
		]
		numberText = [...numberText, ...itemText]
	})

	// 关闭按钮
	const closeBtn = {
		src: close_icon_url,
		tag: "img",
		position: {
			bottom: (viewContentPadding + 10) + "px",
			left: (popupViewWidth - 55) / 2 + "px",
			width: "55px",
			height: "55px",
		}
	}
	
	let popupViewContentList = [topText, ...uploadBtn, ...linksBtn1, ...linksBtn2, ...linksBtn3, ...textTop, ...numberText, closeBtn];
	
	// 弹窗内容
	let popupView = new plus.nativeObj.View("popupView", { //创建底部图标菜单
		tag: "rect",
		bottom: 0,
		left: 0,
		height: viewBtnsHeight + viewListHeight + "px",
		width: popupViewWidth + "px"
	});

	// 绘制顶部按钮的背景
	popupView.drawRect({color: bgcolor,radius: "20px"}, {
		bottom: viewListHeight + "px",
		left: 0,
		height: viewBtnsHeight + "px",
	});
	// 绘制底部内容的背景
	popupView.drawRect({color: bgcolor}, {
		bottom: 0,
		left: 0,
		height: viewListHeight + 30 + "px",
	});
	 
	popupView.draw(popupViewContentList);
	
	// 按钮的点击事件监听
	popupView.addEventListener("click", function(e) {
		if(e.clientY >= 70 && e.clientY <= (70 + 55) && e.clientX >= viewContentPadding && e.clientX <= (viewContentPadding + viewContentWidth)){
			console.log('11111111')
			callback(popup.button.first)
			closePopup(popupView, maskLayer)
		}else if(e.clientY >= 140 && e.clientY <= (140 + 50) && e.clientX >= viewContentPadding && e.clientX <= (viewContentPadding + 100)){
			console.log('222222222222')
			callback(popup.button.second)
			closePopup(popupView, maskLayer)
		}else if(e.clientY >= 140 && e.clientY <= (140 + 50) && e.clientX >= (popupViewWidth - 100) / 2 && e.clientX <= ((popupViewWidth - 100) / 2 + 100)){
			console.log('333333333')
			callback(popup.button.third)
			closePopup(popupView, maskLayer)
		}else if(e.clientY >= 140 && e.clientY <= (140 + 50) && e.clientX >= (popupViewWidth - 100 - viewContentPadding) && e.clientX <= (popupViewWidth - viewContentPadding)){
			console.log('444444444')
			callback(popup.button.fourth)
			closePopup(popupView, maskLayer)
		}
	});
	
	// 蒙版点击事件监听
	maskLayer.addEventListener("click", function(e) {
		closePopup(popupView, maskLayer)
	});
	
	// 创作灵感的点击事件监听
	popupView.addEventListener("click", function(e) {
		let topBg1 = ranktop + 45 * 0 + 10 * 1 + 10;
		let topBg2 = ranktop + 45 * 1 + 10 * 2 + 10;
		let topBg3 = ranktop + 45 * 2 + 10 * 3 + 10;
		if(e.clientY >= topBg1 && e.clientY <= (topBg1 + 45)){
			callback(popup.hot.list[0])
			closePopup(popupView, maskLayer)
		}else if(e.clientY >= topBg2 && e.clientY <= (topBg2 + 45)){
			callback(popup.hot.list[1])
			closePopup(popupView, maskLayer)
		}else if(e.clientY >= topBg3 && e.clientY <= (topBg3 + 45)){
			callback(popup.hot.list[2])
			closePopup(popupView, maskLayer)
		}
	});
	
	// 关闭的点击事件监听
	popupView.addEventListener("click", function(e) {
		if(e.clientY >= (viewBtnsHeight + viewListHeight - viewContentPadding - 55) && e.clientY <= (viewBtnsHeight + viewListHeight - viewContentPadding) && e.clientX >= ((popupViewWidth - 55) / 2) && e.clientX <= ((popupViewWidth - 55) / 2 + 55)){
			closePopup(popupView, maskLayer)
		}
	});
	
	// 显示弹窗
	openPopup(popupView, maskLayer)
}

// 弹出窗口
function openPopup(popupView, maskLayer){
	maskLayer.show();
	popupView.show(); 
}
// 关闭窗口
function closePopup(popupView, maskLayer){
	maskLayer.hide();
	popupView.hide(); 
}

// 计算文案长度
function getTextWidth(text, font) {
	let textArr = text.split("");
	let len = textArr.length;
	// 上个节点
	let previousNode = 0;
	// 记录节点宽度
	let nodeWidth = 0;
	// 如果是字母，侧保存长度
	let letterWidth = 0;
	// 汉字宽度
	let chineseWidth = 15;
	// otherFont宽度
	let otherWidth = 7;
	for (let i = 0; i < len; i++) {
		if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
			if(letterWidth > 0){
				nodeWidth += chineseWidth + letterWidth * otherWidth;
				letterWidth = 0;
			} else {
				nodeWidth += chineseWidth;
			}
		} else {
			if(/\n/g.test(textArr[i])){
				previousNode = i + 1;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(textArr[i] == "\\" && textArr[i + 1] == "n"){
				previousNode = i + 2;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(/[a-zA-Z0-9]/g.test(textArr[i])){
				letterWidth += 1;
			} else{
				nodeWidth += otherWidth;
			}
		}
	}
	return nodeWidth;
}

export default function(data, others, callback) {
	plusPopup(data, others, callback)
}

// #endif