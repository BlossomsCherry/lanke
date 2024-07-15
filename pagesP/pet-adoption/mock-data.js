export default {
	mockList() {
		const list = [
			{
				id: 1,
				image: 'https://image5.cnpp.cn/upload/images/20190226/16283049380_880x620.jpg',
				name: '这事一个超级长的测试名称，你要不来看看看',
				gender: 1,
				age: 1,
				content: '浦江王阿姨爱心领养基地救助，一岁金毛妹妹.浦江王阿姨爱心领养基地救助，一岁金毛妹妹浦江王阿姨爱心领养基地救助，一岁金毛妹妹',
				adoptStatus: 0, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 2,
				image: 'https://pic3.zhimg.com/80/v2-2c87074b8cb22a4c9065c5c647574a5a_720w.webp',
				name: '柴犬',
				gender: 0,
				age: 1,
				content: '浦江王阿姨爱心领养基地救助，一岁柴犬弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: true, background: '#ff7a78' },
					{ label: '免疫', isCheck: false, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 3,
				image: 'https://pic2.zhimg.com/80/v2-0087ffabe97323f531ee66a9be11ca19_720w.webp',
				name: '二哈',
				gender: 0,
				age: 2,
				content: '二哈，弟弟，一岁',
				adoptStatus: 0, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: false, background: '#ffbd66' }
				]
			},
			{
				id: 4,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 5,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 6,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 7,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 8,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 9,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 10,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
			{
				id: 11,
				image: 'https://pic4.zhimg.com/80/v2-0082146eebe78ba683969ff4dc40c907_720w.webp',
				name: '串串',
				gender: 0,
				age: 2,
				content: '浦江王阿姨爱心领养基地救助，两岁金毛串弟弟',
				adoptStatus: 1, // 领养状态
				tags: [
					{ label: '绝育', isCheck: false, background: '#ff7a78' },
					{ label: '免疫', isCheck: true, background: '#6ecffc' },
					{ label: '驱虫', isCheck: true, background: '#ffbd66' }
				]
			},
		]

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(list)
			}, 200)
		})
	},

	details() {
		const info = {
			pictureList: [
				{ type: 'image', url: 'https://pic3.zhimg.com/80/v2-2c87074b8cb22a4c9065c5c647574a5a_720w.webp' },
				{ type: 'video', url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', poster: 'https://bige.cdn.bcebos.com/design_previews/covers/1/13794.jpg' },
				{ type: 'image', url: 'https://pic2.zhimg.com/80/v2-0087ffabe97323f531ee66a9be11ca19_720w.webp' }
			],
			name: '一朵白莲',
			avatar: 'https://pic2.zhimg.com/v2-44ce1b82f7e68de4078bf513221619e1_b.webp?consumer=ZHI_MENG',
			wechatId: 'dmybzan',
			mobile: '18888888888',
			petName: '二哈',
			petGender: 0,
			petAge: 2,
			updateDate: '3小时前',
			petIntroduce: '已经满月的小猫现有8只小可爱其中两只白花的，都可以挑选的，自己可以吃猫粮上厕所，虽然调皮了一点完全不用担心随处拉尿，因本人养不了太多转送有爱心家里可以寄养小动物的人，接到后不能弃养',
			isVaccine: 1, // 是否已打疫苗
			isSterilization: 0, // 是否已绝育
			isRepellent: 1, // 是否已驱虫
			isFree: 1, // 是否免费
			cost: '10', // 费用
			adoptStatus: 0, // 领养状态
			condition: ['仅限同城', '适龄绝育', '遛狗拴绳，养猫封网', '全家同意', '有稳定收入']
		}

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(info)
			}, 200)
		})
	}
}
