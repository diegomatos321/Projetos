import 'package:flutter/material.dart';
import 'package:planner_app/Components/TaskWidget.dart';
import 'package:planner_app/Models/Task.dart';
import 'package:planner_app/Provider/TaskProvider.dart';
import 'package:provider/provider.dart';

class TaskListView extends StatelessWidget {
  const TaskListView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<TaskProvider>(
      builder: (BuildContext context, TaskProvider taskProvider, child) {
        final List<Task> filteredList = taskProvider.taskLists.where((Task currentTask) {
          return currentTask.isDone == false;
        }).toList();

        if (filteredList.isEmpty) {
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
              final Task task = filteredList[index];

              return TaskWidget(task: task);
            },
            itemCount: filteredList.length
        );
      },
    );
  }
}
