# Parte de Heitor Quental

Material da parte de **Heitor Quental** para atualizar o repositório do grupo (`BrunoFellype/dsi`).
**Não faça merge desta branch**: ela é só a fonte dos arquivos. Os commits são feitos por você,
no `dsi`, com a sua conta do GitHub.

Você faz **4 commits** **amanhã (ter, 20/10)** e termina com
**7** na `main` do `dsi`. **Prazo: tudo publicado até amanhã (ter, 20/10).**

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
| 1 | quando começar | feat(ui): tema, componentes base e lista de opções |
| 2 | espere 1 h depois do anterior | feat(abas): navegação por abas, início e agenda |
| 3 | espere 1 h 30 min depois do anterior | feat(avisos): avisos e assuntos com edição e correção |
| 4 | espere 45 min depois do anterior | feat(fontes): conexão do SIGAA e importação de mensagens |

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
git fetch renato parte/heitor-quental
git checkout -b heitor-quental/atualizacao
```

Se você já tem o `dsi` baixado, pule o `git clone` e entre na pasta. Se aparecer
`remote renato already exists`, ignore e siga.

## 2. Fazer os commits

Rode um bloco por vez, respeitando o intervalo do cronograma. Cada bloco é um commit:

```bash
# Commit 1 de 4
git checkout renato/parte/heitor-quental -- "src/constants/colors.ts" "src/constants/theme.ts" "src/hooks/use-theme.ts" "src/hooks/use-color-scheme.web.ts" "src/components/ui.tsx" "src/components/seletor.tsx" "src/components/confirmarHorarios.tsx"
git rm -q "src/components/Button.tsx" "src/components/Input.tsx" "src/components/GoogleButton.tsx" "src/components/TopHeader.tsx" "src/components/BottomNav.tsx"
git commit -m "feat(ui): tema, componentes base e lista de opções"

# Commit 2 de 4 (espere 1 h depois do anterior)
git checkout renato/parte/heitor-quental -- "src/app/(tabs)/_layout.tsx" "src/app/(tabs)/inicio.tsx" "src/app/(tabs)/agenda.tsx"
git rm -q "src/app/telainicial.tsx" "src/app/telacalendario.tsx" "src/app/telacronogramaia.tsx" "src/constants/academicActivities.ts"
git commit -m "feat(abas): navegação por abas, início e agenda"

# Commit 3 de 4 (espere 1 h 30 min depois do anterior)
git checkout renato/parte/heitor-quental -- "src/app/(tabs)/avisos.tsx" "src/app/(tabs)/assuntos.tsx"
git rm -q "src/app/telanotificacoes.tsx"
git commit -m "feat(avisos): avisos e assuntos com edição e correção"

# Commit 4 de 4 (espere 45 min depois do anterior)
git checkout renato/parte/heitor-quental -- "src/app/(tabs)/fontes.tsx"
git rm -q "src/app/telahubfontes.tsx"
git commit -m "feat(fontes): conexão do SIGAA e importação de mensagens"
```

Para conferir: `git log --oneline -4` deve mostrar os seus 4 commits.

## 3. Enviar e abrir o Pull Request

```bash
git push -u origin heitor-quental/atualizacao
```

No GitHub do `dsi`, abra o Pull Request de `heitor-quental/atualizacao` para `main` e faça o merge com
**Create a merge commit** (não use *Squash* nem *Rebase*, senão os commits não aparecem separados).
