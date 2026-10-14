/**
 * Decide quais lembretes agendar. Fica separado do código do celular para poder ser testado.
 * Cada atividade pendente gera até dois avisos: 1 dia antes e 2 horas antes do prazo.
 */
import { hora, rotuloDia } from './datas';
import type { Atividade } from './types';

export interface Lembrete {
  /** Identificador estável: mesma atividade e mesmo tipo de aviso geram o mesmo id. */
  id: string;
  quando: Date;
  titulo: string;
  corpo: string;
}

/** O iOS aceita no máximo 64 notificações agendadas; deixamos folga. */
export const LIMITE_LEMBRETES = 60;

const HORA_MS = 3600000;

export function calcularLembretes(atividades: Atividade[], agora: Date = new Date()): Lembrete[] {
  const lista: Lembrete[] = [];
  for (const a of atividades) {
    if (a.concluida) continue;
    const prazo = new Date(a.data);
    if (isNaN(prazo.getTime())) continue;

    const detalhe = [a.disciplina, `${rotuloDia(prazo, agora)}, ${hora(prazo)}`].filter(Boolean).join(' · ');
    const umDiaAntes = new Date(prazo.getTime() - 24 * HORA_MS);
    const duasHorasAntes = new Date(prazo.getTime() - 2 * HORA_MS);

    if (umDiaAntes > agora) {
      lista.push({ id: `${a.id}:dia`, quando: umDiaAntes, titulo: `Amanhã: ${a.titulo}`, corpo: detalhe });
    }
    if (duasHorasAntes > agora) {
      lista.push({ id: `${a.id}:horas`, quando: duasHorasAntes, titulo: `Em 2 horas: ${a.titulo}`, corpo: detalhe });
    }
  }
  return lista.sort((x, y) => x.quando.getTime() - y.quando.getTime()).slice(0, LIMITE_LEMBRETES);
}
