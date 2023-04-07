import 'package:flutter/material.dart';
import 'package:planner_app/Provider/TaskProvider.dart';
import 'package:provider/provider.dart';

import '../Models/Task.dart';

class NewTaskDialog extends StatefulWidget {
  const NewTaskDialog({Key? key}) : super(key: key);

  @override
  State<NewTaskDialog> createState() => _NewTaskDialogState();
}

class _NewTaskDialogState extends State<NewTaskDialog> {
  final _formKey = GlobalKey<FormState>();
  String _taskName = '';
  String _taskDescrition = '';
  bool _hasSaved = false;

  void handleFormSubmit(BuildContext context) {
    final isValid = _formKey.currentState?.validate();
    if (isValid == null || !isValid) {
      return;
    }

    final newTask = Task(nome: _taskName, descricao: _taskDescrition);
    final provider = Provider.of<TaskProvider>(context, listen: false);
    provider.add(newTask);

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      title: const Text('Nova Tarefa'),
      contentPadding: const EdgeInsets.all(16.0),
      children: [
        Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  initialValue: _taskName,
                  onChanged: (String newValue) => setState(() {
                    _taskName = newValue;
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
                  initialValue: _taskDescrition,
                  maxLines: 3,
                  onChanged: (String newValue) => setState(() {
                    _taskDescrition = newValue;
                  }),
                  decoration: const InputDecoration(
                      labelText: 'Digite uma descrição',
                      contentPadding: EdgeInsets.all(16.0)),
                ),
              ],
            )),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            TextButton(
                onPressed: () => handleFormSubmit(context),
                child: const Text('Salvar')),
            TextButton(
                onPressed: () {
                  Navigator.of(context).pop(_hasSaved);
                },
                child: const Text('Cancelar'))
          ],
        )
      ],
    );
  }
}
