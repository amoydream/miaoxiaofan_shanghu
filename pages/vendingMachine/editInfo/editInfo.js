// pages/vendingMachine/vendingChild/vendingChild.js
var ip = getApp().data.ip;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headImg: '',
        headImg2: '',
        id: '',
        realName: '',
        loginName: '',
        password: '',
        phone: '',
        age: '',
        card: '',
        sex: ['男', '女', '未知'],
        index: '0', //控制男女
        hidden: true,
        status: 1,
        state: '已启用',
    },
    onLoad: function (options) {
        this.setData({
            id: options.id,
        });
        if (options.type === '2') {
            this.setData({
                hidden: false
            })
        }

        wx.request({
            url: ip + '/inspector/select',
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": wx.getStorageSync("Authorization")
            },
            data: {
                id: this.data.id
            },
            method: 'GET',
            success: (res) => {
                this.setData({
                    headImg: ip + res.data.data.headImg,
                    headImg2: res.data.data.headImg,
                    realName: res.data.data.realName,
                    loginName: res.data.data.loginName,
                    password: res.data.data.password,
                    phone: res.data.data.phone,
                    age: res.data.data.age,
                    card: res.data.data.card,
                    index: res.data.data.sex === 1 ? '0' : res.data.data.sex === 2 ? '1' : '2',
                    status: res.data.data.status,
                });
                this.setData({
                    state: this.data.status === 1 ? "启用中" : "未启用"
                })
            },

        })

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
    // 确认
    save: function () {
        wx.showModal({
            title: "提示",
            content: '是否修改',
            success: (res) => {
                if (res.confirm) {
                    wx.request({
                        url: ip + '/inspector/update',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": wx.getStorageSync("Authorization")
                        },
                        data: {
                            id: this.data.id,
                            headImg: this.data.headImg2,
                            realName: this.data.realName,
                            loginName: this.data.loginName,
                            password: this.data.password,
                            phone: this.data.phone,
                            age: this.data.age === null ? '' : this.data.age,
                            card: this.data.card,
                            no: this.data.index === 0 ? 1 : 2,
                            status: this.data.status,
                            sex: this.data.index === '0' ? 1 : this.data.index === '1' ? 2 : '3'
                        },
                        method: 'POST',
                        success: (res) => {
                            if (res.data.code === 0) {
                                wx.navigateBack();
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

    state: function () {
        if (this.data.status === 1) {
            this.setData({
                status: 0,
                state: '未启用'
            })
        } else {
            this.setData({
                status: 1,
                state: '已启用'
            })
        }
    },

    bindChange: function (event) {
        var that = this;
        let index = event.detail.value;
        console.log(index);
        this.setData({
            index: index
        })
    },
});