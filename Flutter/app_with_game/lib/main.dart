import 'package:flutter/material.dart';
import 'Pages/HomePage/HomePage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomePage(), theme: ThemeData(primarySwatch: Colors.deepPurple));
  }
}