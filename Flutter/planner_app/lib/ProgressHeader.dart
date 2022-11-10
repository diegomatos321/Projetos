import 'package:flutter/material.dart';

import 'TaskItem.dart';

class ProgressHeader extends StatelessWidget {
  final double _progress = 1.0;

  const ProgressHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text('Você está bem longe de completar suas tarefas!')),
        LinearProgressIndicator(value: _progress),
      ],
    );
  }
}
