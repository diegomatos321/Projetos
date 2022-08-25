import 'package:app_with_game/Widgets/sign_out_btn.dart';
import 'package:flutter/material.dart';
import 'package:flutter_unity_widget/flutter_unity_widget.dart';

class JogosPage extends StatefulWidget {
  static const routeName = 'JogosPage';

  const JogosPage({Key? key}) : super(key: key);

  @override
  State<JogosPage> createState() => _JogosPageState();
}

class _JogosPageState extends State<JogosPage> {
  static final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late UnityWidgetController _unityWidgetController;

  void onUnityCreated(controller) {
    this._unityWidgetController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Página com Jogos'),
        actions: <Widget>[
          SignOutBtn()
        ],
      ),
      body: SafeArea(
        bottom: false,
        child: UnityWidget(
          onUnityCreated: onUnityCreated,
          useAndroidViewSurface: true,
        ),
      ),
    );
  }
}