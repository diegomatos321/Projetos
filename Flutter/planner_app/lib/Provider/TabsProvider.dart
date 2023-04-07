import 'package:flutter/cupertino.dart';

class TabsProvider extends ChangeNotifier {
  int _currentTab = 0;

  int get currentTab => _currentTab;

  set currentTab(int newValue) {
    _currentTab = newValue;
    notifyListeners();
  }
}