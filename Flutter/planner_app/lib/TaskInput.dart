import 'package:flutter/material.dart';

import 'TaskItem.dart';

class TaskInput extends StatefulWidget {
  final List<TaskItem> taskList;

  const TaskInput({Key? key, required this.taskList}) : super(key: key);

  @override
  State<TaskInput> createState() => _TaskInputState();
}

class _TaskInputState extends State<TaskInput> {
  late final TextEditingController _newTaskItemInput;

  @override
  void initState() {
    _newTaskItemInput = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _newTaskItemInput.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: _newTaskItemInput,
          decoration: const InputDecoration(
            hintText: 'Digite uma nova tarefa',
          ),
        ),
        TextButton(
            onPressed: () {
              final String newValue = _newTaskItemInput.text.trim();

              if (newValue.isEmpty) {
                return;
              }

              print("Novo Item: " + newValue);
              setState(() {
                final newTaskItem = TaskItem(label: newValue);
                widget.taskList.add(newTaskItem);
              });
            },
            child: Text('Adicionar')
        )
      ],
    );
  }
}
