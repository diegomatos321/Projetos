import 'package:app_with_game/Pages/HomePage/home_page.dart';
import 'package:app_with_game/Pages/JogosPage/jogos_page.dart';
import 'package:app_with_game/Pages/MemePage/meme_page.dart';
import 'package:flutter/material.dart';
import 'package:app_with_game/Pages/LoginPage/login_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: LoginPage(),
      routes: {
        LoginPage.routeName: (context) => LoginPage(),
        HomePage.routeName: (context) => HomePage(),
        MemePage.routeName: (context) => MemePage(),
        JogosPage.routeName: (context) => JogosPage(),
      },
    );
  }
}
