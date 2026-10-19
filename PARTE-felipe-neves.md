# Parte de Felipe Neves

Material da parte de **Felipe Neves** para atualizar o repositório do grupo (`BrunoFellype/dsi`).
**Não faça merge desta branch**: ela é só a fonte dos arquivos. Os commits são feitos por você,
no `dsi`, com a sua conta do GitHub.

Você faz **3 commits** **hoje (seg, 19/10)** e termina com
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

## Seu cronograma (hoje (seg, 19/10))

| Commit | Quando | Mensagem |
|---|---|---|
| 1 | quando começar | feat(lib): tipos, datas e leitura de mensagens |
| 2 | espere 50 min depois do anterior | feat(lib): agrupamento por assunto, análise da rotina e lembretes |
| 3 | espere 1 h depois do anterior | feat(lib): estado do app com CRUDs, dados de demonstração e testes |

Merge do seu Pull Request: hoje à noite, na sua vez da ordem.

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
git fetch renato parte/felipe-neves
git checkout -b felipe-neves/atualizacao
```

Se você já tem o `dsi` baixado, pule o `git clone` e entre na pasta. Se aparecer
`remote renato already exists`, ignore e siga.

## 2. Fazer os commits

Rode um bloco por vez, respeitando o intervalo do cronograma. Cada bloco é um commit:

```bash
# Commit 1 de 3
git checkout renato/parte/felipe-neves -- "src/lib/types.ts" "src/lib/datas.ts" "src/lib/parse.ts"
git commit -m "feat(lib): tipos, datas e leitura de mensagens"

# Commit 2 de 3 (espere 50 min depois do anterior)
git checkout renato/parte/felipe-neves -- "src/lib/ml.ts" "src/lib/exportacao.ts" "src/lib/analise.ts" "src/lib/horarios.ts" "src/lib/opcoes.ts" "src/lib/lembretesLogica.ts" "src/lib/lembretes.ts" "src/lib/lembretes.web.ts" "src/lib/sync.ts"
git commit -m "feat(lib): agrupamento por assunto, análise da rotina e lembretes"

# Commit 3 de 3 (espere 1 h depois do anterior)
git checkout renato/parte/felipe-neves -- "src/lib/store.tsx" "src/lib/crud.ts" "src/lib/demo.ts" "src/lib/__tests__/lib.test.ts" "src/lib/__tests__/melhorias.test.ts" "src/lib/__tests__/crud.test.ts" "src/lib/__tests__/facilidades.test.ts"
git commit -m "feat(lib): estado do app com CRUDs, dados de demonstração e testes"
```

Para conferir: `git log --oneline -3` deve mostrar os seus 3 commits.

## 3. Enviar e abrir o Pull Request

```bash
git push -u origin felipe-neves/atualizacao
```

No GitHub do `dsi`, abra o Pull Request de `felipe-neves/atualizacao` para `main` e faça o merge com
**Create a merge commit** (não use *Squash* nem *Rebase*, senão os commits não aparecem separados).
