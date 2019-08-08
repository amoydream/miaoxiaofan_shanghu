//index.js
//获取应用实例
const app = getApp();
let ip = getApp().data.ip;
Page({
    data: {
        titleArr: ['货道', '商品'],
        titleIndex: 0,
        tierNumber: '',//层数
        tierIndex: 0,
        tierInfo: '',//货道详情
        tierList: '',
        deviceId: '',
        goodsList: '',
        countData: '',
        ip:ip,
    },
    onLoad: function (options) {
        this.setData({
            deviceId: options.id
        });
        this.getDevice();
    },
    // 选择展示
    chooseIndex: function (e) {
        this.setData({
            titleIndex: e.currentTarget.dataset.index
        });
        if (this.data.titleIndex === 0) {

        } else if (this.data.titleIndex === 1) {
            wx.request({
                url: ip + '/device/traditionalDeviceGoodsByGoods?loginCode=' + wx.getStorageSync("loginCode"),
                header: {"Content-Type": "application/json"},
                method: 'GET',
                data: {
                    deviceId: this.data.deviceId
                },
                success: (res) => {
                    if (res.data.code === 0) {
                        this.setData({
                            goodsList: res.data.data
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    }

                },

            })
        }

    },
    //选择层数内容
    chooseTier: function (e) {
        this.setData({
            tierIndex: e.currentTarget.dataset.index
        });
        this.getTier(this.data.countData, e.currentTarget.dataset.content)
    },
    // 货道层数
    getDevice: function () {
        wx.request({
            url: ip + '/device/traditionalDeviceGoodsByFloor?loginCode=' + wx.getStorageSync("loginCode"),
            header: {"Content-Type": "application/json"},
            method: 'GET',
            data: {
                deviceId: this.data.deviceId
            },
            success: (res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    let tierNumber = data.map((a) => {
                        return a.floor
                    });
                    this.setData({
                        tierNumber: tierNumber,
                        countData: data
                    });
                    this.getTier(data, tierNumber[0])
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },

        });
    },

    getTier: function (data, tierNumber) {
        let tierList;
        for (let i = 0; i < data.length; i++) {
            if (tierNumber === data[i].floor) {
                tierList = data[i];
            }
        }
        let tierList1 = [];
        tierList.channelList.reduce((item, next) => {
            next.foo.hasOwnProperty("goods") && tierList1.push(next);
            return next;
        }, {foo: {}});

        tierList.channelList = tierList1;
        console.log(tierList);
        this.setData({
            tierList: tierList
        });
    },

});