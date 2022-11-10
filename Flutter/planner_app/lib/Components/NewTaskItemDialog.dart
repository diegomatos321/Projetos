import 'package:flutter/material.dart';

class NewTaskItemDialog extends StatefulWidget {
  const NewTaskItemDialog({Key? key}) : super(key: key);

  @override
  State<NewTaskItemDialog> createState() => _NewTaskItemDialogState();
}

class _NewTaskItemDialogState extends State<NewTaskItemDialog> {
  String _taskName = '';
  String _taskDescrition = '';
  bool _hasSaved = false;

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      title: const Text('Nova Tarefa'),
      contentPadding: const EdgeInsets.all(16.0),
      children: [
        TextFormField(
          initialValue: _taskName,
          onChanged: (String newValue) => setState(() {
            _taskName = newValue;

            if (_hasSaved == false) {
              _hasSaved = true;
            }
          }),
          validator: (String? newValue) {
            if (newValue == null || newValue.isEmpty) {
              return 'Nome da tarefa é obrigatório';
            }

            return null;
          },
          decoration: const InputDecoration(
            labelText: 'Nome da tarefa',
            contentPadding: EdgeInsets.all(16.0)
          ),
        ),
        TextFormField(
          initialValue: _taskDescrition,
          maxLines: 3,
          onChanged: (String newValue) => setState(() {
            _taskDescrition = newValue;
          }),
          validator: (String? newValue) {
            if (newValue == null || newValue.isEmpty) {
              return 'Nome da tarefa é obrigatório';
            }

            return null;
          },
          decoration: const InputDecoration(
              labelText: 'Digite uma descrição',
              contentPadding: EdgeInsets.all(16.0)),
        ),
        Row(
          children: [
            TextButton(onPressed: null, child: const Text('Salvar')),
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
