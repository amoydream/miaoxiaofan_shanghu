//index.js
//获取应用实例
const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        titleArr: ['所有货柜', '电机/格子柜', 'RFID货柜'],
        titleIndex: 0,
        isShow: true,
        page: 1,
        deviceList: '',
        structureId: '',
        refresh: true,
        load: true,
        flag1: true,
        flag2: true,
        two: '下拉加载更多',
    },
    onLoad: function () {
        this.getData();
    },
    chooseIndex: function (e) {
        this.setData({
            titleIndex: e.currentTarget.dataset.index,
            load:true
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
        this.getData();
    },

    skip: function (e) {
        let structureId = e.currentTarget.dataset.structureid;
        let id = e.currentTarget.dataset.id;
        if(structureId===1){
            wx.navigateTo({
                url:"tradition/tradition?id="+id
            })
        }else{
            wx.navigateTo({
                url:"RFIDDetails/RFIDDetails?id="+id
            })
        }
    },
    getData: function () {
        wx.request({
            url: ip + '/device/goodsPage?loginCode=' + wx.getStorageSync("loginCode"),
            header: {                 "Content-Type": "application/x-www-form-urlencoded",                 "Authorization": wx.getStorageSync("Authorization")             },
            method: 'GET',
            data: {
                structureId: this.data.structureId,
                page: this.data.page,
                limit: 10
            },
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        deviceList: res.data.rows
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }

            },

        })
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
                    url: ip + '/device/goodsPage?loginCode=' + wx.getStorageSync("loginCode"),
                    header: {                 "Content-Type": "application/x-www-form-urlencoded",                 "Authorization": wx.getStorageSync("Authorization")             },
                    data: {
                        structureId: this.data.structureId,
                        page: this.data.page,
                        limit: "10",
                    },
                    method: 'GET',
                    success: (res) => {
                        if (res.data.rows.length < 10) {
                            this.setData({
                                flag1: false,
                                two: '已经到底了',
                                deviceList: this.data.deviceList.concat(res.data.rows),
                            })
                        } else {
                            this.setData({
                                deviceList: this.data.deviceList.concat(res.data.rows),
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
                    url: ip + '/device/goodsPage?loginCode=' + wx.getStorageSync("loginCode"),
                    header: {                 "Content-Type": "application/x-www-form-urlencoded",                 "Authorization": wx.getStorageSync("Authorization")             },
                    data: {
                        structureId: this.data.structureId,
                        page: this.data.page,
                        limit: "10",
                    },
                    method: 'GET',
                    success: (res) => {
                        this.setData({
                            deviceList: res.data.rows,
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

});