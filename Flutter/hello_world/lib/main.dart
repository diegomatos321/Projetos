import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
    home: const HelloWorld(),
    theme: ThemeData(
      primarySwatch: Colors.lightBlue
    )
  ));
}

class HelloWorld extends StatefulWidget {
  const HelloWorld({ Key? key }) : super(key: key);

  @override
  State<HelloWorld> createState() => _HelloWorldState();
}

class _HelloWorldState extends State<HelloWorld> {
  var texto = "Escreva alguma coisa";
  TextEditingController _textoController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Minha primeira Aplicação em Flutter")
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Card(
            child: Column(
              children: <Widget>[
                Text(
                  texto,
                  style: TextStyle(fontSize: 25, fontWeight: FontWeight.bold),
                ),
                Padding(
                  padding: EdgeInsets.all(8.0),
                  child: TextField(
                    controller: _textoController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: "Blah Blah Blah"
                    ),
                  ),
                )
              ],
            ),
          ),
        )
      ),
      drawer: Drawer(
        child: ListView(
          padding: const EdgeInsets.all(0),
          children: <Widget>[
            const UserAccountsDrawerHeader(
              accountName: Text("Diego Matos"), 
              accountEmail: Text("example@email.com"),
              currentAccountPicture: CircleAvatar(
                backgroundImage: NetworkImage("https://avatars.githubusercontent.com/u/59349414?v=4")
              )
            ),
            ListTile(
              leading: const Icon(Icons.person_rounded),
              title: const Text("Diego Matos"),
              subtitle: const Text("Desenvolvedor"),
              trailing: const Icon(Icons.contact_phone),
              onTap: (){},
            )
          ],
        )
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (){
          texto = _textoController.text;
          setState(() {
            
          });
        },
        child: const Icon(Icons.send),
      ),
    );
  }
}