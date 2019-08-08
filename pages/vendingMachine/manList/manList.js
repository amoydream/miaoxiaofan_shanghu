var ip = getApp().data.ip;
Page({
    data: {
        manList: '',// 巡货员列表
        page: 1,
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        deviceId: '',
        two: '下拉加载更多',
        mold: 1,
        inspectorIds: '',
        chooseAll: 0
    },
    onLoad: function (options) {
        this.setData({
            deviceId: options.id
        });
        // 查询巡货员列表
        wx.request({
            url: ip + '/device/selectDeviceInspector',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                deviceId: options.id,
                "page": 1,
                'limit': 10
            },
            method: 'GET',
            success: (res) => {
                console.log(res.data.code);
                if (res.data.code === 0) {
                    for (let i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].choose = 0;
                    }
                    this.setData({
                        manList: res.data.rows
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    });
                }

            },
        })
    },
    // 选择
    choose: function (e) {
        let index = e.currentTarget.dataset.index;
        if (this.data.manList[index].choose == 0) {
            this.data.manList[index].choose = 1
        } else {
            this.data.manList[index].choose = 0
        }

        this.setData({
            manList: this.data.manList
        });

        var ids = -1;
        for (var i = 0; i < this.data.manList.length; i++) {
            if (this.data.manList[i].choose == 1) {
                ids = ids + "," + this.data.manList[i].id;
            }
        }
        this.setData({
            inspectorIds: ids
        })
    },

    // 全部选择
    chooseAll: function () {
        if (this.data.chooseAll == 0) {
            this.setData({
                chooseAll: 1
            });
            for (var i = 0; i < this.data.manList.length; i++) {
                this.data.manList[i].choose = 1;
            }
        } else {
            this.setData({
                chooseAll: 0
            });
            for (var i = 0; i < this.data.manList.length; i++) {
                this.data.manList[i].choose = 0;
            }
        }
        var ids = -1;
        for (var i = 0; i < this.data.manList.length; i++) {
            if (this.data.manList[i].choose == 1) {
                ids = ids + "," + this.data.manList[i].id;
            }
        }
        this.setData({
            inspectorIds: ids,
            manList: this.data.manList
        })

    },

    // 巡货员列表下拉加载
    loadMore: function () {
        console.log(("下拉"));
        if (this.data.flag1) {
            this.setData({
                load: false,
                page: this.data.page + 1,
                flag1: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/device/selectDeviceInspector',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        deviceId: this.data.deviceId,
                        page: this.data.page,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log(res.data.rows);
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                // load: true,
                                two: '已经到底了'
                            })
                        } else {
                            this.setData({
                                manList: this.data.manList.concat(res.data.rows),
                                // load: true,
                                flag1: true,
                            });
                        }
                    },

                });
            }, 1500);
        }
    },

    // 巡货员列表上拉刷新
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
                    url: ip + '/device/selectDeviceInspector',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        deviceId: this.data.deviceId,
                        page: this.data.page,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        this.setData({
                            manList: res.data.rows,
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

    // 操作巡货员
    add: function () {
        if (this.data.mold === 1) {
            wx.request({
                url: ip + '/device/addInspector',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    deviceId: this.data.deviceId,
                    inspectorIds: this.data.inspectorIds,
                },
                method: 'POST',
                success: (res) => {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data,
                        success: (res) => {
                            wx.navigateBack()
                        }
                    })
                },

            });
        }
        else if (this.data.mold === 2) {
            // 改变
            wx.request({
                url: ip + '/device/changeInspector',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    deviceId: this.data.deviceId,
                    oldInspectorId: this.data.oldInspectorId,
                    newInspectorId: this.data.inspectorId,
                },
                method: 'POST',
                success: (res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        wx.request({
                            url: ip + '/device/select',
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Authorization": wx.getStorageSync("Authorization")
                            },
                            data: {
                                "type": this.data.type,
                                "page": 1,
                                'limit': 10
                            },
                            method: 'GET',
                            success: (res) => {
                                for (let i = 0; i < res.data.rows.length; i++) {
                                    res.data.rows[i].hidden = true;
                                    for (let j = 0; j < res.data.rows[i].inspectors.length; j++) {
                                        res.data.rows[i].inspectors[j].deviceId = res.data.rows[i].id
                                    }
                                }
                                console.log(res);
                                this.setData({
                                    hidden: true,
                                    info: res.data.rows
                                })
                            },
                        });
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
});