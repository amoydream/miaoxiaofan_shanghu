const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        record: '',
        page: 1,
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        drop: '下拉加载更多',
        type: '',
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            type: options.type
        });
        wx.request({
            url: ip + '/capital/forwardHistory',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                type: options.type,
                page: 1,
                limit: 10
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 1001) {
                    wx.removeStorageSync("loginCode");
                    wx.redirectTo({
                        url: '../logs/logs',
                    })
                } else {
                    this.setData({
                        record: res.data.rows
                    })
                }
                console.log(res.data);
            },

        });
    },
    // 下拉加载
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
                    url: ip + '/capital/forwardHistory',
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
                                flag1: false,
                                drop: '到底了',
                                record: this.data.record.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                record: this.data.record.concat(res.data.rows),
                                load: true,
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
                    url: ip + '/capital/forwardHistory',
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
                            record: res.data.rows,
                            refresh: true,
                            flag1: true,
                            drop: '下拉加载更多',
                        })
                    },

                });
                this.setData({
                    flag2: true
                })
            }, 1000);
        }


    },
});
