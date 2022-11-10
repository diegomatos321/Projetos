class Task {
  String nome;
  String descricao;
  DateTime createdTime;
  bool isDone;

  Task({
    required this.nome,
    this.descricao = '',
    required this.createdTime,
    this.isDone = false});
}
