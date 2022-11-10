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
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20.0),
      child: Row(
        children: [
          Checkbox(value: task.isDone, onChanged: (bool? newValue) {}),
          const SizedBox(
            width: 20,
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  task.nome,
                  style:
                      const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                ),
                if (task.descricao.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    child: Text(
                      task.descricao,
                      style: const TextStyle(fontSize: 20, height: 1.5),
                    ),
                  )
              ],
            ),
          )
        ],
      ),
    );
  }
}
