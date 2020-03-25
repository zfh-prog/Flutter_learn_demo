import 'package:fish_redux/fish_redux.dart';
import '../model.dart';

class TwoState implements Cloneable<TwoState> {
  List<TwoGuidModel> models; // 存放数据

  @override
  TwoState clone() {
    return TwoState()..models = models;
  }
}

TwoState initState(Map<String, dynamic> args) {
  return TwoState();
}
