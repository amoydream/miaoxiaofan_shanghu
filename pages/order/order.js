const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        currentTabsIndex: 0,
        stateIndex: 0,
        drawIndex: 0,
        stateTitle: ['全部', '完成订单', '异常订单'],
        orderTitle: ['订单管理', '抽奖管理'],
        drawTitle: ['全部', '出货成功', '出货失败', '存货'],
        orderState: '',//订单状态
        drawState: '',//抽奖状态
        page: 1,
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        two: '下拉加载更多',
        type: '',
        orderItem: '',//订单
        drawItem: '',//抽奖
        page1: 1,
        refresh1: true,
        load1: true,
        flag11: true,
        flag21: true,
        two1: '下拉加载更多',
        type1: '',
        drawNo: true,
        orderNo: true,
        ip: ip,
    },
    onLoad: function () {
        wx.request({
            url: ip + '/order/selectOrder',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                type: this.data.type,
                page: this.data.page,
                limit: '10'
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    if (res.data.rows.length === 0) {
                        this.setData({
                            orderNo: false
                        })
                    } else {
                        this.setData({
                            orderNo: true,
                            orderItem: res.data.rows
                        })
                    }
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
    },

    onTabsItemTap: function (event) {
        let index = event.target.dataset.index;
        this.setData({
            currentTabsIndex: index
        });
        if (index === 1) {
            wx.request({
                url: ip + '/order/selectLuckDraw',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    type: '',
                    page: 1,
                    limit: '10'
                },
                method: 'GET',
                success: (res) => {
                    if (res.data.rows.length === 0) {
                        this.setData({
                            drawNo: false
                        })
                    } else {
                        this.setData({
                            drawNo: true,
                            drawItem: res.data.rows

                        });
                        console.log(res.data.rows);
                    }
                },
            });
        }


    },
    // 订单tab
    onTabOrder: function (event) {
        let index = event.target.dataset.index;
        this.setData({
            stateIndex: index,
            page: 1,
            load: true
        });
        if (this.data.stateIndex === 0) {
            this.setData({
                type: ''
            });
            this.getOrder(this.data.page, '')
        } else if (this.data.stateIndex === 1) {
            this.setData({
                type: 1
            });
            this.getOrder(this.data.page, 1)
        } else if (this.data.stateIndex === 2) {
            this.setData({
                type: 0
            });
            this.getOrder(this.data.page, 0)
        }
    },
    // 抽奖tab
    onTabDraw: function (event) {
        let index = event.target.dataset.index;
        this.setData({
            drawIndex: index,
            page: 1,
            load1: true
        });
        if (this.data.drawIndex === 0) {
            this.setData({
                type1: ''
            });
            this.getDraw(this.data.page, '')
        } else if (this.data.drawIndex === 1) {
            this.setData({
                type1: 1
            });
            this.getDraw(this.data.page, 1)
        } else if (this.data.drawIndex === 2) {
            this.setData({
                type1: 0
            });
            this.getDraw(this.data.page, 0)
        } else if (this.data.drawIndex === 3) {
            this.setData({
                type1: 2
            });
            this.getDraw(this.data.page, 2)
        }
    },

    // 下拉加载
    loadMore: function () {
        if (this.data.flag1) {
            this.setData({
                load: false,
                page: this.data.page + 1,
                flag1: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/order/selectOrder',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page: this.data.page,
                        limit: "10",
                        type: this.data.type
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log(res.data.rows);
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                // load: true,
                                two: '已经到底了',
                                orderItem: this.data.orderItem.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                orderItem: this.data.orderItem.concat(res.data.rows),
                                flag1: true,
                            });
                        }
                    },

                });
            }, 1500);
        }


    },
    // 上拉刷新
    refesh: function () {
        console.log(this.data.flag2);
        if (this.data.flag2) {
            this.setData({
                refresh: false,
                page: 1,
                flag2: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/order/selectOrder',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page: this.data.page,
                        limit: "10",
                        type: this.data.type
                    },
                    method: 'GET',
                    success: (res) => {
                        this.setData({
                            orderItem: res.data.rows,
                            refresh: true,
                            flag1: true,
                            two: '下拉加载更多'
                        })
                    },

                });
                this.setData({
                    flag2: true
                })
            }, 1000);
        }


    },


    // 下拉加载
    loadMore1: function () {
        if (this.data.flag1) {
            this.setData({
                load1: false,
                page1: this.data.page1 + 1,
                flag11: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/order/selectLuckDraw',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page: this.data.page1,
                        limit: "10",
                        type: this.data.type1
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log(res.data.rows);
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag11: false,
                                // load: true,
                                two1: '已经到底了',
                                drawItem: this.data.drawItem.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                drawItem: this.data.drawItem.concat(res.data.rows),
                                flag11: true,
                            });
                        }
                    },

                });
            }, 1500);
        }


    },
    // 上拉刷新
    refesh1: function () {
        console.log(this.data.flag2);
        if (this.data.flag21) {
            this.setData({
                refresh1: false,
                page1: 1,
                flag21: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/order/selectLuckDraw?loginCode=' + wx.getStorageSync("loginCode"),
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page1: this.data.page,
                        limit: "10",
                        type: this.data.type1
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log('刷新');
                        this.setData({
                            drawItem: res.data.rows,
                            refresh1: true,
                            flag11: true,
                            two1: '下拉加载更多'
                        })
                    },

                });
                this.setData({
                    flag21: true
                })
            }, 1000);
        }


    },


    // 订单
    getOrder: function (page, type) {
        wx.request({
            url: ip + '/order/selectOrder?loginCode=' + wx.getStorageSync("loginCode"),
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                type: type,
                page: page,
                limit: '10'
            },
            method: 'GET',
            success: (res) => {
                if (res.data.rows.length === 0) {
                    this.setData({
                        orderNo: false,
                        orderItem: res.data.rows
                    })
                } else {
                    this.setData({
                        orderNo: true,
                        orderItem: res.data.rows
                    });
                    console.log(this.data.orderItem);
                }
            },
        });
    },

    // 抽奖
    getDraw: function (page, type) {
        wx.request({
            url: ip + '/order/selectLuckDraw?loginCode=' + wx.getStorageSync("loginCode"),
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                type: type,
                page: page,
                limit: '10'
            },
            method: 'GET',
            success: (res) => {
                if (res.data.rows.length === 0) {
                    this.setData({
                        drawNo: false,
                        drawItem: res.data.rows
                    })
                } else {
                    this.setData({
                        drawNo: true,
                        drawItem: res.data.rows
                    });
                }

            },
        });
    },
    lookDetails: function (e) {
        wx.navigateTo({
            url: "orderDetails/orderDetails?id=" + e.currentTarget.dataset.id
        })
    }
});
