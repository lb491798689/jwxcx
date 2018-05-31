/**
 * Created by jimmy on 17/3/24.
 */
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Location extends Base {
  constructor() {
    super();
  }

  //从服务端api获取标记点数据方法
  GetMarkers(callback) {
    var param = {
      url: '/getmarkers',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }

  //从服务端api获取地图页面自定义分享信息
  GetShareInfo(params, callback) {
    var param = {
      url: '/getshareinfo',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export { Location }
