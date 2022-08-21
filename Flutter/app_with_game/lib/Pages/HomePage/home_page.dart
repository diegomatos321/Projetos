import 'package:app_with_game/Pages/JogosPage/jogos_page.dart';
import 'package:app_with_game/Pages/MemePage/meme_page.dart';
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
            Section('Memes', 'Uma coletânia dos memes mais populares',
                'assets/images/memes-banner.jpg', MemePage.routeName),
            Section('Jogos', 'Jogos para você passar o tempo',
                'assets/images/memes-banner.jpg', JogosPage.routeName),
          ],
        ),
      ),
    );
  }
}

class Section extends StatelessWidget {
  String _title = '';
  String _bannerPath = '';
  String _subtitle = '';
  String _routeName = '';

  Section(String title, String subtitle, String bannerPath, String routeName) {
    _title = title;
    _bannerPath = bannerPath;
    _subtitle = subtitle;
    _routeName = routeName;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2.0,
      child: ListTile(
        onTap: () => Navigator.pushNamed(context, _routeName),
        contentPadding: const EdgeInsets.fromLTRB(8.0, 16.0, 8.0, 16.0),
        leading: Image.asset(
          _bannerPath,
          fit: BoxFit.cover,
        ),
        title: Text(_title),
        subtitle: Text(_subtitle),
      ),
    );
  }
}
