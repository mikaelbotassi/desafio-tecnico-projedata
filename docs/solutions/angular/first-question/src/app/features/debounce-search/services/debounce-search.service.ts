import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Pessoa {
  id: number;
  name: string;
}

@Injectable()
export class DebounceSearchService {

  private readonly data: Pessoa[] = [
    { id: 1, name: 'Igor' },
    { id: 2, name: 'Maria' },
    { id: 3, name: 'João' },
    { id: 4, name: 'Ana' },
  ];

  getSmartSearchValues(search: string): Observable<Pessoa[]> {

    const filteredData = this.data.filter((pessoa) =>
      pessoa.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return of(filteredData).pipe(
      delay(500)
    );
  }

}