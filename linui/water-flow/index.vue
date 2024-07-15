<template>
	<view class="flex-row" style="justify-content: center;">
		<view :class="'l-class water-flow-container scene_' + scene" v-if="data.length !== 0" :style="'width: ' + wrapWidth + 'rpx;' ">
			<view class="water-column" :style="'max-width: ' + waterColumnwidth +'rpx;min-width:' + waterColumnwidth +'rpx; margin-right:' + columnGap + 'rpx;'">
				<view id="left">
					<block v-for="(item, index) in leftData" :key="index">
						<goods v-if="comName === 'goods'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item"></goods>
						<product v-if="comName === 'product'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item" :lindex="index" @taplikes="taplikes"></product>
						<used v-if="comName === 'used'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item"></used>
					</block>
				</view>
			</view>
			<view class="water-column" :style="'max-width: ' + waterColumnwidth +'rpx; min-width:' + waterColumnwidth +'rpx;'">
				<view id="right">
					<block v-for="(item, index) in rightData" :key="index">
						<goods v-if="comName === 'goods'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item"></goods>
						<product v-if="comName === 'product'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item" :rindex="index" @taplikes="taplikes"></product>
						<used v-if="comName === 'used'" :data-item="item" :scene="scene"
							@tap.native.stop.prevent="onTapItem($event, { item })" :data="item"></used>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import product from '@/components/common/water/product/index';
	import goods from '@/components/common/water/goods-item/index';
	import used from '@/components/common/water/used/index';
	export default {
		data() {
			return {
				data: [],
				leftData: [],
				rightData: [],
				lastSide: 2
			};
		},
		computed:{
			waterColumnwidth: {
				get(){
					let that = this;
					return (that.wrapWidth - that.columnGap) / 2;
				},
				set(v){}
			},
		},
		components: {
			goods,
			product,
			used
		},
		props: {
			waterData: {
				type: Object,
				default: []
			},
			comName: {
				type: String,
				default: ''
			},
			columnGap: {
				type: Number,
				default: 20
			},
			wrapWidth:{
				type: Number,
				default: 734
			},
			scene:{
				tyle: Number,
				default: 0
			},
		},
		watch:{
			waterData: {
				handler: function(newVal, oldVal) {
					let that = this;
					that.lastSide = 2;
					if(newVal && newVal.data && '[object Array]' === Object.prototype.toString.call(newVal.data) ){
						
						let clear = false;
						if(newVal.e > 0){
							clear = true;
						}
						if(clear){
							that.setData({
								leftData: [],
								rightData: [],
								data: []
							});
						};
						that.setData({
							data: newVal.data
						});
						if(newVal.data && newVal.data.length > 0){
							setTimeout(function(){
								that.selectFun(newVal.data, clear)
									.then(() => {
										
									})
									.catch(err => {
										console.error(err);
								});
							}, 200);
						}
					}
				},
				deep: false,
				immediate: true
			}
		},
		methods: {
			delete(id){
				let that = this;
				if(that.rightData && that.rightData.length > 0){
					for(let i = 0; i < that.rightData.length; i++){
						if(that.rightData[i].id == id){
							that.rightData.splice(i, 1);
							break;
						}
					}
				}
				if(that.leftData && that.leftData.length > 0){
					for(let i = 0; i < that.leftData.length; i++){
						if(that.leftData[i].id == id){
							that.leftData.splice(i, 1);
							break;
						}
					}
				}
			},
			delete_from_auth(user_id){
				let that = this;
				
				let indexesToRemove = [];
				for ( let i = 0; i < that.rightData.length; i ++ ) {
					if(that.rightData[i].user_id == user_id ){
						indexesToRemove.push(i);
					}
				}
				let newPosts = that.rightData.filter((element, index) => {
				  return !indexesToRemove.includes(index);
				});
				that.rightData = newPosts;
				
				let indexesToRemove2 = [];
				for ( let i = 0; i < that.leftData.length; i ++ ) {
					if(that.leftData[i].user_id == user_id ){
						indexesToRemove2.push(i);
					}
				}
				let newPosts2 = that.leftData.filter((element, index) => {
				  return !indexesToRemove2.includes(index);
				});
				that.leftData = newPosts2;
			},
			taplikes(data){
				let that = this;
				var id = data.id;
				uni.wen.util.request(
					uni.wen.api.ApiRootUrl + 'posts/like', {
						posts_id: id
					},
					'POST'
				).then(function(res) {
					uni.loading(false);
					if (res.status) {
						if(data.lindex == -1){
							// 右边
							let posts = that.rightData;
							if (posts[data.rindex].is_like) {
								posts[data.rindex].like_count -= 1;
							} else {
								posts[data.rindex].like_count += 1;
							}
							
							posts[data.rindex].is_like = !posts[data.rindex].is_like;
							that.setData({
								rightData: posts
							});
						}else{
							// 左边
							let posts = that.leftData;
							
							if (posts[data.lindex].is_like) {
								posts[data.lindex].like_count -= 1;
							} else {
								posts[data.lindex].like_count += 1;
							}
							
							posts[data.lindex].is_like = !posts[data.lindex].is_like;
							that.setData({
								leftData: posts
							});
						}
					}else{
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 1500
						});
					}
				});
			},
			selectFun(t, e) {
				const a = uni.createSelectorQuery().in(this);
				this.columnNodes = a.selectAll('#left, #right');
				return new Promise(a => {
					this.renderFun(t, 0, e, () => {
						a();
					});
				});
			},

			renderFun(t, e, a, i) {
				if ((t.length > e || a) && 0 !== this.length) {
					this.columnNodes.boundingClientRect().exec(h => {
						const r = h[0];
						this.leftHeight = r?. [0]?.height || -1;
						this.rightHeight = r?. [1]?.height || -1;
						
						if(this.leftHeight >= 0 && this.rightHeight){
							if (this.leftHeight <= this.rightHeight) {
								this.leftData.push(t[e]);
								this.lastSide = 1;
							} else {
								this.rightData.push(t[e]);
								this.lastSide = 2;
							}
						}else{
							if(this.lastSide == 2){
								this.leftData.push(t[e]);
								this.lastSide = 1;
							}else{
								this.rightData.push(t[e]);
								this.lastSide = 2;
							}
						}

						this.setData({
								leftData: this.leftData,
								rightData: this.rightData
							},
							() => {
								this.renderFun(t, ++e, false, i);
							}
						);
					});
				} else {
					if (i) {
						i();
					}
				}
			},

			onTapItem(t, _dataset) {
				/* ---处理dataset begin--- */
				this.datasetHandle(t, _dataset);
				/* ---处理dataset end--- */
				this.emit__(this, 'linitemtap', {
					item: t.currentTarget.dataset.item
				});
			},
			emit__(e, t, l) {
			    e.$emit(
			        t,
			        {
			            detail: l
			        },
			        {
			            bubbles: !0,
			            composed: !0,
			            capturePhase: !0
			        }
			    );
			}
		}
	};
</script>
<style lang="scss">
	.water-flow-container {
	    display: flex;
	    box-sizing: border-box;
	    background: 0 0;
		padding: 0;
		background-color: transparent;
	}
	.water-column {
	    flex: 1;
	}
	.water-flow-container.scene_20001{
		@include background_color(page-body-background-color);
	}
	.water-flow-container.scene_8{
		min-width: 30vh;
	}
</style>
