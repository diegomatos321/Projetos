import 'package:flutter/material.dart';
import 'package:planner_app/Models/Task.dart';

import 'Components/TaskListView.dart';
import 'Partials/AddTaskButton.dart';
import 'Partials/AppBottomNavigation.dart';
import 'Components/ProgressHeader.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Space Exploration Planner'),
      ),
      bottomNavigationBar: const AppBottomNavigation(),
      floatingActionButton: const AddTaskButton(),
      body: Column(
        children: [
          const ProgressHeader(),
          Expanded(child: TaskListView(taskList: _taskList))
        ],
      )
    );
  }
}
