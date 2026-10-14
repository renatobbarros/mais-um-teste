import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { Cabecalho, Cartao, Chip, Icone, Selo, SeloFonte, Tela, Txt, Vazio, FONTES, type IconName } from '@/components/ui';
import { haQuanto, rotuloPrazo } from '@/lib/datas';
import { useAstra } from '@/lib/store';
import type { TipoAviso } from '@/lib/types';

type Filtro = 'todos' | TipoAviso;

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'prazo', rotulo: 'Prazos' },
  { id: 'comunicado', rotulo: 'Avisos' },
  { id: 'material', rotulo: 'Materiais' },
];

const ICONE_TIPO: Record<TipoAviso, IconName> = {
  prazo: 'alarm-outline',
  comunicado: 'megaphone-outline',
  material: 'document-text-outline',
};

export default function Avisos() {
  const { avisos, repetidos } = useAstra();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Mensagens quase iguais de canais diferentes viram um único aviso
  const visiveis = useMemo(() => {
    const escondidos = new Set<string>();
    Object.values(repetidos).forEach((g) => g.slice(1).forEach((a) => escondidos.add(a.id)));
    return avisos.filter((a) => !escondidos.has(a.id) && (filtro === 'todos' || a.tipo === filtro));
  }, [avisos, repetidos, filtro]);

  return (
    <Tela>
      <Cabecalho titulo="Avisos" subtitulo="Tudo que chegou, sem repetição." />

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {FILTROS.map((f) => (
          <Chip key={f.id} rotulo={f.rotulo} ativo={filtro === f.id} onPress={() => setFiltro(f.id)} />
        ))}
      </View>

      {visiveis.length === 0 ? (
        <Cartao>
          <Vazio
            icone="notifications-off-outline"
            titulo="Nenhum aviso"
            texto="Importe mensagens do WhatsApp, Telegram ou Classroom na aba Fontes."
            acao="Ir para Fontes"
            onAcao={() => router.push('/fontes')}
          />
        </Cartao>
      ) : (
        visiveis.map((a) => {
          const outros = (repetidos[a.id] ?? []).slice(1).map((x) => FONTES[x.fonte].nome);
          return (
            <Cartao key={a.id}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Icone nome={ICONE_TIPO[a.tipo]} tamanho={22} cor="primary" />
                <View style={{ flex: 1, gap: 6 }}>
                  <Txt>{a.texto}</Txt>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                    <SeloFonte fonte={a.fonte} />
                    <Txt v="legenda" cor="textMuted">
                      {haQuanto(a.recebidoEm)}
                    </Txt>
                    {a.prazo ? <Selo rotulo={rotuloPrazo(new Date(a.prazo))} tom="alerta" /> : null}
                  </View>
                  {a.disciplina ? (
                    <Txt v="legenda" cor="textSecondary">
                      {a.disciplina}
                    </Txt>
                  ) : null}
                  {outros.length > 0 ? (
                    <Txt v="legenda" cor="textMuted">
                      Também enviado em {outros.join(', ')}
                    </Txt>
                  ) : null}
                </View>
              </View>
            </Cartao>
          );
        })
      )}
    </Tela>
  );
}
