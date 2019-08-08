// pages/shopAdministrator/shopListOne/shopListOne.js
let ip = getApp().data.ip;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        ip: ip,
        shopList: ['出售中', '已下架'],
        shopListIndex: 0,
        classId: '',
        page: 1,
        goodsItem: '',
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        two: '下拉加载更多',
        status: 1,
        priceRank: ['价格升序', '价格降序'],
        nameRank: ['名称升序', '名称降序'],
        index1: 0,
        index2: 0,
        hidden: true,
        goodsId: '',
        order: '',
        sort: '',
        batch: true,
        ids: [],
        without: true
    },
    BtnTabList: function (e) {
        let TabIndex = e.target.dataset.tabindex;
        // console.log(TabIndex)
        this.setData({
            shopListIndex: TabIndex,
        });
        if (TabIndex === 0) {
            this.setData({
                page: 1,
                status: 1,
                refresh: true,
                load: true,
                flag1: true,
                flag2: true,
                two: '下拉加载更多',
            });
            wx.request({
                url: ip + '/goods/selectGoodsByClass',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    classId: this.data.classId,
                    page: this.data.page,
                    limit: '10',
                    status: this.data.status
                },
                method: 'GET',
                success: (res) => {
                    for (let i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].choose = 0;
                    }
                    if (res.data.rows.length === 0) {
                        this.setData({
                            without: false
                        })
                    } else {
                        this.setData({
                            without: true
                        })
                    }
                    this.setData({
                        goodsItem: res.data.rows
                    })
                },

            });
        } else {
            this.setData({
                page: 1,
                status: 0,
                refresh: true,
                load: true,
                flag1: true,
                flag2: true,
                two: '下拉加载更多',
            });
            wx.request({
                url: ip + '/goods/selectGoodsByClass',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    classId: this.data.classId,
                    page: this.data.page,
                    limit: '10',
                    status: this.data.status
                },
                method: 'GET',
                success: (res) => {
                    console.log(res);
                    for (let i = 0; i < res.data.rows.length; i++) {
                        res.data.rows[i].choose = 0;
                    }
                    if (res.data.rows.length === 0) {
                        this.setData({
                            without: false
                        })
                    } else {
                        this.setData({
                            without: true
                        })
                    }
                    this.setData({
                        goodsItem: res.data.rows
                    })
                },

            });
        }
    },

    onLoad: function (options) {
        console.log(options.id);
        this.setData({
            classId: options.id
        });
        wx.request({
            url: ip + '/goods/selectGoodsByClass',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                classId: this.data.classId,
                page: this.data.page,
                limit: '10',
                status: this.data.status
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
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
                    goodsItem: res.data.rows
                })
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
                    url: ip + '/goods/selectGoodsByClass',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        classId: this.data.classId,
                        status: this.data.status,
                        page: this.data.page,
                        limit: "10",
                        sort: this.data.sort,
                        order: this.data.order
                    },
                    success: (res) => {
                        console.log(res.data.rows);
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                // load: true,
                                two: '已经到底了',
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                goodsItem: this.data.goodsItem.concat(res.data.rows),
                                // load: true,
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
                    url: ip + '/goods/selectGoodsByClass',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        classId: this.data.classId,
                        status: this.data.status,
                        page: this.data.page,
                        limit: "10",
                        sort: this.data.sort,
                        order: this.data.order
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log('刷新');
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        this.setData({
                            goodsItem: res.data.rows,
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

    bindChange1: function (e) {
        console.log(e.detail.value);
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
            url: ip + '/goods/selectGoodsByClass',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                classId: this.data.classId,
                status: this.data.status,
                page: this.data.page,
                limit: "10",
                sort: this.data.sort,
                order: this.data.order
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
                console.log(res.data.rows);
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
            url: ip + '/goods/selectGoodsByClass',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                classId: this.data.classId,
                status: this.data.status,
                page: this.data.page,
                limit: "10",
                sort: this.data.sort,
                order: this.data.order
            },
            method: 'GET',
            success: (res) => {
                console.log(res.data.rows);
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
                    goodsItem: res.data.rows
                });
            },

        });
    },

    del: function (e) {
        console.log(e.target.dataset.id);
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
        wx.request({
            url: ip + '/goods/delete',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                ids: this.data.goodsId
            },
            method: 'POST',
            success: (res) => {
                wx.showModal({
                    title: "提示",
                    content: res.data.data
                });
                wx.request({
                    url: ip + '/goods/selectGoodsByClass?loginCode=' + wx.getStorageSync("loginCode"),
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        classId: this.data.classId,
                        page: this.data.page,
                        limit: '10',
                        status: this.data.status
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log(res);
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        this.setData({
                            goodsItem: res.data.rows
                        })
                    },

                });
            },

        });
    },
    // 选择
    choose: function (e) {
        let index = e.currentTarget.dataset.index;
        console.log(e);

        if (this.data.goodsItem[index].choose === 0) {
            this.data.goodsItem[index].choose = 1;
            this.setData({
                goodsItem: this.data.goodsItem
            });
            this.setData({
                ids: this.data.ids.concat(e.currentTarget.dataset.id)
            })
        } else {
            let arr = [];
            this.data.goodsItem[index].choose = 0;
            for (let i = 0; i < this.data.ids.length; i++) {
                if (e.currentTarget.dataset.id !== this.data.ids[i]) {
                    arr.push(this.data.ids[i])
                }
            }
            this.setData({
                goodsItem: this.data.goodsItem,
                ids: arr
            })
        }
        console.log(this.data.ids);

    },
    // 出现批量操作按钮
    batch: function () {
        this.setData({
            batch: false
        })
    },
    //批量删除
    batchDel: function () {
        wx.request({
            url: ip + '/goods/delete',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                ids: this.data.ids
            },
            method: 'POST',
            success: (res) => {
                wx.showModal({
                    title: "提示",
                    content: res.data.data
                });
                wx.request({
                    url: ip + '/goods/selectGoodsByClass',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    data: {
                        classId: this.data.classId,
                        status: this.data.status,
                        page: this.data.page,
                        limit: "10"
                    },
                    method: 'GET',
                    success: (res) => {
                        for (let i = 0; i < res.data.rows.length; i++) {
                            res.data.rows[i].choose = 0;
                        }
                        console.log(res.data.rows);
                        this.setData({
                            goodsItem: res.data.rows,
                            batch: false,
                            ids: []
                        });
                    },

                });
            },

        });
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
            url: ip + '/goods/selectGoodsByClass',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                classId: this.data.classId,
                status: this.data.status,
                page: 1,
                limit: "10"
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
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
    }
});