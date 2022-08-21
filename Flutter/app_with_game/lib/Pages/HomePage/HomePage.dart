import 'dart:convert';

import 'package:app_with_game/Widgets/SignOutBtn.dart';
import 'package:app_with_game/Widgets/image_banner.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../AppDrawer.dart';

class HomePage extends StatelessWidget {
  static const String routeName = 'HomePage';
  String api = 'api.imgflip.com';

  Future<List> fetchData() async {
    final Uri endpoint = Uri.https(api, 'get_memes');

    http.Response response = await http.get(endpoint);
    Map responseBody = jsonDecode(response.body);

    return responseBody['data']['memes'];
  }

  Widget handleDataFetched(BuildContext context, AsyncSnapshot<List> snapshot) {
    switch (snapshot.connectionState) {
      case ConnectionState.none:
        return const Center(
          child: Text('Fetch something'),
        );
      case ConnectionState.done:
        if (snapshot.hasError) {
          return const Center(
              child: Text('Ocorreu um problema, tente novamente mais tarde'));
        }

        return SingleChildScrollView(
          physics: const ScrollPhysics(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              ImageBanner('assets/images/memes-banner.jpg'),
              ListView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  shrinkWrap: true,
                  itemCount: snapshot.data?.length,
                  itemBuilder: (context, index) {
                    final currentElement = snapshot.data?[index];
                    return Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: ListTile(
                        title: Text(currentElement['name']),
                        subtitle: Image.network(currentElement['url'])
                      )
                    );
                  }
                )
            ]
          ),
        );
      default:
        return const Center(
          child: CircularProgressIndicator(),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Uma incrível lista de memes!'),
        actions: <Widget>[SignOutBtn()],
      ),
      body: FutureBuilder(
        future: fetchData(),
        builder: handleDataFetched,
      ),
      drawer: const AppDrawer(),
    );
  }
}
