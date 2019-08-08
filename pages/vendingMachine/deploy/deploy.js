var ip = getApp().data.ip;
var QQMapWX = require("../../../utils/qqmap-wx-jssdk.min");
var qqmapsdk = new QQMapWX({
    key: 'AUKBZ-M6I32-VVPUJ-C66JV-3UVV2-DGBHU'
});

Page({
    data: {
        latitude: "",
        longitude: "",
        markers: [{
            latitude: '',
            longitude: '',
        }],
        addressText: '',
        qRImg: '',
        address: "",//当前位置
        think: '',//联想数据
        thinkShow: true,
        mapShow: false,
        array: [],
        index: 0,//默认显示位置
        detailAddress: '',
        map: true,
        district: '',//区域信息
        areaShow: true,
        no: '',//机器型号
        name: '',//机器类型
        areaArr: null,
        areaId: '-1',//商圈id
        deviceId: '',
        province: '',//省
        provinceShow: true,
        provinceList: '',
        city: '',//市
        cityShow: true,
        cityList: '',
        county: '',//县
        countyShow: true,
        countyList: '',
        province1: '',//暂存
        city1: '',//暂存
        county1: '',//暂存
        deviceInfo: '',
        modalShow: true,
        operationTime: ''
    },
    onLoad: function (option) {
        this.setData({
            deviceId: option.id
        });
        // 查看设备信息
        wx.request({
            url: ip + '/device/deviceInfo',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                deviceId: option.id
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        deviceInfo: res.data.data,
                        detailAddress: res.data.data.address,
                        no: res.data.data.deviceType == null ? '' : res.data.data.deviceType.no,
                        name: res.data.data.deviceType == null ? '' : res.data.data.deviceType.name,
                        province: res.data.data.province,
                        city: res.data.data.city,
                        county: res.data.data.county,
                        district: res.data.data.address
                    });

                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },
        });


        //省市县
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                no: 0
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        provinceList: res.data.data
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },

        });
    },

    think: function (e) {
        qqmapsdk.getSuggestion({
            keyword: e.detail.value,
            success: (res) => {
                console.log(res);
                this.setData({
                    think: res.data,
                    thinkShow: false,
                    mapShow: true
                })
            },
            fail: function (res) {
                console.log(res.message);
            },
        });
    },
    // 选择地址
    choose: function (e) {
        console.log(e.currentTarget.dataset.all);
        this.setData({
            address: e.currentTarget.dataset.title,
            latitude: e.currentTarget.dataset.location.lat,
            longitude: e.currentTarget.dataset.location.lng,
            thinkShow: true,
            mapShow: false,
            province1: (e.currentTarget.dataset.all.province).substring(0, e.currentTarget.dataset.all.province.length - 1),
            city1: (e.currentTarget.dataset.all.city).substring(0, e.currentTarget.dataset.all.city.length - 1),
            county1: (e.currentTarget.dataset.all.district).substring(0, e.currentTarget.dataset.all.district.length - 1),
        });
        this.data.markers[0].longitude = e.currentTarget.dataset.location.lng;
        this.data.markers[0].latitude = e.currentTarget.dataset.location.lat;
        this.setData({
            markers: this.data.markers
        });
    },

    allHide: function () {
        this.setData({
            thinkShow: true,
            mapShow: false
        })
    },
    // 回车确认搜索
    nearby_search: function (e) {
        this.setData({
            addressText: e.detail.value,
            address: e.detail.value
        });
        // 调用接口
        qqmapsdk.geocoder({
            address: this.data.addressText,
            success: (res) => {
                console.log(res);
                this.data.markers[0].longitude = res.result.location.lng;
                this.data.markers[0].latitude = res.result.location.lat;
                this.setData({
                    latitude: res.result.location.lat,
                    longitude: res.result.location.lng,
                    markers: this.data.markers,
                    thinkShow: true,
                    mapShow: false,
                    province1: (res.result.address_components.province).substring(0, res.result.address_components.province.length - 1),
                    city1: (res.result.address_components.city).substring(0, res.result.address_components.city.length - 1),
                    county1: (res.result.address_components.district).substring(0, res.result.address_components.district.length - 1),
                });
            },
            fail: function (res) {
                wx.showModal({
                    title: "提示",
                    content: res.message
                })
            },
            complete: function (res) {
                // console.log(res);
            }
        });
    },
    // 点开地图
    map: function () {
        this.setData({
            map: false,
            address: this.data.district
        });
        // 拿到地理位置
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                });
                this.data.markers[0].longitude = res.longitude;
                this.data.markers[0].latitude = res.latitude;
                this.setData({
                    markers: this.data.markers
                });
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: res => {
                        this.setData({
                            address: res.result.address,
                            province1: (res.result.address_component.province).substring(0, res.result.address_component.province.length - 1),
                            city1: (res.result.address_component.city).substring(0, res.result.address_component.city.length - 1),
                            county1: (res.result.address_component.district).substring(0, res.result.address_component.district.length - 1),
                        });
                    },
                    fail: function (res) {
                        console.log(res);
                    },
                    complete: function (res) {
                        // console.log(res);
                    }
                });
            },
        });
    },
    // 确认
    affirm: function () {
        this.setData({
            map: true,
            district: this.data.address,
            province: this.data.province1,
            city: this.data.city1,
            county: this.data.county1
        })
    },
    areaShow: function () {
        this.setData({
            areaShow: false
        })
    },

    areaHide: function () {
        this.setData({
            areaShow: true,
            provinceShow: true,
            cityShow: true,
            countyShow: true
        })
    },

    // 省出来
    provinceShow: function () {
        this.setData({
            provinceShow: false,
            cityShow: true,
            countyShow: true
        })
    },

    // 市出来
    cityShow: function () {
        this.setData({
            provinceShow: true,
            cityShow: false,
            countyShow: true
        })
    },

    // 县出来
    countyShow: function () {
        this.setData({
            provinceShow: true,
            cityShow: true,
            countyShow: false
        })
    },
    // 选择省
    chooseProvince: function (e) {
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                no: e.currentTarget.dataset.no
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        cityList: res.data.data,
                        province: e.currentTarget.dataset.name,
                        provinceShow: true,
                        cityShow: true,
                        countyShow: true
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },

        });
    },
    // 选择市
    chooseCity: function (e) {
        wx.request({
            url: ip + '/area/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                no: e.currentTarget.dataset.no
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        countyList: res.data.data,
                        city: e.currentTarget.dataset.name,
                        provinceShow: true,
                        cityShow: true,
                        countyShow: true
                    })
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },

        });
    },
    // 选择县
    chooseCounty: function (e) {
        this.setData({
            county: e.currentTarget.dataset.name,
            provinceShow: true,
            cityShow: true,
            countyShow: true
        })
    },

    // 保存
    save: function () {
        wx.request({
            url: ip + '/device/updateDeviceInfo',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'POST',
            data: {
                id: this.data.deviceId,
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                // areaIds: this.data.areaId,
                province: this.data.province,
                city: this.data.city,
                county: this.data.county,
                address: this.data.district
            },
            success: (res) => {
                if (res.data.code === 0) {
                    this.setData({
                        array: res.data.data
                    });
                    wx.showModal({
                        title: "提示",
                        content: res.data.data,
                        success: function () {
                            wx.navigateBack()
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
    },
    // 查看二维码
    tapHandler: function (e) {
        wx.request({
            url: ip + '/device/h5DefaultQRCode',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.deviceId
            },
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    this.setData({
                        qRImg: res.data.data
                    });
                    this.setData({
                        modalShow: false,
                    });
                } else {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },

        });
    },
    // 关闭二维码
    confirm: function () {
        this.setData({
            modalShow: true,
        });
    },
    // 拿到时间
    bindSendTimeChange: function (e) {
        this.setData({
            operationTime: e.detail.value
        });
    },
});