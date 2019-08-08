const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        goodsInfo: '',//商品信息,
        deviceName: "",//机器名称
        date: "",//交易日期
        realPrice: "",//实付金额
        orderNum: '',//订单编号
        orderId: '',
        width: 0,
        deviceStatus: '',
        deviceId: '',
        hidden: true,
        items: [
            {name: 'money', value: '金额', checked: 'true'},
            {name: 'channel', value: '货道商品数', checked: 'true'},
        ],
        money: true,
        channel: true,
        status: '',
        orderDetails: '',
        ip:ip
    },

    onLoad: function (options) {
        this.setData({
            orderId: options.id
        });
        wx.request({
            url: ip + '/order/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: options.id
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    this.setData({
                        goodsInfo: res.data.data.details,
                        deviceId: res.data.data.deviceId,
                        deviceStatus: res.data.data.device.status,
                        orderDetails: res.data.data
                    });
                }
            },
        });
    },

    handle: function () {
        if (this.data.width == 0) {
            this.setData({
                width: 490
            })
        } else {
            this.setData({
                width: 0
            })
        }

    },

    // 关闭设备
    close: function () {
        if (this.data.deviceStatus == 1) {
            wx.request({
                url: ip + '/device/disableDevice',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    ids: this.data.deviceId
                },
                method: 'POST',
                success: (res) => {
                    console.log();
                    if (res.data.code == 0) {
                        this.setData({
                            deviceStatus: 0
                        });
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    }

                },
            });
        } else {
            wx.request({
                url: ip + '/device/enableDevice',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    ids: this.data.deviceId
                },
                method: 'POST',
                success: (res) => {
                    console.log();
                    if (res.data.code == 0) {
                        this.setData({
                            deviceStatus: 1
                        });
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    }

                },
            });
        }
    },
    // 货道测试
    test: function () {
        wx.request({
            url: ip + '/order/channelDeBug',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.orderId
            },
            method: 'POST',
            success: (res) => {
                console.log();
                if (res.data.code == 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },
        });
    },
    // 货道修正
    channelRepair: function () {
        wx.request({
            url: ip + '/order/channelRepair',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.orderId
            },
            method: 'POST',
            success: (res) => {
                console.log();
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },
        });
    },
    // 订单修正
    orderRepair: function () {
        this.setData({
            hidden: false,
            status: 1
        });
    },
    // 订单&货道修正
    orderAndChannelRepair: function () {
        this.setData({
            hidden: false,
            status: 2
        });
    },
    // 取消
    listenerCancel: function () {
        this.setData({
            hidden: true
        })
    },
    // 确认
    listenerConfirm: function () {
        if (this.data.status == 1) {
            wx.request({
                url: ip + '/order/orderRepair',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    id: this.data.orderId,
                    money: this.data.money,
                    channel: this.data.channel
                },
                method: 'POST',
                success: (res) => {
                    console.log(res);
                    if (res.data.code == 0) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: _ => {
                                this.setData({
                                    hidden: true
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: _ => {
                                this.setData({
                                    hidden: true
                                })
                            }
                        })
                    }

                },
            });
        } else {
            wx.request({
                url: ip + '/order/orderAndChannelRepair',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    id: this.data.orderId,
                    money: this.data.money,
                    channel: this.data.channel
                },
                method: 'POST',
                success: (res) => {
                    console.log();
                    if (res.data.code == 0) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: _ => {
                                this.setData({
                                    hidden: true
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: _ => {
                                this.setData({
                                    hidden: true
                                })
                            }
                        })
                    }

                },
            });
        }
    },
    // 选择金额或者商品数
    checkboxChange: function (e) {
        console.log(e.detail.value);
        console.log();
        this.setData({
            money: e.detail.value.includes('money'),
            channel: e.detail.value.includes('channel')
        })
    },
    // 线上退款
    onLine(){
        wx.request({
            url: ip + '/order/refundOnLine',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.orderId
            },
            method: 'POST',
            success: (res) => {
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },
        });
    },
    // 线下退款
    offLine(){
        wx.request({
            url: ip + '/order/refundOffLine',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.orderId
            },
            method: 'POST',
            success: (res) => {
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },
        });
    }
});
