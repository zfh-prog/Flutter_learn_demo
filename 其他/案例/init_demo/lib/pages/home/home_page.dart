import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:init_demo/utils/constant.dart';
import 'dart:convert' as convert;
import 'package:get/get.dart';
import 'package:init_demo/utils/event_bus.dart';
import 'home_controller.dart';
import 'package:init_demo/component/my_btn.dart';

class HomePage extends GetView<HomeController> {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('首页'),
      ),
      body: SingleChildScrollView(
          child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'hello'.tr,
            style: const TextStyle(fontSize: 20),
          ),
          RadioListTile(
            value: '中文',
            groupValue: controller.lgroupValue.toString(),
            title: const Text('中文'),
            onChanged: (type) {
              var locale = const Locale('zh', 'CN');
              Get.updateLocale(locale);
              controller.changeValue('中文');
            },
          ),
          RadioListTile(
            value: '英文',
            groupValue: controller.lgroupValue.toString(),
            title: const Text('英文'),
            onChanged: (type) {
              var locale = const Locale('en', 'US');
              Get.updateLocale(locale);
              controller.changeValue('英文');
            },
          ),
          const Text(CONSTANT.name),
          Text(
            convert.jsonEncode(CONSTANT.info),
          ),
          Container(
            color: Colors.red,
            width: ScreenUtil().setHeight(100), // 100.w
            height: ScreenUtil().setHeight(70), // 70.h
            child: Text(
              '文字',
              style: TextStyle(
                fontSize: ScreenUtil().setSp(25), // 25.sp
              ),
            ),
          ),
          MyBtn(
            onclick: () {
              // ignore: avoid_print
              print('黄');
            },
            width: 50,
            height: 50,
            color: Colors.yellow,
          ),
          MyBtn(
            onclick: () {
              // ignore: avoid_print
              print('粉');
            },
            width: 100,
            height: 50,
          ),
          MyBtn(
            onclick: () {
              Get.changeTheme(
                Get.isDarkMode ? ThemeData.light() : ThemeData.dark(),
              );
            },
            color: Colors.redAccent,
            width: 50,
            height: 50,
            widget: const Text('改主题'),
          ),
          MyBtn(
            onclick: () {
              eventBus.fire(
                NotificationTag('3'),
              );
            },
            color: Colors.blueAccent,
            width: 120,
            height: 120,
            widget: const Text('event_bus改变'),
          ),
        ],
      )),
    );
  }
}
