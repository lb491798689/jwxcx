var app = getApp();
var amapFile = require('../../utils/amap-wx.js');
Page({
  data: {
    latitude: null,
    longitude: null,
    markers: [],
    distance: '',
    polyline: []
  },
  onLoad: function (options) {
    var that = this;
    that.routing(options);
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.routing(options);
      },
      fail: function () {
        console.log("定位失败")
        wx.showModal({
          title: '无法使用该功能',
          content: '请点击右上角在“关于居外”设置中给予定位权限',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
            return;
          }
        })
      }
    })
  },
  routing: function (options) {
    var that = this;
    let distance = Math.abs(that.data.longitude - options.longitude) + Math.abs(that.data.latitude - options.latitude);
    var myAmapFun = new amapFile.AMapWX({ key: require('../../utils/config.js').Config.mapKey });
    let routeData = {
      origin: options.longitude + ',' + options.latitude,
      destination: that.data.longitude + ',' + that.data.latitude,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          markers: [{
            "width": "25",
            "height": "35",
            iconPath: "/images/mapicon_end.png",
            latitude: options.latitude,
            longitude: options.longitude
          }, {
            "width": "25",
            "height": "35",
            iconPath: "/images/mapicon_start.png",
            latitude: that.data.latitude,
            longitude: that.data.longitude
          }],
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
      },
      fail: function (info) {
      }
    }
    if (distance < 0.85) {
      // getWalkingRoute 步行
      myAmapFun.getWalkingRoute(routeData)
    } else {
      // getDrivingRoute 驾车
      myAmapFun.getDrivingRoute(routeData)
    }
  }
})