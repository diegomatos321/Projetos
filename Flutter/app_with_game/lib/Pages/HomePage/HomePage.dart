import 'dart:convert';

import 'package:app_with_game/Pages/LoginPage/LoginPage.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../AppDrawer.dart';
import 'MemeSearchWidget.dart';

class HomePage extends StatelessWidget {
  static const String routeName = 'HomePage';
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  String memeName = '';
  TextEditingController memeNameController = TextEditingController();

  String api = 'api.imgflip.com';

  Future<List> fetchData() async {
    final Uri endpoint = Uri.https(api, 'get_memes');

    http.Response response = await http.get(endpoint);
    Map responseBody = jsonDecode(response.body);

    return responseBody['data']['memes'];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hello World'),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.exit_to_app_sharp),
            onPressed: () async {
              SharedPreferences prefs = await _prefs;
              final bool result = await prefs.setBool('loggedIn', false);
              print(result);

              Navigator.pushReplacementNamed(context, LoginPage.routeName);
            },
          )
        ],
      ),
      body: FutureBuilder(
        future: fetchData(),
        builder: (context, AsyncSnapshot<List> snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.none:
              return const Center(
                child: Text('Fetch something'),
              );
            case ConnectionState.done:
              if (snapshot.hasError) {
                return const Center(child: Text('Ocorreu um problema, tente novamente mais tarde'));
              }

              return ListView.builder(
                itemCount: snapshot.data?.length,
                itemBuilder: (context, index) {
                  final currentElement = snapshot.data?[index];
                  return ListTile(
                    title: Text(currentElement['name']),
                    subtitle: Image.network(currentElement['url'])
                  );
                },
              );
            default:
              return const Center(
                child: CircularProgressIndicator(),
              );
          }
        },
      ),
      drawer: const AppDrawer(),
    );
  }
}
