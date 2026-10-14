/**
 * Ponte ASTRA <-> SIGAA (UFRPE).
 *
 * O app de celular não consegue rodar a sigaa-api (ela é feita para Node), então
 * este servidor faz o login no SIGAA, lê os dados e devolve um JSON simples.
 *
 * Privacidade: a senha do SIGAA é usada só durante a requisição. Não é gravada
 * e não vai para log.
 *
 *   npm start   -> usa o SIGAA real
 *   npm run mock -> usa dados de demonstração (sem credenciais)
 */
const http = require('http');
const resumoDemo = require('./mock');

const PORT = Number(process.env.PORT) || 3333;
const MOCK = process.env.SIGAA_MOCK === '1';
const SIGAA_URL = process.env.SIGAA_URL || 'https://sigs.ufrpe.br';
const ORIGEM_PERMITIDA = process.env.ALLOWED_ORIGIN || '*';
const LIMITE_CORPO = 10 * 1024; // 10 KB
const JANELA_MS = 60 * 1000;
const MAX_TENTATIVAS = 5;

const tentativas = new Map(); // ip -> { n, inicio }

function limitarTaxa(ip) {
  const agora = Date.now();
  const t = tentativas.get(ip);
  if (!t || agora - t.inicio > JANELA_MS) {
    tentativas.set(ip, { n: 1, inicio: agora });
    return true;
  }
  t.n += 1;
  return t.n <= MAX_TENTATIVAS;
}

function responder(res, status, corpo) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ORIGEM_PERMITIDA,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(corpo));
}

function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let dados = '';
    req.on('data', (parte) => {
      dados += parte;
      if (dados.length > LIMITE_CORPO) {
        reject(new Error('corpo grande demais'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(dados || '{}'));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

const tipoAtividade = { homework: 'tarefa', quiz: 'questionario', exam: 'avaliacao' };

function tituloAtividade(a) {
  if (a.type === 'homework') return a.homeworkTitle;
  if (a.type === 'quiz') return a.quizTitle;
  return a.examDescription;
}

// Cada seção roda isolada: se uma falhar, as outras continuam.
async function seguro(fn, padrao) {
  try {
    return await fn();
  } catch {
    return padrao;
  }
}

async function buscarNoSigaa(usuario, senha) {
  const { Sigaa } = require('sigaa-api');
  const sigaa = new Sigaa({ url: SIGAA_URL, institution: 'UFRPE' });
  const conta = await sigaa.login(usuario, senha);
  try {
    const ativos = await conta.getActiveBonds();
    const inativos = await conta.getInactiveBonds();
    const vinculo = [...ativos, ...inativos].find((v) => v.type === 'student');
    if (!vinculo) throw new Error('Nenhum vínculo de discente encontrado.');

    const atividadesBrutas = await seguro(() => vinculo.getActivities(), []);
    const indices = await seguro(() => vinculo.getAcademicIndices(), []);
    const turmas = await seguro(() => vinculo.getCourses(), []);
    const historico = await seguro(() => vinculo.getGradesHistory(), []);

    return {
      demo: false,
      aluno: { matricula: vinculo.registration, curso: vinculo.program },
      indices: indices.map((i) => ({ code: i.code, name: i.name, value: i.value })),
      atividades: atividadesBrutas
        .map((a, i) => ({
          id: `sigaa-${i}-${a.date.getTime()}`,
          tipo: tipoAtividade[a.type] || 'tarefa',
          titulo: tituloAtividade(a),
          disciplina: a.courseTitle,
          data: a.date.toISOString(),
          concluida: Boolean(a.done),
        }))
        .sort((a, b) => a.data.localeCompare(b.data)),
      disciplinas: turmas.map((t) => ({ codigo: t.code, titulo: t.title, periodo: t.period })),
      historico: historico.map((h) => ({
        periodo: h.period,
        codigo: h.code,
        titulo: h.title,
        mediaFinal: h.finalGrade ?? null,
        faltas: h.absences ?? null,
        situacao: h.situation ?? '',
      })),
    };
  } finally {
    await conta.logoff().catch(() => {});
  }
}

const servidor = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return responder(res, 204, {});
  if (req.method === 'GET' && req.url === '/saude') {
    return responder(res, 200, { ok: true, modo: MOCK ? 'demonstracao' : 'sigaa' });
  }
  if (req.method !== 'POST' || req.url !== '/sigaa/resumo') {
    return responder(res, 404, { erro: 'Rota não encontrada.' });
  }

  const ip = req.socket.remoteAddress || 'desconhecido';
  if (!limitarTaxa(ip)) {
    return responder(res, 429, { erro: 'Muitas tentativas. Aguarde um minuto.' });
  }

  try {
    if (MOCK) return responder(res, 200, resumoDemo());

    const { usuario, senha } = await lerCorpo(req);
    if (typeof usuario !== 'string' || typeof senha !== 'string' || !usuario || !senha) {
      return responder(res, 400, { erro: 'Informe usuário e senha do SIGAA.' });
    }
    const resumo = await buscarNoSigaa(usuario.trim(), senha);
    return responder(res, 200, resumo);
  } catch (erro) {
    const msg = String((erro && erro.message) || '');
    const credenciais = /usu[aá]rio|senha|login|credenc/i.test(msg);
    return responder(res, credenciais ? 401 : 502, {
      erro: credenciais
        ? 'Usuário ou senha do SIGAA incorretos.'
        : 'Não foi possível ler o SIGAA agora. Tente novamente mais tarde.',
    });
  }
});

servidor.listen(PORT, () => {
  console.log(`Ponte ASTRA-SIGAA em http://localhost:${PORT} (${MOCK ? 'demonstração' : 'SIGAA real'})`);
});
