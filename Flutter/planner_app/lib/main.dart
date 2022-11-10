import 'dart:collection';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'HomePage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Exploration!',
      theme: ThemeData(
        scaffoldBackgroundColor: Color(0xFFf6f5ee),
      ),
      home: HomePage(),
    );
  }
}




