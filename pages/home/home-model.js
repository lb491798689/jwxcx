/**
 * Created by jimmy on 17/3/24.
 */
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js';

class Home extends Base {
  constructor() {
    super();
  }
  //从服务端api获取标记点数据方法
  GetMarkers(params, callback) {
    var param = {
      url: '/getmarkers',
      data: params,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export { Home }
