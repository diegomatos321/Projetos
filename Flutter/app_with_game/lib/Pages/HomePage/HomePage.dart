import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../../AppDrawer.dart';
import 'MemeSearchWidget.dart';

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  var memeName = '';
  TextEditingController memeNameController = TextEditingController();

  var api = 'api.imgflip.com';

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
    print(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hello World'),
      ),
      body: SingleChildScrollView(
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
