<template>
	<view class="box">
		<view class="box__header">
			<slot name="head"></slot>
		</view>
		<view class="box__body">
			<view class="password-box">
				<view class="password-item" @tap.stop.prevent="show">
					<view class="password-item-char" v-for="i in items" :key="i">
						<view class="password-item-char__dot" v-if="password[i] || password[i] === 0"></view>
					</view>
				</view>
			</view>
		</view>
		<slot name="body"></slot>
		<view :class="'keyboard ' + pattern">
			<ul class="number">
				<li class="button" @tap.stop.prevent="input(item)" v-for="item in keys" :key="item">{{item}}</li>
				<li class="button">.</li>
				<li class="button down" @tap.stop.prevent="hide">
					<i class="mini-icon mini-iconset0282"></i>
				</li>
			</ul>
			<view class="action">
				<view class="delete" @tap.stop.prevent="del">
					<i class="mini-icon mini-shanchu_delete-two"></i>
				</view>
				<view class="ok" @tap.stop.prevent="done">完成</view>
			</view>
		</view>
	</view>
</template>

<script>
	const keys = () => {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	};
	
	export default {
		props: {
			defaultPassword: String
		},
		components: {

		},
		data() {
			return {
				items: [0, 1, 2, 3, 4, 5],
				password: [],
				keys: keys(),
				pattern: 'hidden'
			};
		},
		methods: {
			show() {
				let args = {
					cancel: false
				};
				this.$emit('shown', args);
				if (!args.cancel) {
					this.pattern = 'slideup';
				}
			},
			hide() {
				let args = {
					cancel: false
				};
				this.$emit('hidden', args);
				if (!args.cancel) {
					this.pattern = 'slidedown';
				}
			},
			input(item) {
				uni.wen.util.doVibrateShort();
				let args = {
					target: this,
					data: item,
					cancel: false,
					callback: undefined
				};
				this.$emit('input', args);
				if (!args.cancel){
					if (this.password.length === this.items.length) {
						//长度达6位，自动验证
						return;
					}
					if (args.callback && typeof args.callback === 'function') {
						args.callback.call(this);
					}
					this.password.push(item);
				}
			},
			del() {
				let args = {
					cancel: false
				};
				this.$emit('delete', args);
				if (!args.cancel) {
					if (this.password.length > 0) {
						this.password = this.password.slice(0, this.password.length - 1);
					}
				}
			},
			done(){
				if (this.password.length !== this.items.length){
					uni.showToast({
						title: '长度不足',
						icon: 'none'
					})
				};
				
				this.$emit('confirm', {
					target: this,
					value: this.password.join('')
				});
			},
			clear(){
				this.password = [];
			}
		},
		watch: {
			defaultPassword: {
				immediate:true,
				handler(val){
					if (val && val.length === 6) {
						this.password = val.split('').map(Number);
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './uni-password.scss'
</style>