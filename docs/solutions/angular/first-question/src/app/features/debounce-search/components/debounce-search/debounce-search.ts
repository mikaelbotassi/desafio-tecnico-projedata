// 2.3. RxJS — busca com debounce
// Implemente um campo de busca reativo em um componente Angular que:
// Aguarde 500 ms após o usuário parar de digitar antes de disparar a requisição (debounce)
// Cancele a requisição anterior caso o usuário digite novamente (evite race condition)
// Exiba um indicador de loading enquanto a requisição está em andamento
// Gerencie a subscription sem memory leak

import { Component } from '@angular/core';

@Component({
  selector: 'app-debounce-search',
  imports: [],
  templateUrl: './debounce-search.html',
  styleUrl: './debounce-search.scss',
})
export class DebounceSearch {}
