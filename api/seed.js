import db from './database.js';
import { 
  Usuario, 
  Endereco, 
  Foto, 
  Interesse, 
  UsuarioInteresse, 
  Interacao, 
  Match, 
  Mensagem 
} from './modelIndex.js';

async function seed() {
  try {
    await db.sync({ force: true });
    console.log("tabelas criadas");

    console.log("interesses");
    const int1 = await Interesse.create({ nome: 'prog' });
    const int2 = await Interesse.create({ nome: 'cerveja' });
    const int3 = await Interesse.create({ nome: 'musica' });

    console.log("usuarios");
    const user1 = await Usuario.create({
      nome: 'Dev Anonimo',
      email: 'dev@teste.com',
      senha: 'senha_123',
      data_nascimento: '2000-01-01',
      genero: 'Não-binário',
      bio: 'Cerveja e deploy na sexta',
      criado_em: new Date()
    });

    const user2 = await Usuario.create({
      nome: 'AAAA BBBB',
      email: 'aaaa@teste.com',
      senha: 'senha_456',
      data_nascimento: '1995-12-10',
      genero: 'Feminino',
      bio: 'Teste',
      criado_em: new Date()
    });

    await UsuarioInteresse.create({ usuario_id: user1.id, interesse_id: int1.id });
    await UsuarioInteresse.create({ usuario_id: user1.id, interesse_id: int2.id });
    await UsuarioInteresse.create({ usuario_id: user2.id, interesse_id: int1.id });
    await UsuarioInteresse.create({ usuario_id: user2.id, interesse_id: int3.id });

    await Endereco.create({
      usuario_id: user1.id,
      logradouro: 'rua bolinha',
      numero: '4566',
      bairro: 'cefet',
      cidade: 'marygrace',
      estado: 'seila',
      cep: '00000-000',
      latitude: -23.550520,
      longitude: -46.633309
    });

    await Endereco.create({
      usuario_id: user2.id,
      logradouro: 'avenida quadrado',
      numero: '100',
      bairro: 'centro',
      cidade: 'dos bobos',
      estado: 'seila',
      cep: '00000-000',
      latitude: -23.551000,
      longitude: -46.634000
    });

    await Foto.create({ usuario_id: user1.id, url_foto: 'https://avatar.com/dev.png', principal: true, criado_em: new Date() });
    await Foto.create({ usuario_id: user2.id, url_foto: 'https://avatar.com/aaaa.png', principal: true, criado_em: new Date() });

    await Interacao.create({ usuario_origem: user1.id, usuario_destino: user2.id, tipo: 'like', criado_em: new Date() });
    await Interacao.create({ usuario_origem: user2.id, usuario_destino: user1.id, tipo: 'like', criado_em: new Date() });

    const match = await Match.create({
      usuario1_id: user1.id,
      usuario2_id: user2.id,
      criado_em: new Date()
    });

    await Mensagem.create({
      match_id: match.id,
      remetente_id: user1.id,
      conteudo: 'aaaaaaaaaa',
      enviado_em: new Date()
    });

    await Mensagem.create({
      match_id: match.id,
      remetente_id: user2.id,
      conteudo: 'bbbbbbbbbbbbbb',
      enviado_em: new Date()
    });

    console.log("seed ok");
    process.exit(0);
  } catch (error) {
    console.error("seed nok:", error);
    process.exit(1);
  }
}

seed();