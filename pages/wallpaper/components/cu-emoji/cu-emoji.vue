<template>
	<div class="emoji-list">
		<swiper class="emoji-list-swiper" @change="swiperChange" :current="current"
			:style="{'height': (height-tabHeight)+'px'}">
			<swiper-item class="emoji-list-swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view scroll-y class="emoji-list-swiper-item-scroll" :show-scrollbar="false">
					<div class="emoji-list-swiper-item-scroll-view">
						<div class="emoji-list-swiper-item-scroll-view-item" v-for="(it, idx) in item" :key="idx"
							@click="chooseEmoji(it.emoji)">
							<text class="text">{{it.emoji}}</text>
						</div>
					</div>
				</scroll-view>

			</swiper-item>
		</swiper>
		<u-line></u-line>
		{{height}}111111111{{tabHeight}}
		<scroll-view class="emoji-list-footer" scroll-x>
			<div v-for="(item, index) in tabs" :key="index" class="emoji-list-footer-view"
				:class="[{'emoji-list-footer-view-active': active === index}]" @tap="tabClick(index)">
				<text class="text">{{item.emoji}}</text>
			</div>
		</scroll-view>
	</div>
</template>

<script>
	import emojis from "../emojis.js"
	export default {
		props: {
			height: {
				type: Number,
				default: uni.upx2px(600),
			}
		},
		data() {
			let list = []
			let tabs = []
			for (let [key, value] of Object.entries(emojis)) {
				list.push(value)
			}
			list.forEach((item, index) => {
				tabs.push(item[0])
			})
			return {
				list,
				tabs,
				current: 0,
				active: 0,
				tabHeight: uni.upx2px(76)
			}
		},
		created() {
			// console.log(emojis)
		},
		methods: {
			swiperChange(e) {
				this.current = e.detail.current
				this.active = this.current
			},
			tabClick(e) {
				this.active = e
				this.current = e
			},
			chooseEmoji(e) {
				console.log(111, e);
				this.$emit('chooseEmoji', e)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.emoji-list {
		flex: 1;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: stretch;

		&-swiper {
			// flex: 1;

			&-item {
				flex: 1;

				&-scroll {
					flex: 1;
					height: 520rpx;

					&-view {
						display: flex;
						flex-wrap: wrap;
						flex-direction: row;
						justify-content: flex-start;

						&-item {
							width: 107rpx;
							height: 107rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							.text {
								font-size: 64rpx;
							}
						}
					}
				}
			}
		}

		&-footer {
			height: 76rpx;
			width: 100%;
			max-height: 76rpx;
			padding: 8rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-view {
				display: inline-block;
				width: 107rpx;
				text-align: center;
				height: 64rpx;
				line-height: 64rpx;
				border-radius: 107rpx;
				transition-timing-function: ease;
				transition-duration: 200ms;
				transition-property: all;

				.text {
					font-size: 48rpx;
				}
			}

			&-view-active {
				background-color: #FFF0DB !important;
			}

		}

	}
</style>