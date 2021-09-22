import Config from './config';
import Crypto from '../utils/cryptojs/cryptojs';
import Request from './request';
import cloudApi from "./cloudapi";
const app = getApp()

var webapi = require('./webapi');

var AESKey = Config.AESKey;

export function maskInfo(info, maskChar, frontLen, endLen) {
  const len = info.length - frontLen - endLen;
  var xing = '';
  for (let i = 0; i < len; i++) {
    xing += maskChar;
  }
  return info.substring(0, frontLen) + xing + info.substring(info.length - endLen);
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
export const getDateDiff = longtiem => {
  var publishTime = (longtiem - 621355968000000000) / 10000,
    d_seconds,
    d_minutes,
    d_hours,
    d_days,
    timeNow = parseInt(new Date().getTime()),
    d,
    date = new Date(publishTime),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds()
  if (M < 10) {
    M = '0' + M
  }
  if (D < 10) {
    D = '0' + D
  }
  if (H < 10) {
    H = '0' + H
  }
  if (m < 10) {
    m = '0' + m
  }
  if (s < 10) {
    s = '0' + s
  }

  d = (timeNow - publishTime) / 1000
  d_days = parseInt(d / 86400)
  d_hours = parseInt(d / 3600)
  d_minutes = parseInt(d / 60)
  d_seconds = parseInt(d)

  if (d_days > 0 && d_days <= 7) {
    return d_days + '天前'
  } else if (d_days <= 0 && d_hours > 0) {
    return d_hours + '小时前'
  } else if (d_hours <= 0 && d_minutes > 0) {
    return d_minutes + '分钟前'
  } else if (d_seconds < 60) {
    if (d_seconds <= 0) {
      return '刚刚'
    } else {
      return d_seconds + '秒前'
    }
  } else if (d_days >= 3 && d_days < 30) {
    return M + '-' + D + ' ' + H + ':' + m
  } else if (d_days >= 30) {
    return Y + '-' + M + '-' + D + ' ' + H + ':' + m
  }
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function setLocalStorage(key, value) {
  wx.setStorageSync(key, JSON.stringify(value));
  console.log("setLocalStorage->", key, value);
}

export function removeLocalStorage(key) {
  wx.removeStorageSync(key);
  console.log("removeLocalStorage->", key);
}

export function getLocalStorage(key) {
  const resultStr = wx.getStorageSync(key);
  if (resultStr) {
    return JSON.parse(resultStr);
  } else {
    return null;
  }
}

export function Encrypt(word) {
  var mode = new Crypto.mode.ECB(Crypto.pad.pkcs7);
  var eb = Crypto.charenc.UTF8.stringToBytes(word);
  var kb = Crypto.util.base64ToBytes(AESKey);//KEY
  //var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var ub = Crypto.AES.encrypt(eb, kb, { mode: mode, asBpytes: true });
  return ub;
}

export function Decrypt(word, Key) {
  var mode = new Crypto.mode.ECB(Crypto.pad.pkcs7);
  var eb = Crypto.charenc.UTF8.stringToBytes(word);
  var kb = Crypto.util.base64ToBytes(Key);//KEY
  //var vb = Crypto.charenc.UTF8.stringToBytes("8765432187654321");//IV
  var ub = Crypto.AES.decrypt(eb, kb, { asBpytes: true, mode: mode });
  return ub;
}

/** 服务器时间戳到本地当前时间 */
export function serverTimeStampToLocal(ticks) {
  return (ticks - 621355968000000000) / 10000;
}

/** 服务器时间戳到本地当前时间的长度 */
export function serverTimeStampToLocalNow(ticks) {
  return serverTimeStampToLocal(ticks) - Date.now();
}

export function localTimeStampToDays(ticks) {
  const ONE_DAY_TICKS = 1000 * 60 * 60 * 24;
  const ONE_HOUR_TICKS = 1000 * 60 * 60;
  const ONE_MINITE_TICKS = 1000 * 60;
  if (ticks >= ONE_DAY_TICKS) {
    return Math.floor(ticks / ONE_DAY_TICKS) + "天"
  } else if (ticks >= ONE_HOUR_TICKS) {
    return Math.floor(ticks / ONE_HOUR_TICKS) + "小时"
  } else if (ticks >= ONE_MINITE_TICKS) {
    return Math.floor(ticks / ONE_MINITE_TICKS) + "分钟"
  } else if (ticks > 0) {
    return Math.floor(ticks / 1000) + "秒"
  } else {
    return 0;
  }

}


export function localDateTimeFormat(timestamp, format, isFormatNumber) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(timestamp);
  returnArr.push(date.getFullYear());
  if (isFormatNumber) {
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));
    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));
  } else {
    returnArr.push(date.getMonth() + 1);
    returnArr.push(date.getDate());
    returnArr.push(date.getHours());
    returnArr.push(date.getMinutes());
    returnArr.push(date.getSeconds());
  }

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

export function timeStampToDateTime(ticks, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date((ticks - 621355968000000000) / 10000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

export function getImageUrlAuto(imageUrl, width, height) {
  if (imageUrl) {
    const realWidth = parseInt(width * pxRatio)
    const realHeight = parseInt(height * pxRatio)
    const imageMogrUrl = imageUrl + `?imageMogr2/format/jpg/thumbnail/${realWidth}x${realHeight}`;
    return imageMogrUrl;
  } else {
    return "";
  }

}

export function getImageUrlFixedWith(imageUrl, width, format = 'jpg') {
  if (imageUrl) {
    const realPix = parseInt(width * pxRatio)
    const imageMogrUrl = imageUrl + `?imageMogr2/format/${format}/thumbnail/${realPix}x`;
    return imageMogrUrl;
  } else {
    return "";
  }
}

export function getImageUrlFixedHeight(imageUrl, height) {
  if (imageUrl) {
    const realPix = parseInt(height * pxRatio)
    const imageMogrUrl = imageUrl + `?imageMogr2/format/jpg/thumbnail/x${realPix}`;
    return imageMogrUrl;
  } else {
    return "";
  }
}

//提取描述字段中的图片路径
export function getImageSrcListFromDesc(desc) {
  var regEsp = /src=\"([^\"]*?)\"/gi
  let list = [];
  if (typeof (desc) == 'string') {
    var result = desc.match(regEsp);
    if (result) {
      result.map((info, index) => {
        info.match(regEsp);
        list.push(RegExp.$1)
      });
    }
  }
  return list;
};


export function toDecimal(value, num = 2) {
  value = parseFloat(value);
  return isNaN(value) ? '0.00' : value.toFixed(num);
}

export function isProductInActiveTime(info) {
  let inActiveTime = false;
  if (info) {
    if (info.hasOwnProperty('SpecialPriceStart') && info.hasOwnProperty('SpecialPriceEnd')) {
      const now = Date.now() * 10000 + 621355968000000000;
      if (
        (now > info.SpecialPriceStart) &&
        (now < info.SpecialPriceEnd)
      ) {
        inActiveTime = true;
      }
    }
  }
  return inActiveTime;
}

/**
 * 从商品中获取当前的显示价格
 * @param info
 */
export function getCurrentPrice(info) {
  let currentPrice = 0;
  if (info) {
    //当前商品是否配置了特价，并在特价销售时间段内
    if (isProductInActiveTime(info)) {
      currentPrice = info.SpecialPrice;
    } else {
      //对于没有活动期的商品信息，优先使用SpecialPrice（如果 SpecialPrice>0 ）
      if (
        info.hasOwnProperty("SpecialPrice")
        && (!info.hasOwnProperty('SpecialPriceStart'))
        && (!info.hasOwnProperty('SpecialPriceEnd'))
        && info.SpecialPrice > 0
      ) {
        currentPrice = info.SpecialPrice;
      } else if (info.hasOwnProperty("Price")) {
        currentPrice = info.Price;
      } else if (info.hasOwnProperty("RegularPrice")) {
        currentPrice = info.RegularPrice;
      }
    }
  }
  return currentPrice;
}

export function getOldPrice(info) {
  let oldPrice = 0;
  if (info) {
    if (info.hasOwnProperty("ProductPrice")) {
      oldPrice = info.ProductPrice;
    }
  }
  return oldPrice;
}

export function scanProductQRCode() {
  wx.scanCode({
    success: (res) => {
      const productCode = res.result;
      wx.navigateTo({ url: `../product/detail?ProductCode=${productCode}` });
    },
  });
}

export function contain(arr, key) {
  let hasResult = false;
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == key) {
        hasResult = true;
        break;
      }
    }
  }
  return hasResult;
}

export function showToast(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000,
  });
}

export function saveImgToPhotosAlbum(imageUrl) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: imageUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log('saveImgToPhotosAlbum--resolve', res);
            resolve(res);
          },
          fail: function (res) {
            console.log('saveImgToPhotosAlbum--fail', res);
            if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("打开设置窗口");
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    console.log("获取权限成功，再次点击图片保存到相册")
                  } else {
                    console.log("获取权限失败")
                  }
                }
              })
            }
            reject(res);
          }
        })
      },
      fail: function (res) {
        console.log('saveImgToPhotosAlbum--fail', res);
        reject(res);
      }
    })
  });
}
export function saveBase64ImgToPhotosAlbum(imageData) {
  return new Promise((resolve, reject) => {
    const fileManager = wx.getFileSystemManager();
    fileManager.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/temp.png',
      data: imageData,
      encoding: 'base64',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/temp.png',
          success: function (res) {
            console.log('saveImgToPhotosAlbum--resolve', res);
            resolve(res);
          },
          fail: function (res) {
            console.log('saveImgToPhotosAlbum--fail', res);
            reject(res);
          }
        })
      },
      fail: function (res) {
        console.log('saveImgToPhotosAlbum--fail', res);
        reject(res);
      }
    })
  });
}
export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

function setClipboard(data, msg) {
  wx.setClipboardData({
    data: data,
    success: function (res) {
      if (msg != null && msg != "") {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
}

/************************************************
 * 签到相关的API                                 *
 ************************************************/

//最大展示签到卡数量
const MAX_SIGN_ON_DAYS = 7;
const ONE_DAY = 1000 * 60 * 60 * 24;

function getTaskFormatDate(offsetDays = 0) {
  // console.log("getTaskFormatDate-->", offsetDays);
  const curDayMs = Date.now() + offsetDays * ONE_DAY;
  const curDate = new Date(curDayMs);
  const curMonth = curDate.getMonth() + 1;
  const curDay = curDate.getDate();
  const curMonthFormat = curMonth < 10 ? "0" + curMonth : curMonth;
  const curDayFormat = curDay < 10 ? "0" + curDay : curDay;
  return `${curMonthFormat}.${curDayFormat}`;
}

function getTaskDayNumber(index, signOnDays) {
  let dayInfo = {
    dayNumber: 0,
    formatDate: '',
    offsetDay: 0,
  };

  if (signOnDays <= 4) {
    dayInfo.dayNumber = index + 1;
    dayInfo.offsetDay = index - signOnDays + 1
    dayInfo.formatDate = getTaskFormatDate(dayInfo.offsetDay);
  } else {
    dayInfo.dayNumber = index + signOnDays - 3;
    dayInfo.offsetDay = index - 3;
    dayInfo.formatDate = getTaskFormatDate(dayInfo.offsetDay);
  }
  console.log("getTaskDayNumber-->", index, signOnDays, dayInfo);
  return dayInfo;
}

function getDailyTaskStatus(dayNumber, signOnDays) {
  let status = '待领取';
  if (dayNumber <= signOnDays) {
    status = '已领取';
  }
  return status;
}

function genPointTask(curDayNumber, dayInfo, signOnDays, taskStatus) {
  let taskType = "point";
  let task = {
    id: curDayNumber,
    day: curDayNumber,
    dayTitle: `第${curDayNumber}天`,
    dayInfo: dayInfo,
    status: taskStatus,
    type: taskType,
    point: Math.min(curDayNumber, 7),
  };
  return task;
}

function genBagTask(curDayNumber, dayInfo, signOnDays, taskStatus) {
  let taskType = "bag";
  let task = {
    id: curDayNumber,
    day: curDayNumber,
    dayTitle: `第${curDayNumber}天`,
    dayInfo: dayInfo,
    status: taskStatus,
    type: taskType,
    bagTip: 999,
    point: Math.min(curDayNumber, 7),
  };
  return task;
}

function getDailyTaskType(curDayNumber) {
  return curDayNumber % 7 == 0 ? "bag" : "point";
}

function genTask(index, signOnDays) {
  let dayInfo = getTaskDayNumber(index, signOnDays);
  let curDayNumber = dayInfo.dayNumber;

  let taskStatus = getDailyTaskStatus(curDayNumber, signOnDays);

  let taskType = getDailyTaskType(curDayNumber);

  let task = null;
  switch (taskType) {
    case 'point':
      task = genPointTask(curDayNumber, dayInfo, signOnDays, taskStatus);
      break;
    case 'bag':
      task = genBagTask(curDayNumber, dayInfo, signOnDays, taskStatus);
      break;
  }
  return task;
}

function genDailyTaskList(signOnDays) {
  //todo...for test
  // signOnDays = 7;

  let dailyTaskList = [];
  //根据连续签到的天数
  for (let i = 0; i < MAX_SIGN_ON_DAYS; i++) {
    dailyTaskList.push(genTask(i, signOnDays));
  }

  console.log("dailyTaskList-->", dailyTaskList);
  return dailyTaskList;
}


function getTodayTask(apiLoginInfo) {
  let curDayNumber = getTodaySignOnDays(apiLoginInfo);
  let taskStatus = getDailyTaskStatus(curDayNumber, curDayNumber);
  let taskType = getDailyTaskType(curDayNumber);

  console.log("getTodayTask", apiLoginInfo, curDayNumber, taskStatus, taskType);

  let task = null;
  switch (taskType) {
    case 'point':
      task = genPointTask(curDayNumber, curDayNumber, taskStatus);
      break;
    case 'bag':
      task = genBagTask(curDayNumber, curDayNumber, taskStatus);
      break;
  }
  return task;
}

function getTodaySignOnDays(apiLoginInfo) {
  let signOnDaysToday = apiLoginInfo.ConsistantSignOnDays;
  //今天没有签到过，需要添加今天的签到记录
  if (!apiLoginInfo.IsSignedToday) {
    signOnDaysToday += 1;
  }
  return signOnDaysToday;
}

function getTodayTaskType(apiLoginInfo) {
  let signOnDaysToday = getTodaySignOnDays(apiLoginInfo);
  console.log("--->getTodayTaskType-->signOnDaysToday:", signOnDaysToday);
  return getDailyTaskType(signOnDaysToday);
}

function webJumpTo(url) {
  const webSiteUrl = "/pages/web/index?webSiteUrl=" + url;
  wx.navigateTo({ url: webSiteUrl });
}

function shareOrders(title, imageUrl, sharedGuid, redirectTo, storeGuid) {
  console.log(redirectTo);
  const url = '/pages/user/order?ShareGuid=' + sharedGuid + '&storeGuid=' + (storeGuid || Request.getStoreGuid());
  console.log(url);
  return {
    title: title,
    path: url,
    imageUrl: imageUrl,
    success: (res) => {
      showToast("分享成功");
      if (redirectTo) {
        console.log(redirectTo);
        wx.redirectTo({
          url: redirectTo,
        });
      }
    },
    fail: (res) => {
      showToast("分享已取消");
    }
  };
}

function getShareUrl() {
  return '/pages/home/index?REFCODE=' + Request.getApiLoginInfo().CustomerUniqueCode + '&storeGuid=' + Request.getStoreGuid() + '&storeHost=' + Request.getStoreHost();
}
function shareApp(isFirstShare) {
  // const { shareImageUrl } = this.data;
  const sharePageUrl = getShareUrl();
  console.log("shareApp--->", sharePageUrl);
  return {
    title: '快来看看这个小买卖--' + app.globalData.storeInfo.StoreName + '，这里有你想要的~',
    path: sharePageUrl,
    imageUrl: 'http://resource.xlwonder.wang/wxapp/xmmq/bg_share_xmmq.png',
    success: function (res) {
      // 分享成功
      console.log("shareQRCode Success-->", res);
      if (res.hasOwnProperty("shareTickets")) {
        //发送到群成功
        webapi.SetCustomerFirstTimeShare().then(json => {
          console.log("SetCustomerFirstTimeShare->", json);
        });
        showToast("成功分享到群");
      } else {
        if (isFirstShare) {
          showToast("分享到群才能获得奖励");
        }
        else {
          showToast("分享成功");
        }
      }
    },
    fail: function (res) {
      // 分享失败
      showToast("分享已取消");
    }
  };
}

function shareHaiTaoApp() {
  const sharePageUrl = '/pages/home/index?REFCODE=' + Request.getApiLoginInfo().CustomerUniqueCode;
  console.log("shareApp--->", sharePageUrl);
  return {
    title: '雪拼兔会员',
    path: sharePageUrl,
    imageUrl: '',
    success: function (res) {
      showToast("分享成功");
    },
    fail: function (res) {
      // 分享失败
      showToast("分享已取消");
    }
  };
}

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

function isNumber(val) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(val)) {
    return true;
  }
  return false;
}

function chooseVideo(onProgress) {
  return new Promise((resolve, reject) => {
    wx.chooseVideo({
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success: res => {
        console.log(res);
        cloudApi.webapiUploadFiles(
          res.tempFilePath, null,
          res => {
            onProgress({ percent: res.progress, show: true });
          }
        ).then(result => {
          if (result.Message) {
            reject();
          } else {
            resolve({
              url: Object.values(result.Data)[0],
              progress: { percent: 0, show: false }
            })
          }
        })
      }
    });
  });
};

function chooseImage({ count = 9, onProgress }) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count,
      sourceType: ["album", "camera"],
      success: res => {
        const { tempFilePaths } = res;
        const progress = {};
        Promise.all(
          tempFilePaths.map((fullPath, index) => {
            return cloudApi.webapiUploadFiles(fullPath, null, res => {
              progress[index] = res.progress;
              if (onProgress) {
                onProgress({
                  percent: (
                    Object.values(progress).reduce((a, b) => a + b) /
                    tempFilePaths.length
                  ).toFixed(2),
                  show: true
                })
              }
            })
          })
        ).then(result => {
          try {
            const imageList = result.map(item => Object.values(item.Data)[0])
            resolve({
              imageList,
              progress: { percent: 0, show: false }
            });
          } catch (e) {
            reject()
          }
        });
      }
    });
  })
};

const Util = {
  groupBy,
  webJumpTo,
  shareApp,
  shareOrders,
  shareHaiTaoApp,
  localDateTimeFormat,
  setClipboard,
  getTodayTaskType,
  genDailyTaskList,
  getDailyTaskStatus,
  getTodayTask,
  saveImgToPhotosAlbum,
  saveBase64ImgToPhotosAlbum,
  showToast,
  localTimeStampToDays,
  serverTimeStampToLocal,
  serverTimeStampToLocalNow,
  maskInfo,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  contain,
  scanProductQRCode,
  toDecimal,
  getOldPrice,
  getCurrentPrice,
  getImageSrcListFromDesc,
  getImageUrlFixedHeight,
  getImageUrlFixedWith,
  getImageUrlAuto,
  formatTime,
  timeStampToDateTime,
  AESEncrypt: Encrypt,
  AESDecrypt: Decrypt,
  Request,
  getShareUrl,
  uuid,
  getDateDiff,
  isNumber,
  chooseImage,
  chooseVideo,
  isCardId(value) {
    let isValidat = true;
    if (!/^\d{17}(\d|x)$/i.test(value)) {
      isValidat = false;
    } else {
      const txtIDCARD = value.replace(/x$/i, 'a');
      let iSum = 0;
      for (var i = 17; i >= 0; i--) {
        iSum += (Math.pow(2, i) % 11) * parseInt(txtIDCARD.charAt(17 - i), 11)
      }
      if (iSum % 11 != 1) {
        isValidat = false;
      }
    }
    return isValidat
  },
  arrayGroup(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
  }
};

export default Util;
module.exports = Util;
