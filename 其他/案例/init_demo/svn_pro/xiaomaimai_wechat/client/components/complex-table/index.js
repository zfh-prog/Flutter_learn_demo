/**
 * ComponentName XXX-组件
 * Author:Colin3dmax
 * Date:2018/7/16
 */
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['root-class'],
  properties: {
      dataSource: {
          type: Object,
          value: {
              header: [],
              body: []
          }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      copyTBL: function (e) {
        var copyText = e.currentTarget.dataset.text;
        wx.setClipboardData({
          data: copyText,
          success: function (res) {
              wx.showToast({
                title: '店铺已复制',
              })
          }
        })
      }
  }
})
