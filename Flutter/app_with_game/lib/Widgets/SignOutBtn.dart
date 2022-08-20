import 'package:app_with_game/Pages/LoginPage/LoginPage.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SignOutBtn extends StatelessWidget {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  SignOutBtn({Key? key}) : super(key: key);

  Future<void> handleClick(BuildContext context) async {
    SharedPreferences prefs = await _prefs;
    await prefs.setBool('loggedIn', false);

    Navigator.pushReplacementNamed(context, LoginPage.routeName);
  }

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.exit_to_app_sharp),
      onPressed: () => handleClick(context),
    );
  }
}
