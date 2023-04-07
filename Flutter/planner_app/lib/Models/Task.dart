class Task {
  String id = DateTime.now().toString();
  String nome;
  String descricao;
  bool isDone;

  Task({required this.nome, this.descricao = '', this.isDone = false});
}
