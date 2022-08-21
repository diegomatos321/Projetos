import 'package:app_with_game/Widgets/sign_out_btn.dart';
import 'package:flutter/material.dart';

class JogosPage extends StatelessWidget {
  static const routeName = 'JogosPage';

  const JogosPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Página com Jogos'),
        actions: <Widget>[
          SignOutBtn()
        ],
      ),
      body: Column(),
    );
  }
}