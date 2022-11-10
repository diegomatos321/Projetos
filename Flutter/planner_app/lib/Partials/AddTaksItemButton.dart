import 'package:flutter/material.dart';
import 'package:planner_app/Components/NewTaskItemDialog.dart';

class AddTaskItemButton extends StatelessWidget {
  const AddTaskItemButton({Key? key}) : super(key: key);

  void _handleOnPressed(BuildContext context) async {
    var hasNewTask = await showDialog(
        context: context,
        builder: (BuildContext context) {
          return const NewTaskItemDialog();
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
