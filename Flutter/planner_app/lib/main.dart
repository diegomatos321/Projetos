import 'dart:collection';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:planner_app/Provider/TabsProvider.dart';
import 'package:planner_app/Provider/TaskProvider.dart';
import 'package:provider/provider.dart';
import 'HomePage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent
    ));
    
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<TaskProvider>(create: (context) => TaskProvider()),
        ChangeNotifierProvider<TabsProvider>(create: (context) => TabsProvider()),
      ],
      child: MaterialApp(
        title: 'Exploration!',
        theme: ThemeData(
          scaffoldBackgroundColor: Color(0xFFf6f5ee),
        ),
        home: HomePage(),
      ),
    );
  }
}




