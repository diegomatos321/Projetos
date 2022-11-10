import 'package:flutter/material.dart';
import 'package:planner_app/Components/NewTaskDialog.dart';

class AddTaskButton extends StatelessWidget {
  const AddTaskButton({Key? key}) : super(key: key);

  void _handleOnPressed(BuildContext context) async {
    var hasNewTask = await showDialog(
        context: context,
        builder: (BuildContext context) {
          return const NewTaskDialog();
        });

    print(hasNewTask);
  }

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      onPressed: () => _handleOnPressed(context),
      child: const Icon(Icons.add),
    );
  }
}
