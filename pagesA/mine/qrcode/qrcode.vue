<template>
<view :class="'mini-page-wrap global-theme-' + global__theme__  + ' global-platform-' + global__platform__ + ' global-device-' + global__device__ + ' global-tenant-' + global__tenant__.tenant_id" :data-theme="global__theme__  ">
	<view class="mini-page-body page-body">
		<navBar :back="true" :home="fph" title="我的名片" :color="global__theme__ == 'black' ? '#ffffff' : '#000000'" :background="global__theme__ == 'black' ? '#19191e' : '#ffffff'">
		</navBar>
		<view class="qrcode-wrap" @tap.stop.prevent="previewImg">
			<view class="way-2 flex-row" :style="'justify-content: center;'+ (way == 1 ? 'height: 0!important;' : '') ">
				<xinyu-canvas-drawer ref="poster" :width="330" :height="540"></xinyu-canvas-drawer>
				<image :src="src" style="width: 330px;height: 540px;margin: auto;"></image>
			</view>
			<view class="way-1 flex-row" :style="'justify-content: center;'+ (way == 2 ? 'height: 0!important;' : '') ">
				<canvas class="f__canvas" style="width:330px;height:540px;"  canvas-id="firstCanvas" id="firstCanvas" @tap.stop.prevent="previewImg"></canvas>
			</view>
			
		</view>
		
		<hover-ball v-if="isOfficial > 1" /><my-toast ref="mytoast" :isdistance="true" :toast="mytoast_data"></my-toast>
	</view>
</view>
</template>

<script>
import myToast from '@/contrib/components/common/toast/toast';
import navBar from '@/components/common/navbar/navbar';
import hoverBall from '@/contrib/components/common/hover-ball/hover-ball';
import _canvas from '@/pagesA/components/fan-canvas/canvasUtils';
import XinyuCanvasDrawer from "@/uni_modules/xinyu-canvas-drawer/index.vue";
const common = require('@/mixins/common');
var options = {};
common(options);
export default {
	mixins: [{ methods: options }],
	components: {
		myToast,navBar,hoverBall,
		XinyuCanvasDrawer
	},
	computed:{

	},
	data() {
	    return {
			pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 47,
			canvasImg: '',
			user_id: 0,
			userData: {},
			src: '',
			way: 1
		}
	},
	onShow: function () {
		let that = this;
		that.updateScene(47, 0, true);
		
	},
	onLoad: function (options) {
		let that = this;
		that.globalOnloadProcess(options);
		if(options.user_id && options.user_id > 0){
			that.user_id = options.user_id;
			uni.setNavigationBarTitle({
			    title: 'ta的名片'
			});
		}else{
			that.user_id = that.$store.state.userInfo.id;
		}
		
		that.$nextTick(function(){
			that.getUserCodecard();
		});
		
	},
	methods: {
		previewImg(){
			let that = this;
			
			
			if(that.way == 2){
				let posterRef = that.$refs.poster;
				try {
					posterRef.saveImageToPhotosAlbum(that.src);
					uni.showToast({
						title: '名片保存成功!',
						icon: 'none'
					})
				} catch (error) {
					uni.showToast({
						title: '名片保存失败!',
						icon: 'none'
					})
				}
			}else{
				// #ifdef H5
				return;
				// #endif
				uni.previewImage({
					current:this.canvasImg,
					urls: [this.canvasImg]
				});
			}
		},
		getUserCodecard(){
			let that = this;
			if(!that.user_id){
				uni.showToast({
					title: '初始化失败',
					icon:'error'
				});
				return false;
			}
			uni.loading(true);
			
			uni.wen.util.request(uni.wen.api.ApiRootUrl + 'user/codecard', {
				user_id: that.user_id
			}).then(function(res) {
				uni.loading(false);
				if(res.status){
					that.setData({
						userData: res.data,
						way: res.data.way
					});
					setTimeout(function(){
						if(that.way == 2){
							that.createPoster();
						}else{
							that.createPoster_();
						}
					}, 100);
				}else{
					uni.showToast({
						title: res.message,
						icon:'error'
					});
				}
			});
		},
		async createPoster_() {
			let that = this;
		    if(that.canvasImg){
		    	return
		    }
			// 同步加载图片
			var bg = await _canvas.getImageInfo(that.userData.user_background_maps);
			var logo = await _canvas.getImageInfo(that.userData.logo);
			var code = await _canvas.getImageInfo(that.userData.code);
			var avatar = await _canvas.getImageInfo(that.userData.user_avatar);
			let ctx = uni.createCanvasContext('firstCanvas', that);
		    // 绘制矩形
			_canvas.fillRoundRect(ctx,0,0,330,540,20,"#ffffff");
			ctx.clip();
			ctx.save();
		    
			let family = " 'PingFang SC',tahoma,arial,'helvetica neue','hiragino sans gb','microsoft yahei',sans-serif";
			if(bg.path){
		        // save+clip+restore:防止图片超出边框显示--相当于overflow: hidden;
		        ctx.save();
		        ctx.clip(); //剪切--不允许超出矩形框
		        // 绘制商品图片
		        _canvas.drawImgCover(ctx, bg, 0, 0, 330, 170);
		        ctx.restore();
				
		        _canvas.fillRoundRect(ctx, 0, 150, 330, 390, 20,'#ffffff')
		
		       _canvas.drawCircular(ctx, avatar.path, 20, 180, 68, 68);
		
			   // 名称
			   ctx.setFillStyle('#333333')
			   ctx.font = "normal 24px" + family
			   ctx.fillText(that.userData.user_name, 25, 290)
			   
			   // id
			   ctx.setFillStyle('#666666')
			   ctx.font = "normal 13px" + family
			   ctx.fillText('ID：' + that.userData.id, 25, 320)
			   
			   // 简介-多行文字
			   ctx.setFillStyle('#999999')
			   ctx.textAlign = 'left';
			   var options = {
			   	font:"normal 13px"+family,     //设置字体
			   	ctx:ctx,
			   	word: that.userData.user_introduce,      //文本
			   	maxWidth:290,           //最大宽度
			   	maxLine:2,              //最大行数--超出省略
			   	x:25,               //x坐标
			   	y:340,                  //y坐标
			   	l_h:15               //行高
			   }
			   // 文本自定义换行
			   _canvas.dealWords(options)
		
			   ctx.drawImage( logo.path, 25, 475, 20, 20);
			   // 名称
			   ctx.setFillStyle('#999999')
			   ctx.font = "normal 13px" + family
			   ctx.fillText('扫描二维码', 50, 490)
			   
			   // 名称
			   ctx.setFillStyle('#999999')
			   ctx.font = "normal 13px" + family
			   ctx.fillText('在'+that.$store.state.config.about.name+'找到我', 25, 510)
			   ctx.restore();
			   
			   ctx.drawImage(code.path, 330 - 110, 420, 100, 100);
			   
			   
		        // 绘制图片
				ctx.draw(false, function() {
					uni.canvasToTempFilePath({
						width: 330,
						height: 540,
						canvasId: 'firstCanvas',
						success(res) {
							that.canvasImg = res.tempFilePath
						}
					},that)
				})
				uni.loading(false);
			}else{
				uni.loading(false);
				uni.showToast({
					title: '海报制作失败',
					icon: 'none'
				});
			}
		},
		async createPoster() {
			// 这种方式生成的海报存在模糊问题，未启用
			let that = this;
		    if(that.canvasImg){
		    	return
		    }
			
			let posterRef = that.$refs.poster;
			await posterRef.init();
			that.src = await posterRef
				.addImage(that.userData.user_background_maps, 0, 0, 330, 200,false)
				.addImage(that.userData.rect, 0, 150, 330, 390, false)
				.addImage(that.userData.user_avatar, 20, 180, 68, 68 ,true)
				.addText(that.userData.user_name, 25, 270, 24, "#000000", 290, false, 27)
				.addText('ID：' +that.userData.id, 25, 320, 13, "#333333", 290, false, 16)
				.addText(that.userData.user_introduce + '', 25, 356, 13, "#333333", 290, true, 15)
				.addImage(that.userData.logo, 25, 475, 20, 20 ,false)
				.addText('在'+that.$store.state.config.about.name+'找到我' , 25, 510, 13, "#666666", 290, false, 15)
				.addText('扫描二维码' , 50, 480, 13, "#666666", 290, false, 15)
				
				.addImage(that.userData.code, 330 - 110, 420, 100, 100 ,false)
				.draw();
				
				uni.loading(false);
		},
	},
	
}
</script>

<style lang="scss" scoped>
.page-body{
	min-height: 100vh;
}
.qrcode-wrap{
	width: 665rpx;
	padding: 10vh 40rpx 40rpx;
	border-radius: 30rpx;
	display: flex;
	flex-direction: column;
	.top{
		display: flex;
		.left{
			.avatar{
				width: 110rpx;
				height: 110rpx;
				border-radius: 10rpx;
				margin-right: 30rpx;
				flex-shrink: 0;
			}
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			flex: 1;
			width: 100rpx;
			.name{
				font-size: $uni-font-size-lg;
			}
			.desc{
				font-size: 25rpx;
				color: #aaa;
			}
		}
	}
	.mid{
		margin-top: 50rpx;
		align-self: center;
		text-align: center;
		image{
			width: 530rpx;
			height: 530rpx;
		}
	}
	.bottom{
		.text{
			margin-top: 30rpx;
			font-size: $uni-font-size-sm;
			align-self: center;
			color: #aaa;
			text-align: center;
		}
	}
}
</style>