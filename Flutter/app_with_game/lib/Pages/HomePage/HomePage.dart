import 'dart:convert';

import 'package:app_with_game/Pages/LoginPage/LoginPage.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../AppDrawer.dart';
import 'MemeSearchWidget.dart';

class HomePage extends StatefulWidget {
  static const String routeName = 'HomePage';

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  String memeName = '';
  List memeList = [];
  TextEditingController memeNameController = TextEditingController();

  String api = 'api.imgflip.com';

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> fetchData() async {
    var endpoint = Uri.https(api, 'get_memes');

    var response = await http.get(endpoint);
    Map responseBody = jsonDecode(response.body);
    
    setState(() { 
      memeList = responseBody['data']['memes'];
    });
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
      body: memeList.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(itemBuilder: (context, index) {
              var currentElement = memeList[index];

              return ListTile(
                title: Text(currentElement['name']),
                leading: Image.network(currentElement['url']),
              );
          }, itemCount: memeList.length,),
      floatingActionButton: FloatingActionButton(
        onPressed: (() {
          memeName = memeNameController.text;
          setState(() {});
        }),
        child: const Icon(Icons.send),
      ),
      drawer: const AppDrawer(),
    );
  }
}
