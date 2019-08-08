const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        device: '',
        page: 1,
        refresh1: true,
        load1: true,
        flag11: true,
        flag21: true,
        two1: '下拉加载更多',
    },
    onLoad: function () {
        //售货机
        wx.request({
            url: ip + '/device/select',
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
                        device: res.data.rows
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
    // 选择售货机
    choose: function (e) {
        console.log(e);
        wx.setStorageSync('deviceId', e.currentTarget.dataset.id);
        wx.setStorageSync('deviceType', e.currentTarget.dataset.name1);
        wx.navigateBack();
    },
    // 下拉加载
    loadMore: function () {
        console.log(("下拉"));
        if (this.data.flag11) {
            this.setData({
                load1: false,
                page: this.data.page + 1,
                flag11: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/device/select',
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
                                flag11: false,
                                device: this.data.device.concat(res.data.rows),
                                two1: '已经到底了'
                            })
                        } else {
                            this.setData({
                                device: this.data.device.concat(res.data.rows),
                                flag11: true,
                            });
                        }
                    },

                });
            }, 1500);
        }

    },

    // 上拉刷新
    refesh: function () {
        if (this.data.flag21) {
            this.setData({
                refresh1: false,
                page: 1,
                flag21: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/device/select',
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
                        console.log('刷新');
                        this.setData({
                            device: res.data.rows,
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

});
