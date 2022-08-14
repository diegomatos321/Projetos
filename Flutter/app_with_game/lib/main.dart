import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    home: HomePage(),
    theme: ThemeData(
      primarySwatch: Colors.deepPurple
    )
  ));
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Hello World'),
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Container(
              padding: EdgeInsets.all(8),
              color: Colors.red,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    child: Text('Conheça mais sobre pokemons'),
                  ),
                  Container(
                    child: Text('Eles são muito legais')
                  )
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.all(8),
              color: Colors.yellow,
              child: Row(
                children: <Widget>[
                  Container(
                    child: Text('Conheça mais sobre pokemons'),
                  ),
                  Container(
                    child: Text('Eles são muito legais')
                  )
                ],
              ),
            )
          ],
        )
      );
  }
}