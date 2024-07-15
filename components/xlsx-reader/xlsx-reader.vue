<template>
	<view>
		<view v-if="showTable">
			<scroll-view class="scroll-view" scroll-x="true">
				<view class="pagination">
					<view v-if="sheets.length > 1" class="tab" :class="index == sheetIndex ?'tab-selected':'' "
						v-for="(item,index) in sheets" :key="index" @click="selectSheet(index)">
						{{item.name}}
					</view>
				</view>
			</scroll-view>

			<!-- 表结构 -->
			<uni-table ref="table" border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" v-for="(item,index) in tableTitles" :key="index">{{item}}</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in tableList" :key="index">
					<uni-td align="center" v-for="(items,i) in item" :key="i">{{items}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
</template>
<script>
	import * as XLSX from 'xlsx';
	export default {
		props: {
			// 文件大小上限 M
			size: {
				type: Number,
				default: 10
			}
		},
		data() {
			return {
				// 本地文件路径
				filePath: '',
				// 文件名
				fileName: '',
				// table表状态
				showTable: false,
				// 表数据
				workbookData: {},
				// sheet列表
				sheets: [],
				// 选中索引
				sheetIndex: 0,
				// 表格表头
				tableTitles: [],
				// 表格数据
				tableList: [],
				// app 文件对象
				// appFile: null,
				// 文件上限 为了正常显示只能传一个文件
				count: 1,
			}
		},

		methods: {
			// 选择文件
			chooseFile() {
				let that = this;
				// #ifdef MP-WEIXIN
				// 如果是微信小程序，从聊天记录选择文件
				wx.chooseMessageFile({
					count: 1,
					type: "file",
					extension: ['xls', 'xlsx'],
					success(res) {
						this.filePath = res.tempFiles[0].path
						this.fileName = res.tempFiles[0].name.split('.')[0]
						// 获取文件信息流
						var FileSystemManager = wx.getFileSystemManager();
						FileSystemManager.readFile({
							filePath: res.tempFiles[0].path,
							encoding: 'base64',
							success(data) {
								// 解析excel信息流
								const workbook = XLSX.read(data.data, {
									type: "base64",
									cellText: false,
									cellDates: true,
								});

								that.workbookData = workbook;
								that.sheets = workbook.Workbook.Sheets;

								that.selectSheet(0)
							},
							fail(err) {
								console.log('fail', err)
							}
						})
					}
				})
				// #endif
				// #ifdef H5
				uni.chooseFile({
					count: 1, //默认100
					extension: ['.xls', '.xlsx'],
					success: function(res) {
						this.filePath = res.tempFiles[0].path
						this.fileName = res.tempFiles[0].name.split('.')[0]
						// 获取文件流
						const fileReader = new FileReader();
						fileReader.onload = ev => {
							try {
								const data = ev.target.result;

								const workbook = XLSX.read(data, {
									type: "binary",
									cellText: false,
									cellDates: true,
								});
								that.workbookData = workbook;
								that.sheets = workbook.Workbook.Sheets;
								that.selectSheet(0)
							} catch (e) {
								console.error("上传失败", e)
							}
						}
						const blob = new Blob([res.tempFiles[0]]);
						fileReader.readAsBinaryString(blob);

					}
				});
				// #endif
				// #ifdef APP
				if (this._size >= this.count) {
					console.log(`只允许上传${this.count}个文件`)
					return;
				}
				// #endif
			},
			// 查询sheet数据
			selectSheet(i) {
				if (!this.showTable) {
					this.showTable = true;
				}
				this.sheetIndex = i;
				let key = this.sheets[i].name;
				//循环读取每个文件
				const header = XLSX.utils.sheet_to_json(this.workbookData.Sheets[key], {
					header: 1,
				});

				this.tableTitles = header[0];
				this.tableList = header.slice(1)
			},
			// // 数据处理
			// handleNetX(sheetArray, header) {
			// 	const totalTable = [];
			// 	for (let index in sheetArray) {
			// 		let row = {};
			// 		header.map(key => {
			// 			if (typeof sheetArray[index][key] === "object") {
			// 				row[key] = this.handleExcelDate(sheetArray[index][key]);
			// 			} else {
			// 				row[key] = sheetArray[index][key];
			// 			}
			// 		});
			// 		totalTable.push(row);
			// 	}
			// 	this.tableList = totalTable;
			// },
			// // 日期格式化
			// handleExcelDate(date) {
			// 	if (!date) {
			// 		return;
			// 	}
			// 	return new Date(date.getTime()).format('YYYY-MM-DD');
			// }
		}
	}
</script>
<style lang="scss">
	.scroll-view {
		width: 100%;
		white-space: nowrap;

		.pagination {
			margin: 0 auto;
			padding: 0 auto;

			.tab {
				width: 120upx;
				display: inline-block;
				margin: 0 10rpx;
				padding: 20upx 0;
				margin-top: 10upx;
				text-align: center;
				border: 1px solid #007aff;

				&-selected {
					background-color: #007aff;
					color: #ffffff;
				}
			}
		}
	}
</style>