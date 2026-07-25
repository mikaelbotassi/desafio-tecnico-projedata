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