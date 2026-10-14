import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { signOut, updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';

import { Botao, Cabecalho, Campo, Cartao, Mensagem, Selo, Tela, Txt } from '@/components/ui';
import { useAstra } from '@/lib/store';
import { auth, db } from '@/services/firebase';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Perfil() {
  const { sessao, sair } = useAstra();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(sessao === 'logado');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    const usuario = auth.currentUser;
    if (sessao !== 'logado' || !usuario) return;
    setNome(usuario.displayName ?? '');
    setEmail(usuario.email ?? '');
    getDoc(doc(db, 'perfisAprendizagem', usuario.uid))
      .then((snap) => {
        if (snap.exists()) {
          setCurso(snap.data().curso ?? '');
          setPeriodo(snap.data().periodo ?? '');
        }
      })
      .catch(() => setErro('Não foi possível carregar o perfil.'))
      .finally(() => setCarregando(false));
  }, [sessao]);

  async function salvar() {
    const usuario = auth.currentUser;
    if (!usuario) return router.replace('/login');
    const emailNovo = email.trim().toLowerCase();
    if (!nome.trim() || !emailNovo || !curso.trim() || !periodo.trim()) return setErro('Preencha todos os campos.');
    if (!EMAIL_VALIDO.test(emailNovo)) return setErro('Informe um e-mail válido.');

    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (nome.trim() !== (usuario.displayName ?? '')) await updateProfile(usuario, { displayName: nome.trim() });
      if (emailNovo !== (usuario.email ?? '').toLowerCase()) await verifyBeforeUpdateEmail(usuario, emailNovo);

      const lote = writeBatch(db);
      lote.update(doc(db, 'estudantes', usuario.uid), { nome: nome.trim(), email: emailNovo });
      lote.update(doc(db, 'perfisAprendizagem', usuario.uid), { curso: curso.trim(), periodo: periodo.trim() });
      await lote.commit();

      setEditando(false);
      setSucesso('Perfil atualizado.');
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') setErro('Por segurança, entre de novo antes de trocar o e-mail.');
      else if (e?.code === 'auth/email-already-in-use') setErro('Esse e-mail já está em uso por outra conta.');
      else setErro('Não foi possível salvar. Verifique sua conexão.');
    } finally {
      setSalvando(false);
    }
  }

  async function sairDaConta() {
    await signOut(auth).catch(() => {});
    sair();
    router.replace('/login');
  }

  if (sessao === 'demo') {
    return (
      <Tela>
        <Cabecalho titulo="Perfil" voltar={() => router.back()} />
        <Cartao>
          <Selo rotulo="Modo demonstração" tom="primario" />
          <Txt cor="textSecondary">Você está vendo dados de exemplo. Crie uma conta para guardar suas informações.</Txt>
        </Cartao>
        <Botao titulo="Sair da demonstração" variante="secundario" onPress={sairDaConta} />
      </Tela>
    );
  }

  return (
    <Tela>
      <Cabecalho
        titulo="Perfil"
        voltar={() => router.back()}
        acao={
          !editando && !carregando ? (
            <Botao titulo="Editar" icone="create-outline" variante="secundario" onPress={() => setEditando(true)} />
          ) : undefined
        }
      />

      <Cartao style={{ gap: 16 }}>
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} editable={editando && !salvando} autoCapitalize="words" />
        <Campo rotulo="E-mail" value={email} onChangeText={setEmail} editable={editando && !salvando} keyboardType="email-address" autoCapitalize="none" />
        <Campo rotulo="Curso" value={curso} onChangeText={setCurso} editable={editando && !salvando} />
        <Campo rotulo="Período" value={periodo} onChangeText={setPeriodo} editable={editando && !salvando} />
        {erro ? <Mensagem tom="erro" texto={erro} /> : null}
        {sucesso ? <Mensagem tom="sucesso" texto={sucesso} /> : null}
        {editando ? (
          <View style={{ gap: 8 }}>
            <Botao titulo="Salvar" onPress={salvar} carregando={salvando} />
            <Botao titulo="Cancelar" variante="texto" onPress={() => setEditando(false)} desabilitado={salvando} />
          </View>
        ) : null}
      </Cartao>

      <Botao titulo="Sair da conta" icone="log-out-outline" variante="perigo" onPress={sairDaConta} />
    </Tela>
  );
}
