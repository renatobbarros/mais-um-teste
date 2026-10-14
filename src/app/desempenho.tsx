import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Botao, Cabecalho, Cartao, Icone, Secao, Selo, Tela, Txt, Vazio } from '@/components/ui';
import { alertasRotina, fmt, mediasRotina, pontosDeAtencao } from '@/lib/analise';
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
        Os pontos de atenção seguem regras simples (média abaixo de 6, muitas faltas). Os modelos de previsão do artigo ainda
        não rodam no app.
      </Txt>
    </Tela>
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
