import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../AppDrawer.dart';
import 'MemeSearchWidget.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String memeName = '';
  List memeList = [];
  TextEditingController memeNameController = TextEditingController();

  String api = 'api.imgflip.com';

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    fetchData();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  fetchData() async {
    var endpoint = Uri.https(api, 'get_memes');

    var response = await http.get(endpoint);
    Map responseBody = jsonDecode(response.body);
    
    memeList = responseBody['data']['memes'];
    setState(() { });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hello World'),
      ),
      body: memeList.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: MemeSearchWidget(memeNameController: memeNameController),
            ),
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
