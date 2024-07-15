<template>
	<view>
		<view class="switch_box row-b-c"
			:style="switch_box_syle"
			@click="changeSwitch">
			<view class="switch_text c-white" :class="checked_?['to_left']:['_right','c-black']"
				:style="switch_text_left_style">{{checked_?checked_text:uncheck_text}}
			</view>
			<view class="round" :style="switch_text_right_style">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed:{
			switch_box_syle:{
				get(){
					let that = this;
					return 'background-color: ' + (that.checked_ ? that.bg : that.unbg) + ';width: ' + that.width + 'rpx;height: ' + that.height + 'rpx;border-radius: 100px;';
				},
				set(v){}
			},
			switch_text_left_style: {
				get(){
					let that = this;
					return 'font-size: ' + that.size + 'rpx;padding-right: ' + that.padding_right;
				},
				set(v){}
			},
			switch_text_right_style:{
				get(){
					let that = this;
					return 'left: ' + (that.checked_?'100%;':'0;') + 'margin-left: ' + (that.checked_? ('-' + (Number(that.height)-1) + 'rpx;') :';') + 'width: ' + that.height + 'rpx;height: ' + that.height + 'rpx;border-radius: ' + that.height/2 + 'rpx';
				},
				set(v){}
			}
		},
		props: {
			checked: {
				type: Boolean,
				default: false
			},
			bg: {
				type: String,
				default: '#01c0aa'
			},
			unbg: {
				type: String,
				default: '#F6F6F6'
			},
			width: {
				type: String,
				default: '130'
			},
			height: {
				type: String,
				default: '50'
			},
			uncheck_text: {
				type: String,
				default: ''
			},
			checked_text: {
				type: String,
				default: ''
			},
			size: {
				type: String,
				default: '24'
			},
			disable: {
				type: Boolean,
				default: false
			},
			disable_tip: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				padding_right: '20rpx',
				checked_: this.checked
			}
		},
		created() {
			if (this.uncheck_text.length > this.checked_text.length) {
				this.padding_right = '10rpx'
			}
		},
		methods: {
			changeSwitch: function(e) {
				let that = this;
				if(that.disable){
					if(that.disable_tip){
						uni.showToast({
							title: that.disable_tip,
							icon: "none"
						})
					}
					return;
				}
				that.checked_ = !that.checked_
				that.$emit('change', {
					checked: that.checked_
				})
			}
		}
	}
</script>

<style lang="scss">
	.row-c-c {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.c-white {
		color: #FFFFFF;
	}

	.c-black {
		@include color(color-lighter-er-dark);
	}
	/* ---------- */
	.switch_box {
		position: relative;
		border: 1rpx solid;
		@include border_color(border-color-box-item-background-color);
		background-color: #F6F6F6;
		transition: all 0.4s;
		display: flex;
		align-items: center;
	}

	.round {
		position: absolute;
		@include background_color(page-box-background-color);
		transition: all 0.4s;
	}

	.to_left {
		left: 0;
		margin-left: 0;
	}

	.to_right {
		left: 100%;
		margin-left: -50rpx;
	}

	.switch_text {
		position: absolute;
		padding: 0 20rpx;
	}

	._right {
		right: 0;
		border-right: none !important;
	}
</style>
