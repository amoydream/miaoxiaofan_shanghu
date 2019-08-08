// pages/shopAdministrator/shopAdministrator.js
var ip = getApp().data.ip;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ip: ip,
        title: ['商品管理', '分组管理'],
        currentTabsIndex: 0,
        shopList: ['出售中', '已下架'],
        shopListIndex: 0,
        priceRank: ['价格升序', '价格降序'],
        nameRank: ['名称升序', '名称降序'],
        index1: 0,
        index2: 0,
        page: 1,
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        two: '下拉加载更多',
        goodsItem: '',
        status: 1,
        className: '',//类名
        hidden: true,
        goodsId: '',
        order: '',
        sort: '',
        batch: true,
        ids: [],
        without: true
    },

    onShow: function () {
        this.goodsList();
    },
    BtnTab: function (e) {
        let index = e.target.dataset.index;
        this.setData({
            currentTabsIndex: index,
            refresh: true,
            load: true,
            flag1: true,
            flag2: true,
            page: 1,
            two: '下拉加载更多',
        });
        if (index === 0) {
            this.setData({
                status: 1,
            });
            wx.request({
                url: ip + '/goods/selectGoods',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    status: 1,
                    page: 1,
                    limit: "10",
                },
                method: 'GET',
                success: (res) => {
                    for (let i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].choose = 0;
                    }
                    this.setData({
                        goodsItem: res.data.rows
                    });
                },
            });
        } else {
            wx.request({
                url: ip + '/goods/selectAllClass',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                method: 'GET',
                success: (res) => {
                    this.setData({
                        className: res.data.data
                    })
                },

            });
        }
    },
    BtnTabList: function (e) {
        let TabIndex = e.target.dataset.tabindex;
        this.setData({
            shopListIndex: TabIndex,
            refresh: true,
            load: true,
            flag1: true,
            flag2: true,
            page: 1,
            two: '下拉加载更多',
        });

        if (TabIndex === 0) {
            this.setData({
                status: 1,
            });
        } else {
            this.setData({
                status: 0,
            });
        }
        this.goodsList();
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
                    url: ip + '/goods/selectGoods',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        status: this.data.status,
                        page: this.data.page,
                        limit: "10",
                        sort: this.data.sort,
                        order: this.data.order
                    },
                    success: (res) => {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                two: '已经到底了',
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
                                flag1: true,
                            });
                        }
                    },

                });
            }, 1000);
        }

    },

    // 上拉刷新
    refesh: function () {
        if (this.data.flag2) {
            this.setData({
                refresh: false,
                page: 1,
                flag2: false
            });
            setTimeout(() => {
                wx.request({
                    url: ip + '/goods/selectGoods',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        status: this.data.status,
                        page: this.data.page,
                        limit: "10",
                        sort: this.data.sort,
                        order: this.data.order
                    },
                    method: 'GET',
                    success: (res) => {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        this.setData({
                            goodsItem: res.data.rows,
                            refresh: true,
                            flag1: true,
                            two: '下拉加载更多',
                            flag2: true
                        })
                    },
                });
            }, 1000);
        }
    },

    bindChange1: function (e) {
        this.setData({
            index1: e.detail.value,
            sort: 'discount'
        });
        if (this.data.index1 === '0') {
            this.setData({
                order: 'ASC'
            })
        } else {
            this.setData({
                order: 'DESC'
            })
        }
        wx.request({
            url: ip + '/goods/selectGoods',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                status: this.data.status,
                page: this.data.page,
                limit: "10",
                sort: this.data.sort,
                order: this.data.order
            },
            method: 'GET',
            success: (res) => {
                for (let i = 0; i < res.data.rows.length; i++) {
                    res.data.rows[i].choose = 0;
                }
                this.setData({
                    goodsItem: res.data.rows
                });
            },
        });

    },

    bindChange2: function (e) {
        this.setData({
            index2: e.detail.value,
            sort: 'name'
        });
        if (this.data.index2 === '0') {
            this.setData({
                order: 'ASC'

            })
        } else {
            this.setData({
                order: 'DESC'
            })
        }
        wx.request({
            url: ip + '/goods/selectGoods',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                status: this.data.status,
                page: this.data.page,
                limit: "10",
                sort: this.data.sort,
                order: this.data.order
            },
            method: 'GET',
            success: (res) => {
                for (let i = 0; i < res.data.rows.length; i++) {
                    res.data.rows[i].choose = 0;
                }
                this.setData({
                    goodsItem: res.data.rows
                });
            },

        });
    },
    // 删除
    del: function (e) {
        this.setData({
            hidden: false,
            goodsId: e.target.dataset.id
        })
    },
    // 取消删除
    cancel: function () {
        this.setData({
            hidden: true
        })
    },

    //确认删除
    confirm: function () {
        this.setData({
            hidden: true
        });
        this.delGoods(this.data.goodsId);
    },
    // 选择
    choose: function (e) {
        let index = e.currentTarget.dataset.index;
        if (this.data.goodsItem[index].choose === 0) {
            this.data.goodsItem[index].choose = 1;
        } else {
            this.data.goodsItem[index].choose = 0;
        }
        this.setData({
            goodsItem: this.data.goodsItem,
        })
    },
    // 关闭批量操作
    batch: function () {
        this.setData({
            batch: false
        })
    },
    //批量删除
    batchDel: function () {
        wx.showLoading({
            title: '加载中...',
        });
        var ids = [];
        for (var i = 0; i < this.data.goodsItem.length; i++) {
            if (this.data.goodsItem[i].choose == 1) {
                ids.push(this.data.goodsItem[i].id)
            }
        }
        this.delGoods(ids);
    },
    // 批量上下架
    upDown: function () {
        wx.showLoading({
            title: '加载中...',
        });
        var ids = [];
        for (var i = 0; i < this.data.goodsItem.length; i++) {
            if (this.data.goodsItem[i].choose == 1) {
                ids.push(this.data.goodsItem[i].id)
            }
        }
        if (this.data.status == 1) {
            this.getOperation(0, ids)
        } else {
            this.getOperation(1, ids)
        }

    },
    // 关闭批量操作
    close: function () {
        this.setData({
            batch: true
        })
    },
    // 添加商品
    update: function (e) {
        console.log(e.target.dataset.id);
        wx.navigateTo({
            url: 'addGoods/addGoods?id=' + e.target.dataset.id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
        })
    },
    // 批量上下架数据
    getOperation: function (status, ids) {
        wx.request({
            url: ip + '/goods/operation',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                status: status,
                ids: ids
            },
            method: 'POST',
            success: (res) => {
                wx.hideLoading();
                wx.showModal({
                    title: "提示",
                    content: res.data.data
                });
                this.goodsList();
            },

        });
    },
    // 删除商品数据
    delGoods: function (ids) {
        wx.request({
            url: ip + '/goods/delete',
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
                    content: res.data.data
                });
                this.goodsList();
            },

        });
    },
    // 查询商品
    goodsList: function () {
        wx.request({
            url: ip + '/goods/selectGoods',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                status: this.data.status,
                page: 1,
                limit: "10"
            },
            method: 'GET',
            success: (res) => {
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
                    res.data.rows[i].choose = 0;
                }
                this.setData({
                    goodsItem: res.data.rows,
                    batch: true,
                    load: true,
                });
            },

        });
    },

});