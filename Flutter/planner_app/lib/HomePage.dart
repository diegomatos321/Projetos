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
  final List<Task> _taskList = [
    Task(
        nome: 'Lorem ipsum dolor sit amet',
        createdTime: DateTime.now(),
        descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
        isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      createdTime: DateTime.now(),
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      createdTime: DateTime.now(),
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: false,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      createdTime: DateTime.now(),
      isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      createdTime: DateTime.now(),
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: false,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      createdTime: DateTime.now(),
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: true,
    ),
  ];

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
