import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'top_barbar.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'package:flutter_swiper/flutter_swiper.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  /*
   *  获取本地化值
   */
  Future<int> get() async {
    int guide;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    guide = prefs.getInt('guide');
    return guide;
  }

    DateTime _lastPressedAt; //上次点击时间


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: WillPopScope(
        onWillPop: () async {
          if (_lastPressedAt == null ||
              DateTime.now().difference(_lastPressedAt) >
                  Duration(seconds: 1)) {
            //两次点击间隔超过1秒则重新计时
            _lastPressedAt = DateTime.now();
            print("连续双击退出App");
            return false;
          }
          return true;
        },
        child: FutureBuilder(
          future: get(),
          builder: (context, snapshot) {
            if (snapshot.data == 1) {
              return TopBar();
            } else {
              return GuidePage();
            }
          },
        ),
      ),
    );
  }

}

// 引导页面
class GuidePage extends StatefulWidget {
  @override
  _GuidePageState createState() => _GuidePageState();
}

class _GuidePageState extends State<GuidePage> {
  @override
  void initState() {
    super.initState();
    _controller = new SwiperController();
  }

  SwiperController _controller;
  @override
  Widget build(BuildContext context) {
    List swiperDateList = ['guide1.jpg', 'guide2.jpg', 'guide3.jpg'];
    var left = 0; // 用于过滤 只有1才执行后续代码
    var right = 0;
    return Scaffold(
      body: Swiper(
          itemBuilder: (BuildContext context, int index) {
            return InkWell(
              onTap: () {},
              child: index < swiperDateList.length - 1
                  ? Image.asset(
                      'images/' + '${swiperDateList[index]}',
                      fit: BoxFit.cover,
                    )
                  : Container(
                      child: GestureDetector(
                        onHorizontalDragUpdate: (e) {
                          var x = e.delta.dx;
                          if (x < -15) {
                            // 左滑
                            left += 1;
                            if (left == 1) {
                              _endGuideView(); // 结束浏览页 展示主页
                              left = 0;
                            }
                          } else if (x > 15) {
                            // 右滑
                            right += 1;
                            if (right == 1) {
                              _controller.previous(); // 上一页面
                              right = 0;
                            }
                          }
                        },
                        child: Stack(
                          alignment: const FractionalOffset(0.5, 0.8),
                          children: <Widget>[
                            Image.asset('images/guide3.jpg',
                                width: MediaQuery.of(context).size.width,
                                height: MediaQuery.of(context).size.height,
                                fit: BoxFit.cover),
                            InkWell(
                              onTap: _endGuideView,
                              child: Text(
                                '开始体验',
                                style: TextStyle(
                                    color: Colors.red, fontSize: 20.0),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
            );
          },
          itemCount: swiperDateList.length,
          pagination: SwiperPagination(),
          controller: _controller,
          autoplay: false,
          loop: false),
    );
  }

  /*
   * 结束浏览页面
   * 存标志位 跳转页面
   */
  _endGuideView() async {
    // 存标志
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setInt('guide', 1);
    // 跳转页面
    Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => MyApp()),
        (route) => route == null);
  }
}
