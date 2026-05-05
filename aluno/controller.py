from flask import Blueprint, request, jsonify
from aluno.repository import AlunoRepository
from aluno.service import AlunoService

aluno_bp = Blueprint('aluno', __name__)

repository = AlunoRepository()
service = AlunoService(repository)


@aluno_bp.route('/alunos', methods=['GET'])
def listar():
    alunos = service.listar()
    return jsonify([a.to_dict() for a in alunos])


@aluno_bp.route('/alunos/<int:id>', methods=['GET'])
def buscar(id):
    try:
        aluno = service.buscar_por_id(id)
        return jsonify(aluno.to_dict())
    except Exception as e:
        return jsonify({"erro": str(e)}), 404


@aluno_bp.route('/alunos', methods=['POST'])
def criar():
    data = request.json
    aluno = service.criar(data['nome'], data['idade'])
    return jsonify(aluno.to_dict()), 201


@aluno_bp.route('/alunos/<int:id>', methods=['PUT'])
def atualizar(id):
    data = request.json
    try:
        aluno = service.atualizar(id, data['nome'], data['idade'])
        return jsonify(aluno.to_dict())
    except Exception as e:
        return jsonify({"erro": str(e)}), 404


@aluno_bp.route('/alunos/<int:id>', methods=['DELETE'])
def deletar(id):
    try:
        service.deletar(id)
        return '', 204
    except Exception as e:
        return jsonify({"erro": str(e)}), 404