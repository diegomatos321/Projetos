import 'package:flutter/material.dart';

import 'ProgressHeader.dart';
import 'TaskInput.dart';
import 'TaskItem.dart';
import 'TaskListView.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<TaskItem> _taskList = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Space Exploration Planner'),
      ),
      body: Column(
        children: <Widget>[
          TaskInput(taskList: _taskList),
          ProgressHeader(),
          TaskListView(taskList: _taskList),
        ],
      ),
    );
  }
}