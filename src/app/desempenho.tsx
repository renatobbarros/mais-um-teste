import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Campo, Cabecalho, Cartao, Icone, Secao, Selo, Tela, Txt, Vazio } from '@/components/ui';
import { alertasRotina, fmt, mediasRotina, pontosDeAtencao } from '@/lib/analise';
import { estresseDoDiario, preverGpa } from '@/lib/previsao';
import { useAstra } from '@/lib/store';
import type { HistoricoDisciplina } from '@/lib/types';

export default function Desempenho() {
  const { sigaa, diario } = useAstra();
  const medias = mediasRotina(diario);
  const alertasDaRotina = alertasRotina(medias);
  const atencao = pontosDeAtencao(sigaa?.historico ?? []);

  if (!sigaa && diario.length === 0) {
    return (
      <Tela>
        <Cabecalho titulo="Desempenho" voltar={() => router.back()} />
        <Cartao>
          <Vazio
            icone="stats-chart-outline"
            titulo="Ainda não há dados"
            texto="Conecte o SIGAA para ver notas e faltas, e use o diário para acompanhar sua rotina."
            acao="Conectar o SIGAA"
            onAcao={() => router.replace('/fontes')}
          />
        </Cartao>
      </Tela>
    );
  }

  const porPeriodo = new Map<string, HistoricoDisciplina[]>();
  (sigaa?.historico ?? []).forEach((h) => porPeriodo.set(h.periodo, [...(porPeriodo.get(h.periodo) ?? []), h]));

  return (
    <Tela>
      <Cabecalho titulo="Desempenho" subtitulo="Seu progresso e pontos de atenção." voltar={() => router.back()} />

      {sigaa && sigaa.indices.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {sigaa.indices.slice(0, 2).map((i) => (
            <Cartao key={i.code} style={{ flex: 1 }}>
              <Txt v="rotulo" cor="textMuted">
                {i.code}
              </Txt>
              <Txt style={{ fontSize: 32, fontWeight: '800' }}>{fmt(i.value)}</Txt>
              <Txt v="legenda" cor="textSecondary" numberOfLines={2}>
                {i.name}
              </Txt>
            </Cartao>
          ))}
        </View>
      ) : null}

      {atencao.length > 0 ? (
        <Secao titulo="Pontos de atenção">
          {atencao.map((p) => (
            <Cartao key={p.codigo}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Icone nome="alert-circle-outline" tamanho={22} cor="warning" />
                <View style={{ flex: 1 }}>
                  <Txt v="subtitulo">{p.titulo}</Txt>
                  <Txt v="legenda" cor="textSecondary">
                    {p.motivo}
                  </Txt>
                </View>
              </View>
            </Cartao>
          ))}
        </Secao>
      ) : null}

      <EstimativaGpa medias={medias} />

      <Secao titulo="Rotina" acao="Registrar hoje" onAcao={() => router.push('/diario')}>
        {medias ? (
          <Cartao>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Metrica rotulo="Sono" valor={`${fmt(medias.sono)} h`} />
              <Metrica rotulo="Estudo" valor={`${fmt(medias.estudo)} h`} />
              <Metrica rotulo="Estresse" valor={`${fmt(medias.estresse)} / 5`} />
            </View>
            <Txt v="legenda" cor="textMuted">
              Média dos últimos {medias.dias} {medias.dias === 1 ? 'dia' : 'dias'} registrados.
            </Txt>
            {alertasDaRotina.map((a) => (
              <Txt key={a} v="legenda" cor="warning" style={{ fontWeight: '600' }}>
                {a}
              </Txt>
            ))}
          </Cartao>
        ) : (
          <Cartao>
            <Txt cor="textSecondary">Registre seu dia no diário para ver a média de sono, estudo e estresse.</Txt>
          </Cartao>
        )}
      </Secao>

      {[...porPeriodo.entries()].map(([periodo, itens]) => (
        <Secao key={periodo} titulo={`Período ${periodo}`}>
          {itens.map((h) => (
            <Cartao key={h.codigo}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <Txt v="subtitulo" style={{ flex: 1 }}>
                  {h.titulo}
                </Txt>
                <Selo
                  rotulo={/aprov/i.test(h.situacao) ? 'Aprovado' : /reprov/i.test(h.situacao) ? 'Reprovado' : h.situacao || '—'}
                  tom={/aprov/i.test(h.situacao) ? 'sucesso' : /reprov/i.test(h.situacao) ? 'perigo' : 'neutro'}
                />
              </View>
              <Txt v="legenda" cor="textSecondary">
                Média {h.mediaFinal !== null ? fmt(h.mediaFinal) : '—'} · {h.faltas ?? '—'} faltas
              </Txt>
            </Cartao>
          ))}
        </Secao>
      ))}

      <Txt v="legenda" cor="textMuted">
        Os pontos de atenção seguem regras simples (média abaixo de 6, muitas faltas).
      </Txt>
    </Tela>
  );
}

/** Valores típicos do conjunto usado no treino, para os campos que o app ainda não coleta. */
const PADRAO = { frequencia: '93', redes: '2,8', idade: '23' };

function numero(texto: string): number | null {
  const n = Number(texto.replace(',', '.'));
  return texto.trim() !== '' && Number.isFinite(n) ? n : null;
}

function EstimativaGpa({ medias }: { medias: { sono: number; estudo: number; estresse: number } | null }) {
  const [estudo, setEstudo] = useState(medias ? fmt(medias.estudo).replace('.', ',') : '2,5');
  const [sono, setSono] = useState(medias ? fmt(medias.sono).replace('.', ',') : '7');
  const [estresse, setEstresse] = useState(medias ? fmt(medias.estresse).replace('.', ',') : '3');
  const [frequencia, setFrequencia] = useState(PADRAO.frequencia);
  const [redes, setRedes] = useState(PADRAO.redes);
  const [idade, setIdade] = useState(PADRAO.idade);

  const resultado = useMemo(() => {
    const v = { estudo: numero(estudo), sono: numero(sono), estresse: numero(estresse), frequencia: numero(frequencia), redes: numero(redes), idade: numero(idade) };
    const faixas =
      v.estudo !== null && v.estudo >= 0 && v.estudo <= 16 &&
      v.sono !== null && v.sono >= 0 && v.sono <= 24 &&
      v.estresse !== null && v.estresse >= 1 && v.estresse <= 5 &&
      v.frequencia !== null && v.frequencia >= 0 && v.frequencia <= 100 &&
      v.redes !== null && v.redes >= 0 && v.redes <= 24 &&
      v.idade !== null && v.idade >= 10 && v.idade <= 90;
    if (!faixas) return null;
    return preverGpa({
      estudoHoras: v.estudo!,
      sonoHoras: v.sono!,
      estresse: estresseDoDiario(v.estresse!),
      frequencia: v.frequencia!,
      redesHoras: v.redes!,
      idade: v.idade!,
    });
  }, [estudo, sono, estresse, frequencia, redes, idade]);

  return (
    <Secao titulo="Estimativa de GPA">
      <Cartao style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Icone nome="analytics-outline" tamanho={22} cor="primary" />
          <View style={{ flex: 1 }}>
            <Txt v="subtitulo">{resultado ? `GPA estimado: ${fmt(resultado.gpa)}` : 'Preencha os campos'}</Txt>
            {resultado ? (
              <Txt v="legenda" cor="textSecondary">
                {resultado.perfil}
              </Txt>
            ) : null}
          </View>
          <Selo rotulo="Experimental" tom="alerta" />
        </View>
        <Campo rotulo="Horas de estudo por dia" value={estudo} onChangeText={setEstudo} keyboardType="decimal-pad" />
        <Campo rotulo="Horas de sono por noite" value={sono} onChangeText={setSono} keyboardType="decimal-pad" />
        <Campo rotulo="Estresse (1 a 5)" value={estresse} onChangeText={setEstresse} keyboardType="decimal-pad" />
        <Campo rotulo="Frequência nas aulas (%)" value={frequencia} onChangeText={setFrequencia} keyboardType="decimal-pad" />
        <Campo rotulo="Horas por dia em redes sociais" value={redes} onChangeText={setRedes} keyboardType="decimal-pad" />
        <Campo rotulo="Idade" value={idade} onChangeText={setIdade} keyboardType="number-pad" />
        <Txt v="legenda" cor="textMuted">
          Estimativa feita no aparelho, sem enviar dados. O modelo foi treinado com 10 mil estudantes de vários países, não com
          dados da UFRPE, e erra em média cerca de 0,15 ponto (escala 0 a 4). Não use para decisões sobre o seu curso.
        </Txt>
      </Cartao>
    </Secao>
  );
}

function Metrica({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Txt v="rotulo" cor="textMuted">
        {rotulo}
      </Txt>
      <Txt style={{ fontSize: 20, fontWeight: '800' }}>{valor}</Txt>
    </View>
  );
}
