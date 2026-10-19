# Parte de Renato Barros

Material da parte de **Renato Barros** para atualizar o repositório do grupo (`BrunoFellype/dsi`).
**Não faça merge desta branch**: ela é só a fonte dos arquivos. Os commits são feitos por você,
no `dsi`, com a sua conta do GitHub.

Você faz **6 commits** **hoje (seg, 19/10)** e termina com
**8** na `main` do `dsi`. **Prazo: tudo publicado até amanhã (ter, 20/10).**

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
| 1 | quando começar | feat(sigaa): biblioteca sigaa-api para ler o SIGAA |
| 2 | espere 40 min depois do anterior | feat(sigaa): substitutos dos módulos do Node para rodar no celular |
| 3 | espere 1 h depois do anterior | feat(sigaa): leitura do SIGAA no celular e pela ponte |
| 4 | espere 45 min depois do anterior | feat(server): ponte ASTRA-SIGAA para o navegador |
| 5 | espere 30 min depois do anterior | chore: Docker e Render para hospedar a ponte |
| 6 | espere 1 h depois do anterior | feat(desempenho): perfil e frequência a partir do SIGAA, com testes |

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
git fetch renato parte/renato-barros
git checkout -b renato-barros/atualizacao
```

Se você já tem o `dsi` baixado, pule o `git clone` e entre na pasta. Se aparecer
`remote renato already exists`, ignore e siga.

## 2. Fazer os commits

Rode um bloco por vez, respeitando o intervalo do cronograma. Cada bloco é um commit:

```bash
# Commit 1 de 6
git checkout renato/parte/renato-barros -- "vendor/sigaa-api"
git commit -m "feat(sigaa): biblioteca sigaa-api para ler o SIGAA"

# Commit 2 de 6 (espere 40 min depois do anterior)
git checkout renato/parte/renato-barros -- "metro.config.js" "src/sigaa-shims"
git commit -m "feat(sigaa): substitutos dos módulos do Node para rodar no celular"

# Commit 3 de 6 (espere 1 h depois do anterior)
git checkout renato/parte/renato-barros -- "src/lib/sigaaNativo.ts" "src/lib/sigaaNativo.web.ts" "src/lib/errosSigaa.ts" "src/lib/api.ts"
git commit -m "feat(sigaa): leitura do SIGAA no celular e pela ponte"

# Commit 4 de 6 (espere 45 min depois do anterior)
git checkout renato/parte/renato-barros -- "server"
git commit -m "feat(server): ponte ASTRA-SIGAA para o navegador"

# Commit 5 de 6 (espere 30 min depois do anterior)
git checkout renato/parte/renato-barros -- "Dockerfile.ponte" ".dockerignore" "render.yaml"
git commit -m "chore: Docker e Render para hospedar a ponte"

# Commit 6 de 6 (espere 1 h depois do anterior)
git checkout renato/parte/renato-barros -- "src/lib/perfilDoSigaa.ts" "src/lib/frequencia.ts" "src/lib/__tests__/urlSigaa.test.ts" "src/lib/__tests__/frequencia.test.ts"
git commit -m "feat(desempenho): perfil e frequência a partir do SIGAA, com testes"
```

Para conferir: `git log --oneline -6` deve mostrar os seus 6 commits.

## 3. Enviar e abrir o Pull Request

```bash
git push -u origin renato-barros/atualizacao
```

No GitHub do `dsi`, abra o Pull Request de `renato-barros/atualizacao` para `main` e faça o merge com
**Create a merge commit** (não use *Squash* nem *Rebase*, senão os commits não aparecem separados).
