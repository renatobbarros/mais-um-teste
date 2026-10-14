/**
 * SIGAA direto do celular (iOS e Android): a biblioteca sigaa-api roda dentro do app,
 * sem servidor. O Metro troca a camada HTTP do Node por `sigaa-http.native.js`.
 */
import type { ResumoSigaa } from './types';

export const sigaaNativoDisponivel = true;

const URL_SIGAA = 'https://sigs.ufrpe.br';

export class ErroSigaa extends Error {}

export async function buscarResumoNativo(usuario: string, senha: string): Promise<ResumoSigaa> {
  // Carregado só quando necessário: a biblioteca é grande e só faz sentido depois do login
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { Sigaa } = require('../../vendor/sigaa-api/dist/sigaa-all-types');
  const { buscarResumo, ehErroDeCredencial } = require('../../vendor/sigaa-api/resumo');
  /* eslint-enable @typescript-eslint/no-require-imports */
  try {
    return (await buscarResumo(Sigaa, { url: URL_SIGAA, usuario, senha })) as ResumoSigaa;
  } catch (erro) {
    throw new ErroSigaa(
      ehErroDeCredencial(erro)
        ? 'Usuário ou senha do SIGAA incorretos.'
        : 'Não foi possível ler o SIGAA agora. Tente novamente mais tarde.'
    );
  }
}
