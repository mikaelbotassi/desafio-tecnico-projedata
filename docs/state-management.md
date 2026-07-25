# 3. Gerenciamento de Estado

## 3.1 Angular Signals — Estado Local

Crie um componente de contador de itens no carrinho utilizando exclusivamente **Signals**.

O componente deve possuir:

- Um `signal` para a lista de itens;
- Um `computed` para calcular o total (`quantidade × preço`);
- Métodos para adicionar e remover itens;
- Um `output()` emitindo sempre que o total mudar.

---

## 3.2 Gerenciamento de Estado com NgRx (Feature To-do)

Implemente a estrutura de estado para uma lista de tarefas utilizando os padrões recomendados do NgRx.

### Actions

Definir ações para:

- `loadTodos`
- `loadTodosSuccess`
- `loadTodosError`
- `toggleTodoComplete`

### Reducer

Implementar:

- Estado inicial;
- Transições utilizando `createReducer`;
- Tipagem forte do estado.

### Selectors

Criar seletores utilizando `createSelector`.

- `selectAllTodos`
- `selectPendingTodos`

### Effects

Criar um Effect que:

- Escute `loadTodos`;
- Faça uma chamada HTTP (mockada);
- Dispare sucesso ou erro conforme o resultado.

> Não é necessário implementar o back-end. Utilize `HttpClient` com uma URL fictícia.