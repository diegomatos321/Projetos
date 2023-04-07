import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:planner_app/Models/Task.dart';
import 'package:planner_app/Provider/TaskProvider.dart';
import 'package:provider/provider.dart';

class EditTask extends StatefulWidget {
  final Task task;
  const EditTask({Key? key, required this.task}) : super(key: key);

  @override
  State<EditTask> createState() => _EditTaskState();
}

class _EditTaskState extends State<EditTask> {
  late String _name;
  late String _description;
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    _name = widget.task.nome;
    _description = widget.task.descricao;
    super.initState();
  }

  void handleSubmit(BuildContext context) {
    final bool? validated = _formKey.currentState?.validate();

    if (validated != null && validated) {
      final TaskProvider taskProvider =
          Provider.of<TaskProvider>(context, listen: false);
      taskProvider.edit(widget.task, _name, _description);

      Navigator.of(context).pop();
    }
  }

  void handleDeleteTask(BuildContext context) {
    final TaskProvider taskProvider =
        Provider.of<TaskProvider>(context, listen: false);
    taskProvider.remove(widget.task);

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Editar Tarefa'),
        actions: [
          IconButton(
              onPressed: () => handleDeleteTask(context),
              icon: const Icon(Icons.delete))
        ],
      ),
      body: Column(children: [
        Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  initialValue: _name,
                  onChanged: (String newValue) => setState(() {
                    _name = newValue;
                  }),
                  validator: (String? newValue) {
                    if (newValue == null || newValue.isEmpty) {
                      return 'Nome da tarefa é obrigatório';
                    }

                    return null;
                  },
                  decoration: const InputDecoration(
                      labelText: 'Nome da tarefa',
                      contentPadding: EdgeInsets.all(16.0)),
                ),
                TextFormField(
                  initialValue: _description,
                  maxLines: 3,
                  onChanged: (String newValue) => setState(() {
                    _description = newValue;
                  }),
                  decoration: const InputDecoration(
                      labelText: 'Digite uma descrição',
                      contentPadding: EdgeInsets.all(16.0)),
                ),
              ],
            )),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton(
                onPressed: () => handleSubmit(context),
                child: const Text('Salvar')),
          ],
        )
      ]),
    );
  }
}
