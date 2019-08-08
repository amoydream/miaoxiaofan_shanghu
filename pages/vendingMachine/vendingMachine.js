// pages/vendingMachine/vendingMachine.js
var ip = getApp().data.ip;
Page({
    data: {
        deviceClass: ['设备状态', '巡货员管理'],
        deviceClassIndex: 0,
        shopList: ['运营中', '未运营'],
        shopListIndex: 0,
        chooseAll: 0,//全选
        state: '停止运营',
        type: 1,//判断类型,
        info: '',
        page: 1,
        hidden: true,
        mold: '',//操作类型
        status: '确认添加',
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        two: '下拉加载更多',
        modalShow: true,
        no: '',
        without: true,


        manList: '',
        refresh1: true,
        load1: true,
        flag11: true,
        flag21: true,
        two1: '下拉加载更多',
        deviceList: '',//设备列表
        deviceListShow: true,
        inspectorId: '',//巡货员id
        deviceIds: '',
        page1: 1,

    },
    onLoad: function () {
        // 查询售货机
        this.getData();
        wx.request({
            url: ip + '/inspector/list',
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
                    this.setData({
                        manList: res.data.rows
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
    },

    BtnTabList: function (e) {
        let TabIndex = e.target.dataset.tabindex;
        if (TabIndex === 0) {
            this.setData({
                shopListIndex: TabIndex,
                type: 1,
                state: '停止运营',
                refresh: true,
                load: true,
            });
        } else {
            this.setData({
                shopListIndex: TabIndex,
                type: 0,
                state: '开启运营',
                refresh: true,
                load: true,
            });
        }
        this.getData();
    },

    // 选择
    choose: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.info[index].choose == 0) {
            this.data.info[index].choose = 1
        } else {
            this.data.info[index].choose = 0;
        }
        this.setData({
            info: this.data.info
        })
    },

    // 全选
    chooseAll: function () {
        if (this.data.chooseAll == 0) {
            this.setData({
                chooseAll: 1
            });
            for (var i = 0; i < this.data.info.length; i++) {
                this.data.info[i].choose = 1;
            }
        } else {
            this.setData({
                chooseAll: 0
            });
            for (var i = 0; i < this.data.info.length; i++) {
                this.data.info[i].choose = 0;
            }
        }

        this.setData({
            info: this.data.info
        })
    },

    // 点击出现按钮
    btnShow: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.info[index].hidden === true) {
            this.data.info[index].hidden = false;
            this.setData({
                info: this.data.info
            })
        } else {
            this.data.info[index].hidden = true;
            this.setData({
                info: this.data.info
            })
        }
    },

    // 下拉加载
    loadMore1: function () {
        if (this.data.flag1) {
            this.setData({
                load: false,
                page: this.data.page + 1,
                flag1: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/device/select',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        "type": this.data.type,
                        page: this.data.page,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].hidden = true;
                            for (let j = 0; j < res.data.rows[i].inspectors.length; j++) {
                                res.data.rows[i].inspectors[j].deviceId = res.data.rows[i].id
                            }
                        }

                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                two: '已经到底了',
                                info: this.data.info.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                info: this.data.info.concat(res.data.rows),
                                flag1: true,
                            });
                        }
                    },

                });
            }, 1500);
        }

    },

    // 查看监控测试
    tapHandler: function (e) {
        wx.navigateTo({
            url: "test/test?id=" + e.currentTarget.dataset.id
        })
    },

    // 点击分配补货员
    allocation: function (e) {
        console.log(e);
        var id = e.currentTarget.dataset.id;
        var inspectors = e.currentTarget.dataset.inspectors;
        if (inspectors !== null) {
            wx.showModal({
                title: "提示",
                content: '已分配巡货员的不能再次分配了',
            });
        } else {
            wx.navigateTo({
                url: "manList/manList?id=" + id
            })
        }
    },

    // 点击查看运营配置
    look: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "deploy/deploy?id=" + id
        })

    },

    details: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "deviceInfo/deviceInfo?id=" + id
        })
    },

    // 多选禁用设备
    stopAll: function () {
        var ids = -1;
        for (var i = 0; i < this.data.info.length; i++) {
            if (this.data.info[i].choose == 1) {
                ids = ids + "," + this.data.info[i].id;
            }
        }
        if (this.data.shopListIndex == 0) {
            this.disableDevice(ids);
        } else {
            this.enableDevice(ids);
        }

        this.setData({
            chooseAll: 0
        })
    },
    // 单个禁用设备
    stopOne: function (e) {
        var id = e.currentTarget.dataset.id;
        if (this.data.shopListIndex === 0) {
            wx.showModal({
                title: "提示",
                content: '是否停止运营',
                success: function (res) {
                    if (res.confirm) {
                        this.disableDevice(id);
                    }
                }
            });
        } else {
            wx.showModal({
                title: "提示",
                content: '是否开启运营',
                success: function (res) {
                    if (res.confirm) {
                        this.enableDevice(id);
                    }
                }
            });
        }
    },

    // 获取设备
    getData: function () {
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
                if (res.data.code === 0) {
                    if (res.data.rows.length === 0) {
                        this.setData({
                            without: false
                        })
                    } else {
                        this.setData({
                            without: true
                        })
                    }
                    for (let i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].hidden = true;
                        res.data.rows[i].choose = 0;
                        if (res.data.rows[i].inspectors !== null) {
                            for (let j = 0; j < res.data.rows[i].inspectors.length; j++) {
                                res.data.rows[i].inspectors[j].deviceId = res.data.rows[i].id
                            }
                        }
                    }
                    this.setData({
                        info: res.data.rows
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: function () {
                                wx.removeStorageSync("loginCode");
                                wx.redirectTo({
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

    // 禁用设备
    disableDevice: function (ids) {
        wx.request({
            url: ip + '/device/disableDevice',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                ids: ids
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
    },

    // 开启设备
    enableDevice: function (ids) {
        wx.request({
            url: ip + '/device/enableDevice',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                ids: ids
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
    },
    // 删除巡货员
    del: function (e) {
        console.log(e);
        let deviceId = e.currentTarget.dataset.deviceid;
        let inspectorIds = e.currentTarget.dataset.id;
        console.log(deviceId);
        wx.showModal({
            title: "提示",
            content: '是否删除',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: ip + '/device/deleteInspector',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        data: {
                            deviceId: deviceId,
                            inspectorIds: inspectorIds,
                        },
                        method: 'POST',
                        success: (res) => {
                            if (res.data.code === 0) {
                                wx.showModal({
                                    title: "提示",
                                    content: res.data.data,
                                    success: _ => {
                                        this.getData();
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

            }
        });

    },

    chooseIndex: function (e) {
        this.setData({
            titleIndex: e.currentTarget.dataset.index,
            load1: true
        });
        if (this.data.titleIndex === 0) {
            this.setData({
                structureId: ''
            })
        } else if (this.data.titleIndex === 1) {
            this.setData({
                structureId: 1
            })
        } else if (this.data.titleIndex === 2) {
            this.setData({
                structureId: 2
            })
        }
        this.getData1();
    },

    skip: function (e) {
        let structureId = e.currentTarget.dataset.structureid;
        let id = e.currentTarget.dataset.id;
        if (structureId === 1) {
            wx.navigateTo({
                url: "tradition/tradition?id=" + id
            })
        } else {
            wx.navigateTo({
                url: "RFIDDetails/RFIDDetails?id=" + id
            })
        }
    },

    chooseDeviceClass: function (e) {
        this.setData({
            deviceClassIndex: e.currentTarget.dataset.index,
        });
    },
    // 删除
    delman: function (e) {
        wx.showModal({
            title: "提示",
            content: '是否删除',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: ip + '/inspector/delete',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        data: {
                            id: e.currentTarget.dataset.id
                        },
                        method: 'POST',
                        success: (res) => {
                            wx.showModal({
                                title: "提示",
                                content: res.data.data
                            });
                            wx.request({
                                url: ip + '/inspector/list',
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
                                        this.setData({
                                            manList: res.data.rows
                                        })
                                    } else {
                                        if (res.data.code === 1001) {
                                            wx.showModal({
                                                title: "提示",
                                                content: res.data.data,
                                                success: function () {
                                                    wx.removeStorageSync("loginCode");
                                                    wx.redirectTo({
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
                    })
                }

            }
        });

    },

    // 下拉加载
    loadMore: function () {
        if (this.data.flag11) {
            this.setData({
                load1: false,
                page: this.data.page1 + 1,
                flag11: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/inspector/list',
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
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag11: false,
                                manList: this.data.manList.concat(res.data.rows),
                                two1: '已经到底了'
                            })
                        } else {
                            this.setData({
                                manList: this.data.manList.concat(res.data.rows),
                                flag11: true,
                            });
                        }
                    },

                });
            }, 1500);
        }


    },

    // 查看信息
    lookInfo: function (e) {
        wx.navigateTo({
            url: "./editInfo/editInfo?id=" + e.currentTarget.dataset.id + "&type=1"
        })
    },
    addDevice: function (e) {
        wx.navigateTo({
            url: "./device/device?id=" + e.currentTarget.dataset.id
        })
    },
    allHide() {
        this.data.info.map((num) => {
            num.hidden = true
        });
        this.setData({
            info: this.data.info
        })
    }

});

