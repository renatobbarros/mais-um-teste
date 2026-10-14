import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';

import { Botao, Cabecalho, Campo, Cartao, Chip, Mensagem, Tela, Txt } from '@/components/ui';
import { auth, db } from '@/services/firebase';

const METODOS = ['Digital', 'Papel', 'Híbrido'] as const;
const CANAIS = ['SIGAA', 'Google Classroom', 'WhatsApp', 'Telegram', 'Discord'];

export default function Onboarding() {
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [metaHoras, setMetaHoras] = useState('');
  const [metodo, setMetodo] = useState<(typeof METODOS)[number]>('Digital');
  const [canais, setCanais] = useState<string[]>(['SIGAA']);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const alternarCanal = (c: string) =>
    setCanais((atual) => (atual.includes(c) ? atual.filter((x) => x !== c) : [...atual, c]));

  async function salvar() {
    if (!curso.trim()) return setErro('Informe seu curso.');
    if (!periodo.trim()) return setErro('Informe o período atual (ex.: 3º).');
    const meta = Number(metaHoras.replace(',', '.'));
    if (!metaHoras.trim() || isNaN(meta) || meta <= 0) return setErro('Informe uma meta diária de estudo em horas.');
    if (canais.length === 0) return setErro('Escolha pelo menos uma fonte.');

    const usuario = auth.currentUser;
    if (!usuario) return setErro('Não identificamos sua conta. Entre novamente.');

    setErro('');
    setCarregando(true);
    try {
      const uid = usuario.uid;
      const lote = writeBatch(db);
      lote.set(
        doc(db, 'estudantes', uid),
        {
          id: uid,
          nome: usuario.displayName ?? 'Estudante',
          email: usuario.email ?? '',
          dataCadastro: serverTimestamp(),
        },
        { merge: true }
      );
      lote.set(
        doc(db, 'perfisAprendizagem', uid),
        {
          estudanteId: uid,
          curso: curso.trim(),
          periodo: periodo.trim(),
          metaHoras: meta,
          metodoAnotacao: metodo,
          canais: [...canais],
          dataIdentificacao: serverTimestamp(),
        },
        { merge: true }
      );
      await lote.commit();
      router.replace('/inicio');
    } catch {
      setErro('Não foi possível salvar seu perfil. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Tela>
      <Cabecalho titulo="Vamos começar" subtitulo="Conte um pouco sobre sua rotina." />

      <Cartao style={{ gap: 16 }}>
        <Campo rotulo="Curso" value={curso} onChangeText={setCurso} placeholder="Ex.: Sistemas de Informação" />
        <Campo rotulo="Período atual" value={periodo} onChangeText={setPeriodo} placeholder="Ex.: 3º" />
        <Campo
          rotulo="Meta diária de estudo (horas)"
          value={metaHoras}
          onChangeText={setMetaHoras}
          keyboardType="decimal-pad"
          placeholder="Ex.: 3"
        />

        <View style={{ gap: 8 }}>
          <Txt v="legenda" cor="textSecondary" style={{ fontWeight: '700' }}>
            Como você anota?
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {METODOS.map((m) => (
              <Chip key={m} rotulo={m} ativo={metodo === m} onPress={() => setMetodo(m)} />
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Txt v="legenda" cor="textSecondary" style={{ fontWeight: '700' }}>
            Onde chegam suas informações?
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {CANAIS.map((c) => (
              <Chip key={c} rotulo={c} ativo={canais.includes(c)} onPress={() => alternarCanal(c)} />
            ))}
          </View>
        </View>

        {erro ? <Mensagem tom="erro" texto={erro} /> : null}
        <Botao titulo="Concluir" onPress={salvar} carregando={carregando} />
      </Cartao>
    </Tela>
  );
}
