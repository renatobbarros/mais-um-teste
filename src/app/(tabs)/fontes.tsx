import React, { useState } from 'react';
import { View } from 'react-native';

import {
  Botao,
  Cabecalho,
  Campo,
  Cartao,
  Chip,
  FONTES,
  Icone,
  Mensagem,
  Secao,
  Selo,
  Tela,
  Txt,
} from '@/components/ui';
import { haQuanto } from '@/lib/datas';
import { useAstra } from '@/lib/store';
import type { FonteId } from '@/lib/types';

const FONTES_MENSAGEM: FonteId[] = ['whatsapp', 'telegram', 'classroom', 'discord'];

export default function Fontes() {
  const { sessao, sigaa, sigaaEm, conectarSigaa, desconectarSigaa, avisos, importarMensagens, removerAvisosDaFonte, ponte, definirPonte } =
    useAstra();

  return (
    <Tela>
      <Cabecalho titulo="Fontes" subtitulo="De onde vêm as informações do ASTRA." />

      <Secao titulo="SIGAA">
        <CartaoSigaa
          demo={sessao === 'demo'}
          conectado={!!sigaa}
          sigaaEm={sigaaEm}
          curso={sigaa?.aluno.curso}
          ponte={ponte}
          onPonte={definirPonte}
          onConectar={conectarSigaa}
          onDesconectar={desconectarSigaa}
        />
      </Secao>

      <Secao titulo="Mensagens">
        <CartaoImportar
          contagem={(f) => avisos.filter((a) => a.fonte === f).length}
          onImportar={importarMensagens}
          onLimpar={removerAvisosDaFonte}
        />
      </Secao>
    </Tela>
  );
}

function CartaoSigaa({
  demo,
  conectado,
  sigaaEm,
  curso,
  ponte,
  onPonte,
  onConectar,
  onDesconectar,
}: {
  demo: boolean;
  conectado: boolean;
  sigaaEm: string | null;
  curso?: string;
  ponte: string;
  onPonte: (url: string) => void;
  onConectar: (usuario: string, senha: string) => Promise<void>;
  onDesconectar: () => void;
}) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [avancado, setAvancado] = useState(false);

  async function conectar() {
    setErro('');
    if (!usuario.trim() || !senha) return setErro('Informe usuário e senha do SIGAA.');
    setCarregando(true);
    try {
      await onConectar(usuario.trim(), senha);
      setSenha('');
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Cartao>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Icone nome="school-outline" tamanho={22} cor="primary" />
        <View style={{ flex: 1 }}>
          <Txt v="subtitulo">SIGAA UFRPE</Txt>
          <Txt v="legenda" cor="textSecondary">
            {conectado
              ? `${curso ?? 'Conectado'}${sigaaEm ? ` · atualizado ${haQuanto(sigaaEm)}` : ''}`
              : 'Atividades, notas, faltas e índices'}
          </Txt>
        </View>
        <Selo rotulo={conectado ? (demo ? 'Demonstração' : 'Conectado') : 'Desconectado'} tom={conectado ? 'sucesso' : 'neutro'} />
      </View>

      {demo ? (
        <Txt v="legenda" cor="textSecondary">
          Você está no modo demonstração. Entre com sua conta para conectar o SIGAA de verdade.
        </Txt>
      ) : (
        <>
          <Campo
            rotulo="Usuário do SIGAA"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />
          <Campo
            rotulo="Senha do SIGAA"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            onSubmitEditing={conectar}
          />
          <Txt v="legenda" cor="textMuted">
            A senha é usada só agora para ler seus dados e não fica salva.
          </Txt>
          {erro ? <Mensagem tom="erro" texto={erro} /> : null}
          <Botao
            titulo={conectado ? 'Atualizar dados' : 'Conectar'}
            icone="sync-outline"
            onPress={conectar}
            carregando={carregando}
          />
          {conectado ? <Botao titulo="Desconectar" variante="perigo" onPress={onDesconectar} /> : null}
          <Botao
            titulo={avancado ? 'Esconder avançado' : 'Avançado'}
            variante="texto"
            onPress={() => setAvancado((v) => !v)}
          />
          {avancado ? (
            <Campo
              rotulo="Endereço da ponte do SIGAA"
              value={ponte}
              onChangeText={onPonte}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          ) : null}
        </>
      )}
    </Cartao>
  );
}

function CartaoImportar({
  contagem,
  onImportar,
  onLimpar,
}: {
  contagem: (f: FonteId) => number;
  onImportar: (texto: string, fonte: FonteId) => number;
  onLimpar: (f: FonteId) => void;
}) {
  const [fonte, setFonte] = useState<FonteId>('whatsapp');
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');

  function importar() {
    if (texto.trim().length < 8) return setResultado('Cole pelo menos uma mensagem.');
    const n = onImportar(texto, fonte);
    setResultado(n === 0 ? 'Nenhuma mensagem reconhecida.' : `${n} ${n === 1 ? 'mensagem importada' : 'mensagens importadas'}.`);
    if (n > 0) setTexto('');
  }

  const total = contagem(fonte);

  return (
    <Cartao>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {FONTES_MENSAGEM.map((f) => (
          <Chip key={f} rotulo={FONTES[f].nome} ativo={fonte === f} onPress={() => { setFonte(f); setResultado(''); }} />
        ))}
      </View>
      <Campo
        rotulo={`Mensagens do ${FONTES[fonte].nome}`}
        value={texto}
        onChangeText={setTexto}
        multiline
        placeholder="Cole aqui. A exportação de conversa do WhatsApp também funciona."
      />
      {resultado ? <Mensagem tom={resultado.includes('importad') ? 'sucesso' : 'erro'} texto={resultado} /> : null}
      <Botao titulo="Importar mensagens" icone="download-outline" onPress={importar} />
      {total > 0 ? (
        <Botao titulo={`Remover ${total} de ${FONTES[fonte].nome}`} variante="perigo" onPress={() => onLimpar(fonte)} />
      ) : null}
    </Cartao>
  );
}
