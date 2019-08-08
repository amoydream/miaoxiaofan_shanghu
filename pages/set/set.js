const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        currentTabsIndex: 0
    },
    tel: function () {
        wx.makePhoneCall({
            phoneNumber: '400-002-5588',
        })
    },
    // 退出登录
    quit: function () {
        wx.showModal({
            title: "提示",
            content: '确认退出吗',
            success: (res) => {
                if (res.confirm) {
                    wx.removeStorageSync("loginCode");
                    wx.reLaunch({
                        url: '../login/login',
                    })
                }
            }

        })

    },
    onShareAppMessage: function () {
        return {
            title: '合作商平台',
        }
    },
});
