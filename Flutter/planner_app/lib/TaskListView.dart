import 'package:flutter/material.dart';
import 'package:planner_app/Components/TaskWidget.dart';
import 'package:planner_app/Models/Task.dart';

class TaskListView extends StatelessWidget {
  final List<Task> taskList;

  const TaskListView({Key? key, required this.taskList}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<Task> listWidget = taskList.where((Task currentTask) {
      return currentTask.isDone == true;
    }).toList();

    if (listWidget.isEmpty) {
      return const Center(
        child: Text(
          'Não há tarefas',
          style: TextStyle(fontSize: 20),
        ),
      );
    }

    return ListView.separated(
        padding: const EdgeInsets.all(16.0),
        physics: const BouncingScrollPhysics(),
        separatorBuilder: (BuildContext context, int index) => Container(height: 20),
        itemBuilder: (BuildContext context, int index) {
          final Task task = listWidget[index];

          return TaskWidget(task: task);
        },
        itemCount: listWidget.length
    );
  }
}
