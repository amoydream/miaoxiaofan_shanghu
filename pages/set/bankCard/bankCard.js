const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        bankName: '',//银行卡名称
        bankAccount: '',//卡号
        accountName: '',//开卡人姓名
        subbranch: "",//支行地址
        bankAddress: '',//银行地址
        id: '',
        banks: '',
        bShow: true
    },
    onLoad: function () {
        wx.request({
            url: ip + '/partner/person',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    this.setData({
                        bankName: res.data.data.bank.bankName,//银行卡名称
                        bankAccount: res.data.data.bank.account,//卡号
                        accountName: res.data.data.bank.accountName,//开卡人姓名
                        subbranch: res.data.data.bank.subbranch,//支行地址
                        bankAddress: res.data.data.bank.bankAddress,//银行地址
                        id: res.data.data.bank.id
                    })
                }
            },
        });
        wx.request({
            url: ip + '/partner/banks',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    console.log(res.data);
                    this.setData({
                        banks: res.data.data
                    })
                }
            },
        });
    },
    bankAccount: function (e) {
        this.setData({
            bankAccount: e.detail.value
        })
    },
    bankName: function (e) {
        this.setData({
            bankName: e.detail.value
        })
    },
    accountName: function (e) {
        this.setData({
            accountName: e.detail.value
        })
    },
    subbranch: function (e) {
        this.setData({
            subbranch: e.detail.value
        })
    },
    bankAddress: function (e) {
        this.setData({
            bankAddress: e.detail.value
        })
    },
    addBankCard: function () {
        wx.request({
            url: ip + '/partner/modifyBank',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            method: 'POST',
            data: {
                bankName: this.data.bankName,//银行卡名称
                account: this.data.bankAccount,//卡号
                accountName: this.data.accountName,//开卡人姓名
                subbranch: this.data.subbranch,//支行地址
                bankAddress: this.data.bankAddress,//银行地址
                id: this.data.id
            },
            success: (res) => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showModal({
                        title: "提示",
                        content: res.data.data
                    })
                }
            },
        })
    },
    bankShow: function () {
        this.setData({
            bShow: false
        })
    },
    bankHide: function () {
        this.setData({
            bShow: true
        })
    },
    chooseBank: function (e) {
        console.log(e.target.dataset.text);
        this.setData({
            bankName: e.target.dataset.text,
            bShow: true
        })

    }

});
