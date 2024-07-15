/**
 * 获取系统信息
 */
class SystemInfo {
    static fetchAllInfo() {
        const menuButton = uni.getMenuButtonBoundingClientRect();
        const systemInfo = uni.getSystemInfoSync();
        const statusBarHeight = systemInfo.statusBarHeight;
        const headerHeight = (menuButton.top - systemInfo.statusBarHeight) * 2 + menuButton.height;
        let data = {
            source: {
                menu: menuButton,
                system: systemInfo
            },
            statusBarHeight: statusBarHeight,
            headerHeight: headerHeight,
            headerRight: systemInfo.windowWidth - menuButton.left
        };
        uni.setStorageSync('SystemInfo', data);
        return data;
    }

    static getInfo() {
        let storageInfoSync = uni.getStorageSync('SystemInfo');

        if (!storageInfoSync) {
            storageInfoSync = this.fetchAllInfo();
        }

        return storageInfoSync;
    }
}

export default SystemInfo;
