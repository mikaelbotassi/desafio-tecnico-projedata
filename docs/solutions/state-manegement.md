## 3.1. Angular Signals — Estado local

A implementação abaixo utiliza exclusivamente **Angular Signals** para controlar o estado do carrinho.

Foi criado um `signal` para armazenar a lista de itens, um `computed` para calcular automaticamente o valor total do carrinho considerando **quantidade × preço**, métodos para adicionar e remover itens e um `output()` que emite sempre que o valor total sofrer alguma alteração.

### Componente - ContadorItemsCarrinho

```typescript
import { 
  Component, 
  computed, 
  effect, 
  output, 
  signal 
} from '@angular/core';


interface ItemCarrinho {
  id: number;
  descricao: string;
  quantidade: number;
  preco: number;
}


@Component({
  selector: 'app-contador-items-carrinho',
  standalone: true,
  template: `
    <h2>Itens do Carrinho</h2>

    <p>
      Total:
      {{ total() }}
    </p>


    @for(item of listaItens(); track item.id) {

      <div>
        {{ item.descricao }}
        -
        Quantidade: {{ item.quantidade }}
        -
        Preço: {{ item.preco }}

        <button 
          (click)="removeItem(item.id)">
          Remover
        </button>

      </div>

    }


    <button 
      (click)="addItem({
        id: 1,
        descricao: 'Produto',
        quantidade: 1,
        preco: 10
      })">
      Adicionar item
    </button>

  `
})
export class ContadorItemsCarrinho {


  // Signal responsável pelo estado da lista de itens
  listaItens = signal<ItemCarrinho[]>([]);


  // Calcula automaticamente o valor total do carrinho
  total = computed(() =>
    this.listaItens()
      .reduce(
        (acc, item) => 
          acc + (item.quantidade * item.preco),
        0
      )
  );


  // Evento emitido sempre que o total mudar
  onTotalChange = output<number>();


  constructor() {

    effect(() => {
      this.onTotalChange.emit(
        this.total()
      );
    });

  }


  addItem(item: ItemCarrinho): void {

    this.listaItens.update(itens => {

      const existente = itens.find(
        i => i.id === item.id
      );


      if (existente) {

        existente.quantidade += item.quantidade;

        return [...itens];

      }


      return [
        ...itens,
        item
      ];

    });

  }


  removeItem(itemId: number): void {

    this.listaItens.update(itens => {

      const item = itens.find(
        i => i.id === itemId
      );


      if (!item) {
        return itens;
      }


      item.quantidade--;


      if (item.quantidade <= 0) {

        return itens.filter(
          i => i.id !== itemId
        );

      }


      return [...itens];

    });

  }

}