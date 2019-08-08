const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        deviceList: '',
        page1: 1,
        refresh2: true,
        load2: true,
        flag12: true,
        flag22: true,
        two2: '下拉加载更多',
        deviceIds: '',
        chooseAll: 0,
        inspectorId: ''
    },
    onLoad: function (options) {
        this.setData({
            inspectorId: options.id
        });
        //查询可以添加的设备
        wx.request({
            url: ip + '/inspector/devices',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                "page": 1,
                'limit': 10
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    for (var i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].choose = 0
                    }
                    console.log(res);
                    this.setData({
                        deviceList: res.data.rows
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.removeStorageSync("loginCode");
                        wx.reLaunch({
                            url: '../login/login',
                        })
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
    // 选择设备
    choose: function (e) {
        let index = e.currentTarget.dataset.index;
        if (this.data.deviceList[index].choose == 0) {
            this.data.deviceList[index].choose = 1;
        } else {
            this.data.deviceList[index].choose = 0;
        }
        this.setData({
            deviceList: this.data.deviceList
        })

    },

    // 下拉加载
    loadMore1: function () {
        if (this.data.flag12) {
            this.setData({
                load2: false,
                page: this.data.page1 + 1,
                flag12: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/inspector/devices',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page: this.data.page,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log(res.data.rows);
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag12: false,
                                // load: true,
                                two2: '已经到底了'
                            })
                        } else {
                            this.setData({
                                deviceList: this.data.deviceList.concat(res.data.rows),
                                flag12: true,
                            });
                        }
                    },

                });
            }, 1500);
        }


    },

    // 上拉刷新
    refesh1: function () {
        if (this.data.flag22) {
            this.setData({
                refresh2: false,
                page1: 1,
                flag22: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/inspector/devices',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        page: this.data.page1,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log('刷新');
                        this.setData({
                            deviceList: res.data.rows,
                            refresh2: true,
                            flag12: true,
                            two2: '下拉加载更多'
                        })
                    },

                });
                this.setData({
                    flag22: true
                })
            }, 1000);
        }


    },

    // 确定分配
    addDevices: function () {
        var deviceIds = [];
        for (var i = 0; i < this.data.deviceList.length; i++) {
            if (this.data.deviceList[i].choose == 1) {
                deviceIds.push(this.data.deviceList[i].id)
            }
        }
        console.log(deviceIds);
        this.setData({
            deviceIds: deviceIds
        });

        wx.showModal({
            title: "提示",
            content: '是否执行此操作',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: ip + '/inspector/addDevice',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        data: {
                            inspectorId: this.data.inspectorId,
                            deviceIds: this.data.deviceIds
                        },
                        method: 'POST',
                        success: (res) => {
                            if (res.data.code === 0) {
                                wx.showModal({
                                    title: "提示",
                                    content: '操作成功',
                                    success: () => {
                                        this.setData({
                                            deviceListShow: true
                                        });
                                    }
                                })
                            } else {
                                if (res.data.code === 1001) {
                                    wx.removeStorageSync("loginCode");
                                    wx.reLaunch({
                                        url: '../login/login',
                                    })
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
            }
        });

    },

    // 全选
    checkAll: function () {
        if (this.data.chooseAll == 0) {
            for (var i = 0; i < this.data.deviceList.length; i++) {
                this.data.deviceList[i].choose = 1
            }
            this.setData({
                chooseAll: 1,
                deviceList: this.data.deviceList
            })
        } else {
            for (var i = 0; i < this.data.deviceList.length; i++) {
                this.data.deviceList[i].choose = 0
            }
            this.setData({
                chooseAll: 0,
                deviceList: this.data.deviceList
            })
        }
    }
});
