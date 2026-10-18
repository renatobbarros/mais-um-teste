/**
 * SIGAA direto do celular (iOS e Android): a biblioteca sigaa-api roda dentro do app,
 * sem servidor. O Metro troca a camada HTTP do Node por `sigaa-http.native.js`.
 *
 * São duas tentativas:
 *  1. `expo/fetch`, com redirecionamentos e cookies tratados pela própria biblioteca;
 *  2. o `fetch` do React Native, que segue redirecionamentos e guarda cookies no aparelho.
 * Se a primeira falhar por algo que não seja senha errada, a segunda é tentada.
 */
import { ehErroDeCredencialSigaa, mensagemCompletaSigaa, mensagemDoErro } from './errosSigaa';
import type { ResumoSigaa } from './types';

export const sigaaNativoDisponivel = true;

const URL_SIGAA = 'https://sigs.ufrpe.br';
/** Tempo máximo de cada tentativa completa (login + leitura). */
const TEMPO_TENTATIVA_MS = 90000;

export class ErroSigaa extends Error {}

type FetchSigaa = (url: string, init: RequestInit) => Promise<Response>;

/** `fetch` do React Native: o Android/iOS seguem redirecionamentos e guardam os cookies da sessão. */
const fetchDoAparelho: FetchSigaa = (url, init) =>
  fetch(url, {
    method: init.method,
    headers: init.headers,
    body: init.body,
    signal: init.signal,
    credentials: 'include',
  });

function comTempoLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const limite = setTimeout(() => reject(new Error('tempo esgotado esperando o SIGAA')), ms);
    promessa.then(
      (valor) => {
        clearTimeout(limite);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(limite);
        reject(erro);
      }
    );
  });
}

export async function buscarResumoNativo(usuario: string, senha: string): Promise<ResumoSigaa> {
  // Carregado só quando necessário: a biblioteca é grande e só faz sentido depois do login
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { Sigaa } = require('../../vendor/sigaa-api/dist/sigaa-all-types');
  const { buscarResumo } = require('../../vendor/sigaa-api/resumo');
  /* eslint-enable @typescript-eslint/no-require-imports */
  const global = globalThis as { __SIGAA_FETCH__?: FetchSigaa };
  const tentativas: { nome: string; fetch?: FetchSigaa }[] = [
    { nome: 'expo', fetch: undefined },
    { nome: 'aparelho', fetch: fetchDoAparelho },
  ];
  const erros: string[] = [];

  for (const tentativa of tentativas) {
    global.__SIGAA_FETCH__ = tentativa.fetch;
    try {
      return (await comTempoLimite(
        buscarResumo(Sigaa, { url: URL_SIGAA, usuario, senha }),
        TEMPO_TENTATIVA_MS
      )) as ResumoSigaa;
    } catch (erro) {
      const mensagem = mensagemDoErro(erro);
      if (ehErroDeCredencialSigaa(mensagem)) throw new ErroSigaa('Usuário ou senha do SIGAA incorretos.');
      erros.push(`${tentativa.nome}: ${mensagem}`);
    } finally {
      global.__SIGAA_FETCH__ = undefined;
    }
  }
  throw new ErroSigaa(mensagemCompletaSigaa(erros));
}
