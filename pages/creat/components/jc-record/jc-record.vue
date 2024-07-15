<template>
	<view class="jsfun-record" @tap="showPicker">
		<slot></slot>
		<!-- 遮罩层 -->
		<view class="mask" @tap.stop="closePicker" v-if="isShow" @touchmove.stop.prevent="miniMoveHandle"></view>
		<!-- 多选控件 -->
		<view class="conbox record" :class="{'pickerShow': isShow}">
			<!-- 此处可放置倒计时，可根据需要自行添加 -->
			<view class="time">{{ showRecordTime }}</view>
			<view class="c999"> 最短{{ minTime }}秒，最长{{ maxTime }}秒 </view>
			<view class="record-box">
				<span class="stop" @tap.stop="stopVoice" v-if="_voicePath && playing == 1"></span>
				<span class="play" @tap.stop="playVoice" v-if="_voicePath && playing == 0"></span>
				<canvas class="canvas" canvas-id="canvas" @touchstart="startTouch" @longpress="startRecording" @touchend="endTouch">
					<span class="recording"></span>
				</canvas>
				<span class="confirm" @tap.stop="okClick" v-if="_voicePath"></span>
			</view>
			<view class="c666 fz32 domess">长按录音</view>
		</view>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager(); // 录音
	let innerAudioContext; // 播放

	export default {
		name: 'jsfun-record',
		props: {
			voicePath: { // 默认地址
				type: String,
				default: ''
			},
			maxTime: { // 录音最大时长，单位秒
				type: Number,
				default: 15
			},
			minTime: { // 录音最小时长，单位秒
				type: Number,
				default: 5
			}
		},
		data() {
			return {
				isShow: false,
				frame: 50, // 执行绘画的频率，单位毫秒
				recordTime: 0, // 录音时长
				recordTime1: 0, // 播放录音倒计时
				isshowyuan: false, // 是否显示圆圈
				playing: 0, // 是否播放中
				timeObj: null, // 计时id
				drawObj: null, // 画布动画id
				countdownObj: null, // 倒计时id
				newViocePath: '',
				cacheRecordTime: 0,
				canvasObj: null, // 画布上下文对象
				tempw: 0,
				temph: 0,
				tempw1: 0,
				isLongPress: false // 是否是长按事件
			}
		},
		computed: {
			showRecordTime() {
				const m = Math.floor(this.recordTime / 60);
				const s = this.recordTime % 60;
				return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
			},
			_voicePath() {
				return this.newViocePath || this.voicePath;
			}
		},
		mounted() {
			innerAudioContext = uni.createInnerAudioContext(); // 播放

			// 录音停止事件
			recorderManager.onStop((res) => {
				this.newViocePath = res.tempFilePath;
				this.resetCanvas();
			});

			// 获取canvas宽高和上下文
			const query = uni.createSelectorQuery().in(this);
			query.select(".canvas").boundingClientRect((res) => {
				this.tempw = res.width;
				this.temph = res.height;
				this.canvasObj = uni.createCanvasContext('canvas', this);
			}).exec();

			query.select(".recording").boundingClientRect((res) => {
				this.tempw1 = res.width;
			}).exec();
		},
		beforeDestroy() {
			innerAudioContext.destroy();
		},
		methods: {
			// 组件数据初始化
			initValue() {
				let that = this;
				that.isShow = false;
				that.recordTime = 0;
				that.recordTime1 = 0;
				that.isshowyuan = false;
				that.playing = 0;
				that.clearTimers();
				that.newViocePath = '';
				that.cacheRecordTime = 0;
			},
			// 显示组件
			showPicker() {
				let that = this;
				setTimeout(() => {
					that.isShow = true;
					that.$emit('show');
				}, 100);
			},
			// 关闭组件
			closePicker() {
				let that = this;
				that.isShow = false;
				// 初始化数据
				that.initValue();
				that.stopVoice();
				that.$emit('close');
			},
			// 点击确定
			okClick() {
				let that = this;
				that.$emit('okClick', that._voicePath, that.cacheRecordTime);
				that.closePicker();
			},
			startTouch() {
				this.isLongPress = false; // 重置长按标记
			},
			startRecording() {
				this.isLongPress = true; // 设置长按标记
				this.clearTimers();
				let that = this;
				that.stopVoice();
				that.newViocePath = "";
				that.recordTime = 0;
				that.record();
			},
			endTouch() {
				if (!this.isLongPress) {
					return;
				}
				this.clearTimers();
				let that = this;
				that.recordTime1 = that.recordTime;
				that.cacheRecordTime = that.recordTime;
				that.recordTime = 0;
				that.isshowyuan = false; // 这里更新状态
				that.resetCanvas();
		
				if (that.recordTime1 < that.minTime) {
					if (that.recordTime1 <= 0) return false;
					uni.showToast({
						title: `不能小于${that.minTime}秒,请重新录制`,
						icon: "none"
					});
					return false;
				}
		
				recorderManager.stop(); // 停止录音
			},
			record() {
				this.clearTimers();
				let that = this;
				that.isshowyuan = true;
				recorderManager.start({
					format: 'mp3'
				});
				uni.wen.util.doVibrateShort();
				that.timeObj = setInterval(() => {
					that.recordTime++;
					if (that.recordTime >= that.maxTime) that.endTouch();
				}, 1000);

				const centerX = that.tempw / 2;
				const centerY = that.temph / 2;
				const yuanhuanW = that.tempw1 / 2 + 4;

				if (that.canvasObj) {
					that.canvasObj.beginPath();
					that.canvasObj.setStrokeStyle("#fe3b54");
					that.canvasObj.setGlobalAlpha(0.3);
					that.canvasObj.setLineWidth(3);
					that.canvasObj.arc(centerX, centerY, yuanhuanW, 0, 2 * Math.PI);
					that.canvasObj.stroke();
					that.canvasObj.draw();

					let angle = -0.5;
					that.drawObj = setInterval(() => {
						that.canvasObj.beginPath();
						that.canvasObj.setStrokeStyle("#fe3b54");
						that.canvasObj.setGlobalAlpha(1);
						that.canvasObj.setLineWidth(3);
						that.canvasObj.arc(centerX, centerY, yuanhuanW, -0.5 * Math.PI, (angle += 2 / (this.maxTime * 1000 / this.frame)) * Math.PI, false);
						that.canvasObj.stroke();
						that.canvasObj.draw(true);
					}, that.frame);
				}
			},
			playVoice() {
				let that = this;
				if (that._voicePath && that.playing === 0) {
					innerAudioContext.src = that._voicePath;
					innerAudioContext.stop(); // 确保停止后再播放
					innerAudioContext.play();
					that.playing = 1;

					that.recordTime = that.recordTime1;
					that.countdownObj = setInterval(() => {
						that.recordTime--;
						if (that.recordTime <= 0) {
							that.stopVoice();
						}
					}, 1000);
				}
			},
			stopVoice() {
				let that = this;
				innerAudioContext.stop();
				that.playing = 0;
				that.recordTime = 0;
				clearInterval(that.countdownObj);
			},
			resetCanvas() {
				let that = this;
				if (that.canvasObj) {
					that.canvasObj.setFillStyle('#fff');
					that.canvasObj.fillRect(0, 0, that.tempw, that.temph);
					that.canvasObj.draw();
		
					// 如果录音结束，重新绘制红色圆圈
					if (this.recordTime1 > 0) {
						const centerX = that.tempw / 2;
						const centerY = that.temph / 2;
						const yuanhuanW = that.tempw1 / 2 + 4;
		
						that.canvasObj.beginPath();
						that.canvasObj.setStrokeStyle("#fe3b54");
						that.canvasObj.setGlobalAlpha(0.3);
						that.canvasObj.setLineWidth(3);
						that.canvasObj.arc(centerX, centerY, yuanhuanW, 0, 2 * Math.PI);
						that.canvasObj.stroke();
						that.canvasObj.draw();
					}
				}
			},
			clearTimers() {
				clearInterval(this.timeObj);
				clearInterval(this.drawObj);
				clearInterval(this.countdownObj);
				this.timeObj = null;
				this.drawObj = null;
				this.countdownObj = null;
			}
		}
	}
</script>

<style lang="scss">
	.jsfun-record {
		.mask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);
		}

		.conbox {
			transition: all .3s ease;
			transform: translateY(100%);
			&.pickerShow {
				transform: translateY(0);
			}
			position: fixed;
			z-index: 1000;
			right: 0;
			left: 0;
			bottom: 0;
			background-color: #fff;
		}

		.c666 { color: #666; }
		.c999 { color: #999; }
		.fz28 { font-size: 28upx; }
		.fz32 { font-size: 32upx; }

		.record {
			text-align: center;

			.time {
				text-align: center;
				font-size: 60upx;
				color: #333;
				line-height: 100upx;
				margin-top: 50upx;
			}
			.domess { margin-bottom: 50upx; }

			.record-box {
				display: flex;
				flex-direction: row;
				justify-content: center;
			}
			canvas {
				margin: 10upx 60upx;
				position: relative;
				width: 200upx;
				height: 200upx;
				z-index: 10;
				.recording {
					position: absolute;
					top: 20upx;
					left: 20upx;
					width: 160upx;
					height: 160upx;
					border: 1px dashed #fe3b54;
					border-radius: 100upx;
					background: #fe3b54 url(@/pagesA/static/jc-record/recording.png) no-repeat 50% 50%;
					background-size: 50% 50%;
					z-index: 100;
				}
			}

			.btncom {
				margin-top: 70upx;
				width: 80upx;
				height: 80upx;
				border-radius: 80upx;
			}
			.stop {
				@extend .btncom;
				background: url(@/pagesA/static/jc-record/stop.png) no-repeat;
				background-size: 100% 100%;
			}
			.play {
				@extend .btncom;
				background: url(@/pagesA/static/jc-record/play.png) no-repeat;
				background-size: 100% 100%;
			}
			.confirm {
				@extend .btncom;
				background: url(@/pagesA/static/jc-record/confirm.png) no-repeat;
				background-size: 100% 100%;
			}
		}
	}
</style>
