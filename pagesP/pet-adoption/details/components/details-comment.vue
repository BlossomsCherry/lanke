<template>
	<view>
		<view class="comment-wrapper">
			<view class="title-wrapper">评论</view>
			<view class="placeholder-wrapper" @tap.stop="showCommendPopup">说点什么...</view>
		</view>
		<slot></slot>
	</view>
</template>
<script>
	export default {
		name: "details-comment",
		components: {

		},
		data() {
			return {

			}
		},


		methods: {
			showCommendPopup() {
				this.$emit('showCommendPopup')
			}
		}
	}
</script>
<style scoped lang="scss">
	.comment-wrapper {
		margin-top: $uni-spacing-col-lg;

		.title-wrapper {
			padding: 0 $page-row-spacing;
			font-size: 42rpx;
			font-weight: bold;
			@include color(color-darkest);
		}

		.placeholder-wrapper {
			margin: $uni-spacing-col-lg $page-row-spacing;
			padding: $uni-spacing-col-lg $uni-spacing-row-lg;
			@include background_color(page-box-item2-background-color);
			border-radius: $uni-border-radius-lg-er;
			@include color(color-lightest-dark);
		}
	}
</style>