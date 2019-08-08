const app = getApp();
var ip = getApp().data.ip;


function getNowTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    ;
    if (day < 10) {
        day = '0' + day;
    }
    var formatDate = year + '-' + month + '-' + day;
    return formatDate;
}

// 时间
function formatDate(val) {
    // 格式化时间
    var start = new Date(val)
    var y = start.getFullYear()
    var m = (start.getMonth() + 1) > 10 ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
    var d = start.getDate() > 10 ? start.getDate() : '0' + start.getDate();
    return y + '-' + m + '-' + d
}

function mistiming(sDate1, sDate2) {
    // 计算开始和结束的时间差
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split('-');
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    aDate = sDate2.split('-');
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
    return iDays + 1
}

function countDate(start, end) {
    // 判断开始和结束之间的时间差是否在90天内
    var days = mistiming(start, end);
    var stateT = days > 90 ? Boolean(0) : Boolean(1);
    return {
        state: stateT,
        day: days
    }
}

function timeForMat(count) {
    // 拼接时间
    var time1 = new Date();
    time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000));
    var Y1 = time1.getFullYear();
    var M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1));
    var D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate());
    var timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
    var time2 = new Date();
    time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count));
    var Y2 = time2.getFullYear()
    var M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1));
    var D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate());
    var timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
    return {
        t1: timer1,
        t2: timer2
    }
}

function yesterday(start, end) {
    // 校验是不是选择的昨天
    var timer = timeForMat(1);
    return timer
}

function sevenDays() {
    // 获取最近7天
    var timer = timeForMat(7)
    return timer
}

function thirtyDays() {
    // 获取最近30天
    var timer = timeForMat(30)
    return timer
}

Page({
    data: {
        startTime: "",
        endTime: '',
        income: "", ///总收入
        profit: "",//总的预估利润,
        chooseArr: ["今天", "昨天", "最近7天", "自定义"],
        chooseIndex: 0,
        hidden: true,
        allCost: "",//
        allIncome: "",//
        allProfit: "",//
        hitNum: "",
        hitRate: "",
        luckCost: "",
        luckIncome: "",
        luckNum: "",
        luckProfit: "",
        saleCost: "",
        saleIncome: "",
        saleProfit: "",
    },
    onLoad: function () {
        // 今天
        this.getProfit(getNowTime(), "");
    },
    // 拿到开始时间
    bindStartTimeChange: function (e) {
        this.setData({
            startTime: e.detail.value
        });
    },
    // 拿到结束时间
    bindSendTimeChange: function (e) {
        this.setData({
            endTime: e.detail.value
        });
    },

    chooseBtn: function (e) {
        this.setData({
            chooseIndex: e.currentTarget.dataset.index
        });
        if (e.currentTarget.dataset.index == 0) {
            // 今天
            this.getProfit(getNowTime(), "");
        } else if (e.currentTarget.dataset.index == 1) {
            // 昨天
            var start = yesterday().t1;
            this.getProfit(start, getNowTime());

        } else if (e.currentTarget.dataset.index == 2) {
            // 最近七天
            var start = sevenDays().t2;
            this.getProfit(start, getNowTime());
        } else if (e.currentTarget.dataset.index == 3) {
            this.setData({
                hidden: false
            })
        }
    },
    cancel: function () {
        this.setData({
            hidden: true
        })
    },
    confirm: function () {
        this.getProfit(this.data.startTime, this.data.endTime + ' 23:59:59:999');
    },

    // 获取数据
    getProfit: function (start, end) {
        wx.request({
            url: ip + '/profit/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                start: start,
                end: end
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    this.setData({
                        hidden: true,
                        allCost: res.data.data.allCost,//
                        allIncome: res.data.data.allIncome,//
                        allProfit: res.data.data.allProfit,//
                        hitNum: res.data.data.hitNum,
                        hitRate: res.data.data.hitRate,
                        luckCost: res.data.data.luckCost,
                        luckIncome: res.data.data.luckIncome,
                        luckNum: res.data.data.luckNum,
                        luckProfit: res.data.data.luckProfit,
                        saleCost: res.data.data.saleCost,
                        saleIncome: res.data.data.saleIncome,
                        saleProfit: res.data.data.saleProfit,
                    })
                } else {
                    if (res.data.code === 1001) {
                        wx.removeStorageSync("loginCode");
                        wx.reLaunch({
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