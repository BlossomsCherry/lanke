<template>
	<view class="chaohua-page">
		<view class="data-container">
			<!-- 顶部选项卡 -->
			<view class="navbar flex-bottom" :style="{height: `calc(` + sys_navBar + `)`}">
				<view class="left-icon flex-left" @click.native="item1_click()">
					<u-icon name="integral" size="44"></u-icon>
				</view>
				<scroll-view id="data-nav-bar" class="data-bar" scroll-x>
					<view v-for="(item, index) in navBars" :key="item.id" class="nav-item"
						:class="{ current: index === tabCurrentIndex }" :id="'tab' + index"
						@click.stop="changeTab(index)">
						{{ item.name }}
					</view>
				</scroll-view>
				<view class="right-icon flex-right sumer-icon" v-html="`&#xe69c;`"></view>
			</view>
			<!-- 内容部分 -->
			<swiper id="swiper" class="chaohua-container"
				:style="{marginTop: `calc(` + sys_navBar + `)`, height: `calc(100vh - ` + sys_tabBar + ` - ` + sys_navBar + `)`}"
				:current="tabCurrentIndex" @change="changeTab">
				<swiper-item>
					<z-paging ref="kantie_paging" v-model="kantie_weibo" @query="kantie_query"
						empty-view-text="抱歉，暂时还没有相关数据！">
						<view class="panel-scroll-box">
							<view class="kantie">
								<view class="u-demo-block__content m-t-10">
									<!-- 看贴-搜索 -->
									<view class="u-page__tag-item mx-2 pt-2" @click.stop="item2_click()">
										<u-search v-model="value8" :show-action="false" input-align="center"></u-search>
									</view>
									<!-- 看贴-顶部推荐超话 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:24rpx;color:#888;" :border="false" title="我的超话"
											value="一键签到" isLink @click.stop="item3_click()"></u-cell>
									</view>
									<u-scroll-list @right="right" @left="left" :indicator="false">
										<view class="scroll-list" style="flex-direction: row;">
											<view class="scroll-list__goods-item"
												v-for="(item, index) in kantie_recommand" :key="index"
												@click.stop="item4_click()"
												:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
												<image class="scroll-list__goods-item__image" :src="item.thumbnail"
													mode=""></image>
												<text class="scroll-list__goods-item__text">{{ item.title }}</text>
												<text class="scroll-list__goods-item__text2">{{ item.desc }}</text>
											</view>
											<view class="scroll-list__show-more" @click.stop="item5_click()">
												<text class="scroll-list__show-more__text">查看更多</text>
												<u-icon name="arrow-leftward" color="#f56c6c" size="12"></u-icon>
											</view>
										</view>
									</u-scroll-list>
									<!-- 看贴-超话分类 -->
									<scroll-view :scroll-x="true" class="scroll-list2">
										<view class="dataInfo">
											<view class="dataList" v-for="(item, index) in kantie_cate" :key="index">
												<view class="list" :style="{background: item.bg}"
													@click.stop="item6_click(index)">
													<u--text :prefixIcon="item.icon"
														iconStyle="color: #e50; font-size: 18px"
														:text="item.name"></u--text>
													<view class="content flex-left mt-2">
														<view class="left">
															<u-avatar :src="item.avatar" size="84"
																shape="square"></u-avatar>
														</view>
														<view class="right">
															<view class="title">{{item.title}}</view>
															<view class="desc">{{item.desc}}</view>
														</view>
														<view class="button" @click.stop="item7_click(index)">
															去领取
														</view>
													</view>
												</view>
											</view>
										</view>
									</scroll-view>
									<!-- 看贴-三个按钮 -->
									<view class="btn-list1 flex-center">
										<view class="u-page__tag-item" @click.stop="item8_click()">
											<u-button text="必刷超话" size="small" shape="circle" icon="thumb-up-fill" plain
												type="warning"></u-button>
										</view>
										<view class="u-page__tag-item" @click.stop="item9_click()">
											<u-button text="附近" size="small" shape="circle" icon="integral-fill" plain
												type="warning"></u-button>
										</view>
										<view class="u-page__tag-item" @click.stop="item10_click()">
											<u-button text="美好生活" size="small" shape="circle" icon="gift-fill" plain
												type="warning"></u-button>
										</view>
									</view>
									<view class="gap"></view>
									<!-- 微博列表 -->
									<view class="u-demo-block mx-3">
										<view class="u-demo-block__content mt-3" v-for="(item, index) in kantie_weibo"
											:key="index">
											<view class="album" @click.stop="item11_click()">
												<view class="album-info" @click.stop="item12_click()">
													<view class="left">
														<u-avatar :src="item.author.avatar" size="84"
															shape="circle"></u-avatar>
													</view>
													<view class="right ml-2">
														<view class="title">{{item.author.name}}</view>
														<view class="desc flex-left">
															<view class="time mr-2">{{item.author.time}}</view>
															<u--text prefixIcon="map" color="#77a0ff"
																iconStyle="color: #77a0ff; font-size: 26rpx;" size="26"
																:text="item.author.address"></u--text>
														</view>
														<view class="focus" @click.stop="item13_click()">
															<u-button text="关注" size="small" shape="circle" icon="plus"
																plain type="warning"></u-button>
														</view>
													</view>
												</view>
												<view class="album__content">
													<u--text margin="12px 0 12px 0" lineHeight="23px" align="justify"
														:text="item.content"></u--text>
													<u-album :urls="item.urls" v-if="item.type == 'images'"
														:rowCount="(item.urls.length == 2 || item.urls.length == 4) ? 2 : 3"
														:maxCount="(item.urls.length == 2 || item.urls.length == 4) ? 4 : 9"></u-album>
													<video v-else-if="item.type == 'video'" :src="item.urls[0]"
														loop></video>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</z-paging>
				</swiper-item>
				<swiper-item>
					<z-paging ref="square_paging" v-model="square_guess" @query="square_query"
						empty-view-text="抱歉，暂时还没有相关数据！">
						<view class="panel-scroll-box">
							<view class="square">
								<view class="u-demo-block__content m-t-10">
									<!-- 广场-搜索 -->
									<view class="u-page__tag-item mx-2 pt-2" @click.stop="item14_click()">
										<u-search v-model="value8" :show-action="false" input-align="center"></u-search>
									</view>
									<!-- 广场-顶部轮播图 -->
									<view class="u-page__tag-item mx-2 mt-2">
										<u-swiper :list="square_ads" indicator height="200" indicatorMode="line" circular
											@click.stop="item15_click"></u-swiper>
									</view>
									<!-- 广场-超话分类 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:12px;color:#888;" :border="false" title="超话分类"
											value="更多" isLink @click.stop="item16_click()"></u-cell>
									</view>
									<scroll-view :scroll-x="true" class="scroll-list3">
										<view class="cateInfo">
											<view class="cate-list" v-for="(cate, pos) in square_cate" :key="pos"
												:style="{background: cate.color + '16'}">
												<view class="cate-title" :style="{background: cate.color + '10'}">
													<u--text :prefixIcon="cate.icon" :color="cate.color"
														iconStyle="color: #e50; font-size: 18px"
														:text="cate.name"></u--text>
												</view>
												<view class="user-list py-2">
													<view class="user-item" v-for="(item, index) in cate.list"
														:key="index" @click.stop="item17_click()">
														<view class="left">
															<u-avatar :src="item.avatar" size="84"
																shape="square"></u-avatar>
														</view>
														<view class="right">
															<view class="title">{{item.name}}</view>
															<view class="desc">{{item.desc}}</view>
														</view>
														<view class="button" @click.stop="focus_click(item.id)">
															<u-button text="关注" size="small" shape="circle" icon="plus"
																plain type="warning"></u-button>
														</view>
													</view>
												</view>
											</view>
										</view>
									</scroll-view>
									<!-- 广场-三个按钮 -->
									<view class="btn-list1 flex-center">
										<view class="u-page__tag-item" @click.stop="item18_click()">
											<u-button text="必刷超话" size="small" shape="circle" icon="thumb-up-fill" plain
												type="warning"></u-button>
										</view>
										<view class="u-page__tag-item" @click.stop="item19_click()">
											<u-button text="附近" size="small" shape="circle" icon="integral-fill" plain
												type="warning"></u-button>
										</view>
										<view class="u-page__tag-item" @click.stop="item20_click()">
											<u-button text="美好生活" size="small" shape="circle" icon="gift-fill" plain
												type="warning"></u-button>
										</view>
									</view>
									<view class="gap"></view>
									<!-- 广场-名人空降 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:12px;color:#888;" :border="false" title="名人空降"
											value="围观空降现场" isLink></u-cell>
									</view>
									<u-scroll-list @right="right" @left="left" :indicator="false">
										<view class="scroll-list" style="flex-direction: row;">
											<view class="scroll-list__goods-item" v-for="(item, index) in square_star"
												:key="index" @click.stop="item21_click()"
												:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
												<image class="scroll-list__goods-item__image round"
													:src="item.thumbnail" mode=""></image>
												<text class="scroll-list__goods-item__text">{{ item.title }}</text>
												<text class="scroll-list__goods-item__text2">{{ item.desc }}</text>
											</view>
											<view class="scroll-list__show-more" @click.stop="item22_click()">
												<text class="scroll-list__show-more__text">查看更多</text>
												<u-icon name="arrow-leftward" color="#f56c6c" size="12"></u-icon>
											</view>
										</view>
									</u-scroll-list>
									<view class="gap"></view>

									<!-- 广场-今天地生日的超话 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:12px;color:#888;" :border="false" title="今天过生日的超话"
											value="更多" isLink @click.stop="item23_click()"></u-cell>
									</view>
									<u-scroll-list @right="right" @left="left" :indicator="false">
										<view class="scroll-list" style="flex-direction: row;">
											<view class="scroll-list__goods-item" @click.stop="item24_click()"
												v-for="(item, index) in square_birthday" :key="index"
												:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
												<image class="scroll-list__goods-item__image" :src="item.thumbnail"
													mode=""></image>
												<text class="scroll-list__goods-item__text">{{ item.title }}</text>
											</view>
											<view class="scroll-list__show-more" @click.stop="item25_click()">
												<text class="scroll-list__show-more__text">查看更多</text>
												<u-icon name="arrow-leftward" color="#f56c6c" size="12"></u-icon>
											</view>
										</view>
									</u-scroll-list>
									<view class="gap"></view>

									<!-- 广场-绝美壁纸上新 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:12px;color:#888;" :border="false" title="绝美壁纸上新"
											value="更多" isLink @click.stop="item26_click()"></u-cell>
									</view>
									<u-scroll-list @right="right" @left="left" :indicator="false">
										<view class="scroll-list" style="flex-direction: row;">
											<view class="scroll-list__bg-item" v-for="(item, index) in square_wallpaper"
												:key="index" :style="{backgroundImage: `url(`+item.bg+`)`}"
												@click.stop="item27_click()"
												:class="[(index === 9) && 'scroll-list__goods-item--no-margin-right']">
												<view class="data flex-left">
													<image class="__image round" :src="item.thumbnail" mode=""></image>
													<text class="__text">{{ item.name }}</text>
													<text class="__text2">{{ item.desc }}</text>
												</view>
											</view>
											<view class="scroll-list__show-more" @click.stop="item28_click()">
												<text class="scroll-list__show-more__text">查看更多</text>
												<u-icon name="arrow-leftward" color="#f56c6c" size="12"></u-icon>
											</view>
										</view>
									</u-scroll-list>
									<view class="gap"></view>

									<!-- 广场-猜你喜欢 -->
									<view class="u-page__tag-item mx-2 py-2">
										<u-cell size="mini" titleStyle="font-size:28rpx;font-weight:600;color:#333;"
											rightIconStyle="font-size:12px;color:#888;" :border="false" title="猜你喜欢"
											value="更多" isLink></u-cell>
									</view>
									<view class="user-list">
										<view class="user-item" v-for="(item, index) in square_guess" :key="index"
											@click.stop="item29_click()">
											<view class="left">
												<u-avatar :src="item.avatar" size="110" shape="square"></u-avatar>
											</view>
											<view class="right">
												<view class="title">{{item.name}}</view>
												<view class="desc">{{item.desc}}</view>
												<view class="desc2">{{item.desc2}}</view>
											</view>
											<view class="button" @click.stop="focus_click(item.id)">
												<u-button text="关注" size="small" shape="circle" icon="plus" plain
													type="warning"></u-button>
											</view>
										</view>
									</view>


								</view>

							</view>
						</view>
					</z-paging>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import data from '@/pages/tabbar/config/data.js'; // 引入封装的第二层获取知乎热榜接口的功能函数
	let windowWidth = 0,
		scrollTimer = false,
		tabBar,
		that;
	export default {
		computed: {
			sys_statusBar() {
				console.error(uni.getSystemInfoSync().statusBarHeight)
				return uni.getSystemInfoSync().statusBarHeight + 'px'
			},
			sys_navBar() {
				return  '(' + uni.getSystemInfoSync().statusBarHeight + 'px + 80rpx)'
			},
			sys_tabBar() {
				return '(' + uni.getSystemInfoSync().safeAreaInsets.bottom + 'px + 45px)'
			}
		},
		data() {
			return {
				pagebgcolorClass: 'pagebg_white',fph: false,mytoast_data: {},pageTheme: 'default',page__scene__: 0,
				tabCurrentIndex: 0, //当前选项卡索引
				navBars: [{
						id: 1,
						name: '看贴',
						refreshing: 0,
						more_status: 0,
						page: 0
					},
					{
						id: 2,
						name: '广场',
						refreshing: 0,
						more_status: 0,
						page: 0
					}
				],
				// 看贴-顶部推荐超话
				kantie_recommand: [],
				// 看贴-分类
				kantie_cate: [],
				// 广场-顶部轮播
				square_ads: [],
				// 广场-超话分类
				square_cate: [],
				// 广场-名人空降
				square_star: [],
				// 广场-今天过生日的超话
				square_birthday: [],
				// 广场-绝美壁纸上新
				square_wallpaper: [],
				// 广场-猜你喜欢
				square_guess: [],
				// 看贴-微博
				kantie_weibo: []
			}
		},
		onLoad(options) {
			// this.tabCurrentIndex = this.tab;
			// this.init_data(2);
		},
		onTabItemTap : function(e) {
			// #ifndef MP-WEIXIN
			if(e.pagePath == 'pages/tabbar/chaohua/chaohua'){
				uni.wen.util.doVibrateShort();
			}
			// #endif
		},
		methods: {
			kantie_query(page, size) {
				// console.error('kantie_query')
				// 去服务器获取最新数据，我这里写死
				setTimeout(() => {
					// 除列表外的其他数据重新获取最新的，根据业务需求修改
					this.init_data(0);
					this.$refs.kantie_paging.complete(data.kantie_weibo.sort(() => Math.random() - 0.5));
				}, 1000);
			},
			square_query(page, size) {
				// console.error('kantie_query')
				// 去服务器获取最新数据，我这里写死
				setTimeout(() => {
					// 除列表外的其他数据重新获取最新的，根据业务需求修改
					this.init_data(1);
					this.$refs.square_paging.complete(data.square_guess.sort(() => Math.random() - 0.5));
				}, 1000);
			},
			init_data(tab) {
				//从服务器获取数据，我这是写死 
				if (tab == 0) {
					this.kantie_recommand = data.kantie_recommand.sort(() => Math.random() - 0.5);
					this.kantie_cate = data.kantie_cate.sort(() => Math.random() - 0.5);
					// this.kantie_weibo = data.kantie_weibo;
				}
				if (tab == 1) {
					this.square_ads = data.square_ads.sort(() => Math.random() - 0.5);
					this.square_cate = data.square_cate.sort(() => Math.random() - 0.5);
					this.square_star = data.square_star.sort(() => Math.random() - 0.5);
					this.square_birthday = data.square_birthday.sort(() => Math.random() - 0.5);
					this.square_wallpaper = data.square_wallpaper.sort(() => Math.random() - 0.5);
					// this.square_guess = data.square_guess;
				}
			},
			//tab切换
			async changeTab(e) {
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if (typeof e === 'object') {
					index = e.detail.current
				}
				this.tabCurrentIndex = index;
			},
			item1_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item2_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item3_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item4_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item5_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item6_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item7_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item8_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item9_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item10_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item11_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item12_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item13_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item14_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item15_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item16_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item17_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item18_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item19_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item20_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item21_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item22_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item23_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item24_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item25_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item26_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item27_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item28_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			item29_click() {
				uni.showToast({
					title: '触发点击事件'
				});
			},
			focus_click(id) {
				uni.showToast({
					title: '触发点击事件'
				});
			},
		}
	}
</script>
<style lang="scss">
	@import './chaohua.scss';
</style>