from aluno.model import Aluno
from db import db

class AlunoRepository:

    def get_all(self):
        return Aluno.query.all()

    def get_by_id(self, id):
        return Aluno.query.get(id)

    def create(self, aluno):
        db.session.add(aluno)
        db.session.commit()
        return aluno

    def update(self, aluno):
        db.session.commit()
        return aluno

    def delete(self, aluno):
        db.session.delete(aluno)
        db.session.commit()