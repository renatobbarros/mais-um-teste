# Alinhamento do app com o artigo

Base: *ASTRA – Ambiente de Suporte à Trajetória e Rotina Acadêmica* (arquivo `Artigo - ASTRA.pdf`).

## O que o artigo promete e como o app responde

| Promessa do artigo | Onde está no app | Situação |
| --- | --- | --- |
| Centralizar informações de disciplinas, prazos, avaliações e comunicados em um só lugar | Abas **Início**, **Agenda** e **Avisos** | Feito |
| Reunir fontes dispersas: SIGAA, Classroom, WhatsApp, Telegram, Discord | Aba **Fontes** | SIGAA via ponte (`server/`); WhatsApp, Telegram, Classroom, Discord e e-mail por mensagens coladas |
| Converter mensagens soltas em prazos, comunicados e materiais | `src/lib/parse.ts` classifica cada mensagem e extrai data e hora | Feito (regras) |
| Reduzir ruído e repetição entre canais | `agruparRepetidos` em `src/lib/ml.ts`: mensagens parecidas viram um aviso só ("Também enviado em…") | Feito |
| **PP1:** agrupar mensagens por assunto sem rótulo prévio (TF-IDF + K-Means) | Aba **Assuntos**; `src/lib/ml.ts` | Feito, roda no aparelho |
| Escolher k pelo Coeficiente de Silhueta | `agruparAvisos` testa k de 2 a 6 e fica com a maior silhueta; o valor aparece na tela | Feito |
| Aprendizado ativo, com o estudante corrigindo os grupos (*human-in-the-loop*) | Botão "Assunto errado?" em cada mensagem; a correção é guardada e reaplicada | Feito: a correção move a mensagem e puxa as muito parecidas junto; o modelo em si não é retreinado |
| **PP2:** usar dados acadêmicos para apontar necessidades de aprendizagem | Tela **Desempenho**: IRA/MC, histórico, pontos de atenção, média de sono/estudo/estresse | Parcial |
| Registro da rotina (sono, estudo, estresse) que alimenta os modelos | Tela **Diário** | Feito |
| Autorregulação: planejar, monitorar e controlar atividades | Agenda com conclusão de tarefas, tarefas manuais e diário | Feito |

## O que ainda falta

1. **Modelos preditivos de desempenho (Seção 2.2.3).** Regressão Linear, Random Forest e Gradient Boosting são treinados no repositório de análise de dados e **não rodam dentro do app**. Hoje o app usa regras simples e transparentes (média abaixo de 6, muitas faltas, pouco sono). Para fechar essa lacuna é preciso publicar o modelo treinado (por exemplo, como API) e chamá-lo a partir da tela Desempenho.
2. **Retreino com o feedback.** As correções do estudante reorganizam os grupos no aparelho, mas não são enviadas para treinar um modelo central.
3. **Classroom, WhatsApp, Telegram e Discord automáticos.** Essas plataformas não oferecem acesso simples para um app de terceiros. Por isso a entrada é manual (colar mensagens ou a exportação de conversa do WhatsApp).
4. **SIGAA real validado ponta a ponta.** A ponte foi testada só em modo demonstração. O login real depende de usuário e senha do SIGAA e não foi exercitado nesta etapa.
5. **Notificações do sistema.** O app mostra avisos dentro dele, mas não dispara lembretes no celular. Não implementei por não poder testar em aparelho real.
6. **Persistência dos dados de rotina na nuvem.** Avisos, diário e correções ficam salvos só no aparelho. O Firestore guarda apenas o perfil.

## Pontos para alinhar no texto do artigo

- O artigo chama a Seção 6 de **"Aplicativo Flutter"**, mas o app é feito em **React Native com Expo**. Uma das duas coisas precisa ser corrigida.
- O artigo cita Telegram e e-mail como fontes. Os dois entram no app por mensagens coladas.
- O artigo só descreve as seções 1 a 3 e a 2.2. As seções de método (KDD), análise exploratória e resultados ainda são texto de modelo do professor, e o app não as substitui.

## Decisões de arquitetura

- **Ponte do SIGAA (`server/`).** A `sigaa-api-UFRPE` é uma biblioteca para Node que faz web scraping. Ela não roda dentro de um app de celular, por isso um pequeno servidor faz o login, lê os dados e devolve JSON ao app. A senha é usada só durante a requisição e não é gravada.
- **IA no aparelho.** TF-IDF, K-Means e Silhueta foram escritos em TypeScript (`src/lib/ml.ts`). As mensagens dos estudantes não saem do celular.

## Qualidade

- `npm test`: 32 testes automáticos da lógica (datas, leitura de mensagens, prazos, agrupamento, correções, desempenho).
- `npx tsc --noEmit` e `npx eslint src`: sem erros nem avisos.
- Fluxos testados no navegador em modo demonstração: login e cadastro (validações), agenda (criar, concluir, filtrar), avisos, assuntos (corrigir grupo), fontes (importar mensagens), diário e desempenho.
- **Não testado:** login real no SIGAA, login com Google e gravação do perfil no Firebase (exigem contas reais), e execução em celular físico.
