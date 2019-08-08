// pages/vendingMachine/vendingChild/vendingChild.js
var ip = getApp().data.ip;
Page({
    data: {
        headImg: '',
        headImg2: '',
        realName: '',
        loginName: '',
        password: '',
        phone: '',
        age: '',
        card: '',
        status: 1,
        state: '启用中',
        sex: ['男', '女'],
        index: '0', //控制男女
    },
    // 修改头像
    choose: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths[0];
                console.log(tempFilePaths);
                wx.uploadFile({
                    url: ip + '/file/uploadFile',
                    header: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": wx.getStorageSync("Authorization")
                    },
                    filePath: tempFilePaths,
                    name: 'file',
                    success: (res) => {
                        console.log(JSON.parse(res.data));
                        let headImg = JSON.parse(res.data);
                        this.setData({
                            headImg: ip + headImg.data,
                            headImg2: headImg.data
                        })
                    },
                    fail: function (res) {
                        console.log("tt");
                    }
                })
            }
        })
    },
    userNameInput: function (e) {
        this.setData({
            realName: e.detail.value
        });
    },
    loginNameInput: function (e) {
        this.setData({
            loginName: e.detail.value
        });
    },
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        });
    },
    passwordInput: function (e) {
        this.setData({
            password: e.detail.value
        });
    },
    ageInput: function (e) {
        this.setData({
            age: e.detail.value
        });
    },
    cardInput: function (e) {
        this.setData({
            card: e.detail.value
        });
    },
    // 保存
    save: function () {
        console.log(this.data.index);
        wx.showModal({
            title: "提示",
            content: '是否添加',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: ip + '/inspector/add',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        data: {
                            headImg: this.data.headImg2,
                            realName: this.data.realName,
                            loginName: this.data.loginName,
                            password: this.data.password,
                            phone: this.data.phone,
                            age: this.data.age === null ? '' : this.data.age,
                            card: this.data.card,
                            no: this.data.index === 0 ? 1 : 2,
                            status: this.data.status,
                            sex: this.data.index === '0' ? 1 : 2
                        },
                        method: 'POST',
                        success: (res) => {

                            if (res.data.code === 0) {
                                console.log(res);
                                wx.showModal({
                                    title: "提示",
                                    content: res.data.msg,
                                    success: function () {
                                        wx.navigateBack()
                                    }
                                })
                            } else {
                                wx.showModal({
                                    title: "提示",
                                    content: res.data.data,
                                })
                            }

                        },
                    })
                }

            }
        });

    },

    state: function () {
        if (this.data.status === 1) {
            this.setData({
                status: 0,
                state: '未启用'
            })
        } else {
            this.setData({
                status: 1,
                state: '启用中'
            })
        }
    },
    bindChange: function (event) {
        var that = this;
        let index = event.detail.value;
        this.setData({
            index: index
        })
    },
});