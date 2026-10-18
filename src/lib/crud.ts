import type { Aviso, RegistroDiario } from './types';

/** Remove uma mensagem e as correções que a citavam, como origem ou como âncora. */
export function removerAvisoEComCorrecoes(
  avisos: Aviso[],
  correcoes: Record<string, string>,
  id: string
): { avisos: Aviso[]; correcoes: Record<string, string> } {
  return {
    avisos: avisos.filter((a) => a.id !== id),
    correcoes: Object.fromEntries(
      Object.entries(correcoes).filter(([origem, ancora]) => origem !== id && ancora !== id)
    ),
  };
}

/** Desfaz a correção de uma mensagem, que volta para o agrupamento automático. */
export function desfazerCorrecaoDoAviso(correcoes: Record<string, string>, avisoId: string): Record<string, string> {
  const resto = { ...correcoes };
  delete resto[avisoId];
  return resto;
}

/** Remove o registro do diário de um dia. */
export function removerRegistroDoDia(diario: RegistroDiario[], dia: string): RegistroDiario[] {
  return diario.filter((r) => r.dia !== dia);
}
