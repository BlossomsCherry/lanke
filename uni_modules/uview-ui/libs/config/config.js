// 此版本发布于2023-03-27
const version = '2.0.36'

// 开发环境才提示，生产环境不会提示
if (process.env.NODE_ENV === 'development') {
	console.log(`\n %c uView V${version} %c https://uviewui.com/ \n\n`, 'color: #ffffff; background: #3c9cff; padding:5px 0; border-radius: 5px;');
}

export default {
    v: version,
    version,
    // 主题名称
    type: [
        'primary',
        'success',
        'info',
        'error',
        'warning'
    ],
    // 颜色部分，本来可以通过scss的:export导出供js使用，但是奈何nvue不支持
    color: {
        'uni-color-primary': '#fc3a72',
        'uni-color-warning': '#ff9900',
        'uni-color-success': '#19be6b',
        'uni-color-error': '#fa3534',
        'uni-color-info': '#909399',
        'font-color-dark': '#333333',
        'font-color-base': '#606266',
        'font-color-light': '#909399',
        'font-color-disabled': '#c0c4cc'
    },
	// 默认单位，可以通过配置为rpx，那么在用于传入组件大小参数为数值时，就默认为rpx
	unit: 'rpx'
}
