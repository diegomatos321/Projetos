import 'dart:collection';

import 'package:flutter/cupertino.dart';
import 'package:planner_app/Models/Task.dart';

class TaskProvider extends ChangeNotifier {
  final List<Task> _taskList = [
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: false,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      isDone: true,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: false,
    ),
    Task(
      nome: 'Lorem ipsum dolor sit amet',
      descricao: 'Curabitur velit lectus, tristique eget nisi vitae, cursus volutpat nibh. Nulla facilisi. Mauris ut euismod metus. Quisque gravida feugiat magna. Proin euismod eget diam eget finibus.',
      isDone: true,
    ),
  ];

  UnmodifiableListView<Task> get taskLists => UnmodifiableListView(_taskList);

  void add(Task newTask) {
    _taskList.add(newTask);
    notifyListeners();
  }

  void edit(Task taskToEdit, String newName, String newDescription) {
    taskToEdit.nome = newName;
    taskToEdit.descricao = newDescription;

    notifyListeners();
  }

  void remove(Task task) {
    _taskList.remove(task);
    notifyListeners();
  }

  bool toggleTask(Task task) {
    task.isDone = !task.isDone;
    notifyListeners();

    return task.isDone;
  }
}