// pages/location/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 18, // 缩放级别，默认18，数值在0~18之间
    latitude: 0, // 纬度初始值
    longitude: 0, // 经度初始值
    markers:[
      {
        "id": 0,
        "title": "查看详情",
        "iconPath": "/images/markers.png",
        "latitude": 31.337895,
        "longitude": 121.447718,
        "width": 36,
        "height": 36
      },
      {
        "id": 1,
        "title": "查看详情",
        "iconPath": "/images/markers.png", 
        "latitude": 31.338974,
        "longitude": 121.44894,
        "width": 36,
        "height": 36
      },
      {
        "id": 2,
        "title": "查看详情",
        "iconPath": "/images/markers.png", 
        "latitude": 31.338882,
        "longitude": 121.443981,
        "width": 36,
        "height": 36
      },
      {
        "id": 3,
        "title": "查看详情",
        "iconPath": "/images/markers.png", 
        "latitude": 31.335859,
        "longitude": 121.453935, 
        "width": 36,
        "height": 36
      },
      {
        "id": 4,
        "title": "查看详情",
        "iconPath": "/images/markers.png", 
        "latitude": 31.336075,
        "longitude": 121.443191,
        "width": 36,
        "height": 36
      },
      {
        "id": 5,
        "title": "查看详情",
        "iconPath": "/images/markers.png", 
        "latitude": 31.340085,
        "longitude": 121.444736,
        "width": 36,
        "height": 36
      },
      {
        "id": 6,
        "title": "查看详情",
        "iconPath": "/images/markers.png",
        "latitude": 28.724559,
        "longitude": 115.834195,
        "width": 36,
        "height": 36
      },
      {
        "id": 7,
        "title": "查看详情",
        "iconPath": "/images/markers.png",
        "latitude": 28.682892,
        "longitude": 115.858198,
        "width": 36,
        "height": 36
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: "gcj02", // 坐标系类型
      // 获取经纬度成功回调
      success: (res) => { // es6 箭头函数，可以解绑当前作用域的this指向，使得下面的this可以绑定到Page对象
        this.setData({  // 为data对象里定义的经纬度默认值设置成获取到的真实经纬度，这样就可以在地图上显示我们的真实位置
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    });
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({ // 系统API,获取系统信息，比如设备宽高
      success: (res) => {
        this.setData({
          // 定义控件数组，可以在data对象初始化为[],也可以不初始化，取决于是否需要更好的阅读
          controls: [{
            id: 1, // 给控件定义唯一id
            iconPath: '/images/location.png', // 控件图标
            position: { // 控件位置
              left: 20, // 单位px
              top: res.windowHeight - 80, // 根据设备高度设置top值，可以做到在不同设备上效果一致
              width: 50, // 控件宽度/px
              height: 50 // 控件高度/px
            },
            clickable: true // 是否可点击，默认为true,可点击
          },
          {
            id: 2,
            iconPath: '/images/use.png',
            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/warn.png',
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 22,
              height: 45
            },
            clickable: false
          },
          {
            id: 5,
            iconPath: '/images/avatar.png',
            position: {
              left: res.windowWidth - 68,
              top: res.windowHeight - 155,
              width: 45,
              height: 45
            },
            clickable: true
          }]
        })
      }
    });
    // 4.请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        this.setData({
          markers: this.data.markers
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("juwaiMap"); // 地图组件的id
    this.movetoPosition()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: 
        this.movetoPosition();
        break;
      case 2:
        // 扫码事件
        wx.scanCode({
          success: (res) => {
            // 正在获取密码通知
            console.log('success');
          }
        });
        break;
      // 点击保障控件，跳转到报障页
      case 3: 
        wx.navigateTo({
          url: '../warn/index'
        });
        break;
      // 点击头像控件，跳转到个人中心
      case 5: 
        wx.navigateTo({
          url: '../account/index'
        });
        break;
      default: break;
    }
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    // let _markers = this.data.markers; // 拿到标记数组
    let markerId = e.markerId; // 获取点击的标记id
    wx.navigateTo({
      url: '../detail/detail?id=' + markerId,
    })
  },
  // 拖动地图事件
  bindregionchange: function (e) {
    // 拖动地图，获取附件单车位置
    if (e.type == "begin") {
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {},
        method: 'GET',
        success: (res) => {
          this.setData({
            _markers: this.data.markers
          })
        }
      })
      // 停止拖动，显示单车位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
})