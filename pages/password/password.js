const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        oldPassword: '',
        newPassword: '',
        amendPassword: '',
    },

    oldPassword: function (e) {
        this.setData({
            oldPassword: e.detail.value
        })
    },
    newPassword: function (e) {
        this.setData({
            newPassword: e.detail.value
        })
    },
    amendInput: function (e) {
        this.setData({
            amendPassword: e.detail.value
        })
    },

    // 确认修改
    amend: function () {
        wx.request({
            url: ip + '/partner/modifyPassword',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'POST',
            data: {
                old: this.data.oldPassword,
                new1: this.data.newPassword,
                new2: this.data.amendPassword
            },
            success: (res) => {
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.msg,
                        success: function (res) {
                            if (res.data.code === 0) {
                                wx.showModal({
                                    title: "提示",
                                    content: '修改成功'
                                })
                            }
                        }
                    });

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
        });
    }
});
