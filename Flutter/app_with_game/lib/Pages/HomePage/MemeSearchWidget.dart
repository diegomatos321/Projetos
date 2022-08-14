import 'package:flutter/material.dart';

class MemeSearchWidget extends StatelessWidget {
  const MemeSearchWidget({
    Key? key,
    required this.memeNameController,
  }) : super(key: key);

  final TextEditingController memeNameController;
  final String appTitle = 'Personagens de Star Wars';

  @override
  Widget build(BuildContext context) {
    return Card(
          child: Column(children: <Widget>[
            Image.asset('images/pokemon-logo.png', fit: BoxFit.fitWidth),
            const SizedBox(height: 20),
            Text(
              appTitle,
              style: const TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.all(8),
              child: TextField(
                controller: memeNameController,
                decoration: const InputDecoration(
                    labelText: 'Digite o nome de um personagem'),
              ),
            )
          ]),
    );
  }
}
