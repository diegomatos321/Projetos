import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:planner_app/Models/Task.dart';

class TaskWidget extends StatelessWidget {
  final Task task;

  const TaskWidget({Key? key, required this.task}) : super(key: key);

  @override
  Widget build(BuildContext context) => Slidable(
      startActionPane: ActionPane(
        motion: const DrawerMotion(),
        children: [
          SlidableAction(
            onPressed: (BuildContext context) {},
            backgroundColor: Colors.green,
            icon: Icons.edit,
            label: 'Editar',
          )
        ],
      ),
      endActionPane: ActionPane(
        motion: const DrawerMotion(),
        children: [
          SlidableAction(
            onPressed: (BuildContext context) {},
            backgroundColor: Colors.red,
            icon: Icons.delete,
            label: 'Excluir',
          )
        ],
      ),
      child: buildRow(context));

  Widget buildRow(BuildContext context) {
    int maxLength = 100;
    String description = task.descricao;

    if (description.length > maxLength) {
      description = description.substring(0, maxLength);
      description = '$description...';
    }

    return ListTile(
        contentPadding: const EdgeInsets.all(16.0),
        onTap: () {},
        title: Text(task.nome),
        tileColor: Colors.white,
        leading: Checkbox(
          onChanged: null,
          value: task.isDone,
        ),
        subtitle: Text(description),
    );
  }
}
