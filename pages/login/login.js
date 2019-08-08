//logs.js
//获取应用实例

const utilMd5 = require('../../utils/md5.js');
var app = getApp();
var ip = getApp().data.ip;

Page({
    data: {
        name: "",
        password: "",
    },

    onLoad: function () {
        if (wx.getStorageSync('loginCode') !== '') {
            wx.redirectTo({
                url: '../index/index',
            })
        }
    },
    userNameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    userPasswordInput: function (e) {
        this.setData({
            password: e.detail.value
        });
    },

    // 点击登录
    loginBtnClick: function () {
        wx.showLoading({
            title: '请求中...',
        });
        wx.request({
            url: ip + '/index/login',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                "userName": this.data.name,
                "password": utilMd5.hexMD5(utilMd5.hexMD5(this.data.password) + utilMd5.hexMD5(this.data.name)),
            },
            method: 'POST',
            success: (res) => {
                if (res.data.code === 0) {
                    wx.setStorageSync('Authorization', res.data.data);
                    wx.redirectTo({
                        url: '../index/index',
                    })
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
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
