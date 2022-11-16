import 'package:flutter/material.dart';
import 'package:planner_app/Models/Task.dart';
import 'package:planner_app/Provider/TabsProvider.dart';
import 'package:provider/provider.dart';

import 'Components/TaskListView.dart';
import 'Partials/AddTaskButton.dart';
import 'Partials/AppBottomNavigation.dart';
import 'Components/ProgressHeader.dart';

class HomePage extends StatelessWidget {
  final List<Widget> tabs = [
    Column(
      children: const [
        ProgressHeader(),
        Expanded(child: TaskListView(filterTag: false,))
      ],
    ),
    const TaskListView(filterTag: true,)
  ];

  HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Space Exploration Planner'),
      ),
      bottomNavigationBar: const AppBottomNavigation(),
      floatingActionButton: const AddTaskButton(),
      body: Consumer<TabsProvider>(
        builder: (context, TabsProvider tabsProvider, _) => tabs[tabsProvider.currentTab],
      )
    );
  }
}
