const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        headText: ['当月收入', '年度收入'],
        headIndex: 0,
        dateShow: false,
        MonthShow: true,
        income: '',
        type: 1,
        page: 1,
        refresh1: true,
        load1: true,
        flag11: true,
        flag21: true,
        two1: '下拉加载更多',
    },
    onLoad: function () {
        // 查看收入
        this.getData();
    },
    cut: function (e) {
        this.setData({
            headIndex: e.currentTarget.dataset.index
        });
        if (this.data.headIndex === 1) {
            this.setData({
                date: '月份',
                type: 2,
                dateShow: true,
                MonthShow: false,
            })
        } else {
            this.setData({
                date: '日期',
                type: 1,
                dateShow: false,
                MonthShow: true,
            })
        }

        this.getData();
    },
    getData: function () {
        wx.request({
            url: ip + '/statics/billRecent',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                page: this.data.page,
                type: this.data.type,
                limit: 10
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    if (this.data.type === 1) {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].day = res.data.rows[i].day.substring(8, 10);
                        }
                        this.setData({
                            income: res.data.rows
                        });
                        console.log(this.data.income);
                    } else {
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].day = res.data.data[i].day.substring(5, 7);
                        }
                        this.setData({
                            income: res.data.data
                        })
                    }
                }

            },
        });
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
                    url: ip + '/statics/billRecent',
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
                                flag11: false,
                                income: this.data.income.concat(res.data.rows),
                                two1: '已经到底了'
                            })
                        } else {
                            this.setData({
                                income: this.data.income.concat(res.data.rows),
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
                    url: ip + '/statics/billRecent',
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
                        console.log('刷新');
                        this.setData({
                            income: res.data.rows,
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
