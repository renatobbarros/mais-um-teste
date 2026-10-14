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
- 🔗 **Fontes**: conexão com o SIGAA da UFRPE e importação de mensagens do WhatsApp, Telegram, Classroom e Discord;
- 📖 **Diário** de sono, estudo e estresse, e tela de **Desempenho** com IRA, histórico, pontos de atenção e médias da rotina;
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

### 🏛️ Ponte com o SIGAA

O app não fala direto com o SIGAA. Um pequeno servidor (pasta `server/`) usa a [sigaa-api-UFRPE](https://github.com/renatobbarros/sigaa-api-UFRPE) para ler os dados e entregá-los ao app.

```bash
cd server
npm install
npm start          # SIGAA real
npm run mock       # dados de demonstração, sem usuário nem senha
```

Depois, na aba **Fontes**, informe usuário e senha do SIGAA. A senha é usada só naquele momento e não fica salva.

Endereço da ponte, conforme onde o app roda:

| Onde o app roda | Endereço |
| --- | --- |
| Navegador e iOS Simulator | `http://localhost:3333` (padrão) |
| Emulador Android | `http://10.0.2.2:3333` (padrão) |
| Celular físico | IP do computador, ex.: `http://192.168.0.10:3333`, em **Fontes > Avançado** |

Em produção, coloque a ponte atrás de HTTPS, já que ela recebe a senha do SIGAA.

> A pasta `server/vendor/sigaa-api` é uma cópia compilada da biblioteca. Para atualizá-la, rode `npm run build` na `sigaa-api-UFRPE` e copie a pasta `dist` para lá.

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

