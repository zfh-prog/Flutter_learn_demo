import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'home_controller.dart';

class HomePage extends GetView<HomeController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('首页'),
      ),
      body: ListView(
        children: [
          Text(
            'hello'.tr,
            style: TextStyle(fontSize: 20),
          ),
          RadioListTile(
            value: '中文',
            groupValue: controller.lgroupValue.toString(),
            title: Text('中文'),
            onChanged: (type) {
              var locale = Locale('zh', 'CN');
              Get.updateLocale(locale);
              controller.changeValue('中文');
            },
          ),
          RadioListTile(
            value: '英文',
            groupValue: controller.lgroupValue.toString(),
            title: Text('英文'),
            onChanged: (type) {
              var locale = Locale('en', 'US');
              Get.updateLocale(locale);
              controller.changeValue('英文');
            },
          )
        ],
      ),
    );
  }
}
