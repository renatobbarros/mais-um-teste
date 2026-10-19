# Parte de Bruno Fellype

Material da parte de **Bruno Fellype** para atualizar o repositório do grupo (`BrunoFellype/dsi`).
**Não faça merge desta branch**: ela é só a fonte dos arquivos. Os commits são feitos por você,
no `dsi`, com a sua conta do GitHub.

Você faz **1 commit** **amanhã (ter, 20/10)** e termina com
**6** na `main` do `dsi`. **Prazo: tudo publicado até amanhã (ter, 20/10).**

## Plano do grupo

| Ordem | Pessoa | Quando | Commits hoje no dsi | Commits a fazer | Total |
|---|---|---|---|---|---|
| 1 | Lucas Menezes | hoje (seg, 19/10) | 6 | 1 | 7 |
| 2 | Felipe Neves | hoje (seg, 19/10) | 3 | 3 | 6 |
| 3 | Renato Barros | hoje (seg, 19/10) | 2 | 6 | 8 |
| 4 | Bruno Fellype | amanhã (ter, 20/10) | 5 | 1 | 6 |
| 5 | Heitor Quental | amanhã (ter, 20/10) | 3 | 4 | 7 |

Ordem dos merges dos Pull Requests: Lucas Menezes → Felipe Neves → Renato Barros → Bruno Fellype → Heitor Quental. As partes mexem em arquivos diferentes, então não há
conflito; o app só compila depois que as cinco estiverem no `dsi`.

## Seu cronograma (amanhã (ter, 20/10))

| Commit | Quando | Mensagem |
|---|---|---|
| 1 | quando começar | feat(auth): Firebase, login, cadastro, onboarding com SIGAA e perfil |

Merge do seu Pull Request: amanhã, na sua vez da ordem (o Heitor faz o último merge).

## 1. Preparar (uma vez)

Confira se o Git usa o e-mail da sua conta do GitHub (senão o commit não conta para você):

```bash
git config --global user.name
git config --global user.email
```

Rode um comando por linha (funciona no Windows, Linux e Mac):

```bash
git clone https://github.com/BrunoFellype/dsi.git
cd dsi
git checkout main
git pull
git remote add renato https://github.com/renatobbarros/mais-um-teste.git
git fetch renato parte/bruno-fellype
git checkout -b bruno-fellype/atualizacao
```

Se você já tem o `dsi` baixado, pule o `git clone` e entre na pasta. Se aparecer
`remote renato already exists`, ignore e siga.

## 2. Fazer os commits

Rode um bloco por vez, respeitando o intervalo do cronograma. Cada bloco é um commit:

```bash
# Commit 1 de 1
git checkout renato/parte/bruno-fellype -- "src/services/firebase.ts" "src/services/googleSignin.ts" "app.config.js" "app.json" "src/app/_layout.tsx" "src/app/index.tsx" "src/app/login.tsx" "src/app/cadastro.tsx" "src/app/onboarding.tsx" "src/app/perfil.tsx" "src/lib/cofre.ts" "src/lib/cofre.web.ts"
git rm -q "src/app/telaperfil.tsx"
git commit -m "feat(auth): Firebase, login, cadastro, onboarding com SIGAA e perfil"
```

Para conferir: `git log --oneline -1` deve mostrar o seu commit.

## 3. Enviar e abrir o Pull Request

```bash
git push -u origin bruno-fellype/atualizacao
```

No GitHub do `dsi`, abra o Pull Request de `bruno-fellype/atualizacao` para `main` e faça o merge com
**Create a merge commit** (não use *Squash* nem *Rebase*, senão os commits não aparecem separados).
