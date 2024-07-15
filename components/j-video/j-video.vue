<template>
	<view class="root post-video-wrap" :style="styles + ';width: ' + width + ';height: ' + height ">
		<image :style="{width,height}" class="posterImg" :src="posterUrl" mode="aspectFit"></image>
		<view :style="{width,height}" @tap.stop.prevent="onplay" class="box">
			<i class="play-icon mini-icon mini-shipin1"></i>
		</view>
		<i class="nixuanzhuan90-icon mini-icon mini-nishizhenxuanzhuan" @tap.stop.prevent="xuanzhuan90Tap"></i>
		<video :id="videoId" :style="{height,width:state?'750rpx':'0rpx'}" :direction="direction" @pause="state=0" @timeupdate="timeupdate"
			@fullscreenchange="fullscreenchange" class="video" :src="url"></video>
		<!-- <progress :style="{'top':height,width}" class="progress" :percent="currentTime?parseInt(currentTime/duration*100):0" show-info border-radius="5" active></progress> -->
	</view>
</template>

<script>
	export default {
		computed: {
			posterUrl() {
				if (this.poster) return this.poster
				return '';
			},
		},
		created() {
			this.videoId = Date.now() + Math.ceil(Math.random() * 10000000) + "";
		},
		mounted() {
			this.VideoContext = uni.createVideoContext(this.videoId)
		},
		methods: {
			onplay(){
				let that = this;
				console.log('------------')
				if(that.slide){
					uni.navigateTo({
						url: '/pagesC/video/slide?id=' + that.post_id,
					});
				}else{
					that.setData({
						direction: '0',
						state: !that.state
					});
				}
			},
			xuanzhuan90Tap(){
				let that = this;
				that.setData({
					direction: '-90',
					state: !that.state
				});
			},
			fullscreenchange(e) {
				// this.state = e.detail.fullScreen
				console.log(e);
			},
			timeupdate(e) {
				this.duration = e.detail.duration
				this.currentTime = e.detail.currentTime
			}
		},
		watch: {
			state(state, oldValue) {
				if (!state) {
					this.VideoContext.pause()
				} else {
					this.VideoContext.play()
					this.$nextTick(() => {
						this.VideoContext.requestFullScreen({
							direction: this.direction
						})
					})
				}
			}
		},
		data() {
			return {
				VideoContext: {},
				state: false,
				currentTime: 0,
				duration: 0,
				videoId: '',
				direction: 0
			};
		},
		props: {
			poster: {
				type: [String, Boolean],
				default () {
					return ''
				}
			},
			url: {
				type: String,
				default () {
					return ''
				}
			},
			width: {
				type: String,
				default () {
					return "750rpx";
				}
			},
			height: {
				type: String,
				default () {
					return "450rpx";
				}
			},
			styles: {
				type: String,
				default () {
					return "";
				}
			},
			slide: {
				type: Boolean,
				default: false
			},
			post_id: {
				type: Number,
				default: 0
			}
		},
	}
</script>

<style lang="scss" scoped>
	.root {
		position: relative;
		width: 750rpx;
		height: 300px;
		overflow: hidden;
	}
	.post-video-wrap {
	    background-color: #eee;
	    border-radius: 10rpx;
		.nixuanzhuan90-icon{
			font-size: 60rpx;
			color: #efefef;
			position: absolute;
			right: 20rpx;
			bottom: 20rpx;
		}
	}
	.post-video-wrap.type_2{
		@include background_color(relative2-background-color);
		border-radius: 0;
	}

	.posterImg,
	.video,
	.box {
		display: flex;
		width: 750rpx;
		height: 300px;
		//border: solid 1px red;absolute
		position: absolute;
		.play-icon{
			font-size: 70rpx;
			color: rgba(255, 255, 255, 0.7);
		}
	}

	.posterImg {
		//border: solid red 1px;
	}

	.box {
		justify-content: center;
		align-items: center;
		z-index: 99999999999;
	}

</style>
