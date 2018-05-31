// pages/location/index.js
import { Location } from 'location-model.js';
var location = new Location();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scale: 18, // 缩放级别，默认18，数值在0~18之间
    latitude: 0, // 纬度初始值
    longitude: 0, // 经度初始值
    mapheight:100,
    ifShowInfo:true,
    markers:[],
    shareInfo:'',
  },
  
  /**
   * 获取初始数据
   */
  _loadData: function () {
    var that = this;
    //获取初始标记点
    location.GetMarkers((data) => {
      that.setData({
        markers: data.data,
      });
    });
    //获取分享信息
    var params = {id:3};
    location.GetShareInfo(params,(data) => {
      that.setData({
        shareInfo: data.data,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //1、初始化数据
    that._loadData();
    //2、获取当前坐标数据
    wx.getLocation({
      type: "gcj02", // 坐标系类型
      // 获取经纬度成功回调
      success: (res) => { 
        console.log(res)
        this.setData({  
          // 为data对象里定义的经纬度默认值设置成获取到的真实经纬度，这样就可以在地图上显示我们的真实位置
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
              top: res.windowHeight - 350, // 根据设备高度设置top值，可以做到在不同设备上效果一致
              width: 50, // 控件宽度/px
              height: 50 // 控件高度/px
            },
            clickable: true // 是否可点击，默认为true,可点击
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("juwaiMap"); // 地图组件的id
    this.movetoPosition();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareInfo.title,
      path: this.data.shareInfo.path,
      imageUrl: this.data.shareInfo.imgurl,
      success: function (res) {
        this.showTips('转发成功', 'success');
      },
      fail: function (res) {
        this.showTips('转发成功', 'fail');
      }
    }
  },

  /**
   * 定位函数，移动位置到地图中心
   */
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },

  /**
   * 地图控件点击事件
   */
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: 
        this.movetoPosition();
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

  /**
   * 地图标记点击事件，连接用户位置和点击的房源位置
   */
  bindmarkertap: function (e) {
    this.setData({
      ifShowInfo:true,
      mapheight:70,
    });
  },

  /**
   * 点击地图事件，用于控制显示详情弹窗的隐藏
   */
  showInfo:function(){
    this.setData({
      ifShowInfo:true,
      mapheight:65,
    });
  },

  /**
   * 拖动地图事件
   */
  bindregionchange: function (e) {
    // 拖动地图，获取附件房源位置
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
      // 停止拖动，显示房源位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  
  /**
   * 调用拨打电话接口
   */
  applyReception:function(){
    wx.makePhoneCall({
      phoneNumber: '400-041-7515' //仅为示例，并非真实的电话号码
    })
  },

  /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
  showTips: function (title, icon, duration=1000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
})