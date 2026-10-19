# Parte de Lucas Menezes

Material da parte de **Lucas Menezes** para atualizar o repositório do grupo (`BrunoFellype/dsi`).
**Não faça merge desta branch**: ela é só a fonte dos arquivos. Os commits são feitos por você,
no `dsi`, com a sua conta do GitHub.

Você faz **1 commit** no **Dia 1** e termina com
**7** na `main` do `dsi`.

## Plano do grupo

| Ordem | Pessoa | Dia | Commits hoje no dsi | Commits a fazer | Total |
|---|---|---|---|---|---|
| 1 | Lucas Menezes | Dia 1 | 6 | 1 | 7 |
| 2 | Felipe Neves | Dia 1 | 3 | 3 | 6 |
| 3 | Renato Barros | Dia 2 | 2 | 6 | 8 |
| 4 | Bruno Fellype | Dia 2 | 5 | 1 | 6 |
| 5 | Heitor Quental | Dia 3 | 3 | 4 | 7 |

Ordem dos Pull Requests (merge): Lucas Menezes → Felipe Neves → Renato Barros → Bruno Fellype → Heitor Quental. As partes mexem em arquivos diferentes, então não há
conflito; o app só compila depois que as cinco estiverem no `dsi`.

## Seu cronograma (Dia 1)

| Commit | Quando | Mensagem |
|---|---|---|
| 1 | logo no início | feat: atualiza configuração, documentação e telas de diário e desempenho |

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
git fetch renato parte/lucas-menezes
git checkout -b lucas-menezes/atualizacao
```

Se você já tem o `dsi` baixado, pule o `git clone` e entre na pasta. Se aparecer
`remote renato already exists`, ignore e siga.

## 2. Fazer os commits

Rode um bloco por vez, respeitando o intervalo do cronograma. Cada bloco é um commit:

```bash
# Commit 1 de 1
git checkout renato/parte/lucas-menezes -- "package.json" "package-lock.json" "tsconfig.json" "eslint.config.js" ".gitignore" "README.md" "docs/ALINHAMENTO-ARTIGO.md" ".maestro" "src/app/diario.tsx" "src/app/desempenho.tsx"
git rm -q "src/app/teladiario.tsx"
git commit -m "feat: atualiza configuração, documentação e telas de diário e desempenho"
```

Para conferir: `git log --oneline -1` deve mostrar o seu commit.

## 3. Enviar e abrir o Pull Request

```bash
git push -u origin lucas-menezes/atualizacao
```

No GitHub do `dsi`, abra o Pull Request de `lucas-menezes/atualizacao` para `main` e faça o merge com
**Create a merge commit** (não use *Squash* nem *Rebase*, senão os commits não aparecem separados).
Faça o merge na sua vez, seguindo a ordem do grupo.
