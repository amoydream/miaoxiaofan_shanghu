//index.js
//获取应用实例
const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        today: '',
        todayGain: '',
        yesterday: '',
        month: ''
    },
    onLoad: function () {
        wx.request({
            url: ip + '/order/index',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    this.setData({
                        today: data.today,
                        todayCost: data.todayCost,
                        todayGain: data.todayGain,
                        yesterday:data.yesterday
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
    },
    onShareAppMessage: function () {
        return {
            title: '合作商平台',
        }
    },
});
