import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Random English Words',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Random English Words'),
        ),
        body: const Center(
          child: Text('Olá Mundo!'),
        ),
      ),
    );
  }
}
