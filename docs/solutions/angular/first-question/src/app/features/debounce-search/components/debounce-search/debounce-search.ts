// 2.3. RxJS — busca com debounce
// Implemente um campo de busca reativo em um componente Angular que:
// Aguarde 500 ms após o usuário parar de digitar antes de disparar a requisição (debounce)
// Cancele a requisição anterior caso o usuário digite novamente (evite race condition)
// Exiba um indicador de loading enquanto a requisição está em andamento
// Gerencie a subscription sem memory leak

import { Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { DebounceSearchService } from '../../services/debounce-search.service';

@Component({
  selector: 'app-debounce-search',
  imports: [],
  templateUrl: './debounce-search.html',
  styleUrl: './debounce-search.scss',
})
export class DebounceSearch {

  searchControl = new FormControl('');
  subscription?: Subscription;
  service = inject(DebounceSearchService);

ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).;
  }

}
