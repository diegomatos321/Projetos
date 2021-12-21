import 'package:flutter/material.dart';

void main(List<String> args) {
  runApp(MaterialApp(
    home: const HelloWorld(),
    theme: ThemeData(
      primarySwatch: Colors.lightBlue
    )
  ));
}

class HelloWorld extends StatelessWidget {
  const HelloWorld({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Minha primeira Aplicação em Flutter")
      ),
      body: Center(
        child: Container(
          width: 100,
          height: 100,
          color: Colors.black,
          alignment: Alignment.center,
          child: const Text(          
            "Hello World",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            )
          ),
        ),
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
              leading: Icon(Icons.person_rounded),
              title: Text("Diego Matos"),
              subtitle: Text("Desenvolvedor"),
              trailing: Icon(Icons.contact_phone),
              onTap: (){},
            )
          ],
        )
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: (){},
        child: const Icon(Icons.edit),
      ),
    );
  }
}