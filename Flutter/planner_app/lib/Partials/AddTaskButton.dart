import 'package:flutter/material.dart';
import 'package:planner_app/Components/NewTaskDialog.dart';

class AddTaskButton extends StatelessWidget {
  const AddTaskButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      onPressed: () => showDialog(
          context: context,
          builder: (BuildContext context) => const NewTaskDialog()),
      child: const Icon(Icons.add),
    );
  }
}
