# Desafio Técnico Attus — Gestão de Usuários

Solução desenvolvida para o desafio técnico de **Desenvolvedor Front-End Angular**, com foco em arquitetura escalável, qualidade de código, reatividade, gerenciamento de estado, experiência do usuário e testes automatizados.

A aplicação permite **listar, pesquisar, cadastrar e editar usuários**, consumindo uma API REST mockada com JSON Server.

---

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack tecnológica](#stack-tecnológica)
- [Arquitetura do workspace](#arquitetura-do-workspace)
- [Pré-requisitos](#pré-requisitos)
- [Executando o projeto do zero](#executando-o-projeto-do-zero)
- [Validando a execução](#validando-a-execução)
- [Comandos disponíveis](#comandos-disponíveis)
- [API mockada](#api-mockada)
- [Testes e cobertura](#testes-e-cobertura)
- [Build de produção](#build-de-produção)
- [Decisões técnicas](#decisões-técnicas)
- [Documentação complementar](#documentação-complementar)
- [Solução de problemas](#solução-de-problemas)

---

## Visão geral

O projeto foi estruturado como um **Nx Monorepo**, separando a aplicação principal das bibliotecas responsáveis pela feature de usuários e pelo acesso a dados.

Principais objetivos da solução:

- manter responsabilidades bem delimitadas;
- reduzir acoplamento entre interface, estado e infraestrutura;
- utilizar componentes standalone;
- aplicar carregamento lazy da feature;
- evitar memory leaks em fluxos reativos;
- oferecer feedback visual para loading, erro e sucesso;
- facilitar testes, manutenção e evolução do código.

---

## Funcionalidades

### Listagem de usuários

- Exibição de usuários em cards;
- Nome, e-mail, telefone e demais informações relevantes;
- Ação para editar um usuário;
- Paginação da listagem;
- Opções de quantidade por página: `2`, `6`, `12` e `24`;
- Estado de loading durante o carregamento;
- Mensagem de erro e ação para tentar novamente.

### Pesquisa

- Filtro por nome;
- Debounce de `300 ms`;
- Prevenção de pesquisas repetidas com o mesmo valor;
- Pesquisa sem diferenciação entre letras maiúsculas, minúsculas e acentos;
- Retorno automático para a primeira página ao alterar o filtro.

### Cadastro e edição

- Cadastro realizado em modal;
- Edição com preenchimento automático dos dados;
- Campos:
  - nome;
  - e-mail;
  - CPF;
  - telefone;
  - tipo de telefone;
- Tipos de telefone:
  - celular;
  - residencial;
  - comercial;
- Máscaras para CPF e telefone;
- Validações obrigatórias e de formato;
- Feedback de sucesso por snackbar;
- Prevenção de múltiplos salvamentos concorrentes.

### Qualidade e performance

- Componentes standalone;
- `ChangeDetectionStrategy.OnPush`;
- Angular Signals;
- NgRx Signal Store;
- Lazy loading da feature de usuários;
- Gerenciamento seguro de subscriptions;
- Testes com Vitest;
- ESLint e Prettier.

---

## Stack tecnológica

| Tecnologia | Versão utilizada | Finalidade |
|---|---:|---|
| Angular | `21.2.x` | Framework principal |
| Angular Material | `21.2.x` | Componentes e experiência visual |
| Nx | `22.7.7` | Monorepo, execução de tarefas e cache |
| NgRx Signals | `21.1.x` | Gerenciamento de estado |
| RxJS | `7.8.x` | Fluxos assíncronos e reatividade |
| TypeScript | `5.9.x` | Tipagem estática |
| Vitest | `4.1.x` | Testes unitários e cobertura |
| JSON Server | `1.0.0-beta` | API REST mockada |
| ngx-mask | `21.1.x` | Máscaras de CPF e telefone |
| SCSS | — | Estilização |

---

## Arquitetura do workspace

```text
desafio-tecnico-attus/
├── apps/
│   └── users-app/
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.config.ts
│       │   │   ├── app.routes.ts
│       │   │   └── ...
│       │   ├── main.ts
│       │   └── styles.scss
│       └── project.json
│
├── libs/
│   └── users/
│       ├── data-access-users/
│       │   └── src/lib/
│       │       ├── models/
│       │       ├── services/
│       │       └── stores/
│       │
│       └── feature-users/
│           └── src/lib/
│               ├── user-card/
│               ├── user-form-dialog/
│               ├── users-page/
│               ├── validators/
│               └── users.routes.ts
│
├── docs/
│   ├── angular.md
│   ├── challenge.md
│   ├── state-management.md
│   ├── typescript.md
│   └── solutions/
│
├── db.json
├── nx.json
├── package.json
├── package-lock.json
├── tsconfig.base.json
└── vitest.workspace.ts
```

### Responsabilidades

#### `apps/users-app`

Shell da aplicação Angular.

Responsável por:

- bootstrap da aplicação;
- configuração global de providers;
- configuração do `HttpClient`;
- configuração do Angular Router;
- configuração do `ngx-mask`;
- carregamento lazy da feature de usuários.

#### `libs/users/feature-users`

Camada de apresentação e interação.

Contém:

- página de listagem;
- card de usuário;
- modal de cadastro e edição;
- validações específicas de CPF e telefone;
- integração da interface com o store.

#### `libs/users/data-access-users`

Camada de estado e acesso a dados.

Contém:

- contratos e modelos;
- serviço HTTP;
- URL da API por `InjectionToken`;
- NgRx Signal Store;
- regras de loading, erro, filtro, paginação e salvamento.

---

## Pré-requisitos

Antes de iniciar, instale:

- [Git](https://git-scm.com/);
- [Node.js](https://nodejs.org/);
- npm, disponibilizado junto com o Node.js.

O projeto utiliza Angular `21.2.x`. As versões oficialmente compatíveis de Node.js são:

- `20.19.0` ou superior dentro da linha 20;
- `22.12.0` ou superior dentro da linha 22;
- `24.0.0` ou superior dentro da linha 24.

Para maior previsibilidade, recomenda-se utilizar uma versão LTS compatível.

Consulte também a [matriz oficial de compatibilidade do Angular](https://angular.dev/reference/versions).

### Conferindo as versões instaladas

```bash
node --version
npm --version
git --version
```

Não é necessário instalar Angular CLI ou Nx globalmente. O projeto utiliza as dependências locais por meio dos scripts npm.

---

## Executando o projeto do zero

### 1. Clonar o repositório

```bash
git clone https://github.com/mikaelbotassi/desafio-tecnico-attus.git
```

### 2. Entrar na pasta do projeto

```bash
cd desafio-tecnico-attus
```

### 3. Instalar as dependências

Como o repositório possui `package-lock.json`, utilize preferencialmente:

```bash
npm ci
```

O `npm ci` instala exatamente as versões registradas no lockfile, proporcionando uma execução mais reproduzível.

Para uma instalação convencional, também é possível utilizar:

```bash
npm install
```

### 4. Iniciar a API mockada

Abra um terminal na raiz do projeto e execute:

```bash
npm run api
```

A API será iniciada em:

```text
http://localhost:3000
```

O recurso de usuários estará disponível em:

```text
http://localhost:3000/users
```

Mantenha esse terminal aberto.

### 5. Iniciar a aplicação Angular

Abra um **segundo terminal**, também na raiz do projeto, e execute:

```bash
npm start
```

A aplicação será disponibilizada, por padrão, em:

```text
http://localhost:4200
```

A rota inicial redireciona automaticamente para:

```text
http://localhost:4200/users
```

### Execução resumida

Terminal 1:

```bash
npm run api
```

Terminal 2:

```bash
npm start
```

Depois, acesse:

```text
http://localhost:4200
```

> A aplicação e a API precisam estar em execução simultaneamente.

---

## Validando a execução

Após iniciar os dois processos, realize este checklist:

1. Acesse `http://localhost:3000/users` e confirme que o navegador exibe um array JSON.
2. Acesse `http://localhost:4200`.
3. Confirme que a listagem apresenta os usuários cadastrados no `db.json`.
4. Digite parte de um nome no campo de pesquisa.
5. Cadastre um novo usuário pelo botão de inclusão.
6. Edite um usuário existente.
7. Atualize a página e confirme que os dados permanecem disponíveis.

Também é possível validar a API pelo terminal:

```bash
curl http://localhost:3000/users
```

---

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia a aplicação Angular em desenvolvimento |
| `npm run api` | Inicia o JSON Server na porta `3000` |
| `npm run build` | Gera o build de produção |
| `npm run lint` | Executa o ESLint nos projetos do workspace |
| `npm test` | Executa os testes do workspace |
| `npm run test:coverage` | Executa os testes e gera a cobertura |
| `npm run graph` | Abre o grafo de dependências do Nx |

### Comandos Nx úteis

Exibir as configurações do projeto principal:

```bash
npx nx show project users-app
```

Executar somente os testes da camada de acesso a dados:

```bash
npx nx test data-access-users
```

Executar somente os testes da feature:

```bash
npx nx test feature-users
```

Limpar o cache e reinicializar o daemon do Nx:

```bash
npx nx reset
```

---

## API mockada

A API é fornecida pelo JSON Server e utiliza o arquivo `db.json` como base de dados.

### URL base

```text
http://localhost:3000/users
```

### Endpoints utilizados

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/users` | Lista todos os usuários |
| `POST` | `/users` | Cadastra um usuário |
| `PATCH` | `/users/:id` | Atualiza parcialmente um usuário |

### Estrutura de usuário

```json
{
  "id": "1",
  "name": "Giana Sandrini",
  "email": "giana@attus.com.br",
  "cpf": "22321353066",
  "phone": "27999999999",
  "phoneType": "MOBILE"
}
```

### Valores aceitos para `phoneType`

```text
MOBILE
HOME
WORK
```

### Exemplo de cadastro via cURL

```bash
curl --request POST \
  --url http://localhost:3000/users \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Novo Usuário",
    "email": "novo.usuario@exemplo.com",
    "cpf": "52998224725",
    "phone": "27999999999",
    "phoneType": "MOBILE"
  }'
```

### Exemplo de edição via cURL

```bash
curl --request PATCH \
  --url http://localhost:3000/users/1 \
  --header "Content-Type: application/json" \
  --data '{
    "name": "Giana Sandrini Atualizada"
  }'
```

> As alterações realizadas pela interface ou diretamente pela API são refletidas no arquivo `db.json`.

---

## Testes e cobertura

O workspace utiliza **Vitest** para testes unitários.

### Executar todos os testes

```bash
npm test
```

### Executar com cobertura

```bash
npm run test:coverage
```

### Executar uma biblioteca específica

```bash
npx nx test data-access-users
```

```bash
npx nx test feature-users
```

Os testes cobrem principalmente:

- serviço HTTP;
- NgRx Signal Store;
- validações de CPF e telefone;
- modal de cadastro e edição;
- regras de estado e transformação de dados.

---

## Build de produção

### Gerar o build

```bash
npm run build
```

Os arquivos serão gerados em:

```text
dist/apps/users-app/browser
```

### Servir o build localmente

Após gerar o build:

```bash
npx nx serve-static users-app
```

O terminal informará a URL utilizada pelo servidor estático.

---

## Decisões técnicas

### Nx Monorepo

O Nx foi utilizado para organizar a solução em projetos independentes, oferecendo:

- separação de responsabilidades;
- cache de tarefas;
- execução seletiva de testes e lint;
- visualização do grafo de dependências;
- estrutura preparada para crescimento.

### Componentes standalone

A solução utiliza componentes standalone, reduzindo boilerplate de módulos e tornando as dependências dos componentes mais explícitas.

### Lazy loading

A feature de usuários é carregada de forma lazy pela rota `/users`, reduzindo o acoplamento do shell com a implementação da funcionalidade.

### Change Detection OnPush

Os componentes utilizam `ChangeDetectionStrategy.OnPush`, evitando ciclos de detecção desnecessários e melhorando a previsibilidade das atualizações de interface.

### NgRx Signal Store

O estado é centralizado em um Signal Store que controla:

- usuários;
- loading;
- salvamento;
- erros;
- feedback;
- termo pesquisado;
- página atual;
- tamanho da página.

Também são expostos estados derivados para:

- usuários filtrados;
- usuários paginados;
- total de usuários;
- total de resultados filtrados.

### RxJS

Operadores utilizados em fluxos reais:

- `debounceTime`;
- `distinctUntilChanged`;
- `switchMap`;
- `exhaustMap`;
- `catchError`;
- `filter`;
- `startWith`;
- `tap`.

### Prevenção de memory leaks

Subscriptions imperativas são vinculadas ao ciclo de vida do componente com `takeUntilDestroyed`.

### Acesso à API por InjectionToken

A URL da API foi encapsulada no token `USERS_API_URL`, permitindo substituir facilmente o endpoint em testes ou em uma configuração futura de ambiente.

---

## Documentação complementar

O diretório `docs` contém a documentação das demais etapas do desafio:

- [Desafio prático](docs/challenge.md)
- [TypeScript e qualidade de código](docs/typescript.md)
- [Angular, fundamentos e reatividade](docs/angular.md)
- [Gerenciamento de estado](docs/state-management.md)
- [Soluções complementares](docs/solutions)

---

## Solução de problemas

### A aplicação exibe erro de conexão com a API

Mensagem esperada em caso de indisponibilidade:

```text
Não foi possível conectar à API. Confirme se o JSON Server está em execução.
```

Confirme se este comando está ativo em outro terminal:

```bash
npm run api
```

Depois, teste:

```text
http://localhost:3000/users
```

### A porta 3000 já está em uso

A aplicação está configurada para consumir a API em `http://localhost:3000/users`.

Encerre o processo que está utilizando a porta `3000` antes de iniciar o JSON Server.

No Windows:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

No Linux ou macOS:

```bash
lsof -i :3000
kill -9 <PID>
```

### A porta 4200 já está em uso

Inicie a aplicação em outra porta:

```bash
npm start -- --port 4201
```

Depois, acesse:

```text
http://localhost:4201
```

### Erro de versão do Node.js

Confira a versão:

```bash
node --version
```

Utilizando NVM:

```bash
nvm install 20.19.0
nvm use 20.19.0
```

### Instalação inconsistente de dependências

Remova a pasta `node_modules` e execute novamente:

```bash
npm ci
```

No caso de problemas relacionados ao cache do Nx:

```bash
npx nx reset
```

### A listagem não reflete os dados esperados

Confira diretamente o conteúdo da API:

```text
http://localhost:3000/users
```

Caso necessário, restaure os dados originais do arquivo `db.json` pelo Git:

```bash
git restore db.json
```

---

## Repositório

Código-fonte:

[github.com/mikaelbotassi/desafio-tecnico-attus](https://github.com/mikaelbotassi/desafio-tecnico-attus)

---

Desenvolvido como solução para o desafio técnico Front-End Angular da Attus.
