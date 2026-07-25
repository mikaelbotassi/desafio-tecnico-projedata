/** Questão 1.1 */
class Produto {
  constructor(
    public readonly id: number,
    public readonly descricao: string,
    public quantidadeEstoque: number
  ) {}
}

class Verdureira {
  produtos: Produto[] = [
    new Produto(1, 'Maçã', 20),
    new Produto(2, 'Laranja', 0),
    new Produto(3, 'Limão', 20)
  ];

  getDescricaoProduto(produtoId: number): string {
    const produto = this.produtos.find((p) => p.id === produtoId);

    return produto
      ? `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`
      : 'Produto não encontrado';
  }

  hasEstoqueProduto(produtoId: number): boolean {
    const produto = this.produtos.find((p) => p.id === produtoId);
    if(!produto) return false;
    return produto.quantidadeEstoque > 0;
  }
}

/*
 ## 1.2 Generics e Tipos Utilitários

Implemente uma função genérica `filtrarEPaginar<T>` que recebe um array, um predicado de filtro e parâmetros de paginação (página e tamanho).

A função deve retornar os itens da página atual e o total de registros filtrados.

Utilize tipagem completa, **sem `any`**.
*/

class PaginaParams{
  constructor(
    public readonly pagina: number,
    public readonly tamanho: number
  ) {}
}

class Pagina<T>{
  constructor(
    public readonly itens: T[],
    public readonly totalRegistros: number
  ) {}
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T>{
  const dados = data.filter(filterFn);
  const inicio = (params.pagina - 1) * params.tamanho;
  const fim = inicio + params.tamanho;
  const paginatedItems = dados.slice(inicio, fim);
  return new Pagina(paginatedItems, dados.length);
}