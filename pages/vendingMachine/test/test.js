//index.js
//获取应用实例
const app = getApp();
let ip = getApp().data.ip;
Page({
    data: {
        switch1: 1,
        switch2: 1,
        switch3: 1,
        id: ''
    },
    onLoad: function (options) {
        this.setData({
            id: options.id
        })
    },
    open1() {
        if (this.data.switch1 === 1) {
            this.data.switch1 = 0;
        } else if (this.data.switch1 === 0) {
            this.data.switch1 = 1;
        }
        this.setData({
            switch1: this.data.switch1
        })
    },
    open2() {
        if (this.data.switch2 === 1) {
            this.data.switch2 = 0;
        } else if (this.data.switch2 === 0) {
            this.data.switch2 = 1;
        }
        this.setData({
            switch2: this.data.switch2
        })
    },
    open3() {
        if (this.data.switch3 === 1) {
            this.data.switch3 = 0;
        } else if (this.data.switch3 === 0) {
            this.data.switch3 = 1;
        }
        this.setData({
            switch3: this.data.switch3
        })
    },
    skipMoreTest() {
        wx.navigateTo({
            url: '../moreTest/moreTest?id=' + this.data.id
        })
    },
    allTest(){
        wx.request({
            url: ip + '/channelGoods/sendAllTest',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                deviceId: this.data.id
            },
            method: 'POST',
            success: (res) => {
                wx.showModal({
                    title: "提示",
                    content: res.data.data
                });
                this.getData();
            },
        });
    }
});