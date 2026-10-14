import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebase';
import { buscarResumoSigaa, PONTE_PADRAO } from './api';
import { chaveDia, diasAte } from './datas';
import { avisosDemo, diarioDemo, resumoDemo } from './demo';
import { agruparAvisos, agruparRepetidos, type ResultadoAgrupamento } from './ml';
import { criarAvisos, detectarDisciplina } from './parse';
import type { Atividade, Aviso, FonteId, RegistroDiario, ResumoSigaa } from './types';

export type Sessao = 'carregando' | 'logado' | 'demo' | 'anonimo';

interface Persistido {
  avisos: Aviso[];
  manuais: Atividade[];
  sigaa: ResumoSigaa | null;
  sigaaEm: string | null;
  concluidas: Record<string, true>;
  diario: RegistroDiario[];
  correcoes: Record<string, string>;
  ponte: string;
}

const VAZIO: Persistido = {
  avisos: [],
  manuais: [],
  sigaa: null,
  sigaaEm: null,
  concluidas: {},
  diario: [],
  correcoes: {},
  ponte: PONTE_PADRAO,
};

interface Contexto extends Persistido {
  sessao: Sessao;
  nome: string;
  atividades: Atividade[];
  agrupamento: ResultadoAgrupamento;
  repetidos: Record<string, Aviso[]>;
  entrarDemo: () => void;
  sair: () => void;
  conectarSigaa: (usuario: string, senha: string) => Promise<void>;
  desconectarSigaa: () => void;
  importarMensagens: (texto: string, fonte: FonteId) => number;
  removerAvisosDaFonte: (fonte: FonteId) => void;
  alternarConcluida: (id: string) => void;
  adicionarAtividade: (a: Omit<Atividade, 'id' | 'concluida' | 'fonte'>) => void;
  removerAtividade: (id: string) => void;
  registrarDia: (r: Omit<RegistroDiario, 'dia'>) => void;
  corrigirGrupo: (avisoId: string, ancoraId: string) => void;
  definirPonte: (url: string) => void;
}

const AstraContext = createContext<Contexto | null>(null);

const resumoParaAtividades = (r: ResumoSigaa | null): Atividade[] =>
  (r?.atividades ?? []).map((a) => ({
    id: a.id,
    titulo: a.titulo,
    disciplina: a.disciplina,
    data: a.data,
    fonte: 'sigaa',
    tipo: a.tipo,
    concluida: a.concluida,
  }));

function tituloDoAviso(texto: string): string {
  const primeira = texto.split(/(?<=[.!?])\s/)[0].trim();
  return primeira.length > 72 ? `${primeira.slice(0, 69)}...` : primeira;
}

export function AstraProvider({ children }: { children: React.ReactNode }) {
  const [sessao, setSessao] = useState<Sessao>('carregando');
  const [chave, setChave] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [dados, setDados] = useState<Persistido>(VAZIO);
  const carregado = useRef(false);
  const modoDemo = useRef(false);
  // Referência sempre atual para funções que não podem depender do estado (evita recriá-las)
  const dadosRef = useRef(dados);
  useEffect(() => {
    dadosRef.current = dados;
  }, [dados]);

  // Sessão: Firebase ou modo demonstração
  useEffect(() => {
    // Sem rede o Firebase pode demorar a responder: depois de 6 s mostramos o login
    const limite = setTimeout(() => setSessao((s) => (s === 'carregando' ? 'anonimo' : s)), 6000);
    const cancelar = onAuthStateChanged(auth, (usuario) => {
      clearTimeout(limite);
      if (usuario) {
        modoDemo.current = false;
        setNome(usuario.displayName ?? '');
        setChave(usuario.uid);
        setSessao('logado');
      } else if (!modoDemo.current) {
        setChave(null);
        setSessao('anonimo');
      }
    });
    return () => {
      clearTimeout(limite);
      cancelar();
    };
  }, []);

  // Carrega os dados salvos de quem entrou
  useEffect(() => {
    // O modo demonstração já define os próprios dados e nunca lê nem grava no aparelho
    if (!chave || chave === 'demo') return;
    carregado.current = false;
    AsyncStorage.getItem(`astra:v1:${chave}`)
      .then((bruto) => setDados(bruto ? { ...VAZIO, ...JSON.parse(bruto) } : VAZIO))
      .catch(() => setDados(VAZIO))
      .finally(() => {
        carregado.current = true;
      });
  }, [chave]);

  // Salva a cada mudança (o modo demonstração parte sempre do zero)
  useEffect(() => {
    if (!chave || !carregado.current || sessao === 'demo') return;
    AsyncStorage.setItem(`astra:v1:${chave}`, JSON.stringify(dados)).catch(() => {});
  }, [dados, chave, sessao]);

  const entrarDemo = useCallback(() => {
    modoDemo.current = true;
    carregado.current = true;
    setNome('Estudante');
    setDados({
      ...VAZIO,
      avisos: avisosDemo(),
      sigaa: resumoDemo(),
      sigaaEm: new Date().toISOString(),
      diario: diarioDemo(),
    });
    setChave('demo');
    setSessao('demo');
  }, []);

  const sair = useCallback(() => {
    modoDemo.current = false;
    setDados(VAZIO);
    setChave(null);
    setSessao('anonimo');
  }, []);

  const conectarSigaa = useCallback(async (usuario: string, senha: string) => {
    const resumo = await buscarResumoSigaa(dadosRef.current.ponte, usuario, senha);
    const nomes = resumo.disciplinas.map((x) => x.titulo);
    setDados((d) => ({
      ...d,
      sigaa: resumo,
      sigaaEm: new Date().toISOString(),
      // Avisos importados antes da conexão passam a reconhecer a disciplina
      avisos: d.avisos.map((a) => (a.disciplina ? a : { ...a, disciplina: detectarDisciplina(a.texto, nomes) })),
    }));
  }, []);

  const desconectarSigaa = useCallback(
    () => setDados((d) => ({ ...d, sigaa: null, sigaaEm: null })),
    []
  );

  const importarMensagens = useCallback((texto: string, fonte: FonteId) => {
    const disciplinas = (dadosRef.current.sigaa?.disciplinas ?? []).map((x) => x.titulo);
    const novos = criarAvisos(texto, fonte, disciplinas);
    setDados((d) => {
      const existentes = new Set(d.avisos.map((a) => `${a.fonte}|${a.texto}`));
      const unicos = novos.filter((a) => !existentes.has(`${a.fonte}|${a.texto}`));
      return { ...d, avisos: [...unicos, ...d.avisos] };
    });
    return novos.length;
  }, []);

  const removerAvisosDaFonte = useCallback(
    (fonte: FonteId) => setDados((d) => ({ ...d, avisos: d.avisos.filter((a) => a.fonte !== fonte) })),
    []
  );

  const alternarConcluida = useCallback(
    (id: string) =>
      setDados((d) => {
        const concluidas = { ...d.concluidas };
        if (concluidas[id]) delete concluidas[id];
        else concluidas[id] = true;
        return { ...d, concluidas };
      }),
    []
  );

  const adicionarAtividade = useCallback(
    (a: Omit<Atividade, 'id' | 'concluida' | 'fonte'>) =>
      setDados((d) => ({
        ...d,
        manuais: [...d.manuais, { ...a, id: `manual-${Date.now()}`, fonte: 'manual', concluida: false }],
      })),
    []
  );

  const removerAtividade = useCallback(
    (id: string) => setDados((d) => ({ ...d, manuais: d.manuais.filter((a) => a.id !== id) })),
    []
  );

  const registrarDia = useCallback(
    (r: Omit<RegistroDiario, 'dia'>) =>
      setDados((d) => {
        const dia = chaveDia(new Date());
        const resto = d.diario.filter((x) => x.dia !== dia);
        return { ...d, diario: [...resto, { dia, ...r }].sort((a, b) => a.dia.localeCompare(b.dia)) };
      }),
    []
  );

  const corrigirGrupo = useCallback(
    (avisoId: string, ancoraId: string) =>
      setDados((d) => ({ ...d, correcoes: { ...d.correcoes, [avisoId]: ancoraId } })),
    []
  );

  const definirPonte = useCallback((url: string) => setDados((d) => ({ ...d, ponte: url.trim() })), []);

  const avisosOrdenados = useMemo(
    () => [...dados.avisos].sort((a, b) => b.recebidoEm.localeCompare(a.recebidoEm)),
    [dados.avisos]
  );

  const repetidos = useMemo(() => {
    const mapa: Record<string, Aviso[]> = {};
    agruparRepetidos(avisosOrdenados).forEach((g) => {
      mapa[g[0].id] = g;
    });
    return mapa;
  }, [avisosOrdenados]);

  const agrupamento = useMemo(
    () => agruparAvisos(avisosOrdenados, dados.correcoes),
    [avisosOrdenados, dados.correcoes]
  );

  const atividades = useMemo(() => {
    const doSigaa = resumoParaAtividades(dados.sigaa);
    // Avisos com prazo: uma atividade por grupo de mensagens repetidas
    const comPrazo = avisosOrdenados.filter((a) => a.prazo);
    const dosAvisos: Atividade[] = agruparRepetidos(comPrazo)
      .map((g) => g[0])
      .filter(
        (a) =>
          !doSigaa.some(
            (s) => s.disciplina === a.disciplina && diasAte(new Date(s.data), new Date(a.prazo!)) === 0
          )
      )
      .map((a) => ({
        id: a.id,
        titulo: tituloDoAviso(a.texto),
        disciplina: a.disciplina,
        data: a.prazo!,
        fonte: a.fonte,
        tipo: /prova|avalia|exame/i.test(a.texto) ? 'avaliacao' : 'tarefa',
        concluida: false,
      }));
    return [...doSigaa, ...dosAvisos, ...dados.manuais]
      .map((a) => ({ ...a, concluida: a.concluida || Boolean(dados.concluidas[a.id]) }))
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [dados.sigaa, dados.manuais, dados.concluidas, avisosOrdenados]);

  const valor: Contexto = {
    ...dados,
    avisos: avisosOrdenados,
    sessao,
    nome,
    atividades,
    agrupamento,
    repetidos,
    entrarDemo,
    sair,
    conectarSigaa,
    desconectarSigaa,
    importarMensagens,
    removerAvisosDaFonte,
    alternarConcluida,
    adicionarAtividade,
    removerAtividade,
    registrarDia,
    corrigirGrupo,
    definirPonte,
  };

  return <AstraContext.Provider value={valor}>{children}</AstraContext.Provider>;
}

export function useAstra(): Contexto {
  const ctx = useContext(AstraContext);
  if (!ctx) throw new Error('useAstra precisa estar dentro de <AstraProvider>.');
  return ctx;
}
