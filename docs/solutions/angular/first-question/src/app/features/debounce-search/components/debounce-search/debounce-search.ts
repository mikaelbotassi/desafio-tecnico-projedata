import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { DebounceSearchService } from '../../services/debounce-search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-debounce-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './debounce-search.html'
})
export class DebounceSearch {

  private readonly service = inject(DebounceSearchService);
  readonly searchControl = new FormControl('');

  readonly pessoas$ = this.service.pessoas$;


  readonly loading$ = this.service.loading$;


  readonly error$ = this.service.error$;

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(value => {
          if (!value) this.service.reset();
        }),
        filter(value => !!value),
        switchMap(value => this.service.search(value!)),
        takeUntilDestroyed()
      )
      .subscribe(result => {
        this.service.updateResult(result);
      });
  }

}