<template>
	<view class="poster2-wrap" id="poster2-wrap">
		<canvas id="poster" canvas-id="poster" :style="{width: canvasW + 'px', height: canvasH + 'px'}" class="poster" @tap.stop.prevent="previewImg"></canvas>
	</view>
</template>

<script>
let ctx = null
export default {
	props: {
		postersData: {
			type: Object,
			default () {
				return {};
			}
		}
	},
	data() {
		return {
			needLongTapSaveImg: false,
			tempFilePath: '',
			bgColor: '#f6e062',
			canvasRadius: 8,
			canvasMargin: 20,
			yellowPadding: 10,
			whitePadding: 20,
			canvasW: 1,
			canvasH: 1,
			avatarImg: {},
			avatarImgSize: {
				width: 30,
				height: 0,
				topH: 0
			},
			
			textImg: {},
			textImgSize: {
				width: 90,
				height: 0,
				topH: 15
			},
			
			codeImg: {},
			codeImgSize: {
				width: 50,
				height: 0,
				topH: 15
			},
			
			ringImg: {},
			ringtImgSize: {
				width: 12,
				height: 0,
				bottomH: 0
			},
			
			contentImg: {},
			contentImgSize: {
				width: 50,
				height: 0,
				bottomH: 0
			},
			
			btToTop: 20 // 底部文案和二维码的margin-top
		}
	},
	mounted() {
		ctx = uni.createCanvasContext('poster', this)
		this.createPosters()
	},
	methods: {
		previewImg(){
			let that = this;
			// #ifdef H5
			return;
			// #endif
			uni.previewImage({
				current:this.tempFilePath,
				urls: [this.tempFilePath]
			});
		},
		async createPosters() {
			let that = this;
			
			const sysInfo = uni.getSystemInfoSync()
			this.canvasW = sysInfo.windowWidth - this.canvasMargin * 2
			
			this.avatarImg = await this.getImageInfo(this.postersData.avatar)
			this.avatarImgSize.height = this.avatarImgSize.width/this.avatarImg.width*this.avatarImg.height
			this.avatarImgSize.topH = this.avatarImgSize.height + 30
			
			this.textImg = await this.getImageInfo(this.postersData.textImg)
			this.textImgSize.height = this.textImgSize.width/this.textImg.width*this.textImg.height
			this.textImgSize.topH = this.textImgSize.height + 15
			
			this.codeImg = await this.getImageInfo(this.postersData.code)
			this.codeImgSize.height = this.codeImgSize.width/this.codeImg.width*this.codeImg.height
			this.codeImgSize.topH = this.codeImgSize.height + 15
			
			this.ringImg = await this.getImageInfo(this.postersData.locationImg)
			this.ringtImgSize.height = this.ringtImgSize.width/this.ringImg.width*this.ringImg.height
			
			if(this.postersData.contentImg){
				this.contentImg = await this.getImageInfo(this.postersData.contentImg)
				this.contentImgSize.height = this.contentImgSize.width/this.contentImg.width*this.contentImg.height
				this.contentImgSize.bottomH = this.contentImgSize.height + 20
			}
			
			if(this.avatarImg.errMsg == 'getImageInfo:ok' && this.textImg.errMsg == 'getImageInfo:ok' && this.codeImg.errMsg == 'getImageInfo:ok'){
				uni.loading(true);
				/* content内容计算换行 */
				let contentHeight = this.whitePadding
				let lineHeight = 20
				let linePadding = 5
				const breakTextLines = (text, maxWidth) => {
					const words = text.split('');
					let line = '';
					const lines = [];
					for (let i = 0; i < words.length; i++) {
						const word = words[i];
						const testLine = line + word;
						const metrics = ctx.measureText(testLine);
						if (metrics.width*1.6 > maxWidth && i > 0) {
							lines.push(line);
							line = word;
						} else {
							line = testLine;
						}
					}
					lines.push(line);
					contentHeight += linePadding * (lines.length - 1) + lines.length * lineHeight + this.contentImgSize.bottomH
					return lines;
				};
				const lines = breakTextLines(this.postersData.content, this.canvasW - this.yellowPadding * 2 - this.whitePadding * 2);
				
				// 修改部分开始
				let totalContentHeight = contentHeight + this.avatarImgSize.height + this.textImgSize.height + this.codeImgSize.height + this.btToTop;
				this.canvasH = this.yellowPadding + this.whitePadding + totalContentHeight;
				// 修改部分结束
				
				setTimeout(()=>{
					this.handleBorderRect(0, 0, this.canvasW, this.canvasH, 20, this.bgColor)
					this.handleBorderRect(this.yellowPadding, this.yellowPadding, this.canvasW - this.yellowPadding * 2, contentHeight + this.avatarImgSize.topH  + this.whitePadding, 20, '#ffffff')
					
					// 内容
					lines.forEach((line, index) => {
						ctx.setFontSize(16)
						ctx.setFillStyle('#333')
						ctx.fillText(line, this.yellowPadding + this.whitePadding, this.yellowPadding + this.whitePadding + index * (lineHeight + linePadding) + 20);
					});
					// 内容图片
					if(this.postersData.contentImg){
						ctx.drawImage(this.contentImg.path, this.yellowPadding + this.whitePadding, this.yellowPadding + this.whitePadding + contentHeight - this.contentImgSize.bottomH, this.contentImgSize.width, this.contentImgSize.height)
					}
					
					// 头像
					this.drawRoundImage({
						left: this.yellowPadding + this.whitePadding,
						top: this.yellowPadding + contentHeight + (this.avatarImgSize.topH - this.avatarImgSize.height),
						width: this.avatarImgSize.width,
						height: this.avatarImgSize.height,
						url: this.avatarImg.path
					})
					
					// 用户名
					ctx.setFontSize(12)
					ctx.setFillStyle('#000')
					ctx.fillText(this.postersData.userName, this.yellowPadding + this.whitePadding + this.avatarImgSize.width + 10, this.yellowPadding + contentHeight + (this.avatarImgSize.topH - this.avatarImgSize.height) + this.avatarImgSize.height / 2 + 5)
					
					// 地址
					let location_len = ctx.measureText(this.postersData.locationText).width + 20 + this.ringImg.width
					this.handleBorderRect(this.canvasW - this.yellowPadding - this.whitePadding - location_len, this.yellowPadding + this.whitePadding + contentHeight + this.avatarImgSize.height / 2, location_len, 25, 10, '#e9f1ff')
					ctx.setFontSize(14)
					ctx.setFillStyle('#4389f2')
					ctx.fillText(this.postersData.locationText, this.canvasW - this.yellowPadding - this.whitePadding - location_len + 10, this.yellowPadding + this.whitePadding + contentHeight + this.avatarImgSize.height / 2 + 17)
					this.drawRoundImage({
						left: this.canvasW - this.yellowPadding - this.whitePadding - this.ringImg.width + 10,
						top: this.yellowPadding + this.whitePadding + contentHeight + this.avatarImgSize.height / 2 + 5,
						width: this.ringtImgSize.width,
						height: this.ringtImgSize.height,
						url: this.ringImg.path
					})
					
					// “长按扫码，查看回复”
					const textX = this.canvasW - this.textImgSize.width - this.codeImgSize.width - this.yellowPadding - this.whitePadding - 10;
					const textY = this.yellowPadding + contentHeight + this.avatarImgSize.topH + this.whitePadding + this.btToTop;
					const codeX = this.canvasW - this.codeImgSize.width - this.yellowPadding - this.whitePadding;
		
					ctx.drawImage(this.textImg.path, textX, textY, this.textImgSize.width, this.textImgSize.height);
					
					// 小程序二维码
					this.drawRoundImage({
						left: codeX,
						top: textY,
						width: this.codeImgSize.width,
						height: this.codeImgSize.height,
						url: this.codeImg.path
					});
					
					that.generateCanvasImage();
					
				},1500)
			}
		},
		generateCanvasImage: function () {
			let that = this;
		    const query = wx.createSelectorQuery();
		    query.select('#poster2-wrap').boundingClientRect();
		    query.exec((res) => {
		      ctx.draw(false, () => {
		        setTimeout(() => {
		          wx.canvasToTempFilePath({
		            canvasId: 'poster',
		            success: (res) => {
		              uni.loading(false);
		              that.tempFilePath = res.tempFilePath
		            },
		            fail: (res) => {
		              console.log(res)
		            },
		          }, this);
		        }, 500); // 延迟500毫秒
		      });
		    });
		  },
		//获取图片信息
		getImageInfo(url) {
			return new Promise(resolve => {
				uni.getImageInfo({
					src: url,
					success: res => {
						resolve(res);
					},
					fail: err => {
						uni.showToast({
							title: '网络错误请重试',
							icon: 'loading'
						});
					}
				});
			});
		},
		// 区域圆角
		handleBorderRect(x, y, w, h, r, bgColor) {
			ctx.beginPath();
			// 左上角
			ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.lineTo(x + w, y + r);
			// 右上角
			ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
			ctx.lineTo(x + w, y + h - r);
			ctx.lineTo(x + w - r, y + h);
			// 右下角
			ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
			ctx.lineTo(x + r, y + h);
			ctx.lineTo(x, y + h - r);
			// 左下角
			ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
			ctx.lineTo(x, y + r);
			ctx.lineTo(x + r, y);
			
			ctx.fillStyle = bgColor;
			ctx.fill();
		},
		// 图片圆角
		drawRoundImage(params) {
			let x = params.left;
			let y = params.top;
			let w = params.width;
			let h = params.height;
			let url = params.url;
			let r = w / 2;
			ctx.save();
			ctx.beginPath();
			ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
			ctx.setFillStyle(params.background || '#ffffff');
			ctx.fill();
			ctx.clip();
			ctx.drawImage(url, x, y, w, h);
			ctx.restore();
		}
	}
}
</script>

<style lang="scss" scoped>
	.poster2-wrap{
		position: relative;
		.poster{

		}
	}
</style>
