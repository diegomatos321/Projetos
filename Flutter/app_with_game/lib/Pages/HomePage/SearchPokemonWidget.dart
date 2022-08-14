import 'package:flutter/material.dart';

class SearchPokemonWidget extends StatelessWidget {
  const SearchPokemonWidget({
    Key? key,
    required this.pokemonName,
    required this.pokemonNameController,
  }) : super(key: key);

  final String pokemonName;
  final TextEditingController pokemonNameController;

  @override
  Widget build(BuildContext context) {
    return Column(
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
    );
  }
}
