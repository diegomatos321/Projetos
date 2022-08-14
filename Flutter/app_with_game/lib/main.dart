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
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: (() => {}),
          child: Icon(Icons.wysiwyg),
        ),
        drawer: Drawer(
          child: ListView(
            padding: const EdgeInsets.all(0),
            children: const <Widget>[
              DrawerHeader(
                child: Text('Pokemon'),
                decoration: BoxDecoration(color: Colors.yellow),
              ),
              ListTile(
                leading: Icon(Icons.catching_pokemon),
                title: Text('O Pokemon'),
              ),
              ListTile(
                leading: Icon(Icons.catching_pokemon),
                title: Text('O Pokemon'),
              )
            ],
          ),
        ),
      );
  }
}