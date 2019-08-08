//index.js
//获取应用实例
const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        info: ''
    },
    onLoad: function () {
        wx.request({
            url: ip + '/operate/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    this.setData({
                        info: res.data.data,
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: function () {
                                wx.removeStorageSync("loginCode");
                                wx.reLaunch({
                                    url: '../login/login',
                                })
                            }
                        });
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    }
                }

            },

        })
    }
});