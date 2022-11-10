import 'package:flutter/material.dart';
import 'package:planner_app/Models/Task.dart';

import 'Partials/AddTaskButton.dart';
import 'Partials/AppBottomNavigation.dart';
import 'ProgressHeader.dart';
import 'TaskListView.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<Task> _taskList = [
    Task(
        nome: 'Trabalhar no aplicativo',
        createdTime: DateTime.now(),
        descricao: 'Projetar apps elementares para me familiarizar com Flutter',
        isDone: true,
    ),
    Task(
        nome: 'Finalizar trabalho de BD',
        createdTime: DateTime.now(),
        descricao: 'Trabalho deve ser entregue hoje aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        isDone: true
    ),
    Task(
        nome: 'Finalizar trabalho de BD',
        createdTime: DateTime.now(),
        descricao: 'Trabalho deve ser entregue hoje aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        isDone: true
    ),Task(
        nome: 'Finalizar trabalho de BD',
        createdTime: DateTime.now(),
        descricao: 'Trabalho deve ser entregue hoje aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        isDone: true
    ),Task(
        nome: 'Finalizar trabalho de BD',
        createdTime: DateTime.now(),
        descricao: 'Trabalho deve ser entregue hoje aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        isDone: true
    ),Task(
        nome: 'Finalizar trabalho de BD',
        createdTime: DateTime.now(),
        descricao: 'Trabalho deve ser entregue hoje aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        isDone: true
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
      body: TaskListView(taskList: _taskList)
    );
  }
}
