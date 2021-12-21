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
        width: 500,
        height: 500,
        color: Colors.black,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey,
                    blurRadius: 10
                  )]
              ),
              alignment: Alignment.center,
              child: const Text(
                "Hello World",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                )
              ),
            ),
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: Colors.yellow,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey,
                    blurRadius: 10
                  )]
              ),
              alignment: Alignment.center,
              child: const Text(
                "Hello World",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                )
              ),
            ),
          ],
        ),
      ),
    );
  }
}