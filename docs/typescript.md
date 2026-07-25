# 1. TypeScript e Qualidade de Código

## 1.1 Refatoração

Considerando seus conhecimentos de TypeScript, qualidade de código e boas práticas, quais melhorias você faria no seguinte código?

```ts
class Produto {
  id: any;
  descricao: any;
  quantidadeEstoque: any;

  constructor(id: any, descricao: any, quantidadeEstoque: any) {
    this.id = id;
    this.descricao = descricao;
    this.quantidadeEstoque = quantidadeEstoque;
  }
}

class Verdureira {
  produtos: any;

  constructor() {
    this.produtos = [
      new Produto(1, 'Maçã', 20),
      new Produto(2, 'Laranja', 0),
      new Produto(3, 'Limão', 20)
    ];
  }

  getDescricaoProduto(produtoId: any) {
    let produto;

    for (let index = 0; index < this.produtos.length; index++) {
      if (this.produtos[index].id == produtoId) {
        produto = this.produtos[index];
      }
    }

    return (
      produto.id +
      ' - ' +
      produto.descricao +
      ' (' +
      produto.quantidadeEstoque +
      'x)'
    );
  }

  hasEstoqueProduto(produtoId: any) {
    let produto;

    for (let index = 0; index < this.produtos.length; index++) {
      if (this.produtos[index].id == produtoId) {
        produto = this.produtos[index];
      }
    }

    if (produto.quantidadeEstoque > 0) {
      return true;
    } else {
      return false;
    }
  }
}
```

---

## 1.2 Generics e Tipos Utilitários

Implemente uma função genérica `filtrarEPaginar<T>` que recebe um array, um predicado de filtro e parâmetros de paginação (página e tamanho).

A função deve retornar os itens da página atual e o total de registros filtrados.

Utilize tipagem completa, **sem `any`**.

### Assinatura esperada

```ts
filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T>
```

Demonstre o uso com um exemplo concreto (por exemplo: array de usuários com filtro por nome).