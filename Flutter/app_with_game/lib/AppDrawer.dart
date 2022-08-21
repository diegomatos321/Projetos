import 'package:flutter/material.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: ListView(
          padding: const EdgeInsets.all(0),
          children: const <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(color: Colors.yellow),
              child: Text('Pokemon'),
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
      );
  }
}