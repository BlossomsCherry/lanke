<template>
	<view class="hover_ball_cell"
		:style="{ width: `${diameter}px`, height: `${diameter}px`, top: `${top}px`, left: `${left}px` }"
		@touchmove.stop.prevent="touchmove"
		@touchend="touchend"
		@touchcancel.stop.prevent="touchcancel"
		@tap.stop.prevent="onTap"
		:animation="ballAnimation">
		<view class="wave">
			<image class="played_avatar" :src="myUserInfo.user_avatar" mode="" v-if="is_played"></image>
		</view>
	</view>
</template>

<script>
export default {
	computed:{
		is_played:{
			get(){
				let that = this;
				return that.$store.state.userInfo.is_played;
			},
			set(v){}
		},
	},
	data() {
		return {
			diameter: 0,
			top: 0,
			left: 0,
			isMove: false,
			ballAnimation: {},
			timeout: null,
			modile: {},
		};
	},
	name: 'hover-ball',
	created() {
		let _this = this;
		_this.modile = uni.getSystemInfoSync();
		let diameter = _this.modile.screenHeight / 22;
		_this.setData({
			diameter: diameter,
			top: _this.modile.safeArea.bottom - diameter - 200,
			left: _this.modile.safeArea.right
		})
	},
	methods: {
		onTap() {
			let _this = this;
			let x = '0';
			if (2 * _this.left >= _this.modile.safeArea.width) {
				x = '-100%';
			}
			let create = uni.createAnimation({
				duration: 0
			});
			create.translate(x).step();
			_this.ballAnimation = create.export();
			_this.overBall();
			setTimeout(function(){
				if(_this.$store.state.scene != 56){
					uni.wen.toUrl(6, '/pagesA/mine/played/played', null);
				}
			}, 600);
		},
		touchmove(e) {
			let _this = this;
			_this.isMove = true;
			if (_this.timeout != null) {
				clearTimeout(_this.timeout);
				_this.timeout = null;
			}
			var touch = e.touches[0] || e.changedTouches[0];
			_this.left = touch.clientX;
			_this.top = touch.clientY;
		},
		touchend(e) {
			let _this = this;
			if (!_this.isMove) {
				return;
			}
			_this.finish(e);
		},
		touchcancel(e) {
			let _this = this;
			if (!_this.isMove) {
				return;
			}
			_this.finish(e);
		},
		finish(e) {
			let _this = this;
			_this.isMove = false;
			var touch = e.touches[0] || e.changedTouches[0];
			_this.left = touch.clientX;
			_this.top = touch.clientY;
			let x = '0';
			if (2 * _this.left + _this.diameter >= _this.modile.safeArea.width) {
				_this.left = _this.modile.safeArea.width;
				x = '-100%';
			} else {
				_this.left = _this.modile.safeArea.left;
			}
			if (_this.top > _this.modile.safeArea.height + _this.modile.safeAreaInsets.bottom) {
				_this.top = _this.modile.safeArea.height + _this.modile.safeAreaInsets.bottom; 
			} else if (_this.top < - _this.diameter / 2) {
				_this.top = - _this.diameter / 2;
			}
			let create = uni.createAnimation({
				duration: 0
			});
			create.translate(x).step();
			_this.ballAnimation = create.export();
			_this.overBall();
		},
		overBall() {
			let _this = this;
			_this.timeout = setTimeout(() => {
				_this.timeout = null;
				let create = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease-in'
				});
				create.translate('-50%').step();
				_this.ballAnimation = create.export();
			}, 1200);
		}
	}
};
</script>

<style lang="scss" scoped>

$global-hover-ball-display: block; // 管理悬浮球，若要关闭，则改成 none（默认值：block ）


.hover_ball_cell {
	position: fixed;
	border-radius: 50%;
	@include background_color(page-box-background-color);
	transform: translate(-50%, 0);
	padding: 2upx;
	box-shadow: 0 2px 24px 0 #cccccc;
	display: $global-hover-ball-display;
	.wave {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(-180deg, #67c7f9 13%, #efcbef 91%);
		border-radius: 50%;
		background-size: cover;
		.played_avatar {
			width: 15px;
			height: 15px;
			left: 2%;
			top: -10%;
			border-radius: 50%;
			position: absolute;
		}
	}
}
</style>
