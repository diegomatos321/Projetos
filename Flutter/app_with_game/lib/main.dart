import 'package:flutter/material.dart';
import 'Pages/HomePage/HomePage.dart';
import 'package:app_with_game/Pages/LoginPage/LoginPage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: LoginPage(), 
        theme: ThemeData(primarySwatch: Colors.deepPurple),
        routes: {
          HomePage.routeName : (context) => HomePage(),
          LoginPage.routeName : (context) => LoginPage(),
        },
      );
  }
}