import 'package:app_with_game/Pages/HomePage/HomePage.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LoginPage extends StatefulWidget {
  static const String routeName = 'LoginPage';

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GlobalKey formKey = GlobalKey<FormState>();
  final TextEditingController _userNameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
      ),
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
        Image.asset(
            'images/pokemon-logo.png', 
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.7),
            colorBlendMode: BlendMode.darken,
          ),
        Center(
          child: SingleChildScrollView(
            child: Form(
              key: formKey,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: <Widget>[
                      TextFormField(
                        controller: _userNameController,
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {},
                        decoration: const InputDecoration(
                            hintText: 'fulanodetal@example.com',
                            labelText: 'Digite seu Email'),
                      ),
                      SizedBox(height: 20),
                      TextFormField(
                        controller: _passwordController,
                        keyboardType: TextInputType.text,
                        validator: (value) {},
                        decoration: const InputDecoration(
                            labelText: 'Digite sua senha'),
                      ),
                      SizedBox(height: 20),
                      RaisedButton(
                        onPressed: () {
                          // formKey.currentState.validate();

                          Navigator.pushNamed(context, HomePage.routeName);
                        },
                        color: Colors.purple,
                        textColor: Colors.white,
                        child: const Text('Entrar'),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ),
        )
      ]),
    );
  }
}
