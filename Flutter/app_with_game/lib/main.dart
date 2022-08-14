import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
      home: HomePage(), theme: ThemeData(primarySwatch: Colors.deepPurple)));
}

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  var pokemonName = 'Tudo sobre Pokemons';
  TextEditingController pokemonNameController = TextEditingController();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Hello World'),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Card(
              child: Column(children: <Widget>[
                Image.asset('images/pokemon-logo.png', fit: BoxFit.fitWidth),
                const SizedBox(height: 20),
                Text(
                  pokemonName,
                  style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: TextField(
                    controller: pokemonNameController,
                    decoration: const InputDecoration(
                        labelText: 'Pesquise por um pokemon'),
                  ),
                )
              ]),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (() {
          pokemonName = pokemonNameController.text;
          setState(() {});
        }),
        child: const Icon(Icons.send),
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
