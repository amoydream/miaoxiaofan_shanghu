const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        id: '',
        province: '',//省
        provinceName: '',
        pShow: true,//
        city: '',//市
        cityName: '',
        cShow: true,//
        county: '',//县
        countyName: '',
        ccShow: true,//
        name: '',//合作商名称
        no: '',//合作商编号
        fixed: '',//固定电话
        phone: '',//手机号码
        fax: '',//传真地址
        address: '',//详细地址
    },
    onShow: function () {
        wx.request({
            url: ip + '/partner/person',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        id: res.data.data.id,
                        name: res.data.data.name,
                        no: res.data.data.no,
                        fixed: res.data.data.fixed,
                        phone: res.data.data.phone,
                        fax: res.data.data.fax,
                        address: res.data.data.address,
                        provinceName: res.data.data.province,
                        cityName: res.data.data.city,
                        countyName: res.data.data.county,
                        city: res.data.data.cities,
                        county: res.data.data.counties
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: function () {
                                wx.removeStorageSync("loginCode");
                                wx.reLaunch({
                                    url: '../login/login',
                                })
                            }
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
        // 省
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            data: {
                no: 0
            },
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        province: res.data.data
                    })
                }
            },
        });


    },
    // 省出现
    pShow: function () {
        this.setData({
            pShow: false,
        })
    },
    cShow: function () {
        this.setData({
            cShow: false,
        })
    },
    ccShow: function () {
        this.setData({
            ccShow: false,
        })

    },

    hide: function () {
        this.setData({
            ccShow: true,
            cShow: true,
            pShow: true,
        })
    },
    // 选择省
    chooseP: function (e) {
        console.log(e.target.dataset.name1);
        this.setData({
            provinceName: e.target.dataset.name1,
            pShow: true,
        });
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            data: {
                no: e.target.dataset.no
            },
            success: (res) => {
                console.log(res);
                this.setData({
                    city: res.data.data,
                })
            },
        })
    },
    // 选择市
    chooseC: function (e) {
        this.setData({
            cityName: e.target.dataset.name1,
            cShow: true,
        });
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            data: {
                no: e.target.dataset.no
            },
            success: (res) => {
                console.log(res);
                this.setData({
                    county: res.data.data,
                })

            },
        })
    },
    // 选择县
    chooseCc: function (e) {
        console.log(e.target.dataset.name1);
        this.setData({
            countyName: e.target.dataset.name1,
            ccShow: true,
        });

    },
    fixedInput: function (e) {
        this.setData({
            fixed: e.detail.value
        })
    },
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    faxInput: function (e) {
        this.setData({
            fax: e.detail.value
        })
    },
    addressInput: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    // 确认修改
    amend: function () {
        wx.request({
            url: ip + '/partner/modifyInfo',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'POST',
            data: {
                id: this.data.id,
                fixed: this.data.fixed,
                phone: this.data.phone,
                fax: this.data.fax,
                address: this.data.address,
                province: this.data.provinceName,
                city: this.data.cityName,
                county: this.data.countyName
            },
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.msg,
                        success: function () {
                            wx.navigateBack();
                        }
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.removeStorageSync("Authorization");
                        wx.redirectTo({
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
});
