const app = getApp();
let ip = getApp().data.ip;
import * as echarts from '../ec-canvas/echarts';

Page({
    data: {
        currentTabsIndex: 0,
        deviceId: '',
        class: ['收入统计', '商品统计', '设备统计'],
        day: [{name: '今日', type: '1'}, {name: '本月', type: '5'}, {name: '上月', type: '6'}, {name: '自定义', type: '7'}],
        typeIndex: 0, //时间
        dayType: '1',
        deviceType: '全部售货机',
        income: '',//收入
        incomeList: [],//收入列表
        incomePage: 1,
        hotTop: "",
        stopTop: "",
        hidden: true,
        createTimeStar: '',
        createTimeEnd: '',
        ecBar: {
            lazyLoad: true // 延迟加载
        },
        ecScatter: {
            lazyLoad: true
        },
        goodsClass: '',
        goodsName: '',
        incomeFootHide: true,
        deviceList: [],//设备列表
        devicePage: 1
    },
    onShow: function () {
        if (wx.getStorageSync("deviceType") !== '') {
            this.setData({
                deviceId: wx.getStorageSync("deviceId"),
                deviceType: wx.getStorageSync("deviceType"),
            });
            wx.removeStorageSync("deviceId");
            wx.removeStorageSync("deviceType");
            this.switchRequest(this.data.currentTabsIndex);
        } else {
            this.switchRequest(this.data.currentTabsIndex);
        }
    },
    // 选择
    selected: function (event) {
        let index = event.target.dataset.index;
        this.setData({
            currentTabsIndex: index
        });
        this.switchRequest(index);
    },

    // 收入统计
    income_statistics: function () {
        wx.request({
            url: ip + '/statics/income',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
            },
            method: 'GET',
            success: (res) => {
                this.setData({
                    income: res.data.data
                })
            },
        });
        this.getIncomeList();
    },

    // 商品统计
    goods_statistics: function () {
        //商品分类
        wx.request({
            url: ip + '/statics/classifyList',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
            },
            method: 'GET',
            success: (res) => {
                let goodsClass = [], goodsName = [];
                for (let i = 0, data = res.data.data; i < data.length; i++) {
                    goodsClass.push({
                        name: data[i].className,
                        value: data[i].salePrice
                    });
                    goodsName.push(data[i].className)
                }
                this.setData({
                    goodsClass: goodsClass,
                    goodsName: goodsName
                });
                this.barComponent = this.selectComponent('#mychart-multi-pie');
                this.init_pie();
            },
        });
        // 滞销
        wx.request({
            url: ip + '/statics/goodsTopList',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                type: '1',
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
            },
            method: 'GET',
            success: (res) => {
                let data = res.data.data;
                this.setData({
                    stopTop: data
                });
                this.setData({
                    stopTop: this.getProgress(this.data.stopTop),
                })
            },
        });
        // 热销
        wx.request({
            url: ip + '/statics/goodsTopList',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                type: '2',
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
            },
            method: 'GET',
            success: (res) => {
                let data = res.data.data;
                this.setData({
                    hotTop: data
                });
                this.setData({
                    hotTop: this.getProgress(this.data.hotTop),
                })
            },
        });
    },

    // 商品分类销售比
    init_pie() {
        this.barComponent.init((canvas, width, height) => {
            const barChart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            barChart.setOption(this.getPieOption());
            return barChart;
        })
    },

    getPieOption() {
        return {
            legend: {
                orient: 'vertical',
                right: '10%',
                y: 'center',
                data: this.data.goodsName
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['50%', '80%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: this.data.goodsClass
                }
            ]
        }
    },

    chooseTime(e) {
        let typeIndex = e.currentTarget.dataset.index;
        let dayType = e.currentTarget.dataset.type;
        this.setData({
            typeIndex: typeIndex,
            dayType: dayType
        });
        if (typeIndex === 3) {
            this.setData({hidden: false});
            return false;
        }
        this.switchRequest(this.data.currentTabsIndex);
    },
    cancel: function () {
        this.setData({
            hidden: true
        })
    },
    // 确认
    confirm: function () {
        this.setData({
            hidden: true
        });
        this.switchRequest(this.data.currentTabsIndex);
    },
    // 拿到开始时间
    bindStartTimeChange: function (e) {
        let createTimeStar = e.detail.value;
        this.setData({
            createTimeStar: createTimeStar
        });
    },
    // 拿到结束时间
    bindSendTimeChange: function (e) {
        let createTimeEnd = e.detail.value;
        if (createTimeEnd < this.data.createTimeStar) {
            wx.showModal({
                title: '提示',
                content: '结束时间不能小于开始时间',
            })
        } else {
            this.setData({
                createTimeEnd: createTimeEnd
            });
        }
    },
    deviceShow: function () {
        wx.navigateTo({
            url: "data-devices/data-devices"
        })
    },
    // 渲染进度条
    getProgress(arr) {
        let maxArr = arr.map((num) => {
            return num.countNum
        });
        let maxNumber = Math.max(...maxArr) + 30;
        for (let i = 0; i < arr.length; i++) {
            arr[i].width = ((arr[i].countNum / maxNumber) * 100).toFixed(1);
        }
        return arr;
    },

    // 收入列表
    getIncomeList() {
        wx.request({
            url: ip + '/statics/incomeListPage',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                page: this.data.incomePage,
                limit: '10',
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
            },
            method: 'GET',
            success: (res) => {
                this.setData({
                    incomeList: this.data.incomeList.concat(res.data.rows)
                });
                if (res.data.rows.length < 10) {
                    this.setData({
                        incomeFootHide: false
                    })
                }
            },
        });
    },
    // 设备列表
    getDeviceList() {
        wx.request({
            url: ip + '/statics/deviceList',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                dayType: this.data.dayType,
                page: this.data.devicePage,
                limit: '10',
                createTimeStar: this.data.createTimeStar,
                createTimeEnd: this.data.createTimeEnd,
                id: this.data.deviceId
            },
            method: 'GET',
            success: (res) => {
                this.setData({
                    deviceList: this.data.deviceList.concat(res.data.rows)
                });
            },
        });
    },

    // 下拉事件查看收入列表
    loadMoreIncomeList() {
        this.data.incomePage++;
        this.getIncomeList();
    },
    //下拉事件查看设备列表
    loadMoreDeviceList() {
        this.data.devicePage++;
        this.getDeviceList();
    },


    switchRequest(index) {
        switch (index) {
            case 0:
                this.setData({
                    incomePage: 1,
                    incomeList: [],
                    incomeFootHide: true
                });
                this.income_statistics();
                break;
            case 1:
                this.goods_statistics();
                break;
            case 2:
                this.setData({
                    deviceList: [],
                    devicePage: 1
                });
                this.getDeviceList()
        }
    }
});