// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头

import { Config } from 'config.js';

class Token {
  constructor() {
    this.verifyUrl = Config.restUrl + '/token/verify';
    this.tokenUrl = Config.restUrl + '/token/gettoken';
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    }
    else {
      this._veirfyFromServer(token);
    }
  }
  //携带令牌去服务器校验令牌
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var valid = res.data.data;
        if (!valid) {
          that.getTokenFromServer();
        }
      }
    })
  }
  //从服务器获取token
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.data);
            callBack && callBack(res.data.data);
          }
        })
      }
    })
  }
}

export { Token };