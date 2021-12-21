import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
    home: const HelloWorld(),
    theme: ThemeData(
      primarySwatch: Colors.lightBlue
    )
  ));
}

class HelloWorld extends StatelessWidget {
  const HelloWorld({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Minha primeira Aplicação em Flutter")
      ),
      body: Container(
        child: const Text("Hello World"),
      ),
    );
  }
}