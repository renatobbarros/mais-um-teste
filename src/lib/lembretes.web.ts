/** No navegador não há lembretes agendados no sistema. */
import type { Atividade } from './types';

export const lembretesDisponiveis = false;

export async function pedirPermissaoLembretes(): Promise<boolean> {
  return false;
}

export async function cancelarLembretes(): Promise<void> {}

export async function agendarLembretes(_atividades: Atividade[]): Promise<number> {
  return 0;
}
