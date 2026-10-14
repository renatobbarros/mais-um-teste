# 🚀 ASTRA - Ambiente de Suporte à Trajetória e Rotina Acadêmica
<div align='center'>

[![React Native](https://skillicons.dev/icons?i=react&theme=light)](https://reactnative.dev/)
[![TypeScript](https://skillicons.dev/icons?i=ts&theme=light)](https://www.typescriptlang.org/)
[![Firebase](https://skillicons.dev/icons?i=firebase&theme=light)](https://firebase.google.com/)

</div>

## 📖 Sobre o projeto

O **ASTRA (Ambiente de Suporte à Trajetória e Rotina Acadêmica)** é uma aplicação mobile voltada à centralização e organização das informações acadêmicas de estudantes universitários.

A proposta é reunir, em um único ambiente, informações como conteúdos de disciplinas, atividades, materiais, avaliações, prazos, eventos e comunicados, que podem estar distribuídos entre diferentes plataformas e canais de comunicação.

O projeto é desenvolvido no contexto acadêmico e contempla, além da aplicação mobile, uma etapa de análise de dados e a elaboração de documentação científica.

A etapa de análise de dados foi desenvolvida em um repositório separado.


## 🎯 Objetivo

Facilitar o acompanhamento da rotina acadêmica por meio da centralização e organização das informações relacionadas às disciplinas e às demandas acadêmicas dos estudantes.

## ✨ Funcionalidades

- 🔐 Cadastro, login com e-mail e senha e login com Google;
- 🏠 **Início**: próximos prazos e atalhos;
- 📅 **Agenda**: prazos e avaliações de todas as fontes, com conclusão de tarefas e tarefas manuais;
- 🔔 **Avisos**: mensagens sem repetição, com filtro por prazos, avisos e materiais;
- ✨ **Assuntos**: agrupamento automático das mensagens por tema (TF-IDF + K-Means, k pela silhueta), com correção feita pelo estudante;
- 🔗 **Fontes**: conexão com o SIGAA da UFRPE (direto no celular) e importação de mensagens do WhatsApp, Telegram, Classroom e Discord;
- 📖 **Diário** de sono, estudo e estresse, e tela de **Desempenho** com IRA, histórico, pontos de atenção e médias da rotina;
- 🔔 Lembretes de prazo no celular;
- 🌗 Tema claro e escuro automático.

O que ainda falta em relação ao artigo está em [docs/ALINHAMENTO-ARTIGO.md](docs/ALINHAMENTO-ARTIGO.md).

## 🛠️ Tecnologias

- **React Native** — desenvolvimento da aplicação mobile;
- **TypeScript** — linguagem utilizada no desenvolvimento;
- **Expo** — ferramentas para desenvolvimento e build da aplicação;
- **Firebase Authentication** — autenticação dos usuários;
- **Cloud Firestore** — armazenamento dos dados da aplicação;
- **Google Sign-In** — autenticação utilizando contas Google.

## ⚙️ Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- **Node.js**
- **npm**
- **Andorid SDK** ( *Caso deseje executar no Android* )
- **ADB** ( *Caso queira executar em um dispositivo físico* )

Para desenvolvimento utilizando Expo Go:

- Aplicativo **Expo Go** instalado no dispositivo

Para funcionalidades que utilizam código nativo, como o Google Sign-In:

- **Development Build do ASTRA**

## 🚀 Como executar

1. Clone o repositório
```bash
git clone https://github.com/renatobbarros/mais-um-teste.git
cd mais-um-teste
```
2. Instale as dependências
```bash
npm install
```
3. Inicie o projeto
```bash
npx expo start
```

Para ver o app sem conta, use **Explorar com dados de exemplo** na tela de login.

### 🏛️ SIGAA

- **No celular (Android e iOS):** a biblioteca [sigaa-api-UFRPE](https://github.com/renatobbarros/sigaa-api-UFRPE) roda **dentro do app**, sem servidor. A senha vai direto do celular para o SIGAA e não fica salva. Basta informar usuário e senha na aba **Fontes**.
- **No navegador:** o SIGAA bloqueia chamadas diretas (CORS), então é preciso a **ponte**, um servidor pequeno na pasta `server/`.

```bash
cd server
npm install
npm start          # SIGAA real
npm run mock       # dados de demonstração, sem usuário nem senha
npm test           # testa a camada HTTP do celular contra um SIGAA falso
```

Na aba **Fontes > Avançado** dá para trocar entre "Direto no celular" e "Pela ponte". Endereço da ponte:

| Onde o app roda | Endereço |
| --- | --- |
| Navegador e iOS Simulator | `http://localhost:3333` (padrão) |
| Emulador Android | `http://10.0.2.2:3333` (padrão) |
| Celular físico | IP do computador, ex.: `http://192.168.0.10:3333` |

Em produção, coloque a ponte atrás de HTTPS, já que ela recebe a senha do SIGAA.

> **Como funciona no celular:** a pasta `vendor/sigaa-api` é uma cópia compilada da biblioteca. O arquivo `dist/session/sigaa-http.native.js` troca a camada HTTP do Node por `expo/fetch`, e o `metro.config.js` aponta os módulos do Node que faltam para arquivos vazios. Para atualizar a biblioteca, rode `npm run build` na `sigaa-api-UFRPE`, copie a pasta `dist` para `vendor/sigaa-api` e rode `npm install` de novo em `server/`.

### 🔔 Lembretes

Em **Perfil**, o estudante liga os lembretes de prazo. O app avisa 1 dia e 2 horas antes de cada atividade pendente, com notificações locais (sem servidor). Funciona só no celular.

### 📱 Android
Para executar em um dispositivo Andorid com o ambiente nativo configurado:
```bash
npx expo run:andorid --device
```
> Funcionalidades que exigem código nativo podem necessitar de uma Development Build

## 🔥 Configuração do Firebase
O projeto utiliza Firebase para autenticação e armazenamento de dados.

Os arquivos de configuração que contenham informações específicas do ambiente não devem ser versionados no repositório.

Consulte a configuração de desenvolvimento do projeto antes de executar funcionalidades que dependam do Firebase.

