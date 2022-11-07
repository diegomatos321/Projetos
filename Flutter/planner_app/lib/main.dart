import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Exploration!',
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Space Exploration Planner'),
      ),
      body: Column(
        children: const <Widget>[
          ProgressHeader(),
          TaskList(),
        ],
      ),
    );
  }
}

class ProgressHeader extends StatelessWidget {
  const ProgressHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const <Widget>[
        Text('Você está bem longe de completar suas tarefas!'),
        LinearProgressIndicator(value: 0.0,),
      ],
    );
  }
}

class TaskList extends StatelessWidget {
  const TaskList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        TaskItem(label: 'Carregar combustível'),
        TaskItem(label: 'Carregar combustível'),
        TaskItem(label: 'Carregar combustível'),
        TaskItem(label: 'Carregar combustível'),
        TaskItem(label: 'Carregar combustível'),
      ],
    );
  }
}

class TaskItem extends StatefulWidget {
  final String label;

  const TaskItem({Key? key, required this.label}) : super(key: key);

  @override
  State<TaskItem> createState() => _TaskItemState();
}

class _TaskItemState extends State<TaskItem> {
  bool? _value = false;

  @override
  Widget build(BuildContext context) {
    return Row(
        children: [
          Checkbox(value: _value, onChanged: (newValue) => setState(() => _value = newValue)),
          Text(widget.label)
        ],
    );
  }
}



