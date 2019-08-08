const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        cash: '',//账户余额
        balance: '',//可提现余额
        payType: '',//支付方式
        hide: true,
        forward: '',//提现金额
        thirdType: '',//第三方支付类型
        accountType: '',//提现账户类型
        thirdId: '',//（第三方账户ID）转账到微信账号 必填
        failShow: true,//失败列表
        failList: '',//失败列表
        total: '',
        feeAdmin: '',
        feePay: '',
        salesShow: true
    },
    onLoad: function () {
        // 基本信息
        wx.request({
            url: ip + '/partner/person',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        cash: res.data.data.cash,
                        balance: res.data.data.balance,
                        payType: res.data.data.payTypes
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },
        });
        //失败列表
        wx.request({
            url: ip + '/capital/selectForwardFail',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    if (res.data.data.length === 0) {
                        this.setData({
                            failShow: true
                        })
                    } else {
                        this.setData({
                            failShow: false,
                            failList: res.data.data
                        })
                    }
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },
        })
    },
    action: function (e) {
        console.log(e.target.dataset.type);
        this.setData({
            hide: false,
            thirdType: e.target.dataset.type,
            accountType: e.target.dataset.account
        })
    },
    // 取消
    cancel: function () {
        this.setData({
            hide: true,
            salesShow: true
        })
    },
    // 拿到金额
    forward: function (e) {
        this.setData({
            forward: e.detail.value
        })
    },

    // 确定提现
    confirm: function () {
        console.log(this.data.thirdType, this.data.accountType);
        wx.request({
            url: ip + '/capital/forward',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                forward: this.data.forward,
                thirdType: this.data.thirdType,
                accountType: this.data.accountType,
                thirdId: this.data.thirdId,
            },
            method: 'POST',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.msg,
                        success: function () {
                            wx.request({
                                url: ip + '/partner/person',
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Authorization": wx.getStorageSync("Authorization")
                                },
                                method: 'GET',
                                success: (res) => {
                                    console.log(res);
                                    if (res.data.code === 0) {
                                        this.setData({
                                            cash: res.data.data.cash,
                                            balance: res.data.data.balance,
                                            payType: res.data.data.payTypes
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

                } else {
                    wx.request({
                        url: ip + '/capital/selectForwardFail',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        method: 'GET',
                        success: (res) => {
                            console.log(res);
                            if (res.data.code === 0) {
                                if (res.data.data.length === 0) {
                                    this.setData({
                                        failShow: true
                                    })
                                } else {
                                    this.setData({
                                        failShow: false,
                                        failList: res.data.data
                                    })
                                }

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
        })
    },

    // 计算费用
    calculation: function () {
        wx.request({
            url: ip + '/capital/calculation',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                forward: this.data.forward,
                thirdType: this.data.thirdType,
                accountType: this.data.accountType,
                thirdId: this.data.thirdId,
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        salesShow: false,
                        feeAdmin: res.data.data.feeAdmin,
                        feePay: res.data.data.feePay,
                        total: res.data.data.total
                    })
                }
            },
        })
    },

    record: function (e) {
        wx.navigateTo({
            url: "record/record?type=" + e.target.dataset.type
        })
    },
    again: function (e) {
        wx.request({
            url: ip + '/capital/retry',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: e.target.dataset.id
            },
            method: 'POST',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.msg,
                        success: function () {
                            // 基本信息
                            wx.request({
                                url: ip + '/partner/person',
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Authorization": wx.getStorageSync("Authorization")
                                },
                                method: 'GET',
                                success: (res) => {
                                    console.log(res);
                                    if (res.data.code === 0) {
                                        this.setData({
                                            cash: res.data.data.cash,
                                            balance: res.data.data.balance,
                                            payType: res.data.data.payTypes
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
