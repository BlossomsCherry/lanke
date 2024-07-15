<template>
	<view class="category-page-content" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
		<scroll-view scroll-y class="left-aside"  :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
			<view v-for="item in cats_clone" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)" v-if="item.flag">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop" :style="'height: '+ contentHieght +';min-height: '+ contentHieght + ';max-height: '+ contentHieght">
			<block v-for="item in cats_clone" :key="item.id"  v-if="item.flag">
				<block v-if="item.sub">
					<view v-for="subitem in item.sub" :key="subitem.id" class="s-list" :id="'main-'+subitem.id"  v-if="subitem.flag">
						<text class="s-item">{{subitem.name}}</text>
						<view class="t-list" v-if="subitem.sub">
							<view :class="'t-item ' + (selects.includes( ssubitem.id ) ? 'active' : '') " v-for="(ssubitem, index) in subitem.sub" :key="index" @tap.stop.prevent="select( item.id, subitem.id, ssubitem.id)"  v-if="ssubitem.flag">
								<view class="t-item-inner">
									<image class="_image" :src="ssubitem.pic"></image>
									<text class="_text">{{ssubitem.name}}</text>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<block>
				<view style="background-color: transparent;height: 50vh;"></view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"category-select",
		computed:{
			contentHieght: {
			  get() {
			    let that = this;
				return ' 70vh ';
			  },
			  set(v) {}
			},
		},
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				cats: [],
				cats_clone: [],
			};
		},
		mounted() {
			let that = this;
			that.getShopClassify();
		},
		props: {
			selects: {
				type: Array,
				required: true,
				default: () => []
			},
			shopType: {
				type: Number,
				default: 0,
				required: true,
			}
		},
		watch:{
			shopType: {
				handler: function(newVal, oldVal) {
					let that = this;
					that.filter_shop_type();
				},
			},
		},
		methods: {
			filter_shop_type(){
				let that = this;
				if(that.cats){
					let cats_clone = [];
					
					that.cats.forEach((v1, k1)=>{
						let flag = false;
						let v1_new = uni.wen.util.deepClone(v1);
						if(v1_new.sub){
							v1_new.sub.forEach((v2, k2)=>{
								if(v2.sub){
									v2.sub.forEach((v3, k3)=>{
										
										if(that.shopType == 1 && v3.is_shop_type1 == 1){
											flag = true;
										}
										if(that.shopType == 2 && v3.is_shop_type2 == 1){
											flag = true;
										}
										if(that.shopType == 3 && v3.is_shop_type3 == 1){
											flag = true;
										}
										if(that.shopType == 4 && v3.is_shop_type4 == 1){
											flag = true;
										}
										if(flag){
											v1_new.flag = true;
											v1_new.sub[k2].flag = true;
											v1_new.sub[k2].sub[k3].flag = true;
										}
									})
								}
							})
						}
						if(flag){
							cats_clone.push(v1_new);
						}
					})
					
					
					if(cats_clone && cats_clone.length > 0){
						that.cats_clone = cats_clone;
						that.currentId = that.cats_clone[0].id;
						
						setTimeout(function(){
							that.calcSize();
						}, 500)
						
					}
					
				}
			},
			select(first_id, second_id, third_id){
				let that = this;
				let obj = {
					'first': null,
					'second': null,
					'third': null
				};
				that.cats_clone.forEach((v,k)=>{
					if(v.id == first_id){
						obj.first = v;
						if(v.sub){
							v.sub.forEach((v2, k2) => {
								if(v2.id == second_id){
									obj.second = v2;
									if(v2.sub){
										v2.sub.forEach((v3, k3) => {
											if(v3.id == third_id){
												obj.third = v3;
											}
										})
									}
								}
							})
						}
					}
				})
				that.$emit('select', obj );
			},
			getShopClassify() {
				let that = this;
				uni.wen.util.request(uni.wen.api.ApiRootUrl + 'shop/classify', {
					hierarchy: 1,
				}).then(function(res) {
					if(res.status){
						that.cats = res.data;
						if(that.cats){
							that.filter_shop_type()
						}
					}
				
				});
			},
			async loadData(){
				let list = await this.$api.json('cateList');
				list.forEach(item=>{
					if(!item.pid){
						this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
					}else if(!item.picture){
						this.slist.push(item); //没有图的是2级分类
					}else{
						this.tlist.push(item); //3级分类
					}
				}) 
			},
			//一级分类点击
			tabtap(item){
				let that = this;
				if(!that.sizeCalcState){
					that.calcSize();
				}
				for(let i = 0; i < that.cats_clone.length; i++){
					if(item.id == that.cats_clone[i].id){
						that.tabScrollTop = that.cats_clone[i].sub[0].top;
						that.currentId = that.cats_clone[i].id;
						break;
					}
				}
			},
			//右侧栏滚动
			asideScroll(e){
				let that = this;
				if(!this.sizeCalcState){
					this.calcSize();
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let that = this;
				let h = 0;
				that.cats_clone.forEach(item=>{
					if(item.sub){
						item.sub.forEach(sitem => {
							let view = uni.createSelectorQuery().select("#main-" + sitem.id);
							view.fields({
								size: true
							}, data => {
								sitem.top = h;
								h += data.height;
								sitem.bottom = h;
							}).exec();
						})
					}
					
				})
				that.sizeCalcState = true;
			},
		}
	}
</script>

<style lang="scss">
.category-page-content {
		height: 100%;
		display: flex;
	.left-aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		@include background_color(page-box-background-color);
		.f-item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100rpx;
			font-size: $uni-font-size-base;
			@include color(color-light-dark);
			position: relative;
			&.active{
				@include color(color-primary);
				@include background_color(page-gray-background-color);
				&:before{
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 36rpx;
					width: 8rpx;
					background-color: $uni-color-primary;
					border-radius: 0 4px 4px 0;
					opacity: .8;
				}
			}
		}
	}
	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20rpx;
		height: 100%;
		@include background_color(page-body-background-color);
		.s-item{
			display: flex;
			align-items: center;
			height: 70rpx;
			padding-top: 8rpx;
			font-size: $uni-font-size-base;
			@include color(color-dark);
		}
		.t-list{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			@include background_color(page-box-background-color);
			padding-top: 30rpx;
			&:after{
				content: '';
				flex: 99;
				height: 0;
			}
		}
		.t-item{
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 174rpx;
			padding-bottom: 30rpx;
			.t-item-inner{
				margin: auto;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				border: 1rpx solid transparent;
				width: 150rpx;
				height: 150rpx;
				border-radius: 10rpx;
				._image{
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 6rpx;
				}
				._text{
					font-size: $uni-font-size-sm-base;
					@include color(color-lighter-er-dark);
				}
			}
			
		}
		.t-item.active{
			.t-item-inner{
				@include border_color(border-color-primary);
			}
		}
	}
}
</style>