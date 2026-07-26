/*
3.1. Angular Signals — estado local
Crie um componente de contador de itens no carrinho usando exclusivamente Signals. O componente deve expor:
Um signal para a lista de itens
Um computed para o total (quantidade × preço)
Um método para adicionar e remover itens
Um output() que emite sempre que o total mudar
*/
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, output, signal } from '@angular/core';

@Component({
  selector: 'app-contador-items-carrinho',
  imports: [DecimalPipe, CurrencyPipe, CommonModule],
  template: `
  <section class="contador-carrinho p-5">
	<h2>Itens do Carrinho</h2>

	<div class="total">Total: <strong>{{ total() | number:'1.2-2' }}</strong></div>

	<div class="controls">
		<div class="input-group">
            <span class="input-group-text">ID</span>
            <input #id type="number" class="form-control" />
            <span class="input-group-text">Descrição</span>
            <input #desc type="text" class="form-control" />
            <span class="input-group-text">Quantidade</span>
            <input #qty type="number" value="1" class="form-control" />
            <span class="input-group-text">Preço</span>
            <input #price type="number" step="0.01" value="0" class="form-control" />
        </div>
		<div class="btn-group my-2">
            <button class="btn btn-sm btn-primary" (click)="addItem({ id: id.valueAsNumber || 0, descricao: desc.value || 'Item', quantidade: +qty.value || 1, preco: +price.value || 0 })">Adicionar</button>
            <button class="btn btn-sm btn-secondary" (click)="listaItens.set([])">Limpar</button>
        </div>
	</div>

    @if(listaItens().length){
        <ul class="list-group">
            @for(item of listaItens(); track item.id) {
                <li class="list-group-item">
                    <div class="item-row">
                        <div class="info">
                            <strong>{{ item.descricao }}</strong>
                            <div class="meta">Quantidade: {{ item.quantidade }} — Preço: {{ item.preco | currency:'BRL' }}</div>
                        </div>
                        <div class="actions">
                            <button class="btn btn-sm btn-danger" (click)="removeItem(item.id)">Remover</button>
                        </div>
                    </div>
                </li>
            }
        </ul>
    }@else{
        <p>O carrinho está vazio.</p>
    }
</section>
`,
})
export class ContadorItemsCarrinho {

  listaItens = signal<ItemCarrinho[]>([]);
  total = computed(() => this.listaItens().reduce((acc, item) =>
    acc + (item.quantidade * item.preco), 0));
  onTotalChange = output<number>();

  constructor() {
    effect(() => {
      this.onTotalChange.emit(this.total());
    });
  }

  addItem(item: ItemCarrinho): void {
    this.listaItens.update(itens => {
      const index = itens.findIndex(i => i.id === item.id);
      if (index !== -1) {
        itens[index].quantidade += item.quantidade;
        return [...itens];
      }
      return [...itens, item];
    });
  }

  removeItem(itemId: number): void {
    this.listaItens.update(itens => {
      const index = itens.findIndex(i => i.id === itemId);
      if (index !== -1) {
        itens[index].quantidade -= 1;
        if (itens[index].quantidade <= 0) {
          return itens.filter(i => i.id !== itemId);
        }
        return [...itens];
      }
      return itens;
    });
  }

}

class ItemCarrinho {
  id: number;
  descricao: string;
  quantidade: number;
  preco: number;

  constructor(id: number, descricao: string, quantidade: number, preco: number) {
    this.id = id;
    this.descricao = descricao;
    this.quantidade = quantidade;
    this.preco = preco;
  }
}
