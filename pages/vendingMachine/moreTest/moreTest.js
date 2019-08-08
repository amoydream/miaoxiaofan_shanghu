//index.js
//获取应用实例
const app = getApp();
let ip = getApp().data.ip;
Page({
    data: {
        items: '',
        id: '',
        channelList: ''
    },
    onLoad(options) {
        this.setData({
            id: options.id
        });
        console.log(this.data.id);
        this.getChannelList();
    },
    // 货道测试列表
    getChannelList() {
        wx.request({
            url: ip + '/channelGoods/deviceAmountGoods',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                "deviceId": this.data.id,
            },
            method: 'GET',
            success: (res) => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    data.map((num) => num.choose = 0);
                    this.setData({
                        channelList: data
                    });
                } else {
                    if (res.data.code === 1001) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                            success: function () {
                                wx.removeStorageSync("loginCode");
                                wx.redirectTo({
                                    url: '../login/login',
                                })
                            }
                        });
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data
                        })
                    }
                }

            },
        });
    },

    chooseChannel(e) {
        let choose = e.currentTarget.dataset.choose;
        let index = e.currentTarget.dataset.index;
        switch (choose) {
            case 0:
                this.data.channelList[index].choose = 1;
                break;
            case 1:
                this.data.channelList[index].choose = 0;
        }
        this.setData({
            channelList: this.data.channelList
        })
    },
    channelTest() {
        let channelGoodsIds = -1;
        for (let i = 0; i < this.data.channelList.length; i++) {
            if (this.data.channelList[i].choose === 1) {
                channelGoodsIds = channelGoodsIds + ","+this.data.channelList[i].id
            }
        }

        wx.request({
            url: ip + '/channelGoods/sendManyTest ',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                deviceId: this.data.id,
                channelGoodsIds:channelGoodsIds
            },
            method: 'POST',
            success: (res) => {
                wx.showModal({
                    title: "提示",
                    content: res.data.data
                });
                this.getData();
            },
        });
    }
});