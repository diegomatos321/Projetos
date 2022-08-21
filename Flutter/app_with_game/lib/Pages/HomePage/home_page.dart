import 'package:app_with_game/Widgets/sign_out_btn.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  static const routeName = 'HomePage';

  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Página Principal'),
        actions: <Widget>[
          SignOutBtn(),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Section('Memes', 'assets/images/memes-banner.jpg'),
            Section('Jogos', 'assets/images/memes-banner.jpg'),
          ],
        ),
      ),
    );
  }
}

class Section extends StatelessWidget {
  String _title = '';
  String _bannerPath = '';

  Section(String title, String bannerPath) {
    _title = title;
    _bannerPath = bannerPath;
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(_title),
      subtitle: Container(
        constraints: const BoxConstraints.expand(
          height: 100.0
        ),
        child: Image.asset(
          _bannerPath,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
