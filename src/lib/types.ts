export type FonteId = 'sigaa' | 'classroom' | 'whatsapp' | 'telegram' | 'discord' | 'manual';

export type TipoAviso = 'prazo' | 'comunicado' | 'material';

export interface Aviso {
  id: string;
  fonte: FonteId;
  texto: string;
  /** Quando a mensagem foi enviada (ISO). */
  recebidoEm: string;
  tipo: TipoAviso;
  disciplina?: string;
  /** Data de entrega/prova encontrada dentro do texto (ISO). */
  prazo?: string;
}

export interface Atividade {
  id: string;
  titulo: string;
  disciplina?: string;
  data: string;
  fonte: FonteId;
  tipo: 'tarefa' | 'avaliacao' | 'questionario';
  concluida: boolean;
}

export interface IndiceAcademico {
  code: string;
  name: string;
  value: number;
}

export interface DisciplinaSigaa {
  codigo: string;
  titulo: string;
  periodo: string;
}

export interface HistoricoDisciplina {
  periodo: string;
  codigo: string;
  titulo: string;
  mediaFinal: number | null;
  faltas: number | null;
  situacao: string;
}

/** Resposta da ponte com o SIGAA. */
export interface ResumoSigaa {
  demo: boolean;
  aluno: { matricula: string; curso: string };
  indices: IndiceAcademico[];
  atividades: {
    id: string;
    tipo: 'tarefa' | 'avaliacao' | 'questionario';
    titulo: string;
    disciplina: string;
    data: string;
    concluida: boolean;
  }[];
  disciplinas: DisciplinaSigaa[];
  historico: HistoricoDisciplina[];
}

export interface RegistroDiario {
  /** Dia no formato AAAA-MM-DD. */
  dia: string;
  sonoHoras: number;
  estudoHoras: number;
  /** 1 (tranquilo) a 5 (muito estressado). */
  estresse: number;
}

export interface Grupo {
  id: string;
  rotulo: string;
  avisos: Aviso[];
}
