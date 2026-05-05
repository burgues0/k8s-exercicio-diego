from aluno.model import Aluno

class AlunoService:

    def __init__(self, repository):
        self.repository = repository

    def listar(self):
        return self.repository.get_all()

    def buscar_por_id(self, id):
        aluno = self.repository.get_by_id(id)
        if not aluno:
            raise Exception("Aluno não encontrado")
        return aluno

    def criar(self, nome, idade):
        aluno = Aluno(nome=nome, idade=idade)
        return self.repository.create(aluno)

    def atualizar(self, id, nome, idade):
        aluno = self.buscar_por_id(id)
        aluno.nome = nome
        aluno.idade = idade
        return self.repository.update(aluno)

    def deletar(self, id):
        aluno = self.buscar_por_id(id)
        self.repository.delete(aluno)