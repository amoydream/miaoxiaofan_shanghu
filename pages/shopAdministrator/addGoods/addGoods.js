const app = getApp();
var ip = getApp().data.ip;
Page({
    data: {
        statusIndex: 0,
        statusName: ['上架', '下架'],
        labelIndex: 0,
        labelName: [],
        labelId: [],
        classIndex: 0,
        className: [],
        classId: [], //分类id
        goodsImg: '',//商品图片
        goodsImg2: '',
        no: '',//商品编号
        brand: '',//商品品牌
        name: '',//商品名称
        model: '',//型号
        unit: '',//商品单位
        cost: '',//成本价
        price: '',//建议价
        discount: '',//实际销售价格
        remark: '',//备注
        status: 1,//上下架
        classId2: '',
        labelId2: '',
        type: 1,
        goodsId: ''
    },
    onLoad: function (options) {
        this.setData({
            goodsId: options.id
        });
        if (JSON.stringify(options) !== '{}') {
            wx.request({
                url: ip + '/goods/info',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    id: options.id
                },
                method: 'GET',
                success: (res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        this.setData({
                            type: 2,
                            goodsImg: ip + res.data.data.img,//商品图片
                            goodsImg2: res.data.data.img,
                            no: res.data.data.no,//商品编号
                            brand: res.data.data.brand,//商品品牌
                            name: res.data.data.name,//商品名称
                            model: res.data.data.model,//型号
                            unit: res.data.data.unit,//商品单位
                            cost: res.data.data.cost,//成本价
                            price: res.data.data.price,//建议价
                            discount: res.data.data.discount,//实际销售价格
                            remark: res.data.data.remark,//备注
                            status: res.data.data.status,//上下架
                            classId2: res.data.data.classId,
                            labelId2: res.data.data.labelId
                        });
                        if (res.data.data.status === 1) {
                            this.setData({
                                statusIndex: 0
                            })
                        } else {
                            this.setData({
                                statusIndex: 1
                            })
                        }
                        console.log(this.data.labelId2);
                        // 拿到标签
                        wx.request({
                            url: ip + '/goods/selectAllLabel',
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Authorization": wx.getStorageSync("Authorization")
                            },
                            method: 'GET',
                            success: (res) => {
                                console.log(this.data.labelId2);
                                let arr = [];
                                for (let i = 0; i < res.data.data.length; i++) {
                                    arr.push(res.data.data[i].name);
                                    this.data.labelId.push(res.data.data[i].id);
                                    if (this.data.labelId2 === res.data.data[i].id) {
                                        this.setData({
                                            labelIndex: i
                                        })
                                    }
                                }
                                this.setData({
                                    labelName: arr
                                })
                            },

                        });
                        //分类id,
                        wx.request({
                            url: ip + '/goods/selectAllClass',
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Authorization": wx.getStorageSync("Authorization")
                            },
                            method: 'GET',
                            success: (res) => {
                                let arr = [];
                                for (let i = 0; i < res.data.data.length; i++) {
                                    arr.push(res.data.data[i].name);
                                    this.data.classId.push(res.data.data[i].id);
                                    if (this.data.classId2 === res.data.data[i].id) {
                                        this.setData({
                                            classIndex: i
                                        })
                                    }
                                }
                                this.setData({
                                    className: arr
                                })
                            },

                        });
                    }
                },

            });
        } else {
            // 拿到标签
            wx.request({
                url: ip + '/goods/selectAllLabel',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                method: 'GET',
                success: (res) => {
                    console.log(this.data.labelId2);
                    let arr = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        arr.push(res.data.data[i].name);
                        this.data.labelId.push(res.data.data[i].id);
                        if (this.data.labelId2 === res.data.data[i].id) {
                            this.setData({
                                labelIndex: i
                            })
                        }
                    }

                    this.setData({
                        labelName: arr
                    })
                },

            });
            //分类id,
            wx.request({
                url: ip + '/goods/selectAllClass',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                method: 'GET',
                success: (res) => {
                    let arr = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        arr.push(res.data.data[i].name);
                        this.data.classId.push(res.data.data[i].id)
                    }
                    this.setData({
                        className: arr
                    })
                },

            });
        }

    },
    bindChange1: function (e) {
        this.setData({
            statusIndex: e.detail.value,
        });
        if (this.data.statusIndex == 0) {
            this.setData({
                status: 1
            })
        } else {
            this.setData({
                status: 0
            })
        }
    },
    bindChange2: function (e) {
        this.setData({
            labelIndex: e.detail.value,
        });
    },
    bindChange3: function (e) {
        this.setData({
            classIndex: e.detail.value,
        });
        console.log(this.data.classId[this.data.classIndex]);
    },
    //上传照片
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
                        let goodsImg = JSON.parse(res.data);
                        this.setData({
                            goodsImg: ip + goodsImg.data,
                            goodsImg2: goodsImg.data
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
    confirm: function () {
        if (this.data.type === 1) {
            wx.request({
                url: ip + '/goods/add',
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    classId: this.data.classId[this.data.classIndex],
                    no: this.data.no,
                    brand: this.data.brand,
                    name: this.data.name,
                    model: this.data.model,
                    unit: this.data.unit,
                    cost: this.data.cost,
                    price: this.data.price,
                    discount: this.data.discount,
                    status: this.data.status,
                    img: this.data.goodsImg2,
                    remark: this.data.remark,
                    labelId: this.data.labelId[this.data.labelIndex] == undefined ? '' : this.data.labelId[this.data.labelIndex]
                },
                success: (res) => {
                    if (res.data.code === 0) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.msg,
                            success: function () {
                                wx.navigateBack();
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                        })
                    }

                },

            });
        } else {
            wx.request({
                url: ip + '/goods/update',
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": wx.getStorageSync("Authorization")
                },
                data: {
                    id: this.data.goodsId,
                    classId: this.data.classId[this.data.classIndex],
                    no: this.data.no,
                    brand: this.data.brand,
                    name: this.data.name,
                    model: this.data.model,
                    unit: this.data.unit,
                    cost: this.data.cost,
                    price: this.data.price,
                    discount: this.data.discount,
                    status: this.data.status,
                    img: this.data.goodsImg2,
                    remark: this.data.remark,
                    labelId: this.data.labelId[this.data.labelIndex] == undefined ? '' : this.data.labelId[this.data.labelIndex]
                },
                success: (res) => {
                    if (res.data.code === 0) {
                        wx.showModal({
                            title: "提示",
                            content: res.data.msg,
                            success: function () {
                                wx.navigateBack();
                            }
                        })
                    } else {
                        wx.showModal({
                            title: "提示",
                            content: res.data.data,
                        })
                    }

                },

            });
        }

    },

    brandInput: function (e) {
        this.setData({
            brand: e.detail.value
        });
    },
    noInput: function (e) {
        this.setData({
            no: e.detail.value
        });
    },
    nameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    modelInput: function (e) {
        this.setData({
            model: e.detail.value
        });
    },
    unitInput: function (e) {
        this.setData({
            unit: e.detail.value
        });
    },
    costInput: function (e) {
        this.setData({
            cost: e.detail.value
        });
    },
    priceInput: function (e) {
        this.setData({
            price: e.detail.value
        });
    },
    discountInput: function (e) {
        this.setData({
            discount: e.detail.value
        });
    },
    remarkInput: function (e) {
        this.setData({
            remark: e.detail.value
        });
    },
});
