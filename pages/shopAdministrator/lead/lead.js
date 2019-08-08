const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        goodsItem: '',
        refresh2: true,
        page: 1,
        load1: true,
        flag1: true,
        flag2: true,
        two1: '下拉加载更多',
        refresh1: true,
    },
    onLoad: function () {
        wx.request({
            url: ip + '/gs/gsList',
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
                console.log(res);
                for (let i = 0; i < res.data.rows.length; i++) {
                    res.data.rows[i].choose = 0;
                }
                this.setData({
                    goodsItem: res.data.rows,
                    batch: true,
                    ids: []
                });
            },

        })
    },
    // 下拉加载
    loadMore: function () {
        console.log(("下拉"));
        if (this.data.flag1) {
            this.setData({
                load1: false,
                page: this.data.page + 1,
                flag1: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/gs/gsList',
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
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
                                two1: '已经到底了'
                            })
                        } else {
                            this.setData({
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
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
        if (this.data.flag2) {
            this.setData({
                refresh1: false,
                page: 1,
                flag2: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/gs/gsList',
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
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        this.setData({
                            goodsItem: res.data.rows,
                            refresh1: true,
                            flag1: true,
                            two1: '下拉加载更多'
                        })
                    },

                });
                this.setData({
                    flag2: true
                })
            }, 1000);
        }


    },
    // 选择
    choose: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.data.goodsItem[index].choose == 0) {
            this.data.goodsItem[index].choose = 1
        } else {
            this.data.goodsItem[index].choose = 0
        }
        this.setData({
            goodsItem: this.data.goodsItem
        });
    },
    // 确认
    affirm: function () {
        wx.showLoading({
            title: '加载中...',
        });
        var ids = -1;
        for (var i = 0; i < this.data.goodsItem.length; i++) {
            if (this.data.goodsItem[i].choose == 1) {
                ids = ids + ',' + this.data.goodsItem[i].id
            }
        }

        wx.request({
            url: ip + '/gs/batchAddGoods',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                ids: ids
            },
            method: 'POST',
            success: (res) => {
                wx.hideLoading();
                wx.showModal({
                    title: "提示",
                    content: res.data.data,
                    success: function () {
                        wx.navigateBack();
                    }
                })
            },

        })
    },

});
