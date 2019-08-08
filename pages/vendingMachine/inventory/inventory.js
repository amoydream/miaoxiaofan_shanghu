const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        headImg: '',
        phone: '',
        userName: '',
        device: '',
    },
    onLoad: function (options) {
        wx.request({
            url: ip + '/inspector/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: options.id
            },
            method: 'GET',
            success: (res) => {
                this.setData({
                    headImg: ip + res.data.data.headImg,
                    phone: res.data.data.phone,
                    userName: res.data.data.realName,
                    device: res.data.data.devices
                });
            },

        })
    }
});
