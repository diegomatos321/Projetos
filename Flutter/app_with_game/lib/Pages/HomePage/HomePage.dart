import 'package:flutter/material.dart';

import '../../AppDrawer.dart';
import 'SearchPokemonWidget.dart';

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
        title: const Text('Hello World'),
      ),
      body: SingleChildScrollView(
        child: SearchPokemonWidget(pokemonName: pokemonName, pokemonNameController: pokemonNameController),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (() {
          pokemonName = pokemonNameController.text;
          setState(() {});
        }),
        child: const Icon(Icons.send),
      ),
      drawer: const AppDrawer(),
    );
  }
}
